import prisma from "@/lib/prisma";
import { withUser, json } from "@/lib/server-data";
import { PLAN, planAmounts, flowConfigured } from "@/lib/flow";

/** GET: plan, vigencia del usuario e historial de pagos. */
export async function GET() {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;

  const [user, subscriptions] = await Promise.all([
    prisma.user.findUnique({ where: { id: ctx.user.id }, select: { planUntil: true } }),
    prisma.subscription.findMany({ where: { userId: ctx.user.id }, orderBy: { createdAt: "desc" }, take: 20 }),
  ]);
  const planUntil = user?.planUntil ?? null;
  const active = !!planUntil && planUntil > new Date();

  return json({
    plan: { ...PLAN, ...planAmounts() },
    active,
    planUntil,
    flowConfigured: flowConfigured(),
    subscriptions,
  });
}
