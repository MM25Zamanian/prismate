import { PrismateAdmin } from "prismate";
import { db } from "./prisma"; // Prisma Client instance
import { Prisma } from "@/generated/prisma";

export const x = new PrismateAdmin(db as any, Prisma.dmmf);
