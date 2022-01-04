import bcryptjs from 'bcryptjs';
import { IUser, User, UserInput, UserDocument } from '../models/user.model';
import { StatusError } from '../models/error.model';
import signJWT from '../functions/signJWT';

export type UserCreationParams = Pick<IUser, 'email' | 'username' | 'password' | 'roles'>;
export type UserLoginParams = Pick<IUser, 'username' | 'password'>;

export class UserService {
  public async get(): Promise<IUser[]> {
    const users: UserDocument[] = await User.find().populate('enabled').exec();

    const parsedUsers: IUser[] = users.map((user) => {
      return {
        id: user._id,
        username: user.username,
        email: user.email,
        password: user.password,
        enabled: user.enabled,
        roles: user.roles,
      };
    });

    return parsedUsers;
  }

  public async login(UserLoginParams: UserLoginParams): Promise<IUser> {
    const { username, password } = UserLoginParams;

    const users: UserDocument[] = await User.find({ username }).exec();

    if (users.length !== 1) {
      throw new StatusError('Wrong username or password..', 401);
    }

    return new Promise<IUser>((resolve, reject) => {
      bcryptjs.compare(password, users[0].password, (error: Error, result: boolean) => {
        if (error) {
          reject(new StatusError('Internal server error!', 500, error.stack));
        } else if (result) {
          signJWT(users[0], (_error: Error | null, token: string | null) => {
            if (_error) {
              reject(new StatusError('Unauthorized', 401, _error.stack));
            } else if (token) {
              resolve({
                id: users[0]._id,
                token,
                username: users[0].username,
                email: users[0].email,
                password: users[0].password,
                enabled: users[0].enabled,
                roles: users[0].roles,
              });
            }
          });
        } else {
          reject(new StatusError('Wrong username or password..', 401));
        }
      });
    });
  }

  public async register(userCreationParams: UserCreationParams): Promise<IUser> {
    const { email, username, password, roles } = userCreationParams;
    if (password.length < 8) {
      throw new StatusError('Password must be at least 8 digits long!', 401);
    }

    return new Promise<IUser>((resolve, reject) => {
      bcryptjs.hash(password, 10, async (hashError: Error, hash: string) => {
        if (hashError) {
          reject(new StatusError('Internal server error!', 500, hashError.stack));
        }

        const userInput: UserInput = {
          username,
          email,
          password: hash,
          enabled: 'true',
          roles: roles || 'customer',
        };

        const userSchema = new User(userInput);
        try {
          const newUser = await userSchema.save();
          signJWT(newUser, (_error: Error | null, token: string | null) => {
            if (_error) {
              reject(new StatusError('Unauthorized', 401, _error.stack));
            } else if (token) {
              resolve({
                id: newUser._id,
                token,
                username: newUser.username,
                email: newUser.email,
                password: newUser.password,
                enabled: newUser.enabled,
                roles: newUser.roles,
              });
            }
          });
        } catch (err: any) {
          reject(new StatusError('User already exists!', 401, err.toString));
        }
      });
    });
  }
}
