import prisma from "@/lib/prisma";
import { withUser, json, requireAdmin } from "@/lib/server-data";

/** Agregados reales de la plataforma para el admin. */
export async function GET() {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const d = requireAdmin(ctx.user); if (d) return d;
  const where = ctx.user.demo ? {} : { demo: false };
  const [clubs, brands, fans, esgAvg, projects, projectsByStatus, events, kpis, docs, byCountry, bySport, brandInvest, leads, growth] = await Promise.all([
    prisma.club.count({ where }),
    prisma.user.count({ where: { role: "brand", ...(ctx.user.demo ? {} : { demo: false }) } }),
    prisma.fanProfile.count(),
    prisma.club.aggregate({ where, _avg: { esgScore: true, environmental: true, social: true, governance: true, transparency: true } }),
    prisma.eSGProject.count(),
    prisma.eSGProject.groupBy({ by: ["status"], _count: true }),
    prisma.event.count({ where }),
    prisma.kpi.count(),
    prisma.document.count(),
    prisma.club.groupBy({ by: ["country"], where, _count: true }),
    prisma.club.groupBy({ by: ["sport"], where, _count: true }),
    prisma.brandProject.aggregate({ _sum: { investment: true }, _count: true }),
    prisma.sponsorLead.count(),
    prisma.$queryRawUnsafe<{ month: string; clubs: number }[]>(`SELECT to_char(date_trunc('month',"createdAt"),'YYYY-MM') AS month, COUNT(*)::int AS clubs FROM "Club" ${ctx.user.demo ? "" : 'WHERE "demo"=false'} GROUP BY 1 ORDER BY 1`),
  ]);
  return json({
    clubs, brands, fans, esgAvg: esgAvg._avg, projects, projectsByStatus, events, kpis, docs,
    countries: byCountry.length, sports: bySport.length, byCountry, bySport,
    brandInvestment: brandInvest._sum.investment ?? 0, brandProjects: brandInvest._count, sponsorLeads: leads, growth,
  });
}
