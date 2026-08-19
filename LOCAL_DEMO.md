# Running BeeZee without AWS

The system originally depended on three AWS services. All three are replaced by
local processes, and the React dashboard and Express API are unchanged apart
from one config line.

| Was | Now |
| --- | --- |
| AWS IoT Core (MQTT broker) | Aedes broker, `npm run broker` |
| Lambda (`code/aws-lambda/index.mjs`) | MQTT subscriber, `npm run bridge` |
| Elastic Beanstalk | `npm start` on the laptop |
| Hosted MongoDB | `mongod` from the `beezee` conda env |

Aedes stands in for Mosquitto because conda-forge has no Mosquitto build for
Apple Silicon. It speaks the same MQTT 3.1.1 protocol, so the Pi cannot tell the
difference. If you prefer the real daemon, `brew install mosquitto` works and
you can skip `npm run broker`.

## One-time setup

The `beezee` conda env already contains Node 20, Python 3.11, `paho-mqtt` and
MongoDB 8. It was created with:

```bash
conda create -n beezee -c conda-forge nodejs=20 python=3.11 paho-mqtt -y
conda install -n beezee -c conda-forge mongodb=8.0.23 -y
```

Dependencies are installed in `code/backend` and `code/beehive-dashboard`.
`code/backend/.env` exists; `.env.example` documents every variable.

## Starting the demo

Activate the env in every terminal: `conda activate beezee`.

**1. MongoDB**

```bash
mongod --dbpath "<repo-parent>/mongo-data" --bind_ip 127.0.0.1 --port 27017
```

**2. Seed a user and beehive** (first run only)

```bash
cd code/backend && npm run seed
```

This prints login credentials and a `beehive_id`. Readings are rejected unless
their `beehive_id` matches a real Beehive document, so the Pi must publish this
exact id.

**3. Broker** — `cd code/backend && npm run broker`

**4. Bridge** — `cd code/backend && npm run bridge`

**5. API** — `cd code/backend && npm start`

**6. Dashboard** — `cd code/beehive-dashboard && npm run dev`

## Running without the Pi

`npm run simulate` stands in for the hardware, modelling ambient conditions for
Kandy rather than emitting noise.

| | Range produced | Behaviour |
| --- | --- | --- |
| Temperature | 19–30 °C | Min just before dawn, max early afternoon |
| Humidity | 60–98 % | Inverse of temperature, near saturation at dawn |
| CO2 | 398–483 ppm | Drawn down by day, accumulates overnight |
| Weight | per hive | Dips while foragers are out, net gain each day |

Ambient rather than brood-nest values is the right target: the MQ-135 curve in
the Pi script is calibrated around 440 ppm, and brood air would read in the
thousands.

A few details are what stop the charts looking synthetic:

- **The daily curve is asymmetric.** Temperature climbs quickly after sunrise,
  rounds off at a mid-afternoon peak, then decays slowly overnight. A plain sine
  wave rises and falls at the same rate, which no real day does.
- **Humidity is derived from the dew point, not drawn independently.** Absolute
  moisture changes slowly, so relative humidity falls as the air warms. Once the
  air cools to its dew point the excess condenses out, which is what keeps misty
  nights in the high nineties instead of pinned flat at 100.
- **Noise is autocorrelated.** Values are interpolated between hashed time
  buckets, so the trace wanders like a sensor instead of jittering like static.
  Hashing also means a backfilled history and the live feed continuing it agree
  at the seam.
- **Days differ.** Each day gets its own extremes, and Kandy's afternoon
  convective showers land on roughly half of them, dropping the temperature a
  few degrees while humidity spikes and foraging stops.

```bash
cd code/backend
npm run seed                                     # 6 hives, safe to re-run
npm run simulate -- --all --reset --backfill 24  # a full day of history each
npm run simulate -- --all --live                 # keep them updating
```

Backfill writes to Mongo directly, because Mongoose stamps `createdAt` at insert
time and anything published over MQTT is necessarily "now". Live mode publishes
through the broker, so it exercises the same path the Pi does.

| Flag | Meaning |
| --- | --- |
| `--all` | Every hive, not just the first |
| `--backfill <hours>` | Write that much history |
| `--live` | Keep publishing over MQTT |
| `--reset` | Delete existing readings first |
| `--interval <seconds>` | Publish rate, default 2 |
| `--hive <id>` | Target one specific hive |

`--reset` matters when re-running a backfill: without it the hive ends up with
two overlapping series on the same chart. Backfill spacing adapts to the window
so any length lands near 900 points per hive, under the API's 2000-point cap.

Each hive has a small microclimate offset so the dashboard cards differ, with
batteries staggered from 96% down to 14%. The last one sits under the 20% threshold so the
low-battery notification has something to fire on.

**Known limit, inherited from the Lambda:** the notification cooldown is keyed on
user and notification type, not on hive, so only one low-battery notification
appears per hour no matter how many hives are flat — and it names whichever hive
tripped first. Making it per-hive would need a `beehive_id` on the Notification
schema.

## Pi side

Copy `start2_local_mqtt.py` to the Pi and install the client:

```bash
pip install paho-mqtt
```

Find the laptop's IP on the hotspot (`ipconfig getifaddr en0` on the Mac), put
the seeded id in `credentials_and_beehive_id.txt`, then run:

```bash
BROKER_HOST=192.168.x.x python3 start2_local_mqtt.py
```

Sensor code is identical to `start2_with_real_values.py`. Only the transport
changed, plus two fixes noted at the bottom of this file.

## Network

Campus WiFi almost always blocks device-to-device traffic, so the Pi will not
reach the laptop on eduroam. Use a phone hotspot or a travel router. Confirm
with `ping <laptop-ip>` from the Pi before assuming any code is broken.

If the dashboard is opened from a second laptop, set `PARENT_API_URL` in
`code/beehive-dashboard/src/Services/config.js` to the host laptop's IP instead
of `localhost`. Vite already binds to all interfaces.

## Changes made to existing code

- `config.js` — points at `localhost:5001`; the old Beanstalk URLs are kept as
  comments. The port was corrected from 5000 to match the server's default.
- `cameraRecordController.js` — the S3 client is now built on first use. It was
  constructed at import time and crashed the entire server with
  "Region is missing" whenever the S3 variables were blank. Image *upload* still
  needs real credentials and returns 503 without them; viewing camera records
  already used a placeholder image and works offline.
- `package.json` — added `mqtt` and `aedes`; removed `aws-crt` and
  `aws-iot-device-sdk-v2`, which were only referenced in a commented-out import
  and compile from source for several minutes.
- `vite.config.js` — binds to all interfaces for LAN access.

## Fixes to the graphs page

The `/graph` page was not slow, it never finished loading. Four separate causes:

- `Graphs.jsx` — the camera-records fetch gated the entire render via
  `isLoading`, and a hive with no camera records answers 404. The rejection
  skipped `setIsLoading(false)`, so the page sat on "Loading ..." forever. It is
  now wrapped in try/finally, and an empty result no longer dereferences
  `cameraRecords[0]`.
- `MyChartHandler.jsx` — `filterData` compared against a hardcoded
  `2024-01-29` timestamp. Any reading newer than that produced a negative age,
  which satisfies every branch, so the duration dropdown did nothing and each
  chart drew the entire history.
- `beehiveMetricsController.js` — `getBeehiveMetricsById` returned every reading
  ever recorded, unbounded. It now sorts newest-first and caps at 2000
  (override with `?limit=`), reversed so charts still read left to right.
  `Weight` is also returned now; it was omitted, so `Graphs.jsx` filled the
  weight chart with `Math.random()` values. It now plots the real load-cell
  reading.
- `beehiveMetricsModel.js` — added a `{ beehive_id, createdAt }` index. Every
  chart query was a full collection scan.

## Two Pi-side fixes

- The AWS script read the DHT sensor *after* building the payload, so every
  message carried the previous cycle's temperature and humidity. The local
  script reads first.
- `Battery_level` was hardcoded to 76, which meant the low-battery notification
  could never fire. The local script drains a simulated value from 100 so the
  alert appears during the demo. Tune `BATTERY_DRAIN_PER_READING`, or set it to
  0 to hold the level steady.

## Not carried over

The Lambda also sent an email via nodemailer. That is intentionally dropped, so
no mail credentials are needed. The in-app notification is still created and
appears in the dashboard. Note the Lambda read `beehive.email`, a field the
Beehive schema does not define, so that address was always `undefined`.
