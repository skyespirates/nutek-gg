import { Request, Response } from "express";
import { TokenPayload, History } from "../types";
import transactionService from "../services/transaction.service";
import { success } from "../utils/response";

async function list(req: Request, res: Response) {
  const { email } = req.user as TokenPayload;
  try {
    const trxHistory = await transactionService.list(email);
    success<History[]>(res, 200, "Get History Berhasil", trxHistory);
  } catch (error) {}
}

export default {
  list,
};
