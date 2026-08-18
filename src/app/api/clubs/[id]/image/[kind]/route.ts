import prisma from "@/lib/prisma";
import { withUser, json, badRequest, notFound, forbidden } from "@/lib/server-data";
import { saveFile, readFile, deleteFile } from "@/lib/storage";

type Params = { params: Promise<{ id: string; kind: string }> };
const KINDS = ["logo", "banner"] as const;
type Kind = (typeof KINDS)[number];

/** GET: sirve la imagen (pública para usuarios autenticados). */
export async function GET(_req: Request, { params }: Params) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const { id, kind } = await params;
  if (!KINDS.includes(kind as Kind)) return notFound();
  const club = await prisma.club.findUnique({ where: { id }, select: { logo: true, banner: true, demo: true } });
  if (!club) return notFound();
  const key = kind === "logo" ? club.logo : club.banner;
  if (!key || !key.startsWith("club/")) return notFound(); // solo claves de storage (no data-URLs antiguas)
  let data: Buffer;
  try { data = await readFile(key); } catch { return notFound(); }
  const ext = key.split(".").pop() ?? "png";
  const mime = ext === "jpg" ? "image/jpeg" : ext === "svg" ? "image/svg+xml" : `image/${ext}`;
  return new Response(new Uint8Array(data), { headers: { "Content-Type": mime, "Cache-Control": "private, max-age=300" } });
}

/** POST multipart {file}: sube logo/banner del propio club. */
export async function POST(req: Request, { params }: Params) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const { id, kind } = await params;
  if (!KINDS.includes(kind as Kind)) return notFound();
  const isOwn = ctx.user.clubId === id && ["club", "manager"].includes(ctx.user.role);
  if (!isOwn && ctx.user.role !== "admin") return forbidden();
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return badRequest("Falta el archivo");
  if (!file.type.startsWith("image/")) return badRequest("Debe ser una imagen");
  const max = kind === "logo" ? 2 * 1024 * 1024 : 5 * 1024 * 1024;
  if (file.size > max) return badRequest(`La imagen supera ${max / 1024 / 1024} MB`);
  const club = await prisma.club.findUnique({ where: { id }, select: { logo: true, banner: true } });
  if (!club) return notFound();
  const buf = Buffer.from(await file.arrayBuffer());
  let key: string;
  try { key = await saveFile("club", id, file.type, buf); } catch (e) { return badRequest(e instanceof Error ? e.message : "No se pudo guardar"); }
  const prev = kind === "logo" ? club.logo : club.banner;
  if (prev && prev.startsWith("club/")) await deleteFile(prev);
  await prisma.club.update({ where: { id }, data: { [kind]: key } });
  return json({ url: `/api/clubs/${id}/image/${kind}?v=${Date.now()}` }, { status: 201 });
}

/** DELETE: quita logo/banner. */
export async function DELETE(_req: Request, { params }: Params) {
  const ctx = await withUser();
  if ("res" in ctx) return ctx.res;
  const { id, kind } = await params;
  if (!KINDS.includes(kind as Kind)) return notFound();
  const isOwn = ctx.user.clubId === id && ["club", "manager"].includes(ctx.user.role);
  if (!isOwn && ctx.user.role !== "admin") return forbidden();
  const club = await prisma.club.findUnique({ where: { id }, select: { logo: true, banner: true } });
  if (!club) return notFound();
  const prev = kind === "logo" ? club.logo : club.banner;
  if (prev && prev.startsWith("club/")) await deleteFile(prev);
  await prisma.club.update({ where: { id }, data: { [kind]: null } });
  return json({ ok: true });
}
