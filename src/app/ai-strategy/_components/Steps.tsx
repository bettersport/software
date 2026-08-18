"use client";
import { useRef } from "react";
import { motion } from "framer-motion";
import { Upload, X, FileText, Info, AlertTriangle, CheckCircle2, ArrowUp, ArrowDown, Globe } from "lucide-react";
import type { ChallengeInput, Pillar } from "@/lib/strategy/types";
import { PILLAR_LABEL } from "@/lib/strategy/types";
import type { Strategy, GriRow, FrameworkRow } from "./useStrategy";
import { OBJECTIVE_LABEL } from "@/lib/strategy/engine";

export const PILLAR_COLOR: Record<Pillar, string> = { ambiental: "#10B981", social: "#3B82F6", gobernanza: "#8B5CF6" };
const SPORTS = ["Fútbol", "Rugby", "Multidisciplinario / Olímpico", "Tenis", "Básquetbol", "Ciclismo", "Deporte adaptado / Paralímpico", "Atletismo", "Natación", "Pádel", "Otro"];
const ORG_TYPES = ["Club profesional", "Club amateur", "Federación", "Liga", "Organizador de eventos", "Otro"];
const CURRENT_YEAR = new Date().getFullYear();

/* ── UI atoms ─────────────────────────────────────────────────────────────── */
export function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs text-slate-500 uppercase tracking-wider block mb-1.5 font-medium">{label}{required && <span className="text-red-400"> *</span>}</label>
      {children}
      {hint && <p className="text-xs text-slate-400 mt-1.5">{hint}</p>}
    </div>
  );
}
function YesNo({ value, onChange, options = [["si", "Sí"], ["no", "No"]] }: { value: string; onChange: (v: string) => void; options?: [string, string][] }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {options.map(([v, l]) => (
        <button key={v} type="button" onClick={() => onChange(v)} className="px-3.5 py-2 rounded-lg text-sm font-medium transition-all"
          style={value === v ? { background: "linear-gradient(135deg, #10B981, #06B6D4)", color: "#0f172a" } : { backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0", color: "#475569" }}>{l}</button>
      ))}
    </div>
  );
}
function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" onClick={() => onChange(!on)} className="flex items-center gap-3 text-left">
      <span className="relative w-10 h-6 rounded-full transition-colors flex-shrink-0" style={{ backgroundColor: on ? "#10B981" : "#CBD5E1" }}>
        <span className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform" style={{ transform: on ? "translateX(16px)" : "translateX(0)" }} />
      </span>
      <span className="text-sm text-slate-700">{label}</span>
    </button>
  );
}
export function DevNote({ children, tone = "info" }: { children: React.ReactNode; tone?: "info" | "warn" }) {
  const c = tone === "warn" ? { bg: "#FFFBEB", b: "#FDE68A", t: "#92400E", i: <AlertTriangle size={14} /> } : { bg: "#EFF6FF", b: "#BFDBFE", t: "#1E40AF", i: <Info size={14} /> };
  return <div className="flex items-start gap-2.5 p-3.5 rounded-xl text-sm" style={{ backgroundColor: c.bg, border: `1px solid ${c.b}`, color: c.t }}><span className="mt-0.5 flex-shrink-0">{c.i}</span><div>{children}</div></div>;
}

/* ── PASO 1 ───────────────────────────────────────────────────────────────── */
export function Step1({ s, save }: { s: Strategy; save: (p: Record<string, unknown>) => void }) {
  const years = Array.from({ length: 12 }, (_, i) => CURRENT_YEAR + i);
  const spanOk = s.vigenciaInicio && s.vigenciaFin ? s.vigenciaFin - s.vigenciaInicio + 1 : 0;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Nombre del club / federación" required><input className="input-field" value={s.orgName} onChange={(e) => save({ orgName: e.target.value })} placeholder="Club Deportivo…" /></Field>
        <Field label="Deporte principal" required hint="Determina qué lineamiento global se ofrece en el Paso 5.">
          <select className="input-field" value={s.sport} onChange={(e) => save({ sport: e.target.value })}><option value="">Seleccionar…</option>{SPORTS.map((x) => <option key={x}>{x}</option>)}</select>
        </Field>
        <Field label="Tipo de organización" required>
          <select className="input-field" value={s.orgType} onChange={(e) => save({ orgType: e.target.value })}><option value="">Seleccionar…</option>{ORG_TYPES.map((x) => <option key={x}>{x}</option>)}</select>
        </Field>
        <Field label="Período de vigencia de la estrategia" required hint={spanOk ? (spanOk < 2 || spanOk > 10 ? "El rango debe ser de 2 a 10 años." : `${spanOk} años · se propondrán hitos anuales.`) : "Ej. 2027 – 2030 (mínimo 2 años, máximo 10)."}>
          <div className="flex items-center gap-2">
            <select className="input-field" value={s.vigenciaInicio ?? ""} onChange={(e) => save({ vigenciaInicio: e.target.value ? Number(e.target.value) : null })}><option value="">Inicio</option>{years.map((y) => <option key={y} value={y}>{y}</option>)}</select>
            <span className="text-slate-400">–</span>
            <select className="input-field" value={s.vigenciaFin ?? ""} onChange={(e) => save({ vigenciaFin: e.target.value ? Number(e.target.value) : null })}><option value="">Término</option>{years.map((y) => <option key={y} value={y}>{y}</option>)}</select>
          </div>
        </Field>
      </div>
      <div className="card p-6 space-y-4">
        <p className="text-sm font-semibold text-slate-800">Responsable del proceso <span className="text-xs font-normal text-slate-400">— trazabilidad y notificaciones</span></p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Nombre" required><input className="input-field" value={s.respName} onChange={(e) => save({ respName: e.target.value })} /></Field>
          <Field label="Cargo"><input className="input-field" value={s.respRole} onChange={(e) => save({ respRole: e.target.value })} placeholder="Gerente de Sostenibilidad" /></Field>
          <Field label="Correo" required><input className="input-field" type="email" value={s.respEmail} onChange={(e) => save({ respEmail: e.target.value })} /></Field>
        </div>
      </div>
      <Field label="¿Es la primera estrategia ESG de la organización?">
        <YesNo value={s.isFirstStrategy ? "si" : "no"} onChange={(v) => save({ isFirstStrategy: v === "si" })} options={[["si", "Sí, es la primera"], ["no", "No, actualiza una anterior"]]} />
        {!s.isFirstStrategy && <p className="text-xs text-slate-400 mt-2">Podrás cargar la estrategia anterior como documento de contexto en el Paso 6.</p>}
      </Field>
    </div>
  );
}

/* ── PASO 2 — Desafíos + diagnóstico por desafío ─────────────────────────── */
const DIAG_Q: Record<Pillar, [string, string, string]> = {
  ambiental: ["¿Tienes una línea base de consumo/emisión/generación definida?", "¿Tienes algún diagnóstico o auditoría previa sobre esta materia?", "¿Cuentas con datos históricos de al menos 12 meses?"],
  social: ["¿Tienes indicadores actuales medidos sobre este desafío?", "¿Existe algún diagnóstico, encuesta o estudio social previo?", "¿Cuentas con políticas internas ya formalizadas sobre esta materia?"],
  gobernanza: ["¿Cuentas con políticas o normativas internas aprobadas por el directorio?", "¿Existe un diagnóstico de gobierno corporativo o cumplimiento (interno o externo)?", "¿Ha habido reportes o publicaciones previas de sostenibilidad/transparencia?"],
};
const NO_DATA_MSG: Record<Pillar, string> = {
  ambiental: "requiere levantamiento de línea base",
  social: "requiere levantamiento de datos base",
  gobernanza: "requiere diseño de política/marco desde cero",
};

export function emptyChallenge(pillar: Pillar, row: GriRow | null, custom?: string): ChallengeInput {
  return {
    pillar, key: row?.key ?? `otro_${Date.now()}`, label: row?.label ?? custom ?? "Otro", isCustom: !row,
    hasBaseline: false, hasDiagnosis: false, hasHistorical: false, documents: [],
    griStandard: row?.griStandard ?? "", griTitle: row?.griTitle ?? "", indicators: row?.indicators ?? [], sdgs: row?.sdgs ?? [],
    goalText: "", budgetStatus: "no", budgetAmount: null, budgetCurrency: "CLP", budgetPeriod: "total", hrStatus: "no", hrNote: "",
  };
}

type Updater = ChallengeInput[] | ((prev: ChallengeInput[]) => ChallengeInput[]);
export function Step2({ challenges, gri, onChange }: { challenges: ChallengeInput[]; gri: GriRow[]; onChange: (c: Updater) => void }) {
  // Actualizaciones funcionales: varios clics seguidos no se pisan entre sí.
  const toggle = (row: GriRow) => onChange((prev) => (prev.find((c) => c.key === row.key) ? prev.filter((c) => c.key !== row.key) : [...prev, emptyChallenge(row.pillar, row)]));
  const addCustom = (pillar: Pillar) => {
    const label = window.prompt(`Describe el desafío ${PILLAR_LABEL[pillar].toLowerCase()} adicional:`);
    if (label?.trim()) onChange((prev) => [...prev, emptyChallenge(pillar, null, label.trim())]);
  };
  const update = (key: string, patch: Partial<ChallengeInput>) => onChange((prev) => prev.map((c) => (c.key === key ? { ...c, ...patch } : c)));

  return (
    <div className="space-y-8">
      <DevNote>Selecciona uno o más desafíos por pilar. Por <strong>cada desafío</strong> responderás 3 preguntas de diagnóstico y podrás cargar documentos: eso determina cómo el motor redacta tu meta (cuantitativa si hay línea base, o “levantamiento + meta preliminar” si no la hay).</DevNote>
      {(["ambiental", "social", "gobernanza"] as Pillar[]).map((pillar) => {
        const rows = gri.filter((g) => g.pillar === pillar);
        const selected = challenges.filter((c) => c.pillar === pillar);
        const color = PILLAR_COLOR[pillar];
        return (
          <section key={pillar} className="card p-6" style={{ borderLeft: `3px solid ${color}` }}>
            <div className="flex items-center gap-2 mb-4"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} /><h3 className="font-bold text-slate-900">Pilar {PILLAR_LABEL[pillar]}</h3><span className="text-xs text-slate-400 ml-auto">{selected.length} seleccionado(s)</span></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
              {rows.map((r) => {
                const on = !!challenges.find((c) => c.key === r.key);
                return (
                  <button key={r.key} type="button" onClick={() => toggle(r)} className="text-left p-3 rounded-xl text-sm transition-all flex items-start gap-2.5"
                    style={on ? { backgroundColor: `${color}12`, border: `1.5px solid ${color}55` } : { backgroundColor: "#F8FAFC", border: "1.5px solid #E2E8F0" }}>
                    <span className="mt-0.5 w-4 h-4 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: on ? color : "#fff", border: `1.5px solid ${on ? color : "#CBD5E1"}` }}>{on && <CheckCircle2 size={12} className="text-white" />}</span>
                    <span><span className="text-slate-800 font-medium">{r.label}</span><span className="block text-[11px] text-slate-400 mt-0.5">{r.griStandard} · {r.griTitle}</span></span>
                  </button>
                );
              })}
              <button type="button" onClick={() => addCustom(pillar)} className="text-left p-3 rounded-xl text-sm text-slate-500 hover:text-slate-800" style={{ border: "1.5px dashed #CBD5E1" }}>+ Otro (especificar)</button>
            </div>
            {selected.map((c) => <ChallengeDiagnosis key={c.key} c={c} color={color} onChange={(p) => update(c.key, p)} onRemove={() => onChange((prev) => prev.filter((x) => x.key !== c.key))} />)}
          </section>
        );
      })}
    </div>
  );
}

function ChallengeDiagnosis({ c, color, onChange, onRemove }: { c: ChallengeInput; color: string; onChange: (p: Partial<ChallengeInput>) => void; onRemove: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const anyYes = c.hasBaseline || c.hasDiagnosis || c.hasHistorical;
  const [q1, q2, q3] = DIAG_Q[c.pillar];
  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const docs = Array.from(files).filter((f) => /\.(pdf|xlsx?|csv|png|jpe?g)$/i.test(f.name)).map((f) => ({ name: f.name, type: /pdf$/i.test(f.name) ? "pdf" : /xls|csv/i.test(f.name) ? "xls" : "img", size: `${(f.size / 1024 / 1024).toFixed(1)} MB` }));
    onChange({ documents: [...c.documents, ...docs] });
  };
  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3 p-4 rounded-xl" style={{ backgroundColor: "#fff", border: `1px solid ${color}40` }}>
      <div className="flex items-center justify-between mb-3"><p className="text-sm font-semibold text-slate-800">Diagnóstico · {c.label}</p><button onClick={onRemove} className="text-slate-300 hover:text-red-400"><X size={14} /></button></div>
      <div className="space-y-3">
        {[[q1, "hasBaseline"], [q2, "hasDiagnosis"], [q3, "hasHistorical"]].map(([q, k]) => (
          <div key={k} className="flex items-center justify-between gap-4 flex-wrap"><span className="text-sm text-slate-600">{q}</span><YesNo value={c[k as "hasBaseline"] ? "si" : "no"} onChange={(v) => onChange({ [k]: v === "si" })} /></div>
        ))}
      </div>
      {anyYes ? (
        <div className="mt-4">
          <input ref={fileRef} type="file" multiple accept=".pdf,.xls,.xlsx,.csv,.png,.jpg,.jpeg" className="hidden" onChange={(e) => addFiles(e.target.files)} />
          <button type="button" onClick={() => fileRef.current?.click()} className="btn-secondary flex items-center gap-2 text-sm"><Upload size={14} /> Cargar documento(s) de respaldo</button>
          {c.documents.length > 0 && <div className="flex flex-wrap gap-2 mt-2">{c.documents.map((d, i) => <span key={i} className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600"><FileText size={12} />{d.name}<button onClick={() => onChange({ documents: c.documents.filter((_, j) => j !== i) })}><X size={11} /></button></span>)}</div>}
          <p className="text-[11px] text-slate-400 mt-1.5">PDF, Excel o imagen. El motor incorpora estos respaldos al diagnóstico.</p>
        </div>
      ) : (
        <div className="mt-4"><DevNote tone="warn">Sin datos base: el motor marcará este desafío como <em>“{NO_DATA_MSG[c.pillar]}”</em> y propondrá el levantamiento como acción previa dentro del plan.</DevNote></div>
      )}
    </motion.div>
  );
}

/* ── PASO 3 — Metas / GRI / presupuesto / RR.HH. por desafío ────────────── */
export function Step3({ challenges, s, onChange }: { challenges: ChallengeInput[]; s: Strategy; onChange: (c: Updater) => void }) {
  const update = (key: string, patch: Partial<ChallengeInput>) => onChange((prev) => prev.map((c) => (c.key === key ? { ...c, ...patch } : c)));
  const period = s.vigenciaInicio && s.vigenciaFin ? `${s.vigenciaInicio}–${s.vigenciaFin}` : "el período definido";
  return (
    <div className="space-y-5">
      <DevNote>Para cada desafío el sistema muestra el <strong>estándar GRI</strong> vinculado (no lo eliges tú). El motor propondrá una meta SMART para {period} — puedes dejar el campo vacío para que la genere, o escribir la tuya. Indica presupuesto y RR.HH. para que el plan de inversión sea realista.</DevNote>
      {challenges.map((c, i) => {
        const color = PILLAR_COLOR[c.pillar];
        const maturity = c.hasBaseline ? "con línea base" : c.hasDiagnosis || c.hasHistorical ? "con diagnóstico" : "sin datos";
        return (
          <div key={c.key} className="card p-6" style={{ borderLeft: `3px solid ${color}` }}>
            <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
              <div><p className="text-[11px] uppercase tracking-wider font-semibold" style={{ color }}>{PILLAR_LABEL[c.pillar]} · desafío {i + 1} de {challenges.length}</p><h3 className="font-bold text-slate-900 mt-0.5">{c.label}</h3></div>
              <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={maturity === "con línea base" ? { backgroundColor: "#ECFDF5", color: "#059669" } : { backgroundColor: "#FFFBEB", color: "#B45309" }}>{maturity}</span>
            </div>
            <div className="p-3.5 rounded-xl mb-4 flex items-start gap-3" style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
              <span className="text-xs font-bold px-2 py-1 rounded-md flex-shrink-0" style={{ backgroundColor: `${color}18`, color }}>{c.griStandard || "GRI · a definir por el motor"}</span>
              <div className="text-xs text-slate-500">{c.griTitle && <p className="font-medium text-slate-700">{c.griTitle}</p>}{c.indicators.length > 0 && <p className="mt-0.5">Indicadores: {c.indicators.join(" · ")}</p>}{c.sdgs.length > 0 && <p className="mt-0.5">ODS: {c.sdgs.join(", ")}</p>}{c.isCustom && <p className="mt-0.5 italic">Desafío personalizado: el motor propondrá el estándar GRI más cercano.</p>}</div>
            </div>
            <div className="space-y-4">
              <Field label="Meta específica (opcional — el motor la propone en formato SMART)" hint={maturity !== "con línea base" ? "Sin línea base la meta se marcará como preliminar, sujeta a validación con datos." : undefined}>
                <textarea className="input-field min-h-[70px]" value={c.goalText} onChange={(e) => update(c.key, { goalText: e.target.value })} placeholder="Déjalo vacío para que el motor proponga la meta, o escribe la tuya…" />
              </Field>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <Field label="¿Existe presupuesto asignado para esta iniciativa?"><YesNo value={c.budgetStatus} onChange={(v) => update(c.key, { budgetStatus: v as ChallengeInput["budgetStatus"] })} options={[["si", "Sí"], ["no", "No"], ["en_evaluacion", "En evaluación"]]} /></Field>
                  {c.budgetStatus === "si" && (
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      <input className="input-field col-span-1" type="number" min={0} placeholder="Monto" value={c.budgetAmount ?? ""} onChange={(e) => update(c.key, { budgetAmount: e.target.value ? Number(e.target.value) : null })} />
                      <select className="input-field" value={c.budgetCurrency} onChange={(e) => update(c.key, { budgetCurrency: e.target.value as "CLP" | "USD" })}><option>CLP</option><option>USD</option></select>
                      <select className="input-field" value={c.budgetPeriod} onChange={(e) => update(c.key, { budgetPeriod: e.target.value as "anual" | "total" })}><option value="total">Total período</option><option value="anual">Anual</option></select>
                    </div>
                  )}
                </div>
                <div>
                  <Field label="¿Cuentas con recurso humano interno para ejecutar?"><YesNo value={c.hrStatus} onChange={(v) => update(c.key, { hrStatus: v as ChallengeInput["hrStatus"] })} options={[["si", "Sí"], ["parcial", "Parcial"], ["no", "No"]]} /></Field>
                  {c.hrStatus !== "si" && <p className="text-xs text-slate-400 mt-2">El plan sugerirá capacitación, contratación o apoyo de un proveedor del Directorio de Bettersport.</p>}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── PASO 4 — Objetivos estratégicos con priorización ───────────────────── */
export function Step4({ objectives, onChange }: { objectives: string[]; onChange: (o: string[]) => void }) {
  const all = Object.keys(OBJECTIVE_LABEL);
  const toggle = (k: string) => onChange(objectives.includes(k) ? objectives.filter((x) => x !== k) : [...objectives, k]);
  const move = (i: number, d: -1 | 1) => { const n = [...objectives]; const j = i + d; if (j < 0 || j >= n.length) return; [n[i], n[j]] = [n[j], n[i]]; onChange(n); };
  return (
    <div className="space-y-6">
      <DevNote>Selecciona qué busca tu organización con la estrategia y ordénalos por prioridad. Esto define el <strong>“para qué”</strong> y ajusta el énfasis del documento (ej. si priorizas patrocinios, se refuerza el capítulo de valor para marcas).</DevNote>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {all.map((k) => { const on = objectives.includes(k); return (
          <button key={k} type="button" onClick={() => toggle(k)} className="text-left p-3.5 rounded-xl text-sm flex items-start gap-2.5 transition-all" style={on ? { backgroundColor: "#ECFDF5", border: "1.5px solid #6EE7B7" } : { backgroundColor: "#F8FAFC", border: "1.5px solid #E2E8F0" }}>
            <span className="mt-0.5 w-4 h-4 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: on ? "#10B981" : "#fff", border: `1.5px solid ${on ? "#10B981" : "#CBD5E1"}` }}>{on && <CheckCircle2 size={12} className="text-white" />}</span><span className="text-slate-800">{OBJECTIVE_LABEL[k]}</span>
          </button>); })}
      </div>
      {objectives.length > 0 && (
        <div className="card p-5"><p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Prioridad (1 = principal)</p>
          <ol className="space-y-2">{objectives.map((k, i) => (
            <li key={k} className="flex items-center gap-3 p-2.5 rounded-lg" style={{ backgroundColor: "#F8FAFC" }}><span className="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center" style={{ background: i === 0 ? "linear-gradient(135deg, #10B981, #06B6D4)" : "#E2E8F0", color: "#0f172a" }}>{i + 1}</span><span className="text-sm text-slate-700 flex-1">{OBJECTIVE_LABEL[k]}</span>
              <button onClick={() => move(i, -1)} className="btn-ghost p-1"><ArrowUp size={14} /></button><button onClick={() => move(i, 1)} className="btn-ghost p-1"><ArrowDown size={14} /></button></li>))}
          </ol></div>
      )}
    </div>
  );
}

/* ── PASO 5 — Alineación global ─────────────────────────────────────────── */
export function Step5({ s, frameworks, save }: { s: Strategy; frameworks: FrameworkRow[]; save: (p: Record<string, unknown>) => void }) {
  const fw = frameworks.find((f) => f.sport.toLowerCase() === (s.sport || "").toLowerCase()) ?? null;
  return (
    <div className="space-y-6">
      {fw ? (
        <div className="card p-6" style={{ borderLeft: "3px solid #06B6D4" }}>
          <div className="flex items-start gap-3"><div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#ECFEFF" }}><Globe size={18} className="text-cyan-600" /></div>
            <div><p className="text-xs text-slate-400 uppercase tracking-wider">Detectado por tu deporte · {s.sport}</p><h3 className="font-bold text-slate-900 mt-0.5">{fw.organism}</h3><p className="text-sm text-slate-600 mt-1">{fw.framework}</p>{fw.summary && <p className="text-xs text-slate-400 mt-2">{fw.summary}</p>}</div></div>
          <div className="mt-5 p-4 rounded-xl" style={{ backgroundColor: "#F8FAFC" }}>
            <p className="text-sm font-medium text-slate-800 mb-3">¿Quieres que tu estrategia ESG se alinee con los lineamientos de sostenibilidad de {fw.organism}?</p>
            <Toggle on={s.alignGlobal} onChange={(v) => save({ alignGlobal: v, globalBody: v ? fw.organism : null })} label={s.alignGlobal ? "Sí — el documento explicitará qué metas locales se conectan con este marco global" : "No — la estrategia se basará solo en GRI y contexto local"} />
          </div>
        </div>
      ) : (
        <DevNote>{s.sport ? <>Actualmente no contamos con el marco global de <strong>{s.sport}</strong> integrado; tu estrategia se basará en GRI y buenas prácticas internacionales generales.</> : <>Define el deporte en el Paso 1 para detectar el organismo global correspondiente.</>}</DevNote>
      )}
    </div>
  );
}

/* ── PASO 6 — Contexto adicional + revisión ─────────────────────────────── */
export function Step6({ s, save }: { s: Strategy; save: (p: Record<string, unknown>) => void }) {
  return (
    <div className="space-y-6">
      <Field label="Contexto adicional (opcional)" hint="Contexto institucional, proyectos en curso, restricciones presupuestarias, hitos deportivos del período (Mundial, Santiago 2027), relación con otras entidades… Enriquece el análisis pero no bloquea el avance.">
        <textarea className="input-field min-h-[140px]" value={s.additionalContext} onChange={(e) => save({ additionalContext: e.target.value })} placeholder="Escribe aquí cualquier información relevante no cubierta en los pasos anteriores…" />
      </Field>
      <Field label="Frecuencia de revisión de la estrategia" hint="La estrategia es un proceso vivo: define cada cuánto revisarás avances.">
        <YesNo value={s.reviewFrequency} onChange={(v) => save({ reviewFrequency: v })} options={[["trimestral", "Trimestral"], ["semestral", "Semestral"], ["anual", "Anual"]]} />
      </Field>
    </div>
  );
}
