import mongoose, { Schema, Model, Document } from 'mongoose';

interface IUser {
  username: string;
  email: string;
  password: string;
  enabled: string;
  id?: string;
  token?: string;
}

/* interface IResponse {
  status: number;
  message: string;
  data?: any;
} */

type UserDocument = Document & {
  username: string;
  email: string;
  password: string;
  enabled: string;
};

type UserInput = {
  username: UserDocument['username'];
  email: UserDocument['email'];
  password: UserDocument['password'];
  enabled: UserDocument['enabled'];
};

const usersSchema = new Schema(
  {
    username: {
      type: Schema.Types.String,
      required: true,
    },
    email: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    password: {
      type: Schema.Types.String,
      required: true,
    },
    enabled: {
      type: Schema.Types.Boolean,
      default: true,
    },
  },
  {
    collection: 'users',
    timestamps: true,
  }
);

const User: Model<UserDocument> = mongoose.model<UserDocument>('User', usersSchema);

export { User, UserInput, UserDocument, IUser };
