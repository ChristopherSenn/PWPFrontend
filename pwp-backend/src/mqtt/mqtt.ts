import mqtt from 'mqtt';
import fs from 'fs';
import path from 'path';

import { CategoryTypes, IMqttMessage } from '../models/mqtt.model';
import { DeviceService } from '../services/device.service';

let client: mqtt.MqttClient; // Mqtt Client
const topicBase = '#'; // Base Topic to subscribe to. Because we use our own broker this is just a wildcard (so we listen to all topics)

const clientKeyPath = path.join(__dirname, './', 'certificates', 'client.key'); // Get client CA Certificate Key File
const clientPemPath = path.join(__dirname, './', 'certificates', 'client.pem'); // Get client CA Certificate Pem File

// Setup mqtt connection options
const connectionOptions: mqtt.IClientOptions = {
  port: 8883, // Secure port
  clientId: 'PWP_PUBLIC_BACKEND_CLIENT ' + Math.random().toString(16).substr(2, 8), // Client id starts with the server and ends wit a random number, so that there is no duplicate id if the server has to restart in case of a crash etc
  clean: true, // Broker doesn't store any info for the client
  key: fs.readFileSync(clientKeyPath, 'utf8'), // Set CA Key
  cert: fs.readFileSync(clientPemPath, 'utf8'), // Set CA Pem File
  connectTimeout: 4000, // Set connection timeout
  reconnectPeriod: 1000, // Set the Reconnect Period
};

/**
 * This method setups an mqtt broker, that listens to any incoming events or properties, and updates their values in the database
 */
function connectMqttClient() {
  client = mqtt.connect('mqtt://pwp21.medien.ifi.lmu.de:1883', connectionOptions); // Connect to public broker with given options

  // On connect, subscribe to the base topic and print a success message
  client.on('connect', () => {
    client.subscribe(topicBase);
    console.log('MQTT Connection successful!');
  });

  // Whenever the client receives a message
  client.on('message', async (topic, text) => {
    // Check if the topic of the message has the correct format (<hubId>/wot_clients/<deviceId>/<properties or events>/<property or event name>)
    if ((topic.match(/\//g) || []).length !== 4) {
      // If not log an error message and do nothing
      console.log(topic + '   ' + text.toString());
      console.log('Wrong mqtt topic format in mqtt.ts!');
      return;
    }
    // Else start to process the message
    const topicSplit: string[] = topic.split('/'); // Split by /

    // Check is category is valid and assign it accordungly
    let passedCategory: CategoryTypes = CategoryTypes.Undefined;
    if (topicSplit[3] === CategoryTypes.Events) {
      passedCategory = CategoryTypes.Events;
    } /* else if (topicSplit[3] === CategoryTypes.Properties) {
      passedCategory = CategoryTypes.Properties;
    } */

    // Catch invalid category input
    if (passedCategory === CategoryTypes.Undefined) {
      console.log('Undefined Topic category: ' + topicSplit[3]);
      return;
    }

    // Create IMqttMessage object based on the topic and the message.
    const message: IMqttMessage = {
      hubId: topicSplit[0],
      deviceId: topicSplit[2],
      category: passedCategory,
      topic: topicSplit[4],
      message: text.toString(),
    };
    // Update the correct property in the database
    await new DeviceService().updateEventValue(message);
  });
}

export { connectMqttClient };
