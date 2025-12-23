import { z } from "zod";

export const envSchema = z.object({
  MODE: z.string().min(1),
  PORT: z.coerce.number(),
  JWT_SECRET: z.string().min(1),
  JWT_EXPIRED_IN: z.string().min(1),
  BASE_URL: z.string().min(1),
  DATABASE_URL: z.string().min(1),
});

export const env = envSchema.parse(process.env);
