import { Account, Balance, NewAccount, Profile } from "../types";
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

async function updateProfile(
  first_name: string,
  last_name: string,
  email: string
): Promise<Profile> {
  try {
    const result = await pool.query<Profile>(
      "UPDATE accounts SET first_name = $1, last_name = $2 WHERE email = $3 RETURNING email, first_name, last_name, profile_image",
      [first_name, last_name, email]
    );
    return result.rows[0];
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

async function updateProfileImage(
  image_url: string,
  email: string
): Promise<Profile | null> {
  try {
    const result = await pool.query<Profile>(
      "UPDATE accounts SET profile_image = $1 WHERE email = $2 RETURNING email, first_name, last_name, profile_image",
      [image_url, email]
    );
    if (result.rowCount == 0) {
      return null;
    }
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

async function topup(
  conn: PoolClient,
  email: string,
  amount: number
): Promise<boolean> {
  try {
    const result = await conn.query(
      "UPDATE accounts SET balance = balance + $1 WHERE email = $2",
      [amount, email]
    );
    if (!result.rowCount) {
      return false;
    }
    return true;
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

async function payment(
  conn: PoolClient,
  email: string,
  amount: number
): Promise<boolean> {
  const result = await conn.query(
    "UPDATE accounts SET balance = balance - $1 WHERE email = $2",
    [amount, email]
  );
  if (!result.rowCount) {
    return false;
  }
  return true;
}

export default {
  createAccount,
  getBalance,
  topup,
  payment,
  getAccountByEmail,
  updateProfile,
  updateProfileImage,
};
