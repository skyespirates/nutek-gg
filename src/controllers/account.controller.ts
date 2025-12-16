import { Request, Response } from "express";
import { success, failure } from "../utils/response";
import logger from "../utils/logger";
import accountService from "../services/account.service";
import {
  Balance,
  InvoicePayload,
  NewAccount,
  Payment,
  Profile,
  TokenPayload,
  TransactionPayload,
} from "../types";
import serviceService from "../services/service.service";
import pool from "../infra/db";
import transactionService from "../services/transaction.service";
import invoiceService from "../services/invoice.service";

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
  const conn = await pool.connect();
  try {
    await conn.query("BEGIN");
    // 1. update balance
    const succeed = await accountService.topup(conn, email, amount);
    if (!succeed) {
      failure(res, "failed on update balance", 400);
    }

    // 2. create invoice
    const invData: InvoicePayload = {
      transaction_type: "TOPUP",
      description: "Topup balance",
      total_amount: amount,
    };
    const inv = await invoiceService.create(conn, invData);
    if (!inv) {
      failure(res, "failed on create invoice", 500);
    }

    // 3. save transaction
    const trxData: TransactionPayload = {
      email,
      service_code: "TOPUP",
      invoice_number: inv.invoice_number,
    };
    const trx = await transactionService.save(conn, trxData);
    if (!trx) {
      failure(res, "failed to proceed payment: on save transaction", 500);
    }

    await conn.query("COMMIT");
    success(res, 200, "topup successfully", null);
  } catch (error) {
    await conn.query("ROLLBACK");
    logger.error(error);
    failure(res, "failed to topup", 500);
  } finally {
    conn.release();
  }
}

async function payment(req: Request, res: Response) {
  const { email } = req.user as TokenPayload;
  const { service_code } = req.body;
  const conn = await pool.connect();
  try {
    await conn.query("BEGIN");
    // 1. get service info
    const service = await serviceService.get(conn, service_code);
    if (!service) {
      failure(res, "Service atau Layanan tidak ditemukan", 400);
    }

    // 2. update balance
    const succeed = await accountService.payment(conn, email, service.tariff); // update balance
    if (!succeed) {
      failure(res, "failed to proceed payment: on save payment", 500);
    }

    // 3. create invoice
    const p: InvoicePayload = {
      transaction_type: "PAYMENT",
      description: service.name,
      total_amount: service.tariff,
    };
    const inv = await invoiceService.create(conn, p);
    if (!inv) {
      failure(res, "failed on create invoice", 500);
    }

    // 4. save transaction
    const data: TransactionPayload = {
      email,
      service_code: service.code,
      invoice_number: inv.invoice_number,
    };
    const result = await transactionService.save(conn, data); // store transaction info

    if (!result) {
      failure(res, "failed to proceed payment: on save transaction", 500);
    }

    const resp: Payment = {
      invoice_number: inv.invoice_number,
      service_code: service.code,
      service_name: service.name,
      transaction_type: inv.transaction_type,
      total_amount: service.tariff,
      created_on: inv.created_on,
    };

    success<Payment>(res, 200, "Transaksi berhasil", resp);

    await conn.query("COMMIT");
  } catch (error) {
    await conn.query("ROLLBACK");
    logger.error(error);
    failure(res, "Saldo tidak cukup", 400);
  } finally {
    conn.release();
  }
}

export default {
  createAccount,
  getProfile,
  updateProfile,
  uploadProfileImage,
  getBalance,
  topup,
  payment,
};
