import "server-only";
import prisma from "./prisma";
import { PLAN, getFlowStatus, flowStatusLabel } from "./flow";

/**
 * Sincroniza una suscripción con el estado real en Flow y, si quedó pagada,
 * activa la vigencia del plan en el usuario. Idempotente: Flow puede llamar
 * la confirmación más de una vez y el usuario puede volver por urlReturn.
 */
export async function syncSubscriptionFromFlow(token: string) {
  const sub = await prisma.subscription.findUnique({ where: { flowToken: token } });
  if (!sub) return null;

  const st = await getFlowStatus(token);
  const status = flowStatusLabel(st.status);
  if (sub.status === "paid") return sub; // ya activada, no tocar el período

  if (status === "paid") {
    const user = await prisma.user.findUnique({ where: { id: sub.userId }, select: { planUntil: true } });
    // Si aún tiene plan vigente, el nuevo período se encadena al final.
    const now = new Date();
    const start = user?.planUntil && user.planUntil > now ? user.planUntil : now;
    const end = new Date(start.getTime() + PLAN.periodDays * 86_400_000);
    const paidAt = st.paymentData?.date ? new Date(st.paymentData.date) : now;

    const [updated] = await prisma.$transaction([
      prisma.subscription.update({
        where: { id: sub.id },
        data: { status, flowOrder: st.flowOrder, payerEmail: st.payer, paidAt, periodStart: start, periodEnd: end },
      }),
      prisma.user.update({ where: { id: sub.userId }, data: { planUntil: end } }),
    ]);
    return updated;
  }

  return prisma.subscription.update({
    where: { id: sub.id },
    data: { status, flowOrder: st.flowOrder, payerEmail: st.payer },
  });
}
