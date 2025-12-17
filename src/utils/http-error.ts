export class HttpError extends Error {
  statusCode: number;
  data: any;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;

    Error.captureStackTrace(this, this.constructor);
  }
}
