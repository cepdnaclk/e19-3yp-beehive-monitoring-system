import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { mqtt, io, iot } from 'aws-iot-device-sdk-v2';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from './utils/server.js';

// Load environment variables
dotenv.config();

// Create express server
const app = createServer();
const PORT = process.env.PORT || 5000;

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Start the HTTP server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Connect to MongoDB
mongoose.connect(process.env.CONNECTION_STRING2)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

/*
MQTT Config
Uncomment the below part only if you have config files for AWS IoT Core
*/


// Function to create MQTT connection
async function createConnection() {
  const clientBootstrap = new io.ClientBootstrap();
  const rootCAPath = path.resolve(__dirname, process.env.AWS_ROOT_CA_PATH);
  const deviceCertPath = path.resolve(__dirname, process.env.AWS_DEVICE_CERT_PATH);
  const privateKeyPath = path.resolve(__dirname, process.env.AWS_DEVICE_PRIVATE_KEY_PATH);

  const config = iot.AwsIotMqttConnectionConfigBuilder.new_mtls_builder_from_path(
      deviceCertPath,
      privateKeyPath
  ).with_certificate_authority_from_path(undefined, rootCAPath)
    .with_client_id(process.env.CLIENT_ID)
    .with_endpoint(process.env.AWS_IOT_ENDPOINT)
    .build();

  const client = new mqtt.MqttClient(clientBootstrap);
  const connection = client.new_connection(config);

  return connection;
}

// Main function for MQTT
async function main() {
    console.log(process.env.AWS_DEVICE_CERT_PATH);
    const connection = await createConnection();
    
    console.log('Connection created');

    // Connect to AWS IoT Core
    await connection.connect();

    console.log('Connected to AWS IoT Core');

    const topic = 'sdk/test/js';

    // Subscribe to topic
    await connection.subscribe(
      topic,
      mqtt.QoS.AtLeastOnce,
      (topic, payload, dup, qos, retain) => {
          const message = new TextDecoder("utf-8").decode(payload);
          console.log(`Received message: ${message} from topic: ${topic}`);
      }
  );

  console.log(`Subscribed to topic ${topic}`);
}

// Run the MQTT main function
main().catch((error) => {
    console.error('Error:', error);
});
