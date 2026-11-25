import { mkdirSync } from "node:fs";
import path from "node:path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/prisma/client";

const databaseUrl =
  process.env.DATABASE_URL ?? "file:./data/pustakaku.db";

mkdirSync(path.join(process.cwd(), "data"), { recursive: true });

const globalForPrisma = globalThis as typeof globalThis & {
  pustakaKuPrisma?: PrismaClient;
};

function createPrismaClient() {
  const adapter = new PrismaBetterSqlite3({ url: databaseUrl });
  return new PrismaClient({ adapter });
}

export const prisma =
  globalForPrisma.pustakaKuPrisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.pustakaKuPrisma = prisma;
}
