export interface IResponse {
  status: number;
  message: string;
  data?: any;
}

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
