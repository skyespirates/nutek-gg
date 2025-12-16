import { Request, Response } from "express";
import { failure, success } from "../../utils/response";
import bcrypt from "bcrypt";
import accountService from "../../services/account.service";
import logger from "../../utils/logger";
import jwt from "../../utils/jwt";
import { LoginResponse, TokenPayload } from "../../types";

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const account = await accountService.getAccountByEmail(email);
    if (account == null) {
      failure(res, "invalid email or password", 401);
      return;
    }

    let isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      failure(res, "Username atau password salah", 401);
      return;
    }
    const payload: TokenPayload = {
      id: account.id,
      email: account.email,
    };
    const token = jwt.generateToken(payload);
    const response: LoginResponse = {
      token,
    };
    success<LoginResponse>(res, 200, "Login Sukses", response);
  } catch (error) {
    failure(res, "Parameter email tidak sesuai format", 400);
    logger.error(error);
  }
};

export default {
  login,
};
