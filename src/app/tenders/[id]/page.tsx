"use client";

import { use, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Gavel, ArrowLeft, Users, MapPin, Calendar, Wallet, Sparkles, Globe,
  CheckCircle2, AlertTriangle, Send, ShieldCheck, Info,
} from "lucide-react";
import { SectionHeader } from "@/components/ui";
import { RankBar } from "@/components/viz";
import { useUser } from "@/lib/userContext";
import { useResource, apiSend } from "@/lib/useResource";
import { SUSTAINABILITY_TAGS } from "@/lib/tenders/matching";
import toast from "react-hot-toast";

interface Producer {
  id: string; name: string; initials: string; color: string; description: string;
  website: string | null; regions: string[]; specialties: string[]; capabilities: string[];
  certifications: string[]; maxCapacity: number; eventsProduced: number;
  reportsOnPlatform: boolean; verified: boolean;
}
interface Match {
  producer: Producer; score: number;
  reasons: { criterion: string; got: number; max: number; detail: string }[];
  gaps: string[];
}
interface Bid {
  id: string; message: string; amount: number; approach: string; status: string;
  createdAt: string; producerId: string; producer: Producer;
}
interface Detail {
  tender: {
    id: string; title: string; description: string; eventType: string; sport: string;
    participants: number; region: string; eventDate: string; budget: number;
    requirements: string; sustainability: string[]; deadline: string; status: string;
    brand: { name: string; org: string | null }; bids: Bid[];
  };
  matches: Match[] | null;
  isOwner: boolean;
  myBid: Bid | null;
  hasProfile: boolean;
}

const clp = (n: number) => `$${Math.round(n).toLocaleString("es-CL")}`;
const tagOf = (id: string) => SUSTAINABILITY_TAGS.find((t) => t.id === id);

const BID_STATUS: Record<string, { label: string; color: string }> = {
  enviada: { label: "Enviada", color: "#8b95a5" },
  preseleccionada: { label: "Preseleccionada", color: "#fbbf24" },
  descartada: { label: "Descartada", color: "#f87171" },
  adjudicada: { label: "Adjudicada", color: "#34d399" },
};

export default function TenderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { activeUser, loaded } = useUser();
  const { data, reload } = useResource<Detail | null>(loaded && activeUser ? `/api/tenders/${id}` : null, null);
  const [bid, setBid] = useState({ amount: "", message: "", approach: "" });
  const [sending, setSending] = useState(false);

  const t = data?.tender;

  const submitBid = async () => {
    setSending(true);
    try {
      await apiSend(`/api/tenders/${id}/bids`, "POST", {
        amount: parseFloat(bid.amount) || 0,
        message: bid.message,
        approach: bid.approach,
      });
      await reload();
      toast.success("Oferta enviada");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo enviar la oferta");
    } finally {
      setSending(false);
    }
  };

  const setBidStatus = async (bidId: string, bidStatus: string) => {
    try {
      await apiSend(`/api/tenders/${id}`, "PATCH", { bidId, bidStatus });
      await reload();
      toast.success("Oferta actualizada");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo actualizar");
    }
  };

  if (!t) {
    return (
      <div className="max-w-4xl mx-auto">
        <Link href="/tenders" className="btn-secondary !rounded-xl inline-flex mb-6"><ArrowLeft size={15} /> Volver</Link>
        <div className="card p-12 text-center"><p className="text-sm" style={{ color: "#6b7789" }}>Cargando licitación…</p></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-7">
      <Link href="/tenders" className="btn-secondary !rounded-xl inline-flex"><ArrowLeft size={15} /> Licitaciones</Link>

      <SectionHeader
        icon={<Gavel size={22} className="text-teal-600" />}
        title={t.title}
        subtitle={`${t.eventType}${t.sport ? ` · ${t.sport}` : ""} · ${t.brand.org ?? t.brand.name}`}
      />

      {/* Ficha */}
      <div className="card p-7">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          {[
            { k: "Participantes", v: t.participants ? t.participants.toLocaleString("es-CL") : "—", Icon: Users },
            { k: "Región", v: t.region, Icon: MapPin },
            { k: "Fecha", v: t.eventDate || "Por definir", Icon: Calendar },
            { k: "Presupuesto", v: t.budget ? clp(t.budget) : "Reservado", Icon: Wallet },
          ].map((x) => (
            <div key={x.k}>
              <x.Icon size={14} className="text-teal-600 mb-2" />
              <p className="eyebrow mb-1">{x.k}</p>
              <p className="text-sm font-semibold" style={{ color: "#f4f7fb" }}>{x.v}</p>
            </div>
          ))}
        </div>

        {t.description && <p className="text-sm leading-relaxed mb-5" style={{ color: "#a8b3c4" }}>{t.description}</p>}

        {t.requirements && (
          <div className="surface-inner p-4 mb-5">
            <p className="eyebrow mb-2">Requisitos de producción</p>
            <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "#a8b3c4" }}>{t.requirements}</p>
          </div>
        )}

        <p className="eyebrow mb-2.5">Requisitos sostenibles exigidos</p>
        <div className="flex flex-wrap gap-2">
          {t.sustainability.length === 0 && <span className="text-sm" style={{ color: "#6b7789" }}>No se declararon requisitos específicos.</span>}
          {t.sustainability.map((tag) => {
            const cfg = tagOf(tag);
            return (
              <span key={tag} className="text-xs px-3 py-1.5 rounded-full font-semibold"
                style={{ color: "#2dd4bf", backgroundColor: "rgba(45,212,191,0.1)", border: "1px solid rgba(45,212,191,0.28)" }}>
                {cfg?.icon} {cfg?.label ?? tag}
              </span>
            );
          })}
        </div>
      </div>

      {/* ── Ranking del motor (solo quien licita) ── */}
      {data.isOwner && data.matches && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card ring-gradient p-7">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ color: "#a78bfa", backgroundColor: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.3)" }}>
              <Sparkles size={18} />
            </span>
            <div>
              <h3 className="font-bold text-base" style={{ color: "#f4f7fb" }}>Productoras recomendadas</h3>
              <p className="text-xs mt-0.5" style={{ color: "#6b7789" }}>Ranking según ajuste a tus requisitos</p>
            </div>
          </div>

          {data.matches.length === 0 ? (
            <p className="text-sm py-6" style={{ color: "#6b7789" }}>Aún no hay productoras en el catálogo para evaluar.</p>
          ) : (
            <div className="space-y-4 mt-6">
              {data.matches.map((m, i) => (
                <div key={m.producer.id} className="surface-inner p-5">
                  <div className="flex flex-wrap items-start gap-4">
                    <span className="w-11 h-11 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ color: m.producer.color, backgroundColor: `${m.producer.color}1f`, border: `1px solid ${m.producer.color}45` }}>
                      {m.producer.initials || m.producer.name.slice(0, 2).toUpperCase()}
                    </span>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[11px]" style={{ color: "#6b7789" }}>#{i + 1}</span>
                        <h4 className="font-bold text-sm" style={{ color: "#f4f7fb" }}>{m.producer.name}</h4>
                        {m.producer.verified && <ShieldCheck size={13} style={{ color: "#34d399" }} />}
                        {m.producer.reportsOnPlatform && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ color: "#22d3ee", backgroundColor: "rgba(34,211,238,0.12)" }}>
                            Reporta en Bettersport
                          </span>
                        )}
                      </div>
                      <p className="text-xs mt-1 leading-relaxed" style={{ color: "#8b95a5" }}>{m.producer.description}</p>
                      {m.producer.website && (
                        <a href={m.producer.website} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] mt-1.5" style={{ color: "#2dd4bf" }}>
                          <Globe size={11} /> Sitio web
                        </a>
                      )}
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-2xl font-extrabold tnum" style={{ color: m.score >= 70 ? "#34d399" : m.score >= 45 ? "#fbbf24" : "#8b95a5" }}>
                        {m.score}
                      </p>
                      <p className="eyebrow">de ajuste</p>
                    </div>
                  </div>

                  {/* Desglose del puntaje */}
                  <div className="mt-5 space-y-2.5">
                    {m.reasons.map((r) => (
                      <div key={r.criterion} className="flex items-center gap-3">
                        <span className="w-36 text-[11px] flex-shrink-0" style={{ color: "#a8b3c4" }}>{r.criterion}</span>
                        <RankBar pct={(r.got / r.max) * 100} color="#22d3ee" height={4} />
                        <span className="w-12 text-right font-mono text-[11px] tnum flex-shrink-0" style={{ color: "#6b7789" }}>
                          {r.got}/{r.max}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 space-y-1.5">
                    {m.reasons.map((r) => (
                      <p key={r.criterion} className="text-[11px] flex items-start gap-1.5" style={{ color: "#6b7789" }}>
                        <CheckCircle2 size={11} className="flex-shrink-0 mt-0.5" style={{ color: r.got > 0 ? "#34d399" : "#566173" }} />
                        {r.detail}
                      </p>
                    ))}
                    {m.gaps.length > 0 && (
                      <p className="text-[11px] flex items-start gap-1.5" style={{ color: "#fbbf24" }}>
                        <AlertTriangle size={11} className="flex-shrink-0 mt-0.5" />
                        No declara: {m.gaps.join(", ")}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="flex items-start gap-2 text-[11px] mt-5 pt-5" style={{ color: "#6b7789", borderTop: "1px solid #161d29" }}>
            <Info size={12} className="flex-shrink-0 mt-0.5" />
            El puntaje se calcula con criterios verificables del perfil de cada productora, con el mayor peso en los requisitos sostenibles. Las capacidades son declaradas por cada empresa y deben confirmarse antes de adjudicar.
          </p>
        </motion.div>
      )}

      {/* ── Ofertas recibidas (quien licita) ── */}
      {data.isOwner && (
        <div className="card p-7">
          <h3 className="font-bold text-base mb-5" style={{ color: "#f4f7fb" }}>Ofertas recibidas ({t.bids.length})</h3>
          {t.bids.length === 0 ? (
            <p className="text-sm" style={{ color: "#6b7789" }}>Todavía no hay ofertas.</p>
          ) : (
            <div className="space-y-3">
              {t.bids.map((b) => {
                const st = BID_STATUS[b.status] ?? BID_STATUS.enviada;
                return (
                  <div key={b.id} className="surface-inner p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-sm" style={{ color: "#f4f7fb" }}>{b.producer.name}</p>
                        <p className="font-mono text-sm mt-1" style={{ color: "#22d3ee" }}>{clp(b.amount)}</p>
                      </div>
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                        style={{ color: st.color, backgroundColor: `${st.color}18`, border: `1px solid ${st.color}38` }}>
                        {st.label}
                      </span>
                    </div>
                    {b.message && <p className="text-xs mt-3 leading-relaxed" style={{ color: "#a8b3c4" }}>{b.message}</p>}
                    {b.approach && (
                      <div className="mt-3">
                        <p className="eyebrow mb-1">Enfoque sostenible</p>
                        <p className="text-xs leading-relaxed" style={{ color: "#a8b3c4" }}>{b.approach}</p>
                      </div>
                    )}
                    <div className="flex gap-2 mt-4 flex-wrap">
                      {(["preseleccionada", "adjudicada", "descartada"] as const).map((s) => (
                        <button key={s} onClick={() => setBidStatus(b.id, s)}
                          className="text-[11px] px-3 py-1.5 rounded-lg font-semibold transition-all"
                          style={{ color: BID_STATUS[s].color, backgroundColor: `${BID_STATUS[s].color}14`, border: `1px solid ${BID_STATUS[s].color}35` }}>
                          {BID_STATUS[s].label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Postulación (productora) ── */}
      {activeUser?.role === "productora" && t.status === "abierta" && (
        <div className="card p-7">
          <h3 className="font-bold text-base mb-1" style={{ color: "#f4f7fb" }}>
            {data.myBid ? "Actualiza tu oferta" : "Presenta tu oferta"}
          </h3>
          <p className="text-xs mb-6" style={{ color: "#6b7789" }}>
            {data.hasProfile
              ? "Explica cómo cumples los requisitos sostenibles: es lo que más pesa en la evaluación."
              : "Antes de ofertar necesitas completar el perfil de tu productora."}
          </p>

          {!data.hasProfile ? (
            <Link href="/producers/profile" className="btn-primary inline-flex">Completar mi perfil <Send size={15} /></Link>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="eyebrow block mb-2">Monto de la oferta (CLP)</label>
                <input type="number" min="0" className="input-field" placeholder="14500000"
                  value={bid.amount} onChange={(e) => setBid({ ...bid, amount: e.target.value })} />
              </div>
              <div>
                <label className="eyebrow block mb-2">Propuesta</label>
                <textarea rows={3} className="input-field resize-none" placeholder="Qué incluye tu propuesta de producción"
                  value={bid.message} onChange={(e) => setBid({ ...bid, message: e.target.value })} />
              </div>
              <div>
                <label className="eyebrow block mb-2">Enfoque sostenible</label>
                <textarea rows={3} className="input-field resize-none" placeholder="Cómo logras cero residuos, carbono neutral, certificaciones…"
                  value={bid.approach} onChange={(e) => setBid({ ...bid, approach: e.target.value })} />
              </div>
              <button className="btn-primary justify-center w-full" onClick={submitBid} disabled={sending}>
                {sending ? "Enviando…" : data.myBid ? "Actualizar oferta" : "Enviar oferta"} <Send size={15} />
              </button>
              {data.myBid && (
                <p className="text-[11px] text-center" style={{ color: "#6b7789" }}>
                  Tu oferta actual: {clp(data.myBid.amount)} · {BID_STATUS[data.myBid.status]?.label}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
