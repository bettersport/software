"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Brain, ChevronLeft, ChevronRight, Sparkles, Save, CheckCircle, Lock } from "lucide-react";
import { SectionHeader } from "@/components/ui";
import toast from "react-hot-toast";
import type { ChallengeInput } from "@/lib/strategy/types";
import { useStrategy } from "./_components/useStrategy";
import { Welcome } from "./_components/Welcome";
import { BetterAgent } from "./_components/BetterAgent";
import { StrategyDoc } from "./_components/StrategyDoc";
import { Step1, Step2, Step3, Step4, Step5, Step6 } from "./_components/Steps";

const STEP_TITLES = [
  "", "Datos generales y período de vigencia", "Selección de desafíos ESG", "Metas, GRI, presupuesto y RR.HH.",
  "Objetivos e intereses estratégicos", "Alineación con lineamientos globales", "Contexto adicional",
];
const CAN_MANAGE = ["club", "admin", "manager"];

type View = "welcome" | "wizard" | "generating" | "doc";

export default function AIStrategyPage() {
  const { activeUser, loaded, loading, saving, strategy, config, create, save, generate, materialize } = useStrategy();
  const [view, setView] = useState<View>("welcome");
  const [step, setStep] = useState(1);
  const [starting, setStarting] = useState(false);
  const [materializing, setMaterializing] = useState(false);
  // Desafíos en edición local (se sincronizan al avanzar de paso).
  const [challenges, setChallenges] = useState<ChallengeInput[]>([]);

  const role = activeUser?.role ?? "hincha";
  const canManage = CAN_MANAGE.includes(role);

  // Al cargar: decidir vista inicial. Siempre se entra por "Listo para crear tu estrategia ESG".
  useEffect(() => {
    if (!strategy) return;
    setChallenges(strategy.challenges.map((c) => ({ ...c, documents: c.documents.map((d) => ({ name: d.name, type: d.type, size: d.size })) })));
  }, [strategy]);

  const startNew = async () => {
    setStarting(true);
    try { await create(); setStep(1); setView("wizard"); } catch (e) { toast.error(e instanceof Error ? e.message : "No se pudo iniciar"); } finally { setStarting(false); }
  };
  const resume = () => { setStep(Math.max(1, Math.min(6, strategy?.currentStep || 1))); setView("wizard"); };

  /* ── Validación por paso ── */
  const validate = (n: number): string | null => {
    if (!strategy) return "Sin estrategia";
    if (n === 1) {
      if (!strategy.orgName.trim()) return "Ingresa el nombre del club/federación";
      if (!strategy.sport) return "Selecciona el deporte principal";
      if (!strategy.orgType) return "Selecciona el tipo de organización";
      if (!strategy.vigenciaInicio || !strategy.vigenciaFin) return "Define el período de vigencia";
      const span = strategy.vigenciaFin - strategy.vigenciaInicio + 1;
      if (span < 2 || span > 10) return "La vigencia debe ser de 2 a 10 años";
      if (!strategy.respName.trim() || !strategy.respEmail.trim()) return "Ingresa nombre y correo del responsable";
    }
    if (n === 2 && challenges.length === 0) return "Selecciona al menos un desafío ESG para avanzar";
    return null;
  };

  const persistStep = async (n: number) => {
    // Guardar inmediato incluyendo desafíos cuando corresponde.
    const patch: Record<string, unknown> = { currentStep: n };
    if (n === 2 || n === 3) patch.challenges = challenges;
    await save(patch, true);
  };

  const next = async () => {
    const err = validate(step);
    if (err) { toast.error(err); return; }
    try { await persistStep(step); } catch { toast.error("No se pudo guardar el avance"); return; }
    if (step < 6) setStep(step + 1);
    else await runGenerate();
  };
  const back = () => setStep((s) => Math.max(1, s - 1));

  const runGenerate = async () => {
    setView("generating");
    try {
      await generate();
      setView("doc");
      toast.success("Estrategia ESG generada");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo generar la estrategia");
      setView("wizard");
    }
  };

  const doMaterialize = async () => {
    setMaterializing(true);
    try { const r = await materialize(); toast.success(`${r.created} proyecto(s) ESG creados desde tus metas`); }
    catch (e) { toast.error(e instanceof Error ? e.message : "No se pudo convertir las metas"); }
    finally { setMaterializing(false); }
  };

  if (!loaded || loading) return null;

  if (!canManage) {
    return (
      <div className="max-w-5xl mx-auto"><SectionHeader icon={<Brain size={22} className="text-violet-500" />} title="Motor IA — Estrategia ESG" subtitle="Genera tu estrategia de sostenibilidad con inteligencia artificial" />
        <div className="card p-16 text-center mt-6"><Lock size={24} className="text-slate-400 mx-auto mb-3" /><h3 className="text-lg font-bold text-slate-700 mb-2">Disponible para clubes y federaciones</h3><p className="text-slate-400 text-sm max-w-sm mx-auto">El Motor IA construye la estrategia ESG de la organización deportiva. Tu perfil actual no gestiona una.</p></div></div>
    );
  }

  const agentStep = view === "welcome" ? 0 : view === "doc" ? 7 : step;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24">
      <SectionHeader icon={<Brain size={22} className="text-violet-500" />} title="Motor IA — Estrategia ESG"
        subtitle="Construye tu estrategia ESG con estándares GRI, plan de inversión y alineación global"
        action={view !== "welcome" ? (
          <div className="flex items-center gap-2">
            {saving ? <span className="text-xs text-slate-400 flex items-center gap-1.5"><Save size={13} className="animate-pulse" /> Guardando…</span> : <span className="text-xs text-teal-600 flex items-center gap-1.5"><CheckCircle size={13} /> Guardado</span>}
            <button onClick={() => setView("welcome")} className="btn-ghost text-sm">Inicio</button>
          </div>) : undefined} />

      <div>
        {view === "welcome" && (
          <motion.div key="w" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Welcome strategy={strategy} starting={starting} onStart={startNew} onResume={resume} onView={() => setView("doc")} />
          </motion.div>
        )}

        {view === "wizard" && strategy && (
          <motion.div key="z" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Stepper */}
            <div className="card p-4 flex items-center gap-1 overflow-x-auto">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <button key={n} onClick={() => n < step && setStep(n)} className="flex items-center gap-2 flex-shrink-0">
                  <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                    style={n < step ? { background: "linear-gradient(135deg, #10B981, #06B6D4)", color: "#0f172a" } : n === step ? { background: "linear-gradient(135deg, #8B5CF6, #06B6D4)", color: "#fff", boxShadow: "0 0 0 4px rgba(139,92,246,0.15)" } : { backgroundColor: "#F1F5F9", color: "#94A3B8" }}>
                    {n < step ? <CheckCircle size={14} /> : n}</span>
                  <span className={`text-xs hidden lg:block ${n === step ? "text-slate-900 font-semibold" : "text-slate-400"}`}>{STEP_TITLES[n]}</span>
                  {n < 6 && <span className="w-6 h-px mx-1" style={{ backgroundColor: n < step ? "#10B981" : "#E2E8F0" }} />}
                </button>
              ))}
            </div>

            <div className="card p-7">
              <div className="mb-6"><p className="text-xs font-semibold uppercase tracking-wider text-violet-500">Paso {step} de 6</p><h2 className="text-xl font-bold text-slate-900 mt-1">{STEP_TITLES[step]}</h2></div>
              {step === 1 && <Step1 s={strategy} save={save} />}
              {step === 2 && <Step2 challenges={challenges} gri={config.gri} onChange={setChallenges} />}
              {step === 3 && <Step3 challenges={challenges} s={strategy} onChange={setChallenges} />}
              {step === 4 && <Step4 objectives={strategy.objectives} onChange={(o) => save({ objectives: o })} />}
              {step === 5 && <Step5 s={strategy} frameworks={config.frameworks} save={save} />}
              {step === 6 && <Step6 s={strategy} save={save} />}

              <div className="flex items-center justify-between mt-8 pt-6" style={{ borderTop: "1px solid #F1F5F9" }}>
                <button onClick={back} disabled={step === 1} className="btn-secondary flex items-center gap-2 disabled:opacity-40"><ChevronLeft size={16} /> Atrás</button>
                <button onClick={next} className="btn-primary flex items-center gap-2">
                  {step < 6 ? <>Continuar <ChevronRight size={16} /></> : <><Sparkles size={16} /> Generar mi Estrategia ESG</>}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {view === "generating" && (
          <motion.div key="g" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-16 text-center">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #8B5CF6, #06B6D4)" }}><Sparkles size={26} className="text-white animate-pulse" /></div>
            <h3 className="text-xl font-bold text-slate-900">Generando tu Estrategia ESG</h3>
            <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">El motor procesa tus desafíos, diagnóstico, presupuesto y objetivos para construir metas SMART bajo GRI, hitos por año, plan de inversión y alineación global.</p>
            <div className="w-64 h-1.5 rounded-full mx-auto mt-6 overflow-hidden bg-slate-100"><motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #10B981, #06B6D4)" }} initial={{ width: "10%" }} animate={{ width: "90%" }} transition={{ duration: 3, ease: "easeInOut" }} /></div>
          </motion.div>
        )}

        {view === "doc" && strategy?.generatedDoc && (
          <motion.div key="d" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <StrategyDoc doc={strategy.generatedDoc} status={strategy.status} onMaterialize={doMaterialize} materializing={materializing} />
          </motion.div>
        )}
      </div>

      <BetterAgent step={agentStep} orgType={strategy?.orgType} sport={strategy?.sport} />
    </div>
  );
}
