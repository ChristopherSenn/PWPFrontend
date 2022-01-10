import mongoose, { Schema, Model, Document } from 'mongoose';

interface ITest {
  test1: string;
  userId: string;
}

type TestDocument = Document & {
  test1: string;
  userId: string;
};

type TestInput = {
  test1: TestDocument['test1'];
  userId: TestDocument['userId'];
};

const testSchema = new Schema(
  {
    test1: {
      type: Schema.Types.String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    collection: 'tests',
    timestamps: true,
  }
);

const Test: Model<TestDocument> = mongoose.model<TestDocument>('Test', testSchema);

export { Test, TestInput, TestDocument, ITest };
