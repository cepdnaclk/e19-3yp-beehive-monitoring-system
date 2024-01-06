import mongoose from 'mongoose';
import dotenv from 'dotenv';
import pkg from './beehiveMetricsModel.js';
const { BeehiveMetrics } = pkg;


dotenv.config();

const mongoUri = process.env.MONGODB_URI; // Set this in your Lambda environment variables

export const handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    let response;
    try {
        await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

        // Assuming event contains the IoT data as JSON
        const { beehive_id, CO2, Temperature, Humidity, Weight, Battery_level } = JSON.parse(event.body);

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
            body: JSON.stringify({ message: "Data saved successfully", data: beehiveMetrics }),
        };
    } catch (error) {
        console.error('Error saving data to MongoDB:', error);
        response = {
            statusCode: 500,
            body: JSON.stringify({ message: "Error saving data", error }),
        };
    } finally {
        await mongoose.disconnect();
    }

    return response;
};
