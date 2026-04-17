"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lightbulb, Search, Filter, ArrowUpRight, Heart, Users,
  Calendar, DollarSign, ChevronDown, Star, CheckCircle,
} from "lucide-react";
import { SectionHeader, ProgressBar, Tabs } from "@/components/ui";
import { mockEvents, categoryLabels, categoryColors, categoryIcons } from "@/lib/data";
import { getStatusLabel, getStatusColor, cn } from "@/lib/utils";
import type { Event } from "@/lib/types";
import toast from "react-hot-toast";

const categoryTabs = [
  { label: "Todos", value: "all" },
  { label: "💧 Huella hídrica", value: "huella_hidrica" },
  { label: "🌱 Huella de carbono", value: "huella_carbono" },
  { label: "♻️ Gestión de residuos", value: "gestion_residuos" },
  { label: "📚 Educación", value: "educacion" },
  { label: "🤝 Inclusión", value: "inclusion" },
  { label: "⚖️ Equidad de género", value: "equidad_genero" },
];

const sports = ["Todos", "Fútbol", "Rugby", "Pádel", "Natación", "Tenis", "Atletismo"];
const countries = ["Todos", "Chile", "Argentina", "Colombia", "España", "México"];

export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sportFilter, setSportFilter] = useState("Todos");
  const [countryFilter, setCountryFilter] = useState("Todos");
  const [saved, setSaved] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const filtered = mockEvents.filter((e) => {
    const matchCat = activeCategory === "all" || e.category === activeCategory;
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.clubName.toLowerCase().includes(search.toLowerCase());
    const matchSport = sportFilter === "Todos" || e.sport === sportFilter;
    const matchCountry = countryFilter === "Todos" || e.country === countryFilter;
    return matchCat && matchSearch && matchSport && matchCountry;
  });

  const toggleSave = (id: string) => {
    setSaved((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  };

  const handleSponsor = (event: Event) => {
    toast.success(`¡Solicitud de patrocinio enviada para "${event.title}"!`, { duration: 3000 });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <SectionHeader
        icon={<Lightbulb size={22} className="text-amber-400" />}
        title="Proyectos de alto impacto"
        subtitle="Descubre y patrocina proyectos deportivos sostenibles"
      />

      {/* Search + Filter bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
          <input
            className="input-field pl-9"
            placeholder="Buscar proyectos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn("btn-secondary gap-2", showFilters && "border-emerald-500/40 text-teal-600")}
        >
          <Filter size={15} />
          Filtros
          <ChevronDown size={12} className={cn("transition-transform", showFilters && "rotate-180")} />
        </button>
        <div className="text-xs text-slate-400 ml-2">
          {filtered.length} proyectos encontrados
        </div>
      </div>

      {/* Advanced filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="card p-7 overflow-hidden"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider block mb-2">Deporte</label>
                <select className="input-field" value={sportFilter} onChange={(e) => setSportFilter(e.target.value)}>
                  {sports.map((s) => <option key={s} value={s} style={{ backgroundColor: "#fff" }}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider block mb-2">País</label>
                <select className="input-field" value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)}>
                  {countries.map((c) => <option key={c} value={c} style={{ backgroundColor: "#fff" }}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider block mb-2">Presupuesto mínimo</label>
                <input type="number" className="input-field" placeholder="0" />
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider block mb-2">Audiencia mínima</label>
                <input type="number" className="input-field" placeholder="0" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category tabs */}
      <div className="overflow-x-auto pb-1">
        <Tabs tabs={categoryTabs} active={activeCategory} onChange={setActiveCategory} />
      </div>

      {/* Events grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <AnimatePresence>
          {filtered.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.06 }}
              className="card-hover overflow-hidden flex flex-col cursor-pointer"
              onClick={() => setSelectedEvent(event)}
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-500 hover:scale-105"
                  style={{ backgroundImage: `url(${event.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Category badge */}
                <div className="absolute top-3 left-3">
                  <span className={cn("badge", categoryColors[event.category])}>
                    {categoryIcons[event.category]} {categoryLabels[event.category]}
                  </span>
                </div>

                {/* ESG Seal */}
                {event.sealEsg && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: "rgba(16,185,129,0.9)", color: "#0f172a" }}>
                    <CheckCircle size={11} /> ESG ✓
                  </div>
                )}

                {/* Save button */}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleSave(event.id); }}
                  className="absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all"
                  style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                  <Heart size={14} className={saved.includes(event.id) ? "text-red-400 fill-red-400" : "text-slate-900"} />
                </button>

                {/* Country badge */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", color: "#0f172a" }}>
                  <span>{event.flag}</span>
                  <span>{event.country}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-slate-800 text-base mb-2">{event.title}</h3>

                {/* Club + Sponsors */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-xs font-bold text-slate-900">
                      {event.clubName.charAt(0)}
                    </div>
                    <span className="text-xs text-slate-500">{event.clubName}</span>
                  </div>
                  {event.sponsoredBy && event.sponsoredBy.length > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-300">Apoyado por</span>
                      <div className="flex items-center gap-1">
                        {event.sponsoredBy.map((s) => (
                          <div key={s} className="h-5 px-2 rounded text-xs font-bold flex items-center" style={{ backgroundColor: "#f1f5f9", color: "#475569" }}>
                            {s.slice(0, 8)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed flex-1">
                  {event.description}
                </p>

                {/* Funding progress */}
                <div className="mb-4">
                  <ProgressBar value={event.funded} max={event.budget} showPercent={false} height={5} />
                  <div className="flex justify-between items-center mt-1.5">
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-slate-400">${event.budget.toLocaleString()} <span className="text-slate-300">a financiar</span></span>
                      <span className="text-teal-600 font-semibold">${event.funded.toLocaleString()} <span className="text-teal-600/60">Financiado</span></span>
                      <span className="text-red-400 font-semibold">${event.remaining.toLocaleString()} <span className="text-red-400/60">Restante</span></span>
                    </div>
                    <span className="text-xs text-slate-400">Quedan <span className="text-amber-400 font-semibold">{event.daysLeft}d</span></span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleSponsor(event); }}
                    className="btn-primary flex-1 justify-center"
                  >
                    Sponsorear ahora
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); }}
                    className="btn-secondary flex-1 justify-center"
                  >
                    Ver proyecto
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <Lightbulb size={40} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-400 font-medium">No se encontraron proyectos</p>
          <p className="text-slate-300 text-sm mt-1">Prueba con otros filtros</p>
        </div>
      )}

      {/* Event detail modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="card max-w-2xl w-full overflow-hidden max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-56">
                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${selectedEvent.image})` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-slate-600 hover:text-slate-800 text-xl">
                  ×
                </button>
                <div className="absolute bottom-4 left-5">
                  <span className={cn("badge", categoryColors[selectedEvent.category])}>
                    {categoryIcons[selectedEvent.category]} {categoryLabels[selectedEvent.category]}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{selectedEvent.title}</h2>
                    <p className="text-sm text-slate-400 mt-1">{selectedEvent.flag} {selectedEvent.country} · {selectedEvent.sport}</p>
                  </div>
                  <span className={getStatusColor(selectedEvent.status)}>{getStatusLabel(selectedEvent.status)}</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-5">{selectedEvent.description}</p>

                <div className="p-4 rounded-xl mb-5" style={{ backgroundColor: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
                  <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-1">Impacto sostenible</p>
                  <p className="text-sm text-slate-700">{selectedEvent.sustainableImpact}</p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-5">
                  {[
                    { label: "Presupuesto", value: `$${selectedEvent.budget.toLocaleString()}`, icon: <DollarSign size={14} /> },
                    { label: "Audiencia estimada", value: `${(selectedEvent.audience / 1000).toFixed(0)}K personas`, icon: <Users size={14} /> },
                    { label: "Días restantes", value: `${selectedEvent.daysLeft} días`, icon: <Calendar size={14} /> },
                  ].map((s) => (
                    <div key={s.label} className="text-center p-3 rounded-xl" style={{ backgroundColor: "#f8fafc" }}>
                      <div className="flex justify-center text-slate-400 mb-1">{s.icon}</div>
                      <p className="text-sm font-bold text-slate-900">{s.value}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>

                <ProgressBar value={selectedEvent.funded} max={selectedEvent.budget} label="Financiamiento" height={8} />
                <div className="flex justify-between text-xs mt-2 mb-6">
                  <span className="text-teal-600">${selectedEvent.funded.toLocaleString()} financiado</span>
                  <span className="text-red-400">${selectedEvent.remaining.toLocaleString()} restante</span>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => { handleSponsor(selectedEvent); setSelectedEvent(null); }} className="btn-primary flex-1 justify-center py-3">
                    Sponsorear ahora
                  </button>
                  <button onClick={() => setSelectedEvent(null)} className="btn-secondary px-5">
                    Cerrar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
