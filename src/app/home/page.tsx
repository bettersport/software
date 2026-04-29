"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Leaf, TrendingUp, Users, Shield, Zap, Globe, BarChart3,
  CheckCircle2, Star, ChevronDown, Play, Award, Target, Heart, Recycle,
  Building2, Instagram, Youtube, Linkedin, Menu, X, Sparkles, Trophy,
  Brain, Layers, AlertTriangle, DollarSign, CalendarX, Activity,
  TrendingDown, Clock, Wind, TreePine, Droplets, SunMedium,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, RadialBarChart, RadialBar,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, Cell, PieChart, Pie,
} from "recharts";

/* ─── tiny helpers ─────────────────────────────────────────────── */
function useCounter(end: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, end, duration]);
  return count;
}

/* ─── animated section wrapper ─────────────────────────────────── */
function Section({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ─── stat card with counter ────────────────────────────────────── */
function StatCard({ value, suffix, label, description, icon }: { value: number; suffix: string; label: string; description: string; icon: React.ReactNode }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const count = useCounter(value, 1800, inView);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-emerald-400/30 transition-all duration-300">
        <div className="text-emerald-400/60 mb-3">{icon}</div>
        <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-1">
          {count}{suffix}
        </div>
        <div className="text-white font-semibold mb-1">{label}</div>
        <div className="text-slate-400 text-sm leading-relaxed">{description}</div>
      </div>
    </motion.div>
  );
}

/* ─── ESG Area Chart ────────────────────────────────────────────── */
const esgTrendData = [
  { month: "Ene", ambiental: 42, social: 55, gobernanza: 38 },
  { month: "Feb", ambiental: 48, social: 59, gobernanza: 44 },
  { month: "Mar", ambiental: 52, social: 62, gobernanza: 50 },
  { month: "Abr", ambiental: 58, social: 68, gobernanza: 55 },
  { month: "May", ambiental: 63, social: 72, gobernanza: 60 },
  { month: "Jun", ambiental: 69, social: 76, gobernanza: 65 },
  { month: "Jul", ambiental: 74, social: 80, gobernanza: 70 },
  { month: "Ago", ambiental: 78, social: 84, gobernanza: 75 },
  { month: "Sep", ambiental: 83, social: 87, gobernanza: 79 },
  { month: "Oct", ambiental: 87, social: 90, gobernanza: 83 },
  { month: "Nov", ambiental: 91, social: 93, gobernanza: 87 },
  { month: "Dic", ambiental: 95, social: 96, gobernanza: 91 },
];

const wellnessData = [
  { name: "Q1 2023", antes: 48, despues: 62 },
  { name: "Q2 2023", antes: 50, despues: 68 },
  { name: "Q3 2023", antes: 47, despues: 74 },
  { name: "Q4 2023", antes: 52, despues: 80 },
  { name: "Q1 2024", antes: 49, despues: 83 },
  { name: "Q2 2024", antes: 51, despues: 87 },
];

const participationData = [
  { name: "Maersk", value: 98, fill: "#10B981" },
  { name: "Scotiabank", value: 87, fill: "#06B6D4" },
  { name: "Falabella", value: 79, fill: "#3B82F6" },
  { name: "Entel", value: 73, fill: "#8B5CF6" },
  { name: "Arauco", value: 68, fill: "#F59E0B" },
];

const esgPillarsData = [
  { name: "Ambiental", value: 92, fill: "#10B981" },
  { name: "Social", value: 87, fill: "#06B6D4" },
  { name: "Gobernanza", value: 84, fill: "#3B82F6" },
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0d1117] border border-white/10 rounded-xl px-4 py-3 shadow-2xl text-sm">
        <p className="text-slate-400 mb-2 font-medium">{label}</p>
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2 text-white">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-slate-300">{p.name}:</span>
            <span className="font-bold">{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

function ESGChartSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section ref={ref} className="py-28 px-6 bg-gradient-to-b from-transparent via-emerald-950/15 to-transparent">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-emerald-400 text-sm font-semibold tracking-widest uppercase">Plataforma ESG en Vivo</span>
          <h2 className="text-4xl md:text-5xl font-black mt-3 mb-4">
            Datos que demuestran el impacto
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Nuestra plataforma convierte actividad deportiva en inteligencia ESG medible y trazable en tiempo real.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* CHART 1 — ESG Score Trend (full width) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="lg:col-span-2 bg-white/4 border border-white/8 rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="font-bold text-white">Evolución Score ESG Anual</div>
                <div className="text-slate-400 text-sm">Puntuación por pilar — 2024</div>
              </div>
              <span className="bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full">
                ↑ +53 pts promedio
              </span>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={esgTrendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmb" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSoc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorGob" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} domain={[30, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="ambiental" name="Ambiental" stroke="#10B981" strokeWidth={2} fill="url(#colorAmb)" dot={false} />
                <Area type="monotone" dataKey="social" name="Social" stroke="#06B6D4" strokeWidth={2} fill="url(#colorSoc)" dot={false} />
                <Area type="monotone" dataKey="gobernanza" name="Gobernanza" stroke="#3B82F6" strokeWidth={2} fill="url(#colorGob)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex gap-5 mt-4 justify-center">
              {[{ c: "#10B981", l: "Ambiental" }, { c: "#06B6D4", l: "Social" }, { c: "#3B82F6", l: "Gobernanza" }].map((p) => (
                <div key={p.l} className="flex items-center gap-1.5 text-xs text-slate-400">
                  <div className="w-3 h-3 rounded-full" style={{ background: p.c }} />
                  {p.l}
                </div>
              ))}
            </div>
          </motion.div>

          {/* CHART 2 — ESG Pillars Radial */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="bg-white/4 border border-white/8 rounded-3xl p-6 flex flex-col"
          >
            <div className="mb-4">
              <div className="font-bold text-white">Pilares ESG</div>
              <div className="text-slate-400 text-sm">Score actual por dimensión</div>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <RadialBarChart
                  cx="50%" cy="50%"
                  innerRadius="25%"
                  outerRadius="90%"
                  data={esgPillarsData}
                  startAngle={90}
                  endAngle={-270}
                >
                  <RadialBar dataKey="value" cornerRadius={8} background={{ fill: "rgba(255,255,255,0.04)" }} />
                  <Tooltip content={<CustomTooltip />} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-2">
              {esgPillarsData.map((p) => (
                <div key={p.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.fill }} />
                    <span className="text-slate-300">{p.name}</span>
                  </div>
                  <span className="font-bold" style={{ color: p.fill }}>{p.value}/100</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CHART 3 — Wellness Before/After */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="bg-white/4 border border-white/8 rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="font-bold text-white">Bienestar Corporativo</div>
                <div className="text-slate-400 text-sm">Antes vs. Después del programa</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={wellnessData} barGap={4} margin={{ left: -20, right: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="antes" name="Antes" fill="#334155" radius={[4, 4, 0, 0]} />
                <Bar dataKey="despues" name="Después" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex gap-5 mt-3 justify-center">
              {[{ c: "#334155", l: "Antes" }, { c: "#10B981", l: "Después" }].map((p) => (
                <div key={p.l} className="flex items-center gap-1.5 text-xs text-slate-400">
                  <div className="w-3 h-3 rounded-sm" style={{ background: p.c }} />
                  {p.l}
                </div>
              ))}
            </div>
          </motion.div>

          {/* CHART 4 — Participation donut */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="bg-white/4 border border-white/8 rounded-3xl p-6"
          >
            <div className="mb-4">
              <div className="font-bold text-white">Satisfacción por Empresa</div>
              <div className="text-slate-400 text-sm">% participantes satisfechos</div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={participationData}
                  cx="50%" cy="50%"
                  innerRadius={45}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {participationData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-1.5 mt-2">
              {participationData.map((p) => (
                <div key={p.name} className="flex items-center gap-1.5 text-xs text-slate-400">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.fill }} />
                  <span>{p.name}</span>
                  <span className="font-bold text-white ml-auto">{p.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CHART 5 — CO2 Reduction line */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="bg-white/4 border border-white/8 rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="font-bold text-white">Reducción CO₂</div>
                <div className="text-slate-400 text-sm">Toneladas compensadas por evento</div>
              </div>
              <div className="w-8 h-8 bg-emerald-500/15 border border-emerald-500/25 rounded-xl flex items-center justify-center">
                <Wind size={14} className="text-emerald-400" />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart
                data={[
                  { m: "E", co2: 2.1 }, { m: "F", co2: 3.4 }, { m: "M", co2: 2.8 },
                  { m: "A", co2: 4.2 }, { m: "M", co2: 5.1 }, { m: "J", co2: 4.8 },
                  { m: "J", co2: 6.3 }, { m: "A", co2: 7.2 }, { m: "S", co2: 6.9 },
                  { m: "O", co2: 8.1 }, { m: "N", co2: 9.4 }, { m: "D", co2: 10.2 },
                ]}
                margin={{ left: -20, right: 5 }}
              >
                <defs>
                  <linearGradient id="co2grad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="m" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} formatter={(v) => [`${v} ton`, "CO₂"]} />
                <Line type="monotone" dataKey="co2" name="CO₂" stroke="url(#co2grad)" strokeWidth={2.5} dot={{ fill: "#10B981", r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

        </div>

        {/* Live platform teaser card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mt-8 bg-gradient-to-r from-emerald-950/60 to-cyan-950/40 border border-emerald-500/20 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)] flex-shrink-0">
              <BarChart3 size={24} className="text-black" />
            </div>
            <div>
              <div className="font-bold text-white text-lg">Dashboard ESG en tiempo real</div>
              <div className="text-slate-400 text-sm">Accede a todos tus KPIs, proyectos y reportes en un solo lugar.</div>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link href="/register"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold px-6 py-3 rounded-xl whitespace-nowrap shadow-[0_0_30px_rgba(16,185,129,0.25)]">
              Ver la plataforma <ArrowRight size={16} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

const heroSlides = [
  {
    url: "https://images.unsplash.com/photo-1574279606130-09958dc756f7?w=900&q=80&fit=crop",
    label: "Trabajo en equipo",
  },
  {
    url: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=900&q=80&fit=crop",
    label: "Running corporativo",
  },
  {
    url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=80&fit=crop",
    label: "Bienestar organizacional",
  },
  {
    url: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=900&q=80&fit=crop",
    label: "Deporte sostenible",
  },
  {
    url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=900&q=80&fit=crop",
    label: "Olimpiadas corporativas",
  },
];

/* ─── main component ─────────────────────────────────────────────── */
export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Auto-advance slider
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((i) => (i + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const brands = ["Maersk", "Scotiabank", "Falabella", "Entel", "Arauco", "LATAM", "BCI", "Ripley"];

  const solutions = [
    { icon: <Target size={22} />, title: "Planificación conceptual y deportiva", desc: "Generamos la planificación deportiva en base a los principales intereses de la organización." },
    { icon: <BarChart3 size={22} />, title: "Reporte y Trazabilidad", desc: "Monitoreo en tiempo real a través de nuestra plataforma digital para medir impacto y resultados." },
    { icon: <Zap size={22} />, title: "Producción", desc: "Nos encargamos de la logística y ejecución de los eventos, garantizando una experiencia impecable." },
    { icon: <Brain size={22} />, title: "Eficiencia Operacional", desc: "Optimizamos la gestión deportiva, asegurando el uso eficiente de recursos y proveedores." },
    { icon: <TrendingUp size={22} />, title: "Marketing y Comunicaciones", desc: "Estrategias de comunicación interna y externa para maximizar la participación y visibilidad." },
  ];

  const benefits = [
    { icon: <Zap size={20} />, title: "Eficiencia Operacional", desc: "Centralizamos la gestión deportiva y eliminamos ineficiencias." },
    { icon: <Heart size={20} />, title: "Bienestar de Colaboradores", desc: "Reducción del estrés y aumento en satisfacción y compromiso laboral." },
    { icon: <Users size={20} />, title: "Cultura Organizacional", desc: "Mayor cohesión y sentido de pertenencia en los equipos." },
    { icon: <Trophy size={20} />, title: "Retención de Talento", desc: "Empresas con programas de bienestar reducen la rotación de personal." },
    { icon: <Leaf size={20} />, title: "Alineación ESG", desc: "Proyectos que reflejan compromiso real con la sostenibilidad." },
  ];

  const whyUs = [
    { icon: <Leaf size={24} />, title: "Expertos en Sostenibilidad", desc: "Te ayudamos a alinear tu marca con eventos deportivos responsables, asegurando un impacto positivo en la sociedad y el medio ambiente." },
    { icon: <Sparkles size={24} />, title: "Transformación Positiva", desc: "No solo organizamos eventos, creamos experiencias que generan bienestar, inclusión y sostenibilidad, con resultados medibles." },
    { icon: <Layers size={24} />, title: "Gestión Integral", desc: "Nos encargamos de toda la planificación y ejecución de cada evento, garantizando su alineación con los principios ESG y los objetivos de tu empresa." },
  ];

  const cases = [
    {
      title: "Olimpiadas Maersk 2024",
      stats: ["+200 colaboradores", "12 disciplinas deportivas", "100% residuos reciclados", "98% satisfacción"],
      gradient: "from-emerald-500 to-cyan-500",
    },
    {
      title: "Torneo Scotiabank",
      stats: ["40% reducción emisiones", "+1,000 participantes", "Referente ESG sectorial", "Huella compensada"],
      gradient: "from-blue-500 to-violet-500",
    },
  ];

  return (
    <div className="bg-[#05080f] text-white min-h-screen overflow-x-hidden">

      {/* ── NAVBAR ──────────────────────────────────────────────── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#05080f]/90 backdrop-blur-xl border-b border-white/5 shadow-2xl" : ""}`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div whileHover={{ scale: 1.03 }}>
            <img src="/logo.svg" alt="BetterSport" className="h-9 w-auto object-contain" style={{ filter: "brightness(0) invert(1)" }} />
          </motion.div>

          <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
            {["Solución", "Impacto", "Beneficios", "Casos de Éxito"].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`}
                className="hover:text-white transition-colors duration-200 hover:text-emerald-400">{item}</a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors px-4 py-2">
              Iniciar sesión
            </Link>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link href="/register"
                className="text-sm font-semibold bg-gradient-to-r from-emerald-500 to-cyan-500 text-black px-5 py-2 rounded-full hover:opacity-90 transition-opacity">
                Comenzar →
              </Link>
            </motion.div>
          </div>

          <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-[#05080f]/95 backdrop-blur-xl border-t border-white/5 px-6 py-4 flex flex-col gap-4"
            >
              {["Solución", "Impacto", "Beneficios", "Casos de Éxito"].map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`} onClick={() => setMenuOpen(false)}
                  className="text-slate-300 hover:text-emerald-400 transition-colors">{item}</a>
              ))}
              <div className="flex gap-3 pt-2 border-t border-white/5">
                <Link href="/login" className="flex-1 text-center py-2 text-sm text-slate-400 border border-white/10 rounded-lg">Iniciar sesión</Link>
                <Link href="/register" className="flex-1 text-center py-2 text-sm font-semibold bg-emerald-500 text-black rounded-lg">Comenzar</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden pt-20">
        {/* Mesh background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/8 rounded-full blur-[100px]" />
        </div>
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 w-full max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center py-16">

          {/* LEFT — text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 text-emerald-400 text-sm font-medium mb-8"
            >
              <Sparkles size={14} />
              Sport & Sustainability 360
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6 text-left"
            >
              Deporte que{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400">
                impacta.
              </span>
              <br />
              Equipos que{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400">
                crecen.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="text-lg text-slate-400 max-w-xl mb-10 leading-relaxed text-left"
            >
              Fortalece tu organización con deporte sostenible. Promovemos bienestar,
              crecimiento y alineación ESG con impacto tangible y resultados medibles.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.6 }}
              className="flex flex-wrap items-center gap-4"
            >
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link href="/register"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold px-8 py-4 rounded-2xl text-base shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:shadow-[0_0_60px_rgba(16,185,129,0.5)] transition-all duration-300">
                  Comenzar ahora <ArrowRight size={18} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <a href="#impacto"
                  className="inline-flex items-center gap-2 border border-white/15 text-white font-semibold px-8 py-4 rounded-2xl text-base hover:bg-white/5 hover:border-white/25 transition-all duration-300 backdrop-blur-sm">
                  Ver impacto <ChevronDown size={18} />
                </a>
              </motion.div>
            </motion.div>

            {/* Stats strip */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.7 }}
              className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3"
            >
              {[
                { n: "30K+", label: "Empleados impactados" },
                { n: "150+", label: "Eventos ejecutados" },
                { n: "85%", label: "Mejora productividad" },
                { n: "40%", label: "Más participación" },
              ].map((s) => (
                <div key={s.n} className="bg-white/4 backdrop-blur-sm border border-white/8 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-black text-emerald-400">{s.n}</div>
                  <div className="text-xs text-slate-400 mt-1">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — image slider */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden lg:block"
          >
            {/* Card container */}
            <div className="relative h-[560px] rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(16,185,129,0.15)]">
              {/* Slides */}
              <AnimatePresence mode="crossfade">
                <motion.div
                  key={slideIndex}
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <img
                    src={heroSlides[slideIndex].url}
                    alt={heroSlides[slideIndex].label}
                    className="w-full h-full object-cover"
                  />
                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#05080f]/40 to-transparent" />
                </motion.div>
              </AnimatePresence>

              {/* Slide label */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-10">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={slideIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="text-white font-semibold text-sm bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10"
                  >
                    {heroSlides[slideIndex].label}
                  </motion.span>
                </AnimatePresence>

                {/* Dot indicators */}
                <div className="flex gap-2">
                  {heroSlides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setSlideIndex(i)}
                      className={`transition-all duration-300 rounded-full ${
                        i === slideIndex
                          ? "w-6 h-2 bg-emerald-400"
                          : "w-2 h-2 bg-white/30 hover:bg-white/60"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Emerald border glow */}
              <div className="absolute inset-0 rounded-3xl ring-1 ring-emerald-500/20 pointer-events-none" />
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="absolute -bottom-5 -left-6 bg-[#0d1117] border border-white/10 rounded-2xl px-5 py-4 shadow-2xl backdrop-blur-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Leaf size={16} className="text-black" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Impacto ESG verificado</div>
                  <div className="text-sm font-bold text-white">Cero residuos · 2024</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="absolute -top-5 -right-4 bg-[#0d1117] border border-white/10 rounded-2xl px-4 py-3 shadow-2xl backdrop-blur-sm"
            >
              <div className="flex items-center gap-2">
                <Trophy size={16} className="text-emerald-400" />
                <div>
                  <div className="text-xs text-slate-400">Participantes activos</div>
                  <div className="text-sm font-bold text-white">+30,000 empleados</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center pt-2"
          >
            <div className="w-1.5 h-2 bg-emerald-400 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── BRANDS STRIP ─────────────────────────────────────────── */}
      <section className="py-14 border-y border-white/5 overflow-hidden">
        <p className="text-center text-sm text-slate-500 font-medium tracking-widest uppercase mb-8">
          Marcas que han construido su ADN con nosotros
        </p>
        <div className="relative">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="flex gap-16 whitespace-nowrap w-max"
          >
            {[...brands, ...brands].map((b, i) => (
              <div key={i} className="text-xl font-bold text-slate-600 hover:text-slate-400 transition-colors cursor-default">
                {b}
              </div>
            ))}
          </motion.div>
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#05080f] to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#05080f] to-transparent pointer-events-none" />
        </div>
      </section>

      {/* ── PROBLEM ──────────────────────────────────────────────── */}
      <Section className="py-28 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-red-400 text-sm font-semibold tracking-widest uppercase">El problema</span>
          <h2 className="text-4xl md:text-5xl font-black mt-3 mb-4">
            La realidad del bienestar corporativo
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            El costo del sedentarismo y el estrés en las organizaciones es mayor de lo que crees.
          </p>
        </div>

        {/* Big featured stat */}
        <div className="grid lg:grid-cols-6 gap-5">

          {/* Columna izquierda — 2 stats apilados */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {[
              {
                icon: <DollarSign size={28} />,
                value: "$1 billón",
                label: "USD perdidos al año",
                desc: "En productividad debido al estrés laboral en empresas globales.",
                accent: "#ef4444",
                glow: "rgba(239,68,68,0.15)",
                bar: 92,
              },
              {
                icon: <AlertTriangle size={28} />,
                value: "$1,430",
                label: "USD por empleado / año",
                desc: "El costo directo de la obesidad para empresas en EE.UU.",
                accent: "#f97316",
                glow: "rgba(249,115,22,0.15)",
                bar: 68,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="relative overflow-hidden bg-[#0d1117] border border-white/8 rounded-3xl p-7 group cursor-default"
              >
                {/* Glow blob */}
                <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full blur-2xl opacity-60 transition-opacity duration-500 group-hover:opacity-90"
                  style={{ background: item.glow }} />
                {/* Icon */}
                <div className="relative w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: `${item.accent}20`, border: `1px solid ${item.accent}35`, color: item.accent }}>
                  {item.icon}
                </div>
                {/* Value */}
                <div className="relative text-5xl font-black mb-1 leading-none" style={{ color: item.accent }}>
                  {item.value}
                </div>
                <div className="relative text-sm font-bold text-white mt-2 mb-1">{item.label}</div>
                <p className="relative text-slate-400 text-sm leading-relaxed mb-5">{item.desc}</p>
                {/* Animated progress bar */}
                <div className="relative h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.bar}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.15, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${item.accent}, ${item.accent}88)` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Columna centro — stat grande */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4 }}
            className="lg:col-span-2 relative overflow-hidden bg-gradient-to-b from-amber-950/40 to-[#0d1117] border border-amber-500/20 rounded-3xl p-7 flex flex-col justify-between cursor-default group"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
            <div className="relative">
              <div className="w-12 h-12 bg-amber-500/20 border border-amber-500/30 rounded-2xl flex items-center justify-center text-amber-400 mb-6">
                <Heart size={28} />
              </div>
              <div className="text-5xl font-black text-amber-400 leading-none mb-2">$3,600</div>
              <div className="text-sm font-bold text-white mb-2">USD / empleado / año</div>
              <p className="text-slate-400 text-sm leading-relaxed">Costo por estrés y enfermedades relacionadas al sedentarismo.</p>
            </div>
            {/* Animated ring */}
            <div className="relative mt-6">
              <svg viewBox="0 0 80 80" className="w-20 h-20 mx-auto">
                <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(245,158,11,0.1)" strokeWidth="8" />
                <motion.circle
                  cx="40" cy="40" r="32" fill="none"
                  stroke="#f59e0b" strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="201"
                  initial={{ strokeDashoffset: 201 }}
                  whileInView={{ strokeDashoffset: 201 * 0.22 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformOrigin: "center", transform: "rotate(-90deg)" }}
                />
                <text x="40" y="45" textAnchor="middle" fill="#f59e0b" fontSize="14" fontWeight="900">78%</text>
              </svg>
              <p className="text-center text-xs text-slate-500 mt-1">de empresas afectadas</p>
            </div>
          </motion.div>

          {/* Columna derecha — 2 stats */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {[
              {
                icon: <CalendarX size={28} />,
                value: "46%",
                label: "más ausencias laborales",
                desc: "Debido al sobrepeso y sedentarismo de los empleados.",
                accent: "#8b5cf6",
                glow: "rgba(139,92,246,0.15)",
                bar: 46,
              },
              {
                icon: <TrendingDown size={28} />,
                value: "33%",
                label: "menos productividad",
                desc: "Por el impacto directo del estrés crónico en los equipos.",
                accent: "#ec4899",
                glow: "rgba(236,72,153,0.15)",
                bar: 33,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="relative overflow-hidden bg-[#0d1117] border border-white/8 rounded-3xl p-7 group cursor-default"
              >
                <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full blur-2xl opacity-60 transition-opacity duration-500 group-hover:opacity-90"
                  style={{ background: item.glow }} />
                <div className="relative w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: `${item.accent}20`, border: `1px solid ${item.accent}35`, color: item.accent }}>
                  {item.icon}
                </div>
                <div className="relative text-5xl font-black mb-1 leading-none" style={{ color: item.accent }}>
                  {item.value}
                </div>
                <div className="relative text-sm font-bold text-white mt-2 mb-1">{item.label}</div>
                <p className="relative text-slate-400 text-sm leading-relaxed mb-5">{item.desc}</p>
                <div className="relative h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.bar}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.15, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${item.accent}, ${item.accent}88)` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-8 relative overflow-hidden bg-gradient-to-r from-emerald-950/60 via-[#0d1117] to-cyan-950/40 border border-emerald-500/20 rounded-3xl px-8 py-7 flex flex-col md:flex-row items-center justify-between gap-5"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.07)_0%,transparent_70%)]" />
          <div className="relative flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-[0_0_25px_rgba(16,185,129,0.4)]">
              <Sparkles size={22} className="text-black" />
            </div>
            <div>
              <div className="font-bold text-white text-lg">Es momento de cambiar esta realidad.</div>
              <div className="text-slate-400 text-sm">BetterSport lo hace posible con deporte sostenible y estrategia ESG.</div>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="relative">
            <Link href="/register"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold px-7 py-3.5 rounded-2xl text-sm shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] transition-all">
              Transformar mi empresa <ArrowRight size={16} />
            </Link>
          </motion.div>
        </motion.div>
      </Section>

      {/* ── SOLUCIÓN ─────────────────────────────────────────────── */}
      <Section id="solución" className="py-24 px-6 bg-gradient-to-b from-transparent via-emerald-950/20 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <span className="text-emerald-400 text-sm font-semibold tracking-widest uppercase">Nuestra Solución</span>
              <h2 className="text-4xl md:text-5xl font-black mt-3 mb-6 leading-tight">
                Sport & Sustainability{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">360°</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                En BetterSport, ayudamos a las empresas a mejorar el bienestar de sus colaboradores
                diseñando experiencias deportivas sostenibles que impactan positivamente la salud,
                la cultura organizacional y el compromiso corporativo.
              </p>
              <div className="flex flex-wrap gap-3">
                {["Programas Anuales", "Eventos Puntuales", "ESG Alineado"].map((tag) => (
                  <span key={tag} className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm px-4 py-1.5 rounded-full font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {solutions.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="flex items-start gap-4 bg-white/4 backdrop-blur-sm border border-white/8 rounded-xl p-4 hover:border-emerald-400/25 hover:bg-white/6 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 bg-emerald-500/15 border border-emerald-500/25 rounded-xl flex items-center justify-center text-emerald-400 flex-shrink-0 group-hover:bg-emerald-500/25 transition-colors">
                    {s.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm mb-1">{s.title}</div>
                    <div className="text-slate-400 text-sm leading-relaxed">{s.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── IMPACT STATS ─────────────────────────────────────────── */}
      <section id="impacto" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-emerald-400 text-sm font-semibold tracking-widest uppercase">Nuestro Impacto</span>
            <h2 className="text-4xl md:text-5xl font-black mt-3">Números que hablan por sí solos</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <StatCard value={30000} suffix="+" label="Empleados Impactados" description="Positivamente por nuestros programas a nivel global." icon={<Users size={22} />} />
            <StatCard value={150} suffix="+" label="Eventos Ejecutados" description="Deportivos y de bienestar con impacto real y medible." icon={<Trophy size={22} />} />
            <StatCard value={85} suffix="%" label="Mejora Productividad" description="Empresas que reportaron mejoras en productividad y bienestar." icon={<TrendingUp size={22} />} />
            <StatCard value={40} suffix="%" label="Más Participación" description="Incremento en la participación de empleados en los programas." icon={<Activity size={22} />} />
          </div>
        </div>
      </section>

      {/* ── ESG CHARTS ───────────────────────────────────────────── */}
      <ESGChartSection />

      {/* ── POR QUÉ ELEGIRNOS ────────────────────────────────────── */}
      <Section id="beneficios" className="py-24 px-6 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-emerald-400 text-sm font-semibold tracking-widest uppercase">Diferenciadores</span>
            <h2 className="text-4xl md:text-5xl font-black mt-3">¿Por qué elegir BetterSport?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {whyUs.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-cyan-500/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-white/4 backdrop-blur-sm border border-white/8 rounded-3xl p-8 h-full hover:border-emerald-400/25 transition-all duration-300">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                    <div className="text-black">{item.icon}</div>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Benefits grid */}
          <div className="bg-white/3 border border-white/8 rounded-3xl p-8">
            <h3 className="text-2xl font-bold mb-8 text-center">Beneficios para las Empresas</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {benefits.map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center group"
                >
                  <div className="w-12 h-12 bg-emerald-500/15 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 mx-auto mb-3 group-hover:bg-emerald-500/25 transition-colors">
                    {b.icon}
                  </div>
                  <div className="font-semibold text-sm mb-1">{b.title}</div>
                  <div className="text-slate-400 text-xs leading-relaxed">{b.desc}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── CASOS DE ÉXITO ───────────────────────────────────────── */}
      <Section id="casos-de-éxito" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-emerald-400 text-sm font-semibold tracking-widest uppercase">Casos de Éxito</span>
            <h2 className="text-4xl md:text-5xl font-black mt-3 mb-4">
              Resultados que transforman
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Impulsamos el deporte como motor de impacto sostenible. Descubre cómo ayudamos a
              organizaciones a fortalecer su cultura y reducir su huella de carbono.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {cases.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="group relative overflow-hidden bg-white/4 border border-white/8 rounded-3xl p-8 hover:border-white/15 transition-all duration-300"
              >
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${c.gradient}`} />
                <div className={`absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br ${c.gradient} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity`} />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${c.gradient} flex items-center justify-center`}>
                      <Award size={18} className="text-black" />
                    </div>
                    <h3 className="text-xl font-bold">{c.title}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {c.stats.map((stat, j) => (
                      <div key={j} className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                        {stat}
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      className={`flex items-center gap-2 bg-gradient-to-r ${c.gradient} text-black text-sm font-semibold px-5 py-2.5 rounded-xl`}
                    >
                      <Play size={14} /> Ver caso
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── SUSTAINABILITY METRICS ───────────────────────────────── */}
      <Section className="py-20 px-6">
        <div className="max-w-6xl mx-auto bg-gradient-to-br from-emerald-950/50 to-cyan-950/30 border border-emerald-500/15 rounded-3xl p-10 md:p-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-emerald-400 text-sm font-semibold tracking-widest uppercase">Sostenibilidad Real</span>
              <h2 className="text-3xl md:text-4xl font-black mt-3 mb-5">
                Comprometidos con el planeta y las personas
              </h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                Nuestros programas son cero residuos. Trabajamos bajo los pilares ESG
                (ambiental, social y gobernanza) con un compromiso firme de reducir la
                huella de carbono en las empresas participantes.
              </p>
              <div className="flex flex-wrap gap-3">
                {["Cero Residuos", "Huella Compensada", "ESG Certificado", "Inclusión Activa"].map((tag) => (
                  <span key={tag} className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <Recycle size={20} />, label: "Residuos Reciclados", value: "100%", sub: "en eventos ejecutados" },
                { icon: <Globe size={20} />, label: "Huella Compensada", value: "Neutral", sub: "carbono en programas" },
                { icon: <Users size={20} />, label: "Inclusión Activa", value: "Sí", sub: "atletas paralímpicos" },
                { icon: <Shield size={20} />, label: "Certificación ESG", value: "A+", sub: "rating en sostenibilidad" },
              ].map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-black/30 border border-emerald-500/15 rounded-2xl p-5 text-center"
                >
                  <div className="text-emerald-400 flex justify-center mb-2">{m.icon}</div>
                  <div className="text-xl font-black text-white">{m.value}</div>
                  <div className="text-xs text-emerald-400 font-medium">{m.label}</div>
                  <div className="text-xs text-slate-500 mt-1">{m.sub}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── CTA FINAL ────────────────────────────────────────────── */}
      <Section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/15 to-cyan-500/10 rounded-3xl blur-2xl" />
            <div className="relative bg-white/4 border border-white/10 rounded-3xl p-12 md:p-16 backdrop-blur-sm">
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 text-emerald-400 text-sm font-medium mb-6">
                <Star size={14} /> Únete al movimiento
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-5 leading-tight">
                "Transformemos juntos el futuro del deporte."
              </h2>
              <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
                Se parte del cambio hacia un deporte sostenible. Contáctanos hoy y
                hagamos realidad el cambio que el planeta y las comunidades necesitan.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Link href="/register"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold px-8 py-4 rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.35)] hover:shadow-[0_0_60px_rgba(16,185,129,0.55)] transition-all duration-300">
                    Comenzar gratis <ArrowRight size={18} />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04 }}>
                  <a href="https://www.bettersport.cl/contacto" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-white/15 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/5 transition-all duration-300">
                    Enviar mensaje
                  </a>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-2">
            <div className="mb-4">
              <img src="/logo.svg" alt="BetterSport" className="h-8 w-auto object-contain" style={{ filter: "brightness(0) invert(1)" }} />
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                Transformamos eventos deportivos en plataformas de impacto positivo,
                alineando estrategia ESG con bienestar organizacional.
              </p>
              <div className="flex gap-3 mt-5">
                {[
                  { icon: <Instagram size={16} />, href: "https://www.instagram.com/bettersport.cl/" },
                  { icon: <Youtube size={16} />, href: "https://www.youtube.com/@bettersport1546" },
                  { icon: <Linkedin size={16} />, href: "https://www.linkedin.com/company/bettersport/" },
                ].map((s, i) => (
                  <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm text-white mb-4">Navegación</h4>
              <div className="flex flex-col gap-2 text-sm text-slate-400">
                {["Home", "Eventos", "Galería", "Quiénes somos", "Contacto"].map((link) => (
                  <a key={link} href="#" className="hover:text-emerald-400 transition-colors">{link}</a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm text-white mb-4">Plataforma</h4>
              <div className="flex flex-col gap-2 text-sm text-slate-400">
                {[
                  { label: "Iniciar sesión", href: "/login" },
                  { label: "Registrarse", href: "/register" },
                  { label: "Dashboard", href: "/dashboard" },
                ].map((link) => (
                  <Link key={link.label} href={link.href} className="hover:text-emerald-400 transition-colors">{link.label}</Link>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <span>© 2025 BETTER SPORTS. Todos los derechos reservados.</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-slate-300 transition-colors">Términos</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Privacidad</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
