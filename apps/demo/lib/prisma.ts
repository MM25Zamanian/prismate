import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const prisma = !!process.env.DATABASE_URL
  ? globalForPrisma.prisma || new PrismaClient()
  : null;

if (process.env.NODE_ENV !== "production" && prisma)
  globalForPrisma.prisma = prisma;

process.on("SIGINT", async () => {
  await prisma?.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma?.$disconnect();
  process.exit(0);
});

export const db = prisma;
