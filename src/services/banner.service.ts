import pool from "../infra/db";
import { Banner } from "../types";

async function list(): Promise<Banner[]> {
  const result = await pool.query<Banner>(
    "SELECT name, image, description FROM banners"
  );
  return result.rows;
}

export default {
  list,
};
