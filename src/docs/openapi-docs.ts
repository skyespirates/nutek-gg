// openapi-doc.ts
import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { registry } from "./openapi";
import { getBaseUrl } from "../configs";
import fs from "fs";
import { stringify } from "yaml";

const generator = new OpenApiGeneratorV3(registry.definitions);

export function generateOpenApiDocumentation() {
  return generator.generateDocument({
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
}

function writeOpenApiDocumentation() {
  const docs = generateOpenApiDocumentation();

  const fileContent = stringify(docs);

  fs.writeFileSync(`${__dirname}/openapi-docs.yaml`, fileContent, {
    encoding: "utf-8",
  });
}

writeOpenApiDocumentation();
