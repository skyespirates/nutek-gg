import { Account, Balance, NewAccount, Profile } from "../types";
import logger from "../utils/logger";
import pool from "../infra/db";
import { PoolClient, DatabaseError } from "pg";
import bcrypt from "bcrypt";
import { HttpError } from "../utils/http-error";

async function createAccount(account: NewAccount): Promise<boolean> {
  try {
    const hashed_password = await bcrypt.hash(account.password, 12);
    const result = await pool.query(
      "INSERT INTO accounts (email, first_name, last_name, password) VALUES ($1, $2, $3, $4)",
      [account.email, account.first_name, account.last_name, hashed_password]
    );
    if (!result.rowCount) {
      return false;
    }

    return true;
  } catch (error) {
    if (error instanceof DatabaseError) {
      switch (error.code) {
        case "23505":
          throw new HttpError(409, "Email already registered");

        case "23502":
          throw new HttpError(400, "Missing required fields");

        case "22P02":
          throw new HttpError(400, "Invalid input format");

        default:
          throw new HttpError(500, "Database error");
      }
    }

    throw error;
  }
}

async function getAccountByEmail(email: string): Promise<Account> {
  const result = await pool.query<Account>(
    "SELECT *  FROM accounts WHERE email = $1",
    [email]
  );
  return result.rows[0];
}

async function updateProfile(
  first_name: string,
  last_name: string,
  email: string
): Promise<Profile> {
  const result = await pool.query<Profile>(
    "UPDATE accounts SET first_name = $1, last_name = $2 WHERE email = $3 RETURNING email, first_name, last_name, profile_image",
    [first_name, last_name, email]
  );
  return result.rows[0];
}

async function updateProfileImage(
  image_url: string,
  email: string
): Promise<Profile> {
  const result = await pool.query<Profile>(
    "UPDATE accounts SET profile_image = $1 WHERE email = $2 RETURNING email, first_name, last_name, profile_image",
    [image_url, email]
  );

  if (!result.rowCount) {
    throw new HttpError(400, "failed to upload profile image");
  }

  return result.rows[0];
}

async function getBalance(email: string): Promise<Balance> {
  const result = await pool.query<Balance>(
    "SELECT balance FROM accounts WHERE email = $1",
    [email]
  );
  return result.rows[0];
}

async function topup(
  conn: PoolClient,
  email: string,
  amount: number
): Promise<Balance> {
  const result = await conn.query<Balance>(
    "UPDATE accounts SET balance = balance + $1 WHERE email = $2 RETURNING balance",
    [amount, email]
  );
  return result.rows[0];
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
