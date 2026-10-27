import "server-only";
import prisma from "./prisma";

/* ============================================================================
   Licencias Bettersport vistas desde la marca.
   El reporte se arma una sola vez y la interfaz decide qué bloques mostrar
   según a quién se le reporta (directorio, sostenibilidad, marketing, finanzas).
   ========================================================================= */

/** Pilar al que pertenece cada categoría de proyecto. */
const CATEGORY_PILLAR: Record<string, "ambiental" | "social" | "gobernanza"> = {
  huella_hidrica: "ambiental",
  huella_carbono: "ambiental",
  gestion_residuos: "ambiental",
  educacion: "social",
  inclusion: "social",
  equidad_genero: "social",
};

export interface BrandLicenseReport {
  licenses: {
    total: number;
    active: number;
    assigned: number;
    available: number;
    expired: number;
    /** Asignadas sobre vigentes, en porcentaje. */
    usedPct: number;
    /** Organizaciones con licencia que efectivamente reportan. */
    reporting: number;
    investment: number;
    unitCost: number;
  };
  portfolio: {
    licenseId: string;
    orgId: string | null;
    name: string;
    orgType: string;
    sport: string;
    esgScore: number;
    reporting: boolean;
    projects: number;
    periodEnd: string;
    status: string;
  }[];
  impact: {
    byPillar: { pillar: "ambiental" | "social" | "gobernanza"; amount: number }[];
    committed: number;
    executed: number;
    projectsActive: number;
    projectsCompleted: number;
    kpis: number;
  };
  marketing: { audience: number; events: number; fans: number };
  generatedAt: string;
}

export async function getBrandLicenseReport(brandId: string): Promise<BrandLicenseReport> {
  const now = new Date();

  const licenses = await prisma.license.findMany({
    where: { brandId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true, status: true, amount: true, periodEnd: true, clubId: true,
      club: {
        select: {
          id: true, name: true, orgType: true, sport: true, esgScore: true,
          _count: { select: { esgProjects: true, kpis: true, fanProfiles: true } },
        },
      },
    },
  });

  const active = licenses.filter((l) => l.periodEnd > now);
  const assigned = active.filter((l) => l.clubId);
  const investment = licenses.reduce((s, l) => s + l.amount, 0);
  const reporting = assigned.filter((l) => (l.club?._count.esgProjects ?? 0) + (l.club?._count.kpis ?? 0) > 0);

  const clubIds = assigned.map((l) => l.clubId).filter((id): id is string => !!id);

  // Impacto y alcance del portafolio patrocinado.
  const [projects, events, fans] = await Promise.all([
    clubIds.length
      ? prisma.eSGProject.findMany({
          where: { clubId: { in: clubIds } },
          select: { budget: true, spent: true, category: true, status: true, challenge: { select: { pillar: true } } },
        })
      : Promise.resolve([]),
    clubIds.length
      ? prisma.event.aggregate({ where: { clubId: { in: clubIds } }, _sum: { audience: true }, _count: true })
      : Promise.resolve({ _sum: { audience: null }, _count: 0 } as const),
    clubIds.length
      ? prisma.fanProfile.count({ where: { clubId: { in: clubIds } } })
      : Promise.resolve(0),
  ]);

  const byPillar = { ambiental: 0, social: 0, gobernanza: 0 };
  let committed = 0;
  let executed = 0;
  for (const p of projects) {
    const pillar = CATEGORY_PILLAR[p.category] ?? p.challenge?.pillar ?? "gobernanza";
    byPillar[pillar] += p.budget || 0;
    committed += p.budget || 0;
    executed += p.spent || 0;
  }

  return {
    licenses: {
      total: licenses.length,
      active: active.length,
      assigned: assigned.length,
      available: active.length - assigned.length,
      expired: licenses.length - active.length,
      usedPct: active.length ? Math.round((assigned.length / active.length) * 100) : 0,
      reporting: reporting.length,
      investment,
      unitCost: licenses.length ? Math.round(investment / licenses.length) : 0,
    },
    portfolio: licenses.map((l) => ({
      licenseId: l.id,
      orgId: l.club?.id ?? null,
      name: l.club?.name ?? "Sin asignar",
      orgType: l.club?.orgType ?? "—",
      sport: l.club?.sport ?? "—",
      esgScore: l.club?.esgScore ?? 0,
      reporting: (l.club?._count.esgProjects ?? 0) + (l.club?._count.kpis ?? 0) > 0,
      projects: l.club?._count.esgProjects ?? 0,
      periodEnd: l.periodEnd.toISOString(),
      status: l.periodEnd > now ? l.status : "vencida",
    })),
    impact: {
      byPillar: (["ambiental", "social", "gobernanza"] as const).map((pillar) => ({ pillar, amount: byPillar[pillar] })),
      committed,
      executed,
      projectsActive: projects.filter((p) => p.status === "in_progress").length,
      projectsCompleted: projects.filter((p) => p.status === "completed").length,
      kpis: assigned.reduce((s, l) => s + (l.club?._count.kpis ?? 0), 0),
    },
    marketing: {
      audience: events._sum.audience ?? 0,
      events: events._count ?? 0,
      fans,
    },
    generatedAt: now.toISOString(),
  };
}
