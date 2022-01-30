import { IHub } from '../models/hub.model';
import { AddOrRemoveUserParams, HubCreationParams, HubDeleteParams, HubService } from '../services/hub.service';
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
    cert: 'Client certificate',
  })
  @Response<IError>(401, 'Unauthorized', {
    message: 'No token provided',
  })
  public async getHubs(): Promise<IHub[]> {
    const response: IHub[] = await new HubService().getHubs();
    return response;
  }

  @Get('getHubsByUserId')
  @Security('jwt', ['customer'])
  public async getHubsByUserId(@Query() userId: string): Promise<IHub[]> {
    const response: IHub[] = await new HubService().getHubsByUserId(userId);
    return response;
  }

  /**
   * @param requestBody description of the request body
   * @example requestBody {
   *    "hubName": "myHub",
   *    "ownerId": ["gta90jwerkjm390srdsj3azt9"],
   *    "userIds": ["fga90zwerkse390srdsj4azt1", "tjg56jwerkwe780srdsj3akk5"]
   * }
   */
  @Post('createHub')
  @Security('jwt', ['customer'])
  @Example<IHub>({
    hubId: 'msa90jalkjm390ßasj3apok4',
    hubName: 'MyHub',
    ownerId: 'gta90jwerkjm390srdsj3azt9',
    memberIds: ['gta90jwerkjm390srdsj3azt9', 'msa90jalkjm390ßasj3apok4'],
    cert: 'Client certificate',
  })
  @Response<IError>(401, 'Unauthorized', {
    message: 'No token provided',
  })
  @Response<IError>(404, 'Bad Request', {
    message: 'Hub could not be created',
  })
  public async createHub(@Body() requestBody: HubCreationParams): Promise<IHub> {
    const response: IHub = await new HubService().createHub(requestBody);
    return response;
  }

  /**
   * @param requestBody description of the request body
   * @example requestBody {
   *    "hubId": "msa90jalkjm390ßasj3apok4"
   * }
   */
  @Delete('deleteHub')
  @Security('jwt', ['customer'])
  @Example<IHub>({
    hubId: 'msa90jalkjm390ßasj3apok4',
    hubName: 'MyHub',
    ownerId: 'gta90jwerkjm390srdsj3azt9',
    memberIds: ['gta90jwerkjm390srdsj3azt9', 'msa90jalkjm390ßasj3apok4'],
    cert: 'Client certificate',
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

  /**
   * @param requestBody Description for the request body object
   * @example requestBody {
   *    "hubId": "msa90jalkjm390ßasj3apok4",
   *    "memberIds": ["gta90jwerkjm390srdsj3azt9", "msa90jalkjm390ßasj3apok4"],
   *    "userId": ["fga90zwerkse390srdsj4azt1"]
   * }
   */
  @Patch('addUser')
  @Security('jwt', ['customer'])
  public async addUser(@Body() requestBody: AddOrRemoveUserParams): Promise<IHub> {
    const response: IHub = await new HubService().addUser(requestBody);
    return response;
  }

  /**
   * @param requestBody description of the request body
   * @example requestBody {
   *    "hubId": "msa90jalkjm390ßasj3apok4",
   *    "memberIds": ["gta90jwerkjm390srdsj3azt9", "msa90jalkjm390ßasj3apok4"],
   *    "userId": ["tjg56jwerkwe780srdsj3akk5"]
   * }
   */
  @Patch('removeUser')
  @Security('jwt', ['customer'])
  public async removeUser(@Body() requestBody: AddOrRemoveUserParams): Promise<IHub> {
    const response: IHub = await new HubService().removeUser(requestBody);
    return response;
  }

  @Get('cert')
  @Security('jwt', ['customer'])
  public async getCert(@Query() hubId: string): Promise<string> {
    const response: string = await new HubService().getCert(hubId);
    return response;
  }
}
