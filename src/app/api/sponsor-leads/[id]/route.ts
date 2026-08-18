import prisma from "@/lib/prisma";
import { withUser, json, badRequest, notify } from "@/lib/server-data";

type Params = { params: Promise<{ id: string }> };

async function ownLead(ownerId: string, id: string) {
  const l = await prisma.sponsorLead.findUnique({ where: { id } });
  return l && l.ownerId === ownerId ? l : null;
}

export async function PATCH(req: Request, { params }: Params) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const { id } = await params;
  const existing = await ownLead(ctx.user.id, id);
  if (!existing) return badRequest("No encontrado");

  const b = await req.json().catch(() => ({}));
  const lead = await prisma.sponsorLead.update({
    where: { id },
    data: {
      ...(b.brand !== undefined && { brand: String(b.brand) }),
      ...(b.category !== undefined && { category: String(b.category) }),
      ...(b.amount !== undefined && { amount: Number(b.amount) }),
      ...(b.stage !== undefined && { stage: String(b.stage) }),
      ...(b.color !== undefined && { color: String(b.color) }),
    },
  });
  if (b.stage === "Cierre") await notify(ctx.user.id, { type: "success", title: "Patrocinio cerrado", message: `${lead.brand} pasó a Cierre en tu pipeline de sponsorship.` });
  return json(lead);
}

export async function DELETE(_req: Request, { params }: Params) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const { id } = await params;
  const existing = await ownLead(ctx.user.id, id);
  if (!existing) return badRequest("No encontrado");
  await prisma.sponsorLead.delete({ where: { id } });
  return json({ ok: true });
}
