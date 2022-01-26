import { HubCredentials, IHub } from '../models/hub.model';
import { AddOrRemoveDeviceParams, AddOrRemoveUserParams, HubDeleteParams, HubService } from '../services/hub.service';
import { IError } from '../models/status.model';
import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Route,
  Security,
  Tags,
  Example,
  Response,
  SuccessResponse,
  Query,
} from 'tsoa';

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
    const response: IHub[] = await new HubService().getHubs();
    return response;
  }

  @Get('getHubsByUserId')
  public async getHubsByUserId(@Query() userId: string): Promise<IHub[]> {
    const response: IHub[] = await new HubService().getHubsByUserId(userId);
    return response;
  }

  @Post('createHub')
  // @Security('jwt', ['customer'])
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
  @Response<IError>(404, 'Bad Request', {
    message: 'Hub could not be created',
  })
  public async createHub(@Body() requestBody: IHub): Promise<IHub> {
    const response: IHub = await new HubService().createHub(requestBody);
    return response;
  }

  @Delete('deleteHub')
  @Security('jwt', ['customer'])
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
  @Response<IError>(404, 'Not found', {
    message: 'Hub not found',
  })
  @SuccessResponse('200', 'Success')
  public async deleteHub(@Body() requestBody: HubDeleteParams): Promise<IHub> {
    const response = await new HubService().deleteHub(requestBody);
    this.setStatus(200);
    return response;
  }

  @Patch('addUser')
  public async addUser(@Body() requestBody: AddOrRemoveUserParams): Promise<IHub> {
    const response: IHub = await new HubService().addUser(requestBody);
    return response;
  }

  @Patch('removeUser')
  public async removeUser(@Body() requestBody: AddOrRemoveUserParams): Promise<IHub> {
    const response: IHub = await new HubService().removeUser(requestBody);
    return response;
  }

  @Patch('addDevice')
  public async addDevice(@Body() requestBody: AddOrRemoveDeviceParams): Promise<IHub> {
    const response: IHub = await new HubService().addDevice(requestBody);
    return response;
  }

  @Patch('removeDevice')
  public async removeDevice(@Body() requestBody: AddOrRemoveDeviceParams): Promise<IHub> {
    const response: IHub = await new HubService().removeDevice(requestBody);
    return response;
  }

  @Get('showIDandToken')
  public async showIDandToken(@Query() hubId: string): Promise<HubCredentials> {
    const response: HubCredentials = await new HubService().showIDandToken(hubId);
    return response;
  }
}
