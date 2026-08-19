/*
The MQTT broker that replaces AWS IoT Core.

Mosquitto would do the same job, but conda-forge ships no Mosquitto build for
Apple Silicon, so this runs Aedes instead: a standard MQTT 3.1.1 broker that
installs as an ordinary npm package and therefore lives inside the beezee env
with everything else. The Pi cannot tell the difference.

Auth is deliberately open. IoT Core required per-device mutual TLS; on a private
hotspot with two known devices that ceremony buys nothing, and certificate
problems are a bad way to lose a demo.
*/

import { createServer } from "net";
import Aedes from "aedes";

const PORT = Number(process.env.MQTT_PORT || 1883);
const HOST = process.env.MQTT_BIND || "0.0.0.0"; // 0.0.0.0 so the Pi can reach it

const aedes = new Aedes();
const server = createServer(aedes.handle);

aedes.on("client", (client) => {
  console.log(`Client connected: ${client.id}`);
});

aedes.on("clientDisconnect", (client) => {
  console.log(`Client disconnected: ${client.id}`);
});

aedes.on("subscribe", (subscriptions, client) => {
  const topics = subscriptions.map((s) => s.topic).join(", ");
  console.log(`${client.id} subscribed to: ${topics}`);
});

server.listen(PORT, HOST, () => {
  console.log(`MQTT broker listening on ${HOST}:${PORT}`);
  console.log("Point the Pi's BROKER_HOST at this machine's hotspot IP.");
});

server.on("error", (error) => {
  console.error("Broker failed:", error.message);
  process.exit(1);
});
