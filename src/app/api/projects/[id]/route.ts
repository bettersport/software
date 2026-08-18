import prisma from "@/lib/prisma";
import { withUser, json, notFound, requireClubWriter, enumOr, num, date, str } from "@/lib/server-data";
import { recomputeClubScore } from "@/lib/scoring-server";

type Params = { params: Promise<{ id: string }> };
const CATEGORIES = ["huella_hidrica", "huella_carbono", "gestion_residuos", "educacion", "inclusion", "equidad_genero"] as const;
const STATUSES = ["planning", "in_progress", "completed", "paused"] as const;

async function ownProject(clubId: string | null | undefined, id: string) {
  if (!clubId) return null;
  const p = await prisma.eSGProject.findUnique({ where: { id } });
  return p && p.clubId === clubId ? p : null;
}

export async function PATCH(req: Request, { params }: Params) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const denied = requireClubWriter(ctx.user);
  if (denied) return denied;
  const { id } = await params;
  const existing = await ownProject(ctx.user.clubId, id);
  if (!existing) return notFound("Proyecto no encontrado");

  const b = await req.json().catch(() => ({}));
  const category = b.category !== undefined ? enumOr(b.category, CATEGORIES) : undefined;
  const status = b.status !== undefined ? enumOr(b.status, STATUSES) : undefined;
  const project = await prisma.eSGProject.update({
    where: { id },
    data: {
      ...(b.title !== undefined && { title: str(b.title, 200) }),
      ...(category && { category }),
      ...(status && { status }),
      ...(b.progress !== undefined && { progress: num(b.progress, { min: 0, max: 100 }) ?? existing.progress }),
      ...(b.budget !== undefined && { budget: num(b.budget, { min: 0 }) ?? existing.budget }),
      ...(b.spent !== undefined && { spent: num(b.spent, { min: 0 }) ?? existing.spent }),
      ...(b.startDate !== undefined && date(b.startDate) && { startDate: date(b.startDate)! }),
      ...(b.endDate !== undefined && date(b.endDate) && { endDate: date(b.endDate)! }),
      ...(b.responsible !== undefined && { responsible: str(b.responsible, 120) }),
      ...(b.description !== undefined && { description: str(b.description, 4000) }),
      ...(b.milestones !== undefined && { milestones: Array.isArray(b.milestones) ? b.milestones : [] }),
      ...(b.kpis !== undefined && { kpis: Array.isArray(b.kpis) ? b.kpis : [] }),
    },
  });
  await recomputeClubScore(existing.clubId);
  return json(project);
}

export async function DELETE(_req: Request, { params }: Params) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const denied = requireClubWriter(ctx.user);
  if (denied) return denied;
  const { id } = await params;
  const existing = await ownProject(ctx.user.clubId, id);
  if (!existing) return notFound("Proyecto no encontrado");
  await prisma.eSGProject.delete({ where: { id } });
  await recomputeClubScore(existing.clubId);
  return json({ ok: true });
}
