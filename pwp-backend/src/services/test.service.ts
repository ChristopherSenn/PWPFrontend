import { StatusError } from '../models/status.model';
import { ITest, TestDocument, Test, TestInput } from '../models/test.model';

export class TestService {
  public async getTests(): Promise<ITest[]> {
    const tests: TestDocument[] = await Test.find().exec();

    const parsedTests: ITest[] = tests.map((test) => {
      return {
        test1: test.test1,
        userId: test.userId,
      };
    });

    return parsedTests;
  }

  public async createTest(requestBody: ITest): Promise<ITest> {
    const { test1, userId } = requestBody;

    if (test1 === '') {
      throw new StatusError('test1 must not be an empty string', 404);
    }

    const testInput: TestInput = {
      test1,
      userId,
    };

    const testSchema = new Test(testInput);
    const newTest: TestDocument = await testSchema.save();
    const parsedTest: ITest = newTest;
    return parsedTest;
  }
}
