"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, Sparkles, Send, ChevronRight, Download, Save,
  Lightbulb, Target, Map, RefreshCw, CheckCircle, Leaf,
  Globe, Users, BarChart3, Zap,
} from "lucide-react";
import { SectionHeader } from "@/components/ui";
import toast from "react-hot-toast";

interface GeneratedStrategy {
  objectives: string[];
  initiatives: { title: string; priority: "alta" | "media" | "baja"; impact: string; category: string }[];
  roadmap: { phase: string; duration: string; actions: string[] }[];
  summary: string;
}

const clubQualities = ["Profesional", "Amateur"];
const regions = ["Chile", "Argentina", "España", "Colombia", "México", "Perú", "Uruguay", "Otro"];
const challengesByCategory: Record<string, string[]> = {
  Ambiental: ["Reducir huella de carbono", "Gestión eficiente del agua", "Gestión de residuos", "Movilidad sostenible", "Gestión energética"],
  Social: ["Diversidad, Equidad e Inclusión (DEI)", "Educación", "Equidad de género"],
  Gobernanza: ["Gobernanza transparente"],
};
const esgCategoryColors: Record<string, string> = {
  Ambiental: "#10B981",
  Social: "#06B6D4",
  Gobernanza: "#8B5CF6",
};
const interests = ["Patrocinios", "Certificaciones ISO", "Ranking ESG", "Eventos sostenibles", "Comunidad", "Medios"];

const demoStrategy: GeneratedStrategy = {
  summary: "Basado en tu perfil como club mediano de rugby en Chile con enfoque en descarbonización e inclusión, hemos diseñado una estrategia ESG integral para los próximos 18 meses que maximizará tu impacto y posicionamiento en el ranking de sostenibilidad.",
  objectives: [
    "Reducir emisiones de CO2 en un 35% para diciembre 2026",
    "Incorporar 150 personas vulnerables al deporte en 12 meses",
    "Alcanzar certificación ISO 14001 antes de junio 2026",
    "Posicionarse en el Top 3 del ranking nacional de sostenibilidad",
    "Generar $80.000 en patrocinios ESG en el primer año",
  ],
  initiatives: [
    { title: "Instalación de paneles solares en instalaciones", priority: "alta", impact: "Reducción de 18 ton CO2/año", category: "Ambiental" },
    { title: "Programa 'Rugby para Todos' con municipalidad", priority: "alta", impact: "150 jóvenes vulnerables incluidos", category: "Social" },
    { title: "Sistema de captación y reutilización agua lluvia", priority: "media", impact: "Ahorro de 400.000 L/año", category: "Ambiental" },
    { title: "Política de género y equidad en directiva", priority: "alta", impact: "30% participación femenina en cargos", category: "Gobernanza" },
    { title: "Compostaje y reciclaje en canchas y eventos", priority: "media", impact: "Reciclaje del 70% de residuos", category: "Ambiental" },
    { title: "Programa de educación para categorías menores", priority: "baja", impact: "500 niños capacitados/año", category: "Social" },
  ],
  roadmap: [
    {
      phase: "Fase 1 — Fundamentos",
      duration: "Meses 1-3",
      actions: [
        "Diagnóstico ESG completo y línea base",
        "Constitución comité ESG interno",
        "Formulación política ESG oficial",
        "Registro en plataforma BetterSport",
      ],
    },
    {
      phase: "Fase 2 — Ejecución inicial",
      duration: "Meses 4-9",
      actions: [
        "Lanzamiento programa inclusión social",
        "Instalación sistema energía renovable",
        "Primera publicación de evento en marketplace",
        "Inicio proceso certificación ISO 14001",
      ],
    },
    {
      phase: "Fase 3 — Consolidación",
      duration: "Meses 10-18",
      actions: [
        "Obtención certificación ISO 14001",
        "Primer reporte ESG publicado",
        "Ranking nacional Top 5",
        "Renovación de patrocinios ESG",
      ],
    },
  ],
};

const priorityColors: Record<string, string> = {
  alta: "#EF4444",
  media: "#F59E0B",
  baja: "#10B981",
};

const categoryColors: Record<string, string> = {
  Ambiental: "#10B981",
  Social: "#06B6D4",
  Gobernanza: "#8B5CF6",
};

export default function AIStrategyPage() {
  const [step, setStep] = useState<"form" | "generating" | "result">("form");
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>(["Reducir huella de carbono", "Diversidad, Equidad e Inclusión (DEI)"]);
  const [challengeDetails, setChallengeDetails] = useState<Record<string, { goal: string; currentSpend: string; budget: string; timeline: string }>>({
    "Reducir huella de carbono": { goal: "", currentSpend: "", budget: "", timeline: "" },
    "Diversidad, Equidad e Inclusión (DEI)": { goal: "", currentSpend: "", budget: "", timeline: "" },
  });
  const [selectedInterests, setSelectedInterests] = useState<string[]>(["Ranking ESG", "Patrocinios"]);
  const [clubQuality, setClubQuality] = useState(clubQualities[0]);
  const [esgBudget, setEsgBudget] = useState("");
  const [region, setRegion] = useState("Chile");
  const [sport, setSport] = useState("Rugby");
  const [additionalContext, setAdditionalContext] = useState("");
  const [strategy, setStrategy] = useState<GeneratedStrategy | null>(null);
  const [savedVersions, setSavedVersions] = useState<{ id: string; date: string; title: string }[]>([]);

  const toggleChallenge = (c: string) => {
    if (selectedChallenges.includes(c)) {
      setSelectedChallenges((prev) => prev.filter((x) => x !== c));
      setChallengeDetails((prev) => { const next = { ...prev }; delete next[c]; return next; });
    } else {
      setSelectedChallenges((prev) => [...prev, c]);
      setChallengeDetails((prev) => ({ ...prev, [c]: { goal: "", currentSpend: "", budget: "", timeline: "" } }));
    }
  };

  const updateChallengeDetail = (challenge: string, field: string, value: string) => {
    setChallengeDetails((prev) => ({ ...prev, [challenge]: { ...prev[challenge], [field]: value } }));
  };

  const toggleInterest = (i: string) => {
    setSelectedInterests((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );
  };

  const generateStrategy = async () => {
    if (selectedChallenges.length === 0) {
      toast.error("Selecciona al menos un desafío");
      return;
    }
    setStep("generating");
    await new Promise((r) => setTimeout(r, 3000));
    setStrategy(demoStrategy);
    setStep("result");
    toast.success("¡Estrategia ESG generada con IA!");
  };

  const saveVersion = () => {
    const version = {
      id: `v${Date.now()}`,
      date: new Date().toLocaleDateString("es-CL"),
      title: `Estrategia ESG — ${new Date().toLocaleDateString("es-CL")}`,
    };
    setSavedVersions((prev) => [version, ...prev]);
    toast.success("Versión guardada correctamente");
  };

  return (
    <div className="max-w-[1100px] mx-auto space-y-8">
      <SectionHeader
        icon={<Brain size={22} className="text-purple-400" />}
        title="Motor IA — Estrategia ESG"
        subtitle="Genera tu estrategia de sostenibilidad personalizada con inteligencia artificial"
      />

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {["Configurar", "Generar", "Resultado"].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all`}
              style={
                i === 0 && step !== "form" ? { background: "linear-gradient(135deg, #10B981, #06B6D4)", color: "#0f172a" }
                : i === 0 ? { background: "linear-gradient(135deg, #8B5CF6, #06B6D4)", color: "#0f172a" }
                : i === 1 && step === "generating" ? { background: "linear-gradient(135deg, #8B5CF6, #06B6D4)", color: "#0f172a" }
                : i === 1 && step === "result" ? { background: "linear-gradient(135deg, #10B981, #06B6D4)", color: "#0f172a" }
                : i === 2 && step === "result" ? { background: "linear-gradient(135deg, #10B981, #06B6D4)", color: "#0f172a" }
                : { backgroundColor: "#f1f5f9", color: "#94a3b8" }
              }
            >
              {(i === 0 && step !== "form") || (i === 1 && step === "result") ? <CheckCircle size={14} /> : i + 1}
            </div>
            <span className="text-sm text-slate-500">{s}</span>
            {i < 2 && <ChevronRight size={14} className="text-slate-300" />}
          </div>
        ))}
      </div>

      {/* FORM */}
      {step === "form" && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Club info */}
          <div className="card p-8">
            <h3 className="text-base font-semibold text-slate-800 mb-5 flex items-center gap-2.5">
              <Users size={18} className="text-purple-400" />
              Información de tu club
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider block mb-2">Deporte principal</label>
                <input className="input-field" value={sport} onChange={(e) => setSport(e.target.value)} placeholder="Rugby, Fútbol..." />
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider block mb-2">Calidad de club</label>
                <select className="input-field" value={clubQuality} onChange={(e) => setClubQuality(e.target.value)}>
                  {clubQualities.map((q) => <option key={q} value={q} style={{ backgroundColor: "#fff" }}>{q}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider block mb-2">Región / País</label>
                <select className="input-field" value={region} onChange={(e) => setRegion(e.target.value)}>
                  {regions.map((r) => <option key={r} value={r} style={{ backgroundColor: "#fff" }}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider block mb-2">Presupuesto asignado a ESG</label>
                <input className="input-field" type="number" value={esgBudget} onChange={(e) => setEsgBudget(e.target.value)} placeholder="$ 0" />
              </div>
            </div>
          </div>

          {/* Challenges — grouped by ESG category */}
          <div className="card p-8">
            <h3 className="text-base font-semibold text-slate-800 mb-6 flex items-center gap-2.5">
              <Target size={18} className="text-teal-600" />
              Desafíos ESG que quieres abordar
              <span className="badge badge-green">{selectedChallenges.length} seleccionados</span>
            </h3>
            <div className="space-y-5">
              {Object.entries(challengesByCategory).map(([category, items]) => (
                <div key={category}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: esgCategoryColors[category] }} />
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: esgCategoryColors[category] }}>{category}</span>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {items.map((c) => (
                      <button
                        key={c}
                        onClick={() => toggleChallenge(c)}
                        className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                        style={selectedChallenges.includes(c)
                          ? { backgroundColor: esgCategoryColors[category] + "20", border: `1.5px solid ${esgCategoryColors[category]}`, color: esgCategoryColors[category], boxShadow: `0 0 10px ${esgCategoryColors[category]}30` }
                          : { backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", color: "#64748b" }
                        }
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Challenge detail panels */}
          {selectedChallenges.length > 0 && (
            <div className="card p-8">
              <h3 className="text-base font-semibold text-slate-800 mb-5 flex items-center gap-2.5">
                <Lightbulb size={18} className="text-amber-400" />
                Detalle por desafío seleccionado
              </h3>
              <div className="space-y-5">
                {selectedChallenges.map((challenge) => {
                  const categoryEntry = Object.entries(challengesByCategory).find(([, items]) => items.includes(challenge));
                  const color = categoryEntry ? esgCategoryColors[categoryEntry[0]] : "#10B981";
                  const detail = challengeDetails[challenge] ?? { goal: "", currentSpend: "", budget: "", timeline: "" };
                  return (
                    <motion.div
                      key={challenge}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 rounded-2xl"
                      style={{ backgroundColor: color + "08", border: `1px solid ${color}25` }}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                        <p className="text-sm font-semibold text-slate-800">{challenge}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-slate-400 uppercase tracking-wider block mb-1.5">Meta principal</label>
                          <input
                            className="input-field"
                            placeholder="¿Qué quieres lograr?"
                            value={detail.goal}
                            onChange={(e) => updateChallengeDetail(challenge, "goal", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-400 uppercase tracking-wider block mb-1.5">Gasto actual</label>
                          <input
                            className="input-field"
                            placeholder="$ 0"
                            type="number"
                            value={detail.currentSpend}
                            onChange={(e) => updateChallengeDetail(challenge, "currentSpend", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-400 uppercase tracking-wider block mb-1.5">Presupuesto asignado</label>
                          <input
                            className="input-field"
                            placeholder="$ 0"
                            type="number"
                            value={detail.budget}
                            onChange={(e) => updateChallengeDetail(challenge, "budget", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-400 uppercase tracking-wider block mb-1.5">Tiempo estimado</label>
                          <input
                            className="input-field"
                            placeholder="ej. 6 meses, 1 año..."
                            value={detail.timeline}
                            onChange={(e) => updateChallengeDetail(challenge, "timeline", e.target.value)}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Interests */}
          <div className="card p-8">
            <h3 className="text-base font-semibold text-slate-800 mb-5 flex items-center gap-2.5">
              <Lightbulb size={18} className="text-amber-400" />
              Objetivos e intereses estratégicos
            </h3>
            <div className="flex flex-wrap gap-3">
              {interests.map((i) => (
                <button
                  key={i}
                  onClick={() => toggleInterest(i)}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                  style={selectedInterests.includes(i)
                    ? { backgroundColor: "rgba(245,158,11,0.2)", border: "1px solid rgba(245,158,11,0.4)", color: "#F59E0B" }
                    : { backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", color: "#64748b" }
                  }
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          {/* Additional context */}
          <div className="card p-8">
            <h3 className="text-base font-semibold text-slate-800 mb-5 flex items-center gap-2.5">
              <Globe size={18} className="text-blue-400" />
              Contexto adicional (opcional)
            </h3>
            <textarea
              className="input-field resize-none"
              rows={4}
              placeholder="Cuéntale a la IA sobre el contexto de tu club, desafíos específicos, recursos disponibles, alianzas estratégicas..."
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
            />
          </div>

          <button
            onClick={generateStrategy}
            className="w-full h-14 rounded-2xl font-bold text-white flex items-center justify-center gap-3 text-base transition-all hover:scale-[1.01]"
            style={{ background: "linear-gradient(135deg, #10B981, #06B6D4)", boxShadow: "0 4px 20px rgba(16,185,129,0.3)" }}
          >
            <Brain size={22} />
            Generar estrategia ESG con IA
            <Sparkles size={18} className="text-yellow-300" />
          </button>
        </motion.div>
      )}

      {/* GENERATING */}
      {step === "generating" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card p-16 text-center"
        >
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: "#8B5CF6" }} />
            <div className="relative w-24 h-24 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #8B5CF6, #06B6D4)" }}>
              <Brain size={40} className="text-slate-900" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-3">
            Analizando tu perfil ESG...
          </h3>
          <p className="text-slate-400 text-base mb-8 max-w-md mx-auto">
            La IA está procesando tus desafíos, contexto y objetivos para generar una estrategia personalizada
          </p>
          <div className="flex justify-center gap-8">
            {[
              { label: "Analizando contexto", icon: <Globe size={16} /> },
              { label: "Generando objetivos", icon: <Target size={16} /> },
              { label: "Creando roadmap", icon: <Map size={16} /> },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.8 }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(139,92,246,0.2)", color: "#8B5CF6" }}>
                  {item.icon}
                </div>
                <p className="text-xs text-slate-400">{item.label}</p>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, delay: i * 0.8 }}
                  className="h-0.5 rounded-full"
                  style={{ background: "linear-gradient(90deg, #8B5CF6, #06B6D4)" }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* RESULT */}
      {step === "result" && strategy && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Header actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ backgroundColor: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.25)" }}>
              <Sparkles size={14} className="text-purple-400" />
              <span className="text-sm text-purple-300 font-medium">Generado por IA · {new Date().toLocaleDateString("es-CL")}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStep("form")} className="btn-ghost gap-2">
                <RefreshCw size={15} /> Regenerar
              </button>
              <button onClick={saveVersion} className="btn-secondary gap-2">
                <Save size={15} /> Guardar versión
              </button>
              <button onClick={() => toast.success("Exportando estrategia ESG...")} className="btn-primary gap-2">
                <Download size={15} /> Exportar PDF
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="card p-8" style={{ borderColor: "rgba(139,92,246,0.3)" }}>
            <div className="flex items-center gap-2.5 mb-4">
              <Brain size={20} className="text-purple-400" />
              <h3 className="text-base font-semibold text-slate-900">Resumen ejecutivo</h3>
            </div>
            <p className="text-slate-600 text-[15px] leading-relaxed">{strategy.summary}</p>
          </div>

          {/* Objectives */}
          <div className="card p-8">
            <h3 className="text-base font-semibold text-slate-800 mb-5 flex items-center gap-2.5">
              <Target size={18} className="text-teal-600" />
              Objetivos estratégicos ESG
            </h3>
            <div className="space-y-4">
              {strategy.objectives.map((obj, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-xl"
                  style={{ backgroundColor: "rgba(6,182,212,0.06)", border: "1px solid rgba(6,182,212,0.15)" }}
                >
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: "linear-gradient(135deg, #10B981, #06B6D4)", color: "#0f172a" }}>
                    {i + 1}
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">{obj}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Initiatives */}
          <div className="card p-8">
            <h3 className="text-base font-semibold text-slate-800 mb-5 flex items-center gap-2.5">
              <Lightbulb size={18} className="text-amber-400" />
              Iniciativas prioritarias
            </h3>
            <div className="space-y-4">
              {strategy.initiatives.map((init, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-4 p-5 rounded-xl"
                  style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-slate-900">{init.title}</p>
                      <span className="badge text-xs" style={{ backgroundColor: priorityColors[init.priority] + "20", color: priorityColors[init.priority], border: `1px solid ${priorityColors[init.priority]}30` }}>
                        {init.priority}
                      </span>
                      <span className="badge text-xs" style={{ backgroundColor: categoryColors[init.category] + "20", color: categoryColors[init.category], border: `1px solid ${categoryColors[init.category]}30` }}>
                        {init.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{init.impact}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Roadmap */}
          <div className="card p-8">
            <h3 className="text-base font-semibold text-slate-800 mb-6 flex items-center gap-2.5">
              <Map size={18} className="text-teal-600" />
              Roadmap estratégico 18 meses
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {strategy.roadmap.map((phase, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="p-5 rounded-xl relative overflow-hidden"
                  style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-0.5"
                    style={{ background: `linear-gradient(90deg, ${["#10B981", "#06B6D4", "#8B5CF6"][i]}, transparent)` }}
                  />
                  <p className="text-sm font-bold text-slate-800 mb-1">{phase.phase}</p>
                  <span className="badge text-xs mb-3 block" style={{ backgroundColor: ["rgba(16,185,129,0.15)", "rgba(6,182,212,0.15)", "rgba(139,92,246,0.15)"][i], color: ["#10B981", "#06B6D4", "#8B5CF6"][i], display: "inline-flex", border: `1px solid ${["rgba(16,185,129,0.25)", "rgba(6,182,212,0.25)", "rgba(139,92,246,0.25)"][i]}` }}>
                    {phase.duration}
                  </span>
                  <ul className="space-y-1.5">
                    {phase.actions.map((action, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs text-slate-500">
                        <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: ["#10B981", "#06B6D4", "#8B5CF6"][i] }} />
                        {action}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Saved versions */}
          {savedVersions.length > 0 && (
            <div className="card p-5">
              <h3 className="font-semibold text-slate-800 text-sm mb-3 flex items-center gap-2">
                <Save size={15} className="text-slate-400" />
                Versiones guardadas
              </h3>
              <div className="space-y-2">
                {savedVersions.map((v) => (
                  <div key={v.id} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: "#f8fafc" }}>
                    <div>
                      <p className="text-sm text-slate-700">{v.title}</p>
                      <p className="text-xs text-slate-400">{v.date}</p>
                    </div>
                    <button className="btn-ghost text-xs">Cargar</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
