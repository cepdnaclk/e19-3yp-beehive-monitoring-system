import mongoose from "mongoose";
import dotenv from "dotenv";
import { BeehiveMetrics } from "./beehiveMetricsModel.js";
import { Notification } from "./notificationModel.js";
import { Beehive } from "./beehiveModel.js";

dotenv.config();

const mongoUri = process.env.mongo_url; // Set this in your Lambda environment variables

export const handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));
  console.log("mongoUri:", mongoUri);
  let response;
  try {
    await mongoose.connect(mongoUri);

    // Assuming event contains the IoT data as JSON
    const { beehive_id, CO2, Temperature, Humidity, Weight, Battery_level } =
      event;

    const beehiveMetrics = await BeehiveMetrics.create({
      beehive_id,
      CO2,
      Temperature,
      Humidity,
      Weight,
      Battery_level,
    });

    response = {
      statusCode: 200,
      body: JSON.stringify({
        message: "Data saved successfully",
        data: beehiveMetrics,
      }),
    };
    const NOTIFICATION_THRESHOLD = 20; // Example threshold for battery level
    const COOL_DOWN_PERIOD = 60 * 60 * 1000; // 1 hour in milliseconds

    // Check for low battery and handle notification
    if (Battery_level < NOTIFICATION_THRESHOLD) {
      // Find the user associated with the beehive
      const beehive = await Beehive.findById(beehive_id);
      if (beehive && beehive.user_id) {
        const recentNotification = await Notification.findOne({
          userId: beehive.user_id,
          notificationType: "low_battery",
          createdAt: { $gt: new Date(Date.now() - COOL_DOWN_PERIOD) },
        });

        if (!recentNotification) {
          await Notification.create({
            userId: beehive.user_id,
            notificationType: "low_battery",
            notificationMessage: `Low battery warning for your beehive "${beehive.name}"`,
            isRead: false,
          });
        }
      }
    }
  } catch (error) {
    console.error("Error saving data to MongoDB:", error);
    response = {
      statusCode: 500,
      body: JSON.stringify({ message: "Error saving data", error }),
    };
  } finally {
    await mongoose.disconnect();
  }

  return response;
};
