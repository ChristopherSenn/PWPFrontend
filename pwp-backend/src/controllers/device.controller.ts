import {
  Body,
  Controller,
  Get,
  Post,
  Route,
  Tags,
  Example,
  Response,
  Delete,
  Query,
  SuccessResponse,
  Patch,
  Security,
} from 'tsoa';
import { IError } from '../models/status.model';
import { IDevice } from '../models/device.model';
import { DeviceService, DeviceCreateParams, AddOrRemoveDeviceParams } from '../services/device.service';
import { IMqttMessage } from '../models/mqtt.model';

@Route('devices')
@Tags('Devices')
export class DeviceController extends Controller {
  // Create Device Function is only allowed with token
  // @Security('jwt', ['customer'])
  // Request to create a save a New Device into DB By HubId and Thing Desctiption
  @Post('createDevice')
  @SuccessResponse('201', 'Device Created')
  @Example<IDevice>({
    hubIds: ['1234'],
    thingDescription: {
      '@context': [
        'https://www.w3.org/2019/wot/td/v1',
        {
          pwpref: 'link zu unserem Server',
          mqv: 'http://www.example.org/mqtt-binding#',
        },
      ],
      id: 'uuid-prototype-1.0.1-mixer',
      title: 'MyMixerThing',
      '@type': 'pwpref:Mixer',
      securityDefinitions: {
        basic_sc: {
          scheme: 'basic',
          in: 'header',
        },
      },
      modes: ['MODE_OFFLINE', 'MODE_AP_ONLY', 'MODE_HUB_LOCAL', 'MODE_HUB_INTERNET'],
      security: ['basic_sc'],
      properties: {
        status: {
          '@type': 'pwpref:ModeState',
          type: 'boolean',
          observable: true,
          forms: [
            {
              href: 'mqtt://pwp21.medien.ifi.lmu.de:8883/mixer-1/status',
              op: 'observeProperty',
              'mqv:controlPacketValue': 'SUBSCRIBE',
            },
          ],
        },
      },
      actions: {
        name: 'stir',
        href: 'mqtt://pwp21.medien.ifi.lmu.de:8883/mixer-1/status',
        actionType: 'TimeCommand',
        inputType: 'float',
      },
      events: {
        name: 'status',
        href: 'mqtt://pwp21.medien.ifi.lmu.de:8883/mixer-1/status',
        dataType: 'string',
      },
    },
    deviceName: 'MyMixerThing',
    deviceId: 'uuid-prototype-1.0.1-mixer',
    actions: [
      {
        name: 'stir',
        href: 'mqtt://pwp21.medien.ifi.lmu.de:8883/mixer-1/status',
        actionType: 'TimeCommand',
        inputType: 'float',
      },
    ],
    events: [
      {
        name: 'status',
        href: 'mqtt://pwp21.medien.ifi.lmu.de:8883/mixer-1/status',
        dataType: 'string',
        dataValue: 'Lorem Ipsum',
      },
    ],
  })
  @Response<IError>(400, 'Bad Request', {
    message: 'HubId or Thing Description in wrong Format',
  })
  public async createDevice(@Body() requestBody: DeviceCreateParams): Promise<IDevice> {
    const response: IDevice = await new DeviceService().createDevice(requestBody);
    return response;
  }

  // Create Device Function is only allowed with token
  // @Security('jwt', ['customer'])
  // Delete device with HubId and DeviceId
  /**
   * !!!!!!!!!
   * Only use this if you want to remove a device completely.
   * If you just want to remove it from a hub, use removeDeviceFromHub instead!
   * !!!!!!!!!
   */
  @Delete('deleteDevice')
  @SuccessResponse('201', 'Device sucessfully removed')
  @Response<IError>(400, 'Bad Request', {
    message: 'Could not delete Device',
  })
  public async deleteDevice(@Query() deviceId: string): Promise<IDevice> {
    const response = await new DeviceService().deleteDevice(deviceId);
    this.setStatus(200);
    return response;
  }

  // Request to get Device By HubId
  @Get('getDeviceByHub')
  public async getDevice(@Query() hubId: string): Promise<IDevice[]> {
    const response = await new DeviceService().getDevice(hubId);
    return response;
  }

  // Request to get the Device with all Properties By DeviceName
  @Get('getDeviceDetails')
  public async getDeviceDetails(@Query() deviceId: string): Promise<IDevice> {
    const response = await new DeviceService().getDetails(deviceId);
    return response;
  }

  @Patch('addDeviceToHub')
  public async addDevice(@Body() requestBody: AddOrRemoveDeviceParams): Promise<IDevice> {
    const response: IDevice = await new DeviceService().addDevice(requestBody);
    return response;
  }

  @Patch('removeDeviceFromHub')
  public async removeDevice(@Body() requestBody: AddOrRemoveDeviceParams): Promise<IDevice> {
    const response: IDevice = await new DeviceService().removeDevice(requestBody);
    return response;
  }

  @Security('jwt', ['customer'])
  @Patch('updateEventValue')
  @Response<IError>(404, 'Not Found')
  @Response<IError>(401, 'Unauthorized')
  public async updateEventValue(@Body() requestBody: IMqttMessage): Promise<IDevice> {
    const response: IDevice = await new DeviceService().updateDeviceValue(requestBody);
    return response;
  }
}
