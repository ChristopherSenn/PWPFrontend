import mqtt from 'mqtt';
import fs from 'fs';
import path from 'path';
import { MqttService } from '../services/mqtt.service';

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
  username: 'backend_client',
  password: '5fE7HU8ZrxUeSRYmWg6eBxmJ',
  connectTimeout: 4000, // Set connection timeout
  reconnectPeriod: 1000, // Set the Reconnect Period
};

/**
 * This method setups an mqtt broker, that listens to any incoming events or properties, and updates their values in the database
 */
function connectMqttClient() {
  client = mqtt.connect('mqtt://pwp21.medien.ifi.lmu.de', connectionOptions); // Connect to public broker with given options

  // On connect, subscribe to the base topic and print a success message
  client.on('connect', () => {
    client.subscribe(topicBase);
    console.log('MQTT Connection successful!');
  });

  // Whenever the client receives a message
  client.on('message', async (topic, text) => {
    const topicSplit: string[] = topic.split('/'); // Split by /

    if (topic.endsWith('/thing_description')) {
      new MqttService().processThingDescription(topicSplit, text.toString());
    } else if ((topic.match(/\//g) || []).length === 4) {
      new MqttService().updateDeviceValue(topicSplit, text.toString());
    } else {
      // If not log an error message and do nothing
      console.log(topic + '   ' + text.toString());
      console.log('Wrong mqtt topic format in mqtt.ts!');
    }
  });
}

function addAccount(username: string, password: string) {
  client.publish(
    'user_management/add',
    '{ "username": "' + username + '", "password": "' + password + '" }',
    { qos: 0, retain: false },
    (error) => {
      if (error) {
        console.error(error);
      }
    }
  );
}

function removeAccount(username: string) {
  client.publish('user_management/remove', username, { qos: 0, retain: false }, (error) => {
    if (error) {
      console.error(error);
    }
  });
}

export { connectMqttClient, addAccount, removeAccount };
