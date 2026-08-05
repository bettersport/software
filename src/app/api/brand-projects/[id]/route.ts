import prisma from "@/lib/prisma";
import { withUser, json, badRequest } from "@/lib/server-data";

type Params = { params: Promise<{ id: string }> };

async function ownProject(ownerId: string, id: string) {
  const p = await prisma.brandProject.findUnique({ where: { id } });
  return p && p.ownerId === ownerId ? p : null;
}

export async function PATCH(req: Request, { params }: Params) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const { id } = await params;
  const existing = await ownProject(ctx.user.id, id);
  if (!existing) return badRequest("No encontrado");

  const b = await req.json().catch(() => ({}));
  const project = await prisma.brandProject.update({
    where: { id },
    data: {
      ...(b.brand !== undefined && { brand: String(b.brand) }),
      ...(b.project !== undefined && { project: String(b.project) }),
      ...(b.category !== undefined && { category: String(b.category) }),
      ...(b.investment !== undefined && { investment: Number(b.investment) }),
      ...(b.reach !== undefined && { reach: Number(b.reach) }),
      ...(b.esgScore !== undefined && { esgScore: Number(b.esgScore) }),
      ...(b.progress !== undefined && { progress: Number(b.progress) }),
      ...(b.description !== undefined && { description: String(b.description) }),
      ...(b.status !== undefined && { status: String(b.status) }),
    },
  });
  return json(project);
}

export async function DELETE(_req: Request, { params }: Params) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const { id } = await params;
  const existing = await ownProject(ctx.user.id, id);
  if (!existing) return badRequest("No encontrado");
  await prisma.brandProject.delete({ where: { id } });
  return json({ ok: true });
}
