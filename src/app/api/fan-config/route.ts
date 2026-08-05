import prisma from "@/lib/prisma";
import { withUser, json, badRequest } from "@/lib/server-data";

export async function GET() {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  if (!ctx.user.clubId) return json(null);
  const club = await prisma.club.findUnique({
    where: { id: ctx.user.clubId },
    select: { fanActions: true, fanRewards: true },
  });
  if (!club) return json(null);
  return json({ actions: club.fanActions ?? null, rewards: club.fanRewards ?? null });
}

export async function PUT(req: Request) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  if (!ctx.user.clubId) return badRequest("La cuenta no tiene un club asociado");

  const b = await req.json().catch(() => ({}));
  const club = await prisma.club.update({
    where: { id: ctx.user.clubId },
    data: {
      ...(b.actions !== undefined && { fanActions: b.actions }),
      ...(b.rewards !== undefined && { fanRewards: b.rewards }),
    },
    select: { fanActions: true, fanRewards: true },
  });
  return json({ actions: club.fanActions ?? null, rewards: club.fanRewards ?? null });
}
