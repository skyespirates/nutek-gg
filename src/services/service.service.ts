import { PoolClient } from "pg";
import pool from "../infra/db";
import { Service } from "../types";

async function list(): Promise<Service[]> {
  const result = await pool.query<Service>("SELECT * FROM services");
  return result.rows;
}

async function get(conn: PoolClient, code: string): Promise<Service> {
  const result = await conn.query<Service>(
    "SELECT * FROM services WHERE code = $1",
    [code]
  );

  return result.rows[0];
}

export default {
  list,
  get,
};
