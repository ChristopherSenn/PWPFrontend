export class StatusError extends Error {
  status: number;
  data?: string;

  constructor(message: string, status: number, data?: string) {
    super(message);

    Object.setPrototypeOf(this, StatusError.prototype);
    this.status = status;
    this.data = data;
  }
}

export interface IError {
  message: string;
}

export interface IStatus {
  status: number;
  message: string;
}
