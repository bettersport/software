import prisma from "@/lib/prisma";
import { withUser, json, badRequest } from "@/lib/server-data";

export async function GET() {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const events = await prisma.clubEvent.findMany({
    where: { ownerId: ctx.user.id },
    orderBy: { createdAt: "desc" },
  });
  return json(events);
}

export async function POST(req: Request) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;

  const b = await req.json().catch(() => ({}));
  if (!b.title || !b.date || !b.location || !b.sport)
    return badRequest("Título, fecha, ubicación y deporte son obligatorios");

  const event = await prisma.clubEvent.create({
    data: {
      title: String(b.title),
      date: String(b.date),
      location: String(b.location),
      sport: String(b.sport),
      role: String(b.role ?? "Organizador"),
      sponsorLogo: b.sponsorLogo !== undefined ? String(b.sponsorLogo) : null,
      mediaPartnerLogo: b.mediaPartnerLogo !== undefined ? String(b.mediaPartnerLogo) : null,
      esgObjectives: Array.isArray(b.esgObjectives) ? b.esgObjectives.map(String) : [],
      status: String(b.status ?? "upcoming"),
      participants: Number(b.participants ?? 0),
      ownerId: ctx.user.id,
    },
  });
  return json(event, { status: 201 });
}
