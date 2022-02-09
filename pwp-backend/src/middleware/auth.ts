import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import { StatusError } from '../models/status.model';

// This is in large parts taken from the tsoa auth examples
export function expressAuthentication(request: express.Request, securityName: string, scopes?: string[]): Promise<any> {
  // Check if the Security mode of the Endpoint is set to jwt
  if (securityName === 'jwt') {
    const token = request.body.token || request.query.token || request.headers.authorization; // Try to get JWT Token from request

    return new Promise((resolve, reject) => {
      // If there is no Token reject with a 401
      if (!token) {
        reject(new StatusError('No token provided', 401));
      }

      // Verify if the token is valid
      // (There is no way around the any here I think)
      jwt.verify(token, process.env.JWT_SECRET || '', (err: any, decoded: any) => {
        // If not reject with an error
        if (err) {
          reject(new StatusError('Verification error!', 401, err.toString));
        } else {
          // Check if JWT contains all required scopes (roles)
          if (scopes !== undefined) {
            for (const scope of scopes) {
              if (!decoded.scopes.includes(scope)) {
                reject(new StatusError('JWT does not contain required scope.', 401));
              }
            }
          }
          resolve(decoded);
        }
      });
    });
  } else {
    return Promise.reject(new StatusError('Provide a valid jwt Token', 401));
  }
}
