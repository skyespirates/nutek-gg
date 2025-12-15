import { z } from "zod";

export const RegistrationSchema = z.object({
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  password: z.string().min(8),
});

export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const itemSchema = z.object({
  name: z.string(),
});

export const transferSchema = z.object({
  senderId: z.string(),
  receiverId: z.string(),
  amount: z.number(),
});

export const topupSchema = z.object({
  amount: z.number().min(1),
});

export const newAccountSchema = z.object({
  name: z.string(),
});
