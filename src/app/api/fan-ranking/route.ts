import prisma from "@/lib/prisma";
import { withUser, json } from "@/lib/server-data";

/** Ranking de fans del club del usuario + estadísticas agregadas reales. */
export async function GET() {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const clubId = ctx.user.clubId;
  if (!clubId) return json({ top: [], me: null, stats: { totalFans: 0, activeFans: 0, participationRate: 0, collectiveScore: 0 } });
  const all = await prisma.fanProfile.findMany({
    where: { clubId }, orderBy: [{ points: "desc" }, { joinedAt: "asc" }],
    include: { user: { select: { id: true, name: true } } },
  });
  const rows = all.map((f, i) => ({ id: f.userId, name: f.user.name, points: f.points, tier: f.tier, actionsCompleted: f.completedActionIds.length, badgesEarned: f.badgesEarned, rank: i + 1 }));
  const totalFans = rows.length;
  const activeFans = rows.filter((r) => r.actionsCompleted > 0).length;
  const stats = { totalFans, activeFans, participationRate: totalFans ? Math.round((activeFans / totalFans) * 1000) / 10 : 0, collectiveScore: rows.reduce((a, r) => a + r.points, 0) };
  return json({ top: rows.slice(0, 10), me: rows.find((r) => r.id === ctx.user.id) ?? null, stats });
}
