import prisma from "@/lib/prisma";
import { withUser, json } from "@/lib/server-data";

export async function GET() {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const events = await prisma.event.findMany({ orderBy: { createdAt: "desc" } });
  return json(events);
}
