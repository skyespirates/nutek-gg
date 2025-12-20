import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { UploadFileSchema } from "../schemas";
import z from "zod";
import {
  InvalidFormatSchema,
  LoginPayloadSchema,
  LoginResponseSchema,
  WrongCredentialSchema,
} from "../schemas/login.schema";
import {
  InvalidEmailSchema,
  RegisterResponseSchema,
  RegistrationPayloadSchema,
} from "../schemas/register.schema";
import {
  BalanceResponseSchema,
  TopupPayload,
  TopupResponseSchema,
  TransactionHistoryResponseSchema,
  TransactionPayloadSchema,
  TransactionResponseSchema,
} from "../schemas/transaction.schema";
import {
  InvalidImageFormatSchema,
  InvalidServiceSchema,
  InvalidTopupNominalSchema,
  UnauthorizedSchema,
} from "../schemas/error.schema";
import {
  ProfileResponseSchema,
  UpdateProfileImageResponseSchema,
  UpdateProfilePayload,
  UpdateProfileResponseSchema,
} from "../schemas/profile.schema";
import { BannerResponseSchema } from "../schemas/banner.schema";
import { ServiceResponseSchema } from "../schemas/service.schema";

export const registry = new OpenAPIRegistry();

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
          schema: RegistrationPayloadSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "",
      content: {
        "application/json": {
          schema: RegisterResponseSchema,
        },
      },
    },
    400: {
      description: "",
      content: {
        "application/json": {
          schema: InvalidEmailSchema,
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
          schema: LoginPayloadSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Login user",
      content: {
        "application/json": {
          schema: LoginResponseSchema,
        },
      },
    },
    400: {
      description: "",
      content: {
        "application/json": {
          schema: InvalidFormatSchema,
        },
      },
    },
    401: {
      description: "",
      content: {
        "application/json": {
          schema: WrongCredentialSchema,
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
          schema: ProfileResponseSchema,
        },
      },
    },
    401: {
      description: "",
      content: {
        "application/json": {
          schema: UnauthorizedSchema,
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
          schema: UpdateProfilePayload,
        },
      },
    },
  },
  responses: {
    200: {
      description: "",
      content: {
        "application/json": {
          schema: UpdateProfileResponseSchema,
        },
      },
    },
    401: {
      description: "",
      content: {
        "application/json": {
          schema: UnauthorizedSchema,
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
          schema: UpdateProfileImageResponseSchema,
        },
      },
    },
    400: {
      description: "",
      content: {
        "application/json": {
          schema: InvalidImageFormatSchema,
        },
      },
    },
    401: {
      description: "",
      content: {
        "application/json": {
          schema: UnauthorizedSchema,
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
          schema: BannerResponseSchema,
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
          schema: ServiceResponseSchema,
        },
      },
    },
    401: {
      description: "",
      content: {
        "application/json": {
          schema: UnauthorizedSchema,
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
          schema: BalanceResponseSchema,
        },
      },
    },
    401: {
      description: "",
      content: {
        "application/json": {
          schema: UnauthorizedSchema,
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
          schema: TopupPayload,
        },
      },
    },
  },
  responses: {
    200: {
      description: "",
      content: {
        "application/json": {
          schema: TopupResponseSchema,
        },
      },
    },
    400: {
      description: "",
      content: {
        "application/json": {
          schema: InvalidTopupNominalSchema,
        },
      },
    },
    401: {
      description: "",
      content: {
        "application/json": {
          schema: UnauthorizedSchema,
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
          schema: TransactionPayloadSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "",
      content: {
        "application/json": {
          schema: TransactionResponseSchema,
        },
      },
    },
    400: {
      description: "",
      content: {
        "application/json": {
          schema: InvalidServiceSchema,
        },
      },
    },
    401: {
      description: "",
      content: {
        "application/json": {
          schema: UnauthorizedSchema,
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
          schema: TransactionHistoryResponseSchema,
        },
      },
    },
    401: {
      description: "",
      content: {
        "application/json": {
          schema: UnauthorizedSchema,
        },
      },
    },
  },
});
