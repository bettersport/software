import prisma from "@/lib/prisma";
import { withUser, notFound } from "@/lib/server-data";
import { readFile } from "@/lib/storage";

type Params = { params: Promise<{ id: string }> };

/** Sirve el archivo con verificación de propiedad. ?inline=1 para previsualizar. */
export async function GET(req: Request, { params }: Params) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const { id } = await params;
  const doc = await prisma.document.findUnique({ where: { id } });
  // Puede leer: el propio club (cualquier rol vinculado) o admin.
  const canRead = doc && (doc.clubId === ctx.user.clubId || ctx.user.role === "admin");
  if (!doc || !canRead) return notFound("Documento no encontrado");
  if (!doc.storageKey) return notFound("Este documento no tiene archivo adjunto");
  let data: Buffer;
  try {
    data = await readFile(doc.storageKey);
  } catch {
    return notFound("Archivo no disponible");
  }
  const inline = new URL(req.url).searchParams.get("inline") === "1";
  const filename = encodeURIComponent(doc.name);
  return new Response(new Uint8Array(data), {
    headers: {
      "Content-Type": doc.mimeType ?? "application/octet-stream",
      "Content-Length": String(data.byteLength),
      "Content-Disposition": `${inline ? "inline" : "attachment"}; filename*=UTF-8''${filename}`,
      "Cache-Control": "private, no-store",
    },
  });
}
