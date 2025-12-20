import { ZodType, z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

type Meta = {
  status?: number;
  message?: string;
};

export function ApiResponse<T extends ZodType>(dataSchema: T, meta?: Meta) {
  return z.object({
    status: z.number().openapi({ example: meta?.status ?? 0 }),
    message: z.string().openapi({ example: meta?.message ?? "Sukses" }),
    data: dataSchema,
  });
}
