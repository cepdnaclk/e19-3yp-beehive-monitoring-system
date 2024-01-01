// mainServer.js
import { createServer } from './utils/server.js';
import mongoose from 'mongoose';
import { mongoURL } from './config/dbconfig.js';
import {buildConnection} from './mqtt/mqttConnection.js';

const app = createServer();
const PORT = 3000;

// Start the HTTP server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Connect to MongoDB
mongoose.connect(mongoURL).then(() => {
  console.log('Connected to MongoDB');
});

// MQTT Configuration
const mqttDeviceConfig = {
  keyPath: './iotconfig/core-client.public.key',
  certPath: './iotconfig/core-client.cert.pem',
  caPath: './iotconfig/root-CA.crt',
  clientId: 'core-client',
  region: 'us-west-2', // e.g., us-east-1
  endpoint: 'a3tvvh7s5x7lnc-ats.iot.us-west-2.amazonaws.com',
  baseReconnectTimeMs: 4000,
  maxReconnectTimeMs: 6000,
  
};

// Build MQTT connection
const mqttConnection = buildConnection(mqttDeviceConfig);

// Start the MQTT connection
console.log("Connecting to MQTT...");
await mqttConnection.connect();
console.log("Connected to MQTT");



// Handle Ctrl+C gracefully
process.on('SIGINT', async () => {
  console.log('Disconnecting from MQTT and shutting down...');
  await mqttConnection.disconnect(); // Disconnect MQTT
  server.close(); // Close HTTP server
  process.exit(0);
});


