import prisma from "@/lib/prisma";
import { withUser, json, catalogFilter } from "@/lib/server-data";

export async function GET() {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const solutions = await prisma.solutionProvider.findMany({
    where: catalogFilter(ctx.user),
  });
  return json(solutions);
}
