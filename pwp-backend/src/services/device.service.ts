import { StatusError } from '../models/status.model';
import { Device, DeviceInput, DeviceDocument, IDevice } from '../models/device.model';
import { Hub, HubDocument } from '../models/hub.model';
import { IMqttMessage } from 'src/models/mqtt.model';
export type DeviceCreateParams = { thingDescription: any; hubIds: Array<string> };
export type AddOrRemoveDeviceParams = { hubId: string; deviceId: string; userId: string };

export class DeviceService {
  // createDevice Function gets thingDescription as JSON and hubId as String
  public async createDevice(requestBody: DeviceCreateParams): Promise<IDevice> {
    // Write all properties into variables
    const deviceId = requestBody.thingDescription.id!;
    const deviceName = requestBody.thingDescription.title!;
    const hubIds = requestBody.hubIds;

    const actions: any[] = [];
    let keys = Object.keys(requestBody.thingDescription.actions);
    keys.forEach((key) => {
      const action = {
        name: key,
        href: requestBody.thingDescription.actions[key].forms[0].href,
        actionType: requestBody.thingDescription.actions[key]['@type'],
        inputType: requestBody.thingDescription.actions[key].input.type,
      };
      actions.push(action);
    });

    keys = Object.keys(requestBody.thingDescription.events);
    const events: any[] = [];
    keys.forEach((key) => {
      const event = {
        name: key,
        href: requestBody.thingDescription.events[key].forms[0].href,
        dataType: requestBody.thingDescription.events[key].data.type,
        dataValue: ' ',
      };
      events.push(event);
    });

    // turn thingDescription into a String to store it in Database
    const thingDescription = JSON.stringify(requestBody.thingDescription)!;

    // Store Device with all properties in Database
    const deviceInput: DeviceInput = {
      thingDescription,
      hubIds,
      deviceId,
      deviceName,
      actions: actions,
      events: events,
    };
    // Create a new Device with the deviceSchema based on IDevice
    const deviceSchema = new Device(deviceInput);
    const newDevice: DeviceDocument = await deviceSchema.save();
    const parsedDevices: IDevice = newDevice;
    return parsedDevices;
  }

  // Delte a Device by DeviceName and HubId
  public async deleteDevice(deviceId: string): Promise<IDevice> {
    return new Promise<IDevice>((resolve, reject) => {
      // Find Device with specific DeviceName and HubId in Database and Delete it
      Device.findByIdAndDelete(deviceId, (err, result) => {
        if (err) {
          reject(new StatusError('Something went wrong', 404));
        } else {
          if (result !== null) {
            // Device to Delete with all properties
            const deviceTodelete: IDevice = {
              id: result._id,
              thingDescription: result.thingDescription,
              deviceId: result.deviceId,
              hubIds: result.hubIds,
              deviceName: result.deviceName,
              actions: result.actions,
              events: result.events,
            };
            resolve(deviceTodelete);
          } else {
            reject(new StatusError('Device not found', 404));
          }
        }
      });
    });
  }

  // Get All Properties of a specific Device by HubId
  public async getDevice(hubId: string): Promise<IDevice[]> {
    return new Promise<IDevice[]>((resolve, reject) => {
      // Find Device with specific HubId
      Device.find({ hubIds: hubId }, (err, result) => {
        if (err) {
          reject(new StatusError('Something went wrong', 404));
        } else {
          const devices: IDevice[] = [];
          result.forEach((d) => {
            const device: IDevice = {
              id: d._id,
              thingDescription: d.thingDescription,
              deviceId: d.deviceId,
              hubIds: d.hubIds,
              deviceName: d.deviceName,
              actions: d.actions,
              events: d.events,
            };
            devices.push(device);
          });

          resolve(devices);
        }
      });
    });
  }

  // Get a Device by specific Name to filter after actions, events etc.
  public async getDetails(deviceId): Promise<IDevice> {
    return new Promise<IDevice>((resolve, reject) => {
      // Find specific Device by Name in Database
      Device.findById(deviceId, (err, result) => {
        if (err) {
          reject(new StatusError('Something went wrong', 404));
        } else {
          if (result !== null) {
            const actionTofind: IDevice = {
              id: result._id,
              thingDescription: result.thingDescription,
              deviceId: result.deviceId,
              hubIds: result.hubIds,
              deviceName: result.deviceName,
              actions: result.actions,
              events: result.events,
            };
            resolve(actionTofind);
          } else {
            reject(new StatusError('Device not found', 404));
          }
        }
      });
    });
  }

  public async addDevice(requestBody: AddOrRemoveDeviceParams): Promise<IDevice> {
    const { hubId, deviceId, userId } = requestBody;

    const device: DeviceDocument | null = await Device.findById(deviceId).exec();
    if (device) {
      const hub: HubDocument | null = await Hub.findOne({ _id: hubId, ownerId: userId }).exec();
      if (hub) {
        // -> the one doing the request is actually the owner of the hub
        console.log(device.hubIds);
        const hubIds = device.hubIds.map((d) => d.toString());
        if (hubIds.includes(hubId)) {
          throw new StatusError('Device already added to this hub!', 404);
        } else {
          return new Promise<IDevice>((resolve, reject) => {
            Device.findByIdAndUpdate(deviceId, { $push: { hubIds: hubId } }, { new: true }, (err, result) => {
              if (err) {
                reject(new StatusError(err.message, 404));
              } else {
                if (result) {
                  const parsedDevice: IDevice = {
                    id: result._id,
                    thingDescription: result.thingDescription,
                    deviceId: result.deviceId,
                    hubIds: result.hubIds,
                    deviceName: result.deviceName,
                    actions: result.actions,
                    events: result.events,
                  };
                  resolve(parsedDevice);
                }
                reject(new StatusError('Device not found', 404));
              }
            });
          });
        }
      } else {
        throw new StatusError('Only the owner of a hub can add devices', 401);
      }
    } else {
      throw new StatusError('Device not found', 404);
    }
  }

  public async removeDevice(requestBody: AddOrRemoveDeviceParams): Promise<IDevice> {
    const { hubId, deviceId, userId } = requestBody;

    const device: DeviceDocument | null = await Device.findById(deviceId).exec();
    if (device) {
      const hub: HubDocument | null = await Hub.findOne({ _id: hubId, ownerId: userId }).exec();
      if (hub) {
        // -> the one doing the request is actually the owner of the hub
        const hubIds = device.hubIds.map((d) => d.toString());
        if (!hubIds.includes(hubId)) {
          throw new StatusError('Device not in this hub!', 404);
        } else {
          return new Promise<IDevice>((resolve, reject) => {
            Device.findByIdAndUpdate(deviceId, { $pull: { hubIds: hubId } }, { new: true }, (err, result) => {
              if (err) {
                reject(new StatusError(err.message, 404));
              } else {
                if (result) {
                  const parsedDevice: IDevice = {
                    id: result._id,
                    thingDescription: result.thingDescription,
                    deviceId: result.deviceId,
                    hubIds: result.hubIds,
                    deviceName: result.deviceName,
                    actions: result.actions,
                    events: result.events,
                  };
                  resolve(parsedDevice);
                }
                reject(new StatusError('Device not found', 404));
              }
            });
          });
        }
      } else {
        throw new StatusError('Only the owner of a hub can add devices', 401);
      }
    } else {
      throw new StatusError('Device not found', 404);
    }
  }

  /**
   * Updates an event or property value of a device in the databse.
   * @param requestBody Contains the device, the event/property and the new value
   * @returns The updated device object
   */
  public async updateDeviceValue(requestBody: IMqttMessage): Promise<IDevice> {
    const { deviceId, category, topic, message } = requestBody; // Store the properties in body in easier to access variables

    return new Promise<IDevice>((resolve, reject) => {
      // Find the correct device
      Device.findOne({ deviceId: deviceId }, (err, result) => {
        // If the device is not found or another db error occurrs, reject the Promise
        if (err) {
          reject(new StatusError(err.message, 404));
        } else {
          const eventPos = result[category].findIndex((c) => c.name === topic); // Find the position of the requested event in the events array
          // If the position is -1 the event was not found. In this case, reject the promise
          if (eventPos === -1) {
            reject(new StatusError('Event doesnt exist.', 404));
          } else {
            // If the event is found, update the right value in a local representation
            const newUpdate = result[category];
            newUpdate[eventPos].dataValue = message;
            // Then store the updated array in the db
            Device.findOneAndUpdate({ deviceId: deviceId }, { [category]: newUpdate }).then((result) => {
              // In case something goes wrong, reject the promise
              if (!result) {
                reject(new StatusError('Database Error.', 404));
              } else {
                // Else resolve it with the updated device
                resolve({
                  id: result._id,
                  thingDescription: result.thingDescription,
                  deviceId: result.deviceId,
                  hubIds: result.hubIds,
                  deviceName: result.deviceName,
                  actions: result.actions,
                  events: result.events,
                });
              }
            });
          }
        }
      });
    });
  }
}
