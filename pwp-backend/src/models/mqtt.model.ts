/**
 * Interface that represents mqtt messages
 */
interface IMqttMessage {
  deviceId: string; // The ID of the sending device
  topic: string; // The topic (specific property or event) of the message
  message: string; // The actual value that is sent
}

export { IMqttMessage };
