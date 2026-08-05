import prisma from "@/lib/prisma";
import { withUser, json, badRequest } from "@/lib/server-data";

type Params = { params: Promise<{ id: string }> };

async function ownProject(clubId: string | null | undefined, id: string) {
  if (!clubId) return null;
  const p = await prisma.eSGProject.findUnique({ where: { id } });
  return p && p.clubId === clubId ? p : null;
}

export async function PATCH(req: Request, { params }: Params) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const { id } = await params;
  const existing = await ownProject(ctx.user.clubId, id);
  if (!existing) return badRequest("Proyecto no encontrado");

  const b = await req.json().catch(() => ({}));
  const project = await prisma.eSGProject.update({
    where: { id },
    data: {
      ...(b.title !== undefined && { title: String(b.title) }),
      ...(b.category !== undefined && { category: b.category }),
      ...(b.status !== undefined && { status: b.status }),
      ...(b.progress !== undefined && { progress: Number(b.progress) }),
      ...(b.budget !== undefined && { budget: Number(b.budget) }),
      ...(b.spent !== undefined && { spent: Number(b.spent) }),
      ...(b.startDate !== undefined && { startDate: new Date(b.startDate) }),
      ...(b.endDate !== undefined && { endDate: new Date(b.endDate) }),
      ...(b.responsible !== undefined && { responsible: String(b.responsible) }),
      ...(b.description !== undefined && { description: String(b.description) }),
      ...(b.milestones !== undefined && { milestones: b.milestones }),
      ...(b.kpis !== undefined && { kpis: b.kpis }),
    },
  });
  return json(project);
}

export async function DELETE(_req: Request, { params }: Params) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const { id } = await params;
  const existing = await ownProject(ctx.user.clubId, id);
  if (!existing) return badRequest("Proyecto no encontrado");
  await prisma.eSGProject.delete({ where: { id } });
  return json({ ok: true });
}
