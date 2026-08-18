import prisma from "@/lib/prisma";
import { withUser, json } from "@/lib/server-data";

export async function GET() {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const items = await prisma.notification.findMany({ where: { userId: ctx.user.id }, orderBy: { createdAt: "desc" }, take: 50 });
  return json(items);
}

/** PATCH { ids?: string[] } → marca como leídas (todas si no se pasan ids). */
export async function PATCH(req: Request) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const b = await req.json().catch(() => ({}));
  const ids = Array.isArray(b.ids) ? b.ids.map(String) : null;
  const r = await prisma.notification.updateMany({
    where: { userId: ctx.user.id, ...(ids ? { id: { in: ids } } : {}) },
    data: { read: true },
  });
  return json({ updated: r.count });
}
