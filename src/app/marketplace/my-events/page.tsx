"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Plus, MapPin, Users, Tag, Clock, CheckCircle2, ChevronDown, ChevronUp, X, Send, Bell, Upload, ImageIcon } from "lucide-react";
import { mockEvents } from "@/lib/data";
import type { ESGCategory } from "@/lib/types";
import { SectionHeader } from "@/components/ui";
import toast from "react-hot-toast";

const initialMyEvents = mockEvents.slice(0, 3).map((e, i) => ({
  ...e,
  myRole: ["Organizador", "Patrocinador", "Participante"][i],
  status: ["active", "upcoming", "completed"][i] as "active" | "upcoming" | "completed",
  myParticipants: [120, 80, 250][i],
}));

const statusConfig = {
  active: { label: "Activo", color: "#10B981", icon: <CheckCircle2 size={13} /> },
  upcoming: { label: "Próximo", color: "#06B6D4", icon: <Clock size={13} /> },
  completed: { label: "Completado", color: "#8B5CF6", icon: <CheckCircle2 size={13} /> },
};

const SPORTS = ["Fútbol", "Atletismo", "Ciclismo", "Natación", "Tenis", "Rugby", "Básquetbol", "Otro"];
const ROLES = ["Organizador", "Patrocinador", "Participante", "Voluntario"];
const emptyForm = { title: "", date: "", location: "", sport: "Fútbol", role: "Organizador", sponsorLogo: "", mediaPartnerLogo: "" };

/* ── Logo upload helper ── */
function LogoUpload({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">{label}</label>
      <label className="group relative flex flex-col items-center justify-center h-20 rounded-xl border-2 border-dashed cursor-pointer transition-all hover:border-teal-400 hover:bg-teal-50/40"
        style={{ borderColor: value ? "#10B981" : "#e2e8f0", backgroundColor: value ? "rgba(16,185,129,0.04)" : "#f8fafc" }}>
        {value ? (
          <div className="flex flex-col items-center gap-1.5">
            <img src={value} alt="logo" className="h-9 w-auto object-contain rounded" />
            <span className="text-[10px] text-teal-600 font-semibold">Cambiar logo</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-teal-100 transition-colors">
              <Upload size={14} className="text-slate-400 group-hover:text-teal-600 transition-colors" />
            </div>
            <span className="text-[10px] text-slate-400 text-center leading-tight">Subir logo<br />PNG, JPG, SVG</span>
          </div>
        )}
        <input type="file" accept="image/*" className="sr-only" onChange={handleFile} />
      </label>
    </div>
  );
}

function Portal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

export default function MyEventsPage() {
  const [events, setEvents] = useState(initialMyEvents);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [sponsorUpdateEvent, setSponsorUpdateEvent] = useState<string | null>(null);
  const [sponsorMessage, setSponsorMessage] = useState("");

  const createEvent = () => {
    if (!form.title.trim() || !form.date || !form.location.trim()) {
      toast.error("Completa todos los campos requeridos");
      return;
    }
    const daysLeft = Math.ceil((new Date(form.date).getTime() - Date.now()) / 86400000);
    const newEvent = {
      id: `ev${Date.now()}`,
      title: form.title,
      description: "Evento creado desde la plataforma BetterSport.",
      sport: form.sport,
      country: form.location,
      flag: "🌍",
      clubId: "",
      clubName: "",
      image: "",
      sustainableImpact: "",
      budget: 0,
      funded: 0,
      remaining: 0,
      sponsoredBy: [] as string[],
      mediaPartner: "",
      sealEsg: false,
      status: "upcoming" as const,
      myRole: form.role,
      myParticipants: 0,
      daysLeft: Math.max(0, daysLeft),
      audience: 0,
      category: "huella_carbono" as ESGCategory,
    };
    setEvents((prev) => [newEvent, ...prev]);
    setForm(emptyForm);
    setShowNew(false);
    toast.success("Evento creado correctamente");
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    toast("Evento eliminado", { icon: "🗑️" });
  };

  const sendSponsorUpdate = (eventId: string) => {
    if (!sponsorMessage.trim()) {
      toast.error("Escribe un mensaje para los sponsors");
      return;
    }
    setSponsorUpdateEvent(null);
    setSponsorMessage("");
    toast.success("Actualización ESG enviada a los sponsors");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <SectionHeader
        icon={<CalendarDays size={22} className="text-teal-600" />}
        title="Mis Eventos"
        subtitle="Eventos deportivos sostenibles en los que participas u organizas"
        action={
          <button className="btn-primary flex items-center gap-2" onClick={() => setShowNew(true)}>
            <Plus size={16} /> Crear evento
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Eventos activos", value: events.filter((e) => e.status === "active").length, color: "#10B981" },
          { label: "Próximos", value: events.filter((e) => e.status === "upcoming").length, color: "#06B6D4" },
          { label: "Completados", value: events.filter((e) => e.status === "completed").length, color: "#8B5CF6" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card p-6 text-center">
            <p className="text-2xl font-black" style={{ color: s.color, fontFamily: "'Manrope', sans-serif" }}>{s.value}</p>
            <p className="text-xs text-slate-400 mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Events list */}
      <div className="space-y-3">
        {events.map((event, i) => {
          const cfg = statusConfig[event.status];
          const isOpen = expanded === event.id;
          return (
            <motion.div key={event.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 + 0.2 }} className="card overflow-hidden">
              <div className="p-5 flex items-start gap-4 cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => setExpanded(isOpen ? null : event.id)}>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-100 to-teal-100 border border-slate-200 flex items-center justify-center text-xl flex-shrink-0">
                  {event.sport === "Fútbol" ? "⚽" : event.sport === "Atletismo" ? "��" : "🚴"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <h4 className="font-semibold text-slate-800 text-sm truncate">{event.title}</h4>
                    <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-semibold"
                      style={{ backgroundColor: cfg.color + "18", color: cfg.color, border: `1px solid ${cfg.color}30` }}>
                      {cfg.icon} {cfg.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                    <span className="flex items-center gap-1"><MapPin size={11} />{event.country}</span>
                    <span className="flex items-center gap-1"><Tag size={11} />{event.myRole}</span>
                    <span className="flex items-center gap-1"><Users size={11} />{event.myParticipants} participantes</span>
                    <span className="flex items-center gap-1"><Clock size={11} />{event.daysLeft}d restantes</span>
                  </div>
                </div>
                {isOpen ? <ChevronUp size={16} className="text-slate-300 flex-shrink-0 mt-1" /> : <ChevronDown size={16} className="text-slate-300 flex-shrink-0 mt-1" />}
              </div>
              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-slate-100">
                    <div className="p-6 space-y-5">
                      <p className="text-sm text-slate-400 leading-relaxed">{event.description}</p>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: "Categoría ESG", value: event.category || "Ambiental" },
                          { label: "Deporte", value: event.sport },
                          { label: "Audiencia", value: event.audience?.toLocaleString() || "N/A" },
                          { label: "Días restantes", value: event.daysLeft?.toString() || "N/A" },
                        ].map((d) => (
                          <div key={d.label} className="bg-slate-50 rounded-xl p-3">
                            <p className="text-xs text-slate-400 mb-0.5">{d.label}</p>
                            <p className="text-sm font-semibold text-slate-900">{d.value}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <button
                          className="flex items-center gap-1.5 text-xs py-1.5 px-3 rounded-xl font-semibold transition-all"
                          style={{ background: "linear-gradient(135deg, #10B981, #06B6D4)", color: "#0f172a" }}
                          onClick={(e) => { e.stopPropagation(); setSponsorUpdateEvent(event.id); setSponsorMessage(""); }}
                        >
                          <Bell size={13} /> Actualizar Sponsor
                        </button>
                        <button className="btn-secondary text-xs py-1.5 px-3" onClick={() => toast.success("Gestión del evento próximamente")}>Gestionar</button>
                        <button className="btn-ghost text-xs py-1.5 px-3" onClick={() => deleteEvent(event.id)}>Eliminar</button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
        {events.length === 0 && (
          <div className="card p-12 text-center">
            <CalendarDays size={32} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-400">No tienes eventos aún. ¡Crea tu primer evento!</p>
          </div>
        )}
      </div>

      {/* Sponsor update modal */}
      <Portal>
        <AnimatePresence>
          {sponsorUpdateEvent && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
              onClick={() => setSponsorUpdateEvent(null)}>
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="card w-full max-w-lg p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #10B981, #06B6D4)" }}>
                      <Bell size={18} className="text-slate-900" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900" style={{ fontFamily: "'Manrope', sans-serif" }}>Actualizar Sponsor</h3>
                      <p className="text-xs text-slate-400">Se enviará una notificación a las marcas patrocinadoras</p>
                    </div>
                  </div>
                  <button onClick={() => setSponsorUpdateEvent(null)} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                    <X size={18} className="text-slate-400" />
                  </button>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)" }}>
                  <p className="text-xs font-semibold text-teal-700 mb-1">Destinatarios</p>
                  <p className="text-xs text-slate-500">
                    {events.find((e) => e.id === sponsorUpdateEvent)?.sponsoredBy?.join(", ") || "Todos los sponsors del evento"}
                  </p>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Actualización ESG *</label>
                  <textarea
                    rows={4}
                    className="input-field w-full resize-none"
                    placeholder="Ej: Hemos alcanzado una reducción del 30% en emisiones CO2 este trimestre. Adjuntamos el informe actualizado..."
                    value={sponsorMessage}
                    onChange={(e) => setSponsorMessage(e.target.value)}
                  />
                </div>
                <div className="flex gap-3 pt-1">
                  <button
                    className="flex-1 h-11 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:opacity-90"
                    style={{ background: "linear-gradient(135deg, #10B981, #06B6D4)", color: "#0f172a" }}
                    onClick={() => sendSponsorUpdate(sponsorUpdateEvent)}
                  >
                    <Send size={16} /> Enviar notificación
                  </button>
                  <button className="btn-secondary" onClick={() => setSponsorUpdateEvent(null)}>Cancelar</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Portal>

      {/* New event modal via Portal */}
      <Portal>
        <AnimatePresence>
          {showNew && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowNew(false)}>
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="card w-full max-w-lg p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900" style={{ fontFamily: "'Manrope', sans-serif" }}>Crear nuevo evento</h3>
                  <button onClick={() => setShowNew(false)} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                    <X size={18} className="text-slate-400" />
                  </button>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Nombre del evento *</label>
                  <input type="text" placeholder="Ej: Maratón Verde 2025" className="input-field w-full"
                    value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Fecha *</label>
                  <input type="date" className="input-field w-full"
                    value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Ubicación *</label>
                  <input type="text" placeholder="Ciudad, País" className="input-field w-full"
                    value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Deporte</label>
                    <select className="input-field w-full" value={form.sport} onChange={(e) => setForm({ ...form, sport: e.target.value })}>
                      {SPORTS.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Mi rol</label>
                    <select className="input-field w-full" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                      {ROLES.map((r) => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
                {/* Logo uploads */}
                <div className="grid grid-cols-2 gap-3">
                  <LogoUpload
                    label="Logo promotor iniciativa"
                    value={form.sponsorLogo}
                    onChange={(v) => setForm({ ...form, sponsorLogo: v })}
                  />
                  <LogoUpload
                    label="Logo media partner"
                    value={form.mediaPartnerLogo}
                    onChange={(v) => setForm({ ...form, mediaPartnerLogo: v })}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button className="btn-primary flex-1" onClick={createEvent}>Crear evento</button>
                  <button className="btn-secondary" onClick={() => setShowNew(false)}>Cancelar</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Portal>
    </div>
  );
}
