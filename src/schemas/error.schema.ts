import { ApiResponse } from "./common.schema";
import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const UnauthorizedSchema = ApiResponse(
  z.null().openapi({ example: null }),
  {
    status: 108,
    message: "Token tidak valid atau kadaluawarsa",
  }
);

export const InvalidImageFormatSchema = ApiResponse(
  z.any().openapi({ example: null }),
  {
    status: 102,
    message: "Format image tidak sesuai",
  }
);

export const InvalidTopupNominalSchema = ApiResponse(
  z.any().openapi({ example: null }),
  {
    status: 102,
    message:
      "Parameter amount hanya boleh angka dan tidak boleh lebih kecil dari 0",
  }
);

export const InvalidServiceSchema = ApiResponse(
  z.any().openapi({ example: null }),
  {
    status: 102,
    message: "Service atau Layanan tidak ditemukan",
  }
);
