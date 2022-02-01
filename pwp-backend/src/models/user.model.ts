import mongoose, { Schema, Model, Document } from 'mongoose';

/**
 * Representation of a database user without unneccessary information. This is used to handle users throughout the app and is returned from API calls in most cases
 */
interface IUser {
  username: string;
  email: string;
  password: string;
  enabled: string;
  roles: Array<'customer' | 'manufacturer' | 'admin'>;
  id?: string;
  token?: string;
}

// The representation of a database user (Contains extra metadata)
type UserDocument = Document & {
  username: string;
  email: string;
  password: string;
  enabled: string;
  roles: Array<'customer' | 'manufacturer' | 'admin'>;
};

// The UserInput type makes it easier to create new users
type UserInput = {
  username: UserDocument['username'];
  email: UserDocument['email'];
  password: UserDocument['password'];
  enabled: UserDocument['enabled'];
  roles: UserDocument['roles'];
};

// Definition of a User in the database
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
