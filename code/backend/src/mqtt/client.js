
import { mqtt } from 'aws-iot-device-sdk-v2';
import { TextDecoder } from 'util';

const decoder = new TextDecoder('utf-8');

export default class MqttConnection {
  constructor(deviceConfig, topic, onMessageCallback) {
    this.deviceConfig = deviceConfig;
    this.topic = topic;
    this.onMessageCallback = onMessageCallback;
    console.log(this.deviceConfig);
    this.connection = new mqtt.MqttClientConnection('core-client',this.deviceConfig);
  }

  async connectAndSubscribe() {
    try {
      await this.connection.connect();
      console.log('Connected to the MQTT broker');

      // Subscribe to the topic
      await this.connection.subscribe(this.topic, mqtt.QoS.AtLeastOnce, this.onMessageCallback);
      console.log(`Subscribed to the topic "${this.topic}"`);
    } catch (error) {
      console.error('Error connecting to MQTT broker:', error);
      process.exit(1);
    }
  }

  async disconnect() {
    await this.connection.disconnect();
    console.log('Disconnected from the MQTT broker');
  }
}
