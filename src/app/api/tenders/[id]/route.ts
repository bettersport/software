import prisma from "@/lib/prisma";
import { withUser, json, badRequest, notFound, requireRole, enumOr, notify, catalogFilter } from "@/lib/server-data";
import { matchProducers } from "@/lib/tenders/matching";

type Params = { params: Promise<{ id: string }> };
const TENDER_ROLES = ["brand", "admin", "productora"] as const;

const PRODUCER_FIELDS = {
  id: true, name: true, initials: true, color: true, description: true, website: true,
  regions: true, specialties: true, capabilities: true, certifications: true,
  maxCapacity: true, eventsProduced: true, reportsOnPlatform: true, verified: true,
} as const;

/** GET: detalle de la licitación con el ranking de productoras y las ofertas. */
export async function GET(_req: Request, { params }: Params) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const denied = requireRole(ctx.user, TENDER_ROLES);
  if (denied) return denied;

  const { id } = await params;
  const tender = await prisma.tender.findUnique({
    where: { id },
    include: {
      brand: { select: { name: true, org: true } },
      bids: {
        orderBy: { createdAt: "desc" },
        include: { producer: { select: PRODUCER_FIELDS } },
      },
    },
  });
  if (!tender) return notFound("Licitación no encontrada");

  const isOwner = tender.brandId === ctx.user.id || ctx.user.role === "admin";
  // La productora solo puede mirar licitaciones abiertas que no son suyas.
  if (!isOwner && tender.status !== "abierta") return notFound("Licitación no encontrada");

  // El ranking es para quien licita; la productora ve su propia oferta.
  let matches = null;
  if (isOwner) {
    // Regla de oro: una cuenta real nunca recibe fichas de muestra.
    const producers = await prisma.producer.findMany({ where: catalogFilter(ctx.user), select: PRODUCER_FIELDS });
    matches = matchProducers(tender, producers, 4);
  }

  const myProducer = ctx.user.role === "productora"
    ? await prisma.producer.findUnique({ where: { userId: ctx.user.id }, select: { id: true } })
    : null;

  return json({
    tender: { ...tender, bids: isOwner ? tender.bids : [] },
    matches,
    isOwner,
    myBid: myProducer ? tender.bids.find((x) => x.producerId === myProducer.id) ?? null : null,
    hasProfile: !!myProducer,
  });
}

/** PATCH: la marca cambia el estado de la licitación o el de una oferta. */
export async function PATCH(req: Request, { params }: Params) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const denied = requireRole(ctx.user, ["brand", "admin"]);
  if (denied) return denied;

  const { id } = await params;
  const tender = await prisma.tender.findUnique({ where: { id }, select: { id: true, brandId: true, title: true } });
  if (!tender || (tender.brandId !== ctx.user.id && ctx.user.role !== "admin")) {
    return notFound("Licitación no encontrada");
  }

  const b = await req.json().catch(() => ({}));

  // Cambio de estado de una oferta concreta.
  if (b.bidId) {
    const bidStatus = enumOr(b.bidStatus, ["enviada", "preseleccionada", "descartada", "adjudicada"] as const);
    if (!bidStatus) return badRequest("Estado de oferta no válido");
    const bid = await prisma.tenderBid.findUnique({
      where: { id: String(b.bidId) },
      include: { producer: { select: { name: true, userId: true } } },
    });
    if (!bid || bid.tenderId !== id) return notFound("Oferta no encontrada");

    const updated = await prisma.tenderBid.update({ where: { id: bid.id }, data: { status: bidStatus } });
    if (bid.producer.userId && bidStatus !== "enviada") {
      await notify(bid.producer.userId, {
        type: bidStatus === "descartada" ? "info" : "success",
        title: `Tu oferta fue ${bidStatus}`,
        message: `La licitación "${tender.title}" marcó tu oferta como ${bidStatus}.`,
      });
    }
    return json(updated);
  }

  const status = enumOr(b.status, ["abierta", "evaluacion", "adjudicada", "cancelada"] as const);
  if (!status) return badRequest("Estado no válido");
  return json(await prisma.tender.update({ where: { id }, data: { status } }));
}
