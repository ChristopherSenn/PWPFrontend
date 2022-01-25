import { StatusError } from '../models/error.model';
import { Device, DeviceInput, DeviceDocument, IDevice } from '../models/device.model';
export type DeviceDeleteParams = Pick<IDevice, 'deviceName' | 'hubId'>;
export type DeviceCreateParams = { thingDescription: any; hubId: string };

export class DeviceService {

  //createDevice Function gets thingDescription as JSON and hubId as String
  public async createDevice(requestBody: DeviceCreateParams): Promise<IDevice> {
    //Write all properties into variables
    const deviceId = requestBody.thingDescription.id!;
    const deviceName = requestBody.thingDescription.title!;
    const actions = requestBody.thingDescription.actions!;
    const events = requestBody.thingDescription.events!;
    const hubId = requestBody.hubId;

    //turn thingDescription into a String to store it in Database
    const thingDescription = JSON.stringify(requestBody.thingDescription)!;

    //Store Device with all properties in Database
    const deviceInput: DeviceInput = {
      thingDescription,
      hubId,
      deviceId,
      deviceName,
      actions,
      events
    };
    //Create a new Device with the deviceSchema based on IDevice
    const deviceSchema = new Device(deviceInput);
    const newDevice: DeviceDocument = await deviceSchema.save();
    const parsedDevices: IDevice = newDevice;
    return parsedDevices;
  }
  //Delte a Device by DeviceName and HubId
  public async deleteDevice(requestBody: DeviceDeleteParams): Promise<IDevice> {
    return new Promise<IDevice>((resolve, reject) => {
      //Find Device with specific DeviceName and HubId in Database and Delete it 
      Device.findOneAndDelete({ deviceName: requestBody.deviceName, hubId: requestBody.hubId }, (err, result) => {
        if (err) {
          reject(new StatusError('Something went wrong', 404));
        } else {
          if (result !== null) {
            //Device to Delete with all properties
            const deviceTodelete: IDevice = {
              thingDescription: result.thingDescription,
              deviceId: result.deviceId,
              hubId: result.hubId,
              deviceName: result.deviceName,
              actions: result.actions,
              events: result.events
            };
            resolve(deviceTodelete);
          } else {
            reject(new StatusError('Device not found', 404));
          }
        }
      });
    });
  }

//Get All Properties of a specific Device by HubId
  public async getDevice(hubId): Promise<IDevice> {
    return new Promise<IDevice>((resolve, reject) => {
      //Find Device with specific HubId
      Device.findOne({ hubId: hubId }, (err, result) => {
        if (err) {
          reject(new StatusError('Something went wrong', 404));
        } else {
          if (result !== null) {
            const deviceTofind: IDevice = {
              thingDescription: result.thingDescription,
              deviceId: result.deviceId,
              hubId: result.hubId,
              deviceName: result.deviceName,
              actions: result.actions,
              events: result.events
            };
            resolve(deviceTofind);
          } else {
            reject(new StatusError('Device not found', 404));
          }
        }
      });
    });
  }
//Get a Device by specific Name to filter after actions, events etc. 
  public async getDetails(deviceName): Promise<IDevice> {
    return new Promise<IDevice>((resolve, reject) => {
      //Find specific Device by Name in Database
      Device.findOne({ deviceName: deviceName }, (err, result) => {
        if (err) {
          reject(new StatusError('Something went wrong', 404));
        } else {
          if (result !== null) {
            const actionTofind: IDevice = {
              thingDescription: result.thingDescription,
              deviceId: result.deviceId,
              hubId: result.hubId,
              deviceName: result.deviceName,
              actions: result.actions,
              events: result.evnts
            };
            resolve(actionTofind);
          } else {
            reject(new StatusError('Device not found', 404));
          }
        }
      });
    });

  }

}
