import { Response } from "express";

interface BaseResponse {
  status: number;
  message: string;
}

interface SuccessResponse<T> extends BaseResponse {
  status: 200 | 201 | 204;
  data: T;
}

interface FailedResponse extends BaseResponse {
  status: 400 | 401 | 403 | 404 | 409 | 422 | 500;
  data?: never;
}

export const success = <T>(
  res: Response,
  status: 200 | 201 = 200,
  message = "OK",
  data: T
) => {
  const body: SuccessResponse<T> = {
    status,
    message,
    data,
  };

  return res.status(status).json(body);
};

export const failure = (
  res: Response,
  message: string,
  status: FailedResponse["status"] = 400
) => {
  const body: FailedResponse = {
    status,
    message,
  };

  return res.status(status).json(body);
};
