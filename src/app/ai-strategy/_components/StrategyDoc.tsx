"use client";
import { motion } from "framer-motion";
import { FileText, Target, Map, Wallet, Globe, Shield, Layers, BookOpen, AlertTriangle, CheckCircle2, Rocket, Printer } from "lucide-react";
import type { StrategyDocument } from "@/lib/strategy/types";
import { PILLAR_COLOR } from "./Steps";
import { PILLAR_LABEL } from "@/lib/strategy/types";

function Sec({ n, icon, title, children }: { n: number; icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: n * 0.05 }} className="card p-7 print:shadow-none print:border">
      <div className="flex items-center gap-3 mb-5"><span className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-900 text-xs font-bold" style={{ background: "linear-gradient(135deg, #10B981, #06B6D4)" }}>{n}</span><span className="text-teal-600">{icon}</span><h2 className="font-bold text-slate-900 text-lg">{title}</h2></div>
      {children}
    </motion.section>
  );
}
const fmt = (n: number, cur: string) => `${cur === "USD" ? "US$" : "$"}${Math.round(n).toLocaleString("es-CL")}${cur === "USD" ? "" : " CLP"}`;

export function StrategyDoc({ doc, status, onMaterialize, materializing }: { doc: StrategyDocument; status: string; onMaterialize: () => void; materializing: boolean }) {
  const levelLabel = { bajo: "Bajo", en_desarrollo: "En desarrollo", consolidado: "Consolidado" } as const;
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

      {/* 1. Portada + resumen */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card overflow-hidden">
        <div className="p-10" style={{ background: "linear-gradient(135deg, #0B1628 0%, #0D1F3C 55%, #0A2818 100%)" }}>
          <p className="text-xs uppercase tracking-[3px] font-bold" style={{ color: "#6EE7B7" }}>Bettersport · Estrategia ESG</p>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white mt-3">{doc.cover.orgName}</h1>
          <p className="text-lg text-white/70 mt-1">{doc.cover.title}{doc.cover.orgType && ` · ${doc.cover.orgType}`}{doc.cover.sport && ` · ${doc.cover.sport}`}</p>
          {doc.cover.responsible && <p className="text-xs mt-4" style={{ color: "#8FA3C2" }}>Responsable: {doc.cover.responsible}</p>}
        </div>
        <div className="p-7"><p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Resumen ejecutivo</p><p className="text-slate-700 leading-relaxed">{doc.cover.executiveSummary}</p>
          <div className="flex flex-wrap gap-2 mt-4">{doc.cover.keyGoals.map((g) => <span key={g} className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">{g}</span>)}</div></div>
      </motion.div>

      {/* 2. Diagnóstico */}
      <Sec n={2} icon={<Layers size={16} />} title="Contexto y diagnóstico">
        <p className="text-sm text-slate-600 leading-relaxed mb-5">{doc.diagnosis.narrative}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {doc.diagnosis.maturity.map((m) => (
            <div key={m.pillar} className="p-4 rounded-xl" style={{ backgroundColor: "#F8FAFC", borderLeft: `3px solid ${PILLAR_COLOR[m.pillar]}` }}>
              <div className="flex items-center justify-between"><p className="text-sm font-semibold text-slate-800">{PILLAR_LABEL[m.pillar]}</p><span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${PILLAR_COLOR[m.pillar]}18`, color: PILLAR_COLOR[m.pillar] }}>{levelLabel[m.level]}</span></div>
              <p className="text-2xl font-black mt-1" style={{ color: PILLAR_COLOR[m.pillar] }}>{m.score}<span className="text-sm text-slate-400 font-medium">/100</span></p>
              <p className="text-[11px] text-slate-400 mt-1">{m.detail}</p>
            </div>))}
        </div>
        {doc.diagnosis.baselineGaps.length > 0 && <div className="mt-4 p-3.5 rounded-xl text-sm flex items-start gap-2.5" style={{ backgroundColor: "#FFFBEB", border: "1px solid #FDE68A", color: "#92400E" }}><AlertTriangle size={15} className="mt-0.5 flex-shrink-0" /><div><p className="font-semibold mb-1">Brechas de línea base</p><ul className="list-disc pl-4 space-y-0.5">{doc.diagnosis.baselineGaps.map((g) => <li key={g}>{g}</li>)}</ul></div></div>}
      </Sec>

      {/* 3. Metodología */}
      <Sec n={3} icon={<BookOpen size={16} />} title="Marco metodológico"><ul className="space-y-2">{doc.methodology.map((m) => <li key={m} className="flex items-start gap-2.5 text-sm text-slate-600"><CheckCircle2 size={15} className="text-teal-500 mt-0.5 flex-shrink-0" />{m}</li>)}</ul></Sec>

      {/* 4. Estrategia por pilar */}
      <Sec n={4} icon={<Target size={16} />} title="Estrategia por pilar">
        <div className="space-y-6">{doc.pillars.map((pp) => (
          <div key={pp.pillar}><div className="flex items-center gap-2 mb-3"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PILLAR_COLOR[pp.pillar] }} /><h3 className="font-bold text-slate-900">Pilar {pp.label}</h3></div>
            <div className="space-y-4">{pp.plans.map((p) => (
              <div key={p.key} className="p-5 rounded-xl" style={{ backgroundColor: "#F8FAFC", border: "1px solid #F1F5F9", borderLeft: `3px solid ${PILLAR_COLOR[p.pillar]}` }}>
                <div className="flex items-start justify-between gap-3 flex-wrap"><div><h4 className="font-semibold text-slate-900">{p.label}</h4><p className="text-xs text-slate-500 mt-0.5">{p.griStandard}{p.griTitle && ` · ${p.griTitle}`}{p.sdgs.length > 0 && ` · ${p.sdgs.join(", ")}`}</p></div>
                  {p.goalPreliminary && <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold" style={{ backgroundColor: "#FFFBEB", color: "#B45309", border: "1px solid #FDE68A" }}>Preliminar — sujeta a validación con datos</span>}</div>
                <p className="text-sm text-slate-800 mt-3 leading-relaxed"><span className="font-semibold">Meta:</span> {p.goalText}</p>
                {p.indicators.length > 0 && <p className="text-xs text-slate-500 mt-2"><span className="font-semibold">Indicadores GRI:</span> {p.indicators.join(" · ")}</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div><p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Hitos</p><ul className="space-y-1">{p.milestones.map((m) => <li key={m.year} className="text-xs text-slate-600"><span className="font-bold text-slate-800">{m.year}</span> · {m.label}: {m.target}</li>)}</ul></div>
                  <div><p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Proyectos propuestos</p><ul className="space-y-1">{p.proposedProjects.map((pr) => <li key={pr.title} className="text-xs text-slate-600"><span className="font-semibold text-slate-800">{pr.title}</span> <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 text-[10px] uppercase">{pr.investmentLevel}</span>{pr.estimatedBudget ? ` · ${fmt(pr.estimatedBudget, p.budgetCurrency)}` : ""}<br /><span className="text-slate-500">{pr.description}</span></li>)}</ul></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-3 text-xs" style={{ borderTop: "1px solid #E2E8F0" }}>
                  <div><span className="text-slate-400">Presupuesto: </span><span className="text-slate-700 font-medium">{p.budgetStatus === "si" && p.budgetAmount ? fmt(p.budgetAmount, p.budgetCurrency) : p.budgetStatus === "en_evaluacion" ? "En evaluación" : "Sin presupuesto — estimado por nivel"}</span></div>
                  <div><span className="text-slate-400">RR.HH.: </span><span className="text-slate-700">{p.hrRecommendation}</span></div>
                  <div><span className="text-slate-400">Responsable sugerido: </span><span className="text-slate-700 font-medium">{p.responsibleSuggested}</span></div>
                </div>
                {p.globalAlignment && <p className="text-xs text-cyan-700 mt-3 flex items-center gap-1.5"><Globe size={12} />{p.globalAlignment}</p>}
              </div>))}</div>
          </div>))}</div>
      </Sec>

      {/* 5. Hoja de ruta */}
      <Sec n={5} icon={<Map size={16} />} title="Hoja de ruta consolidada">
        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${Math.min(doc.roadmap.length, 4)}, minmax(0,1fr))` }}>
          {doc.roadmap.map((r) => (<div key={r.year} className="p-4 rounded-xl" style={{ backgroundColor: "#F8FAFC", border: "1px solid #F1F5F9" }}><p className="text-lg font-black text-slate-900 mb-2">{r.year}</p><ul className="space-y-1.5">{r.items.map((it, i) => <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5"><span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: PILLAR_COLOR[it.pillar] }} /><span><span className="font-medium text-slate-800">{it.label}</span> — {it.milestone}</span></li>)}</ul></div>))}
        </div>
      </Sec>

      {/* 6. Inversión */}
      <Sec n={6} icon={<Wallet size={16} />} title="Plan de inversión resumen">
        <p className="text-sm text-slate-600 mb-4">{doc.investment.narrative}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Por pilar</p>{doc.investment.byPillar.map((b) => <div key={b.pillar} className="flex items-center justify-between py-2 text-sm" style={{ borderBottom: "1px solid #F1F5F9" }}><span className="text-slate-700 flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: PILLAR_COLOR[b.pillar] }} />{PILLAR_LABEL[b.pillar]}</span><span className="font-semibold text-slate-800">{b.declared ? fmt(b.declared, doc.investment.currency) : <span className="text-slate-400 font-normal">nivel {b.estimatedLevel}</span>}</span></div>)}<div className="flex items-center justify-between pt-3 text-sm"><span className="font-bold text-slate-900">Total declarado</span><span className="font-black text-teal-600">{doc.investment.declaredTotal ? fmt(doc.investment.declaredTotal, doc.investment.currency) : "—"}</span></div></div>
          <div><p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Por año (declarado)</p>{doc.investment.byYear.map((y) => <div key={y.year} className="flex items-center justify-between py-2 text-sm" style={{ borderBottom: "1px solid #F1F5F9" }}><span className="text-slate-700">{y.year}</span><span className="font-semibold text-slate-800">{y.declared ? fmt(y.declared, doc.investment.currency) : "—"}</span></div>)}</div>
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
    </div>
  );
}
