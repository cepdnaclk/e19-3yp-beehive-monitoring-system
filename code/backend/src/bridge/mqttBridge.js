/*
Local replacement for the AWS Lambda in code/aws-lambda/index.mjs.

AWS IoT Core delivered each published message straight to Lambda, which opened a
Mongo connection, stored the reading and raised a low-battery notification.
Here Mosquitto is the broker and this long-running subscriber does the same work.
The one deliberate difference: Lambda connected and disconnected per invocation
because it was ephemeral, while this process holds a single connection open.
*/

import mqtt from "mqtt";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { BeehiveMetrics } from "../models/beehiveMetricsModel.js";
import { Notification } from "../models/notificationModel.js";
import { Beehive } from "../models/beehiveModel.js";

dotenv.config();

const BROKER_URL = process.env.MQTT_BROKER_URL || "mqtt://localhost:1883";
const TOPIC = process.env.MQTT_TOPIC || "beehive/metrics";
const NOTIFICATION_THRESHOLD = 20; // Battery percentage that triggers a warning
const COOL_DOWN_PERIOD = 60 * 60 * 1000; // 1 hour in milliseconds

async function handleReading(payload) {
  const { beehive_id, CO2, Temperature, Humidity, Weight, Battery_level } =
    payload;

  // A bad id here fails deep inside Mongoose with an unhelpful cast error, so
  // check it up front where the message that comes out is actually readable.
  if (!mongoose.Types.ObjectId.isValid(beehive_id)) {
    console.error(
      `Ignoring message: "${beehive_id}" is not a valid beehive id.`,
      "Register a beehive in the dashboard and copy its _id to the Pi."
    );
    return;
  }

  const beehiveMetrics = await BeehiveMetrics.create({
    beehive_id,
    CO2,
    Temperature,
    Humidity,
    Weight,
    Battery_level,
  });

  console.log(
    `Stored reading ${beehiveMetrics._id} ` +
      `(T=${Temperature} H=${Humidity} CO2=${CO2} W=${Weight} B=${Battery_level})`
  );

  if (Battery_level >= NOTIFICATION_THRESHOLD) {
    return;
  }

  const beehive = await Beehive.findById(beehive_id);
  if (!beehive || !beehive.user_id) {
    return;
  }

  const recentNotification = await Notification.findOne({
    userId: beehive.user_id,
    notificationType: "low_battery",
    createdAt: { $gt: new Date(Date.now() - COOL_DOWN_PERIOD) },
  });

  if (recentNotification) {
    return;
  }

  await Notification.create({
    userId: beehive.user_id,
    notificationType: "low_battery",
    notificationMessage: `Low battery warning for your beehive "${beehive.name}"`,
    isRead: false,
  });

  console.log(`Low battery notification raised for "${beehive.name}"`);
}

async function main() {
  await mongoose.connect(process.env.CONNECTION_STRING2);
  console.log("Bridge connected to MongoDB");

  const client = mqtt.connect(BROKER_URL);

  client.on("connect", () => {
    console.log(`Bridge connected to broker at ${BROKER_URL}`);
    client.subscribe(TOPIC, { qos: 1 }, (err) => {
      if (err) {
        console.error("Could not subscribe:", err.message);
        return;
      }
      console.log(`Subscribed to ${TOPIC}, waiting for readings...`);
    });
  });

  client.on("message", async (topic, message) => {
    try {
      await handleReading(JSON.parse(message.toString()));
    } catch (error) {
      // One malformed reading must not take the bridge down mid-demo.
      console.error("Failed to handle message:", error.message);
    }
  });

  client.on("error", (error) => {
    console.error("Broker connection error:", error.message);
  });

  client.on("reconnect", () => {
    console.log("Reconnecting to broker...");
  });
}

main().catch((error) => {
  console.error("Bridge failed to start:", error.message);
  process.exit(1);
});
