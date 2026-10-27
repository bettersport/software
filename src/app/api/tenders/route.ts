import prisma from "@/lib/prisma";
import { withUser, json, badRequest, requireRole, str, num, strArr } from "@/lib/server-data";

const TENDER_ROLES = ["brand", "admin", "productora"] as const;
const BRAND_ROLES = ["brand", "admin"] as const;

/**
 * GET: la marca ve sus licitaciones; la productora, las abiertas de todos.
 * El admin ve todo.
 */
export async function GET() {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const denied = requireRole(ctx.user, TENDER_ROLES);
  if (denied) return denied;

  const where =
    ctx.user.role === "brand" ? { brandId: ctx.user.id }
    : ctx.user.role === "productora" ? { status: "abierta" as const }
    : {};

  const tenders = await prisma.tender.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true, title: true, eventType: true, sport: true, participants: true,
      region: true, eventDate: true, budget: true, sustainability: true,
      deadline: true, status: true, createdAt: true,
      brand: { select: { name: true, org: true } },
      _count: { select: { bids: true } },
    },
  });

  return json(tenders);
}

/** POST: la marca publica una licitación de producción. */
export async function POST(req: Request) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const denied = requireRole(ctx.user, BRAND_ROLES);
  if (denied) return denied;

  const b = await req.json().catch(() => ({}));
  const title = str(b.title, 160);
  const eventType = str(b.eventType, 60);
  const participants = num(b.participants, { min: 0, max: 1_000_000 });

  if (!title || !eventType) return badRequest("Título y tipo de evento son obligatorios");

  const tender = await prisma.tender.create({
    data: {
      title,
      description: str(b.description, 4000),
      eventType,
      sport: str(b.sport, 60),
      participants: Math.round(participants ?? 0),
      region: str(b.region, 60) || "Nacional",
      eventDate: str(b.eventDate, 40),
      budget: Math.round(num(b.budget, { min: 0, max: 10_000_000_000 }) ?? 0),
      requirements: str(b.requirements, 4000),
      sustainability: strArr(b.sustainability, 20),
      deadline: str(b.deadline, 40),
      brandId: ctx.user.id,
    },
  });

  return json(tender, { status: 201 });
}
