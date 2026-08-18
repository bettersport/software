import prisma from "@/lib/prisma";
import { withUser, json, catalogFilter } from "@/lib/server-data";

/** Directorio/ranking de clubes: solo campos públicos (sin config interna de Fan Zone). */
export async function GET() {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const clubs = await prisma.club.findMany({
    where: catalogFilter(ctx.user),
    orderBy: [{ esgScore: "desc" }, { name: "asc" }],
    select: {
      id: true, name: true, sport: true, country: true, flag: true, logo: true, description: true,
      esgScore: true, ranking: true, previousRanking: true,
      environmental: true, social: true, governance: true, transparency: true,
      members: true, founded: true, region: true, website: true, demo: true,
    },
  });
  return json(clubs);
}
