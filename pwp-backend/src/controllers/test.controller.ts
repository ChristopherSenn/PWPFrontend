import { ITest } from '../models/test.model';
import { TestService } from '../services/test.service';
import { Body, Controller, Get, Post, Route, Security, Tags } from 'tsoa';

@Route('tests')
@Tags('Tests')
export class TestController extends Controller {
  @Security('jwt', ['customer'])
  @Get()
  public async getTests(): Promise<ITest[]> {
    const response = await new TestService().getTests();
    return response;
  }

  @Post('createTest')
  public async createTest(@Body() requestBody: ITest): Promise<ITest> {
    const response: ITest = await new TestService().createTest(requestBody);
    return response;
  }
}
