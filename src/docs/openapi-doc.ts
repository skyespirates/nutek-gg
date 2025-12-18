// openapi-doc.ts
import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { registry } from "./openapi";
import { getBaseUrl } from "../configs";

export const openApiDoc = new OpenApiGeneratorV3(
  registry.definitions
).generateDocument({
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Nutek-gg API",
    description: "Documentation for Nutek-gg API",
  },
  servers: [
    {
      url: getBaseUrl(),
    },
  ],
});
