import prisma from "@/lib/prisma";
import { withUser, json, badRequest, notFound, requireRole, str, notify } from "@/lib/server-data";

type Params = { params: Promise<{ id: string }> };
const BRAND_ROLES = ["brand", "admin"] as const;

/**
 * PATCH { clubId }: entrega la licencia a una organización, o la libera
 * cuando clubId viene vacío. Solo sobre licencias de la propia marca.
 */
export async function PATCH(req: Request, { params }: Params) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const denied = requireRole(ctx.user, BRAND_ROLES);
  if (denied) return denied;

  const { id } = await params;
  const license = await prisma.license.findUnique({ where: { id } });
  if (!license || license.brandId !== ctx.user.id) return notFound("Licencia no encontrada");
  if (license.periodEnd <= new Date()) return badRequest("La licencia está vencida");

  const body = await req.json().catch(() => ({}));
  const clubId = str(body.clubId, 64);

  if (!clubId) {
    const freed = await prisma.license.update({
      where: { id },
      data: { clubId: null, status: "disponible", assignedAt: null },
    });
    return json(freed);
  }

  const club = await prisma.club.findUnique({ where: { id: clubId }, select: { id: true, name: true } });
  if (!club) return badRequest("La organización no existe");

  const alreadyHas = await prisma.license.findFirst({
    where: { brandId: ctx.user.id, clubId, status: "asignada", periodEnd: { gt: new Date() }, NOT: { id } },
  });
  if (alreadyHas) return badRequest(`${club.name} ya tiene una licencia vigente de tu marca`);

  const updated = await prisma.license.update({
    where: { id },
    data: { clubId, status: "asignada", assignedAt: new Date() },
  });

  // Avisamos a quienes gestionan esa organización.
  const managers = await prisma.user.findMany({
    where: { clubId, role: { in: ["club", "manager", "admin"] } },
    select: { id: true },
  });
  await Promise.all(managers.map((m) => notify(m.id, {
    type: "success",
    title: "Nueva licencia Bettersport",
    message: `${ctx.user.name} entregó una licencia a tu organización. Ya puedes gestionar y reportar tu impacto ESG.`,
  })));

  return json(updated);
}
