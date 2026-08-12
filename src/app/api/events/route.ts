import prisma from "@/lib/prisma";
import { withUser, json, catalogFilter } from "@/lib/server-data";

export async function GET() {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const events = await prisma.event.findMany({
    where: catalogFilter(ctx.user),
    orderBy: { createdAt: "desc" },
  });
  return json(events);
}
