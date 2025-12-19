import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

export const registry = new OpenAPIRegistry();

import {
  ApiResponse,
  RegistrationSchema,
  UploadFileSchema,
  userLoginSchema,
} from "../schemas";
import z from "zod";

registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});

registry.registerPath({
  method: "post",
  path: "/registration",
  tags: ["1. Module Membership"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: RegistrationSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "",
      content: {
        "application/json": {
          schema: ApiResponse(),
        },
      },
    },
    400: {
      description: "",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              status: {
                type: "number",
                example: 401,
              },
              message: {
                type: "string",
                example: "email is invalid",
              },
              data: {
                type: "null",
                example: null,
              },
            },
          },
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/login",
  tags: ["1. Module Membership"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: userLoginSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Login user",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              status: {
                type: "number",
                example: 200,
              },
              message: {
                type: "string",
                example: "Login Sukses",
              },
              data: {
                type: "object",
                properties: {
                  token: {
                    type: "string",
                    example:
                      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiNTRVdXRjYTdCS0ZPX0ZUZGZ1bXlJem9zSTRKa1VxUGZVZ0ROSTUwelRTQlo2aHoyY0hKZ1VMb1loM09HUUd0ekQxV3dTX194aHBNZTE2SGFscVRzcEhjS21UclJ3S2FYYmZob3AzdzFFUHJ2NFdBQmk1c0RpdV9DSnZTSWt2MDFTbEU0QU5pbVB0bUx5azZoUzlOalVQNEZaVVpfRVBtcEk4Y3pNc3ZWa2JFPSIsImlhdCI6MTYyNjkyODk3MSwiZXhwIjoyNTU2MTE4Nzk4fQ.9C9NvhZYKivhGWnrjo4Wr1Rv-wur1wCm0jqfK9XDD8U",
                  },
                },
              },
            },
          },
        },
      },
    },
    400: {
      description: "",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              status: {
                type: "number",
                example: 102,
              },
              message: {
                type: "string",
                example: "Paramter email tidak sesuai format",
              },
              data: {
                type: "null",
                example: null,
              },
            },
          },
        },
      },
    },
    401: {
      description: "",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              status: {
                type: "number",
                example: 103,
              },
              message: {
                type: "string",
                example: "Username atau password salah",
              },
              data: {
                type: "null",
                example: null,
              },
            },
          },
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/profile",
  tags: ["1. Module Membership"],
  description: "Get all menus that assigned to current role",
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: "Digunakan untuk mendapatkan informasi profile User",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              text: {
                type: "string",
                example: "hello world",
              },
            },
          },
        },
      },
    },
    401: {
      description: "",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              status: {
                type: "number",
                example: 108,
              },
              message: {
                type: "string",
                example: "Token tidak tidak valid atau kadaluwarsa",
              },
              data: {
                type: "null",
                example: null,
              },
            },
          },
        },
      },
    },
  },
});

registry.registerPath({
  method: "put",
  path: "/profile/update",
  tags: ["1. Module Membership"],

  description: "Digunakan untuk mengupdate data profile User",
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              first_name: {
                type: "string",
                example: "skyes",
              },
              last_name: {
                type: "string",
                example: "crawford",
              },
            },
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: "",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              status: {
                type: "number",
                example: 0,
              },
              message: {
                type: "string",
                example: "Update Profile berhasil",
              },
              data: {
                type: "object",
                properties: {},
              },
            },
          },
        },
      },
    },
    401: {
      description: "",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              status: {
                type: "number",
                example: 108,
              },
              message: {
                type: "string",
                example: "Token tidak tidak valid atau kadaluwarsa",
              },
              data: {
                type: "null",
                example: null,
              },
            },
          },
        },
      },
    },
  },
});

registry.registerPath({
  method: "put",
  path: "/profile/image",
  tags: ["1. Module Membership"],
  description: "Digunakan untuk mengupdate / upload profile image User",
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: UploadFileSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              status: {
                type: "number",
                example: 0,
              },
              message: {
                type: "string",
                example: "Update profile image berhasil",
              },
              data: {
                type: "object",
                properties: {
                  email: {
                    type: "string",
                    example: "skyes@email.com",
                  },
                  first_name: {
                    type: "string",
                    example: "skyes",
                  },
                  last_name: {
                    type: "string",
                    example: "crawford",
                  },
                  profile_image: {
                    type: "string",
                    example: "nutek-gg-production.up.railway.app/image.jpeg",
                  },
                },
              },
            },
          },
        },
      },
    },
    400: {
      description: "",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              status: {
                type: "number",
                example: 102,
              },
              message: {
                type: "string",
                example: "Format image tidak sesuai",
              },
              data: {
                type: "null",
                example: null,
              },
            },
          },
        },
      },
    },
    401: {
      description: "",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              status: {
                type: "number",
                example: 108,
              },
              message: {
                type: "string",
                example: "Token tidak tidak valid atau kadaluwarsa",
              },
              data: {
                type: "null",
                example: null,
              },
            },
          },
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/banner",
  tags: ["2. Module Information"],
  description: "Digunakan untuk mendapatkan list banner",
  responses: {
    200: {
      description: "",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              status: {
                type: "number",
                example: 0,
              },
              message: {
                type: "string",
                example: "Sukses",
              },
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    banner_name: {
                      type: "string",
                      example: "Banner 1",
                    },
                    banner_image: {
                      type: "string",
                      example: "nutek-gg-production.up.railway.app/image.jpeg",
                    },
                    description: {
                      type: "string",
                      example: "Lorem ipsum dolor sir amet",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/services",
  tags: ["2. Module Information"],
  security: [{ bearerAuth: [] }],
  description: "Digunakan untuk mendapatkan list Service/Layanan PPOB",
  responses: {
    200: {
      description: "",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              status: {
                type: "number",
                example: 0,
              },
              message: {
                type: "string",
                example: "Sukses",
              },
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    service_code: {
                      type: "string",
                      example: "PAJAK",
                    },
                    service_name: {
                      type: "string",
                      example: "Pajak PBB",
                    },
                    service_icon: {
                      type: "string",
                      example: "nutek-gg-production.up.railway.app/image.jpeg",
                    },
                    service_tariff: {
                      type: "number",
                      example: 40000,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    401: {
      description: "",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              status: {
                type: "number",
                example: 108,
              },
              message: {
                type: "string",
                example: "Token tidak tidak valid atau kadaluwarsa",
              },
              data: {
                type: "null",
                example: null,
              },
            },
          },
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/balance",
  tags: ["3. Module Transaction"],
  description:
    "Digunakan untuk mendapatkan informasi balance / saldo terakhir dari User",
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: "",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              status: {
                type: "number",
                example: 0,
              },
              message: {
                type: "string",
                example: "Get Balance Berhasil",
              },
              data: {
                type: "object",
                properties: {
                  balance: {
                    type: "number",
                    example: 540000,
                  },
                },
              },
            },
          },
        },
      },
    },
    401: {
      description: "",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              status: {
                type: "number",
                example: 108,
              },
              message: {
                type: "string",
                example: "Token tidak tidak valid atau kadaluwarsa",
              },
              data: {
                type: "null",
                example: null,
              },
            },
          },
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/topup",
  tags: ["3. Module Transaction"],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              top_up_amount: {
                type: "number",
                example: 150000,
              },
            },
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: "",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              status: { type: "number", example: 0 },
              message: { type: "string", example: "Top Up Balance Berhasil" },
              data: {
                type: "object",
                properties: {
                  balance: { type: "number", example: 150000 },
                },
              },
            },
          },
        },
      },
    },
    400: {
      description: "",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              status: {
                type: "number",
                example: 102,
              },
              message: {
                type: "string",
                example:
                  "Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0",
              },
              data: {
                type: "null",
                example: null,
              },
            },
          },
        },
      },
    },
    401: {
      description: "",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              status: {
                type: "number",
                example: 108,
              },
              message: {
                type: "string",
                example: "Token tidak tidak valid atau kadaluwarsa",
              },
              data: {
                type: "null",
                example: null,
              },
            },
          },
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/transaction",
  tags: ["3. Module Transaction"],
  description:
    "Digunakan untuk melakukan transaksi dari services / layanan yang tersedia",
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              service_code: {
                type: "string",
                example: "PULSA",
              },
            },
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: "",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              status: { type: "number", example: 0 },
              message: { type: "string", example: "Top Up Balance Berhasil" },
              data: {
                type: "object",
                properties: {
                  invoice_number: {
                    type: "string",
                    example: "INV17082023-001",
                  },
                  service_code: { type: "string", example: "PLN_PRABAYAR" },
                  service_name: { type: "string", example: "PLN Prabayar" },
                  transaction_type: { type: "string", example: "PAYMENT" },
                  total_amount: { type: "number", example: 10000 },
                  created_on: {
                    type: "string",
                    example: "2023-08-17T10:10:10.000Z",
                  },
                },
              },
            },
          },
        },
      },
    },
    400: {
      description: "",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              status: {
                type: "number",
                example: 102,
              },
              message: {
                type: "string",
                example: "Service ataus Layanan tidak ditemukan",
              },
              data: {
                type: "null",
                example: null,
              },
            },
          },
        },
      },
    },
    401: {
      description: "",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              status: {
                type: "number",
                example: 108,
              },
              message: {
                type: "string",
                example: "Token tidak tidak valid atau kadaluwarsa",
              },
              data: {
                type: "null",
                example: null,
              },
            },
          },
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/transaction/history",
  tags: ["3. Module Transaction"],
  description: "Digunakan untuk mendapatkan informasi history transaksi",
  security: [{ bearerAuth: [] }],
  request: {
    query: z.object({
      offset: z.coerce.number().min(0).default(0),
      limit: z.coerce.number().min(1).default(3),
    }),
  },
  responses: {
    200: {
      description: "",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              status: {
                type: "number",
                example: 0,
              },
              message: {
                type: "string",
                example: "Sukses",
              },
              data: {
                type: "object",
                properties: {
                  offset: {
                    type: "number",
                    example: 0,
                  },
                  limit: {
                    type: "number",
                    example: 3,
                  },
                  records: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        invoice_number: {
                          type: "string",
                          example: "INV17082023-001",
                        },
                        transaction_type: {
                          type: "string",
                          example: "TOPUP",
                        },
                        description: {
                          type: "string",
                          example: "Top up balance",
                        },
                        amount: {
                          type: "number",
                          example: 10000,
                        },
                        created_on: {
                          type: "string",
                          example: "2023-08-17T10:10:10.000Z",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    401: {
      description: "",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              status: {
                type: "number",
                example: 108,
              },
              message: {
                type: "string",
                example: "Token tidak tidak valid atau kadaluwarsa",
              },
              data: {
                type: "null",
                example: null,
              },
            },
          },
        },
      },
    },
  },
});
