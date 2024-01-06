import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {BeehiveMetrics}from './beehiveMetricsModel.js';



dotenv.config();

const mongoUri = process.env.mongo_url; // Set this in your Lambda environment variables

export const handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    console.log('mongoUri:', mongoUri);
    let response;
    try {
        await mongoose.connect(mongoUri);

        // Assuming event contains the IoT data as JSON
        const { beehive_id, CO2, Temperature, Humidity, Weight, Battery_level } = event;

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
