import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import { StatusError } from '../models/status.model';

export function expressAuthentication(request: express.Request, securityName: string, scopes?: string[]): Promise<any> {
  if (securityName === 'jwt') {
    const token = request.body.token || request.query.token || request.headers.authorization;

    return new Promise((resolve, reject) => {
      if (!token) {
        reject(new StatusError('No token provided', 401));
      }

      jwt.verify(token, process.env.JWT_SECRET || '', function (err, decoded) {
        if (err) {
          reject(new StatusError('Verification error!', 401, err.toString));
        } else {
          // Check if JWT contains all required scopes
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
