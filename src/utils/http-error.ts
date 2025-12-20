export class HttpError extends Error {
  code: 400 | 401 | 409 | 500;
  status: number;
  data: any;

  constructor(code: 400 | 401 | 409 | 500, status: number, message: string) {
    super(message);
    this.code = code;
    this.status = status;
    this.data = null;

    Error.captureStackTrace(this, this.constructor);
  }
}
