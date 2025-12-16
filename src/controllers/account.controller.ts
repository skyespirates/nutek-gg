import { Request, Response } from "express";
import { success, failure } from "../utils/response";
import logger from "../utils/logger";
import accountService from "../services/account.service";
import { Balance, NewAccount, Profile, TokenPayload } from "../types";

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
    success(res, 201, "Registrasi berhasil silahkan login", null);
  } catch (error) {
    logger.error(error);
    failure(res, "Parameter email tidak sesuai format", 400);
  }
}

async function getProfile(req: Request, res: Response) {
  const { email } = req.user as TokenPayload;
  logger.info(email);
  try {
    const account = await accountService.getAccountByEmail(email);
    if (!account) {
      failure(res, "Token tidak tidak valid atau kadaluwarsa", 401);
    }
    const data: Profile = {
      email: account.email,
      first_name: account.first_name,
      last_name: account.last_name,
      profile_image: account.profile_image || "",
    };

    success(res, 200, "Sukses", data);
  } catch (error) {
    logger.error(error);
    failure(res, "Token tidak tidak valid atau kadaluwarsa", 401);
  }
}

async function updateProfile(req: Request, res: Response) {
  const { email } = req.user as TokenPayload;
  const { first_name, last_name } = req.body;
  try {
    const profile = await accountService.updateProfile(
      first_name,
      last_name,
      email
    );

    if (!profile.profile_image) {
      profile.profile_image = "";
    }
    success<Profile>(res, 200, "Update Pofile berhasil", profile);
  } catch (error) {
    logger.error(error);
    failure(res, "failed to update profile", 500);
  }
}

async function uploadProfileImage(req: Request, res: Response) {
  const { email } = req.user as TokenPayload;
  const baseUrl = "http://localhost:3000/";
  try {
    const imageUrl = baseUrl + req.file?.originalname;
    const profile = await accountService.updateProfileImage(imageUrl, email);

    if (!profile) {
      failure(res, "failed to update profile image", 400);
    }
    success<Profile>(res, 200, "Update Profile Image berhasil", profile!);
  } catch (error) {
    logger.error(error);
    failure(res, "failed to upload file", 500);
  }
}

async function getBalance(req: Request, res: Response) {
  const { email } = req.user as TokenPayload;
  const balance = await accountService.getBalance(email);
  success<Balance>(res, 200, "get balance", balance);
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
  getProfile,
  updateProfile,
  uploadProfileImage,
  getBalance,
  topup,
};
