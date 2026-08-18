import prisma from "@/lib/prisma";
import { withUser, json, notFound, requireClubWriter, num, str } from "@/lib/server-data";

type Params = { params: Promise<{ id: string }> };

async function own(clubId: string | null | undefined, id: string) {
  if (!clubId) return null;
  const k = await prisma.kpi.findUnique({ where: { id } });
  return k && k.clubId === clubId ? k : null;
}

/** PATCH: actualizar valor/meta/nombre; registra historial y calcula tendencia real. */
export async function PATCH(req: Request, { params }: Params) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const denied = requireClubWriter(ctx.user);
  if (denied) return denied;
  const { id } = await params;
  const k = await own(ctx.user.clubId, id);
  if (!k) return notFound("KPI no encontrado");
  const b = await req.json().catch(() => ({}));
  const data: Record<string, unknown> = {};
  if (b.name !== undefined) data.name = str(b.name, 160);
  if (b.category !== undefined) data.category = str(b.category, 60);
  if (b.unit !== undefined) data.unit = str(b.unit, 40);
  if (b.description !== undefined) data.description = str(b.description, 1000);
  if (b.target !== undefined) data.target = num(b.target) ?? k.target;
  if (b.current !== undefined) {
    const current = num(b.current) ?? k.current;
    data.current = current;
    // Tendencia real: comparar con el valor anterior. Si el KPI es "reducir" (target < previo) invertimos.
    const improving = k.target < k.current ? current < k.current : current > k.current;
    data.trend = current === k.current ? "stable" : improving ? "up" : "down";
    await prisma.kpiHistory.create({ data: { kpiId: id, value: current } });
  }
  const updated = await prisma.kpi.update({ where: { id }, data });
  return json(updated);
}

export async function DELETE(_req: Request, { params }: Params) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const denied = requireClubWriter(ctx.user);
  if (denied) return denied;
  const { id } = await params;
  const k = await own(ctx.user.clubId, id);
  if (!k) return notFound("KPI no encontrado");
  await prisma.kpiHistory.deleteMany({ where: { kpiId: id } });
  await prisma.kpi.delete({ where: { id } });
  return json({ ok: true });
}
