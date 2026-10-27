import "server-only";
import prisma from "./prisma";

/* ============================================================================
   Agregados para el panel institucional (Ministerio del Deporte / COCH).
   Todo sale de datos reales de la plataforma. Lo único declarado aparte son
   los valores de referencia regional, marcados como tales en REGIONAL_REFERENCE.
   ========================================================================= */

/** Una organización "reporta" cuando tiene al menos un proyecto ESG o un KPI cargado. */
const REPORTING = {
  OR: [{ esgProjects: { some: {} } }, { kpis: { some: {} } }],
};

/** Las categorías de proyecto que no nacen de un desafío se asignan a su pilar. */
const CATEGORY_PILLAR: Record<string, "ambiental" | "social" | "gobernanza"> = {
  huella_hidrica: "ambiental",
  huella_carbono: "ambiental",
  gestion_residuos: "ambiental",
  educacion: "social",
  inclusion: "social",
  equidad_genero: "social",
};

export interface InstitutionalOverview {
  reporting: { clubs: number; federations: number; events: number };
  registered: { clubs: number; federations: number; events: number };
  licenses: { active: number; investment: number };
  investment: {
    total: number;
    byPillar: { pillar: "ambiental" | "social" | "gobernanza"; amount: number }[];
    executed: number;
  };
  ranking: {
    clubs: { id: string; name: string; sport: string; country: string; flag: string; esgScore: number }[];
    federations: { id: string; name: string; sport: string; country: string; flag: string; esgScore: number }[];
  };
  benchmark: { country: string; flag: string; score: number; isChile: boolean; reference: boolean }[];
  regionAverage: number;
  generatedAt: string;
}

/**
 * Valores de referencia regional. NO son datos de la plataforma: sirven para
 * situar a Chile mientras no exista una fuente oficial acordada. La interfaz
 * los muestra siempre rotulados como referencia.
 */
const REGIONAL_REFERENCE = [
  { country: "Brasil", flag: "🇧🇷", score: 71.4 },
  { country: "Argentina", flag: "🇦🇷", score: 66.8 },
  { country: "Colombia", flag: "🇨🇴", score: 63.2 },
  { country: "Uruguay", flag: "🇺🇾", score: 61.5 },
  { country: "Perú", flag: "🇵🇪", score: 57.9 },
  { country: "Ecuador", flag: "🇪🇨", score: 54.3 },
];

export async function getInstitutionalOverview(): Promise<InstitutionalOverview> {
  const now = new Date();

  const [
    reportingClubs, reportingFeds, reportingEvents,
    regClubs, regFeds, regEvents,
    activeLicenses, paidSubs,
    projects, chileClubs,
  ] = await Promise.all([
    prisma.club.count({ where: { demo: false, orgType: "club", ...REPORTING } }),
    prisma.club.count({ where: { demo: false, orgType: "federacion", ...REPORTING } }),
    prisma.club.count({ where: { demo: false, orgType: "evento", ...REPORTING } }),
    prisma.club.count({ where: { demo: false, orgType: "club" } }),
    prisma.club.count({ where: { demo: false, orgType: "federacion" } }),
    prisma.club.count({ where: { demo: false, orgType: "evento" } }),
    prisma.user.count({ where: { demo: false, planUntil: { gt: now } } }),
    prisma.subscription.aggregate({ where: { status: "paid" }, _sum: { amountTotal: true } }),
    prisma.eSGProject.findMany({
      where: { club: { demo: false } },
      select: { budget: true, spent: true, category: true, challenge: { select: { pillar: true } } },
    }),
    prisma.club.findMany({
      where: { demo: false, esgScore: { gt: 0 } },
      select: { id: true, name: true, sport: true, country: true, flag: true, esgScore: true, orgType: true },
      orderBy: { esgScore: "desc" },
    }),
  ]);

  // Inversión por pilar: manda el pilar del desafío cuando el proyecto nace de la estrategia.
  const byPillar = { ambiental: 0, social: 0, gobernanza: 0 };
  let total = 0;
  let executed = 0;
  for (const p of projects) {
    const pillar = p.challenge?.pillar ?? CATEGORY_PILLAR[p.category] ?? "gobernanza";
    byPillar[pillar] += p.budget || 0;
    total += p.budget || 0;
    executed += p.spent || 0;
  }

  const clubsRanked = chileClubs.filter((c) => c.orgType === "club");
  const fedsRanked = chileClubs.filter((c) => c.orgType === "federacion");

  // Chile se calcula con los datos reales de la plataforma.
  const chileScore = chileClubs.length
    ? chileClubs.reduce((s, c) => s + c.esgScore, 0) / chileClubs.length
    : 0;

  const benchmark = [
    { country: "Chile", flag: "🇨🇱", score: Number(chileScore.toFixed(1)), isChile: true, reference: false },
    ...REGIONAL_REFERENCE.map((r) => ({ ...r, isChile: false, reference: true })),
  ].sort((a, b) => b.score - a.score);

  const regionAverage = benchmark.length
    ? Number((benchmark.reduce((s, b) => s + b.score, 0) / benchmark.length).toFixed(1))
    : 0;

  const strip = ({ orgType: _o, ...rest }: (typeof chileClubs)[number]) => rest;

  return {
    reporting: { clubs: reportingClubs, federations: reportingFeds, events: reportingEvents },
    registered: { clubs: regClubs, federations: regFeds, events: regEvents },
    licenses: { active: activeLicenses, investment: paidSubs._sum.amountTotal ?? 0 },
    investment: {
      total,
      executed,
      byPillar: (["ambiental", "social", "gobernanza"] as const).map((pillar) => ({ pillar, amount: byPillar[pillar] })),
    },
    ranking: { clubs: clubsRanked.slice(0, 10).map(strip), federations: fedsRanked.slice(0, 10).map(strip) },
    benchmark,
    regionAverage,
    generatedAt: now.toISOString(),
  };
}
