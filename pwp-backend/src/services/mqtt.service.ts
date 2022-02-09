import { CategoryTypes, IMqttMessage } from '../models/mqtt.model';
import { IStatus, StatusError } from '../models/status.model';
import { DeviceCreateParams, DeviceService } from './device.service';

/**
 * Provides Methods that handles the different mqtt messages that can come in
 */
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

  /**
   * Receive a thing Description and create a new device from it
   * @param topicSplit The topic of the mqtt message split by /
   * @param text The Thing description as string
   */
  public async processThingDescription(topicSplit: string[], text: string) {
    // Create Object from parameters
    const params: DeviceCreateParams = {
      thingDescription: JSON.parse(text),
      hubIds: [topicSplit[1]],
    };
    // Let the device service handle the creation of the device
    new DeviceService().createDevice(params);
    // wot_hubs/<hub-id>/<device-id>/thing_description
  }

  /**
   * Updates a property or event from a given device
   * @param topicSplit The mqtt topic split by /
   * @param text The new value
   */
  public async updateDeviceValue(topicSplit: string[], text: string) {
    // Check is category is valid and assign it accordungly
    let passedCategory: CategoryTypes = CategoryTypes.Undefined;
    if (topicSplit[3] === CategoryTypes.Events) {
      passedCategory = CategoryTypes.Events;
    } else if (topicSplit[3] === CategoryTypes.Properties) {
      passedCategory = CategoryTypes.Properties;
    }
    // wot_hubs/<hub-id>/<device-id>/properties/property

    // Catch invalid category input
    if (passedCategory === CategoryTypes.Undefined) {
      console.log('Undefined Topic category: ' + topicSplit[3]);
      return;
    }

    // Create IMqttMessage object based on the topic and the message.
    const message: IMqttMessage = {
      hubId: topicSplit[1],
      deviceId: topicSplit[2],
      category: passedCategory,
      topic: topicSplit[4],
      message: text.toString(),
    };
    // Update the correct property in the database
    await new DeviceService().updateDeviceValue(message).catch((error: StatusError) => {
      console.log('Error updating Device Value: ' + error.message);
    });
  }
}
