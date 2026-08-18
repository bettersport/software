import prisma from "@/lib/prisma";
import { withUser, json, badRequest, requireClubWriter } from "@/lib/server-data";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_req: Request, { params }: Params) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const denied = requireClubWriter(ctx.user);
  if (denied) return denied;
  const { id } = await params;
  if (!ctx.user.clubId) return badRequest("No encontrado");
  const existing = await prisma.document.findUnique({ where: { id } });
  if (!existing || existing.clubId !== ctx.user.clubId) return badRequest("No encontrado");
  await prisma.document.delete({ where: { id } });
  return json({ ok: true });
}
