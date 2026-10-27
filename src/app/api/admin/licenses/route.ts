import prisma from "@/lib/prisma";
import { withUser, json, badRequest, requireAdmin, num, str, notify } from "@/lib/server-data";

/** GET: todas las licencias emitidas, agrupadas por marca. */
export async function GET() {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const denied = requireAdmin(ctx.user);
  if (denied) return denied;

  const licenses = await prisma.license.findMany({
    orderBy: { createdAt: "desc" },
    take: 500,
    select: {
      id: true, status: true, amount: true, periodStart: true, periodEnd: true,
      brand: { select: { id: true, name: true, org: true } },
      club: { select: { id: true, name: true } },
    },
  });
  return json(licenses);
}

/**
 * POST { brandId, quantity, amount, months }: emite un lote de licencias
 * anuales para una marca. Es la contraparte del Technology Licensing Model:
 * Bettersport emite, la marca reparte.
 */
export async function POST(req: Request) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const denied = requireAdmin(ctx.user);
  if (denied) return denied;

  const b = await req.json().catch(() => ({}));
  const brandId = str(b.brandId, 64);
  const quantity = num(b.quantity, { min: 1, max: 500 });
  const amount = num(b.amount, { min: 0, max: 1_000_000_000 });
  const months = num(b.months, { min: 1, max: 60 }) ?? 12;

  if (!brandId || quantity === null || amount === null) {
    return badRequest("Marca, cantidad y monto por licencia son obligatorios");
  }

  const brand = await prisma.user.findUnique({ where: { id: brandId }, select: { id: true, role: true, name: true } });
  if (!brand || brand.role !== "brand") return badRequest("La cuenta indicada no es una marca");

  const periodStart = new Date();
  const periodEnd = new Date(periodStart);
  periodEnd.setMonth(periodEnd.getMonth() + months);

  await prisma.license.createMany({
    data: Array.from({ length: Math.round(quantity) }, () => ({
      brandId,
      amount: Math.round(amount),
      periodStart,
      periodEnd,
      notes: str(b.notes, 500),
    })),
  });

  await notify(brandId, {
    type: "success",
    title: "Licencias disponibles",
    message: `Se emitieron ${Math.round(quantity)} licencias Bettersport para tu marca. Ya puedes entregarlas a tus patrocinados.`,
  });

  return json({ issued: Math.round(quantity), periodEnd }, { status: 201 });
}
