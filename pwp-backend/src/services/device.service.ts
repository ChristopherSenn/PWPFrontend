import { StatusError } from '../models/error.model';
import { Device, DeviceInput, DeviceDocument, IDevice } from '../models/device.model';
export type DeviceDeleteParams = Pick<IDevice, 'deviceName'| 'hubId' >;


export class DeviceService {


    public async createDevice(requestBody: IDevice): Promise<IDevice> {
        const  {thingDescription, deviceId, hubId, deviceName, action, properties}  = requestBody;
        const deviceInput: DeviceInput = {
            thingDescription,
            deviceId,
            hubId,
            deviceName,
            action,
            properties
        };
        const deviceSchema = new Device(deviceInput);
        const newDevice: DeviceDocument = await deviceSchema.save();
        const parsedDevices: IDevice = newDevice;
        return parsedDevices;
      }

public async deleteDevice(requestBody: DeviceDeleteParams): Promise<IDevice> {
        return new Promise<IDevice>((resolve, reject) => {
          Device.findOneAndDelete({ deviceName: requestBody.deviceName, hubId: requestBody.hubId }, (err, result) => {
            if (err) {
              reject(new StatusError('Something went wrong', 404));
            } else {
              if (result !== null) {
                const deviceTodelete: IDevice = {
                    thingDescription: result.thingDescription,
                    deviceId: result.deviceId,
                    hubId: result.hubId,
                    deviceName: result.deviceName,
                    action: result.action,
                    properties: result.properties
                };
                resolve(deviceTodelete);
              } else {
                reject(new StatusError('Device not found', 404));
              }
            }
          });
        });
      }


public async getDevice(): Promise<IDevice> {
    return new Promise<IDevice>((resolve, reject) => {
        Device.findOne({}, (err, result) => {
          if (err) {
            reject(new StatusError('Something went wrong', 404));
          } else {
            if (result !== null) {
              const deviceTofind: IDevice = {
                thingDescription: result.thingDescription,
                deviceId: result.deviceId,
                hubId: result.hubId,
                deviceName: result.deviceName,
                action: result.action,
                properties: result.properties
                };
              resolve(deviceTofind);
            } else {
              reject(new StatusError('Device not found', 404));
            }
          }
        });
      });
    }
 
public async getDetails(): Promise<IDevice> {
        return new Promise<IDevice>((resolve, reject) => {
            Device.findOne({ }, (err, result) => {
              if (err) {
                reject(new StatusError('Something went wrong', 404));
              } else {
                if (result !== null) {
                  const actionTofind: IDevice = {
                    thingDescription: result.thingDescription,
                    deviceId: result.deviceId,
                    hubId: result.hubId,
                    deviceName: result.deviceName,
                    action: result.action,
                    properties: result.properties
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
