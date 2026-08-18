import prisma from "@/lib/prisma";
import { withUser, json, badRequest, notFound, num, str, notifyClub } from "@/lib/server-data";

/** GET: mis solicitudes. POST { eventId, message?, amount? } → crea solicitud y notifica al club del evento. */
export async function GET() {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const items = await prisma.sponsorRequest.findMany({ where: { requesterId: ctx.user.id }, orderBy: { createdAt: "desc" } });
  return json(items);
}
export async function POST(req: Request) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const b = await req.json().catch(() => ({}));
  const eventId = str(b.eventId, 64);
  if (!eventId) return badRequest("Falta el evento");
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) return notFound("Evento no encontrado");
  const dup = await prisma.sponsorRequest.findFirst({ where: { eventId, requesterId: ctx.user.id, status: "pending" } });
  if (dup) return badRequest("Ya enviaste una solicitud para este evento");
  const r = await prisma.sponsorRequest.create({
    data: { eventId, requesterId: ctx.user.id, message: str(b.message, 2000), amount: num(b.amount, { min: 0 }) },
  });
  if (event.clubId) {
    await notifyClub(event.clubId, { type: "success", title: "Nueva solicitud de patrocinio", message: `${ctx.user.club ?? ctx.user.name} quiere patrocinar "${event.title}".` });
  }
  return json(r, { status: 201 });
}
