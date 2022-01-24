import { Body, Controller, Get, Post, Route, Security, Tags, Example, Response, Delete, Request, Query } from 'tsoa';
import { IError } from '../models/error.model';
import { IDevice } from '../models/device.model';
import { DeviceService, DeviceDeleteParams } from '../services/device.service';

@Route('devices')
@Tags('Devices')

export class DeviceController extends Controller {
//Security('jwt', ['customer'])

/* @Example<IDevice>({
        thingDescription: "My first Thing Description",
        deviceId: "1234",
        hubId: "1234",
        deviceName: "MyDevice",
        action:  [{
          name: "stir",
          href: "mqtt://pwp21.medien.ifi.lmu.de:8883/mixer-1/status",
          inputs: ["float"],
              }],
        properties: [{
          name: "stir",
          href: "mqtt://pwp21.medien.ifi.lmu.de:8883/mixer-1/status",
          inputs: ["float"],
          value: true
        }],   
    }) */
/* @Response<IError>(401, 'Unauthorized', {
    message: 'No token provided',
    }) */

//TODO: Parsen der TD, damit action usw nicht eingegeben werden muss sondern aus der TD gezogen wird
@Post('createDevice')
  public async createDevice(@Body() requestBody: IDevice): Promise<IDevice> {
    const response: IDevice = await new DeviceService().createDevice(requestBody);
    return response;
  } 
//delete device with hubid, token, deviceid
@Delete('deleteDevice')
  public async deleteDevice(@Body() requestBody: DeviceDeleteParams): Promise<IDevice> {
    const response = await new DeviceService().deleteDevice(requestBody);
    this.setStatus(200);
    return response;
  }

 
@Get('getDeviceByHub')
  public async getDevice(@Query() hubId?: string): Promise<IDevice>  {
    const response = await new DeviceService().getDevice();
    return response;
  }  

//TODO: spezifische Filterung findOne -> sucht bisher alle
@Get('getDetailsByDevice')
  public async getAction(@Query()  deviceName?: string)  {
    const response = await new DeviceService().getDetails();
    return response.action;
  }  

}
