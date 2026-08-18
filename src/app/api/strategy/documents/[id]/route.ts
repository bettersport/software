import prisma from "@/lib/prisma";
import { withUser, json, notFound, requireClubWriter } from "@/lib/server-data";
import { deleteFile } from "@/lib/storage";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_req: Request, { params }: Params) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const denied = requireClubWriter(ctx.user);
  if (denied) return denied;
  const { id } = await params;
  const doc = await prisma.strategyDocument.findUnique({ where: { id }, include: { challenge: { include: { strategy: true } } } });
  if (!doc || doc.challenge.strategy.clubId !== ctx.user.clubId) return notFound();
  await deleteFile(doc.storageKey);
  await prisma.strategyDocument.delete({ where: { id } });
  return json({ ok: true });
}
