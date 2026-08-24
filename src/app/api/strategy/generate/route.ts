import prisma from "@/lib/prisma";
import { withUser, json, badRequest, requireClubWriter, notify } from "@/lib/server-data";
import { generateStrategyDocument, type GriRow, type FrameworkRow } from "@/lib/strategy/engine";
import { enrichWithClaude, claudeAvailable } from "@/lib/strategy/claude";
import { materializeStrategy } from "@/lib/strategy/materialize";
import type { StrategyInput, ChallengeInput } from "@/lib/strategy/types";

/** POST { id } → genera el documento y guarda maturity scores + metas por desafío. */
export async function POST(req: Request) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const denied = requireClubWriter(ctx.user);
  if (denied) return denied;
  const b = await req.json().catch(() => ({}));
  const s = await prisma.esgStrategy.findUnique({ where: { id: String(b.id ?? "") }, include: { challenges: { include: { documents: true } } } });
  if (!s || s.clubId !== ctx.user.clubId) return badRequest("Estrategia no encontrada");
  if (!s.vigenciaInicio || !s.vigenciaFin) return badRequest("Falta el período de vigencia (Paso 1)");
  if (!s.challenges.length) return badRequest("Selecciona al menos un desafío ESG (Paso 2)");

  const griRows = await prisma.griMapping.findMany({ where: { active: true } });
  let fw = s.alignGlobal && s.sport ? await prisma.sportFramework.findFirst({ where: { active: true, sport: { equals: s.sport, mode: "insensitive" } } }) : null;
  if (s.alignGlobal && !fw && s.globalBody) {
    fw = await prisma.sportFramework.findFirst({ where: { active: true, organism: { equals: s.globalBody, mode: "insensitive" } } });
  }

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
  const ownIds = new Set(s.challenges.map((c) => c.id));
  for (const p of doc.pillars.flatMap((pp) => pp.plans)) {
    // Emparejar por id (único); fallback a (key,pillar) solo si el plan no trae id.
    const ch = (p.id && ownIds.has(p.id)) ? s.challenges.find((c) => c.id === p.id) : s.challenges.find((c) => c.key === p.key && c.pillar === p.pillar);
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
  await prisma.esgStrategy.update({
    where: { id: s.id },
    data: { generatedDoc: doc as object, generatedAt: new Date(), maturityScores: doc.diagnosis.maturity as object, status: "generated", currentStep: 7, globalBody: fw?.organism ?? s.globalBody },
  });
  await notify(ctx.user.id, { type: "success", title: "Estrategia ESG generada", message: `Tu estrategia ${s.vigenciaInicio}–${s.vigenciaFin} está lista.` });

  // Materialización automática: proyectos ESG + KPIs del club + puntaje/ranking.
  try {
    const full = await prisma.esgStrategy.findUnique({ where: { id: s.id }, include: { challenges: { include: { projects: true } } } });
    if (full) await materializeStrategy(full, ctx.user.id);
  } catch (e) {
    console.error("[strategy] materialización automática falló:", e instanceof Error ? e.message : e);
  }

  const updated = await prisma.esgStrategy.findUnique({
    where: { id: s.id },
    include: { challenges: { include: { documents: true }, orderBy: { createdAt: "asc" } } },
  });
  return json(updated);
}
