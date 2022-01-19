import mqtt from 'mqtt';
import { MqttService } from '../services/mqtt.service';
import { IMqttMessage } from '../models/mqtt.model';

let client: mqtt.MqttClient;

const topicBase = 'pwp/#';

const connectionOptions: mqtt.IClientOptions = {
  clientId: 'PWP_PUBLIC_BACKEND_CLIENT',
  clean: true,
  connectTimeout: 4000,
  username: 'PWP_TMP_USERNAME',
  password: 'PWP_TMP_PASSWORD',
  reconnectPeriod: 1000,
};

function connectMqttClient() {
  client = mqtt.connect('mqtt://broker.emqx.io', connectionOptions);

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
