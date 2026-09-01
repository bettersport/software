"use client";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Leaf, Users, Shield, FileCheck, Target, Globe, PlayCircle } from "lucide-react";
import type { Strategy } from "./useStrategy";

const STEPS = [
  { n: 1, t: "Datos generales y período de vigencia" },
  { n: 2, t: "Desafíos ESG (Ambiental · Social · Gobernanza)" },
  { n: 3, t: "Metas, estándar GRI, presupuesto y RR.HH." },
  { n: 4, t: "Objetivos e intereses estratégicos" },
  { n: 5, t: "Alineación con lineamientos globales del deporte" },
  { n: 6, t: "Contexto adicional (opcional)" },
];

export function Welcome({ strategy, onStart, onResume, onView, starting }: {
  strategy: Strategy | null; onStart: () => void; onResume: () => void; onView: () => void; starting: boolean;
}) {
  const hasDraft = strategy && strategy.status === "draft" && strategy.currentStep > 0;
  const hasDoc = strategy && !!strategy.generatedDoc;

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card overflow-hidden">
        <div className="p-10 lg:p-14 relative" style={{ background: "linear-gradient(135deg, #0B1628 0%, #0D1F3C 55%, #0A2818 100%)" }}>
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 pointer-events-none" style={{ background: "radial-gradient(circle, #10B981, transparent 70%)", filter: "blur(60px)" }} />
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6" style={{ backgroundColor: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.35)", color: "#6EE7B7" }}>
              <Sparkles size={13} /> Motor IA · Estrategia ESG
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight" style={{ letterSpacing: "-0.02em" }}>
              Listo para crear tu estrategia ESG
            </h1>
            <p className="text-base lg:text-lg mt-4 leading-relaxed" style={{ color: "#A5B4CB" }}>
              En 6 pasos guiados construyes una estrategia con nivel de consultoría: metas medibles basadas en <strong className="text-white">estándares GRI</strong>, plan de inversión, hoja de ruta por año y alineación con el organismo global de tu deporte. Todo lo que declares queda trazable y se transforma en proyectos que alimentan tu Ranking.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-8">
              {hasDoc ? (
                <>
                  <button onClick={onView} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-[#04121a]" style={{ background: "linear-gradient(100deg, #67e8f9, #22d3ee 55%, #a78bfa)", boxShadow: "0 0 24px rgba(16,185,129,0.35)" }}>
                    <FileCheck size={18} /> Ver mi estrategia {strategy?.vigenciaInicio}–{strategy?.vigenciaFin}
                  </button>
                  <button onClick={onStart} disabled={starting} className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-white" style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
                    <PlayCircle size={18} /> Nueva versión
                  </button>
                </>
              ) : hasDraft ? (
                <>
                  <button onClick={onResume} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-[#04121a]" style={{ background: "linear-gradient(100deg, #67e8f9, #22d3ee 55%, #a78bfa)", boxShadow: "0 0 24px rgba(16,185,129,0.35)" }}>
                    <PlayCircle size={18} /> Continuar borrador (paso {strategy!.currentStep} de 6)
                  </button>
                  <button onClick={onStart} disabled={starting} className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-white" style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
                    Empezar de nuevo
                  </button>
                </>
              ) : (
                <button onClick={onStart} disabled={starting} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-[#04121a] disabled:opacity-70" style={{ background: "linear-gradient(100deg, #67e8f9, #22d3ee 55%, #a78bfa)", boxShadow: "0 0 24px rgba(16,185,129,0.35)" }}>
                  {starting ? <div className="w-4 h-4 rounded-full border-2 border-slate-900/30 border-t-slate-900 animate-spin" /> : <ArrowRight size={18} />}
                  Comenzar mi estrategia ESG
                </button>
              )}
              <span className="text-xs" style={{ color: "#6B7F9E" }}>≈ 20–30 min · se guarda automáticamente</span>
            </div>
          </div>
        </div>

        <div className="p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">El proceso</p>
            <ol className="space-y-3">
              {STEPS.map((s) => (
                <li key={s.n} className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ backgroundColor: "#ECFDF5", color: "#34d399", border: "1px solid #A7F3D0" }}>{s.n}</span>
                  <span className="text-sm text-slate-700">{s.t}</span>
                </li>
              ))}
              <li className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(100deg, #67e8f9, #22d3ee 55%, #a78bfa)", color: "#0f172a" }}><Sparkles size={13} /></span>
                <span className="text-sm font-semibold text-[#04121a]">Generación de tu Estrategia ESG profesional</span>
              </li>
            </ol>
          </div>
          <div className="lg:col-span-2 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Qué obtienes</p>
            {[
              { i: <Target size={15} />, t: "Metas SMART por desafío, vinculadas a estándares GRI y ODS" },
              { i: <Leaf size={15} />, t: "Diagnóstico de madurez ESG por pilar (E · S · G)" },
              { i: <Globe size={15} />, t: "Alineación con FIFA, World Rugby, COI u otro organismo según tu deporte" },
              { i: <Users size={15} />, t: "Plan de inversión, RR.HH. y proyectos que las marcas pueden financiar" },
              { i: <Shield size={15} />, t: "Better Agent: asistente para resolver dudas en cada paso" },
            ].map((x) => (
              <div key={x.t} className="flex items-start gap-3 p-3 rounded-xl" style={{ backgroundColor: "#10151f", border: "1px solid #161d29" }}>
                <span className="mt-0.5 text-teal-600">{x.i}</span>
                <span className="text-sm text-slate-600">{x.t}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
