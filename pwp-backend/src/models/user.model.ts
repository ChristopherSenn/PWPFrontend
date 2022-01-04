import mongoose, { Schema, Model, Document } from 'mongoose';

interface IUser {
  username: string;
  email: string;
  password: string;
  enabled: string;
  roles: Array<'customer' | 'manufacturer' | 'admin'>;
  id?: string;
  token?: string;
}

type UserDocument = Document & {
  username: string;
  email: string;
  password: string;
  enabled: string;
  roles: Array<'customer' | 'manufacturer' | 'admin'>;
};

type UserInput = {
  username: UserDocument['username'];
  email: UserDocument['email'];
  password: UserDocument['password'];
  enabled: UserDocument['enabled'];
  roles: UserDocument['roles'];
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
    roles: {
      type: [Schema.Types.String],
      enum: ['customer', 'manufacturer', 'admin'],
      default: ['customer'],
      required: true,
    },
  },
  {
    collection: 'users',
    timestamps: true,
  }
);

const User: Model<UserDocument> = mongoose.model<UserDocument>('User', usersSchema);

export { User, UserInput, UserDocument, IUser };
