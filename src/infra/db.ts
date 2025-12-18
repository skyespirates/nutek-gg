import { Pool } from "pg";
import { getDatabaseURL } from "../configs";

const pool = new Pool({
  connectionString: getDatabaseURL(),
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  maxLifetimeSeconds: 60,
});

export default pool;
