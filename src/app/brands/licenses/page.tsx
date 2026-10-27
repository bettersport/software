"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  KeyRound, Users, Briefcase, Leaf, Scale, TrendingUp, Megaphone,
  Landmark, Wallet, CheckCircle2, CircleDashed, Info,
} from "lucide-react";
import { SectionHeader } from "@/components/ui";
import { CountUp } from "@/components/fx";
import { RankBar } from "@/components/viz";
import { useUser } from "@/lib/userContext";
import { useResource, apiSend } from "@/lib/useResource";
import toast from "react-hot-toast";

interface Report {
  licenses: {
    total: number; active: number; assigned: number; available: number; expired: number;
    usedPct: number; reporting: number; investment: number; unitCost: number;
  };
  portfolio: {
    licenseId: string; orgId: string | null; name: string; orgType: string; sport: string;
    esgScore: number; reporting: boolean; projects: number; periodEnd: string; status: string;
  }[];
  impact: {
    byPillar: { pillar: "ambiental" | "social" | "gobernanza"; amount: number }[];
    committed: number; executed: number; projectsActive: number; projectsCompleted: number; kpis: number;
  };
  marketing: { audience: number; events: number; fans: number };
  organizations: { id: string; name: string; orgType: string; sport: string; flag: string }[];
  generatedAt: string;
}

const clp = (n: number) => `$${Math.round(n).toLocaleString("es-CL")}`;
const fecha = (iso: string) => new Date(iso).toLocaleDateString("es-CL", { day: "numeric", month: "short", year: "numeric" });

const PILLARS = {
  ambiental: { label: "Ambiental", color: "#34d399", Icon: Leaf },
  social: { label: "Social", color: "#60a5fa", Icon: Users },
  gobernanza: { label: "Gobernanza", color: "#a78bfa", Icon: Scale },
} as const;

/** A quién se le reporta: cada audiencia ve los bloques que le importan. */
const AUDIENCES = [
  { id: "directorio", label: "Directorio", Icon: Landmark, blocks: ["resumen", "portafolio"] },
  { id: "sostenibilidad", label: "Gerencia Sostenibilidad", Icon: Leaf, blocks: ["impacto", "portafolio"] },
  { id: "marketing", label: "Gerencia Marketing & Comunicaciones", Icon: Megaphone, blocks: ["marketing", "portafolio"] },
  { id: "finanzas", label: "Gerencia de Finanzas", Icon: Wallet, blocks: ["finanzas", "portafolio"] },
] as const;

type AudienceId = (typeof AUDIENCES)[number]["id"];

export default function BrandLicensesPage() {
  const { activeUser, loaded } = useUser();
  const { data, reload } = useResource<Report | null>(loaded && activeUser ? "/api/brand/licenses" : null, null);
  const [audience, setAudience] = useState<AudienceId>("directorio");
  const [assigning, setAssigning] = useState<string | null>(null);

  const blocks = AUDIENCES.find((a) => a.id === audience)!.blocks as readonly string[];
  const lic = data?.licenses;

  const assign = async (licenseId: string, clubId: string) => {
    setAssigning(licenseId);
    try {
      await apiSend(`/api/brand/licenses/${licenseId}`, "PATCH", { clubId });
      await reload();
      toast.success(clubId ? "Licencia entregada" : "Licencia liberada");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo actualizar la licencia");
    } finally {
      setAssigning(null);
    }
  };

  const avgScore = data?.portfolio.filter((p) => p.orgId && p.esgScore > 0) ?? [];
  const avg = avgScore.length ? avgScore.reduce((s, p) => s + p.esgScore, 0) / avgScore.length : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <SectionHeader
        icon={<KeyRound size={22} className="text-teal-600" />}
        title="Licencias"
        subtitle="Licencias Bettersport entregadas a tu portafolio de patrocinados"
      />

      {/* ── Reportar a ── */}
      <div className="card p-5">
        <p className="eyebrow mb-3">Reportar a</p>
        <div className="flex flex-wrap gap-2">
          {AUDIENCES.map((a) => {
            const active = audience === a.id;
            return (
              <button
                key={a.id}
                onClick={() => setAudience(a.id)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all"
                style={active
                  ? { color: "#22d3ee", backgroundColor: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.4)" }
                  : { color: "#8b95a5", backgroundColor: "#10151f", border: "1px solid #232c3a" }}
              >
                <a.Icon size={14} /> {a.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Siempre visible: estado de las licencias ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Licencias activas", value: lic?.active ?? 0, sub: `${lic?.total ?? 0} emitidas en total`, color: "#22d3ee", Icon: KeyRound },
          { label: "Utilizadas", value: lic?.usedPct ?? 0, suffix: "%", sub: `${lic?.assigned ?? 0} entregadas · ${lic?.available ?? 0} disponibles`, color: "#34d399", Icon: CheckCircle2 },
          { label: "Inversión en licencias", value: lic?.investment ?? 0, prefix: "$", sub: `${clp(lic?.unitCost ?? 0)} por licencia`, color: "#a78bfa", Icon: Wallet },
          { label: "Organizaciones reportando", value: lic?.reporting ?? 0, sub: `de ${lic?.assigned ?? 0} con licencia`, color: "#fbbf24", Icon: Briefcase },
        ].map((t, i) => (
          <motion.div key={t.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="card glass-hover p-6">
            <div className="flex items-start justify-between mb-3">
              <p className="eyebrow">{t.label}</p>
              <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ color: t.color, backgroundColor: `${t.color}14`, border: `1px solid ${t.color}30` }}>
                <t.Icon size={16} />
              </span>
            </div>
            <p className="text-3xl font-extrabold tnum" style={{ color: "#f4f7fb" }}>
              <CountUp to={t.value} prefix={t.prefix ?? ""} suffix={t.suffix ?? ""} />
            </p>
            <p className="text-xs mt-1" style={{ color: "#6b7789" }}>{t.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Directorio ── */}
      {blocks.includes("resumen") && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card p-8">
          <h3 className="font-bold text-base mb-6" style={{ color: "#f4f7fb" }}>Resumen ejecutivo</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { k: "Organizaciones impactadas", v: lic?.assigned ?? 0 },
              { k: "Puntaje ESG promedio", v: avg ? avg.toFixed(1) : "—" },
              { k: "Proyectos en ejecución", v: data?.impact.projectsActive ?? 0 },
              { k: "Inversión ESG movilizada", v: clp(data?.impact.committed ?? 0) },
            ].map((x) => (
              <div key={x.k}>
                <p className="eyebrow mb-2">{x.k}</p>
                <p className="text-2xl font-extrabold tnum" style={{ color: "#f4f7fb" }}>{x.v}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Sostenibilidad ── */}
      {blocks.includes("impacto") && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card p-8">
          <h3 className="font-bold text-base mb-1" style={{ color: "#f4f7fb" }}>Impacto ESG del portafolio</h3>
          <p className="text-xs mb-7" style={{ color: "#6b7789" }}>Inversión de los patrocinados con licencia, abierta por pilar</p>

          <div className="space-y-4 mb-8">
            {data?.impact.byPillar.map((p, i) => {
              const cfg = PILLARS[p.pillar];
              const max = Math.max(...(data?.impact.byPillar.map((x) => x.amount) ?? [1]), 1);
              return (
                <div key={p.pillar} className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ color: cfg.color, backgroundColor: `${cfg.color}14`, border: `1px solid ${cfg.color}30` }}>
                    <cfg.Icon size={13} />
                  </span>
                  <span className="w-24 text-xs font-medium flex-shrink-0" style={{ color: "#a8b3c4" }}>{cfg.label}</span>
                  <RankBar pct={(p.amount / max) * 100} color={cfg.color} delay={0.2 + i * 0.1} />
                  <span className="w-28 text-right font-mono text-xs font-semibold tnum flex-shrink-0" style={{ color: "#f4f7fb" }}>{clp(p.amount)}</span>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-5 pt-6" style={{ borderTop: "1px solid #161d29" }}>
            {[
              { k: "Proyectos activos", v: data?.impact.projectsActive ?? 0 },
              { k: "Proyectos completados", v: data?.impact.projectsCompleted ?? 0 },
              { k: "Indicadores en seguimiento", v: data?.impact.kpis ?? 0 },
            ].map((x) => (
              <div key={x.k}>
                <p className="eyebrow mb-2">{x.k}</p>
                <p className="text-2xl font-extrabold tnum" style={{ color: "#f4f7fb" }}><CountUp to={x.v} /></p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Marketing ── */}
      {blocks.includes("marketing") && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card p-8">
          <h3 className="font-bold text-base mb-1" style={{ color: "#f4f7fb" }}>Alcance y visibilidad</h3>
          <p className="text-xs mb-7" style={{ color: "#6b7789" }}>Audiencia y comunidad de las organizaciones que patrocinas</p>
          <div className="grid grid-cols-3 gap-6">
            {[
              { k: "Audiencia alcanzada", v: data?.marketing.audience ?? 0, Icon: Megaphone },
              { k: "Eventos en plataforma", v: data?.marketing.events ?? 0, Icon: TrendingUp },
              { k: "Hinchas registrados", v: data?.marketing.fans ?? 0, Icon: Users },
            ].map((x) => (
              <div key={x.k}>
                <x.Icon size={16} className="text-teal-600 mb-3" />
                <p className="eyebrow mb-2">{x.k}</p>
                <p className="text-2xl font-extrabold tnum" style={{ color: "#f4f7fb" }}><CountUp to={x.v} /></p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Finanzas ── */}
      {blocks.includes("finanzas") && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card p-8">
          <h3 className="font-bold text-base mb-1" style={{ color: "#f4f7fb" }}>Detalle financiero</h3>
          <p className="text-xs mb-7" style={{ color: "#6b7789" }}>Inversión en licencias y ejecución del presupuesto ESG asociado</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { k: "Inversión en licencias", v: clp(lic?.investment ?? 0) },
              { k: "Costo por licencia", v: clp(lic?.unitCost ?? 0) },
              { k: "Presupuesto ESG comprometido", v: clp(data?.impact.committed ?? 0) },
              { k: "Ejecutado a la fecha", v: clp(data?.impact.executed ?? 0) },
            ].map((x) => (
              <div key={x.k}>
                <p className="eyebrow mb-2">{x.k}</p>
                <p className="text-xl font-extrabold tnum" style={{ color: "#f4f7fb" }}>{x.v}</p>
              </div>
            ))}
          </div>
          <div className="mt-7 pt-6" style={{ borderTop: "1px solid #161d29" }}>
            <div className="flex items-center justify-between text-xs mb-2">
              <span style={{ color: "#a8b3c4" }}>Utilización de licencias</span>
              <span className="font-mono font-semibold" style={{ color: "#22d3ee" }}>{lic?.usedPct ?? 0}%</span>
            </div>
            <RankBar pct={lic?.usedPct ?? 0} color="#22d3ee" delay={0.2} />
          </div>
        </motion.div>
      )}

      {/* ── Portafolio: siempre ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-8">
        <h3 className="font-bold text-base mb-1" style={{ color: "#f4f7fb" }}>Portafolio de licencias</h3>
        <p className="text-xs mb-7" style={{ color: "#6b7789" }}>Entrega cada licencia a un club, federación o evento de tu portafolio</p>

        {!data?.portfolio.length ? (
          <p className="text-sm py-8 text-center" style={{ color: "#6b7789" }}>
            Aún no tienes licencias emitidas. Bettersport las emite al contratar el modelo de licenciamiento.
          </p>
        ) : (
          <div className="space-y-2.5">
            {data.portfolio.map((p) => (
              <div key={p.licenseId} className="flex flex-wrap items-center gap-3 py-3" style={{ borderTop: "1px solid #161d29" }}>
                <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={p.orgId
                    ? { color: "#34d399", backgroundColor: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.3)" }
                    : { color: "#6b7789", backgroundColor: "#10151f", border: "1px solid #232c3a" }}>
                  {p.orgId ? <CheckCircle2 size={14} /> : <CircleDashed size={14} />}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate" style={{ color: p.orgId ? "#f4f7fb" : "#6b7789" }}>{p.name}</p>
                  <p className="text-[11px]" style={{ color: "#6b7789" }}>
                    {p.orgId ? `${p.orgType} · ${p.sport} · ` : ""}vence {fecha(p.periodEnd)}
                    {p.orgId && (p.reporting ? ` · ${p.projects} proyecto(s)` : " · aún no reporta")}
                  </p>
                </div>

                {p.orgId && p.esgScore > 0 && (
                  <span className="font-mono text-xs font-semibold tnum" style={{ color: "#22d3ee" }}>{p.esgScore.toFixed(1)}</span>
                )}

                <select
                  className="input-field !w-auto !py-1.5 min-w-48"
                  value={p.orgId ?? ""}
                  disabled={assigning === p.licenseId || p.status === "vencida"}
                  onChange={(e) => assign(p.licenseId, e.target.value)}
                >
                  <option value="">Sin asignar</option>
                  {data.organizations.map((o) => (
                    <option key={o.id} value={o.id}>{o.flag} {o.name}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}

        <p className="flex items-start gap-2 text-[11px] mt-6 pt-5" style={{ color: "#6b7789", borderTop: "1px solid #161d29" }}>
          <Info size={12} className="flex-shrink-0 mt-0.5" />
          Una organización se cuenta como &ldquo;reportando&rdquo; cuando tiene al menos un proyecto ESG o un indicador cargado en la plataforma.
        </p>
      </motion.div>
    </div>
  );
}
