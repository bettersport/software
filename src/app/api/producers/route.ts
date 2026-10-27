import prisma from "@/lib/prisma";
import { withUser, json, badRequest, str, num, strArr, catalogFilter } from "@/lib/server-data";

const SELECT = {
  id: true, name: true, initials: true, color: true, description: true, website: true,
  country: true, flag: true, regions: true, specialties: true, capabilities: true,
  certifications: true, maxCapacity: true, eventsProduced: true,
  reportsOnPlatform: true, verified: true, demo: true, userId: true,
} as const;

/** GET: catálogo de productoras y, si la cuenta es una, su propio perfil. */
export async function GET() {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;

  const [producers, mine] = await Promise.all([
    prisma.producer.findMany({ where: catalogFilter(ctx.user), select: SELECT, orderBy: [{ verified: "desc" }, { eventsProduced: "desc" }] }),
    ctx.user.role === "productora"
      ? prisma.producer.findUnique({ where: { userId: ctx.user.id }, select: SELECT })
      : Promise.resolve(null),
  ]);

  return json({ producers, mine });
}

/**
 * POST: la productora crea o actualiza su propio perfil. Es el flujo de
 * registro autónomo; el catálogo inicial llega sembrado y sin cuenta asociada.
 */
export async function POST(req: Request) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  if (ctx.user.role !== "productora") return badRequest("Solo las cuentas de productora tienen perfil");

  const b = await req.json().catch(() => ({}));
  const name = str(b.name, 160);
  if (!name) return badRequest("El nombre de la productora es obligatorio");

  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
  const data = {
    name,
    initials,
    description: str(b.description, 2000),
    website: str(b.website, 300) || null,
    regions: strArr(b.regions, 20),
    specialties: strArr(b.specialties, 20),
    capabilities: strArr(b.capabilities, 20),
    certifications: strArr(b.certifications, 20),
    maxCapacity: Math.round(num(b.maxCapacity, { min: 0, max: 1_000_000 }) ?? 0),
    eventsProduced: Math.round(num(b.eventsProduced, { min: 0, max: 100_000 }) ?? 0),
    reportsOnPlatform: b.reportsOnPlatform === true,
  };

  const existing = await prisma.producer.findUnique({ where: { userId: ctx.user.id }, select: { id: true } });
  const saved = existing
    ? await prisma.producer.update({ where: { id: existing.id }, data, select: SELECT })
    // Un perfil creado por su dueño nunca nace marcado como dato sembrado.
    : await prisma.producer.create({ data: { ...data, userId: ctx.user.id, demo: false }, select: SELECT });

  return json(saved, { status: existing ? 200 : 201 });
}
