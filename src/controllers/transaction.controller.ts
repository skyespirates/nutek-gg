import { Request, Response } from "express";
import { TokenPayload, History } from "../types";
import transactionService from "../services/transaction.service";
import { response } from "../utils/response";
import { z } from "zod";
import { HistoryQuerySchema } from "../schemas";
import logger from "../utils/logger";
import { TransactionHistoryResponse } from "../schemas/transaction.schema";

async function list(req: Request, res: Response) {
  try {
    const { offset, limit } = HistoryQuerySchema.parse(req.query);

    const { email } = req.user as TokenPayload;
    const trxHistory = await transactionService.list(email, offset, limit);
    const resp: TransactionHistoryResponse = {
      offset,
      limit,
      records: trxHistory,
    };
    response<TransactionHistoryResponse>(
      res,
      200,
      0,
      "Get History Berhasil",
      resp
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map((issue: any) => ({
        message: `${issue.path.join(".")} is ${issue.message}`,
      }));
      response<null>(res, 400, 102, errorMessages[0].message, null);
    }

    logger.error(error);
    response<null>(res, 500, 103, "internal server error", null);
  }
}

export default {
  list,
};
