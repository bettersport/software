import prisma from "@/lib/prisma";
import { withUser, json, badRequest } from "@/lib/server-data";

type Params = { params: Promise<{ id: string }> };

async function ownEvent(ownerId: string, id: string) {
  const e = await prisma.clubEvent.findUnique({ where: { id } });
  return e && e.ownerId === ownerId ? e : null;
}

export async function PATCH(req: Request, { params }: Params) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const { id } = await params;
  const existing = await ownEvent(ctx.user.id, id);
  if (!existing) return badRequest("No encontrado");

  const b = await req.json().catch(() => ({}));
  const event = await prisma.clubEvent.update({
    where: { id },
    data: {
      ...(b.title !== undefined && { title: String(b.title) }),
      ...(b.date !== undefined && { date: String(b.date) }),
      ...(b.location !== undefined && { location: String(b.location) }),
      ...(b.sport !== undefined && { sport: String(b.sport) }),
      ...(b.role !== undefined && { role: String(b.role) }),
      ...(b.sponsorLogo !== undefined && { sponsorLogo: String(b.sponsorLogo) }),
      ...(b.mediaPartnerLogo !== undefined && { mediaPartnerLogo: String(b.mediaPartnerLogo) }),
      ...(b.esgObjectives !== undefined && {
        esgObjectives: Array.isArray(b.esgObjectives) ? b.esgObjectives.map(String) : [],
      }),
      ...(b.status !== undefined && { status: String(b.status) }),
      ...(b.participants !== undefined && { participants: Number(b.participants) }),
    },
  });
  return json(event);
}

export async function DELETE(_req: Request, { params }: Params) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const { id } = await params;
  const existing = await ownEvent(ctx.user.id, id);
  if (!existing) return badRequest("No encontrado");
  await prisma.clubEvent.delete({ where: { id } });
  return json({ ok: true });
}
