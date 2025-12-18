export function getDatabaseURL(): string {
  return process.env.MODE == "dev"
    ? process.env.DEV_DATABASE_URL!
    : process.env.DATABASE_URL!;
}

export function getBaseUrl(): string {
  return process.env.MODE == "dev"
    ? process.env.DEV_BASE_URL!
    : process.env.BASE_URL!;
}
