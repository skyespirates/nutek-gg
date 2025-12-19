import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { ApiResponse } from "./common.schema";

extendZodWithOpenApi(z);

export const RegistrationPayloadSchema = z.object({
  email: z
    .email({ error: () => "Parameter email tidak sesuai format" })
    .openapi({ example: "skyes@email.com" }),
  first_name: z.string().openapi({ example: "skyes" }),
  last_name: z.string().openapi({ example: "crawford" }),
  password: z.string().min(8).openapi({ example: "password123" }),
});

const RegisterResponse = z.null().openapi({ example: null });

export type RegisterResponse = z.infer<typeof RegisterResponse>;

export const RegisterResponseSchema = ApiResponse(RegisterResponse, {
  status: 0,
  message: "Registrasi berhasil silahkan login",
});

export const InvalidEmailSchema = ApiResponse(
  z.null().openapi({ example: null }),
  {
    status: 102,
    message: "Parameter email tidak sesuai format",
  }
);
