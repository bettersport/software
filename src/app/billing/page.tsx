"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CreditCard, Check, ShieldCheck, Clock, XCircle, ArrowRight, Receipt } from "lucide-react";
import { SectionHeader } from "@/components/ui";
import { CountUp } from "@/components/fx";
import { useUser } from "@/lib/userContext";
import { useResource, apiSend } from "@/lib/useResource";
import toast from "react-hot-toast";

interface Subscription {
  id: string; plan: string; amountNet: number; amountTax: number; amountTotal: number;
  status: "pending" | "paid" | "rejected" | "cancelled"; commerceOrder: string;
  flowOrder?: number | null; paidAt?: string | null; periodStart?: string | null; periodEnd?: string | null; createdAt: string;
}
interface Billing {
  plan: { id: string; name: string; net: number; tax: number; total: number; periodDays: number; currency: string };
  active: boolean;
  planUntil: string | null;
  flowConfigured: boolean;
  subscriptions: Subscription[];
}

const clp = (n: number) => `$${Math.round(n).toLocaleString("es-CL")}`;
const fecha = (iso?: string | null) => (iso ? new Date(iso).toLocaleDateString("es-CL", { day: "numeric", month: "short", year: "numeric" }) : "—");

const FEATURES = [
  "Gestión ESG completa: proyectos, KPIs, documentos y presupuesto",
  "Motor IA — estrategia ESG con estándares GRI",
  "Ranking de clubes y Mercado ESG",
  "Marketplace de eventos y patrocinios",
  "Fan Zone y engagement de hinchas",
  "Soporte prioritario",
];

const statusUi: Record<Subscription["status"], { label: string; color: string; icon: React.ReactNode }> = {
  paid: { label: "Pagado", color: "#34d399", icon: <Check size={12} /> },
  pending: { label: "Pendiente", color: "#fbbf24", icon: <Clock size={12} /> },
  rejected: { label: "Rechazado", color: "#f87171", icon: <XCircle size={12} /> },
  cancelled: { label: "Anulado", color: "#8b95a5", icon: <XCircle size={12} /> },
};

// useSearchParams exige un límite de Suspense para el prerender de Next.
export default function BillingPage() {
  return (
    <Suspense fallback={null}>
      <BillingContent />
    </Suspense>
  );
}

function BillingContent() {
  const { activeUser, loaded } = useUser();
  const { data, reload } = useResource<Billing | null>(loaded && activeUser ? "/api/billing" : null, null);
  const [paying, setPaying] = useState(false);
  const params = useSearchParams();
  const returned = params.get("status");

  useEffect(() => {
    if (!returned) return;
    if (returned === "paid") toast.success("Pago confirmado — tu plan está activo");
    else if (returned === "rejected") toast.error("El pago fue rechazado");
    else if (returned === "cancelled") toast("Pago anulado", { icon: "ℹ️" });
    else if (returned === "pending") toast("Pago pendiente de confirmación", { icon: "⏳" });
  }, [returned]);

  const pay = async () => {
    setPaying(true);
    try {
      const r = await apiSend<{ data: { url: string } }>("/api/billing/checkout", "POST");
      window.location.href = r.data.url;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo iniciar el pago");
      setPaying(false);
      reload();
    }
  };

  const plan = data?.plan;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <SectionHeader
        icon={<CreditCard size={22} className="text-teal-600" />}
        title="Plan y pagos"
        subtitle="Suscripción a la plataforma para clubes y marcas — pago seguro vía Flow"
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Plan */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card ring-gradient p-8 lg:col-span-3">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <p className="eyebrow mb-2">Plan para clubes y marcas</p>
              <h2 className="text-2xl font-extrabold" style={{ color: "#f4f7fb" }}>{plan?.name ?? "Plan General"}</h2>
            </div>
            {data?.active ? (
              <span className="badge badge-green flex items-center gap-1"><ShieldCheck size={12} /> Activo hasta {fecha(data.planUntil)}</span>
            ) : (
              <span className="badge badge-orange flex items-center gap-1"><Clock size={12} /> Sin plan activo</span>
            )}
          </div>

          <div className="flex items-end gap-2 mb-1">
            <span className="text-4xl font-extrabold tnum" style={{ color: "#f4f7fb" }}>
              {plan ? <CountUp to={plan.net} prefix="$" /> : "$250.000"}
            </span>
            <span className="text-sm mb-1.5" style={{ color: "#8b95a5" }}>CLP + IVA / {plan?.periodDays ?? 30} días</span>
          </div>
          <p className="font-mono text-xs mb-7" style={{ color: "#6b7789" }}>
            IVA 19%: {clp(plan?.tax ?? 47500)} · Total a pagar: <span style={{ color: "#f4f7fb" }}>{clp(plan?.total ?? 297500)}</span>
          </p>

          <ul className="space-y-2.5 mb-8">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm" style={{ color: "#c0c9d6" }}>
                <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: "rgba(52,211,153,0.14)", color: "#34d399" }}>
                  <Check size={11} strokeWidth={3} />
                </span>
                {f}
              </li>
            ))}
          </ul>

          <button onClick={pay} disabled={paying || !data?.flowConfigured} className="btn-primary w-full justify-center py-3.5 text-base disabled:opacity-60 disabled:cursor-not-allowed">
            {paying ? "Redirigiendo a Flow..." : data?.active ? "Renovar plan" : "Pagar con Flow"} <ArrowRight size={16} />
          </button>
          {data && !data.flowConfigured && (
            <p className="text-xs text-center mt-3" style={{ color: "#fbbf24" }}>La pasarela de pago aún no está configurada en este entorno.</p>
          )}
          <p className="text-[11px] text-center mt-3" style={{ color: "#6b7789" }}>
            Serás redirigido a Flow.cl para pagar con tarjeta, transferencia o los medios habilitados. Al confirmar, tu plan se activa automáticamente.
          </p>
        </motion.div>

        {/* Estado + historial */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
            <p className="eyebrow mb-3">Estado de la cuenta</p>
            <p className="text-sm font-semibold" style={{ color: "#f4f7fb" }}>{activeUser?.club ?? activeUser?.name}</p>
            <p className="text-xs mt-0.5" style={{ color: "#8b95a5" }}>{activeUser?.email}</p>
            <div className="mt-4 pt-4 flex items-center justify-between text-xs" style={{ borderTop: "1px solid #161d29" }}>
              <span style={{ color: "#8b95a5" }}>Vigencia</span>
              <span className="font-mono tnum" style={{ color: data?.active ? "#34d399" : "#fbbf24" }}>
                {data?.active ? fecha(data.planUntil) : "Sin plan"}
              </span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Receipt size={15} className="text-teal-600" />
              <p className="text-sm font-semibold" style={{ color: "#f4f7fb" }}>Historial de pagos</p>
            </div>
            {!data || data.subscriptions.length === 0 ? (
              <p className="text-xs" style={{ color: "#6b7789" }}>Aún no hay pagos registrados.</p>
            ) : (
              <div className="space-y-3">
                {data.subscriptions.map((s) => {
                  const ui = statusUi[s.status] ?? statusUi.pending;
                  return (
                    <div key={s.id} className="flex items-center justify-between gap-3 text-xs">
                      <div className="min-w-0">
                        <p className="font-mono truncate" style={{ color: "#c0c9d6" }}>{s.commerceOrder}</p>
                        <p style={{ color: "#6b7789" }}>{fecha(s.paidAt ?? s.createdAt)}{s.periodEnd ? ` · hasta ${fecha(s.periodEnd)}` : ""}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-mono font-semibold tnum" style={{ color: "#f4f7fb" }}>{clp(s.amountTotal)}</p>
                        <span className="inline-flex items-center gap-1 font-semibold" style={{ color: ui.color }}>{ui.icon} {ui.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
