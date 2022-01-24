import { StatusError } from '../models/error.model';
import { Device, DeviceInput, DeviceDocument, IDevice } from '../models/device.model';
export type DeviceDeleteParams = Pick<IDevice, 'deviceName'| 'hubId' >;



export class DeviceService {


    public async createDevice(requestBody: IDevice): Promise<IDevice> {
        const  {thingDescription, hubId, deviceName, actions, events, deviceId}  = requestBody;
        //TODO: parse JSON 
        /* const object= JSON.parse(thingDescription);
        console.log(object); */
        const deviceInput: DeviceInput = {
            thingDescription,
            deviceId,
            hubId,
            deviceName,
            actions,
            events
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


public async getDevice(hubId): Promise<IDevice> {
    return new Promise<IDevice>((resolve, reject) => {
        Device.findOne({hubId: hubId}, (err, result) => {
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
 
public async getDetails(deviceName): Promise<IDevice> {
        return new Promise<IDevice>((resolve, reject) => {
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
