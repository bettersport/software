import prisma from "@/lib/prisma";
import { withUser, json, badRequest, notFound, requireClubWriter, str } from "@/lib/server-data";
import { saveFile, docTypeFor, ALLOWED_MIME, MAX_UPLOAD_BYTES } from "@/lib/storage";

/**
 * POST multipart: file + challengeId → guarda el respaldo asociado a ese desafío
 * (spec Paso 2: documentos por desafío individual, no por estrategia).
 */
export async function POST(req: Request) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const denied = requireClubWriter(ctx.user);
  if (denied) return denied;
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  const challengeId = str(form?.get("challengeId"), 64);
  if (!form || !(file instanceof File) || !challengeId) return badRequest("Faltan archivo o desafío");
  const ch = await prisma.strategyChallenge.findUnique({ where: { id: challengeId }, include: { strategy: true } });
  if (!ch || ch.strategy.clubId !== ctx.user.clubId) return notFound("Desafío no encontrado");
  if (!ALLOWED_MIME[file.type]) return badRequest(`Tipo de archivo no permitido (${file.type || "desconocido"})`);
  if (file.size > MAX_UPLOAD_BYTES) return badRequest("El archivo supera el máximo de 25 MB");
  const buf = Buffer.from(await file.arrayBuffer());
  let storageKey: string;
  try { storageKey = await saveFile("strategy", ch.strategy.clubId, file.type, buf); }
  catch (e) { return badRequest(e instanceof Error ? e.message : "No se pudo guardar el archivo"); }
  const doc = await prisma.strategyDocument.create({
    data: { name: str(file.name, 255) || "archivo", type: docTypeFor(file.type), size: `${(file.size / 1024 / 1024).toFixed(1)} MB`, storageKey, mimeType: file.type, challengeId },
  });
  return json(doc, { status: 201 });
}
