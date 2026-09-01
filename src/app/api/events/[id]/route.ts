import prisma from "@/lib/prisma";
import { withUser, json, notFound, requireClubWriter, ADMIN_ROLES } from "@/lib/server-data";

type Params = { params: Promise<{ id: string }> };

/** DELETE: el club dueño (o un admin) retira su evento del marketplace. */
export async function DELETE(_req: Request, { params }: Params) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const { id } = await params;

  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) return notFound("Evento no encontrado");

  const isAdmin = (ADMIN_ROLES as readonly string[]).includes(ctx.user.role);
  if (!isAdmin) {
    const denied = requireClubWriter(ctx.user);
    if (denied) return denied;
    if (!event.clubId || event.clubId !== ctx.user.clubId) return notFound("Evento no encontrado");
  }

  await prisma.event.delete({ where: { id } });
  // SponsorRequest.eventId no tiene FK — limpiamos las solicitudes pendientes huérfanas.
  await prisma.sponsorRequest.deleteMany({ where: { eventId: id, status: "pending" } });
  return json({ ok: true });
}
