import { NextResponse } from "next/server";
import { syncSubscriptionFromFlow } from "@/lib/billing";

/**
 * urlConfirmation de Flow: su servidor hace POST (form-urlencoded) con `token`
 * sin sesión de usuario. Verificamos el estado contra la API de Flow (firmado)
 * — nunca confiamos en el cuerpo del webhook por sí solo.
 */
export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const token = form?.get("token");
  if (typeof token !== "string" || !token) {
    return NextResponse.json({ error: "token requerido" }, { status: 400 });
  }
  try {
    const sub = await syncSubscriptionFromFlow(token);
    if (!sub) return NextResponse.json({ error: "orden desconocida" }, { status: 404 });
    return NextResponse.json({ ok: true, status: sub.status });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "error" }, { status: 502 });
  }
}
