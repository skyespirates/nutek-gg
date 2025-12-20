import { ApiResponse } from "./common.schema";
import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

const ServiceSchema = z.object({
  service_code: z.string().openapi({ example: "PAJAK" }),
  service_name: z.string().openapi({ example: "Pajak PBB" }),
  service_icon: z
    .string()
    .openapi({ example: "http://localhost:3000/pajak-pbb.jpg" }),
  service_tariff: z.number().openapi({ example: 40000 }),
});

export type Service = z.infer<typeof ServiceSchema>;

export const ServiceResponseSchema = ApiResponse(z.array(ServiceSchema));
