import prisma from "@/lib/prisma";
import { withUser, json, badRequest, requireClubWriter } from "@/lib/server-data";
import { materializeStrategy } from "@/lib/strategy/materialize";

/**
 * POST { id } → materializa la estrategia: proyectos ESG + KPIs del club +
 * puntaje/ranking. Desde ahora esto ocurre automáticamente al generar; el
 * endpoint queda para estrategias antiguas que quedaron sin activar.
 */
export async function POST(req: Request) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const denied = requireClubWriter(ctx.user);
  if (denied) return denied;
  const b = await req.json().catch(() => ({}));
  const s = await prisma.esgStrategy.findUnique({ where: { id: String(b.id ?? "") }, include: { challenges: { include: { projects: true } } } });
  if (!s || s.clubId !== ctx.user.clubId) return badRequest("Estrategia no encontrada");
  if (!s.generatedDoc) return badRequest("Primero genera la estrategia");
  if (!s.vigenciaInicio || !s.vigenciaFin) return badRequest("Falta el período de vigencia");

  const { createdProjects, createdKpis } = await materializeStrategy(s, ctx.user.id);
  return json({ created: createdProjects, createdKpis });
}
