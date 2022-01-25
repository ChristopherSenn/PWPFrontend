import mqtt from 'mqtt';
import { MqttService } from '../services/mqtt.service';
import { IMqttMessage } from '../models/mqtt.model';
import fs from 'fs';
import path from 'path';

let client: mqtt.MqttClient;

const topicBase = 'pwp/#';

const clientKeyPath = path.join(__dirname, './', 'certificates', 'client.key');
const clientPemPath = path.join(__dirname, './', 'certificates', 'client.pem');

const connectionOptions: mqtt.IClientOptions = {
  port: 8883,
  clientId: 'PWP_PUBLIC_BACKEND_CLIENT',
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
    if ((topic.match(/\//g) || []).length !== 3) {
      console.log('Wrong mqtt topic format in mqtt.ts!');
      return;
    }
    const topicSplit: string[] = topic.split('/'); // 'pwp/hubID/clientId/topic'

    const message: IMqttMessage = {
      hubId: topicSplit[1],
      deviceId: topicSplit[2],
      topic: topicSplit[3],
      message: text.toString(),
    };

    const result = await new MqttService().processMessage(message);
    console.log(result);
  });
}

export { connectMqttClient };
