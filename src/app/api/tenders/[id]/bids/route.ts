import prisma from "@/lib/prisma";
import { withUser, json, badRequest, notFound, requireRole, str, num, notify } from "@/lib/server-data";

type Params = { params: Promise<{ id: string }> };

/** POST: la productora presenta su oferta a una licitación abierta. */
export async function POST(req: Request, { params }: Params) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const denied = requireRole(ctx.user, ["productora"]);
  if (denied) return denied;

  const { id } = await params;
  const tender = await prisma.tender.findUnique({
    where: { id },
    select: { id: true, status: true, title: true, brandId: true },
  });
  if (!tender) return notFound("Licitación no encontrada");
  if (tender.status !== "abierta") return badRequest("La licitación ya no recibe ofertas");

  const producer = await prisma.producer.findUnique({ where: { userId: ctx.user.id }, select: { id: true, name: true } });
  if (!producer) return badRequest("Primero completa el perfil de tu productora");

  const b = await req.json().catch(() => ({}));
  const amount = num(b.amount, { min: 0, max: 10_000_000_000 });

  const bid = await prisma.tenderBid.upsert({
    where: { tenderId_producerId: { tenderId: id, producerId: producer.id } },
    update: {
      message: str(b.message, 4000),
      approach: str(b.approach, 4000),
      amount: Math.round(amount ?? 0),
      status: "enviada",
    },
    create: {
      tenderId: id,
      producerId: producer.id,
      message: str(b.message, 4000),
      approach: str(b.approach, 4000),
      amount: Math.round(amount ?? 0),
    },
  });

  await notify(tender.brandId, {
    type: "success",
    title: "Nueva oferta recibida",
    message: `${producer.name} presentó una oferta para "${tender.title}".`,
  });

  return json(bid, { status: 201 });
}
