import prisma from "@/lib/prisma";
import { withUser, json } from "@/lib/server-data";

export async function GET() {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const solutions = await prisma.solutionProvider.findMany();
  return json(solutions);
}
