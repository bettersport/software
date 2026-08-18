import prisma from "@/lib/prisma";
import { withUser, json } from "@/lib/server-data";

/** Catálogos de configuración del Motor IA (Anexo A y B) + catálogo de objetivos. */
export async function GET() {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const [gri, frameworks] = await Promise.all([
    prisma.griMapping.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
    prisma.sportFramework.findMany({ where: { active: true }, orderBy: { sport: "asc" } }),
  ]);
  return json({ gri, frameworks });
}
