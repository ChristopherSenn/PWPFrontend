import { StatusError } from '../models/status.model';
import { Device, DeviceInput, DeviceDocument, IDevice } from '../models/device.model';
import { Hub, HubDocument } from '../models/hub.model';
import { IMqttMessage } from '../models/mqtt.model';
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
    // accessing json object of actions
    let keys = Object.keys(requestBody.thingDescription.actions);
    // get all necessary properties of "actions" from TD and write it into object
    keys.forEach((key) => {
      const action = {
        name: key,
        href: requestBody.thingDescription.actions[key].forms[0].href,
        actionType: requestBody.thingDescription.actions[key]['@type'],
        inputType: requestBody.thingDescription.actions[key].input.type,
      };
      actions.push(action);
    });

    // get all necessary properties of "events" from TD and write it into object
    const events: any[] = [];
    // accessing json object of events
    keys = Object.keys(requestBody.thingDescription.events);
    keys.forEach((key) => {
      const event = {
        name: key,
        href: requestBody.thingDescription.events[key].forms[0].href,
        dataType: requestBody.thingDescription.events[key].data.type,
        dataValue: ' ',
      };
      events.push(event);
    });

    const properties: any[] = [];
    // accessing json object of properties
    keys = Object.keys(requestBody.thingDescription.properties);
    // get all necessary properties of "properties" from TD and write it into object
    keys.forEach((key) => {
      const property = {
        name: key,
        href: requestBody.thingDescription.properties[key].forms[0].href,
        dataType: requestBody.thingDescription.properties[key].type,
        dataValue: ' ',
      };
      properties.push(property);
    });

    // turn thingDescription from json into a String to store it in Database
    const thingDescription = JSON.stringify(requestBody.thingDescription)!;

    // Add properties to variale deviceIput with Tyoe of the defined DeviceInput Model
    const deviceInput: DeviceInput = {
      thingDescription,
      hubIds,
      deviceId,
      deviceName,
      actions: actions,
      events: events,
      properties: properties,
    };
    // Create a new Device with the deviceSchema based on IDevice
    const deviceSchema = new Device(deviceInput);
    const newDevice: DeviceDocument = await deviceSchema.save();
    const parsedDevices: IDevice = newDevice;
    return parsedDevices;
  }

  // Delete a Device by DeviceId
  public async deleteDevice(deviceId: string): Promise<IDevice> {
    return new Promise<IDevice>((resolve, reject) => {
      // Find Device with specific DeviceId in Database
      Device.findOneAndDelete({ deviceId: deviceId }).exec((err, result) => {
        if (err) {
          reject(new StatusError('Something went wrong', 404));
        } else {
          if (result !== null) {
            // Device that should be deleted with all properties
            const deviceTodelete: IDevice = {
              id: result._id,
              thingDescription: result.thingDescription,
              deviceId: result.deviceId,
              hubIds: result.hubIds,
              deviceName: result.deviceName,
              actions: result.actions,
              events: result.events,
              properties: result.properties,
            };
            // delete device with all properties
            resolve(deviceTodelete);
          } else {
            // Error Handling if there is no device with the received deviceId
            reject(new StatusError('Device not found', 404));
          }
        }
      });
    });
  }

  public async getDevices(): Promise<IDevice[]> {
    return new Promise<IDevice[]>((resolve, reject) => {
      Device.find().exec((err, result) => {
        if (err) {
          reject(new StatusError('Database error', 400));
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
              properties: d.properties,
            };
            // push properties to array of IDevice
            devices.push(device);
          });
          resolve(devices);
        }
      });
    });
  }

  // Get All Properties of a specific Device by HubId
  public async getDevice(hubId: string): Promise<IDevice[]> {
    return new Promise<IDevice[]>((resolve, reject) => {
      // Find all Devices with specific HubId
      Device.find({ hubIds: hubId }, (err, result) => {
        if (err) {
          reject(new StatusError('HubId not found', 404));
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
              properties: d.properties,
            };
            // push properties to array of IDevice
            devices.push(device);
          });
          resolve(devices);
        }
      });
    });
  }

  // Get a Device by specific Id to filter after actions, events, properties etc.
  public async getDetails(deviceId: string): Promise<IDevice> {
    return new Promise<IDevice>((resolve, reject) => {
      // Find specific Device by received deviceId in Database
      Device.findOne({ deviceId: deviceId }).exec((err, result) => {
        if (err) {
          reject(new StatusError('Device with deviceId not found', 404));
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
              properties: result.properties,
            };
            resolve(actionTofind);
          } else {
            // Error Handling if there is no device with the received deviceId
            reject(new StatusError('Device not found', 404));
          }
        }
      });
    });
  }

  // Add a device to a Hub by HubId, deviceId and UserId
  public async addDevice(requestBody: AddOrRemoveDeviceParams): Promise<IDevice> {
    const { hubId, deviceId, userId } = requestBody;

    // first check if device exists
    const device: DeviceDocument | null = await Device.findOne({ deviceId: deviceId }).exec();
    if (device) {
      // if device exists, check if hub exists
      const hub: HubDocument | null = await Hub.findOne({ _id: hubId, ownerId: userId }).exec();
      if (hub) {
        // the one doing the request is actually the owner of the hub
        const hubIds = device.hubIds.map((d) => d.toString());
        // adding should only be possible if the received hubId is part of the hubId array of the device
        if (hubIds.includes(hubId)) {
          // Error Handling if device is already registered to the hub
          throw new StatusError('Device already added to this hub!', 404);
        } else {
          return new Promise<IDevice>((resolve, reject) => {
            Device.findOneAndUpdate(
              { deviceId: deviceId },
              { $push: { hubIds: hubId } },
              { new: true },
              (err, result) => {
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
                      properties: result.properties,
                    };
                    resolve(parsedDevice);
                  }
                  reject(new StatusError('Device not found', 404));
                }
              }
            );
          });
        }
      } else {
        // Error Handling if the ownerId does not match the Id of the person signed in
        throw new StatusError('Only the owner of a hub can add devices', 401);
      }
    } else {
      // Error Handling if there is no device with received hubId, deviceId, userId
      throw new StatusError('Device not found', 404);
    }
  }

  public async removeDevice(requestBody: AddOrRemoveDeviceParams): Promise<IDevice> {
    const { hubId, deviceId, userId } = requestBody;

    // first check if device exists
    const device: DeviceDocument | null = await Device.findOne({ deviceId: deviceId }).exec();
    if (device) {
      // if device exists, check if hub exists
      const hub: HubDocument | null = await Hub.findOne({ _id: hubId, ownerId: userId }).exec();
      if (hub) {
        // the one doing the request is actually the owner of the hub
        const hubIds = device.hubIds.map((d) => d.toString());
        if (!hubIds.includes(hubId)) {
          // Error Handling if device is not registered to the hub
          throw new StatusError('Device not in this hub!', 404);
        } else {
          return new Promise<IDevice>((resolve, reject) => {
            Device.findOneAndUpdate(
              { deviceId: deviceId },
              { $pull: { hubIds: hubId } },
              { new: true },
              (err, result) => {
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
                      properties: result.properties,
                    };
                    resolve(parsedDevice);
                  }
                  reject(new StatusError('Device not found', 404));
                }
              }
            );
          });
        }
      } else {
        // Error Handling if the ownerId does not match the Id of the person signed in
        throw new StatusError('Only the owner of a hub can remove devices', 401);
      }
    } else {
      // Error Handling if there is no device with received hubId, deviceId, userId
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
    // Should never happen
    if (category !== 'properties' && category !== 'events') {
      return Promise.reject(new StatusError('Internal Server error!', 500));
    }

    return new Promise<IDevice>((resolve, reject) => {
      // Find the correct device
      Device.findOne({ deviceId: deviceId }).exec((err, result) => {
        // If the device is not found or another db error occurrs, reject the Promise
        if (err || result === null) {
          reject(new StatusError('Invalid Device ID', 404));
        } else {
          const eventPos: number = result[category].findIndex((c) => c.name === topic); // Find the position of the requested event in the events array
          // If the position is -1 the event was not found. In this case, reject the promise
          if (eventPos === -1) {
            reject(new StatusError('Event doesnt exist.', 404));
          } else {
            // If the event is found, update the right value in a local representation
            const newUpdate: IDevice['properties'] | IDevice['events'] = result[category];
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
                  properties: result.properties,
                });
              }
            });
          }
        }
      });
    });
  }
}
