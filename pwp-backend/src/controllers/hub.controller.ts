import { IHub } from '../models/hub.model';
import { HubService } from '../services/hub.service';
import { IError } from '../models/error.model';
import { Body, Controller, Get, Post, Delete, Patch, Route, Security, Tags, Example, Response } from 'tsoa';

@Route('hubs')
@Tags('Hubs')
export class HubController extends Controller {
  @Security('jwt', ['customer'])
  @Get()
  @Example<IHub>({
    hubId: 'msa90jalkjm390ßasj3apok4',
    hubName: 'MyHub',
    ownerId: 'gta90jwerkjm390srdsj3azt9',
    memberIds: ['gta90jwerkjm390srdsj3azt9', 'msa90jalkjm390ßasj3apok4'],
    deviceIds: ['gta90jwerkjm390srdsj3azt9', 'msa90jalkjm390ßasj3apok4'],
  })
  @Response<IError>(401, 'Unauthorized', {
    message: 'No token provided',
  })
  public async getHubs(): Promise<IHub[]> {
    const response = await new HubService().getHubs();
    return response;
  }

  @Post('createHub')
  public async createHub(@Body() requestBody: IHub): Promise<IHub> {
    const response: IHub = await new HubService().createHub(requestBody);
    return response;
  }

  @Delete('deleteHub')
  public async deleteHub(@Body() requestBody: IHub): Promise<IHub> {
    const response: IHub = await new HubService().deleteHub(requestBody);
    return response;
  }

  @Patch('addUser')
  public async addUser(@Body() requestBody: IHub): Promise<IHub> {
    const response: IHub = await new HubService().addUser(requestBody);
    return response;
  }

  @Patch('removeUser')
  public async removeUser(@Body() requestBody: IHub): Promise<IHub> {
    const response: IHub = await new HubService().removeUser(requestBody);
    return response;
  }

  @Patch('addDevice')
  public async addDevice(@Body() requestBody: IHub): Promise<IHub> {
    const response: IHub = await new HubService().addDevice(requestBody);
    return response;
  }

  @Patch('removeDevice')
  public async removeDevice(@Body() requestBody: IHub): Promise<IHub> {
    const response: IHub = await new HubService().removeDevice(requestBody);
    return response;
  }

  @Get('showIDandToken')
  public async showIDandToken(@Body() requestBody: IHub): Promise<IHub> {
    const response: IHub = await new HubService().showIDandToken(requestBody);
    return response;
  }
}
