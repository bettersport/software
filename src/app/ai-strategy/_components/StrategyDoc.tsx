"use client";
import { motion } from "framer-motion";
import { FileText, Target, Map, Wallet, Globe, Shield, Layers, BookOpen, AlertTriangle, CheckCircle2, Rocket, Printer, Users, UserCheck, Flag, TrendingUp, CalendarDays, Sparkles } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, LabelList, LineChart, Line, CartesianGrid } from "recharts";
import type { StrategyDocument, ChallengePlan, Milestone } from "@/lib/strategy/types";
import { PILLAR_COLOR } from "./Steps";
import { PILLAR_LABEL } from "@/lib/strategy/types";

const fmt = (n: number, cur: string) => `${cur === "USD" ? "US$" : "$"}${Math.round(n).toLocaleString("es-CL")}${cur === "USD" ? "" : " CLP"}`;

const LEVEL_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  bajo: { bg: "#ECFDF5", color: "#047857", label: "Inversión baja" },
  medio: { bg: "#FFFBEB", color: "#B45309", label: "Inversión media" },
  alto: { bg: "#FFF1F2", color: "#BE123C", label: "Inversión alta" },
};

/** Extrae el % de un texto de hito ("Reducir 6% acumulado…" → 6). */
function pctOf(target: string): number | null {
  const m = target.match(/(\d+(?:[.,]\d+)?)\s*%/);
  return m ? parseFloat(m[1].replace(",", ".")) : null;
}

function Sec({ n, icon, title, children }: { n: number; icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: n * 0.05 }} className="card p-7 print:shadow-none print:border">
      <div className="flex items-center gap-3 mb-5"><span className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-900 text-xs font-bold" style={{ background: "linear-gradient(135deg, #10B981, #06B6D4)" }}>{n}</span><span className="text-teal-600">{icon}</span><h2 className="font-bold text-slate-900 text-lg">{title}</h2></div>
      {children}
    </motion.section>
  );
}

/** Anillo de progreso SVG para los puntajes de madurez. */
function ScoreRing({ score, color }: { score: number; color: string }) {
  const r = 24, c = 2 * Math.PI * r;
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" className="flex-shrink-0" role="img" aria-label={`${score} de 100`}>
      <circle cx="32" cy="32" r={r} fill="none" stroke="#EEF2F7" strokeWidth="6" />
      <circle cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
        strokeDasharray={`${(score / 100) * c} ${c}`} transform="rotate(-90 32 32)" />
      <text x="32" y="36" textAnchor="middle" fontSize="15" fontWeight="800" fill="#0F172A">{score}</text>
    </svg>
  );
}

function StatTile({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string; sub?: string; color: string }) {
  return (
    <div className="card p-4 flex items-center gap-3.5">
      <span className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}14`, color }}>{icon}</span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
        <p className={`font-black text-slate-900 leading-tight ${value.length > 10 ? "text-sm" : "text-xl"}`}>{value}</p>
        {sub && <p className="text-[11px] text-slate-400 truncate">{sub}</p>}
      </div>
    </div>
  );
}

const tooltipStyle = { fontSize: 12, borderRadius: 10, border: "1px solid #E2E8F0", boxShadow: "0 4px 12px rgba(15,23,42,0.08)" };

/** Trayectoria de la meta: hitos con % acumulado → línea; si no son numéricos, lista. */
function MilestoneTrack({ plan }: { plan: ChallengePlan }) {
  const pts = plan.milestones.map((m) => ({ year: m.year, pct: pctOf(m.target), m }));
  const numeric = pts.length >= 3 && pts.every((p) => p.pct !== null);
  if (!numeric) {
    return (
      <ol className="relative ml-2 pl-4 space-y-2" style={{ borderLeft: `2px solid ${PILLAR_COLOR[plan.pillar]}33` }}>
        {plan.milestones.map((m: Milestone) => (
          <li key={m.year} className="text-xs text-slate-600 relative">
            <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white" style={{ backgroundColor: PILLAR_COLOR[plan.pillar] }} />
            <span className="font-bold text-slate-800">{m.year}</span> · {m.label}: {m.target}
          </li>
        ))}
      </ol>
    );
  }
  const color = PILLAR_COLOR[plan.pillar];
  const last = pts[pts.length - 1];
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <p className="text-[11px] text-slate-500">Avance acumulado comprometido (%)</p>
        <p className="text-[11px] font-bold" style={{ color }}>{last.pct}% al {last.year}</p>
      </div>
      <ResponsiveContainer width="100%" height={150}>
        <LineChart data={pts} margin={{ top: 14, right: 14, left: -18, bottom: 0 }}>
          <CartesianGrid stroke="#F1F5F9" vertical={false} />
          <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={{ stroke: "#E2E8F0" }} />
          <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} unit="%" width={44} />
          <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}% acumulado`, plan.label]} labelFormatter={(y) => `Año ${y}`} />
          <Line type="monotone" dataKey="pct" stroke={color} strokeWidth={2} dot={{ r: 3.5, fill: color, strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-1.5 mt-2">
        {pts.map((p) => (
          <span key={p.year} title={`${p.m.label}: ${p.m.target}`} className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${color}12`, color: "#475569" }}>
            {p.year} · <span className="font-bold" style={{ color }}>{p.pct}%</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function PlanCard({ p }: { p: ChallengePlan }) {
  const color = PILLAR_COLOR[p.pillar];
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #E8EDF4", boxShadow: "0 1px 3px rgba(15,23,42,0.03)" }}>
      {/* Encabezado del desafío */}
      <div className="px-5 py-4 flex items-start justify-between gap-3 flex-wrap" style={{ backgroundColor: `${color}0A`, borderBottom: `1px solid ${color}22` }}>
        <div className="flex items-start gap-3">
          <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: `${color}1A`, color }}><Flag size={16} /></span>
          <div>
            <h4 className="font-bold text-slate-900 leading-snug">{p.label}</h4>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md text-white" style={{ backgroundColor: color }}>{p.griStandard}</span>
              {p.griTitle && <span className="text-[10px] px-2 py-0.5 rounded-md bg-white text-slate-500 border border-slate-200">{p.griTitle}</span>}
              {p.sdgs.map((s) => <span key={s} className="text-[10px] px-2 py-0.5 rounded-md font-semibold" style={{ backgroundColor: "#EFF6FF", color: "#1D4ED8" }}>{s}</span>)}
            </div>
          </div>
        </div>
        {p.goalPreliminary && <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold flex-shrink-0" style={{ backgroundColor: "#FFFBEB", color: "#B45309", border: "1px solid #FDE68A" }}>Preliminar — sujeta a validación</span>}
      </div>

      <div className="p-5 bg-white">
        {/* Meta destacada */}
        <div className="p-4 rounded-xl flex items-start gap-3" style={{ backgroundColor: `${color}0D`, borderLeft: `3px solid ${color}` }}>
          <Target size={16} className="mt-0.5 flex-shrink-0" style={{ color }} />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color }}>Meta</p>
            <p className="text-sm text-slate-800 leading-relaxed font-medium">{p.goalText}</p>
          </div>
        </div>
        {p.indicators.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mt-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mr-1">Indicadores GRI</span>
            {p.indicators.map((ind) => <span key={ind} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">{ind}</span>)}
          </div>
        )}

        {/* Hitos + proyectos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5"><TrendingUp size={12} /> Hitos</p>
            <MilestoneTrack plan={p} />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5"><Rocket size={12} /> Proyectos propuestos</p>
            <div className="space-y-2.5">
              {p.proposedProjects.map((pr) => {
                const lv = LEVEL_STYLE[pr.investmentLevel] ?? LEVEL_STYLE.medio;
                return (
                  <div key={pr.title} className="p-3.5 rounded-xl" style={{ backgroundColor: "#F8FAFC", border: "1px solid #EEF2F7" }}>
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-slate-800">{pr.title}</p>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide flex-shrink-0" style={{ backgroundColor: lv.bg, color: lv.color }}>{lv.label}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{pr.description}</p>
                    {pr.estimatedBudget ? <p className="text-xs font-bold text-slate-700 mt-1.5">{fmt(pr.estimatedBudget, p.budgetCurrency)}</p> : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Ficha operativa */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5 pt-4" style={{ borderTop: "1px dashed #E2E8F0" }}>
          <div className="flex items-start gap-2.5"><span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center flex-shrink-0"><Wallet size={13} /></span><div><p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Presupuesto</p><p className="text-xs text-slate-700 font-medium mt-0.5">{p.budgetStatus === "si" && p.budgetAmount ? fmt(p.budgetAmount, p.budgetCurrency) : p.budgetStatus === "en_evaluacion" ? "En evaluación" : "Sin presupuesto — estimado por nivel"}</p></div></div>
          <div className="flex items-start gap-2.5"><span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center flex-shrink-0"><Users size={13} /></span><div><p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">RR.HH.</p><p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{p.hrRecommendation}</p></div></div>
          <div className="flex items-start gap-2.5"><span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center flex-shrink-0"><UserCheck size={13} /></span><div><p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Responsable sugerido</p><p className="text-xs text-slate-700 font-medium mt-0.5">{p.responsibleSuggested}</p></div></div>
        </div>
        {p.globalAlignment && <p className="text-xs text-cyan-700 mt-3 flex items-center gap-1.5"><Globe size={12} />{p.globalAlignment}</p>}
      </div>
    </div>
  );
}

export function StrategyDoc({ doc, status, onMaterialize, materializing }: { doc: StrategyDocument; status: string; onMaterialize: () => void; materializing: boolean }) {
  const levelLabel = { bajo: "Bajo", en_desarrollo: "En desarrollo", consolidado: "Consolidado" } as const;
  const plans = doc.pillars.flatMap((pp) => pp.plans);
  const nProjects = plans.reduce((a, p) => a + p.proposedProjects.length, 0);
  const nMilestones = plans.reduce((a, p) => a + p.milestones.length, 0);
  const pillarInvestment = doc.investment.byPillar.map((b) => ({ name: PILLAR_LABEL[b.pillar], declared: b.declared, level: b.estimatedLevel, pillar: b.pillar }));
  const hasDeclared = doc.investment.byPillar.some((b) => b.declared > 0);
  const yearInvestment = doc.investment.byYear.filter((y) => y.declared > 0);

  return (
    <div className="space-y-5 print:space-y-4">
      {/* Acciones */}
      <div className="flex items-center justify-between gap-3 flex-wrap print:hidden">
        <div className="flex items-center gap-2 text-xs text-slate-400"><span className="badge badge-green">v{doc.version}</span><span>Generado {new Date(doc.generatedAt).toLocaleString("es-CL")}</span><span>· motor {doc.engine === "claude" ? "Claude + GRI" : "GRI"}</span></div>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="btn-secondary flex items-center gap-2"><Printer size={15} /> Exportar / imprimir</button>
          {status !== "active" ? (
            <button onClick={onMaterialize} disabled={materializing} className="btn-primary flex items-center gap-2 disabled:opacity-60"><Rocket size={15} /> {materializing ? "Creando proyectos…" : "Convertir metas en proyectos ESG"}</button>
          ) : (
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 px-3"><CheckCircle2 size={16} /> Metas activas como proyectos ESG</span>
          )}
        </div>
      </div>

      {/* 1. Portada */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card overflow-hidden">
        <div className="p-10 relative" style={{ background: "linear-gradient(135deg, #0B1628 0%, #0D1F3C 55%, #0A2818 100%)" }}>
          <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle at 85% 20%, #10B981 0%, transparent 45%), radial-gradient(circle at 15% 90%, #06B6D4 0%, transparent 40%)" }} />
          <div className="relative">
            <p className="text-xs uppercase tracking-[3px] font-bold" style={{ color: "#6EE7B7" }}>Bettersport · Estrategia ESG</p>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white mt-3">{doc.cover.orgName}</h1>
            <p className="text-lg text-white/70 mt-1">{doc.cover.title}{doc.cover.orgType && ` · ${doc.cover.orgType}`}{doc.cover.sport && ` · ${doc.cover.sport}`}</p>
            <div className="flex flex-wrap gap-2 mt-5">
              {doc.cover.period && <span className="text-xs px-3 py-1 rounded-full font-semibold text-white/90" style={{ backgroundColor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}>📅 {doc.cover.period}</span>}
              {doc.cover.responsible && <span className="text-xs px-3 py-1 rounded-full font-semibold text-white/90" style={{ backgroundColor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}>Responsable: {doc.cover.responsible}</span>}
            </div>
          </div>
        </div>
        <div className="p-7"><p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Resumen ejecutivo</p><p className="text-slate-700 leading-relaxed">{doc.cover.executiveSummary}</p>
          <div className="flex flex-wrap gap-2 mt-4">{doc.cover.keyGoals.map((g) => <span key={g} className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">{g}</span>)}</div></div>
      </motion.div>

      {/* Indicadores clave */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatTile icon={<Flag size={17} />} label="Desafíos ESG" value={String(plans.length)} sub={`${doc.pillars.length} pilares`} color="#10B981" />
        <StatTile icon={<Rocket size={17} />} label="Proyectos propuestos" value={String(nProjects)} sub="listos para activar" color="#06B6D4" />
        <StatTile icon={<CalendarDays size={17} />} label="Hitos planificados" value={String(nMilestones)} sub={doc.cover.period} color="#3B82F6" />
        <StatTile icon={<Wallet size={17} />} label="Inversión declarada" value={doc.investment.declaredTotal ? fmt(doc.investment.declaredTotal, doc.investment.currency) : "Por nivel"} sub={doc.investment.declaredTotal ? "total del período" : "estimación bajo/medio/alto"} color="#8B5CF6" />
      </div>

      {/* 2. Diagnóstico */}
      <Sec n={2} icon={<Layers size={16} />} title="Contexto y diagnóstico">
        <p className="text-sm text-slate-600 leading-relaxed mb-5">{doc.diagnosis.narrative}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {doc.diagnosis.maturity.map((m) => (
            <div key={m.pillar} className="p-4 rounded-xl flex items-center gap-4" style={{ backgroundColor: "#F8FAFC", borderTop: `3px solid ${PILLAR_COLOR[m.pillar]}` }}>
              <ScoreRing score={m.score} color={PILLAR_COLOR[m.pillar]} />
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-800">{PILLAR_LABEL[m.pillar]}</p>
                <span className="inline-block text-[10px] px-2 py-0.5 rounded-full font-bold mt-1" style={{ backgroundColor: `${PILLAR_COLOR[m.pillar]}18`, color: PILLAR_COLOR[m.pillar] }}>{levelLabel[m.level]}</span>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">{m.detail}</p>
              </div>
            </div>))}
        </div>
        {doc.diagnosis.baselineGaps.length > 0 && <div className="mt-4 p-3.5 rounded-xl text-sm flex items-start gap-2.5" style={{ backgroundColor: "#FFFBEB", border: "1px solid #FDE68A", color: "#92400E" }}><AlertTriangle size={15} className="mt-0.5 flex-shrink-0" /><div><p className="font-semibold mb-1">Brechas de línea base</p><ul className="list-disc pl-4 space-y-0.5">{doc.diagnosis.baselineGaps.map((g) => <li key={g}>{g}</li>)}</ul></div></div>}
      </Sec>

      {/* 3. Metodología */}
      <Sec n={3} icon={<BookOpen size={16} />} title="Marco metodológico"><ul className="space-y-2">{doc.methodology.map((m) => <li key={m} className="flex items-start gap-2.5 text-sm text-slate-600"><CheckCircle2 size={15} className="text-teal-500 mt-0.5 flex-shrink-0" />{m}</li>)}</ul></Sec>

      {/* 4. Estrategia por pilar */}
      <Sec n={4} icon={<Target size={16} />} title="Estrategia por pilar">
        <div className="space-y-8">{doc.pillars.map((pp) => (
          <div key={pp.pillar}>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: PILLAR_COLOR[pp.pillar] }} />
              <h3 className="font-bold text-slate-900 text-base">Pilar {pp.label}</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${PILLAR_COLOR[pp.pillar]}14`, color: PILLAR_COLOR[pp.pillar] }}>{pp.plans.length} desafío{pp.plans.length === 1 ? "" : "s"}</span>
              <span className="flex-1 h-px" style={{ background: `linear-gradient(to right, ${PILLAR_COLOR[pp.pillar]}44, transparent)` }} />
            </div>
            <div className="space-y-5">{pp.plans.map((p) => <PlanCard key={p.key} p={p} />)}</div>
          </div>))}</div>
      </Sec>

      {/* 5. Hoja de ruta */}
      <Sec n={5} icon={<Map size={16} />} title="Hoja de ruta consolidada">
        <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {doc.roadmap.map((r, ri) => (
            <div key={r.year} className="p-4 rounded-xl" style={{ backgroundColor: ri === doc.roadmap.length - 1 ? "#F0FDF9" : "#F8FAFC", border: ri === doc.roadmap.length - 1 ? "1px solid #99F6E4" : "1px solid #F1F5F9" }}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-lg font-black text-slate-900">{r.year}</p>
                {ri === doc.roadmap.length - 1 && <span className="text-[9px] font-bold uppercase tracking-wide text-teal-700 bg-teal-100 px-1.5 py-0.5 rounded">Meta final</span>}
              </div>
              <ul className="space-y-1.5">{r.items.map((it, i) => (
                <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                  <span className="text-[9px] font-bold px-1.5 py-px rounded mt-px flex-shrink-0" style={{ backgroundColor: `${PILLAR_COLOR[it.pillar]}16`, color: PILLAR_COLOR[it.pillar] }}>{PILLAR_LABEL[it.pillar].slice(0, 3).toUpperCase()}</span>
                  <span><span className="font-medium text-slate-800">{it.label}</span> — {it.milestone}</span>
                </li>))}</ul>
            </div>))}
        </div>
      </Sec>

      {/* 6. Inversión */}
      <Sec n={6} icon={<Wallet size={16} />} title="Plan de inversión resumen">
        <p className="text-sm text-slate-600 mb-5">{doc.investment.narrative}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">Por pilar</p>
            {hasDeclared ? (
              <ResponsiveContainer width="100%" height={40 * pillarInvestment.length + 30}>
                <BarChart data={pillarInvestment} layout="vertical" margin={{ top: 0, right: 104, left: 0, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: "#475569", fontWeight: 600 }} tickLine={false} axisLine={false} width={92} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => [fmt(Number(v), doc.investment.currency), "Declarado"]} cursor={{ fill: "#F8FAFC" }} />
                  <Bar dataKey="declared" barSize={18} radius={[0, 4, 4, 0]}>
                    {pillarInvestment.map((b) => <Cell key={b.pillar} fill={PILLAR_COLOR[b.pillar]} />)}
                    <LabelList dataKey="declared" position="right" formatter={(v) => (typeof v === "number" && v ? fmt(v, doc.investment.currency) : "—")} style={{ fontSize: 11, fontWeight: 700, fill: "#334155" }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="space-y-2">
                {pillarInvestment.map((b) => (
                  <div key={b.pillar} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: "#F8FAFC" }}>
                    <span className="text-sm text-slate-700 font-medium flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PILLAR_COLOR[b.pillar] }} />{b.name}</span>
                    <span className="text-[11px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wide" style={{ backgroundColor: (LEVEL_STYLE[b.level] ?? LEVEL_STYLE.medio).bg, color: (LEVEL_STYLE[b.level] ?? LEVEL_STYLE.medio).color }}>Nivel {b.level}</span>
                  </div>))}
              </div>
            )}
            <div className="flex items-center justify-between pt-3 mt-2 text-sm" style={{ borderTop: "1px solid #E2E8F0" }}><span className="font-bold text-slate-900">Total declarado</span><span className="font-black text-teal-600">{doc.investment.declaredTotal ? fmt(doc.investment.declaredTotal, doc.investment.currency) : "—"}</span></div>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">Por año (declarado)</p>
            {yearInvestment.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={yearInvestment} margin={{ top: 18, right: 8, left: -14, bottom: 0 }}>
                  <CartesianGrid stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#94A3B8" }} tickLine={false} axisLine={{ stroke: "#E2E8F0" }} />
                  <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} tickFormatter={(v) => (v >= 1e6 ? `${Math.round(v / 1e6)}M` : v >= 1e3 ? `${Math.round(v / 1e3)}K` : String(v))} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => [fmt(Number(v), doc.investment.currency), "Declarado"]} cursor={{ fill: "#F8FAFC" }} />
                  <Bar dataKey="declared" fill="#0D9488" barSize={26} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-slate-400 p-3 rounded-xl" style={{ backgroundColor: "#F8FAFC" }}>Sin montos anuales declarados — la inversión se estima por nivel en cada proyecto propuesto.</p>
            )}
          </div>
        </div>
      </Sec>

      {/* 7. Alineación estratégica */}
      <Sec n={7} icon={<Shield size={16} />} title="Alineación estratégica">
        {doc.strategicAlignment.length ? <div className="space-y-3">{doc.strategicAlignment.map((a, i) => <div key={a.objective} className="p-4 rounded-xl flex items-start gap-3" style={{ backgroundColor: "#F8FAFC" }}><span className="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0" style={{ background: i === 0 ? "linear-gradient(135deg, #10B981, #06B6D4)" : "#E2E8F0", color: "#0f172a" }}>{i + 1}</span><div><p className="text-sm font-semibold text-slate-800">{a.objective}</p><p className="text-xs text-slate-500 mt-1">{a.how}</p></div></div>)}</div> : <p className="text-sm text-slate-400">No se declararon objetivos estratégicos.</p>}
      </Sec>

      {/* 8. Alineación global */}
      {doc.globalAlignment && (
        <Sec n={8} icon={<Globe size={16} />} title={`Alineación global · ${doc.globalAlignment.organism}`}>
          <p className="text-sm text-slate-600 mb-3">{doc.globalAlignment.framework}</p>
          <ul className="space-y-1.5">{doc.globalAlignment.links.map((l) => <li key={l} className="text-sm text-slate-700 flex items-start gap-2"><CheckCircle2 size={14} className="text-cyan-500 mt-0.5 flex-shrink-0" />{l}</li>)}</ul>
        </Sec>
      )}

      {/* 9. Gobernanza */}
      <Sec n={doc.globalAlignment ? 9 : 8} icon={<FileText size={16} />} title="Próximos pasos y gobernanza de seguimiento">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div><p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Gobernanza</p><p className="text-sm text-slate-700"><span className="text-slate-400">Responsable:</span> {doc.governance.owner}</p><p className="text-sm text-slate-700 mt-1"><span className="text-slate-400">Revisión:</span> {doc.governance.reviewFrequency}</p><ul className="mt-2 space-y-1">{doc.governance.cadence.map((c) => <li key={c} className="text-xs text-slate-600">• {c}</li>)}</ul></div>
          <div><p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Próximos pasos</p><ol className="space-y-1.5">{doc.governance.nextSteps.map((n, i) => <li key={n} className="text-sm text-slate-700 flex items-start gap-2"><span className="font-bold text-teal-600">{i + 1}.</span>{n}</li>)}</ol></div>
        </div>
      </Sec>

      {/* CTA: alimentar Gestión ESG */}
      {status !== "active" && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card overflow-hidden print:hidden">
          <div className="p-6 flex items-center justify-between gap-4 flex-wrap" style={{ background: "linear-gradient(135deg, #ECFDF5, #ECFEFF)" }}>
            <div className="flex items-start gap-3">
              <span className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white" style={{ background: "linear-gradient(135deg, #10B981, #06B6D4)" }}><Sparkles size={18} /></span>
              <div>
                <p className="font-bold text-slate-900">Activa tu estrategia en la plataforma</p>
                <p className="text-sm text-slate-600 mt-0.5 max-w-xl">Convierte los {nProjects} proyectos propuestos en proyectos ESG con hitos y KPIs de seguimiento — alimentan automáticamente Gestión ESG, tus indicadores y el puntaje del club.</p>
              </div>
            </div>
            <button onClick={onMaterialize} disabled={materializing} className="btn-primary flex items-center gap-2 disabled:opacity-60 flex-shrink-0"><Rocket size={15} /> {materializing ? "Creando proyectos…" : "Convertir metas en proyectos ESG"}</button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
