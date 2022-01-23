import { StatusError } from '../models/error.model';
import { Device, DeviceInput, DeviceDocument, IDevice } from '../models/device.model';
export type DeviceDeleteParams = Pick<IDevice, 'deviceName'| 'hubId' >;
export type FindDeviceParams = Pick<IDevice, 'hubId'>;
export type FindParams = Pick<IDevice, 'deviceName'>;

export class DeviceService {


    public async createDevice(requestBody: IDevice): Promise<IDevice> {
        const  {thingDescription, deviceName, action, events, state, hubId}  = requestBody;
        const deviceInput: DeviceInput = {
            thingDescription,
            deviceName,
            action,
            events,
            state,
            hubId
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
                    deviceName: result.deviceName,
                    action: result.action,
                    events: result.events,
                    state: result.state,
                    hubId: result.hubId
                  };
                resolve(deviceTodelete);
              } else {
                reject(new StatusError('Device not found', 404));
              }
            }
          });
        });
      }


public async getDevice(requestBody: FindDeviceParams): Promise<IDevice> {
    return new Promise<IDevice>((resolve, reject) => {
        Device.findOne({ hubId: requestBody.hubId  }, (err, result) => {
          if (err) {
            reject(new StatusError('Something went wrong', 404));
          } else {
            if (result !== null) {
              const deviceTofind: IDevice = {
                  thingDescription: result.thingDescription,
                  deviceName: result.deviceName,
                  action: result.action,
                  events: result.events,
                  state: result.state,
                  hubId: result.hubId
                };
              resolve(deviceTofind);
            } else {
              reject(new StatusError('Device not found', 404));
            }
          }
        });
      });
    }
 
public async getAction(requestBody: FindParams): Promise<IDevice> {
        return new Promise<IDevice>((resolve, reject) => {
            Device.findOne({ deviceName: requestBody.deviceName  }, (err, result) => {
              if (err) {
                reject(new StatusError('Something went wrong', 404));
              } else {
                if (result !== null) {
                  const actionTofind: IDevice = {
                      thingDescription: result.thingDescription,
                      deviceName: result.deviceName,
                      action: result.action,
                      events: result.events,
                      state: result.state,
                      hubId: result.hubId
                    };
                  resolve(actionTofind);
                } else {
                  reject(new StatusError('Device not found', 404));
                }
              }
            });
          });
    
        }    
public async getState(requestBody: FindParams): Promise<IDevice> {
            return new Promise<IDevice>((resolve, reject) => {
                Device.findOne({ deviceName: requestBody.deviceName  }, (err, result) => {
                  if (err) {
                    reject(new StatusError('Something went wrong', 404));
                  } else {
                    if (result !== null) {
                      const stateTofind: IDevice = {
                          thingDescription: result.thingDescription,
                          deviceName: result.deviceName,
                          action: result.action,
                          events: result.events,
                          state: result.state,
                          hubId: result.hubId
                        };
                      resolve(stateTofind);
                    } else {
                      reject(new StatusError('Device not found', 404));
                    }
                  }
                });
              });
        
            }        
public async getEvent(requestBody: FindParams): Promise<IDevice> {
                return new Promise<IDevice>((resolve, reject) => {
                    Device.findOne({ deviceName: requestBody.deviceName  }, (err, result) => {
                      if (err) {
                        reject(new StatusError('Something went wrong', 404));
                      } else {
                        if (result !== null) {
                          const eventTofind: IDevice = {
                              thingDescription: result.thingDescription,
                              deviceName: result.deviceName,
                              action: result.action,
                              events: result.events,
                              state: result.state,
                              hubId: result.hubId
                            };
                          resolve(eventTofind);
                        } else {
                          reject(new StatusError('Device not found', 404));
                        }
                      }
                    });
                  });
            
                }            
  
}
