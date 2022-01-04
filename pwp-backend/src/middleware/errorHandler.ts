import { Request, Response, NextFunction } from 'express';
import { ValidateError } from 'tsoa';
import { StatusError } from '../models/error.model';

/**
 * This middleware checks, if any error has been thrown or any promise has been rejected.
 * If so, it sends a http response with the error
 * @param err Error that might be thrown or rejected in another middleware / endpoint
 * @param req Express request object
 * @param res Express response object
 * @param next Next function that calls the next middleware
 * @returns Http Response with the corresponding error or void if there is none
 */
export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction): Response | void {
  if (err instanceof StatusError) {
    return res.status(err.status).json({
      message: err.message,
    });
  } else if (err instanceof ValidateError) {
    return res.status(400).json({
      message: 'Validation Error! Please submit a fitting role',
    });
  } else if (err instanceof Error) {
    return res.status(401).json({
      message: err.message,
    });
  }

  next();
}
