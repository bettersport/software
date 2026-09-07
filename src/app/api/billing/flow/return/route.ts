import { NextResponse } from "next/server";
import { syncSubscriptionFromFlow } from "@/lib/billing";

/**
 * urlReturn de Flow: el navegador del pagador vuelve con un POST (token).
 * Sincronizamos y redirigimos a la página de plan con el resultado.
 */
async function handle(req: Request) {
  let token: string | null = null;
  if (req.method === "POST") {
    const form = await req.formData().catch(() => null);
    const t = form?.get("token");
    token = typeof t === "string" ? t : null;
  } else {
    token = new URL(req.url).searchParams.get("token");
  }

  let status = "unknown";
  if (token) {
    try {
      const sub = await syncSubscriptionFromFlow(token);
      status = sub?.status ?? "unknown";
    } catch {
      status = "error";
    }
  }
  const target = new URL("/billing", req.url);
  target.searchParams.set("status", status);
  // 303: el POST de Flow se convierte en GET hacia la página.
  return NextResponse.redirect(target, { status: 303 });
}

export const POST = handle;
export const GET = handle;
