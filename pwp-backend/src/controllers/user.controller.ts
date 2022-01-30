import { Body, Security, Controller, Get, Path, Post, Route, SuccessResponse, Tags, Example, Response } from 'tsoa';
import { IUser } from '../models/user.model';
import { UserCreationParams, UserLoginParams, UserService } from '../services/user.service';
import { IError } from '../models/status.model';

@Route('users')
@Tags('Users')
export class UserController extends Controller {
  @Security('jwt', ['customer'])
  @Get('{userId}')
  @Example<IUser>({
    id: 'msa90jalkjm390ßasj3apok4',
    username: 'John Doe',
    email: 'example@mail.com',
    password: 'hashed password',
    enabled: 'true',
    roles: ['customer'],
  })
  @Response<IError>(401, 'Unauthorized', {
    message: 'No token provided',
  })
  @Response<IError>(404, 'Not found', {
    message: 'User not found',
  })
  public async getUser(@Path() userId: string): Promise<IUser> {
    return new UserService().getUser(userId);
  }

  @Security('jwt', ['customer'])
  @Get()
  @Example<IUser>({
    id: 'msa90jalkjm390ßasj3apok4',
    username: 'John Doe',
    email: 'example@mail.com',
    password: 'hashed password',
    enabled: 'true',
    roles: ['customer'],
  })
  @Response<IError>(401, 'Unauthorized', {
    message: 'No token provided',
  })
  public async getUsers(): Promise<IUser[]> {
    const response = await new UserService().get();
    return response;
  }

  @Post('register')
  @SuccessResponse('201', 'Created')
  @Example<IUser>({
    id: 'msa90jalkjm390ßasj3apok4',
    username: 'John Doe',
    email: 'example@mail.com',
    password: 'hashed password',
    enabled: 'true',
    roles: ['customer'],
    token: 'JWT Token',
  })
  @Response<IError>(401, 'Unauthorized')
  @Response<IError>(400, 'Validation Error')
  public async register(@Body() requestBody: UserCreationParams): Promise<IUser> {
    const user: IUser = await new UserService().register(requestBody);

    this.setStatus(201);
    return user;
  }

  @Post('login')
  @SuccessResponse('200', 'Success')
  @Example<IUser>({
    id: 'msa90jalkjm390ßasj3apok4',
    username: 'John Doe',
    email: 'example@mail.com',
    password: 'hashed password',
    enabled: 'true',
    roles: ['customer'],
    token: 'JWT Token',
  })
  @Response<IError>(401, 'Unauthorized', {
    message: 'Wrong username or password...',
  })
  public async login(@Body() requestBody: UserLoginParams): Promise<IUser> {
    const response: IUser = await new UserService().login(requestBody);
    this.setStatus(200);
    return response;
  }
}
