import prisma from "@/lib/prisma";
import { withUser, json, badRequest, requireClubWriter } from "@/lib/server-data";
import { maturityOf } from "@/lib/strategy/engine";

const include = { challenges: { include: { documents: true }, orderBy: { createdAt: "asc" as const } } };

/** GET: la estrategia más reciente del club (borrador o generada), o null. */
export async function GET() {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  if (!ctx.user.clubId) return json(null);
  const s = await prisma.esgStrategy.findFirst({
    where: { clubId: ctx.user.clubId, status: { not: "archived" } },
    orderBy: { updatedAt: "desc" },
    include,
  });
  return json(s);
}

/** POST: crea un borrador nuevo (o una nueva versión si ya hay una generada). */
export async function POST() {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const denied = requireClubWriter(ctx.user);
  if (denied) return denied;
  const clubId = ctx.user.clubId!; // garantizado por requireClubWriter

  const club = await prisma.club.findUnique({ where: { id: clubId } });
  const last = await prisma.esgStrategy.findFirst({ where: { clubId }, orderBy: { version: "desc" } });
  const s = await prisma.esgStrategy.create({
    data: {
      clubId,
      version: (last?.version ?? 0) + 1,
      orgName: club?.name ?? "",
      sport: club?.sport && club.sport !== "—" ? club.sport : "",
      respName: ctx.user.name,
      respEmail: ctx.user.email,
      isFirstStrategy: !last,
      objectives: [],
    },
    include,
  });
  return json(s, { status: 201 });
}

/**
 * PATCH: autosave. Body: { id, ...campos de estrategia, challenges?: ChallengeInput[] }
 * Reemplaza el set completo de desafíos si viene `challenges`.
 */
export async function PATCH(req: Request) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const denied = requireClubWriter(ctx.user);
  if (denied) return denied;
  const b = await req.json().catch(() => ({}));
  if (!b.id) return badRequest("Falta id");
  const existing = await prisma.esgStrategy.findUnique({ where: { id: String(b.id) } });
  if (!existing || existing.clubId !== ctx.user.clubId) return badRequest("Estrategia no encontrada");

  const data: Record<string, unknown> = {};
  const str = (k: string) => { if (b[k] !== undefined) data[k] = String(b[k] ?? ""); };
  ["orgName", "sport", "orgType", "respName", "respRole", "respEmail", "additionalContext", "reviewFrequency"].forEach(str);
  if (b.vigenciaInicio !== undefined) data.vigenciaInicio = b.vigenciaInicio == null ? null : Number(b.vigenciaInicio);
  if (b.vigenciaFin !== undefined) data.vigenciaFin = b.vigenciaFin == null ? null : Number(b.vigenciaFin);
  if (b.isFirstStrategy !== undefined) data.isFirstStrategy = !!b.isFirstStrategy;
  if (b.objectives !== undefined) data.objectives = Array.isArray(b.objectives) ? b.objectives.map(String) : [];
  if (b.alignGlobal !== undefined) data.alignGlobal = !!b.alignGlobal;
  if (b.globalBody !== undefined) data.globalBody = b.globalBody ? String(b.globalBody) : null;
  if (b.currentStep !== undefined) data.currentStep = Math.max(existing.currentStep, Number(b.currentStep) || 0);
  if (b.status !== undefined && ["draft", "generated", "active", "archived"].includes(b.status)) data.status = b.status;

  await prisma.esgStrategy.update({ where: { id: existing.id }, data });

  if (Array.isArray(b.challenges)) {
    // Sync: mantener ids existentes, crear nuevos, borrar los quitados.
    // Seguridad: un id que no pertenezca a ESTA estrategia se ignora (no IDOR).
    const owned = new Set((await prisma.strategyChallenge.findMany({ where: { strategyId: existing.id }, select: { id: true } })).map((c) => c.id));
    const incoming = (b.challenges as Array<Record<string, unknown>>).map((c) => (c.id && !owned.has(String(c.id)) ? { ...c, id: undefined } : c));
    const keepIds = incoming.map((c) => c.id).filter(Boolean) as string[];
    await prisma.strategyChallenge.deleteMany({ where: { strategyId: existing.id, id: { notIn: keepIds } } });
    for (const c of incoming) {
      const payload = {
        pillar: c.pillar as "ambiental" | "social" | "gobernanza",
        key: String(c.key), label: String(c.label), isCustom: !!c.isCustom,
        hasBaseline: !!c.hasBaseline, hasDiagnosis: !!c.hasDiagnosis, hasHistorical: !!c.hasHistorical,
        maturity: maturityOf({ hasBaseline: !!c.hasBaseline, hasDiagnosis: !!c.hasDiagnosis, hasHistorical: !!c.hasHistorical }),
        griStandard: String(c.griStandard ?? ""), griTitle: String(c.griTitle ?? ""),
        indicators: Array.isArray(c.indicators) ? (c.indicators as unknown[]).map(String) : [],
        sdgs: Array.isArray(c.sdgs) ? (c.sdgs as unknown[]).map(String) : [],
        goalText: String(c.goalText ?? ""),
        budgetStatus: String(c.budgetStatus ?? "no"),
        budgetAmount: c.budgetAmount == null || c.budgetAmount === "" ? null : Number(c.budgetAmount),
        budgetCurrency: String(c.budgetCurrency ?? "CLP"), budgetPeriod: String(c.budgetPeriod ?? "total"),
        hrStatus: String(c.hrStatus ?? "no"), hrNote: String(c.hrNote ?? ""),
      };
      const docs = Array.isArray(c.documents) ? (c.documents as Array<{ name: string; type: string; size: string }>) : [];
      if (c.id) {
        await prisma.strategyChallenge.update({ where: { id: String(c.id) }, data: payload });
        // docs: reemplazo simple
        await prisma.strategyDocument.deleteMany({ where: { challengeId: String(c.id) } });
        if (docs.length) await prisma.strategyDocument.createMany({ data: docs.map((d) => ({ name: String(d.name), type: String(d.type ?? "doc"), size: String(d.size ?? ""), challengeId: String(c.id) })) });
      } else {
        const created = await prisma.strategyChallenge.create({ data: { ...payload, strategyId: existing.id } });
        if (docs.length) await prisma.strategyDocument.createMany({ data: docs.map((d) => ({ name: String(d.name), type: String(d.type ?? "doc"), size: String(d.size ?? ""), challengeId: created.id })) });
      }
    }
  }

  const s = await prisma.esgStrategy.findUnique({ where: { id: existing.id }, include });
  return json(s);
}
