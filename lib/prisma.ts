import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

declare global {
  var prisma: PrismaClient | undefined;
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Create a Neon project (neon.tech) and paste its connection string into .env."
    );
  }
  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

// Lazily constructed: importing this module (e.g. transitively via auth.ts in route
// modules) must not throw during `next build`'s page-data collection when DATABASE_URL
// isn't configured yet — the error should only surface when a query actually runs.
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    if (!global.prisma) {
      global.prisma = createPrismaClient();
    }
    const value = Reflect.get(global.prisma, prop, global.prisma);
    return typeof value === "function" ? value.bind(global.prisma) : value;
  },
});
