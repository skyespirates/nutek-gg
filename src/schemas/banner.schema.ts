import { ApiResponse } from "./common.schema";
import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

const BannerSchema = z.object({
  banner_name: z.string().openapi({ example: "Banner 1" }),
  banner_image: z
    .string()
    .openapi({ example: "http://localhost:3000/banner-1.jpg" }),
  description: z.string().openapi({ example: "Lerem Ipsum Dolor sit amet" }),
});

export type Banner = z.infer<typeof BannerSchema>;

export const BannerResponseSchema = ApiResponse(z.array(BannerSchema));
