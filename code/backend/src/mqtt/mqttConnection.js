// mqttConnection.js
import { mqtt } from 'aws-iot-device-sdk-v2';
import { iot } from 'aws-iot-device-sdk-v2';
import { http } from 'aws-iot-device-sdk-v2';
import fs from 'fs';

export function buildConnection(argv) {
    console.log("Building MQTT connection...");
    //get cert and key from paths

    if (argv.certPath && argv.keyPath && argv.caPath) {
        argv.cert = fs.readFileSync(argv.certPath,'utf8');
        argv.key = fs.readFileSync(argv.keyPath,'utf8');  
        argv.ca_file = fs.readFileSync(argv.caPath,'utf8'); 

    }
    console.log("Cert: " + argv.cert);
  let configBuilder = iot.AwsIotMqttConnectionConfigBuilder.new_mtls_builder_from_path(argv.cert, argv.key);

  if (argv.proxy_host) {
    configBuilder.with_http_proxy_options(new http.HttpProxyOptions(argv.proxy_host, argv.proxy_port));
  }

  if (argv.ca_file != null) {
    configBuilder.with_certificate_authority_from_path(undefined, argv.ca_file);
  }

  configBuilder.with_clean_session(false);
  configBuilder.with_client_id(argv.client_id || "test-" + Math.floor(Math.random() * 100000000));
  configBuilder.with_endpoint(argv.endpoint);

  const config = configBuilder.build();
  const client = new mqtt.MqttClient();
  
  return client.new_connection(config);
}
