import mqtt from 'mqtt';
import { IMqttMessage } from '../models/mqtt.model';
import fs from 'fs';
import path from 'path';
import { DeviceService } from '../services/device.service';

let client: mqtt.MqttClient;

const topicBase = '#';

const clientKeyPath = path.join(__dirname, './', 'certificates', 'client.key');
const clientPemPath = path.join(__dirname, './', 'certificates', 'client.pem');

const connectionOptions: mqtt.IClientOptions = {
  port: 8883,
  clientId: 'PWP_PUBLIC_BACKEND_CLIENT ' + Math.random().toString(16).substr(2, 8),
  clean: true,
  key: fs.readFileSync(clientKeyPath, 'utf8'),
  cert: fs.readFileSync(clientPemPath, 'utf8'),
  connectTimeout: 4000,
  reconnectPeriod: 1000,
};

function connectMqttClient() {
  client = mqtt.connect('mqtt://pwp21.medien.ifi.lmu.de:1883', connectionOptions);
  client.on('connect', () => {
    client.subscribe(topicBase);
    console.log('MQTT Connection successful!');
  });

  client.on('message', async (topic, text) => {
    if ((topic.match(/\//g) || []).length !== 1) {
      console.log('Wrong mqtt topic format in mqtt.ts!');
      return;
    }
    const topicSplit: string[] = topic.split('/'); // 'clientId/topic'

    const message: IMqttMessage = {
      deviceId: topicSplit[0],
      topic: topicSplit[1],
      message: text.toString(),
    };

    // const result = await new MqttService().processMessage(message);
    await new DeviceService().updateEventValue(message);
    // console.log(result);
  });
}

export { connectMqttClient };
