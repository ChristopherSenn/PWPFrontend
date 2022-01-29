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
  Security
} from 'tsoa';
import { IError } from '../models/status.model';
import { IDevice } from '../models/device.model';
import { DeviceService, DeviceCreateParams, AddOrRemoveDeviceParams } from '../services/device.service';
import { IMqttMessage } from '../models/mqtt.model';

@Route('devices')
@Tags('Devices')
export class DeviceController extends Controller {
  // Create Device Function is only allowed with token
  @Security('jwt', ['customer'])
  // Request to create a save a New Device into DB By HubId and Thing Desctiption
  @Post('createDevice')
  @SuccessResponse('201', 'Device Created')
  @Example<IDevice>({
    id: '36f15cb1b5a93ffufvrb0701',
    thingDescription: {
      "@context": [
          "https://www.w3.org/2019/wot/td/v1",
          {
              "pwpref": "link zu unserem Server",
              "mqv": "http://www.example.org/mqtt-binding#"
          }
      ],
      "id": "uuid-prototype-1.0.1-mixer",
      "title": "MyMixerThing",
      "modes": [
          "MODE_OFFLINE",
          "MODE_AP_ONLY",
          "MODE_HUB_LOCAL",
          "MODE_HUB_INTERNET"
      ],
      "security": [
          "basic_sc"
      ],
      "properties": {
          "status": {
              "@type": "pwpref:ModeState",
              "type": "boolean",
              "observable": true,
              "forms": [
                  {
                      "href": "mqtt://pwp21.medien.ifi.lmu.de:8883/mixer-1/status",
                      "op": "observeProperty",
                      "mqv:controlPacketValue": "SUBSCRIBE"
                  }
              ]
          }
      },
      "actions": {
          "stir": {
              "@type": "pwpref:TimeCommand",
              "input": {
                  "type": "float"
              },
              "forms": [
                  {
                    "href": "mqtt://pwp21.medien.ifi.lmu.de:8883/mixer-1/stir",
                    "op": "invokeaction",
                    "mqv:controlPacketValue": "PUBLISH"
                  }
                ]
          }
      },
      "events": {
          "unexpectedturnoff": {
              "data": {
                  "type": "string"
              },
              "forms": [
                  {
                    "href": "mqtt://pwp21.medien.ifi.lmu.de:8883/mixer-1/unexpectedturnoff",
                    "op": ["invokeaction"],
                    "subscribeevent": "SUBSCRIBE"
                  }
                ]
          }
      }
  },
    deviceId: 'uuid-prototype-1.0.1-mixer',
    hubIds: ['61f15cb1b6a93ffbferb0905'],
    deviceName: 'MyMixerThing',
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
    properties: [
      {
        name: 'status',
        href: 'mqtt://pwp21.medien.ifi.lmu.de:8883/mixer-1/status',
        dataType: 'string',
        dataValue: 'Lorem Ipsum',
      },
    ],
  })
 //Error Handling
  @Response<IError>(400, 'Bad Request', {
    message: 'HubId or Thing Description in wrong Format',
  })
  public async createDevice(@Body() requestBody: DeviceCreateParams): Promise<IDevice> {
    const response: IDevice = await new DeviceService().createDevice(requestBody);
    return response;
  }
  // Delete device with DeviceId
  /**
   * !!!!!!!!!
   * Only use this if you want to remove a device completely.
   * If you just want to remove it from a hub, use removeDeviceFromHub instead!
   * !!!!!!!!!
   */
  // Delete Device Function is only allowed with token
  @Security('jwt', ['customer'])
  @Delete('deleteDevice')
  @SuccessResponse('201', 'Device sucessfully removed')
  @Example<IDevice>({
    id: '36f15cb1b5a93ffufvrb0701',
    thingDescription: "json content",
    deviceId: 'uuid-prototype-1.0.1-mixer',
    hubIds: ['61f15cb1b6a93ffbferb0905'],
    deviceName: 'MyMixerThing',
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
    properties: [
      {
        name: 'status',
        href: 'mqtt://pwp21.medien.ifi.lmu.de:8883/mixer-1/status',
        dataType: 'string',
        dataValue: 'Lorem Ipsum',
      },
    ],
  })
  //Error Handling
  @Response<IError>(404, 'Bad Request', {
    message: 'Device not found',
  })
  public async deleteDevice(@Query() deviceId: string): Promise<IDevice> {
    const response = await new DeviceService().deleteDevice(deviceId);
    this.setStatus(200);
    return response;
  }

  @Security('jwt', ['customer'])
  // Request to get Device By HubId
  @Get('getDeviceByHub')
  @SuccessResponse('200', 'OK')
  @Example<IDevice>({
    id: '36f15cb1b5a93ffufvrb0701',
    thingDescription: "json content",
    deviceId: 'uuid-prototype-1.0.1-mixer',
    hubIds: ['61f15cb1b6a93ffbferb0905'],
    deviceName: 'MyMixerThing',
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
    properties: [
      {
        name: 'status',
        href: 'mqtt://pwp21.medien.ifi.lmu.de:8883/mixer-1/status',
        dataType: 'string',
        dataValue: 'Lorem Ipsum',
      },
    ],
  })
  //Error Handling
  @Response<IError>(404, 'Bad Request', {
    message: 'HubId not found',
  })
  public async getDevice(@Query() hubId: string): Promise<IDevice[]> {
    const response = await new DeviceService().getDevice(hubId);
    return response;
  }

  @Security('jwt', ['customer'])
  // Request to get the Device with all Properties By DeviceName
  @Get('getDeviceDetails')
  @SuccessResponse('201', 'Device sucessfully removed')
  @Example<IDevice>({
    id: '36f15cb1b5a93ffufvrb0701',
    thingDescription: "json content",
    deviceId: 'uuid-prototype-1.0.1-mixer',
    hubIds: ['61f15cb1b6a93ffbferb0905'],
    deviceName: 'MyMixerThing',
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
    properties: [
      {
        name: 'status',
        href: 'mqtt://pwp21.medien.ifi.lmu.de:8883/mixer-1/status',
        dataType: 'string',
        dataValue: 'Lorem Ipsum',
      },
    ],
  })
  //Error Handling
  @Response<IError>(404, 'Bad Request', {
    message: 'Device not found',
  })
  public async getDeviceDetails(@Query() deviceId: string): Promise<IDevice> {
    const response = await new DeviceService().getDetails(deviceId);
    return response;
  }

  @Security('jwt', ['customer'])
  // Add a device to a Hub By userId, hubId and deviceId
  @Patch('addDeviceToHub')
  @SuccessResponse('201', 'Device has been sucessfully added to Hub')
  @Example<IDevice>({
    id: '36f15cb1b5a93ffufvrb0701',
    thingDescription: "json content",
    deviceId: 'uuid-prototype-1.0.1-mixer',
    hubIds: ['61f15cb1b6a93ffbferb0905'],
    deviceName: 'MyMixerThing',
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
    properties: [
      {
        name: 'status',
        href: 'mqtt://pwp21.medien.ifi.lmu.de:8883/mixer-1/status',
        dataType: 'string',
        dataValue: 'Lorem Ipsum',
      },
    ],
  })
  //Error Handling
  @Response<IError>(404, 'Bad Request', {
    message: 'Device not found',
  })
  public async addDevice(@Body() requestBody: AddOrRemoveDeviceParams): Promise<IDevice> {
    const response: IDevice = await new DeviceService().addDevice(requestBody);
    return response;
  }

  @Security('jwt', ['customer'])
  // Remove a device from a Hub By userId, hubId and deviceId
  @Patch('removeDeviceFromHub')
  @SuccessResponse('201', 'Device sucessfully removed form Hub')
  @Example<IDevice>({
    id: '36f15cb1b5a93ffufvrb0701',
    thingDescription: "json content",
    deviceId: 'uuid-prototype-1.0.1-mixer',
    hubIds: ['61f15cb1b6a93ffbferb0905'],
    deviceName: 'MyMixerThing',
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
    properties: [
      {
        name: 'status',
        href: 'mqtt://pwp21.medien.ifi.lmu.de:8883/mixer-1/status',
        dataType: 'string',
        dataValue: 'Lorem Ipsum',
      },
    ],
  })
  //Error Handling
  @Response<IError>(404, 'Bad Request', {
    message: 'Device not found',
  })
  public async removeDevice(@Body() requestBody: AddOrRemoveDeviceParams): Promise<IDevice> {
    const response: IDevice = await new DeviceService().removeDevice(requestBody);
    return response;
  }

  @Security('jwt', ['customer'])
  //Update Event Value to perform an event on hardware tool By inserting deviceId, mqtt topic and  message
  @Patch('updateEventValue')
  @SuccessResponse('201', 'Event Value sucessfully updated')
  @Example<IDevice>({
    id: '36f15cb1b5a93ffufvrb0701',
    thingDescription: "json content",
    deviceId: 'uuid-prototype-1.0.1-mixer',
    hubIds: ['61f15cb1b6a93ffbferb0905'],
    deviceName: 'MyMixerThing',
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
    properties: [
      {
        name: 'status',
        href: 'mqtt://pwp21.medien.ifi.lmu.de:8883/mixer-1/status',
        dataType: 'string',
        dataValue: 'Lorem Ipsum',
      },
    ],
  })
  //Error Handling
  @Response<IError>(404, 'Bad Request', {
    message: 'Database Error',
  })
  public async updateEventValue(@Body() requestBody: IMqttMessage): Promise<IDevice> {
    const response: IDevice = await new DeviceService().updateEventValue(requestBody);
    return response;
  }
}
