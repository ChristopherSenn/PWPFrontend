interface IMqttMessage {
  hubId: string;
  deviceId: string;
  topic: string;
  message: string;
}

export { IMqttMessage };
