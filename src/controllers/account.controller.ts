import { Request, Response } from "express";
import { success, failure } from "../utils/response";
import logger from "../utils/logger";
import accountService from "../services/account.service";
import { Balance, NewAccount, TokenPayload } from "../types";

async function createAccount(req: Request, res: Response) {
  const { email, first_name, last_name, password } = req.body;
  const account: NewAccount = {
    email,
    first_name,
    last_name,
    password,
  };
  try {
    const created = await accountService.createAccount(account);
    if (!created) {
      failure(res, "failed to register");
    }
    success(res, 201, "registered successfully", null);
  } catch (error) {
    logger.error(error);
    failure(res, "error: failed to register");
  }
}

async function getBalance(req: Request, res: Response) {
  const { email } = req.user as TokenPayload;
  try {
    const balance = await accountService.getBalance(email);
    success<Balance>(res, 200, "get balance", balance);
  } catch (error) {
    logger.error(error);
    failure(res, "failed to get balance", 500);
  }
}

async function topup(req: Request, res: Response) {
  const { email } = req.user as TokenPayload;
  const { amount } = req.body;
  try {
    const succeed = await accountService.topup(email, amount);
    if (!succeed) {
      failure(res, "failed to get balance", 400);
    }
    success(res, 200, "topup successfully", null);
  } catch (error) {
    logger.error(error);
    failure(res, "failed to get balance", 500);
  }
}

export default {
  createAccount,
  getBalance,
  topup,
};
