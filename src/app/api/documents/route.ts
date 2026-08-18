import prisma from "@/lib/prisma";
import { withUser, json, badRequest, requireClubWriter } from "@/lib/server-data";

export async function GET() {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  if (!ctx.user.clubId) return json([]);
  const documents = await prisma.document.findMany({
    where: { clubId: ctx.user.clubId },
    orderBy: { uploadedAt: "desc" },
  });
  return json(documents);
}

export async function POST(req: Request) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const denied = requireClubWriter(ctx.user);
  if (denied) return denied;
  if (!ctx.user.clubId) return badRequest("La cuenta no tiene un club asociado");

  const b = await req.json().catch(() => ({}));
  if (!b.name || !b.type || !b.category) return badRequest("Nombre, tipo y categoría son obligatorios");

  const document = await prisma.document.create({
    data: {
      name: String(b.name),
      type: String(b.type),
      category: String(b.category),
      size: String(b.size ?? ""),
      version: String(b.version ?? "v1.0"),
      uploadedBy: ctx.user.name, uploadedById: ctx.user.id,
      clubId: ctx.user.clubId,
    },
  });
  return json(document, { status: 201 });
}
