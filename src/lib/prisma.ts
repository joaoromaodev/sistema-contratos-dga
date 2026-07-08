import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// max baixo de propósito: o pooler do Supabase em session mode tem um limite
// total de 15 conexões simultâneas, compartilhado entre dev local e produção
// (Vercel). Sem isso, um único processo (ex: dev server de longa duração)
// pode sozinho esgotar o limite pra todo mundo.
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  max: 4,
});

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
