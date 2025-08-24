import { Prisma } from "@/generated/prisma";
import { createModelRouter } from "@prismate/api";
import { db } from "./prisma";

// init prisma + service
export const modelsApp = createModelRouter({
  client: db as any,
  dmmf: Prisma.dmmf,
});
