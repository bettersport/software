import prisma from "@/lib/prisma";
import { withUser, json, badRequest } from "@/lib/server-data";
import { generateStrategyDocument, type GriRow, type FrameworkRow } from "@/lib/strategy/engine";
import { enrichWithClaude, claudeAvailable } from "@/lib/strategy/claude";
import type { StrategyInput, ChallengeInput } from "@/lib/strategy/types";

/** POST { id } → genera el documento y guarda maturity scores + metas por desafío. */
export async function POST(req: Request) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const b = await req.json().catch(() => ({}));
  const s = await prisma.esgStrategy.findUnique({ where: { id: String(b.id ?? "") }, include: { challenges: { include: { documents: true } } } });
  if (!s || s.clubId !== ctx.user.clubId) return badRequest("Estrategia no encontrada");
  if (!s.vigenciaInicio || !s.vigenciaFin) return badRequest("Falta el período de vigencia (Paso 1)");
  if (!s.challenges.length) return badRequest("Selecciona al menos un desafío ESG (Paso 2)");

  const [griRows, fw] = await Promise.all([
    prisma.griMapping.findMany({ where: { active: true } }),
    s.alignGlobal && s.sport ? prisma.sportFramework.findFirst({ where: { active: true, sport: { equals: s.sport, mode: "insensitive" } } }) : null,
  ]);

  const input: StrategyInput = {
    orgName: s.orgName, sport: s.sport, orgType: s.orgType,
    vigenciaInicio: s.vigenciaInicio, vigenciaFin: s.vigenciaFin,
    respName: s.respName, respRole: s.respRole, respEmail: s.respEmail,
    isFirstStrategy: s.isFirstStrategy,
    challenges: s.challenges.map<ChallengeInput>((c) => ({
      id: c.id, pillar: c.pillar, key: c.key, label: c.label, isCustom: c.isCustom,
      hasBaseline: c.hasBaseline, hasDiagnosis: c.hasDiagnosis, hasHistorical: c.hasHistorical,
      documents: c.documents.map((d) => ({ name: d.name, type: d.type, size: d.size })),
      griStandard: c.griStandard, griTitle: c.griTitle, indicators: c.indicators, sdgs: c.sdgs,
      goalText: c.goalText, budgetStatus: c.budgetStatus as ChallengeInput["budgetStatus"],
      budgetAmount: c.budgetAmount, budgetCurrency: c.budgetCurrency as "CLP" | "USD",
      budgetPeriod: c.budgetPeriod as "anual" | "total", hrStatus: c.hrStatus as ChallengeInput["hrStatus"], hrNote: c.hrNote,
    })),
    objectives: s.objectives, alignGlobal: s.alignGlobal, globalBody: fw?.organism ?? s.globalBody,
    additionalContext: s.additionalContext, reviewFrequency: s.reviewFrequency,
  };

  let doc = generateStrategyDocument(input, griRows as GriRow[], (fw as FrameworkRow | null) ?? null, s.version);
  if (claudeAvailable()) doc = await enrichWithClaude(doc, input);

  // Persistir metas/hitos/proyectos por desafío para trazabilidad + maturity scores.
  for (const p of doc.pillars.flatMap((pp) => pp.plans)) {
    const ch = s.challenges.find((c) => c.key === p.key && c.pillar === p.pillar);
    if (!ch) continue;
    await prisma.strategyChallenge.update({
      where: { id: ch.id },
      data: {
        griStandard: p.griStandard, griTitle: p.griTitle, indicators: p.indicators, sdgs: p.sdgs,
        goalText: p.goalText, goalPreliminary: p.goalPreliminary, milestones: p.milestones as object,
        proposedProjects: p.proposedProjects as object,
      },
    });
  }
  const updated = await prisma.esgStrategy.update({
    where: { id: s.id },
    data: { generatedDoc: doc as object, generatedAt: new Date(), maturityScores: doc.diagnosis.maturity as object, status: "generated", currentStep: 7, globalBody: fw?.organism ?? s.globalBody },
    include: { challenges: { include: { documents: true }, orderBy: { createdAt: "asc" } } },
  });
  return json(updated);
}
