import "server-only";
import { createHmac } from "crypto";

/* ============================================================================
   Cliente Flow.cl (https://www.flow.cl/docs/api.html)
   Firma: parámetros ordenados alfabéticamente, concatenados `clave+valor`,
   HMAC-SHA256 con la secretKey → parámetro `s`.
   Credenciales SOLO por variables de entorno (nunca en el repo).
   ========================================================================= */

export const PLAN = {
  id: "general",
  name: "Plan General",
  /** Neto en CLP, sin IVA. */
  net: 250_000,
  taxRate: 0.19,
  /** Vigencia de cada pago. */
  periodDays: 30,
  currency: "CLP",
} as const;

export function planAmounts() {
  const tax = Math.round(PLAN.net * PLAN.taxRate);
  return { net: PLAN.net, tax, total: PLAN.net + tax };
}

function env(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Falta la variable de entorno ${name}`);
  return v;
}

export function flowConfigured() {
  return Boolean(process.env.FLOW_API_KEY && process.env.FLOW_SECRET_KEY);
}

function apiBase() {
  return process.env.FLOW_API_URL ?? "https://www.flow.cl/api";
}

/** URL pública de la app para los callbacks de Flow. */
export function appUrl() {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, "");
  if (process.env.RAILWAY_PUBLIC_DOMAIN) return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
  return "http://localhost:3000";
}

function sign(params: Record<string, string | number>): string {
  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}${params[k]}`)
    .join("");
  return createHmac("sha256", env("FLOW_SECRET_KEY")).update(toSign).digest("hex");
}

export interface FlowCreateResponse {
  url: string;
  token: string;
  flowOrder: number;
}

export interface FlowStatus {
  flowOrder: number;
  commerceOrder: string;
  requestDate: string;
  /** 1 pendiente · 2 pagada · 3 rechazada · 4 anulada */
  status: 1 | 2 | 3 | 4;
  subject: string;
  currency: string;
  amount: number;
  payer: string;
  paymentData?: { date?: string; media?: string; amount?: number; fee?: number; balance?: number };
}

async function flowFetch<T>(path: string, params: Record<string, string | number>, method: "GET" | "POST"): Promise<T> {
  const signed = { ...params, apiKey: env("FLOW_API_KEY") };
  const s = sign(signed);
  const body = new URLSearchParams({ ...Object.fromEntries(Object.entries(signed).map(([k, v]) => [k, String(v)])), s });
  const url = method === "GET" ? `${apiBase()}${path}?${body.toString()}` : `${apiBase()}${path}`;
  const res = await fetch(url, {
    method,
    headers: method === "POST" ? { "Content-Type": "application/x-www-form-urlencoded" } : undefined,
    body: method === "POST" ? body.toString() : undefined,
    cache: "no-store",
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = (json as { message?: string }).message ?? `Flow respondió ${res.status}`;
    throw new Error(msg);
  }
  return json as T;
}

/** Crea una orden de pago en Flow y devuelve la URL a la que redirigir al pagador. */
export async function createFlowPayment(input: {
  commerceOrder: string;
  subject: string;
  amount: number;
  email: string;
}): Promise<FlowCreateResponse & { redirectUrl: string }> {
  const base = appUrl();
  const r = await flowFetch<FlowCreateResponse>("/payment/create", {
    commerceOrder: input.commerceOrder,
    subject: input.subject,
    currency: PLAN.currency,
    amount: input.amount,
    email: input.email,
    paymentMethod: 9, // todos los medios habilitados en la cuenta Flow
    urlConfirmation: `${base}/api/billing/flow/confirm`,
    urlReturn: `${base}/api/billing/flow/return`,
  }, "POST");
  return { ...r, redirectUrl: `${r.url}?token=${r.token}` };
}

export async function getFlowStatus(token: string): Promise<FlowStatus> {
  return flowFetch<FlowStatus>("/payment/getStatus", { token }, "GET");
}

export function flowStatusLabel(status: number): "pending" | "paid" | "rejected" | "cancelled" {
  return status === 2 ? "paid" : status === 3 ? "rejected" : status === 4 ? "cancelled" : "pending";
}
