import { Account, Balance, NewAccount } from "../types";
import logger from "../utils/logger";
import pool from "../infra/db";
import { PoolClient } from "pg";
import bcrypt from "bcrypt";

async function createAccount(account: NewAccount): Promise<boolean> {
  try {
    const hashed_password = await bcrypt.hash(account.password, 12);
    const result = await pool.query(
      "INSERT INTO accounts (email, first_name, last_name, password) VALUES ($1, $2, $3, $4)",
      [account.email, account.first_name, account.last_name, hashed_password]
    );
    if (result.rowCount == 0) {
      return false;
    }

    return true;
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

async function getAccountByEmail(email: string): Promise<Account> {
  try {
    const result = await pool.query<Account>(
      "SELECT *  FROM accounts WHERE email = $1",
      [email]
    );
    return result.rows[0];
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

async function getBalance(email: string): Promise<Balance> {
  try {
    const result = await pool.query<Balance>(
      "SELECT balance FROM accounts WHERE email = $1",
      [email]
    );
    return result.rows[0];
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

async function topup(email: string, amount: number): Promise<boolean> {
  try {
    const result = await pool.query(
      "UPDATE accounts SET balance = balance + $1 WHERE email = $2",
      [amount, email]
    );
    if (result.rowCount == 0) {
      return false;
    }
    return true;
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

export default { createAccount, getBalance, topup, getAccountByEmail };
