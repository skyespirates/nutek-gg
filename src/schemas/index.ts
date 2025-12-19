import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export function ApiResponse<T extends z.ZodTypeAny>(dataSchema?: T) {
  return z.object({
    status: z.number().openapi({ example: 200 }),
    message: z.string().openapi({ example: "Sukses" }),
    data: dataSchema || z.null().openapi({ example: null }),
  });
}

export const RegistrationSchema = z.object({
  email: z.email().openapi({ example: "sensei@email.com" }),
  first_name: z.string().openapi({ example: "dragon" }),
  last_name: z.string().openapi({ example: "warrior" }),
  password: z.string().min(8).openapi({ example: "slebew123" }),
});

export const userLoginSchema = z.object({
  email: z.email().openapi({ example: "sykes@email.com" }),
  password: z.string().min(8).openapi({ example: "password123" }),
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
  offset: z.coerce.number().int().min(0),
  limit: z.coerce.number().int().min(1),
});

export const UploadFileSchema = z.object({
  file: z.instanceof(Buffer).openapi({
    type: "string",
    format: "binary",
    description: "File to upload",
  }),
});
