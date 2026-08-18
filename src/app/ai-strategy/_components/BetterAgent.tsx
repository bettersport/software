"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Sparkles } from "lucide-react";
import { apiSend } from "@/lib/useResource";

type Msg = { role: "user" | "agent"; text: string };

const SUGGESTIONS: Record<number, string[]> = {
  0: ["¿Qué obtengo al final del proceso?", "¿Cuánto demora?"],
  1: ["¿Qué período de vigencia me conviene?", "¿Qué tipo de organización elijo?"],
  2: ["¿Qué es una línea base?", "Somos un club amateur, ¿por dónde empezamos?", "¿Qué es un diagnóstico previo?"],
  3: ["¿Qué es un estándar GRI?", "¿Qué pongo si no tengo presupuesto?", "¿Qué significa alcance 1, 2 y 3?"],
  4: ["¿Cómo afectan los objetivos a mi estrategia?"],
  5: ["¿Qué gano alineándome con FIFA / World Rugby / COI?"],
  6: ["¿Qué contexto adicional es útil?"],
  7: ["¿Cómo convierto las metas en proyectos?", "¿Cómo se actualiza la estrategia?"],
};

/** Better Agent — asistente flotante de proceso (spec §9). No redacta la estrategia. */
export function BetterAgent({ step, orgType, sport }: { step: number; orgType?: string; sport?: string }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "agent", text: "Hola, soy Better Agent. Te acompaño en cada paso: puedo explicarte qué significa un campo, qué es un estándar GRI o ayudarte a elegir desafíos según tu club. ¿En qué te ayudo?" }]);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, open]);

  const ask = async (text: string) => {
    const question = text.trim();
    if (!question || busy) return;
    setQ("");
    setMsgs((m) => [...m, { role: "user", text: question }]);
    setBusy(true);
    try {
      const r = await apiSend<{ data: { answer: string } }>("/api/strategy/agent", "POST", { question, step, orgType, sport });
      setMsgs((m) => [...m, { role: "agent", text: r.data.answer }]);
    } catch {
      setMsgs((m) => [...m, { role: "agent", text: "No pude responder ahora. Intenta de nuevo en un momento." }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full font-semibold text-slate-900 shadow-lg"
        style={{ background: "linear-gradient(135deg, #10B981, #06B6D4)", boxShadow: "0 8px 30px rgba(16,185,129,0.4)" }}>
        <Bot size={18} /> Better Agent
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 16, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.97 }}
            className="fixed bottom-24 right-6 z-40 w-[360px] max-w-[calc(100vw-2rem)] card overflow-hidden flex flex-col" style={{ height: 480 }}>
            <div className="p-4 flex items-center justify-between" style={{ background: "linear-gradient(135deg, #0B1628, #0D1F3C)" }}>
              <div className="flex items-center gap-2 text-white">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #10B981, #06B6D4)" }}><Sparkles size={15} className="text-slate-900" /></div>
                <div><p className="text-sm font-bold leading-none">Better Agent</p><p className="text-[11px] mt-1" style={{ color: "#8FA3C2" }}>Guía del proceso · paso {step === 7 ? "final" : step}</p></div>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white"><X size={16} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed"
                    style={m.role === "user" ? { background: "linear-gradient(135deg, #10B981, #06B6D4)", color: "#0f172a" } : { backgroundColor: "#F1F5F9", color: "#334155" }}>
                    {m.text}
                  </div>
                </div>
              ))}
              {busy && <div className="text-xs text-slate-400 px-1">Better Agent está escribiendo…</div>}
              <div ref={endRef} />
            </div>
            <div className="px-4 pb-2 flex gap-1.5 flex-wrap">
              {(SUGGESTIONS[step] ?? []).slice(0, 3).map((s) => (
                <button key={s} onClick={() => ask(s)} className="text-[11px] px-2.5 py-1 rounded-full text-teal-700 hover:bg-teal-100" style={{ backgroundColor: "#ECFDF5", border: "1px solid #A7F3D0" }}>{s}</button>
              ))}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); ask(q); }} className="p-3 flex gap-2" style={{ borderTop: "1px solid #F1F5F9" }}>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Escribe tu duda…" className="input-field h-10 text-sm flex-1" />
              <button type="submit" disabled={busy || !q.trim()} className="btn-primary h-10 w-10 p-0 justify-center disabled:opacity-50"><Send size={15} /></button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
