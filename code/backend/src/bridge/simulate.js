/*
Stands in for the Raspberry Pi when the hardware is not connected.

Two modes, usable together:

  --backfill <hours>   Write past readings straight into Mongo so the charts
                       have a curve to draw the moment the page opens.
  --live               Publish new readings over MQTT on an interval, so the
                       broker and bridge are genuinely exercised.

Backfill has to write to Mongo directly. Mongoose stamps createdAt at insert
time, so readings published over MQTT are always "now" and could never form a
history.

Examples:
  npm run simulate -- --all --backfill 6
  npm run simulate -- --all --live
  npm run simulate -- --backfill 6 --live --interval 2
  npm run simulate -- --hive <id> --live
*/

import mqtt from "mqtt";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { BeehiveMetrics } from "../models/beehiveMetricsModel.js";
import { Beehive } from "../models/beehiveModel.js";

dotenv.config();

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const i = args.indexOf(name);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};
const hasFlag = (name) => args.includes(name);

const BACKFILL_HOURS = Number(getArg("--backfill", 0));
const INTERVAL_SECONDS = Number(getArg("--interval", 2));
const LIVE = hasFlag("--live");
const ALL_HIVES = hasFlag("--all");
const RESET = hasFlag("--reset");
const BROKER_URL = process.env.MQTT_BROKER_URL || "mqtt://localhost:1883";
const TOPIC = process.env.MQTT_TOPIC || "beehive/metrics";

// Aim for roughly this many backfilled points per hive whatever the window, so
// a 24 hour history stays under the API's 2000-point cap and still charts
// smoothly. A short window falls back to one reading every 30s.
const BACKFILL_TARGET_POINTS = 900;
const MIN_BACKFILL_STEP_MS = 30 * 1000;

/*
Each hive gets a fixed personality so the dashboard cards do not all show the
same numbers. Batteries are staggered too: the last hive sits under the 20%
warning threshold so the notification path has something to fire on.

Note the bridge's cooldown is keyed on user and notification type, not on hive,
so only one low-battery notification appears per hour even if several hives are
flat. That behaviour is inherited from the original Lambda.
*/
const PROFILES = [
  { tempOffset: 0.0, humidityOffset: 0, co2Offset: 0, weightBase: 18.4, battery: 96 },
  { tempOffset: 0.7, humidityOffset: -3, co2Offset: 18, weightBase: 22.1, battery: 78 },
  { tempOffset: -0.8, humidityOffset: 4, co2Offset: -12, weightBase: 15.7, battery: 64 },
  { tempOffset: 0.4, humidityOffset: -5, co2Offset: 26, weightBase: 25.3, battery: 47 },
  { tempOffset: -0.5, humidityOffset: 2, co2Offset: -8, weightBase: 12.9, battery: 33 },
  { tempOffset: 0.2, humidityOffset: 5, co2Offset: 9, weightBase: 20.6, battery: 14 },
];

/*
Ambient conditions for Kandy. At roughly 500 m in the central highlands it runs
a few degrees cooler than the coast: the daily minimum sits near 20.5 C shortly
before dawn and the maximum near 29.5 C in the early afternoon, with relative
humidity moving inversely, from about 90% at dawn down to 65% mid-afternoon.

CO2 follows the same clock for a different reason. Background is a little over
420 ppm; it falls during the day as the surrounding vegetation photosynthesises
and rises overnight when respiration continues under a shallow, still boundary
layer. Ambient is the right target here rather than brood-nest air, which would
read in the thousands: the MQ-135 curve in the Pi script is calibrated around
440 ppm, so this is what the hardware actually reports.
*/
const KANDY = {
  tempMean: 25.0, // daily min near 20.5 C, max near 29.5 C
  tempSwing: 4.5,
  dewPointMean: 20.2, // drives relative humidity, roughly 90% dawn to 65% mid-afternoon
  co2Mean: 440,
  co2Swing: 35,
  peakHour: 14, // warmest part of the afternoon
};

const DAY_MS = 24 * 3600 * 1000;

// Kandy is close enough to the equator that day length barely moves across the
// year, so fixed sunrise and sunset are accurate to within a few minutes.
const SUNRISE = 6.0;
const SUNSET = 18.25;

/*
Deterministic value noise. Hashing the time bucket means a given instant always
produces the same wobble, so a backfilled history and the live feed that
continues it agree at the seam. Interpolating between buckets makes the trace
drift the way a real sensor does rather than jitter like white noise, which is
what independent Math.random() per sample looks like on a chart.
*/
function hash01(n) {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

function smoothNoise(tMs, periodMs, salt = 0) {
  const p = tMs / periodMs + salt * 1000;
  const i = Math.floor(p);
  const f = p - i;
  const s = f * f * (3 - 2 * f); // smoothstep, so the joins are not visible
  return (hash01(i) * (1 - s) + hash01(i + 1) * s) * 2 - 1;
}

// One stable value per calendar day, for things that should differ day to day
// but stay fixed within a day.
function dayValue(tMs, salt) {
  return hash01(Math.floor(tMs / DAY_MS) * 7.13 + salt);
}

/*
Real diurnal temperature is not a sine wave. It climbs quickly after sunrise,
rounds off at a mid-afternoon peak, then decays slowly overnight as the surface
radiates heat away, reaching its minimum just before dawn. Modelling the two
halves separately is what makes the chart read as weather rather than as maths.
*/
function diurnalTemperature(hour, tMin, tMax, peakHour) {
  if (hour >= SUNRISE && hour <= peakHour) {
    const frac = (hour - SUNRISE) / (peakHour - SUNRISE);
    return tMin + (tMax - tMin) * Math.sin((frac * Math.PI) / 2);
  }
  const sincePeak = (hour - peakHour + 24) % 24;
  const nightLength = 24 - peakHour + SUNRISE;
  return tMin + (tMax - tMin) * Math.exp((-2.6 * sincePeak) / nightLength);
}

// Magnus formula, in hPa.
const saturationVapourPressure = (celsius) =>
  6.112 * Math.exp((17.67 * celsius) / (celsius + 243.5));

// Anchors the slow upward weight trend so backfill and live mode sit on one
// continuous line instead of resetting at each day boundary.
const WEIGHT_REFERENCE_MS = Date.now();
const DAILY_WEIGHT_GAIN_KG = 0.15;

/*
`t` is a Date, so past and present readings come off the same model.

Humidity is derived from the temperature via the dew point rather than being
drawn independently. That is how the real quantity behaves: absolute moisture
changes slowly through the day, so as the air warms the same water vapour makes
up a smaller fraction of saturation and relative humidity falls. It also means
humidity and temperature stay correctly anti-correlated for free, and a shower
raises one while dropping the other without any special casing.
*/
function readingAt(t, batteryLevel, profile) {
  const tMs = t.getTime();
  const hour = t.getHours() + t.getMinutes() / 60;
  const month = t.getMonth();

  // Warmest around April, coolest through the December monsoon.
  const seasonal = Math.cos(((month - 3) / 12) * 2 * Math.PI);

  // No two days are alike: shift the day's extremes a little, and let a slow
  // multi-hour drift stand in for passing weather systems.
  const drift = smoothNoise(tMs, 5 * 3600 * 1000, 1) * 0.9;
  const tMin =
    KANDY.tempMean - KANDY.tempSwing + seasonal * 0.8 + (dayValue(tMs, 1) - 0.5) * 1.6;
  const tMax =
    KANDY.tempMean + KANDY.tempSwing + seasonal * 1.4 + (dayValue(tMs, 2) - 0.5) * 2.2;

  // Kandy gets convective showers on many afternoons. When one lands the
  // temperature drops sharply and the air saturates.
  const showerToday = dayValue(tMs, 3) < 0.45;
  const showerStart = 13.5 + dayValue(tMs, 4) * 3.5;
  const showerHours = 0.8 + dayValue(tMs, 5) * 0.9;
  const inShower =
    showerToday && hour >= showerStart && hour <= showerStart + showerHours;
  // Ramp in and out so the edges are not a vertical step.
  const showerIntensity = inShower
    ? Math.sin(((hour - showerStart) / showerHours) * Math.PI)
    : 0;

  const baseTemperature = diurnalTemperature(hour, tMin, tMax, KANDY.peakHour);

  // Where we are in the day's swing, taken from the clean curve rather than the
  // noisy reading so humidity and CO2 do not inherit the temperature's jitter.
  const warmth = Math.max(
    0,
    Math.min(1, (baseTemperature - tMin) / Math.max(tMax - tMin, 0.1))
  );

  const temperature =
    baseTemperature +
    profile.tempOffset +
    drift -
    showerIntensity * 3.2 +
    smoothNoise(tMs, 20 * 60 * 1000, 2) * 0.25;

  /*
  Dew point drifts slowly, but it is not flat across the day: vegetation
  transpires once the sun is up, which adds moisture, while overnight some of it
  condenses back out as dew. That daytime rise is what keeps afternoon humidity
  in the sixties here instead of the fifties a constant dew point would give.
  */
  const dewPoint =
    KANDY.dewPointMean +
    (warmth - 0.5) * 1.4 +
    seasonal * -0.6 +
    (dayValue(tMs, 6) - 0.5) * 1.6 +
    smoothNoise(tMs, 4 * 3600 * 1000, 3) * 0.5 +
    showerIntensity * 1.6 +
    profile.humidityOffset * 0.12;

  /*
  Air cannot hold more moisture than saturation. On a clear night the ground
  radiates heat away until the temperature reaches the dew point, and from then
  on the excess condenses out as dew or mist, pulling the dew point down with
  the temperature. Without this the dew point overshoots and humidity sits
  pinned at the cap for hours, which is the one part of an overnight trace that
  looks obviously synthetic. Varying the gap keeps a misty night in the high
  nineties without flatlining.
  */
  const saturationGap =
    0.25 + (smoothNoise(tMs, 45 * 60 * 1000, 7) + 1) * 0.35;
  const effectiveDewPoint = Math.min(dewPoint, temperature - saturationGap);

  const humidity =
    100 *
    (saturationVapourPressure(effectiveDewPoint) /
      saturationVapourPressure(temperature));

  /*
  CO2 tracks the same clock for a different reason: surrounding vegetation draws
  it down while the sun is up, and it accumulates overnight when respiration
  continues under a shallow, still boundary layer. Tying it to the normalised
  temperature curve rather than its own sine keeps the two physically coherent,
  including on cool overcast afternoons when drawdown is weaker.
  */
  const co2 =
    KANDY.co2Mean +
    KANDY.co2Swing -
    2 * KANDY.co2Swing * warmth +
    profile.co2Offset +
    smoothNoise(tMs, 30 * 60 * 1000, 4) * 8;

  /*
  Weight falls through the morning as foragers leave and recovers past its
  starting point by dusk as they return loaded with nectar, on top of a slow
  net gain. Bees do not fly in rain, so a shower flattens the curve.
  */
  const foraging =
    hour > SUNRISE && hour < SUNSET
      ? Math.sin(((hour - SUNRISE) / (SUNSET - SUNRISE)) * Math.PI)
      : 0;
  const trend =
    ((tMs - WEIGHT_REFERENCE_MS) / DAY_MS) * DAILY_WEIGHT_GAIN_KG;
  const weight =
    profile.weightBase +
    trend -
    foraging * 0.3 * (1 - showerIntensity * 0.8) +
    smoothNoise(tMs, 15 * 60 * 1000, 5) * 0.015;

  return {
    Temperature: Number(temperature.toFixed(2)),
    Humidity: Number(Math.max(0, Math.min(100, humidity)).toFixed(2)),
    CO2: Number(Math.max(0, co2).toFixed(1)),
    Weight: Number(Math.max(0, weight).toFixed(3)),
    Battery_level: Number(Math.max(0, Math.min(100, batteryLevel)).toFixed(1)),
  };
}

async function resolveHives() {
  const requested = getArg("--hive", null);
  if (requested) {
    const beehive = await Beehive.findById(requested);
    if (!beehive) throw new Error(`No beehive with id ${requested}`);
    return [{ beehive, profile: PROFILES[0] }];
  }

  const beehives = await Beehive.find().sort({ createdAt: 1 });
  if (beehives.length === 0) {
    throw new Error("No beehive found. Run `npm run seed` first.");
  }

  const selected = ALL_HIVES ? beehives : [beehives[0]];
  return selected.map((beehive, index) => ({
    beehive,
    profile: PROFILES[index % PROFILES.length],
  }));
}

async function backfill(targets, hours) {
  const now = Date.now();
  const windowMs = hours * 3600 * 1000;
  const stepMs = Math.max(
    MIN_BACKFILL_STEP_MS,
    Math.round(windowMs / BACKFILL_TARGET_POINTS)
  );
  const count = Math.floor(windowMs / stepMs);
  if (count === 0) return;

  for (const { beehive, profile } of targets) {
    const docs = [];
    for (let i = count; i > 0; i--) {
      const at = new Date(now - i * stepMs);
      // Drain toward the profile's current level so the history lines up with
      // whatever the card shows once live mode takes over.
      const progress = (count - i) / Math.max(count, 1);
      const battery = profile.battery + (1 - progress) * 8;
      docs.push({
        beehive_id: beehive._id,
        ...readingAt(at, battery, profile),
        createdAt: at,
        updatedAt: at,
      });
    }

    // timestamps:false so our explicit createdAt survives instead of being
    // overwritten with the insert time.
    await BeehiveMetrics.insertMany(docs, { timestamps: false });
    console.log(`Backfilled ${docs.length} readings for "${beehive.name}"`);
  }

  console.log(`Covered the last ${hours} hour(s) for ${targets.length} hive(s).`);
}

function runLive(targets) {
  const client = mqtt.connect(BROKER_URL);
  const batteries = targets.map(({ profile }) => profile.battery);

  client.on("connect", () => {
    console.log(`Simulator connected to ${BROKER_URL}`);
    console.log(
      `Publishing ${targets.length} hive(s) to ${TOPIC} every ` +
        `${INTERVAL_SECONDS}s. Ctrl-C to stop.`
    );

    setInterval(() => {
      targets.forEach(({ beehive, profile }, index) => {
        batteries[index] = Math.max(0, batteries[index] - 0.05);
        const message = {
          beehive_id: beehive._id.toString(),
          ...readingAt(new Date(), batteries[index], profile),
          timestamp: Math.floor(Date.now() / 1000),
        };
        client.publish(TOPIC, JSON.stringify(message), { qos: 1 });
      });
      console.log(`Published a reading for ${targets.length} hive(s)`);
    }, INTERVAL_SECONDS * 1000);
  });

  client.on("error", (error) => {
    console.error("Broker error:", error.message);
    console.error("Is the broker running? `npm run broker`");
  });
}

async function main() {
  await mongoose.connect(process.env.CONNECTION_STRING2);
  const targets = await resolveHives();
  console.log(
    "Simulating:",
    targets.map(({ beehive }) => beehive.name).join(", ")
  );

  if (RESET) {
    // Re-running a backfill over a hive that already has history leaves two
    // overlapping series on the same chart, so offer a clean slate.
    const ids = targets.map(({ beehive }) => beehive._id);
    const { deletedCount } = await BeehiveMetrics.deleteMany({
      beehive_id: { $in: ids },
    });
    console.log(`Reset: removed ${deletedCount} existing readings.`);
  }

  if (BACKFILL_HOURS > 0) {
    await backfill(targets, BACKFILL_HOURS);
  }

  if (LIVE) {
    // Mongo stays connected only because resolveHives needed it; the live path
    // itself talks to the broker and lets the bridge do the writing.
    runLive(targets);
  } else {
    await mongoose.disconnect();
  }
}

main().catch((error) => {
  console.error("Simulator failed:", error.message);
  process.exit(1);
});
