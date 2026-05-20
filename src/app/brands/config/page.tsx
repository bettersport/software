"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Tag, Globe, BarChart3, Users, Tv, FileText, ClipboardList,
  Check, Save, CheckCircle2, AlertCircle,
} from "lucide-react";
import type { BrandConfig, DataSource, SponsorshipObjective, BrandKPI } from "@/lib/types";
import { useUser } from "@/lib/userContext";
import toast from "react-hot-toast";

// ── constants (shared with onboarding) ───────────────────────────────────────

const INDUSTRIES = [
  "Banca y finanzas","Telecomunicaciones","Bebidas y alimentos",
  "Retail y consumo","Tecnología","Seguros","Energía","Automotriz","Otro",
];
const COUNTRIES = ["Argentina","Brasil","Chile","Colombia","México","Perú","Uruguay","Otro"];
const SPONSORSHIP_TYPES = [
  "Torneo / competencia internacional","Liga nacional","Club deportivo",
  "Selección nacional","Atleta individual","Federación deportiva","Evento único",
];
const TERRITORIES = ["Nacional","Regional (Latinoamérica)","Global","Ciudad específica"];
const SPORTS = ["Fútbol","Básquetbol","Tenis","Automovilismo","Atletismo","Rugby","Ciclismo","Natación","Otro"];

const OBJECTIVE_LABELS: Record<SponsorshipObjective, string> = {
  reconocimiento_marca: "Reconocimiento de marca",
  engagement_digital:   "Engagement digital",
  generacion_leads:     "Generación de leads",
  ventas_directas:      "Ventas directas",
  reputacion_esg:       "Reputación / ESG",
  fidelizacion:         "Fidelización de clientes",
  lanzamiento_producto: "Lanzamiento de producto",
  expansion_mercados:   "Expansión a nuevos mercados",
};

const DATA_SOURCES: { id: DataSource; label: string; desc: string; Icon: React.ElementType }[] = [
  { id: "redes_sociales",       label: "Redes sociales",       desc: "Instagram, TikTok, X, YouTube",     Icon: Globe        },
  { id: "web_analytics",        label: "Web analytics",        desc: "Google Analytics, tráfico UTM",      Icon: BarChart3    },
  { id: "crm",                  label: "CRM",                  desc: "HubSpot, Salesforce, etc.",          Icon: Users        },
  { id: "medios_tradicionales", label: "Medios tradicionales", desc: "TV, radio, prensa digital",          Icon: Tv           },
  { id: "datos_evento",         label: "Datos del evento",     desc: "Asistencia, streaming, pantallas",   Icon: ClipboardList },
  { id: "encuestas",            label: "Encuestas",            desc: "Brand lift, NPS pre/post evento",    Icon: FileText     },
];

const DEFAULT_KPIS: BrandKPI[] = [
  { id: "impresiones", name: "Impresiones totales",                category: "visibilidad", badge: "reach",     enabled: true  },
  { id: "alcance",     name: "Alcance único",                      category: "visibilidad", badge: "reach",     enabled: true  },
  { id: "emv",         name: "Valor equivalente de medios (EMV)",  category: "visibilidad", badge: "roi",       enabled: true  },
  { id: "pantalla",    name: "Tiempo en pantalla del logo",        category: "visibilidad", badge: "TV/stream", enabled: false },
  { id: "frecuencia",  name: "Frecuencia promedio de exposición",  category: "visibilidad", badge: "reach",     enabled: false },
  { id: "engagements", name: "Engagements totales",                category: "engagement",  badge: "social",    enabled: true  },
  { id: "er",          name: "Tasa de engagement (ER)",            category: "engagement",  badge: "social",    enabled: true  },
  { id: "sov",         name: "Share of voice entre patrocinadores",category: "engagement",  badge: "medios",    enabled: false },
  { id: "menciones",   name: "Menciones orgánicas de marca",       category: "engagement",  badge: "social",    enabled: false },
  { id: "sentimiento", name: "Sentimiento positivo en menciones",  category: "reputacion",  badge: "NLP",       enabled: true  },
  { id: "brandlift",   name: "Brand lift (encuesta pre/post)",     category: "reputacion",  badge: "encuesta",  enabled: false },
  { id: "asociacion",  name: "Asociación positiva con el deporte", category: "reputacion",  badge: "encuesta",  enabled: false },
  { id: "visitas",     name: "Visitas web atribuidas al patrocinio",category:"conversion",   badge: "analytics", enabled: true  },
  { id: "leads",       name: "Leads generados",                    category: "conversion",  badge: "crm",       enabled: true  },
  { id: "conversiones",name: "Conversiones / ventas atribuidas",   category: "conversion",  badge: "crm",       enabled: false },
  { id: "cpc",         name: "Costo por conversión",               category: "conversion",  badge: "roi",       enabled: false },
  { id: "roi",         name: "ROI total del patrocinio",           category: "conversion",  badge: "roi",       enabled: true  },
];

const KPI_CATEGORY_LABELS = {
  visibilidad: "Visibilidad de marca",
  engagement:  "Engagement digital",
  reputacion:  "Reputación e imagen",
  conversion:  "Conversión y ROI",
};

const EMPTY_CONFIG: BrandConfig = {
  brandName: "", industry: "", country: "", website: "",
  objectives: [], sponsorshipName: "", sponsorshipType: "",
  startDate: "", endDate: "", budget: "", territory: "", sports: [],
  dataSources: [], kpis: DEFAULT_KPIS,
};

const TABS = [
  { id: "perfil",    label: "Perfil de marca"   },
  { id: "patrocinio",label: "Patrocinio"        },
  { id: "fuentes",   label: "Fuentes de datos"  },
  { id: "kpis",      label: "KPIs"              },
];

// ── helpers ───────────────────────────────────────────────────────────────────

function toggle<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
}

function storageKey(userId: string) {
  return `bettersport_brand_config_${userId}`;
}

function completionOf(cfg: BrandConfig) {
  const sections = [
    cfg.brandName && cfg.industry && cfg.country,
    cfg.sponsorshipName && cfg.sponsorshipType,
    cfg.dataSources.length > 0,
    cfg.kpis.some((k) => k.enabled),
  ];
  return sections.filter(Boolean).length;
}

// ── chip component ────────────────────────────────────────────────────────────

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
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
      role="switch"
      aria-checked={on}
    >
      <span
        className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200"
        style={{ transform: on ? "translateX(16px)" : "translateX(0)" }}
      />
    </button>
  );
}

// ── main page ─────────────────────────────────────────────────────────────────

export default function BrandConfigPage() {
  const { activeUser } = useUser();
  const key = storageKey(activeUser.id);

  const [cfg, setCfg] = useState<BrandConfig>(EMPTY_CONFIG);
  const [tab, setTab] = useState("perfil");

  useEffect(() => {
    const stored = localStorage.getItem(key) || localStorage.getItem("bettersport_brand_config");
    if (stored) {
      try { setCfg(JSON.parse(stored)); } catch {}
    }
  }, [key]);

  const set = <K extends keyof BrandConfig>(k: K, v: BrandConfig[K]) =>
    setCfg((c) => ({ ...c, [k]: v }));

  const toggleKPI = (id: string) =>
    setCfg((c) => ({ ...c, kpis: c.kpis.map((k) => k.id === id ? { ...k, enabled: !k.enabled } : k) }));

  const handleSave = () => {
    localStorage.setItem(key, JSON.stringify(cfg));
    localStorage.setItem("bettersport_brand_config", JSON.stringify(cfg));
    toast.success("Configuración guardada correctamente");
  };

  const done = completionOf(cfg);
  const total = TABS.length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-mono tracking-widest uppercase text-teal-600 mb-1">Configuración de marca</p>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Datos de tu patrocinio</h1>
          <p className="text-sm text-slate-400 mt-1">Completa la información para activar tu dashboard de ROI</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Completion badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={done === total
              ? { backgroundColor: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)" }
              : { backgroundColor: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)" }
            }>
            {done === total
              ? <CheckCircle2 size={13} className="text-teal-500" />
              : <AlertCircle size={13} className="text-amber-500" />}
            <span className="text-xs font-semibold"
              style={{ color: done === total ? "#059669" : "#D97706" }}>
              {done}/{total} secciones completas
            </span>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg,#10B981,#06B6D4)" }}
          >
            <Save size={14} /> Guardar
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg,#10B981,#06B6D4)" }}
          animate={{ width: `${(done / total) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={tab === t.id
              ? { backgroundColor: "#fff", color: "#0F172A", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }
              : { color: "#94A3B8" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="card p-8">

        {/* ── PERFIL ── */}
        {tab === "perfil" && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-slate-900">Perfil de la marca</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Nombre de la marca *</label>
                <input className="input-field w-full" placeholder="Ej: Banco Itaú" value={cfg.brandName} onChange={(e) => set("brandName", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Industria *</label>
                <select className="input-field w-full" value={cfg.industry} onChange={(e) => set("industry", e.target.value)}>
                  <option value="">Seleccionar industria...</option>
                  {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">País de operación *</label>
                <select className="input-field w-full" value={cfg.country} onChange={(e) => set("country", e.target.value)}>
                  <option value="">Seleccionar país...</option>
                  {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Sitio web corporativo</label>
                <input className="input-field w-full" placeholder="www.marca.com" value={cfg.website} onChange={(e) => set("website", e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Objetivos del patrocinio</label>
              <p className="text-xs text-slate-400 mb-3">Selecciona todos los que apliquen</p>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(OBJECTIVE_LABELS) as SponsorshipObjective[]).map((obj) => (
                  <Chip key={obj} active={cfg.objectives.includes(obj)} onClick={() => set("objectives", toggle(cfg.objectives, obj))}>
                    {OBJECTIVE_LABELS[obj]}
                  </Chip>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── PATROCINIO ── */}
        {tab === "patrocinio" && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-slate-900">Datos del patrocinio</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Nombre del patrocinio *</label>
                <input className="input-field w-full" placeholder="Ej: Copa Libertadores 2025" value={cfg.sponsorshipName} onChange={(e) => set("sponsorshipName", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Tipo de propiedad *</label>
                <select className="input-field w-full" value={cfg.sponsorshipType} onChange={(e) => set("sponsorshipType", e.target.value)}>
                  <option value="">Seleccionar tipo...</option>
                  {SPONSORSHIP_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Fecha de inicio</label>
                <input className="input-field w-full" placeholder="Ej: Marzo 2025" value={cfg.startDate} onChange={(e) => set("startDate", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Fecha de término</label>
                <input className="input-field w-full" placeholder="Ej: Noviembre 2025" value={cfg.endDate} onChange={(e) => set("endDate", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Inversión total (USD)</label>
                <input className="input-field w-full" placeholder="Ej: 1,250,000" value={cfg.budget} onChange={(e) => set("budget", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Territorio de activación</label>
                <select className="input-field w-full" value={cfg.territory} onChange={(e) => set("territory", e.target.value)}>
                  <option value="">Seleccionar...</option>
                  {TERRITORIES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Deporte(s)</label>
              <div className="flex flex-wrap gap-2">
                {SPORTS.map((s) => (
                  <Chip key={s} active={cfg.sports.includes(s)} onClick={() => set("sports", toggle(cfg.sports, s))}>
                    {s}
                  </Chip>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── FUENTES ── */}
        {tab === "fuentes" && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-slate-900">Fuentes de datos</h2>
            <p className="text-sm text-slate-500">Selecciona los canales que alimentarán los indicadores del dashboard.</p>
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
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={active
                        ? { background: "linear-gradient(135deg,#10B981,#06B6D4)", color: "#fff" }
                        : { backgroundColor: "#F1F5F9", color: "#94A3B8" }
                      }>
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900">{label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                    </div>
                    <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                      style={active ? { background: "#10B981", borderColor: "#10B981" } : { borderColor: "#CBD5E1" }}>
                      {active && <Check size={10} className="text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── KPIS ── */}
        {tab === "kpis" && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-slate-900">KPIs del dashboard</h2>
            <p className="text-sm text-slate-500">Activa los indicadores que quieres visualizar. Puedes cambiarlos en cualquier momento.</p>
            <div className="space-y-6">
              {(["visibilidad","engagement","reputacion","conversion"] as const).map((cat) => (
                <div key={cat}>
                  <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase border-b border-slate-100 pb-2 mb-2">
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
        )}

      </motion.div>

      {/* Save footer */}
      <div className="flex justify-end pb-4">
        <button onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg,#10B981,#059669)", boxShadow: "0 4px 16px rgba(16,185,129,0.25)" }}>
          <Save size={15} /> Guardar configuración
        </button>
      </div>
    </div>
  );
}
