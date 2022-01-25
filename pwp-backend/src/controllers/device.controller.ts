import { Body, Controller, Get, Post, Route, Security, Tags, Example, Response, Delete, Request, Query, SuccessResponse  } from 'tsoa';
import { IError } from '../models/error.model';
import {  IDevice } from '../models/device.model';
import { DeviceService, DeviceDeleteParams, DeviceCreateParams } from '../services/device.service';

@Route('devices')
@Tags('Devices')

export class DeviceController extends Controller {

//Create Device Function is only allowed with token
@Security('jwt', ['customer'])
//Request to create a save a New Device into DB By HubId and Thing Desctiption
@Post('createDevice')
@SuccessResponse('201', 'Device Created')
@Response<IError>(400, 'Bad Request', {
  message: 'HubId or Thing Description in wrong Format',
})
public async createDevice(@Body() requestBody: DeviceCreateParams): Promise<IDevice> {
    const response: IDevice = await new DeviceService().createDevice(requestBody);
    return response;
  } 

//Create Device Function is only allowed with token
@Security('jwt', ['customer'])
//Delete device with HubId and DeviceId
@Delete('deleteDevice')
@SuccessResponse('201', 'Device sucessfully removed')
@Response<IError>(400, 'Bad Request', {
  message: 'Could not delete Device',
})
  public async deleteDevice(@Body() requestBody: DeviceDeleteParams): Promise<IDevice> {
    const response = await new DeviceService().deleteDevice(requestBody);
    this.setStatus(200);
    return response;
  }

//Request to get Device By HubId
@Get('getDeviceByHub')
  public async getDevice(@Query() hubId?: string): Promise<IDevice>  {
    const response = await new DeviceService().getDevice(hubId);
    return response;
  }  
//Request to get the Device with all Properties By DeviceName
@Get('getDeviceDetails')
  public async getDeviceDetails(@Query()  deviceName?: string): Promise<IDevice>  {
    const response = await new DeviceService().getDetails(deviceName);
    return response;
  }  
}
