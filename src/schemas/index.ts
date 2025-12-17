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
  top_up_amount: z.number().min(0, {
    message: "hanya boleh angka dan tidak boleh lebih kecil dari 0",
  }),
});

export const paymentSchema = z.object({
  service_code: z.string(),
});

export const updateProfileSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
});

export const HistoryQuerySchema = z.object({
  offset: z.string().pipe(z.coerce.number().int().min(0)),
  limit: z.string().pipe(z.coerce.number().int().min(1)),
});
