import { PoolClient } from "pg";
import { InvoicePayload, InvoiceResp } from "../types";

async function create(
  conn: PoolClient,
  p: InvoicePayload
): Promise<InvoiceResp> {
  const query = `INSERT INTO invoices (number, transaction_type, description, total_amount) VALUES ('INV-' || to_char(CURRENT_DATE, 'DDMMYYYY') || '-' || LPAD(nextval('invoice_seq')::text, 4, '0'), $1, $2, $3) RETURNING number as invoice_number, transaction_type, created_on`;
  const args = [p.transaction_type, p.description, p.total_amount];
  const result = await conn.query<InvoiceResp>(query, args);
  return result.rows[0];
}

export default { create };
