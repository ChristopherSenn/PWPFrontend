import { Body, Controller, Get, Post, Route, Security, Tags, Example, Response, Delete, Request, Query  } from 'tsoa';
import { IError } from '../models/error.model';
import { Device, IDevice } from '../models/device.model';
import { DeviceService, DeviceDeleteParams, DeviceCreateParams } from '../services/device.service';


@Route('devices')
@Tags('Devices')

export class DeviceController extends Controller {
//@Security('jwt', ['customer'])

/* @Response<IError>(401, 'Unauthorized', {
    message: 'No token provided',
    }) */


@Post('createDevice')
  public async createDevice(@Body() requestBody: DeviceCreateParams): Promise<IDevice> {
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
    const response = await new DeviceService().getDevice(hubId);
    return response;
  }  

@Get('getDeviceDetails')
  public async getDeviceDetails( @Query()  deviceName?: string): Promise<IDevice>  {
    const response = await new DeviceService().getDetails(deviceName);
    return response;
  }  

}
