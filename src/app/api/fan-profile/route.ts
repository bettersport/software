import prisma from "@/lib/prisma";
import { withUser, json } from "@/lib/server-data";

export async function GET() {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const profile = await prisma.fanProfile.findUnique({ where: { userId: ctx.user.id } });
  return json(profile ?? null);
}

export async function PATCH(req: Request) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;

  const b = await req.json().catch(() => ({}));
  const data = {
    ...(b.points !== undefined && { points: Number(b.points) }),
    ...(b.tier !== undefined && { tier: String(b.tier) }),
    ...(b.badgesEarned !== undefined && { badgesEarned: Number(b.badgesEarned) }),
    ...(b.completedActionIds !== undefined && {
      completedActionIds: Array.isArray(b.completedActionIds) ? b.completedActionIds.map(String) : [],
    }),
    ...(b.claimedRewardIds !== undefined && {
      claimedRewardIds: Array.isArray(b.claimedRewardIds) ? b.claimedRewardIds.map(String) : [],
    }),
  };

  const profile = await prisma.fanProfile.upsert({
    where: { userId: ctx.user.id },
    create: { ...data, userId: ctx.user.id, clubId: ctx.user.clubId ?? null },
    update: data,
  });
  return json(profile);
}
