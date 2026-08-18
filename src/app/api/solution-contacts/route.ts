import prisma from "@/lib/prisma";
import { withUser, json, badRequest, notFound, str } from "@/lib/server-data";

/** POST { providerId, message } → registra el contacto (lead para el proveedor). */
export async function POST(req: Request) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const b = await req.json().catch(() => ({}));
  const providerId = str(b.providerId, 64);
  if (!providerId) return badRequest("Falta el proveedor");
  const provider = await prisma.solutionProvider.findUnique({ where: { id: providerId } });
  if (!provider) return notFound("Proveedor no encontrado");
  const c = await prisma.solutionContact.create({ data: { providerId, requesterId: ctx.user.id, message: str(b.message, 2000) } });
  return json(c, { status: 201 });
}
