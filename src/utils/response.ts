import { Response } from "express";

interface IResponse<T> {
  status: number;
  message: string;
  data: T | null;
}

export function response<T>(
  res: Response,
  code: 200 | 201 | 400 | 401 | 500 = 200,
  status: number,
  message = "OK",
  data: T | null
) {
  const body: IResponse<T> = {
    status,
    message,
    data,
  };

  return res.status(code).json(body);
}
