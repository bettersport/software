import prisma from "@/lib/prisma";
import { withUser, notFound } from "@/lib/server-data";
import { readFile } from "@/lib/storage";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Params) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const { id } = await params;
  const doc = await prisma.strategyDocument.findUnique({ where: { id }, include: { challenge: { include: { strategy: true } } } });
  const canRead = doc && (doc.challenge.strategy.clubId === ctx.user.clubId || ctx.user.role === "admin");
  if (!doc || !canRead || !doc.storageKey) return notFound();
  let data: Buffer;
  try { data = await readFile(doc.storageKey); } catch { return notFound("Archivo no disponible"); }
  const inline = new URL(req.url).searchParams.get("inline") === "1";
  return new Response(new Uint8Array(data), {
    headers: {
      "Content-Type": doc.mimeType ?? "application/octet-stream",
      "Content-Length": String(data.byteLength),
      "Content-Disposition": `${inline ? "inline" : "attachment"}; filename*=UTF-8''${encodeURIComponent(doc.name)}`,
      "Cache-Control": "private, no-store",
    },
  });
}
