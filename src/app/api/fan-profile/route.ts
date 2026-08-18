import prisma from "@/lib/prisma";
import { withUser, json, badRequest, notFound } from "@/lib/server-data";
import { fanActions as defaultActions, fanRewards as defaultRewards, fanTiers } from "@/lib/data";
import type { FanAction, FanReward } from "@/lib/types";

/** Nivel según puntos — se calcula SIEMPRE en servidor. */
function tierForPoints(points: number) {
  let t = fanTiers[0].name;
  for (const x of fanTiers) if (points >= x.minPoints) t = x.name;
  return t;
}

async function clubCatalog(clubId: string | null | undefined) {
  if (!clubId) return { actions: defaultActions, rewards: defaultRewards };
  const club = await prisma.club.findUnique({ where: { id: clubId }, select: { fanActions: true, fanRewards: true, demo: true } });
  const actions = (club?.fanActions as FanAction[] | null) ?? (club?.demo ? defaultActions : []);
  const rewards = (club?.fanRewards as FanReward[] | null) ?? (club?.demo ? defaultRewards : []);
  return { actions, rewards };
}

export async function GET() {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const profile = await prisma.fanProfile.findUnique({ where: { userId: ctx.user.id } });
  return json(profile ?? null);
}

/**
 * POST { intent: "complete_action", actionId } | { intent: "claim_reward", rewardId }
 * El servidor valida contra el catálogo del club y calcula puntos/nivel. El cliente
 * NUNCA envía puntos ni nivel.
 */
export async function POST(req: Request) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const b = await req.json().catch(() => ({}));
  const intent = String(b.intent ?? "");
  const { actions, rewards } = await clubCatalog(ctx.user.clubId);

  const profile = await prisma.fanProfile.upsert({
    where: { userId: ctx.user.id },
    update: {},
    create: { userId: ctx.user.id, clubId: ctx.user.clubId ?? null },
  });

  if (intent === "complete_action") {
    const action = actions.find((a) => a.id === String(b.actionId));
    if (!action) return notFound("Acción no disponible en tu club");
    if (profile.completedActionIds.includes(action.id)) return badRequest("Acción ya registrada");
    const points = profile.points + (Number(action.points) || 0);
    const updated = await prisma.fanProfile.update({
      where: { userId: ctx.user.id },
      data: { completedActionIds: { push: action.id }, points, tier: tierForPoints(points) },
    });
    return json(updated);
  }
  if (intent === "claim_reward") {
    const reward = rewards.find((r) => r.id === String(b.rewardId));
    if (!reward) return notFound("Recompensa no disponible en tu club");
    if (reward.available === false) return badRequest("Recompensa no disponible");
    if (profile.claimedRewardIds.includes(reward.id)) return badRequest("Recompensa ya canjeada");
    if (profile.points < (Number(reward.points) || 0)) return badRequest("Puntos insuficientes");
    const updated = await prisma.fanProfile.update({
      where: { userId: ctx.user.id },
      data: { claimedRewardIds: { push: reward.id }, badgesEarned: reward.type === "badge" ? { increment: 1 } : undefined },
    });
    return json(updated);
  }
  return badRequest("Intent inválido");
}
