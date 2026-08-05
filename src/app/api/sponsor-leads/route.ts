import prisma from "@/lib/prisma";
import { withUser, json, badRequest } from "@/lib/server-data";

export async function GET() {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const leads = await prisma.sponsorLead.findMany({
    where: { ownerId: ctx.user.id },
    orderBy: { createdAt: "desc" },
  });
  return json(leads);
}

export async function POST(req: Request) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;

  const b = await req.json().catch(() => ({}));
  if (!b.brand || !b.category) return badRequest("Marca y categoría son obligatorios");

  const lead = await prisma.sponsorLead.create({
    data: {
      brand: String(b.brand),
      category: String(b.category),
      amount: Number(b.amount ?? 0),
      stage: String(b.stage ?? "Sin contacto"),
      color: String(b.color ?? "#94A3B8"),
      ownerId: ctx.user.id,
    },
  });
  return json(lead, { status: 201 });
}
