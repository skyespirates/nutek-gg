import pool from "../infra/db";
import { Service } from "../types";

async function list(): Promise<Service[]> {
  const result = await pool.query<Service>("SELECT * FROM services");
  return result.rows;
}

export default {
  list,
};
