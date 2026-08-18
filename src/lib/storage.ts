import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { randomBytes } from "crypto";

/**
 * Almacenamiento de archivos en disco — Railway Volume montado en UPLOADS_DIR
 * (producción: /data/uploads). En local cae a ./.uploads.
 *
 * Claves de storage: `<scope>/<ownerId>/<random>.<ext>` — nunca se aceptan
 * rutas del cliente; el nombre original se guarda en la DB, no en disco.
 */
const ROOT = path.resolve(process.env.UPLOADS_DIR ?? "./.uploads");

export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024; // 25 MB

/** Tipos permitidos (no ejecutables). */
export const ALLOWED_MIME: Record<string, string> = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/vnd.ms-excel": "xls",
  "text/csv": "csv",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/msword": "doc",
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/svg+xml": "svg",
  "application/zip": "zip",
};

export function docTypeFor(mime: string): "pdf" | "xls" | "img" | "doc" {
  if (mime === "application/pdf") return "pdf";
  if (/spreadsheet|excel|csv/.test(mime)) return "xls";
  if (mime.startsWith("image/")) return "img";
  return "doc";
}

function safeKey(scope: string, ownerId: string, ext: string) {
  const s = scope.replace(/[^a-z0-9_-]/gi, "");
  const o = ownerId.replace(/[^a-z0-9_-]/gi, "");
  return `${s}/${o}/${randomBytes(12).toString("hex")}.${ext}`;
}

function resolveKey(key: string) {
  const full = path.resolve(ROOT, key);
  // Defensa contra path traversal: el resultado debe quedar dentro de ROOT.
  if (!full.startsWith(ROOT + path.sep)) throw new Error("Clave de archivo inválida");
  return full;
}

/** Guarda bytes y devuelve la storageKey. */
export async function saveFile(scope: string, ownerId: string, mime: string, data: Buffer): Promise<string> {
  const ext = ALLOWED_MIME[mime];
  if (!ext) throw new Error("Tipo de archivo no permitido");
  if (data.byteLength > MAX_UPLOAD_BYTES) throw new Error("El archivo supera el máximo de 25 MB");
  const key = safeKey(scope, ownerId, ext);
  const full = resolveKey(key);
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, data);
  return key;
}

export async function readFile(key: string): Promise<Buffer> {
  return fs.readFile(resolveKey(key));
}

export async function deleteFile(key: string | null | undefined) {
  if (!key) return;
  try {
    await fs.unlink(resolveKey(key));
  } catch {
    /* ya no existe */
  }
}

/** Comprueba que el directorio de uploads exista y sea escribible (log claro en arranque). */
export async function storageReady(): Promise<{ ok: boolean; root: string; error?: string }> {
  try {
    await fs.mkdir(ROOT, { recursive: true });
    const probe = path.join(ROOT, ".write-test");
    await fs.writeFile(probe, "ok");
    await fs.unlink(probe);
    return { ok: true, root: ROOT };
  } catch (e) {
    console.error(`[storage] UPLOADS_DIR no escribible (${ROOT}):`, e instanceof Error ? e.message : e);
    return { ok: false, root: ROOT, error: e instanceof Error ? e.message : String(e) };
  }
}
