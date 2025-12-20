import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

import { ApiResponse } from "./common.schema";

extendZodWithOpenApi(z);

// GET /transaction/history
const TransactionHistorySchema = z.object({
  invoice_number: z.string().openapi({ example: "INV17082023-001" }),
  transaction_type: z.string().openapi({ example: "PAYMENT" }),
  description: z.string().openapi({ example: "Top Up Balance" }),
  total_amount: z.number().openapi({ example: 100000 }),
  created_on: z.string().openapi({ example: "2023-08-17T10:10:10.000Z" }),
});
export type TransactionHistory = z.infer<typeof TransactionHistorySchema>;

const TransactionHistoryResponse = z.object({
  offset: z.number().min(0).openapi({ example: 0 }),
  limit: z.number().min(1).openapi({ example: 3 }),
  records: z.array(TransactionHistorySchema).openapi({
    example: [
      {
        invoice_number: "INV17082023-001",
        transaction_type: "TOPUP",
        description: "Top Up balance",
        total_amount: 100000,
        created_on: "2023-08-17T10:10:10.000Z",
      },
    ],
  }),
});

export type TransactionHistoryResponse = z.infer<
  typeof TransactionHistoryResponse
>;

export const TransactionHistoryResponseSchema = ApiResponse(
  TransactionHistoryResponse
);

// GET /balance
const BalanceSchema = z.object({
  balance: z.number().openapi({ example: 1250000 }),
});

export type Balance = z.infer<typeof BalanceSchema>;

export const BalanceResponseSchema = ApiResponse(BalanceSchema, {
  message: "Get balance berhasil",
});

// POST /topup
export const TopupPayload = z.object({
  top_up_amount: z.number().openapi({ example: "325000" }),
});
export const TopupResponseSchema = ApiResponse(BalanceSchema, {
  message: "Top up balance berhasil",
});

// POST /transaction
export const TransactionPayloadSchema = z.object({
  service_code: z.string().openapi({ example: "PDAM" }),
});

const TransactionSchema = z.object({
  invoice_number: z.string().openapi({ example: "INV17082023-001" }),
  service_code: z.string().openapi({ example: "PLN_PRABAYAR" }),
  service_name: z.string().openapi({ example: "PLN Prabayar" }),
  transaction_type: z.string().openapi({ example: "PAYMENT" }),
  total_amount: z.number().openapi({ example: 20000 }),
  created_on: z.string().openapi({ example: "2023-08-17T10:10:10.000Z" }),
});

export type Transaction = z.infer<typeof TransactionSchema>;

export const TransactionResponseSchema = ApiResponse(TransactionSchema, {
  message: "Transaksi berhasil",
});
