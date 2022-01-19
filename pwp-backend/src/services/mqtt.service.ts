import { IMqttMessage } from '../models/mqtt.model';
import { IStatus } from '../models/status.model';

export class MqttService {
  public async processMessage(message: IMqttMessage): Promise<IStatus> {
    switch (message.topic) {
      case 'access_mode':
        // Store new acces mode to db
        console.log(`New access mode ${message.message} for device ${message.deviceId} in hub ${message.hubId}`);
    }
    return {
      status: 200,
      message: 'OK',
    };
  }
}
