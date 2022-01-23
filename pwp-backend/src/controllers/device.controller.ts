import { Body, Controller, Get, Post, Route, Security, Tags, Example, Response, Delete, Request, Query } from 'tsoa';
import { IError } from '../models/error.model';
import { IDevice } from '../models/device.model';
import { DeviceService, DeviceDeleteParams } from '../services/device.service';

@Route('devices')
@Tags('Devices')

export class DeviceController extends Controller {
//Security('jwt', ['customer'])
@Security('jwt', ['customer'])
@Example<IDevice>({
        thingDescription: "My first Thing Description",
        deviceName: "MyDevice",
        action: "toggle",
        events: "do sth",
        state: "on",
        hubId: "1234",
    })
@Response<IError>(401, 'Unauthorized', {
    message: 'No token provided',
    })
//TODO: TOKEN UND ID
//TODO: Security
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

//TODO: spezifische Filterung
//TODO: sinnvoller das ganze Objekt an Frontend zu senden und die filtern sich raus, was sie möchten?
@Get('getActionByDevice')
  public async getAction(@Query()  deviceName?: string)  {
    const response = await new DeviceService().getAction();
    return response.action;
  }  

@Get('getStateByDevice')
  public async getState(@Query()  deviceName?: string )  {
    const response = await new DeviceService().getState();
    return response.state;
  }
  
@Get('getEventByDevice')
  public async getEvent(@Query()  deviceName?: string) {
    const response = await new DeviceService().getEvent();
    return response.events;
  } 

}
