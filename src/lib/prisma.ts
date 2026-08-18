import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  // Prisma 7 uses the client engine, which requires a driver adapter.
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter, log: ["error"] });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
