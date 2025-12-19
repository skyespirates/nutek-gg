import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { ApiResponse } from "./common.schema";

extendZodWithOpenApi(z);

export const LoginPayloadSchema = z.object({
  email: z.email().openapi({ example: "sykes@email.com" }),
  password: z.string().min(8).openapi({ example: "password123" }),
});

const LoginResponse = z.object({
  token: z.string().openapi({
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiNTRVdXRjYTdCS0ZPX0ZUZGZ1bXlJem9zSTRKa1VxUGZVZ0ROSTUwelRTQlo2aHoyY0hKZ1VMb1loM09HUUd0ekQxV3dTX194aHBNZTE2SGFscVRzcEhjS21UclJ3S2FYYmZob3AzdzFFUHJ2NFdBQmk1c0RpdV9DSnZTSWt2MDFTbEU0QU5pbVB0bUx5azZoUzlOalVQNEZaVVpfRVBtcEk4Y3pNc3ZWa2JFPSIsImlhdCI6MTYyNjkyODk3MSwiZXhwIjoyNTU2MTE4Nzk4fQ.9C9NvhZYKivhGWnrjo4Wr1Rv-wur1wCm0jqfK9XDD8U",
  }),
}); // ApiResponse params

export type LoginResponse = z.infer<typeof LoginResponse>; // success<LoginResponse>

export const LoginResponseSchema = ApiResponse(LoginResponse); // docs

export const InvalidFormatSchema = ApiResponse(z.null(), {
  status: 102,
  message: "Parameter email tidak sesuai format",
});

export const WrongCredentialSchema = ApiResponse(z.null(), {
  status: 103,
  message: "Email atau password salah",
});
