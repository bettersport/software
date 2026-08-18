import prisma from "@/lib/prisma";
import { withUser, json, requireAdmin } from "@/lib/server-data";

export async function GET() {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const d = requireAdmin(ctx.user); if (d) return d;
  const users = await prisma.user.findMany({
    where: { role: "brand", ...(ctx.user.demo ? {} : { demo: false }) },
    select: { id: true, name: true, email: true, country: true, org: true, demo: true, createdAt: true, brandConfig: true, _count: { select: { brandProjects: true } } },
    orderBy: { createdAt: "desc" },
  });
  return json(users);
}
