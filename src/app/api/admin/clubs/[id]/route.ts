import prisma from "@/lib/prisma";
import { withUser, json, requireAdmin, notFound } from "@/lib/server-data";

type Params = { params: Promise<{ id: string }> };

/** Detalle completo de un club para el admin: proyectos, eventos, fans (con agregados). */
export async function GET(_req: Request, { params }: Params) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const d = requireAdmin(ctx.user); if (d) return d;
  const { id } = await params;
  const club = await prisma.club.findUnique({ where: { id } });
  if (!club || (!ctx.user.demo && club.demo)) return notFound();
  const [projects, events, fans, kpis, docs, tierDist] = await Promise.all([
    prisma.eSGProject.findMany({ where: { clubId: id }, orderBy: { createdAt: "desc" } }),
    prisma.event.findMany({ where: { clubId: id }, orderBy: { createdAt: "desc" } }),
    prisma.fanProfile.findMany({ where: { clubId: id }, orderBy: { points: "desc" }, take: 50, include: { user: { select: { name: true } } } }),
    prisma.kpi.count({ where: { clubId: id } }),
    prisma.document.count({ where: { clubId: id } }),
    prisma.fanProfile.groupBy({ by: ["tier"], where: { clubId: id }, _count: true }),
  ]);
  const totalFans = await prisma.fanProfile.count({ where: { clubId: id } });
  const activeFans = fans.filter((f) => f.completedActionIds.length > 0).length;
  return json({
    club, projects, events,
    fans: fans.map((f) => ({ id: f.userId, name: f.user.name, points: f.points, tier: f.tier, actionsCompleted: f.completedActionIds.length, badgesEarned: f.badgesEarned })),
    stats: { kpis, docs, totalFans, activeFans, participationRate: totalFans ? Math.round((activeFans / totalFans) * 1000) / 10 : 0, collectiveScore: fans.reduce((a, f) => a + f.points, 0), tierDist },
  });
}
