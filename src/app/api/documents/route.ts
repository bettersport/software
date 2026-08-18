import prisma from "@/lib/prisma";
import { withUser, json, badRequest, requireClubWriter, str } from "@/lib/server-data";
import { saveFile, docTypeFor, ALLOWED_MIME, MAX_UPLOAD_BYTES } from "@/lib/storage";

export async function GET() {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  if (!ctx.user.clubId) return json([]);
  const docs = await prisma.document.findMany({ where: { clubId: ctx.user.clubId }, orderBy: { uploadedAt: "desc" } });
  return json(docs);
}

/**
 * POST multipart/form-data: file (obligatorio), category, version.
 * Guarda el binario en el volumen y la metadata en la DB.
 * (Compatibilidad: si llega JSON sin archivo, crea solo la metadata como antes.)
 */
export async function POST(req: Request) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const denied = requireClubWriter(ctx.user);
  if (denied) return denied;
  const clubId = ctx.user.clubId!;

  const contentType = req.headers.get("content-type") ?? "";
  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData().catch(() => null);
    const file = form?.get("file");
    if (!form || !(file instanceof File)) return badRequest("Falta el archivo");
    if (!ALLOWED_MIME[file.type]) return badRequest(`Tipo de archivo no permitido (${file.type || "desconocido"})`);
    if (file.size > MAX_UPLOAD_BYTES) return badRequest("El archivo supera el máximo de 25 MB");
    const buf = Buffer.from(await file.arrayBuffer());
    let storageKey: string;
    try {
      storageKey = await saveFile("documents", clubId, file.type, buf);
    } catch (e) {
      return badRequest(e instanceof Error ? e.message : "No se pudo guardar el archivo");
    }
    const doc = await prisma.document.create({
      data: {
        name: str(file.name, 255) || "archivo",
        type: docTypeFor(file.type),
        category: str(form.get("category"), 80) || "Sin categoría",
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        version: str(form.get("version"), 20) || "v1.0",
        uploadedBy: ctx.user.name, uploadedById: ctx.user.id,
        storageKey, mimeType: file.type,
        clubId,
      },
    });
    return json(doc, { status: 201 });
  }

  // Fallback JSON (metadata sin archivo).
  const b = await req.json().catch(() => ({}));
  if (!str(b.name)) return badRequest("Falta el nombre");
  const doc = await prisma.document.create({
    data: {
      name: str(b.name, 255), type: str(b.type, 10) || "doc", category: str(b.category, 80) || "Sin categoría",
      size: str(b.size, 20), version: str(b.version, 20) || "v1.0",
      uploadedBy: ctx.user.name, uploadedById: ctx.user.id, clubId,
    },
  });
  return json(doc, { status: 201 });
}
