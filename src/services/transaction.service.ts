import { PoolClient } from "pg";
import { TransactionPayload, TransactionResult, History } from "../types";
import pool from "../infra/db";
import { off } from "process";

async function save(conn: PoolClient, p: TransactionPayload): Promise<boolean> {
  const query =
    "INSERT INTO transactions (email, service_code, invoice_number) VALUES ($1, $2, $3)";
  const args = [p.email, p.service_code, p.invoice_number];
  const result = await conn.query<TransactionResult>(query, args);
  if (!result.rowCount) {
    return false;
  }
  return true;
}

async function list(
  email: string,
  offset: number,
  limit: number
): Promise<History[]> {
  const query = `
                SELECT
                  i.number as invoice_number,
                  i.transaction_type,
                  i.description,
                  i.total_amount,
                  i.created_on
                FROM transactions t
                JOIN invoices i ON i.number = t.invoice_number
                WHERE t.email = $1
                ORDER BY i.created_on DESC
                LIMIT $2 OFFSET $3
                `;
  const result = await pool.query<History>(query, [email, limit, offset]);
  return result.rows;
}

export default { save, list };
