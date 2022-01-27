interface IMqttMessage {
  deviceId: string;
  topic: string;
  message: string;
}

export { IMqttMessage };
