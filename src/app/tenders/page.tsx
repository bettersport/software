"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Gavel, Plus, X, MapPin, Users, Calendar, Wallet, ArrowRight, Inbox } from "lucide-react";
import { SectionHeader } from "@/components/ui";
import { useUser } from "@/lib/userContext";
import { useResource, apiSend } from "@/lib/useResource";
import { SUSTAINABILITY_TAGS, EVENT_TYPES, REGIONS } from "@/lib/tenders/matching";
import toast from "react-hot-toast";

interface Tender {
  id: string; title: string; eventType: string; sport: string; participants: number;
  region: string; eventDate: string; budget: number; sustainability: string[];
  deadline: string; status: string; createdAt: string;
  brand: { name: string; org: string | null };
  _count: { bids: number };
}

const EMPTY: Tender[] = [];
const clp = (n: number) => `$${Math.round(n).toLocaleString("es-CL")}`;

const STATUS = {
  abierta: { label: "Abierta", color: "#34d399" },
  evaluacion: { label: "En evaluación", color: "#fbbf24" },
  adjudicada: { label: "Adjudicada", color: "#22d3ee" },
  cancelada: { label: "Cancelada", color: "#8b95a5" },
} as const;

const emptyForm = {
  title: "", eventType: "Corrida", sport: "", participants: "", region: "Metropolitana",
  eventDate: "", budget: "", description: "", requirements: "", deadline: "",
  sustainability: [] as string[],
};

export default function TendersPage() {
  const { activeUser, loaded } = useUser();
  const { data: tenders, reload } = useResource<Tender[]>(loaded && activeUser ? "/api/tenders" : null, EMPTY);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const isBrand = activeUser?.role === "brand" || activeUser?.role === "admin";

  const publish = async () => {
    if (!form.title.trim()) { toast.error("Ponle un título a la licitación"); return; }
    setSaving(true);
    try {
      await apiSend("/api/tenders", "POST", {
        ...form,
        participants: parseInt(form.participants, 10) || 0,
        budget: parseFloat(form.budget) || 0,
      });
      await reload();
      setForm(emptyForm);
      setShowNew(false);
      toast.success("Licitación publicada");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo publicar");
    } finally {
      setSaving(false);
    }
  };

  const toggleTag = (id: string) =>
    setForm((f) => ({
      ...f,
      sustainability: f.sustainability.includes(id)
        ? f.sustainability.filter((t) => t !== id)
        : [...f.sustainability, id],
    }));

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <SectionHeader
        icon={<Gavel size={22} className="text-teal-600" />}
        title="Licitaciones"
        subtitle={isBrand
          ? "Publica la producción de tu evento y recibe a las productoras que mejor calzan"
          : "Eventos abiertos a licitación en el ecosistema Bettersport"}
        action={isBrand ? (
          <button className="btn-primary flex items-center gap-2" onClick={() => setShowNew(true)}>
            <Plus size={16} /> Nueva licitación
          </button>
        ) : undefined}
      />

      {tenders.length === 0 ? (
        <div className="card p-12 text-center">
          <Inbox size={32} className="mx-auto mb-4" style={{ color: "#566173" }} />
          <p className="text-sm" style={{ color: "#8b95a5" }}>
            {isBrand ? "Aún no has publicado licitaciones." : "No hay licitaciones abiertas en este momento."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {tenders.map((t, i) => {
            const st = STATUS[t.status as keyof typeof STATUS] ?? STATUS.abierta;
            return (
              <motion.div key={t.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <Link href={`/tenders/${t.id}`} className="card card-hover p-6 block">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <p className="eyebrow mb-1.5">{t.eventType}{t.sport ? ` · ${t.sport}` : ""}</p>
                      <h3 className="font-bold text-base" style={{ color: "#f4f7fb" }}>{t.title}</h3>
                      <p className="text-xs mt-1" style={{ color: "#6b7789" }}>
                        {t.brand.org ?? t.brand.name}
                      </p>
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                      style={{ color: st.color, backgroundColor: `${st.color}18`, border: `1px solid ${st.color}38` }}>
                      {st.label}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs mb-4" style={{ color: "#8b95a5" }}>
                    {t.participants > 0 && <span className="flex items-center gap-1.5"><Users size={12} />{t.participants.toLocaleString("es-CL")} participantes</span>}
                    <span className="flex items-center gap-1.5"><MapPin size={12} />{t.region}</span>
                    {t.eventDate && <span className="flex items-center gap-1.5"><Calendar size={12} />{t.eventDate}</span>}
                    {t.budget > 0 && <span className="flex items-center gap-1.5"><Wallet size={12} />{clp(t.budget)}</span>}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {t.sustainability.map((tag) => {
                      const cfg = SUSTAINABILITY_TAGS.find((x) => x.id === tag);
                      return (
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full"
                          style={{ color: "#2dd4bf", backgroundColor: "rgba(45,212,191,0.1)", border: "1px solid rgba(45,212,191,0.25)" }}>
                          {cfg?.icon} {cfg?.label ?? tag}
                        </span>
                      );
                    })}
                    <span className="ml-auto flex items-center gap-1.5 text-xs font-semibold" style={{ color: "#22d3ee" }}>
                      {isBrand ? `${t._count.bids} oferta(s)` : "Ver y ofertar"} <ArrowRight size={13} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Nueva licitación */}
      <AnimatePresence>
        {showNew && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
            onClick={() => setShowNew(false)}>
            <motion.div initial={{ scale: 0.96, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 16 }}
              className="card w-full max-w-2xl p-7 space-y-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold" style={{ color: "#f4f7fb", fontFamily: "'Manrope', sans-serif" }}>Nueva licitación</h3>
                  <p className="text-xs mt-0.5" style={{ color: "#6b7789" }}>El motor rankea las productoras que mejor calzan con tus requisitos</p>
                </div>
                <button onClick={() => setShowNew(false)} className="p-1 rounded-lg transition-colors hover:bg-slate-100">
                  <X size={18} style={{ color: "#8b95a5" }} />
                </button>
              </div>

              <div>
                <label className="eyebrow block mb-2">Título *</label>
                <input className="input-field" placeholder="Ej: Producción Corrida Verde 10K 2026"
                  value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="eyebrow block mb-2">Tipo de evento *</label>
                  <select className="input-field" value={form.eventType} onChange={(e) => setForm({ ...form, eventType: e.target.value })}>
                    {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="eyebrow block mb-2">Deporte</label>
                  <input className="input-field" placeholder="Atletismo, Fútbol…"
                    value={form.sport} onChange={(e) => setForm({ ...form, sport: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="eyebrow block mb-2">Participantes</label>
                  <input type="number" min="0" className="input-field" placeholder="2000"
                    value={form.participants} onChange={(e) => setForm({ ...form, participants: e.target.value })} />
                </div>
                <div>
                  <label className="eyebrow block mb-2">Región</label>
                  <select className="input-field" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })}>
                    {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="eyebrow block mb-2">Presupuesto (CLP)</label>
                  <input type="number" min="0" className="input-field" placeholder="15000000"
                    value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="eyebrow block mb-2">Fecha del evento</label>
                  <input type="date" className="input-field" value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} />
                </div>
                <div>
                  <label className="eyebrow block mb-2">Cierre de ofertas</label>
                  <input type="date" className="input-field" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
                </div>
              </div>

              <div>
                <label className="eyebrow block mb-2">Descripción</label>
                <textarea rows={3} className="input-field resize-none" placeholder="Qué se produce, alcance y contexto"
                  value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>

              <div>
                <label className="eyebrow block mb-2">Requisitos de producción</label>
                <textarea rows={3} className="input-field resize-none" placeholder="Montaje, cronometraje, hidratación, permisos municipales…"
                  value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} />
              </div>

              <div>
                <label className="eyebrow block mb-2">Requisitos sostenibles exigidos</label>
                <div className="flex flex-wrap gap-2">
                  {SUSTAINABILITY_TAGS.map((tag) => {
                    const on = form.sustainability.includes(tag.id);
                    return (
                      <button key={tag.id} type="button" onClick={() => toggleTag(tag.id)}
                        className="text-xs px-3 py-1.5 rounded-full font-semibold transition-all"
                        style={on
                          ? { color: "#04121a", backgroundColor: "#2dd4bf", border: "1px solid #2dd4bf" }
                          : { color: "#8b95a5", backgroundColor: "#10151f", border: "1px solid #232c3a" }}>
                        {tag.icon} {tag.label}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] mt-2" style={{ color: "#6b7789" }}>
                  Son el criterio que más pesa en el ranking de productoras.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button className="btn-primary flex-1 justify-center" onClick={publish} disabled={saving}>
                  {saving ? "Publicando…" : "Publicar licitación"}
                </button>
                <button className="btn-secondary" onClick={() => setShowNew(false)}>Cancelar</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
