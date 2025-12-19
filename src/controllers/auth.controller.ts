import { Request, Response } from "express";
import { success } from "../utils/response";
import bcrypt from "bcrypt";
import accountService from "../services/account.service";
import jwt from "../utils/jwt";
import { TokenPayload } from "../types";
import { HttpError } from "../utils/http-error";
import { LoginResponse } from "../schemas/login.schema";

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const account = await accountService.getAccountByEmail(email);
  if (!account) {
    throw new HttpError(401, "Email atau password salah");
  }

  let isMatch = await bcrypt.compare(password, account.password);
  if (!isMatch) {
    throw new HttpError(401, "Email atau password salah");
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
};

export default {
  login,
};
