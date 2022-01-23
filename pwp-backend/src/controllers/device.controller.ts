import { Body, Controller, Get, Post, Route, Security, Tags, Example, Response, Delete, Request } from 'tsoa';
import { IError } from '../models/error.model';
import { IDevice } from '../models/device.model';
import { DeviceService, DeviceDeleteParams, FindDeviceParams, FindParams } from '../services/device.service';

@Route('devices')
@Tags('Devices')

export class DeviceController extends Controller {
//Security('jwt', ['customer'])

@Example<IDevice>({
        thingDescription: "My first Thing Description",
        deviceName: "MyDevice",
        action: "toggle",
        events: "do sth",
        state: "on",
        hubId: "1234",
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

 
@Post('getDeviceByHub')
  public async getDevice(@Body() requestBody: FindDeviceParams): Promise<IDevice>  {
    const response = await new DeviceService().getDevice(requestBody);
    return response;
  }  
//TODO: sinnvoller das ganze Objekt an Frontend zu senden und die filtern sich raus, was sie möchten?
@Post('getActionByDevice')
  public async getAction(@Body() requestBody: FindParams)  {
    const response = await new DeviceService().getAction(requestBody);
    return response.action;
  }  

@Post('getStateByDevice')
  public async getState(@Body() requestBody: FindParams)  {
    const response = await new DeviceService().getState(requestBody);
    return response.state;
  }
  
@Post('getEventByDevice')
  public async getEvent(@Body() requestBody: FindParams) {
    const response = await new DeviceService().getEvent(requestBody);
    return response.events;
  } 

}
