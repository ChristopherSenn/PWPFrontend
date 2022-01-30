import bcryptjs from 'bcryptjs';
import { IUser, User, UserInput, UserDocument } from '../models/user.model';
import { StatusError } from '../models/status.model';
import signJWT from '../functions/signJWT';

export type UserCreationParams = Pick<IUser, 'email' | 'username' | 'password' | 'roles'>;
export type UserLoginParams = Pick<IUser, 'username' | 'password'>;

export class UserService {
  /**
   * Get all users in db
   * @returns A list of all users
   */
  public async get(): Promise<IUser[]> {
    // Get all users from db
    const users: UserDocument[] = await User.find().exec();

    // Parse UserDocument to IUsers (to only contain the information that is needed in the frontend)
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

    return parsedUsers; // Return users
  }

  /**
   * Get information about a specific user
   * @param userId Id of the user in question
   * @returns User Information
   */
  public async getUser(userId: string): Promise<IUser> {
    const user: UserDocument | null = await User.findById(userId).exec(); // Try to find user in db

    if (user !== null) {
      // parse UserDocument to IUser if found
      const parsedUser: IUser = {
        id: user._id,
        username: user.username,
        email: user.email,
        password: user.password,
        enabled: user.enabled,
        roles: user.roles,
      };
      return parsedUser; // Return user
    } else {
      // If user not found reject promise with an error
      return Promise.reject(new StatusError('User not found', 404));
    }
  }

  /**
   * Used to verify if the users provided credentials are correct and to log them in (create a JWT token)
   * @param UserLoginParams Contains the provided username and password
   * @returns The loggend in user object including the JWT Token or an error
   */
  public async login(UserLoginParams: UserLoginParams): Promise<IUser> {
    const { username, password } = UserLoginParams; // Store params from body in easier to access variables

    // Try to find the user in db by their username
    const users: UserDocument[] = await User.find({ username }).exec();

    // If the username does not exist (users.length === 0) or is duplicate (users.length > 1 - this should not be possible), throw an error
    if (users.length !== 1) {
      throw new StatusError('Wrong username or password..', 401);
    }

    return new Promise<IUser>((resolve, reject) => {
      // Compare the provided password to the hashed password from the database
      bcryptjs.compare(password, users[0].password, (error: Error, result: boolean) => {
        if (error) {
          // If some kind of error occurrs here, return a 500
          reject(new StatusError('Internal server error!', 500, error.stack));
        } else if (result) {
          // If result is true (the passwords match), sign a JWT Token for the user
          signJWT(users[0], (_error: Error | null, token: string | null) => {
            if (_error) {
              // If something goes wrong here return an error
              reject(new StatusError('Unauthorized', 401, _error.stack));
            } else if (token) {
              // Else resolve the promise and return the loggen in user including the JWT token
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
          // If the passwords don't match send a correspoinding message
          reject(new StatusError('Wrong username or password..', 401));
        }
      });
    });
  }

  /**
   * Registers a new user
   * @param userCreationParams Contains the neccessary information to create a new user
   * @returns The created user or an error
   */
  public async register(userCreationParams: UserCreationParams): Promise<IUser> {
    const { email, username, password, roles } = userCreationParams; // Store params from body in easier to access variables
    // If the provided password is to short, throw an error
    if (password.length < 8) {
      throw new StatusError('Password must be at least 8 digits long!', 401);
    }

    return new Promise<IUser>((resolve, reject) => {
      // Hash the password to not store it in the db in plain text
      bcryptjs.hash(password, 10, async (hashError: Error, hash: string) => {
        // If some error occurrs here, return a 500
        if (hashError) {
          reject(new StatusError('Internal server error!', 500, hashError.stack));
        }

        // Create a new UserInput object based on the input and the hashed password
        const userInput: UserInput = {
          username,
          email,
          password: hash,
          enabled: 'true',
          roles: roles || 'customer',
        };

        const userSchema = new User(userInput);
        try {
          const newUser = await userSchema.save(); // Save the new user to the db
          // Sign a new JWT Token for the user, so that they can be logged in immediately
          signJWT(newUser, (_error: Error | null, token: string | null) => {
            // If an error occurrs, return it
            if (_error) {
              reject(new StatusError('Unauthorized', 401, _error.stack));
            } else if (token) {
              // Else resolve the Promise with the new user and the JWT Token
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
          // If something goes wrong return a 401
          reject(new StatusError('User already exists!', 401, err.toString));
        }
      });
    });
  }
}
