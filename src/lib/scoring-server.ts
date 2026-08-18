import "server-only";
import prisma from "./prisma";
import { computeClubScore } from "./scoring";
import type { Club, ESGProject } from "./types";

/**
 * Recalcula y PERSISTE el puntaje ESG de un club a partir de sus proyectos,
 * y luego reasigna el ranking global. Llamar tras cualquier mutación de proyectos.
 * computeClubScore es la única implementación (compartida con el cliente para preview).
 */
export async function recomputeClubScore(clubId: string) {
  const club = await prisma.club.findUnique({ where: { id: clubId } });
  if (!club) return;
  const projects = await prisma.eSGProject.findMany({ where: { clubId } });
  // La base para el cómputo son las dimensiones "sin bonus" — las guardamos como el
  // valor actual menos el bonus previo no es posible; usamos el modelo simple:
  // dimensiones base = las almacenadas al crear el club (0 para clubes reales, seed para demo).
  // Para no acumular bonus sobre bonus, calculamos desde una base persistida en el propio club.
  const base: Club = {
    id: club.id, name: club.name, sport: club.sport, country: club.country, flag: club.flag,
    esgScore: 0, ranking: club.ranking,
    environmental: club.baseEnvironmental ?? 0, social: club.baseSocial ?? 0,
    governance: club.baseGovernance ?? 0, transparency: club.transparency,
    members: club.members, founded: club.founded, description: club.description ?? undefined,
  };
  const scored = computeClubScore(base, projects as unknown as ESGProject[]);
  await prisma.club.update({
    where: { id: clubId },
    data: { esgScore: scored.esgScore, environmental: scored.environmental, social: scored.social, governance: scored.governance },
  });
  await recomputeRankings();
}

/** Reasigna `ranking` (1..n) por esgScore desc, separando demo y reales (cada universo tiene su ranking). */
export async function recomputeRankings() {
  for (const demo of [true, false]) {
    const clubs = await prisma.club.findMany({ where: { demo }, orderBy: [{ esgScore: "desc" }, { name: "asc" }], select: { id: true } });
    await prisma.$transaction(clubs.map((c, i) => prisma.club.update({ where: { id: c.id }, data: { ranking: i + 1 } })));
  }
}
