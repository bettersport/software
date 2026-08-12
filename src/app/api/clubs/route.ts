import prisma from "@/lib/prisma";
import { withUser, json, catalogFilter } from "@/lib/server-data";

export async function GET() {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const clubs = await prisma.club.findMany({
    where: catalogFilter(ctx.user),
    orderBy: { esgScore: "desc" },
  });
  return json(clubs);
}
