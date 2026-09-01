import prisma from "@/lib/prisma";
import { withUser, json, badRequest, catalogFilter, requireClubWriter, enumOr, num, str } from "@/lib/server-data";

export async function GET() {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const events = await prisma.event.findMany({
    where: catalogFilter(ctx.user),
    orderBy: { createdAt: "desc" },
  });
  return json(events);
}

const CATEGORIES = [
  "huella_hidrica", "huella_carbono", "gestion_residuos",
  "educacion", "inclusion", "equidad_genero",
] as const;

/** Imagen por defecto cuando el club no sube una propia. */
const DEFAULT_IMAGES: Record<(typeof CATEGORIES)[number], string> = {
  huella_hidrica: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&q=80",
  huella_carbono: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&q=80",
  gestion_residuos: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&q=80",
  educacion: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=600&q=80",
  inclusion: "https://images.unsplash.com/photo-1526676037777-05a232554f77?w=600&q=80",
  equidad_genero: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&q=80",
};

function validImage(value: unknown): string | null {
  if (typeof value !== "string" || !value) return null;
  if (value.startsWith("https://") && value.length <= 2000) return value;
  // Data URL subida desde el navegador (~1.5MB máx para no inflar el listado).
  if (value.startsWith("data:image/") && value.length <= 2_000_000) return value;
  return null;
}

/** POST: un club publica un evento en el marketplace para buscar patrocinio. */
export async function POST(req: Request) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const denied = requireClubWriter(ctx.user);
  if (denied) return denied;

  const b = await req.json().catch(() => ({}));
  const title = str(b.title, 160);
  const category = enumOr(b.category, CATEGORIES);
  const description = str(b.description, 2000);
  const budget = num(b.budget, { min: 1, max: 100_000_000 });
  if (!title || !category || !description || budget === null)
    return badRequest("Título, categoría, descripción y presupuesto son obligatorios");

  const club = await prisma.club.findUnique({ where: { id: ctx.user.clubId! } });
  if (!club) return badRequest("La cuenta no tiene un club asociado");

  const event = await prisma.event.create({
    data: {
      title,
      clubName: club.name,
      country: club.country,
      flag: club.flag,
      sport: str(b.sport, 40) || club.sport,
      category,
      image: validImage(b.image) ?? DEFAULT_IMAGES[category],
      description,
      sustainableImpact: str(b.sustainableImpact, 1000),
      budget,
      audience: num(b.audience, { min: 0, max: 100_000_000 }) ?? 0,
      daysLeft: num(b.daysLeft, { min: 1, max: 365 }) ?? 30,
      demo: ctx.user.demo,
      clubId: club.id,
    },
  });
  return json(event, { status: 201 });
}
