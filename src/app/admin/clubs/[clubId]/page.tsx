"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Building2, Users, Trophy, Leaf, Scale, Eye,
  Zap, Gift, Star, BarChart3, CalendarDays, FileText,
  TrendingUp, TrendingDown, Minus, CheckCircle2, Clock, AlertCircle,
  MapPin, CalendarRange, Wallet, UserCheck, Target,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  fanTiers, fanActions as defaultActions, fanRewards as defaultRewards,
} from "@/lib/data";
import { ProgressBar } from "@/components/ui";
import { useUser } from "@/lib/userContext";
import { useResource } from "@/lib/useResource";
import type { FanTierName, Club, Event, ESGProject, FanProfile } from "@/lib/types";

// ── helpers ──────────────────────────────────────────────────────────────────

const tierConfig: Record<FanTierName, { color: string; emoji: string }> = {
  bronce:  { color: "#CD7F32", emoji: "🥉" },
  plata:   { color: "#94A3B8", emoji: "🥈" },
  oro:     { color: "#F59E0B", emoji: "🥇" },
  leyenda: { color: "#8B5CF6", emoji: "👑" },
};

const categoryConfig: Record<string, { label: string; color: string }> = {
  fisica:  { label: "Física",  color: "#10B981" },
  digital: { label: "Digital", color: "#3B82F6" },
  social:  { label: "Social",  color: "#8B5CF6" },
};

const statusConfig: Record<string, { label: string; color: string; Icon: React.ElementType }> = {
  in_progress: { label: "En curso",    color: "#10B981", Icon: TrendingUp     },
  planning:    { label: "Planificando",color: "#F59E0B", Icon: Clock           },
  completed:   { label: "Completado",  color: "#6366F1", Icon: CheckCircle2   },
  paused:      { label: "Pausado",     color: "#94A3B8", Icon: Minus           },
};

const eventStatusLabels: Record<string, { label: string; color: string }> = {
  negotiating: { label: "En negociación", color: "#F59E0B" },
  open:        { label: "Abierto",        color: "#10B981" },
  funded:      { label: "Financiado",     color: "#6366F1" },
  closed:      { label: "Cerrado",        color: "#94A3B8" },
};

const esgTrendData = [
  { mes: "Ene", score: 78 }, { mes: "Feb", score: 80 }, { mes: "Mar", score: 81 },
  { mes: "Abr", score: 83 }, { mes: "May", score: 84 }, { mes: "Jun", score: 85.3 },
];

type Tab = "perfil" | "fanzone" | "eventos" | "esg";

const TABS: { id: Tab; label: string; Icon: React.ElementType }[] = [
  { id: "perfil",   label: "Perfil",    Icon: Building2   },
  { id: "fanzone",  label: "Fan Zone",  Icon: Zap         },
  { id: "eventos",  label: "Eventos",   Icon: CalendarDays},
  { id: "esg",      label: "ESG",       Icon: Leaf        },
];

// ── main page ────────────────────────────────────────────────────────────────

export default function AdminClubDetailPage({ params }: { params: Promise<{ clubId: string }> }) {
  const { clubId } = use(params);
  const router = useRouter();
  const { activeUser, loaded } = useUser();
  const [tab, setTab] = useState<Tab>("perfil");

  const { data: club } = useResource<Club | null>(
    loaded && activeUser ? `/api/clubs/${clubId}` : null, null,
  );

  // Events, ESG projects and fans are club-scoped to the logged-in user's own
  // club; there is no cross-club admin endpoint. These sections degrade to a
  // graceful empty state derived from what the club object exposes.
  const clubEvents: Event[]      = [];
  const clubProjects: ESGProject[] = [];
  const clubFans: FanProfile[]   = [];

  // Fan zone catalogs fall back to the shared presentational defaults (no
  // per-club fan-config endpoint is available to an admin viewing another club).
  const fanZoneActions = defaultActions;
  const fanZoneRewards = defaultRewards;

  const fanZoneStats = {
    totalFans:         clubFans.length,
    activeFans:        clubFans.length,
    participationRate: 0,
    collectiveScore:   clubFans.reduce((s, f) => s + f.points, 0),
  };

  if (!club) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <Building2 size={40} className="mb-3 opacity-30" />
        <p>{loaded ? "Club no encontrado" : "Cargando club..."}</p>
        <button onClick={() => router.back()} className="mt-4 text-sm text-teal-600 underline">Volver</button>
      </div>
    );
  }

  const tierCounts = fanTiers.map((t) => ({
    ...t,
    count: clubFans.filter((f) => f.tier === t.name).length,
  }));

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* ── Back + Header ── */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()}
          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
          <ArrowLeft size={16} className="text-slate-600" />
        </button>
        <div className="flex-1">
          <p className="text-xs font-mono tracking-widest uppercase text-teal-600 mb-0.5">Admin · Clubes</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black text-white"
              style={{ background: "linear-gradient(135deg,#10B981,#06B6D4)" }}>
              {club.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-tight">{club.name}</h1>
              <p className="text-xs text-slate-400">{club.sport} · {club.flag} {club.country} · {club.members.toLocaleString()} miembros</p>
            </div>
          </div>
        </div>
        {/* ESG badge */}
        <div className="text-right">
          <p className="text-3xl font-black text-amber-500">{club.esgScore}</p>
          <p className="text-xs text-slate-400">Score ESG · #{club.ranking} ranking</p>
        </div>
      </div>

      {/* ── Quick stats ── */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Ambiental",    value: club.environmental, color: "#10B981", Icon: Leaf    },
          { label: "Social",       value: club.social,        color: "#06B6D4", Icon: Users   },
          { label: "Gobernanza",   value: club.governance,    color: "#8B5CF6", Icon: Scale   },
          { label: "Transparencia",value: club.transparency,  color: "#F59E0B", Icon: Eye     },
        ].map((s) => (
          <div key={s.label} className="card p-4 relative overflow-hidden">
            <div className="absolute left-0 top-0 w-1 h-full rounded-l" style={{ backgroundColor: s.color }} />
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-slate-500 font-medium">{s.label}</p>
              <s.Icon size={14} style={{ color: s.color }} />
            </div>
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        {TABS.map(({ id, label, Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={tab === id
              ? { backgroundColor: "#fff", color: "#0F172A", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }
              : { color: "#94A3B8" }}>
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════ PERFIL ══ */}
      {tab === "perfil" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-3 gap-6">

          {/* Left: info card */}
          <div className="col-span-1 space-y-4">
            <div className="card p-5 space-y-4">
              <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">Información del club</h3>
              {[
                { label: "Deporte",    value: club.sport                                },
                { label: "País",       value: `${club.flag} ${club.country}`            },
                { label: "Fundación",  value: club.founded                              },
                { label: "Miembros",   value: club.members.toLocaleString()             },
                { label: "Ranking",    value: `#${club.ranking} nacional`               },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">{label}</span>
                  <span className="font-semibold text-slate-800">{value}</span>
                </div>
              ))}
              {club.description && (
                <p className="text-xs text-slate-500 leading-relaxed pt-2 border-t border-slate-100">
                  {club.description}
                </p>
              )}
            </div>
          </div>

          {/* Right: ESG score + trend */}
          <div className="col-span-2 space-y-4">
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-sm">Score ESG — Evolución 2025</h3>
                <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">+7.3 pts este año</span>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={esgTrendData} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#10B981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}   />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[70, 100]} tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.12)", fontSize: 12 }} />
                  <Area type="monotone" dataKey="score" stroke="#10B981" strokeWidth={2.5} fill="url(#g1)" dot={{ fill: "#10B981", r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="card p-5">
              <h3 className="font-bold text-slate-900 text-sm mb-4">Dimensiones ESG</h3>
              <div className="space-y-3">
                {[
                  { label: "Ambiental",    value: club.environmental, color: "#10B981" },
                  { label: "Social",       value: club.social,        color: "#06B6D4" },
                  { label: "Gobernanza",   value: club.governance,    color: "#8B5CF6" },
                  { label: "Transparencia",value: club.transparency,  color: "#F59E0B" },
                ].map((d) => (
                  <div key={d.label}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-500 font-medium">{d.label}</span>
                      <span className="font-bold" style={{ color: d.color }}>{d.value}/100</span>
                    </div>
                    <ProgressBar value={d.value} max={100} height={6} color={d.color} showPercent={false} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ══════════════════════════════════════════════════════ FAN ZONE ══ */}
      {tab === "fanzone" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Total fans",     value: fanZoneStats.totalFans.toLocaleString(),    color: "#10B981" },
              { label: "Fans activos",   value: fanZoneStats.activeFans.toLocaleString(),   color: "#06B6D4" },
              { label: "Participación",  value: `${fanZoneStats.participationRate}%`,       color: "#F59E0B" },
              { label: "Score colectivo",value: fanZoneStats.collectiveScore.toLocaleString(),color: "#8B5CF6" },
            ].map((s) => (
              <div key={s.label} className="card p-5">
                <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Tier distribution */}
          <div className="card p-5">
            <h3 className="font-bold text-slate-900 text-sm mb-4">Distribución por nivel</h3>
            <div className="grid grid-cols-4 gap-3">
              {tierCounts.map((t) => (
                <div key={t.name} className="rounded-xl p-3 text-center"
                  style={{ backgroundColor: `${tierConfig[t.name as FanTierName].color}12`, border: `1px solid ${tierConfig[t.name as FanTierName].color}30` }}>
                  <p className="text-2xl mb-1">{tierConfig[t.name as FanTierName].emoji}</p>
                  <p className="font-bold text-slate-900 capitalize">{t.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{t.count} fans</p>
                  <p className="text-xs font-semibold mt-1" style={{ color: tierConfig[t.name as FanTierName].color }}>
                    {t.minPoints}+ pts
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Top fans */}
          {clubFans.length > 0 && (
            <div className="card p-5">
              <h3 className="font-bold text-slate-900 text-sm mb-4">Top fans del club</h3>
              <div className="space-y-2">
                {clubFans.slice(0, 5).sort((a, b) => b.points - a.points).map((fan, idx) => (
                  <div key={fan.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                    <span className="text-sm font-bold w-5 text-slate-400">#{idx + 1}</span>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white"
                      style={{ background: `linear-gradient(135deg,${tierConfig[fan.tier as FanTierName].color},#0ea5e9)` }}>
                      {fan.name[0]}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800">{fan.name}</p>
                      <p className="text-[10px] text-slate-400">{fan.actionsCompleted} acciones · {fan.badgesEarned} badges</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-teal-600">{fan.points.toLocaleString()} pts</p>
                      <p className="text-[10px] font-semibold capitalize" style={{ color: tierConfig[fan.tier as FanTierName].color }}>
                        {tierConfig[fan.tier as FanTierName].emoji} {fan.tier}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Configured actions */}
          <div className="grid grid-cols-2 gap-6">
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-sm">Acciones ESG configuradas</h3>
                <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">{fanZoneActions.length} acciones</span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {fanZoneActions.map((a) => (
                  <div key={a.id} className="flex items-center gap-3 p-2 rounded-xl bg-slate-50">
                    <span className="text-lg">{a.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{a.title}</p>
                      <p className="text-[10px] text-slate-400">{a.frequency}</p>
                    </div>
                    <span className="text-xs font-black text-teal-600">+{a.points}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-sm">Recompensas disponibles</h3>
                <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  {fanZoneRewards.filter((r) => r.available).length} activas
                </span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {fanZoneRewards.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 p-2 rounded-xl bg-slate-50">
                    <span className="text-lg">{r.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{r.name}</p>
                      <p className="text-[10px] text-slate-400 capitalize">{r.type}</p>
                    </div>
                    <div className="text-right">
                      {r.points > 0
                        ? <span className="text-xs font-black text-amber-500">{r.points.toLocaleString()} pts</span>
                        : <span className="text-xs font-bold text-purple-500">Badge</span>
                      }
                      {!r.available && <p className="text-[10px] text-slate-400">Inactiva</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ══════════════════════════════════════════════════════ EVENTOS ══ */}
      {tab === "eventos" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {clubEvents.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <CalendarDays size={40} className="mx-auto mb-3 opacity-30" />
              <p>No hay eventos registrados para este club</p>
            </div>
          ) : (
            clubEvents.map((ev) => {
              const st = eventStatusLabels[ev.status] ?? { label: ev.status, color: "#94A3B8" };
              const pct = Math.round((ev.funded / ev.budget) * 100);
              return (
                <div key={ev.id} className="card p-5">
                  <div className="flex items-start gap-4">
                    {/* Image placeholder */}
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex-shrink-0 overflow-hidden">
                      {ev.image && (
                        <img src={ev.image} alt={ev.title} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-slate-900">{ev.title}</h4>
                          <p className="text-xs text-slate-400 mt-0.5">{ev.sport} · {ev.flag} {ev.country}</p>
                        </div>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: `${st.color}15`, color: st.color }}>
                          {st.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2">{ev.description}</p>
                      {/* Funding bar */}
                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-400">Financiamiento</span>
                          <span className="font-semibold text-slate-700">
                            ${ev.funded.toLocaleString()} / ${ev.budget.toLocaleString()} ({pct}%)
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-slate-100">
                          <div className="h-full rounded-full transition-all"
                            style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: pct >= 100 ? "#10B981" : "#F59E0B" }} />
                        </div>
                      </div>
                      {/* Meta */}
                      <div className="flex gap-4 mt-3">
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <Users size={11} /> {ev.audience?.toLocaleString()} audiencia
                        </span>
                        {ev.daysLeft > 0 && (
                          <span className="flex items-center gap-1 text-xs text-slate-400">
                            <Clock size={11} /> {ev.daysLeft} días restantes
                          </span>
                        )}
                        {ev.sealEsg && (
                          <span className="flex items-center gap-1 text-xs text-teal-600 font-semibold">
                            <CheckCircle2 size={11} /> Sello ESG
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </motion.div>
      )}

      {/* ══════════════════════════════════════════════════════ ESG ══ */}
      {tab === "esg" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

          {/* Summary stats */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Proyectos activos",   value: clubProjects.filter((p) => p.status === "in_progress").length, color: "#10B981" },
              { label: "Proyectos completados",value: clubProjects.filter((p) => p.status === "completed").length,  color: "#6366F1" },
              { label: "Presupuesto total",    value: `$${(clubProjects.reduce((s, p) => s + p.budget, 0) / 1000).toFixed(0)}K`, color: "#F59E0B" },
              { label: "Progreso promedio",    value: `${clubProjects.length ? Math.round(clubProjects.reduce((s, p) => s + p.progress, 0) / clubProjects.length) : 0}%`, color: "#06B6D4" },
            ].map((s) => (
              <div key={s.label} className="card p-4">
                <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Projects list */}
          <div className="space-y-3">
            {clubProjects.length === 0 && (
              <div className="text-center py-16 text-slate-400">
                <Leaf size={40} className="mx-auto mb-3 opacity-30" />
                <p>No hay proyectos ESG disponibles para este club</p>
              </div>
            )}
            {clubProjects.map((proj) => {
              const sc = statusConfig[proj.status] ?? statusConfig.in_progress;
              const Icon = sc.Icon;
              const spentPct = Math.round((proj.spent / proj.budget) * 100);
              return (
                <div key={proj.id} className="card p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-slate-900 text-sm">{proj.title}</h4>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: `${sc.color}15`, color: sc.color }}>
                          <Icon size={9} className="inline mr-0.5" />{sc.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">Responsable: {proj.responsible}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xl font-black text-teal-600">{proj.progress}%</p>
                      <p className="text-[10px] text-slate-400">progreso</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mb-3 line-clamp-2">{proj.description}</p>

                  {/* Progress bar */}
                  <div className="mb-3">
                    <ProgressBar value={proj.progress} max={100} height={6} color={sc.color} showPercent={false} />
                  </div>

                  {/* Budget */}
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="text-center p-2 rounded-lg bg-slate-50">
                      <p className="font-bold text-slate-800">${proj.budget.toLocaleString()}</p>
                      <p className="text-slate-400 mt-0.5">Presupuesto</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-slate-50">
                      <p className="font-bold text-slate-800">${proj.spent.toLocaleString()}</p>
                      <p className="text-slate-400 mt-0.5">Ejecutado ({spentPct}%)</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-slate-50">
                      <p className="font-bold text-slate-800">
                        {proj.milestones.filter((m) => m.completed).length}/{proj.milestones.length}
                      </p>
                      <p className="text-slate-400 mt-0.5">Hitos completos</p>
                    </div>
                  </div>

                  {/* KPIs */}
                  {proj.kpis.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                      {proj.kpis.map((kpi) => (
                        <div key={kpi.id} className="flex items-center justify-between p-2 rounded-lg bg-teal-50">
                          <span className="text-xs text-teal-700 font-medium truncate mr-2">{kpi.name}</span>
                          <span className="text-xs font-black text-teal-700 flex-shrink-0">
                            {kpi.current} <span className="font-normal text-teal-400">/ {kpi.target} {kpi.unit}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
