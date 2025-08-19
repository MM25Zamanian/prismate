import { Server } from "prismate";
import { db } from "./prisma"; // Prisma Client instance
import { Prisma } from "@/generated/prisma";

const x = new Server(db, Prisma.dmmf);
export const { orpc, router } = x.createOrpc();
