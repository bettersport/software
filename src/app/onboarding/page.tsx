"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Globe,
  BarChart3,
  Users,
  Tv,
  FileText,
  ClipboardList,
  CheckCircle2,
} from "lucide-react";
import type { BrandConfig, DataSource, SponsorshipObjective, BrandKPI } from "@/lib/types";
import { apiSend } from "@/lib/useResource";

// ── constants ────────────────────────────────────────────────────────────────

const STEPS = [
  { label: "Perfil de marca",   sub: "Datos del patrocinador" },
  { label: "Patrocinio",        sub: "Evento o club deportivo" },
  { label: "Fuentes de datos",  sub: "Canales a conectar" },
  { label: "KPIs del dashboard",sub: "Indicadores a medir" },
  { label: "Revisión",          sub: "Confirmar y activar" },
];

const INDUSTRIES = [
  "Banca y finanzas", "Telecomunicaciones", "Bebidas y alimentos",
  "Retail y consumo", "Tecnología", "Seguros", "Energía", "Automotriz", "Otro",
];

const COUNTRIES = [
  "Argentina", "Brasil", "Chile", "Colombia", "México", "Perú", "Uruguay", "Otro",
];

const SPONSORSHIP_TYPES = [
  "Torneo / competencia internacional", "Liga nacional", "Club deportivo",
  "Selección nacional", "Atleta individual", "Federación deportiva", "Evento único",
];

const TERRITORIES = ["Nacional", "Regional (Latinoamérica)", "Global", "Ciudad específica"];

const OBJECTIVE_LABELS: Record<SponsorshipObjective, string> = {
  reconocimiento_marca:  "Reconocimiento de marca",
  engagement_digital:    "Engagement digital",
  generacion_leads:      "Generación de leads",
  ventas_directas:       "Ventas directas",
  reputacion_esg:        "Reputación / ESG",
  fidelizacion:          "Fidelización de clientes",
  lanzamiento_producto:  "Lanzamiento de producto",
  expansion_mercados:    "Expansión a nuevos mercados",
};

const SPORTS = ["Fútbol", "Básquetbol", "Tenis", "Automovilismo", "Atletismo", "Rugby", "Ciclismo", "Natación", "Otro"];

const DATA_SOURCES: { id: DataSource; label: string; desc: string; Icon: React.ElementType }[] = [
  { id: "redes_sociales",      label: "Redes sociales",       desc: "Instagram, TikTok, X, YouTube",         Icon: Globe },
  { id: "web_analytics",       label: "Web analytics",        desc: "Google Analytics, tráfico UTM",          Icon: BarChart3 },
  { id: "crm",                 label: "CRM",                  desc: "HubSpot, Salesforce, etc.",             Icon: Users },
  { id: "medios_tradicionales",label: "Medios tradicionales", desc: "TV, radio, prensa digital",             Icon: Tv },
  { id: "datos_evento",        label: "Datos del evento",     desc: "Asistencia, streaming, pantallas",      Icon: ClipboardList },
  { id: "encuestas",           label: "Encuestas",            desc: "Brand lift, NPS pre/post evento",       Icon: FileText },
];

const DEFAULT_KPIS: BrandKPI[] = [
  { id: "impresiones",     name: "Impresiones totales",               category: "visibilidad",  badge: "reach",     enabled: true  },
  { id: "alcance",         name: "Alcance único",                     category: "visibilidad",  badge: "reach",     enabled: true  },
  { id: "emv",             name: "Valor equivalente de medios (EMV)", category: "visibilidad",  badge: "roi",       enabled: true  },
  { id: "pantalla",        name: "Tiempo en pantalla del logo",       category: "visibilidad",  badge: "TV/stream", enabled: false },
  { id: "frecuencia",      name: "Frecuencia promedio de exposición", category: "visibilidad",  badge: "reach",     enabled: false },
  { id: "engagements",     name: "Engagements totales",               category: "engagement",   badge: "social",    enabled: true  },
  { id: "er",              name: "Tasa de engagement (ER)",           category: "engagement",   badge: "social",    enabled: true  },
  { id: "sov",             name: "Share of voice entre patrocinadores",category:"engagement",   badge: "medios",    enabled: false },
  { id: "menciones",       name: "Menciones orgánicas de marca",      category: "engagement",   badge: "social",    enabled: false },
  { id: "sentimiento",     name: "Sentimiento positivo en menciones", category: "reputacion",   badge: "NLP",       enabled: true  },
  { id: "brandlift",       name: "Brand lift (encuesta pre/post)",    category: "reputacion",   badge: "encuesta",  enabled: false },
  { id: "asociacion",      name: "Asociación positiva con el deporte",category: "reputacion",   badge: "encuesta",  enabled: false },
  { id: "visitas",         name: "Visitas web atribuidas al patrocinio",category:"conversion",  badge: "analytics", enabled: true  },
  { id: "leads",           name: "Leads generados",                   category: "conversion",   badge: "crm",       enabled: true  },
  { id: "conversiones",    name: "Conversiones / ventas atribuidas",  category: "conversion",   badge: "crm",       enabled: false },
  { id: "cpc",             name: "Costo por conversión",              category: "conversion",   badge: "roi",       enabled: false },
  { id: "roi",             name: "ROI total del patrocinio",          category: "conversion",   badge: "roi",       enabled: true  },
];

const KPI_CATEGORY_LABELS = {
  visibilidad: "Visibilidad de marca",
  engagement:  "Engagement digital",
  reputacion:  "Reputación e imagen",
  conversion:  "Conversión y ROI",
};

const EMPTY_CONFIG: BrandConfig = {
  brandName: "", industry: "", country: "", website: "",
  objectives: [],
  sponsorshipName: "", sponsorshipType: "", startDate: "", endDate: "",
  budget: "", territory: "", sports: [],
  dataSources: [],
  kpis: DEFAULT_KPIS,
};

// ── helpers ──────────────────────────────────────────────────────────────────

function toggle<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
}

// ── sub-components ───────────────────────────────────────────────────────────

function Tag({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
      style={active
        ? { background: "rgba(16,185,129,0.12)", borderColor: "rgba(16,185,129,0.4)", color: "#059669" }
        : { backgroundColor: "#fff", borderColor: "#E2E8F0", color: "#64748B" }
      }
    >
      {children}
    </button>
  );
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="relative flex-shrink-0 w-9 h-5 rounded-full transition-colors duration-200"
      style={{ backgroundColor: on ? "#10B981" : "#CBD5E1" }}
      aria-checked={on}
      role="switch"
    >
      <span
        className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200"
        style={{ transform: on ? "translateX(16px)" : "translateX(0)" }}
      />
    </button>
  );
}

// ── main component ───────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [cfg, setCfg] = useState<BrandConfig>(EMPTY_CONFIG);

  const set = <K extends keyof BrandConfig>(key: K, val: BrandConfig[K]) =>
    setCfg((c) => ({ ...c, [key]: val }));

  const toggleKPI = (id: string) =>
    setCfg((c) => ({
      ...c,
      kpis: c.kpis.map((k) => (k.id === id ? { ...k, enabled: !k.enabled } : k)),
    }));

  const finish = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      await apiSend("/api/brand-config", "PUT", cfg);
      setDone(true);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "No se pudo guardar la configuración");
    } finally {
      setSaving(false);
    }
  };

  const goToDashboard = () => router.push("/dashboard");
  const goToSources = () => router.push("/brands/config");

  if (done) return <SuccessScreen onGo={goToDashboard} onSources={goToSources} />;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#F8FAFC" }}>
      {/* Top nav */}
      <nav className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-50">
        <img src="/logo.svg" alt="BetterSport" className="h-8 w-auto object-contain" />
        <span className="text-xs text-slate-400 font-mono">paso {step + 1} / {STEPS.length}</span>
      </nav>

      {/* Progress bar */}
      <div className="h-0.5 bg-slate-100 sticky top-14 z-40">
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${((step + 1) / STEPS.length) * 100}%`, background: "linear-gradient(90deg, #10B981, #06B6D4)" }}
        />
      </div>

      {/* Shell */}
      <div className="flex flex-1 max-w-5xl mx-auto w-full">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 bg-white px-5 py-8 gap-1">
          <p className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase mb-4 px-3">Configuración</p>
          {STEPS.map((s, i) => {
            const isDone   = i < step;
            const isActive = i === step;
            return (
              <div key={i}>
                <button
                  onClick={() => { if (i <= step) setStep(i); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors"
                  style={isActive ? { backgroundColor: "rgba(16,185,129,0.08)" } : isDone ? {} : {}}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold border transition-all"
                    style={
                      isDone
                        ? { background: "#10B981", borderColor: "#10B981", color: "#fff" }
                        : isActive
                        ? { background: "#0F172A", borderColor: "#0F172A", color: "#fff" }
                        : { background: "#fff", borderColor: "#CBD5E1", color: "#94A3B8" }
                    }
                  >
                    {isDone ? <Check size={12} /> : i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: isActive ? "#059669" : isDone ? "#0F172A" : "#94A3B8" }}>{s.label}</p>
                    <p className="text-[11px] text-slate-400">{s.sub}</p>
                  </div>
                </button>
                {i < STEPS.length - 1 && (
                  <div className="w-px h-3 bg-slate-200 ml-[26px] my-0.5" />
                )}
              </div>
            );
          })}
        </aside>

        {/* Main */}
        <main className="flex-1 px-8 py-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              {step === 0 && <Step1 cfg={cfg} set={set} />}
              {step === 1 && <Step2 cfg={cfg} set={set} />}
              {step === 2 && <Step3 cfg={cfg} set={set} />}
              {step === 3 && <Step4 cfg={cfg} toggleKPI={toggleKPI} />}
              {step === 4 && <Step5 cfg={cfg} onEdit={(s) => setStep(s)} />}
            </motion.div>
          </AnimatePresence>

          {/* Actions */}
          <div className="flex justify-between items-center mt-10 pt-6 border-t border-slate-100">
            {step > 0 ? (
              <button className="btn-secondary gap-2" onClick={() => setStep((s) => s - 1)}>
                <ArrowLeft size={14} /> Atrás
              </button>
            ) : <span />}

            {step < STEPS.length - 1 ? (
              <button
                className="h-10 px-5 rounded-xl font-semibold text-white flex items-center gap-2 text-sm"
                style={{ background: "linear-gradient(135deg, #10B981, #06B6D4)" }}
                onClick={() => setStep((s) => s + 1)}
              >
                Continuar <ArrowRight size={14} />
              </button>
            ) : (
              <div className="flex flex-col items-end gap-2">
                {saveError && (
                  <div className="flex items-center gap-3 text-xs px-3 py-2 rounded-lg" style={{ backgroundColor: "rgba(239,68,68,0.08)", color: "#B91C1C", border: "1px solid rgba(239,68,68,0.25)" }}>
                    <span>{saveError}</span>
                    <button onClick={finish} disabled={saving} className="font-semibold underline disabled:opacity-50">Reintentar</button>
                  </div>
                )}
                <button
                  className="h-10 px-5 rounded-xl font-semibold text-white flex items-center gap-2 text-sm disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, #10B981, #059669)", boxShadow: "0 4px 16px rgba(16,185,129,0.3)" }}
                  onClick={finish}
                  disabled={saving}
                >
                  {saving ? "Guardando…" : "Activar dashboard"} <CheckCircle2 size={14} />
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

// ── Step 1: Brand profile ────────────────────────────────────────────────────

function Step1({ cfg, set }: { cfg: BrandConfig; set: <K extends keyof BrandConfig>(k: K, v: BrandConfig[K]) => void }) {
  return (
    <div>
      <p className="text-xs font-mono text-teal-500 mb-2 tracking-wide">paso 01 — perfil</p>
      <h2 className="text-2xl font-bold text-slate-900 mb-1 tracking-tight">¿Quién es el patrocinador?</h2>
      <p className="text-sm text-slate-500 mb-8">Registra los datos básicos de la marca que realiza la inversión en patrocinio deportivo.</p>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1.5">Nombre de la marca</label>
          <input className="input-field" placeholder="Ej: Banco Itaú" value={cfg.brandName} onChange={(e) => set("brandName", e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1.5">Industria</label>
          <select className="input-field" value={cfg.industry} onChange={(e) => set("industry", e.target.value)}>
            <option value="">Seleccionar industria...</option>
            {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1.5">País de operación</label>
          <select className="input-field" value={cfg.country} onChange={(e) => set("country", e.target.value)}>
            <option value="">Seleccionar país...</option>
            {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1.5">Sitio web corporativo</label>
          <input className="input-field" placeholder="www.marca.com" value={cfg.website} onChange={(e) => set("website", e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1.5">Objetivos principales del patrocinio</label>
          <p className="text-xs text-slate-400 mb-2">Selecciona todos los que apliquen</p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(OBJECTIVE_LABELS) as SponsorshipObjective[]).map((obj) => (
              <Tag
                key={obj}
                active={cfg.objectives.includes(obj)}
                onClick={() => set("objectives", toggle(cfg.objectives, obj))}
              >
                {OBJECTIVE_LABELS[obj]}
              </Tag>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Step 2: Sponsorship details ──────────────────────────────────────────────

function Step2({ cfg, set }: { cfg: BrandConfig; set: <K extends keyof BrandConfig>(k: K, v: BrandConfig[K]) => void }) {
  return (
    <div>
      <p className="text-xs font-mono text-teal-500 mb-2 tracking-wide">paso 02 — patrocinio</p>
      <h2 className="text-2xl font-bold text-slate-900 mb-1 tracking-tight">¿Qué están patrocinando?</h2>
      <p className="text-sm text-slate-500 mb-8">Define el evento, club o propiedad deportiva que es objeto de esta inversión.</p>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1.5">Nombre del patrocinio</label>
          <input className="input-field" placeholder="Ej: Copa Libertadores 2025" value={cfg.sponsorshipName} onChange={(e) => set("sponsorshipName", e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1.5">Tipo de propiedad deportiva</label>
          <select className="input-field" value={cfg.sponsorshipType} onChange={(e) => set("sponsorshipType", e.target.value)}>
            <option value="">Seleccionar tipo...</option>
            {SPONSORSHIP_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1.5">Fecha de inicio</label>
          <input className="input-field" placeholder="Ej: Marzo 2025" value={cfg.startDate} onChange={(e) => set("startDate", e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1.5">Fecha de término</label>
          <input className="input-field" placeholder="Ej: Noviembre 2025" value={cfg.endDate} onChange={(e) => set("endDate", e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1.5">Inversión total (USD)</label>
          <input className="input-field" placeholder="Ej: 1,250,000" value={cfg.budget} onChange={(e) => set("budget", e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1.5">Territorio de activación</label>
          <select className="input-field" value={cfg.territory} onChange={(e) => set("territory", e.target.value)}>
            <option value="">Seleccionar...</option>
            {TERRITORIES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="col-span-2">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1.5">Deporte</label>
          <div className="flex flex-wrap gap-2">
            {SPORTS.map((s) => (
              <Tag key={s} active={cfg.sports.includes(s)} onClick={() => set("sports", toggle(cfg.sports, s))}>
                {s}
              </Tag>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Step 3: Data sources ─────────────────────────────────────────────────────

function Step3({ cfg, set }: { cfg: BrandConfig; set: <K extends keyof BrandConfig>(k: K, v: BrandConfig[K]) => void }) {
  return (
    <div>
      <p className="text-xs font-mono text-teal-500 mb-2 tracking-wide">paso 03 — fuentes de datos</p>
      <h2 className="text-2xl font-bold text-slate-900 mb-1 tracking-tight">¿De dónde medimos el impacto?</h2>
      <p className="text-sm text-slate-500 mb-8">Conecta las fuentes que alimentarán los indicadores del dashboard. Puedes agregar más fuentes después.</p>

      <div className="grid grid-cols-2 gap-3">
        {DATA_SOURCES.map(({ id, label, desc, Icon }) => {
          const active = cfg.dataSources.includes(id);
          return (
            <button
              key={id}
              onClick={() => set("dataSources", toggle(cfg.dataSources, id) as DataSource[])}
              className="flex items-center gap-4 p-4 rounded-2xl border text-left transition-all"
              style={active
                ? { backgroundColor: "rgba(16,185,129,0.08)", borderColor: "rgba(16,185,129,0.35)" }
                : { backgroundColor: "#fff", borderColor: "#E2E8F0" }
              }
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
                style={active ? { background: "linear-gradient(135deg, #10B981, #06B6D4)", color: "#fff" } : { backgroundColor: "#F1F5F9", color: "#94A3B8" }}
              >
                <Icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900">{label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
              </div>
              <div
                className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                style={active ? { background: "#10B981", borderColor: "#10B981" } : { borderColor: "#CBD5E1" }}
              >
                {active && <Check size={10} className="text-white" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Step 4: KPIs ─────────────────────────────────────────────────────────────

function Step4({ cfg, toggleKPI }: { cfg: BrandConfig; toggleKPI: (id: string) => void }) {
  const categories = ["visibilidad", "engagement", "reputacion", "conversion"] as const;
  return (
    <div>
      <p className="text-xs font-mono text-teal-500 mb-2 tracking-wide">paso 04 — KPIs</p>
      <h2 className="text-2xl font-bold text-slate-900 mb-1 tracking-tight">Configura tu dashboard</h2>
      <p className="text-sm text-slate-500 mb-8">Activa los indicadores que quieres visualizar. Puedes cambiarlos en cualquier momento.</p>

      <div className="space-y-6">
        {categories.map((cat) => (
          <div key={cat}>
            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase border-b border-slate-100 pb-2 mb-1">
              {KPI_CATEGORY_LABELS[cat]}
            </p>
            {cfg.kpis.filter((k) => k.category === cat).map((kpi) => (
              <div key={kpi.id} className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0">
                <span className="flex-1 text-sm text-slate-700">{kpi.name}</span>
                <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-2 py-0.5 rounded">{kpi.badge}</span>
                <Toggle on={kpi.enabled} onClick={() => toggleKPI(kpi.id)} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Step 5: Review ───────────────────────────────────────────────────────────

function Step5({ cfg, onEdit }: { cfg: BrandConfig; onEdit: (step: number) => void }) {
  const activeKPIs = cfg.kpis.filter((k) => k.enabled).length;
  const sourceLabels = cfg.dataSources.map((ds) => DATA_SOURCES.find((s) => s.id === ds)?.label ?? ds);

  const ReviewCard = ({ title, step, rows }: { title: string; step: number; rows: [string, string][] }) => (
    <div className="card mb-4 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
        <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">{title}</span>
        <button onClick={() => onEdit(step)} className="text-xs text-teal-600 hover:text-teal-500 font-medium">Editar</button>
      </div>
      {rows.map(([key, val]) => (
        <div key={key} className="flex justify-between items-center px-4 py-2.5 border-b border-slate-50 last:border-0 text-sm">
          <span className="text-slate-500">{key}</span>
          <span className="text-slate-900 font-medium text-right max-w-[55%]">{val || "—"}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <p className="text-xs font-mono text-teal-500 mb-2 tracking-wide">paso 05 — revisión</p>
      <h2 className="text-2xl font-bold text-slate-900 mb-1 tracking-tight">Todo listo para activar</h2>
      <p className="text-sm text-slate-500 mb-8">Revisa la configuración antes de activar tu dashboard de ROI.</p>

      <ReviewCard
        title="Perfil de marca"
        step={0}
        rows={[
          ["Marca",      cfg.brandName],
          ["Industria",  cfg.industry],
          ["País",       cfg.country],
          ["Objetivos",  cfg.objectives.map((o) => OBJECTIVE_LABELS[o]).join(", ") || "—"],
        ]}
      />
      <ReviewCard
        title="Patrocinio"
        step={1}
        rows={[
          ["Nombre",    cfg.sponsorshipName],
          ["Tipo",      cfg.sponsorshipType],
          ["Período",   cfg.startDate && cfg.endDate ? `${cfg.startDate} – ${cfg.endDate}` : cfg.startDate || cfg.endDate],
          ["Inversión", cfg.budget ? `USD ${cfg.budget}` : ""],
          ["Deportes",  cfg.sports.join(", ")],
        ]}
      />
      <ReviewCard
        title="Fuentes y KPIs"
        step={2}
        rows={[
          ["Fuentes",          sourceLabels.join(", ") || "Ninguna"],
          ["KPIs activos",     `${activeKPIs} indicadores`],
        ]}
      />
    </div>
  );
}

// ── Success ──────────────────────────────────────────────────────────────────

function SuccessScreen({ onGo, onSources }: { onGo: () => void; onSources: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F8FAFC" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md px-8"
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: "rgba(16,185,129,0.12)" }}
        >
          <CheckCircle2 size={36} className="text-teal-500" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">¡Dashboard activado!</h2>
        <p className="text-slate-500 leading-relaxed mb-8">
          Tu configuración quedó guardada. Conecta tus fuentes desde Configuración para empezar a recibir datos.
        </p>
        <div className="grid grid-cols-2 gap-3 mb-8">
          {[
            { icon: "📊", label: "Ver dashboard",   sub: "Revisa tu panel de patrocinio", onClick: onGo },
            { icon: "🔌", label: "Agregar fuentes",  sub: "Configura tus canales", onClick: onSources },
          ].map((c) => (
            <button key={c.label} type="button" onClick={c.onClick} className="card p-4 text-left card-hover cursor-pointer">
              <div className="text-2xl mb-2">{c.icon}</div>
              <p className="text-sm font-semibold text-slate-900">{c.label}</p>
              <p className="text-xs text-slate-400 mt-1">{c.sub}</p>
            </button>
          ))}
        </div>
        <button
          onClick={onGo}
          className="w-full h-12 rounded-2xl font-semibold text-white flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg, #10B981, #06B6D4)", boxShadow: "0 4px 20px rgba(16,185,129,0.3)" }}
        >
          Ir al dashboard <ArrowRight size={16} />
        </button>
      </motion.div>
    </div>
  );
}
