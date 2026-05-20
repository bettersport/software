"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users, Zap, Trophy, Gift, TrendingUp, Star, BarChart3,
  ArrowUpRight, ArrowDownRight, ChevronRight, Filter,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { fanZoneStats, mockFans, fanTiers } from "@/lib/data";
import type { FanTierName } from "@/lib/types";

// ── helpers ───────────────────────────────────────────────────────────────────

function getTier(name: FanTierName) {
  return fanTiers.find((t) => t.name === name)!;
}

// ── mock chart data ───────────────────────────────────────────────────────────

const growthData = [
  { mes: "Ene", registrados: 220, activos: 80  },
  { mes: "Feb", registrados: 380, activos: 140 },
  { mes: "Mar", registrados: 560, activos: 210 },
  { mes: "Abr", registrados: 720, activos: 280 },
  { mes: "May", registrados: 920, activos: 355 },
  { mes: "Jun", registrados: 1100,activos: 420 },
  { mes: "Jul", registrados: 1284,activos: 490 },
];

const actionsData = [
  { tipo: "Reciclaje",    fisica: 487, digital: 0,   social: 0   },
  { tipo: "Transporte",   fisica: 312, digital: 0,   social: 0   },
  { tipo: "Contenido",    fisica: 0,   digital: 0,   social: 248 },
  { tipo: "Quiz ESG",     fisica: 0,   digital: 421, social: 0   },
  { tipo: "Reporte",      fisica: 0,   digital: 198, social: 0   },
  { tipo: "Limpieza",     fisica: 143, digital: 0,   social: 0   },
];

const campaignData = [
  { nombre: "Verde Partido",      fans: 742, puntos: 111300, completitud: 91 },
  { nombre: "Agua Cero Residuos", fans: 523, puntos: 62760,  completitud: 76 },
  { nombre: "Movilidad Sostenible",fans:389, puntos: 31120,  completitud: 68 },
  { nombre: "Energía Limpia Fan", fans: 612, puntos: 73440,  completitud: 83 },
];

const segments = [
  { emoji: "🌟", label: "Embajadores", count: 187, color: "#10B981", desc: "Alto engagement + Alto impacto ESG. Nivel Oro o Leyenda.", action: "Programa VIP ESG" },
  { emoji: "📱", label: "Digitales",   count: 342, color: "#3B82F6", desc: "Muy activos en redes pero no asisten al estadio.",        action: "Activar retos físicos" },
  { emoji: "⚽", label: "Estadio-ESG", count: 248, color: "#F59E0B", desc: "Asisten al estadio pero poco digitales. Gran potencial.", action: "Incorporar a redes" },
  { emoji: "💤", label: "Latentes",    count: 507, color: "#94A3B8", desc: "Registrados sin actividad en 30+ días. Riesgo de churn.", action: "Campaña reactivación" },
];

// ── sub-components ────────────────────────────────────────────────────────────

function KpiCard({
  icon, label, value, sub, delta, deltaUp, color,
}: {
  icon: React.ReactNode; label: string; value: string; sub: string;
  delta?: string; deltaUp?: boolean; color: string;
}) {
  return (
    <div className="card p-5 relative overflow-hidden">
      <div className="absolute left-0 top-0 w-1 h-full rounded-l" style={{ backgroundColor: color }} />
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}15`, color }}>
          {icon}
        </div>
        {delta && (
          <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
            style={deltaUp
              ? { backgroundColor: "rgba(16,185,129,0.1)", color: "#10B981" }
              : { backgroundColor: "rgba(248,113,113,0.1)", color: "#EF4444" }
            }>
            {deltaUp ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />} {delta}
          </span>
        )}
      </div>
      <p className="text-2xl font-black text-slate-900 tracking-tight">{value}</p>
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-0.5">{label}</p>
      <p className="text-xs text-slate-400 mt-1">{sub}</p>
    </div>
  );
}

const TOOLTIP_STYLE = {
  backgroundColor: "#1E293B",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "8px",
  fontSize: "11px",
  color: "#F1F5F9",
};

// ── page ──────────────────────────────────────────────────────────────────────

const VIEWS = ["Resumen", "Ranking fans", "Segmentos", "Campañas"] as const;
type View = typeof VIEWS[number];

export default function ClubFanZonePage() {
  const [view, setView] = useState<View>("Resumen");

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-mono tracking-widest uppercase text-teal-600 mb-1">Fan Zone Analytics</p>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard de tu hinchada</h1>
          <p className="text-sm text-slate-400 mt-1">Datos estratégicos de participación ESG de tus fans · Temporada 2025</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200">
            <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            <span className="text-xs font-semibold text-teal-700">En vivo</span>
          </div>
          <button className="btn-secondary flex items-center gap-1.5">
            <Filter size={13} /> Filtrar
          </button>
        </div>
      </div>

      {/* View tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        {VIEWS.map((v) => (
          <button key={v} onClick={() => setView(v)}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={view === v
              ? { backgroundColor: "#fff", color: "#0F172A", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }
              : { color: "#94A3B8" }}>
            {v}
          </button>
        ))}
      </div>

      {/* ── RESUMEN ── */}
      {view === "Resumen" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
          {/* KPI row 1 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard icon={<Users size={18} />}      label="Fans registrados"    value="1,284"  sub="Total temporada 2025"           delta="+12.4%"  deltaUp color="#3B82F6" />
            <KpiCard icon={<Zap size={18} />}        label="Tasa participación"  value="38.2%"  sub="Fans activos / registrados"     delta="+5.1pp"  deltaUp color="#10B981" />
            <KpiCard icon={<Star size={18} />}       label="Acciones ESG"        value="7,412"  sub="Completadas · Temporada 2025"   delta="+41.7%"  deltaUp color="#F59E0B" />
            <KpiCard icon={<Trophy size={18} />}     label="Score colectivo"     value="892K"   sub="Puntos acumulados todos los fans"delta="+28.3%"  deltaUp color="#8B5CF6" />
          </div>

          {/* KPI row 2 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard icon={<TrendingUp size={18} />} label="NPS Fan ESG"         value="+67"    sub="Excelente (benchmark: +40)"                         color="#10B981" />
            <KpiCard icon={<Gift size={18} />}       label="Recompensas canjeadas"value="342"   sub="Valor total: $14,800"           delta="+62%"    deltaUp color="#F59E0B" />
            <KpiCard icon={<BarChart3 size={18} />}  label="Fans Oro+"           value="187"    sub="Leyenda: 42 · Oro: 145"        delta="14.6%"   deltaUp color="#F59E0B" />
            <KpiCard icon={<Users size={18} />}      label="Aporte ESG al club"  value="+4.2pts" sub="+5.1% del score total del club"                    color="#10B981" />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Growth chart */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-mono tracking-wider uppercase text-slate-500">Crecimiento de fans</p>
                  <p className="text-sm text-slate-800 font-semibold mt-0.5">Acumulado mensual · 2025</p>
                </div>
                <div className="flex gap-3">
                  {[{ color: "#10B981", label: "Registrados" }, { color: "#3B82F6", label: "Activos" }].map((l) => (
                    <div key={l.label} className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: l.color }} />
                      <span className="text-[10px] font-mono text-slate-400">{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={growthData} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
                  <defs>
                    <linearGradient id="gReg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gAct" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="mes" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Area type="monotone" dataKey="registrados" stroke="#10B981" strokeWidth={2} fill="url(#gReg)" name="Registrados" />
                  <Area type="monotone" dataKey="activos"     stroke="#3B82F6" strokeWidth={2} fill="url(#gAct)" name="Activos" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Actions by type */}
            <div className="card p-5">
              <div className="mb-4">
                <p className="text-xs font-mono tracking-wider uppercase text-slate-500">Acciones por categoría</p>
                <p className="text-sm text-slate-800 font-semibold mt-0.5">Física · Digital · Social</p>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={actionsData} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="tipo" tick={{ fontSize: 9, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="fisica"  stackId="a" fill="#10B981" radius={[0,0,0,0]} name="Física"  />
                  <Bar dataKey="digital" stackId="a" fill="#3B82F6" radius={[0,0,0,0]} name="Digital" />
                  <Bar dataKey="social"  stackId="a" fill="#8B5CF6" radius={[4,4,0,0]} name="Social"  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Insight */}
          <div className="flex items-start gap-3 p-4 rounded-xl"
            style={{ backgroundColor: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)" }}>
            <span className="text-xl flex-shrink-0">💡</span>
            <div>
              <p className="text-sm font-semibold text-slate-900">Insight clave</p>
              <p className="text-sm text-slate-600 mt-0.5">
                El 62% de las acciones ESG ocurren en las 48h previas y posteriores a los partidos de local.
                Las campañas de reciclaje en estadio tienen <strong>3.2x más participación</strong> que las digitales.
                Activa QR en todos los puntos de reciclaje del estadio para maximizar el impacto.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── RANKING FANS ── */}
      {view === "Ranking fans" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Top 3 podium */}
            <div className="card p-5">
              <p className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-4">🏆 Top 3 Fans ESG</p>
              <div className="space-y-3">
                {mockFans.slice(0, 3).map((fan, i) => {
                  const t = getTier(fan.tier);
                  const podiumEmoji = ["🥇","🥈","🥉"][i];
                  const sizes = ["text-5xl font-black","text-4xl font-black","text-3xl font-bold"];
                  return (
                    <motion.div
                      key={fan.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-4 p-4 rounded-2xl"
                      style={i === 0
                        ? { background: `linear-gradient(135deg, ${t.color}15, ${t.color}05)`, border: `1px solid ${t.color}30` }
                        : { backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }
                      }
                    >
                      <span className="text-2xl">{podiumEmoji}</span>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black text-white flex-shrink-0"
                        style={{ background: `linear-gradient(135deg,${t.color},${t.color}88)` }}>
                        {fan.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">{fan.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-xs">{t.emoji}</span>
                          <span className="text-[10px] font-semibold" style={{ color: t.color }}>{t.label}</span>
                        </div>
                      </div>
                      <p className={`${sizes[i]} font-mono leading-none`} style={{ color: t.color }}>
                        {fan.points.toLocaleString()}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Full ranking table */}
            <div className="lg:col-span-2 card overflow-hidden">
              <div className="px-5 py-4 bg-slate-50 border-b border-slate-100">
                <p className="text-sm font-semibold text-slate-800">Top 10 Fans · Temporada 2025</p>
              </div>
              <div className="divide-y divide-slate-50">
                {mockFans.slice(0, 10).map((fan, i) => {
                  const t = getTier(fan.tier);
                  return (
                    <motion.div
                      key={fan.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-center gap-3 px-5 py-3"
                    >
                      <div className="w-6 text-center flex-shrink-0">
                        {i < 3
                          ? <span className="text-sm">{"🥇🥈🥉"[i]}</span>
                          : <span className="text-xs font-mono text-slate-400">#{i+1}</span>}
                      </div>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-white flex-shrink-0"
                        style={{ background: `linear-gradient(135deg,${t.color},${t.color}88)` }}>
                        {fan.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{fan.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-semibold" style={{ color: t.color }}>{t.emoji} {t.label}</span>
                          <span className="text-[10px] text-slate-400">· {fan.actionsCompleted} acciones</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black font-mono" style={{ color: t.color }}>{fan.points.toLocaleString()}</p>
                        <p className="text-[10px] text-slate-400">pts</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Insight */}
          <div className="flex items-start gap-3 p-4 rounded-xl"
            style={{ backgroundColor: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)" }}>
            <span className="text-xl flex-shrink-0">🎯</span>
            <p className="text-sm text-slate-600">
              <strong>Para el club:</strong> Los top 10 fans generan el 28% de todos los puntos ESG.
              Crear un programa <strong>"Embajador Verde"</strong> para ellos amplifica el impacto con inversión mínima.
              Beneficio sugerido: acceso especial + visibilidad en comunicaciones del club.
            </p>
          </div>
        </motion.div>
      )}

      {/* ── SEGMENTOS ── */}
      {view === "Segmentos" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {segments.map((seg, i) => (
              <motion.div
                key={seg.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="card p-6 flex gap-4"
                style={{ borderLeft: `3px solid ${seg.color}` }}
              >
                <span className="text-3xl flex-shrink-0">{seg.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-base font-bold" style={{ color: seg.color }}>{seg.label}</p>
                    <span className="text-xl font-black text-slate-900">{seg.count}</span>
                  </div>
                  <p className="text-sm text-slate-500 mb-3">{seg.desc}</p>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg w-fit"
                    style={{ backgroundColor: `${seg.color}12`, border: `1px solid ${seg.color}25` }}>
                    <ChevronRight size={12} style={{ color: seg.color }} />
                    <span className="text-xs font-semibold" style={{ color: seg.color }}>{seg.action}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Distribution by tier */}
          <div className="card p-5">
            <p className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-5">Distribución por nivel</p>
            <div className="space-y-3">
              {[
                { label: "Bronce",  count: 700, color: "#CD7F32", pct: 55 },
                { label: "Plata",   count: 397, color: "#94A3B8", pct: 31 },
                { label: "Oro",     count: 145, color: "#F59E0B", pct: 11 },
                { label: "Leyenda", count: 42,  color: "#10B981", pct: 3  },
              ].map((tier) => (
                <div key={tier.label} className="flex items-center gap-3">
                  <span className="text-sm font-semibold w-16 text-slate-700">{tier.label}</span>
                  <div className="flex-1 h-2 rounded-full bg-slate-100">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${tier.pct}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: tier.color }}
                    />
                  </div>
                  <span className="text-sm font-mono font-bold w-12 text-right" style={{ color: tier.color }}>
                    {tier.count}
                  </span>
                  <span className="text-xs text-slate-400 w-8">{tier.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ── CAMPAÑAS ── */}
      {view === "Campañas" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard icon={<Zap size={18} />}        label="Campañas activas"    value="3"     sub="de 8 en el año"            color="#10B981" />
            <KpiCard icon={<Star size={18} />}       label="Mejor campaña"       value="Verde Partido" sub="742 fans · 91% completitud"  color="#F59E0B" />
            <KpiCard icon={<BarChart3 size={18} />}  label="Duración promedio"   value="14d"   sub="por campaña"              color="#3B82F6" />
            <KpiCard icon={<Gift size={18} />}       label="Costo por fan activado"value="$4.2" sub="USD · mejor que benchmark"  color="#8B5CF6" />
          </div>

          {/* Campaign bar chart */}
          <div className="card p-5">
            <p className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">Comparativa de campañas</p>
            <p className="text-sm text-slate-800 font-semibold mb-4">Fans activados vs completitud</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={campaignData} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="nombre" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left"  tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} domain={[0,100]} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar yAxisId="left"  dataKey="fans"        fill="#10B981" radius={[4,4,0,0]} name="Fans activados" />
                <Bar yAxisId="right" dataKey="completitud" fill="#3B82F6" radius={[4,4,0,0]} name="Completitud %" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Campaign table */}
          <div className="card overflow-hidden">
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-100">
              <p className="text-sm font-semibold text-slate-800">Detalle de campañas · 2025</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    {["Campaña","Período","Fans","Completitud","Puntos ESG","Canjes","Estado"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[
                    { name: "🌿 Verde Partido",       period: "Mar – Abr", fans: 742, pct: 91, pts: "111,300", canjes: 84, status: "Completada", sc: "#10B981" },
                    { name: "💧 Agua Cero Residuos",  period: "Abr – May", fans: 523, pct: 76, pts: "62,760",  canjes: 47, status: "Completada", sc: "#10B981" },
                    { name: "🚲 Movilidad Sostenible",period: "May – Jun", fans: 389, pct: 68, pts: "31,120",  canjes: 31, status: "Completada", sc: "#10B981" },
                    { name: "☀️ Energía Limpia Fan",  period: "Jun – Jul", fans: 612, pct: 83, pts: "73,440",  canjes: 68, status: "Activa",     sc: "#F59E0B" },
                    { name: "🌍 LATAM Verde",          period: "Jul – Ago", fans: 0,   pct: 0,  pts: "—",      canjes: 0,  status: "Próxima",    sc: "#3B82F6" },
                  ].map((row) => (
                    <tr key={row.name} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3 font-semibold text-slate-800">{row.name}</td>
                      <td className="px-5 py-3 text-slate-500 text-xs">{row.period}</td>
                      <td className="px-5 py-3 font-semibold text-teal-600">{row.fans || "—"}</td>
                      <td className="px-5 py-3">
                        {row.pct > 0 && (
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 rounded-full bg-slate-100">
                              <div className="h-full rounded-full bg-teal-500" style={{ width: `${row.pct}%` }} />
                            </div>
                            <span className="text-xs font-mono text-slate-600">{row.pct}%</span>
                          </div>
                        )}
                        {!row.pct && <span className="text-slate-300">—</span>}
                      </td>
                      <td className="px-5 py-3 font-mono font-semibold text-slate-800">{row.pts}</td>
                      <td className="px-5 py-3 text-slate-600">{row.canjes || "—"}</td>
                      <td className="px-5 py-3">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                          style={{ backgroundColor: `${row.sc}15`, color: row.sc, border: `1px solid ${row.sc}30` }}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
