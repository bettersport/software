import prisma from "@/lib/prisma";
import { withUser, json, badRequest } from "@/lib/server-data";
import type { ProposedProject, Milestone } from "@/lib/strategy/types";
import type { ESGCategory } from "@/lib/types";

/** POST { id } → crea un ESGProject por proyecto propuesto (una sola vez por desafío). */
export async function POST(req: Request) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const b = await req.json().catch(() => ({}));
  const s = await prisma.esgStrategy.findUnique({ where: { id: String(b.id ?? "") }, include: { challenges: { include: { projects: true } } } });
  if (!s || s.clubId !== ctx.user.clubId) return badRequest("Estrategia no encontrada");
  if (!s.generatedDoc) return badRequest("Primero genera la estrategia");

  const start = new Date(`${s.vigenciaInicio}-01-01`);
  const end = new Date(`${s.vigenciaFin}-12-31`);
  let created = 0;
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
      created++;
    }
  }
  await prisma.esgStrategy.update({ where: { id: s.id }, data: { status: "active" } });
  return json({ created });
}
