import { Request, Response } from "express";
import { TokenPayload, History } from "../types";
import transactionService from "../services/transaction.service";
import { failure, success } from "../utils/response";
import { z } from "zod";
import { HistoryQuerySchema } from "../schemas";
import logger from "../utils/logger";

async function list(req: Request, res: Response) {
  try {
    const { offset, limit } = HistoryQuerySchema.parse(req.query);

    const { email } = req.user as TokenPayload;
    const trxHistory = await transactionService.list(email, offset, limit);
    success<History[]>(res, 200, "Get History Berhasil", trxHistory);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((issue: any) => ({
        message: `${issue.path.join(".")} is ${issue.message}`,
      }));
      failure(res, errorMessages[0].message, 400);
    }

    logger.error(error);
    failure(res, "internal server error", 500);
  }
}

export default {
  list,
};
