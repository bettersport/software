import prisma from "@/lib/prisma";
import { withUser, json, badRequest, requireRole } from "@/lib/server-data";
import { PLAN, planAmounts, createFlowPayment, flowConfigured } from "@/lib/flow";

const PAYER_ROLES = ["club", "brand", "manager", "admin"] as const;

/** POST: crea la suscripción pendiente y la orden en Flow; devuelve la URL de pago. */
export async function POST() {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const denied = requireRole(ctx.user, PAYER_ROLES);
  if (denied) return denied;
  if (!flowConfigured()) return badRequest("La pasarela de pago no está configurada");

  const { net, tax, total } = planAmounts();
  const commerceOrder = `BS-${Date.now().toString(36).toUpperCase()}-${ctx.user.id.slice(-6).toUpperCase()}`;

  const sub = await prisma.subscription.create({
    data: { plan: PLAN.id, amountNet: net, amountTax: tax, amountTotal: total, currency: PLAN.currency, commerceOrder, userId: ctx.user.id },
  });

  try {
    const flow = await createFlowPayment({
      commerceOrder,
      subject: `BetterSport — ${PLAN.name} (${PLAN.periodDays} días)`,
      amount: total,
      email: ctx.user.email,
    });
    await prisma.subscription.update({ where: { id: sub.id }, data: { flowToken: flow.token, flowOrder: flow.flowOrder } });
    return json({ url: flow.redirectUrl, commerceOrder });
  } catch (err) {
    await prisma.subscription.update({ where: { id: sub.id }, data: { status: "cancelled" } });
    return badRequest(err instanceof Error ? `No se pudo iniciar el pago: ${err.message}` : "No se pudo iniciar el pago");
  }
}
