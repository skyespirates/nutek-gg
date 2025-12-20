import { Request, Response } from "express";
import { response } from "../utils/response";
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
import { HttpError } from "../utils/http-error";
import { RegisterResponse } from "../schemas/register.schema";

async function createAccount(req: Request, res: Response) {
  const { email, first_name, last_name, password } = req.body;
  const account: NewAccount = {
    email,
    first_name,
    last_name,
    password,
  };
  const created = await accountService.createAccount(account);
  if (!created) {
    throw new HttpError(400, 102, "Parameter email tidak sesuai format");
  }
  response<RegisterResponse>(
    res,
    201,
    0,
    "Registrasi berhasil silahkan login",
    null
  );
}

async function getProfile(req: Request, res: Response) {
  const { email } = req.user as TokenPayload;
  logger.info(email);
  const account = await accountService.getAccountByEmail(email);
  const data: Profile = {
    email: account.email,
    first_name: account.first_name,
    last_name: account.last_name,
    profile_image: account.profile_image || "",
  };

  response<Profile>(res, 200, 0, "Sukses", data);
}

async function updateProfile(req: Request, res: Response) {
  const { email } = req.user as TokenPayload;
  const { first_name, last_name } = req.body;
  const profile = await accountService.updateProfile(
    first_name,
    last_name,
    email
  );

  if (!profile.profile_image) {
    profile.profile_image = "";
  }
  response<Profile>(res, 200, 0, "Update Pofile berhasil", profile);
}

async function uploadProfileImage(req: Request, res: Response) {
  const { email } = req.user as TokenPayload;
  const baseUrl = process.env.API_BASE_URL!;
  const imageUrl = `${baseUrl}/${req.file?.originalname}`;
  const profile = await accountService.updateProfileImage(imageUrl, email);

  if (!profile) {
    throw new HttpError(400, 102, "failed to upload profile image");
  }
  response<Profile>(res, 200, 0, "Update Profile Image berhasil", profile!);
}

async function getBalance(req: Request, res: Response) {
  const { email } = req.user as TokenPayload;
  const balance = await accountService.getBalance(email);
  response<Balance>(res, 200, 0, "Get Balance Berhasil", balance);
}

async function topup(req: Request, res: Response) {
  const { email } = req.user as TokenPayload;
  const { top_up_amount } = req.body;
  const conn = await pool.connect();
  try {
    await conn.query("BEGIN");
    // 1. update balance
    const balance = await accountService.topup(conn, email, top_up_amount);
    if (!balance) {
      response(res, 400, 102, "failed on update balance", null);
    }

    // 2. create invoice
    const invData: InvoicePayload = {
      transaction_type: "TOPUP",
      description: "Topup balance",
      total_amount: top_up_amount,
    };
    const inv = await invoiceService.create(conn, invData);
    if (!inv) {
      response(res, 400, 10, "failed on create invoice", null);
    }

    // 3. save transaction
    const trxData: TransactionPayload = {
      email,
      service_code: "TOPUP",
      invoice_number: inv.invoice_number,
    };
    const trx = await transactionService.save(conn, trxData);
    if (!trx) {
      response(
        res,
        400,
        102,
        "failed to proceed payment: on save transaction",
        null
      );
    }

    await conn.query("COMMIT");
    response<Balance>(res, 200, 0, "Top Up Balance berhasil", balance);
  } catch (error) {
    await conn.query("ROLLBACK");
    logger.error(error);
    response(res, 500, 103, "failed to topup", null);
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
      response(res, 400, 102, "Service atau Layanan tidak ditemukan", null);
    }

    // 2. update balance
    const succeed = await accountService.payment(conn, email, service.tariff); // update balance
    if (!succeed) {
      response(
        res,
        400,
        102,
        "failed to proceed payment: on save payment",
        null
      );
    }

    // 3. create invoice
    const p: InvoicePayload = {
      transaction_type: "PAYMENT",
      description: service.name,
      total_amount: service.tariff,
    };
    const inv = await invoiceService.create(conn, p);
    if (!inv) {
      response(res, 400, 102, "failed on create invoice", null);
    }

    // 4. save transaction
    const data: TransactionPayload = {
      email,
      service_code: service.code,
      invoice_number: inv.invoice_number,
    };
    const result = await transactionService.save(conn, data); // store transaction info

    if (!result) {
      response(
        res,
        400,
        102,
        "failed to proceed payment: on save transaction",
        null
      );
    }

    const resp: Payment = {
      invoice_number: inv.invoice_number,
      service_code: service.code,
      service_name: service.name,
      transaction_type: inv.transaction_type,
      total_amount: service.tariff,
      created_on: inv.created_on,
    };

    response<Payment>(res, 200, 0, "Transaksi berhasil", resp);

    await conn.query("COMMIT");
  } catch (error) {
    await conn.query("ROLLBACK");
    logger.error(error);
    response(res, 400, 102, "Saldo tidak cukup", null);
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
