import { IMqttMessage } from '../models/mqtt.model';
import { IStatus } from '../models/status.model';

export class MqttService {
  public async processMessage(message: IMqttMessage): Promise<IStatus> {
    switch (message.topic) {
      case 'access_mode':
        // Store new acces mode to db
        console.log(`New access mode ${message.message} for device ${message.deviceId}`);
    }
    // Theoretisch kann man hier einfach find device by id - update topic - with message machen
    return {
      status: 200,
      message: 'OK',
    };
  }
}
