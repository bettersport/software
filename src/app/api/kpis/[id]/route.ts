import prisma from "@/lib/prisma";
import { withUser, json, badRequest } from "@/lib/server-data";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_req: Request, { params }: Params) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const { id } = await params;
  if (!ctx.user.clubId) return badRequest("No encontrado");
  const existing = await prisma.kpi.findUnique({ where: { id } });
  if (!existing || existing.clubId !== ctx.user.clubId) return badRequest("No encontrado");
  await prisma.kpi.delete({ where: { id } });
  return json({ ok: true });
}
