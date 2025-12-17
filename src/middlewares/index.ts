import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { z, ZodError } from "zod";

import { failure } from "../utils/response";
import jwt from "jsonwebtoken";
import logger from "../utils/logger";
import multer from "multer";
import { TokenPayload } from "../types";
import { HttpError } from "../utils/http-error";

export function validateData(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          message: `${issue.path.join(".")} is ${issue.message}`,
        }));
        throw new HttpError(400, errorMessages[0].message);
      } else {
        throw new HttpError(500, "internal server error");
      }
    }
  };
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    // throw new HttpError(401, "Authentication token missing");
    throw new HttpError(401, "Token tidak valid atau kadaluwarsa");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = payload as TokenPayload;
    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      throw new HttpError(401, "Token tidak valid atau kadaluwarsa");
    }

    throw new HttpError(401, "Token tidak valid atau kadaluwarsa");
  }
}

export function logging(req: Request, res: Response, next: NextFunction) {
  logger.info(`${req.method} ${req.url} ${req.path}`);
  res.on("finish", () => {
    logger.info(`${req.method} ${res.statusCode} ${req.url}`);
  });
  next();
}

export const errorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { statusCode, message } = err;
  if (err instanceof multer.MulterError) {
    failure(res, "Error multer cokkkk🥶");
  }

  if (err instanceof HttpError) {
    failure(res, message, statusCode);
  }

  failure(res, "internal server error", 500);

  next();
};
