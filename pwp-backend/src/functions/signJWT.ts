import jwt from 'jsonwebtoken';
// import { UserDocument } from 'src/models/user.model';
import { IUser } from '../models/user.model';

/**
 * Creates a JWT Token for a given User Instance
 * @param user User Instance that a token should be created for
 * @param callback Callback Function with params depending on the result of the process
 */

const signJWT = (user: IUser, callback: (error: Error | null, token: string | null) => void): void => {
  // Calculate Expiration time of token
  const timeSinceEpoch = new Date().getTime();
  const expirationTime = timeSinceEpoch + Number(process.env.JWT_EXPIRETIME || 3600) * 10000;
  const expirationTimeInSeconds = Math.floor(expirationTime / 1000);

  try {
    jwt.sign(
      {
        username: user.username, // Use username as input
        scopes: user.roles,
      },
      process.env.JWT_SECRET || '', // Secret from dotenv
      {
        issuer: process.env.JWT_ISSUER,
        algorithm: 'HS256',
        expiresIn: expirationTimeInSeconds,
      },
      (error, token) => {
        if (error) {
          // If something goes wron call callback with the error
          callback(error, null);
        } else if (token) {
          // Else pass on the token
          callback(null, token);
        }
      }
    );
  } catch (error: Error | any) {
    // If something goes wron call callback with the error
    callback(error, null);
  }
};

export default signJWT;
