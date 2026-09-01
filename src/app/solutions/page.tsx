"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, Leaf, Recycle, BookOpen, Users, Bike, Star,
  CheckCircle, LayoutList, LayoutGrid, X, Phone, Globe,
  ExternalLink, MapPin, Search, SlidersHorizontal, ArrowUpRight,
  Sparkles, ShieldCheck,
} from "lucide-react";
import { solutionCategoryLabels } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { SolutionProvider } from "@/lib/types";
import { useUser } from "@/lib/userContext";
import { useResource, apiSend } from "@/lib/useResource";
import toast from "react-hot-toast";

type Provider = SolutionProvider & { website?: string | null; isEmpresaB?: boolean };

const EMPTY: Provider[] = [];

/* ─── Category icon map (Lucide) ─── */
const categoryIcons: Record<string, React.ElementType> = {
  eficiencia_hidrica: Leaf,
  eficiencia_energetica: Zap,
  gestion_residuos: Recycle,
  educacion_ambiental: BookOpen,
  impacto_social: Users,
  movilidad_sostenible: Bike,
};

const categoryColors: Record<string, string> = {
  eficiencia_hidrica: "#0EA5E9",
  eficiencia_energetica: "#F59E0B",
  gestion_residuos: "#10B981",
  educacion_ambiental: "#8B5CF6",
  impacto_social: "#EC4899",
  movilidad_sostenible: "#06B6D4",
};

const countries = ["Todos los países", "Chile", "Argentina", "Colombia", "México", "España"];
const countryFlags: Record<string, string> = {
  "Todos los países": "🌎",
  Chile: "🇨🇱",
  Argentina: "🇦🇷",
  Colombia: "🇨🇴",
  México: "🇲🇽",
  España: "🇪🇸",
};

const categoryOptions = [
  { value: "all", label: "Todos" },
  { value: "eficiencia_hidrica", label: "Huella hídrica" },
  { value: "eficiencia_energetica", label: "Energía" },
  { value: "gestion_residuos", label: "Residuos" },
  { value: "educacion_ambiental", label: "Educación" },
  { value: "impacto_social", label: "Impacto social" },
  { value: "movilidad_sostenible", label: "Movilidad" },
  { value: "regulatorio", label: "Regulatorio" },
];

/* ─── Sub-components ─── */
function StarRating({ stars, size = 13 }: { stars: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={s <= stars ? "text-amber-400 fill-amber-400" : "text-slate-300 fill-slate-300"}
        />
      ))}
    </div>
  );
}

function CategoryPill({ category }: { category: string }) {
  const Icon = categoryIcons[category] ?? Sparkles;
  const color = categoryColors[category] ?? "#a8b3c4";
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ backgroundColor: color + "15", color, border: `1px solid ${color}30` }}
    >
      <Icon size={11} />
      {solutionCategoryLabels[category]}
    </span>
  );
}

function BrandBadge({ name }: { name: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    Claro: { bg: "#E31E2D", text: "#fff" },
    ESPN: { bg: "#CC0000", text: "#fff" },
    VTR: { bg: "#E40046", text: "#fff" },
    Itaú: { bg: "#EC7000", text: "#fff" },
    Pemex: { bg: "#006B3F", text: "#fff" },
    Águila: { bg: "#FFD700", text: "#1a1a1a" },
  };
  const style = colors[name] ?? { bg: "#a8b3c4", text: "#fff" };
  return (
    <div
      className="h-6 min-w-[44px] px-2 rounded-md flex items-center justify-center text-[10px] font-bold tracking-wide"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {name}
    </div>
  );
}

function ClubBadge({ name, initials }: { name: string; initials: string }) {
  return (
    <div
      title={name}
      className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold text-white ring-2 ring-white"
      style={{ background: "linear-gradient(100deg, #67e8f9, #22d3ee 55%, #a78bfa)" }}
    >
      {initials}
    </div>
  );
}

/* ─── Main page ─── */
export default function SolutionsPage() {
  const { activeUser, loaded } = useUser();
  const { data: providers } = useResource<Provider[]>(
    loaded && activeUser ? "/api/solutions" : null, EMPTY,
  );

  const [country, setCountry] = useState("Todos los países");
  const [category, setCategory] = useState("all");
  const [view, setView] = useState<"list" | "grid">("list");
  const [selected, setSelected] = useState<Provider | null>(null);
  const [search, setSearch] = useState("");
  const [onlyEmpresaB, setOnlyEmpresaB] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactMessage, setContactMessage] = useState("");
  const [sendingContact, setSendingContact] = useState(false);

  useEffect(() => { setContactOpen(false); setContactMessage(""); }, [selected]);
  const openContact = () => { setContactMessage(""); setContactOpen(true); };
  const sendContact = async () => {
    if (!selected) return;
    if (!contactMessage.trim()) { toast.error("Escribe un mensaje para el proveedor"); return; }
    setSendingContact(true);
    try {
      await apiSend("/api/solution-contacts", "POST", { providerId: selected.id, message: contactMessage.trim() });
      toast.success("Mensaje enviado al proveedor");
      setContactOpen(false);
      setContactMessage("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo enviar el mensaje");
    } finally {
      setSendingContact(false);
    }
  };

  const filtered = providers.filter((p) => {
    const matchCountry = country === "Todos los países" || p.country === country;
    const matchCat = category === "all" || p.category === category;
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchEmpresaB = !onlyEmpresaB || !!p.isEmpresaB;
    return matchCountry && matchCat && matchSearch && matchEmpresaB;
  });
  const maxProjects = Math.max(1, ...filtered.map((p) => p.projectsCount));

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(100deg, #67e8f9, #22d3ee 55%, #a78bfa)" }}
            >
              <Sparkles size={16} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Soluciones sostenibles</h1>
          </div>
          <p className="text-sm text-slate-400 ml-10">Conecta con proveedores verificados de sostenibilidad</p>
        </div>
        <div
          className="flex items-center gap-1.5 text-xs text-slate-400 px-3 py-1.5 rounded-full"
          style={{ backgroundColor: "#161d29" }}
        >
          <span className="font-bold text-slate-700">{filtered.length}</span>&nbsp;resultados
        </div>
      </div>

      {/* ── Search + filters ── */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar solución..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all"
            />
          </div>

          {/* Country select */}
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm pointer-events-none">
              {countryFlags[country]}
            </span>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="pl-8 pr-7 py-2.5 rounded-xl text-sm border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-teal-400 appearance-none cursor-pointer min-w-[160px]"
            >
              {countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <SlidersHorizontal size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 ml-auto">
            {(["list", "grid"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                  view === v ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {v === "list" ? <LayoutList size={13} /> : <LayoutGrid size={13} />}
                {v === "list" ? "Lista" : "Grilla"}
              </button>
            ))}
          </div>
        </div>

        {/* Category pills + Empresa B toggle */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Empresa B toggle */}
          <motion.button
            onClick={() => setOnlyEmpresaB(!onlyEmpresaB)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 border"
            style={
              onlyEmpresaB
                ? { backgroundColor: "#7C3AED", color: "#fff", borderColor: "#7C3AED", boxShadow: "0 4px 14px #7C3AED45" }
                : { backgroundColor: "rgba(167,139,250,0.12)", color: "#a78bfa", borderColor: "rgba(167,139,250,0.3)" }
            }
          >
            <ShieldCheck size={11} />
            Empresa B
          </motion.button>
          {categoryOptions.map((opt) => {
            const active = category === opt.value;
            const Icon = opt.value !== "all" ? (categoryIcons[opt.value] ?? Sparkles) : Sparkles;
            const color = opt.value !== "all" ? categoryColors[opt.value] : "#10B981";
            return (
              <motion.button
                key={opt.value}
                onClick={() => setCategory(opt.value)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150"
                style={
                  active
                    ? { backgroundColor: color, color: "#fff", boxShadow: `0 4px 14px ${color}45` }
                    : { backgroundColor: "#161d29", color: "#a8b3c4", border: "1px solid #232c3a" }
                }
              >
                {opt.value !== "all" && <Icon size={11} />}
                {opt.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── LIST VIEW ── */}
      {view === "list" && (
        <div className="card overflow-hidden">
          <div
            className="grid text-xs font-semibold uppercase tracking-wider px-6 py-3.5"
            style={{
              gridTemplateColumns: "44px 1fr 180px 80px 140px",
              color: "#94A3B8",
              borderBottom: "1px solid #161d29",
              background: "#0b0f16",
            }}
          >
            <span>#</span>
            <span>Proveedor</span>
            <span>Proyectos</span>
            <span>Club</span>
            <span>Valoración</span>
          </div>

          <div className="divide-y divide-slate-50">
            <AnimatePresence>
              {filtered.map((p, i) => {
                const Icon = categoryIcons[p.category] ?? Sparkles;
                const catColor = categoryColors[p.category] ?? p.color;
                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.035 }}
                    className="group grid items-center px-6 py-3.5 hover:bg-slate-50 cursor-pointer transition-all duration-150"
                    style={{ gridTemplateColumns: "44px 1fr 180px 80px 140px" }}
                    onClick={() => setSelected(p)}
                  >
                    <span className="text-sm font-bold text-slate-300 group-hover:text-slate-400 transition-colors">
                      {i + 1}
                    </span>

                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                        style={{
                          background: `linear-gradient(135deg, ${p.color}, ${p.color}88)`,
                          boxShadow: `0 4px 12px ${p.color}30`,
                        }}
                      >
                        <Icon size={17} className="text-white" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-semibold text-slate-800 text-sm truncate group-hover:text-teal-600 transition-colors">
                            {p.name}
                          </p>
                          {p.verified && <ShieldCheck size={13} className="text-teal-500 flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          {countryFlags[p.country]} {p.country} · {solutionCategoryLabels[p.category]}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 pr-6">
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-slate-100">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((p.projectsCount / maxProjects) * 100, 100)}%` }}
                          transition={{ delay: i * 0.04 + 0.2, duration: 0.6, ease: "easeOut" }}
                          className="h-full rounded-full"
                          style={{ background: `linear-gradient(90deg, ${catColor}, ${catColor}88)` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-slate-700 w-6 text-right flex-shrink-0">
                        {p.projectsCount}
                      </span>
                    </div>

                    <div>
                      {p.associatedClub && (
                        <ClubBadge
                          name={p.associatedClub}
                          initials={p.associatedClub.split(" ").map((w: string) => w[0]).slice(0, 2).join("")}
                        />
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <StarRating stars={p.stars} />
                      <ArrowUpRight
                        size={13}
                        className="text-slate-300 group-hover:text-teal-500 transition-colors flex-shrink-0"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          {filtered.length === 0 && <EmptyState />}
        </div>
      )}

      {/* ── GRID VIEW ── */}
      {view === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <AnimatePresence>
            {filtered.map((p, i) => {
              const Icon = categoryIcons[p.category] ?? Sparkles;
              const catColor = categoryColors[p.category] ?? p.color;
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                  className="card p-0 overflow-hidden cursor-pointer group"
                  onClick={() => setSelected(p)}
                >
                  <div
                    className="h-1 w-full"
                    style={{ background: `linear-gradient(90deg, ${p.color}, ${catColor}88)` }}
                  />
                  <div className="p-5 space-y-4">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                        style={{
                          background: `linear-gradient(135deg, ${p.color}, ${p.color}88)`,
                          boxShadow: `0 6px 16px ${p.color}35`,
                        }}
                      >
                        <Icon size={20} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-slate-900 truncate text-[15px]">{p.name}</p>
                          {p.verified && <ShieldCheck size={13} className="text-teal-500 flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {countryFlags[p.country]} {p.country}
                        </p>
                      </div>
                      <CategoryPill category={p.category} />
                    </div>

                    <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{p.description}</p>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Proyectos completados</span>
                        <span className="font-bold text-slate-700">{p.projectsCount}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((p.projectsCount / maxProjects) * 100, 100)}%` }}
                          transition={{ delay: i * 0.05 + 0.3, duration: 0.7, ease: "easeOut" }}
                          className="h-full rounded-full"
                          style={{ background: `linear-gradient(90deg, ${p.color}, ${catColor})` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-50">
                      <div className="flex items-center gap-2">
                        {p.associatedBrand && <BrandBadge name={p.associatedBrand} />}
                        {p.associatedClub && (
                          <ClubBadge
                            name={p.associatedClub}
                            initials={p.associatedClub.split(" ").map((w: string) => w[0]).slice(0, 2).join("")}
                          />
                        )}
                      </div>
                      <StarRating stars={p.stars} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {filtered.length === 0 && (
            <div className="col-span-3"><EmptyState /></div>
          )}
        </div>
      )}

      {/* ── Detail modal ── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 24 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[88vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Gradient header */}
              <div
                className="h-28 relative overflow-hidden flex items-end p-5"
                style={{
                  background: `linear-gradient(135deg, ${selected.color}cc, ${categoryColors[selected.category] ?? selected.color}88)`,
                }}
              >
                <div
                  className="absolute inset-0 opacity-20"
                  style={{ backgroundImage: "radial-gradient(circle at 80% 20%, #fff 0%, transparent 60%)" }}
                />
                <div className="relative flex items-end gap-4 w-full">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/30 flex-shrink-0">
                    {(() => {
                      const Icon = categoryIcons[selected.category] ?? Sparkles;
                      return <Icon size={24} className="text-white" />;
                    })()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-white truncate">{selected.name}</h2>
                      {selected.verified && <ShieldCheck size={15} className="text-white/80 flex-shrink-0" />}
                    </div>
                    <p className="text-white/70 text-xs flex items-center gap-1 mt-0.5">
                      <MapPin size={10} /> {countryFlags[selected.country]} {selected.country}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors flex-shrink-0"
                  >
                    <X size={15} className="text-white" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <CategoryPill category={selected.category} />

                <p className="text-sm text-slate-600 leading-relaxed">{selected.description}</p>

                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3.5 rounded-xl bg-slate-50">
                    <p className="text-2xl font-black text-slate-900">{selected.projectsCount}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Proyectos</p>
                  </div>
                  <div className="text-center p-3.5 rounded-xl bg-slate-50">
                    <div className="flex justify-center py-0.5"><StarRating stars={selected.stars} size={14} /></div>
                    <p className="text-xs text-slate-400 mt-1">Valoración</p>
                  </div>
                  <div className="text-center p-3.5 rounded-xl bg-slate-50">
                    <div className="flex justify-center py-0.5">
                      {selected.associatedBrand
                        ? <BrandBadge name={selected.associatedBrand} />
                        : <span className="text-xs text-slate-300">—</span>}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Marca</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Servicios</p>
                  <div className="grid grid-cols-2 gap-2">
                    {selected.services.map((s: string) => (
                      <div key={s} className="flex items-center gap-2 text-sm text-slate-700">
                        <CheckCircle size={13} className="flex-shrink-0" style={{ color: selected.color }} />
                        {s}
                      </div>
                    ))}
                  </div>
                </div>

                {selected.tags && selected.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selected.tags.map((t: string) => (
                      <span key={t} className="text-xs px-2.5 py-1 rounded-full font-medium bg-slate-100 text-slate-500">
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-3 pt-1">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white"
                    style={{
                      background: `linear-gradient(135deg, ${selected.color}, ${categoryColors[selected.category] ?? selected.color}cc)`,
                      boxShadow: `0 4px 14px ${selected.color}40`,
                    }}
                    onClick={openContact}
                  >
                    <Phone size={14} /> Contactar
                  </motion.button>
                  {selected.website && (
                    <motion.a
                      href={selected.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
                    >
                      <Globe size={14} /> Web <ExternalLink size={11} className="text-slate-400" />
                    </motion.a>
                  )}
                </div>

                {contactOpen && (
                  <div className="mt-2 p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mensaje para {selected.name}</p>
                    <textarea
                      rows={4}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Cuéntale al proveedor qué necesitas y cómo pueden contactarte..."
                      className="w-full text-sm rounded-lg border border-slate-200 bg-white p-3 resize-none focus:outline-none focus:ring-2 focus:ring-teal-200"
                    />
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => setContactOpen(false)} disabled={sendingContact} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-100 disabled:opacity-50">Cancelar</button>
                      <button onClick={sendContact} disabled={sendingContact} className="px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50" style={{ backgroundColor: selected.color }}>{sendingContact ? "Enviando…" : "Enviar mensaje"}</button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: "linear-gradient(135deg, #161d29, #232c3a)" }}
      >
        <Search size={22} className="text-slate-300" />
      </div>
      <p className="font-semibold text-slate-500">No se encontraron soluciones</p>
      <p className="text-sm text-slate-400 mt-1">Prueba con otros filtros o palabras clave</p>
    </div>
  );
}
