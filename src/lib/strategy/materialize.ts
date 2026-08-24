import "server-only";
/**
 * Materialización de la estrategia: convierte las metas generadas en datos
 * vivos de la plataforma — proyectos ESG (Gestión ESG), KPIs del club
 * (Performance) y puntaje/ranking recalculados. Se ejecuta automáticamente
 * al generar la estrategia; el endpoint /api/strategy/materialize la reusa
 * para estrategias antiguas que quedaron sin activar.
 */
import prisma from "@/lib/prisma";
import { recomputeClubScore } from "@/lib/scoring-server";
import { notify } from "@/lib/server-data";
import { PILLAR_LABEL, type ProposedProject, type Milestone, type Pillar } from "@/lib/strategy/types";
import type { ESGCategory } from "@/lib/types";
import type { Prisma } from "@prisma/client";

const PILLAR_COLOR: Record<Pillar, string> = { ambiental: "#10B981", social: "#3B82F6", gobernanza: "#8B5CF6" };
const PILLAR_ICON: Record<Pillar, string> = { ambiental: "🌱", social: "🤝", gobernanza: "🛡️" };

/** % de un texto de hito ("Reducir 6% acumulado…" → 6). */
const pctOf = (t: string) => {
  const m = t.match(/(\d+(?:[.,]\d+)?)\s*%/);
  return m ? parseFloat(m[1].replace(",", ".")) : null;
};

type StrategyWithChallenges = Prisma.EsgStrategyGetPayload<{ include: { challenges: { include: { projects: true } } } }>;

/**
 * Crea proyectos ESG y KPIs del club a partir de las metas de la estrategia,
 * marca la estrategia como activa y recalcula puntaje + ranking.
 * Idempotente: desafíos ya materializados y KPIs con el mismo nombre se omiten.
 */
export async function materializeStrategy(s: StrategyWithChallenges, userId: string): Promise<{ createdProjects: number; createdKpis: number }> {
  if (!s.generatedDoc || !s.vigenciaInicio || !s.vigenciaFin) return { createdProjects: 0, createdKpis: 0 };

  const start = new Date(`${s.vigenciaInicio}-01-01`);
  const end = new Date(`${s.vigenciaFin}-12-31`);
  let createdProjects = 0;
  for (const ch of s.challenges) {
    if (ch.projects.length) continue; // ya materializado
    const proposals = (ch.proposedProjects as ProposedProject[] | null) ?? [];
    const ms = (ch.milestones as Milestone[] | null) ?? [];
    for (const p of proposals) {
      await prisma.eSGProject.create({
        data: {
          title: p.title, category: p.category as ESGCategory, status: "planning", progress: 0,
          budget: p.estimatedBudget ?? 0, spent: 0, startDate: start, endDate: end,
          responsible: s.respName || "Por asignar",
          description: `${p.description}\n\nMeta (${ch.griStandard}): ${ch.goalText}`,
          milestones: ms.map((m, i) => ({ id: `m${i + 1}`, title: `${m.year} · ${m.label}`, date: `${m.year}-12-31`, completed: false })) as object,
          kpis: (ch.indicators ?? []).map((ind, i) => ({ id: `k${i + 1}`, name: ind, current: 0, target: 100, unit: "%", trend: "up" })) as object,
          clubId: s.clubId, challengeId: ch.id,
        },
      });
      createdProjects++;
    }
  }

  // KPIs del club (sección Performance): uno por desafío, meta = % del hito de cierre.
  const existing = new Set((await prisma.kpi.findMany({ where: { clubId: s.clubId }, select: { name: true } })).map((k) => k.name));
  let createdKpis = 0;
  for (const ch of s.challenges) {
    const name = `${ch.label} (${ch.griStandard})`;
    if (existing.has(name)) continue;
    const ms = (ch.milestones as Milestone[] | null) ?? [];
    const finalPct = ms.length ? pctOf(ms[ms.length - 1].target) : null;
    const pillar = ch.pillar as Pillar;
    await prisma.kpi.create({
      data: {
        name,
        category: PILLAR_LABEL[pillar] ?? pillar,
        current: 0,
        target: finalPct ?? 100,
        unit: "%",
        trend: "up",
        color: PILLAR_COLOR[pillar] ?? "#10B981",
        icon: PILLAR_ICON[pillar] ?? "📊",
        description: ch.goalText || `Avance acumulado hacia la meta ${s.vigenciaInicio}–${s.vigenciaFin}.`,
        clubId: s.clubId,
      },
    });
    createdKpis++;
  }

  if (createdProjects > 0 || createdKpis > 0) {
    await prisma.esgStrategy.update({ where: { id: s.id }, data: { status: "active" } });
    await recomputeClubScore(s.clubId);
    const parts = [
      createdProjects > 0 ? `${createdProjects} proyecto(s) ESG` : null,
      createdKpis > 0 ? `${createdKpis} KPI(s) de seguimiento` : null,
    ].filter(Boolean);
    await notify(userId, { type: "success", title: "Estrategia activada en la plataforma", message: `Se crearon ${parts.join(" y ")} desde tu estrategia. Ya alimentan Gestión ESG, Performance y tu puntaje ESG.` });
  }
  return { createdProjects, createdKpis };
}
