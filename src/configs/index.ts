import { env } from "./env";

export function getDatabaseURL(): string {
  return env.MODE == "dev"
    ? "postgresql://postgres:bmwb1gtr@localhost:5432/nutech"
    : env.DATABASE_URL;
}

export function getBaseUrl(): string {
  return env.MODE == "dev" ? "http://localhost:3000" : env.BASE_URL;
}
