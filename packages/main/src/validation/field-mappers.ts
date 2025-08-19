import { z } from "zod";

import type { SchemaField } from "../core/types";

export function getBaseZodType(fieldType: string): z.ZodTypeAny {
  switch (fieldType) {
    case "String":
      return z.string();
    case "Int":
      return z.number().int();
    case "Float":
      return z.number();
    case "BigInt":
      return z.bigint();
    case "DateTime":
      return z.coerce.date();
    case "Boolean":
      return z.boolean();
    case "Json":
      return z.any();
    case "Bytes":
      return z.instanceof(Uint8Array).or(z.string());
    case "Decimal":
      return z.number();
    default:
      if (fieldType.includes("Enum")) {
        return z.string();
      }
      return z.unknown();
  }
}

export function mapFieldToZod(field: SchemaField): z.ZodTypeAny {
  let zodSchema: z.ZodTypeAny;

  if (field.kind === "object" && field.relationName) {
    zodSchema = z.object({ id: z.string().optional() }).optional();
  } else {
    zodSchema = getBaseZodType(field.type);
  }

  if (field.isList) {
    zodSchema = z.array(zodSchema);
  }

  if (!field.isRequired) {
    zodSchema = field.isList ? zodSchema.optional() : zodSchema.nullable().optional();
  }

  return zodSchema;
}
