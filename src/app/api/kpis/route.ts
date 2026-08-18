import prisma from "@/lib/prisma";
import { withUser, json, badRequest, requireClubWriter } from "@/lib/server-data";

export async function GET() {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  if (!ctx.user.clubId) return json([]);
  const kpis = await prisma.kpi.findMany({
    where: { clubId: ctx.user.clubId },
    orderBy: { createdAt: "asc" },
  });
  return json(kpis);
}

export async function POST(req: Request) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const denied = requireClubWriter(ctx.user);
  if (denied) return denied;
  if (!ctx.user.clubId) return badRequest("La cuenta no tiene un club asociado");

  const b = await req.json().catch(() => ({}));
  if (!b.name || !b.category) return badRequest("Nombre y categoría son obligatorios");
  if (b.current === undefined || b.target === undefined || !b.unit)
    return badRequest("current, target y unit son obligatorios");

  const kpi = await prisma.kpi.create({
    data: {
      name: String(b.name),
      category: String(b.category),
      current: Number(b.current),
      target: Number(b.target),
      unit: String(b.unit),
      trend: String(b.trend ?? "up"),
      color: String(b.color ?? "#10B981"),
      icon: String(b.icon ?? "📊"),
      description: String(b.description ?? ""),
      clubId: ctx.user.clubId,
    },
  });
  return json(kpi, { status: 201 });
}
