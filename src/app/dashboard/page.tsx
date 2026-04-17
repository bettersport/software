"use client";

import { motion } from "framer-motion";
import {
  Leaf, Trophy, ShoppingBag, TrendingUp, ArrowUpRight, AlertTriangle,
  CheckCircle, Clock, Zap, BarChart3, Target, Users, Brain,
  Shield, FileCheck, Building2, DollarSign, Eye, Briefcase, ClipboardCheck,
} from "lucide-react";
import { StatCard, ProgressBar, SectionHeader } from "@/components/ui";
import { mockESGProjects, mockClubs, mockEvents, categoryLabels, categoryColors, categoryIcons } from "@/lib/data";
import { getStatusColor, getStatusLabel, cn } from "@/lib/utils";
import { useUser } from "@/lib/userContext";
import Link from "next/link";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar,
} from "recharts";

// Static compliance scores per club (replaces Math.random())
const clubComplianceScores: Record<string, number> = {
  c1: 97, c2: 92, c3: 88, c4: 85, c5: 82, c6: 78, c7: 75, c8: 71, c9: 68, c10: 65,
};

// Static brand collaboration data (replaces Math.random())
const brandCollabProgress = [72, 88, 55, 91];
const brandCollabInvested = [32, 48, 28, 41];

const radarData = [
  { subject: "Ambiental", value: 87 },
  { subject: "Social", value: 84 },
  { subject: "Gobernanza", value: 83 },
  { subject: "Transparencia", value: 87 },
  { subject: "Innovación", value: 75 },
];

const progressData = [
  { month: "Ene", score: 72 },
  { month: "Feb", score: 74 },
  { month: "Mar", score: 76 },
  { month: "Abr", score: 78 },
  { month: "May", score: 80 },
  { month: "Jun", score: 83 },
  { month: "Jul", score: 85 },
  { month: "Ago", score: 85 },
];

const platformGrowthData = [
  { month: "Ene", clubs: 180, events: 42 },
  { month: "Feb", clubs: 195, events: 56 },
  { month: "Mar", clubs: 210, events: 61 },
  { month: "Abr", clubs: 230, events: 73 },
  { month: "May", clubs: 248, events: 82 },
  { month: "Jun", clubs: 260, events: 88 },
  { month: "Jul", clubs: 272, events: 94 },
  { month: "Ago", clubs: 280, events: 101 },
];

const investmentData = [
  { category: "Ambiental", invested: 45000, roi: 320 },
  { category: "Social", invested: 32000, roi: 280 },
  { category: "Gobernanza", invested: 18000, roi: 190 },
  { category: "Deportivo", invested: 52000, roi: 410 },
];

const alerts = [
  { type: "warning", msg: "KPI Consumo hídrico supera el límite mensual", time: "Hace 5h" },
  { type: "success", msg: "Proyecto 'Inclusión Social' alcanzó hito mensual", time: "Hace 1d" },
  { type: "info", msg: "Nueva propuesta de patrocinio de ESPN recibida", time: "Hace 2d" },
];

const adminAlerts = [
  { type: "warning", msg: "3 clubes con KPIs atrasados esta semana", time: "Hace 2h" },
  { type: "success", msg: "Plataforma alcanzó 280 clubes registrados", time: "Hace 6h" },
  { type: "info", msg: "12 nuevos eventos publicados en marketplace", time: "Hace 1d" },
];

const auditorAlerts = [
  { type: "warning", msg: "Club Deportivo Alavés — evidencia pendiente en 2 KPIs", time: "Hace 3h" },
  { type: "info", msg: "FC Barcelona completó auditoría Q3 satisfactoriamente", time: "Hace 1d" },
  { type: "success", msg: "Real Betis alcanzó 100% de cumplimiento documental", time: "Hace 2d" },
];

const quickActionsMap: Record<string, { label: string; icon: React.ReactNode; href: string; color: string }[]> = {
  admin: [
    { label: "Gestionar clubes", icon: <Building2 size={15} />, href: "/ranking", color: "#3B82F6" },
    { label: "Ver eventos", icon: <ShoppingBag size={15} />, href: "/marketplace", color: "#06B6D4" },
    { label: "Ranking global", icon: <Trophy size={15} />, href: "/ranking", color: "#F59E0B" },
    { label: "Motor IA", icon: <Brain size={15} />, href: "/ai-strategy", color: "#8B5CF6" },
  ],
  club: [
    { label: "Nuevo proyecto ESG", icon: <Leaf size={15} />, href: "/esg/projects", color: "#10B981" },
    { label: "Publicar evento", icon: <ShoppingBag size={15} />, href: "/marketplace/my-events", color: "#06B6D4" },
    { label: "Ver ranking", icon: <Trophy size={15} />, href: "/ranking", color: "#F59E0B" },
    { label: "Motor IA", icon: <Brain size={15} />, href: "/ai-strategy", color: "#8B5CF6" },
  ],
  brand: [
    { label: "Explorar clubes", icon: <Building2 size={15} />, href: "/ranking", color: "#10B981" },
    { label: "Marketplace", icon: <ShoppingBag size={15} />, href: "/marketplace", color: "#06B6D4" },
    { label: "Mis proyectos", icon: <Briefcase size={15} />, href: "/brands/projects", color: "#8B5CF6" },
    { label: "Ranking clubes", icon: <Trophy size={15} />, href: "/brands/ranking", color: "#F59E0B" },
  ],
  manager: [
    { label: "Gestión ESG", icon: <Leaf size={15} />, href: "/esg/projects", color: "#10B981" },
    { label: "Marketplace", icon: <ShoppingBag size={15} />, href: "/marketplace", color: "#06B6D4" },
    { label: "Ranking", icon: <Trophy size={15} />, href: "/ranking", color: "#F59E0B" },
    { label: "Motor IA", icon: <Brain size={15} />, href: "/ai-strategy", color: "#8B5CF6" },
  ],
  auditor: [
    { label: "Verificar clubes", icon: <ClipboardCheck size={15} />, href: "/ranking", color: "#10B981" },
    { label: "Documentos", icon: <FileCheck size={15} />, href: "/esg/documents", color: "#3B82F6" },
    { label: "KPIs", icon: <BarChart3 size={15} />, href: "/esg/kpis", color: "#F59E0B" },
    { label: "Ranking", icon: <Trophy size={15} />, href: "/ranking", color: "#8B5CF6" },
  ],
};

export default function DashboardPage() {
  const { activeUser } = useUser();
  const role = activeUser.role;
  const myClub = mockClubs.find((c) => c.id === activeUser.clubId) ?? mockClubs[3];
  const activeProjects = mockESGProjects.filter((p) => p.status === "in_progress");
  const openEvents = mockEvents.filter((e) => e.status === "negotiating").slice(0, 2);
  const quickActions = quickActionsMap[role] || quickActionsMap.club;

  const roleSubtitle: Record<string, string> = {
    admin:   "Panel de administración · Vista global de la plataforma",
    club:    `${myClub.name} · ${myClub.flag} ${myClub.country}`,
    brand:   `${activeUser.club} · Panel de marca patrocinadora`,
    manager: `${activeUser.club} · Gestionando múltiples clubes`,
    auditor: `${activeUser.club} · Modo auditoría (solo lectura)`,
  };

  const greeting = new Date().getHours() < 13 ? "Buenos días" : new Date().getHours() < 20 ? "Buenas tardes" : "Buenas noches";

  /* ── Role-specific stat cards ── */
  const statCards: Record<string, React.ReactNode> = {
    admin: (
      <>
        <StatCard title="Clubes registrados" value="280" subtitle="en la plataforma" icon={<Building2 size={20} />} trend={{ value: 12, label: "este mes" }} color="green" delay={0} />
        <StatCard title="Eventos activos" value="101" subtitle="en marketplace" icon={<ShoppingBag size={20} />} trend={{ value: 8, label: "nuevos" }} color="cyan" delay={0.1} />
        <StatCard title="Revenue YTD" value="$1.2M" subtitle="ingresos totales" icon={<DollarSign size={20} />} trend={{ value: 24, label: "vs año anterior" }} color="purple" delay={0.2} />
        <StatCard title="Prom. ESG global" value="76.4" subtitle="/ 100 puntos" icon={<Leaf size={20} />} trend={{ value: 4.1, label: "vs trimestre" }} color="orange" delay={0.3} />
      </>
    ),
    club: (
      <>
        <StatCard title="Puntaje ESG" value={myClub.esgScore.toFixed(1)} subtitle="/ 100 puntos" icon={<Leaf size={20} />} trend={{ value: 3.2, label: "vs mes anterior" }} color="green" delay={0} />
        <StatCard title="Posición ranking" value={`#${myClub.ranking}`} subtitle="de 280 clubes" icon={<Trophy size={20} />} trend={{ value: 2, label: "posiciones ↑" }} color="orange" delay={0.1} />
        <StatCard title="Proyectos activos" value={activeProjects.length} subtitle="en ejecución" icon={<Target size={20} />} trend={{ value: 0, label: "este mes" }} color="cyan" delay={0.2} />
        <StatCard title="Patrocinios" value="$90K" subtitle="financiados este año" icon={<TrendingUp size={20} />} trend={{ value: 18, label: "vs año anterior" }} color="purple" delay={0.3} />
      </>
    ),
    brand: (
      <>
        <StatCard title="Patrocinios activos" value="8" subtitle="colaboraciones" icon={<Briefcase size={20} />} trend={{ value: 3, label: "nuevos este Q" }} color="green" delay={0} />
        <StatCard title="Inversión total" value="$147K" subtitle="este año" icon={<DollarSign size={20} />} trend={{ value: 32, label: "vs año anterior" }} color="cyan" delay={0.1} />
        <StatCard title="ROI promedio" value="340%" subtitle="retorno social" icon={<TrendingUp size={20} />} trend={{ value: 15, label: "mejora" }} color="purple" delay={0.2} />
        <StatCard title="Clubes patrocinados" value="5" subtitle="en la red" icon={<Building2 size={20} />} trend={{ value: 2, label: "este trimestre" }} color="orange" delay={0.3} />
      </>
    ),
    manager: (
      <>
        <StatCard title="Clubes gestionados" value="6" subtitle="bajo consultoría" icon={<Building2 size={20} />} trend={{ value: 1, label: "nuevo" }} color="green" delay={0} />
        <StatCard title="Prom. ESG clubes" value="79.8" subtitle="/ 100 puntos" icon={<Leaf size={20} />} trend={{ value: 5.4, label: "mejora Q3" }} color="cyan" delay={0.1} />
        <StatCard title="Proyectos supervisados" value="14" subtitle="en ejecución" icon={<Target size={20} />} trend={{ value: 3, label: "este mes" }} color="orange" delay={0.2} />
        <StatCard title="Presupuesto total" value="$420K" subtitle="gestionado" icon={<DollarSign size={20} />} trend={{ value: 22, label: "vs Q anterior" }} color="purple" delay={0.3} />
      </>
    ),
    auditor: (
      <>
        <StatCard title="Auditorías completadas" value="23" subtitle="este trimestre" icon={<ClipboardCheck size={20} />} trend={{ value: 5, label: "este mes" }} color="green" delay={0} />
        <StatCard title="Pendientes" value="7" subtitle="revisiones activas" icon={<Clock size={20} />} trend={{ value: -2, label: "vs mes anterior" }} color="orange" delay={0.1} />
        <StatCard title="Cumplimiento" value="91%" subtitle="promedio plataforma" icon={<Shield size={20} />} trend={{ value: 3, label: "mejora" }} color="cyan" delay={0.2} />
        <StatCard title="Alertas de riesgo" value="4" subtitle="requieren atención" icon={<AlertTriangle size={20} />} trend={{ value: -1, label: "menos que ayer" }} color="purple" delay={0.3} />
      </>
    ),
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 lg:space-y-10">
      {/* ── Welcome header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
      >
        <div>
          <h1 className="text-[22px] sm:text-[28px] lg:text-[34px] font-extrabold" style={{ color: "#0F172A", letterSpacing: "-0.03em" }}>
            {greeting}, {activeUser.name.split(" ")[0]} 👋
          </h1>
          <p className="text-[15px] mt-2" style={{ color: "#64748B" }}>
            {roleSubtitle[role]} · {new Date().toLocaleDateString("es-CL", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          {quickActions.map((a) => (
            <Link
              key={a.label}
              href={a.href}
              className="flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:shadow-md hover:scale-[1.02]"
              style={{ backgroundColor: a.color + "10", color: a.color, border: `1px solid ${a.color}20` }}
            >
              {a.icon}
              <span className="hidden xl:inline">{a.label}</span>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* ── Role badge ── */}
      {role === "auditor" && (
        <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: "#FFF7ED", border: "1px solid #FED7AA" }}>
          <Eye size={18} className="text-amber-500" />
          <p className="text-sm font-medium text-amber-700">Modo auditoría — Solo lectura. Los datos mostrados son verificables.</p>
        </div>
      )}

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statCards[role] || statCards.club}
      </div>

      {/* ── Charts row ── */}
      {(role === "club" || role === "manager") && (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-7">
        {/* Radar */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card p-8">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-base" style={{ color: "#0F172A" }}>Perfil ESG</h3>
            <span className="badge badge-green">85.3 pts</span>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }} />
              <Radar name="ESG" dataKey="value" stroke="#10B981" fill="#10B981" fillOpacity={0.12} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-3 mt-4 pt-4" style={{ borderTop: "1px solid #f1f5f9" }}>
            {[
              { label: "Ambiental", value: 87, color: "#10B981" },
              { label: "Social", value: 84, color: "#06B6D4" },
              { label: "Gobernanza", value: 83, color: "#8B5CF6" },
              { label: "Transparencia", value: 87, color: "#F59E0B" },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span style={{ color: "#64748b" }}>{item.label}</span>
                  <span style={{ color: item.color }} className="font-bold">{item.value}</span>
                </div>
                <ProgressBar value={item.value} color={item.color} showPercent={false} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Area chart */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card p-8 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-base" style={{ color: "#0F172A" }}>Evolución puntaje ESG</h3>
            <span className="badge badge-cyan">Últimos 8 meses</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={progressData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} domain={[60, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: "#fff", border: "1px solid #E2E8F0", borderRadius: "12px", color: "#0F172A", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", padding: "10px 14px", fontSize: "13px" }}
                formatter={(value) => [`${value} pts`, "Puntaje"]}
              />
              <Area type="monotone" dataKey="score" stroke="#10B981" strokeWidth={2.5} fill="url(#colorScore)" dot={{ fill: "#10B981", strokeWidth: 0, r: 4 }} activeDot={{ r: 6, fill: "#10B981", strokeWidth: 2, stroke: "#fff" }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
      )}

      {/* ── Admin charts ── */}
      {role === "admin" && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-7">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card p-8">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-base" style={{ color: "#0F172A" }}>Crecimiento de la plataforma</h3>
            <span className="badge badge-green">2024</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={platformGrowthData}>
              <defs>
                <linearGradient id="colorClubs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #E2E8F0", borderRadius: "12px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", padding: "10px 14px", fontSize: "13px" }} />
              <Area type="monotone" dataKey="clubs" name="Clubes" stroke="#3B82F6" strokeWidth={2} fill="url(#colorClubs)" />
              <Area type="monotone" dataKey="events" name="Eventos" stroke="#10B981" strokeWidth={2} fill="none" strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card p-8">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-base" style={{ color: "#0F172A" }}>Top clubes por ESG</h3>
            <span className="badge badge-cyan">{mockClubs.length} clubes</span>
          </div>
          <div className="space-y-4">
            {mockClubs.slice(0, 6).map((club, i) => (
              <div key={club.id} className="flex items-center gap-3">
                <span className="text-sm w-6 text-center font-bold" style={{ color: i < 3 ? "#0f172a" : "#94a3b8" }}>
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`}
                </span>
                <span className="text-sm">{club.flag}</span>
                <p className="text-sm font-medium flex-1 truncate" style={{ color: "#475569" }}>{club.name}</p>
                <div className="w-24">
                  <ProgressBar value={club.esgScore} showPercent={false} height={4} />
                </div>
                <span className="text-sm font-bold tabular-nums" style={{ color: "#10B981" }}>{club.esgScore}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      )}

      {/* ── Brand charts ── */}
      {role === "brand" && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-7">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card p-8">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-base" style={{ color: "#0F172A" }}>Inversión por categoría</h3>
            <span className="badge badge-green">YTD</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={investmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="category" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #E2E8F0", borderRadius: "12px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", padding: "10px 14px", fontSize: "13px" }} />
              <Bar dataKey="invested" name="Inversión ($)" fill="#06B6D4" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card p-8">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-base" style={{ color: "#0F172A" }}>Clubes recomendados para patrocinio</h3>
            <span className="badge badge-cyan">Por ESG score</span>
          </div>
          <div className="space-y-4">
            {mockClubs.slice(0, 5).map((club) => (
              <div key={club.id} className="flex items-center gap-4 p-4 rounded-xl transition-colors hover:bg-slate-50" style={{ border: "1px solid #f1f5f9" }}>
                <span className="text-lg">{club.flag}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: "#0f172a" }}>{club.name}</p>
                  <p className="text-xs" style={{ color: "#94a3b8" }}>{club.country} · {club.sport}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold" style={{ color: "#10B981" }}>{club.esgScore}</p>
                  <p className="text-xs" style={{ color: "#94a3b8" }}>ESG score</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      )}

      {/* ── Auditor charts ── */}
      {role === "auditor" && (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-7">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card p-8 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-base" style={{ color: "#0F172A" }}>Cumplimiento por club (últimas auditorías)</h3>
            <span className="badge badge-green">Q3 2024</span>
          </div>
          <div className="space-y-4">
            {mockClubs.slice(0, 6).map((club) => {
              const compliance = clubComplianceScores[club.id] ?? 80;
              return (
                <div key={club.id} className="flex items-center gap-3">
                  <span className="text-sm">{club.flag}</span>
                  <p className="text-sm font-medium w-40 truncate" style={{ color: "#475569" }}>{club.name}</p>
                  <div className="flex-1">
                    <ProgressBar value={compliance} color={compliance > 90 ? "#10B981" : compliance > 80 ? "#F59E0B" : "#EF4444"} showPercent={false} height={6} />
                  </div>
                  <span className="text-sm font-bold tabular-nums w-12 text-right" style={{ color: compliance > 90 ? "#10B981" : compliance > 80 ? "#F59E0B" : "#EF4444" }}>{compliance}%</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${compliance > 90 ? "bg-emerald-50 text-emerald-600" : compliance > 80 ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"}`}>
                    {compliance > 90 ? "Conforme" : compliance > 80 ? "Parcial" : "Riesgo"}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card p-8">
          <h3 className="font-bold text-base mb-5" style={{ color: "#0F172A" }}>Resumen de auditoría</h3>
          {[
            { label: "Documentos verificados", value: "156", icon: <FileCheck size={16} />, color: "#10B981" },
            { label: "KPIs auditados", value: "89", icon: <BarChart3 size={16} />, color: "#3B82F6" },
            { label: "No conformidades", value: "12", icon: <AlertTriangle size={16} />, color: "#F59E0B" },
            { label: "Acciones correctivas", value: "8", icon: <CheckCircle size={16} />, color: "#8B5CF6" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 py-3" style={{ borderBottom: "1px solid #f1f5f9" }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: item.color + "10" }}>
                <span style={{ color: item.color }}>{item.icon}</span>
              </div>
              <div className="flex-1">
                <p className="text-xs" style={{ color: "#94a3b8" }}>{item.label}</p>
                <p className="text-sm font-bold" style={{ color: "#0f172a" }}>{item.value}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
      )}

      {/* ── Projects + Alerts — club/manager/admin ── */}
      {(role === "club" || role === "manager" || role === "admin") && (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-7">
        {/* Active projects */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="card p-8 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-base flex items-center gap-3" style={{ color: "#0F172A" }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#ECFDF5" }}>
                <Target size={16} style={{ color: "#059669" }} />
              </div>
              {role === "admin" ? "Proyectos ESG recientes (plataforma)" : "Proyectos ESG activos"}
            </h3>
            <Link href="/esg/projects" className="text-sm font-semibold flex items-center gap-1.5 transition-colors hover:underline" style={{ color: "#3B82F6" }}>
              Ver todos <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="space-y-5">
            {mockESGProjects.map((project) => (
              <div key={project.id} className="p-5 rounded-xl" style={{ backgroundColor: "#F8FAFC", border: "1px solid #F1F5F9" }}>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{categoryIcons[project.category]}</span>
                    <div>
                      <p className="text-sm font-bold" style={{ color: "#0f172a" }}>{project.title}</p>
                      <p className="text-xs mt-1" style={{ color: "#94a3b8" }}>Resp: {project.responsible}</p>
                    </div>
                  </div>
                  <span className={getStatusColor(project.status)}>{getStatusLabel(project.status)}</span>
                </div>
                <ProgressBar value={project.progress} showPercent={true} label={categoryLabels[project.category]} />
                <div className="flex items-center gap-5 mt-3 pt-3" style={{ borderTop: "1px solid #F1F5F9" }}>
                  <span className="text-xs" style={{ color: "#94a3b8" }}>Presupuesto: <span className="font-semibold" style={{ color: "#0f172a" }}>${project.budget.toLocaleString()}</span></span>
                  <span className="text-xs" style={{ color: "#94a3b8" }}>Gastado: <span className="font-semibold" style={{ color: "#059669" }}>${project.spent.toLocaleString()}</span></span>
                  <span className="text-xs ml-auto" style={{ color: "#94A3B8" }}>Hasta: {new Date(project.endDate).toLocaleDateString("es-CL")}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Sidebar column */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="space-y-6">
          {/* Alerts */}
          <div className="card p-8">
            <h3 className="font-bold text-base flex items-center gap-3 mb-6" style={{ color: "#0F172A" }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#FFF7ED" }}>
                <AlertTriangle size={16} style={{ color: "#d97706" }} />
              </div>
              Alertas y avisos
            </h3>
            <div className="space-y-5">
              {(role === "admin" ? adminAlerts : alerts).map((alert, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 flex-shrink-0">
                    {alert.type === "warning" && <AlertTriangle size={16} className="text-amber-400" />}
                    {alert.type === "success" && <CheckCircle size={16} className="text-teal-600" />}
                    {alert.type === "info" && <Zap size={16} className="text-blue-400" />}
                  </div>
                  <div>
                    <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>{alert.msg}</p>
                    <p className="text-xs mt-1.5" style={{ color: "#94A3B8" }}>{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ranking */}
          <div className="card p-8">
            <h3 className="font-bold text-base flex items-center gap-3 mb-6" style={{ color: "#0F172A" }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#FFF7ED" }}>
                <Trophy size={16} style={{ color: "#D97706" }} />
              </div>
              Top 5 ranking
            </h3>
            <div className="space-y-3">
              {mockClubs.slice(0, 5).map((club, i) => (
                <div
                  key={club.id}
                  className="flex items-center gap-3 py-3 px-4 rounded-xl transition-colors"
                  style={club.id === myClub.id ? { backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0" } : {}}
                >
                  <span className="text-sm w-6 text-center flex-shrink-0 font-bold" style={{ color: i < 3 ? "#0f172a" : "#94a3b8" }}>
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`}
                  </span>
                  <span className="text-sm flex-shrink-0">{club.flag}</span>
                  <p
                    className={cn("text-[13px] flex-1 truncate", club.id === myClub.id ? "font-bold" : "font-medium")}
                    style={{ color: club.id === myClub.id ? "#059669" : "#475569" }}>
                    {club.name}
                  </p>
                  <span className={cn("text-[13px] font-bold flex-shrink-0 tabular-nums min-w-[36px] text-right")}
                    style={{ color: club.id === myClub.id ? "#059669" : "#94A3B8" }}>
                    {club.esgScore}
                  </span>
                </div>
              ))}
            </div>
            <Link href="/ranking" className="flex items-center justify-center gap-2 w-full mt-6 pt-5 text-sm font-semibold transition-colors hover:underline" style={{ color: "#3B82F6", borderTop: "1px solid #F1F5F9" }}>
              Ver ranking completo <ArrowUpRight size={13} />
            </Link>
          </div>
        </motion.div>
      </div>
      )}

      {/* ── Auditor alerts ── */}
      {role === "auditor" && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="card p-8">
          <h3 className="font-bold text-base flex items-center gap-3 mb-6" style={{ color: "#0F172A" }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#FFF7ED" }}>
              <AlertTriangle size={16} style={{ color: "#d97706" }} />
            </div>
            Alertas de auditoría
          </h3>
          <div className="space-y-5">
            {auditorAlerts.map((alert, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0">
                  {alert.type === "warning" && <AlertTriangle size={16} className="text-amber-400" />}
                  {alert.type === "success" && <CheckCircle size={16} className="text-teal-600" />}
                  {alert.type === "info" && <Zap size={16} className="text-blue-400" />}
                </div>
                <div>
                  <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>{alert.msg}</p>
                  <p className="text-xs mt-1.5" style={{ color: "#94A3B8" }}>{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Brand: active collaborations ── */}
      {role === "brand" && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="card p-8">
          <div className="flex items-center justify-between mb-7">
            <h3 className="font-bold text-base flex items-center gap-3" style={{ color: "#0F172A" }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#F0FDF4" }}>
                <Briefcase size={16} style={{ color: "#059669" }} />
              </div>
              Colaboraciones activas
            </h3>
            <Link href="/brands/projects" className="text-sm font-semibold flex items-center gap-1.5 transition-colors hover:underline" style={{ color: "#3B82F6" }}>
              Ver proyectos <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {mockClubs.slice(0, 4).map((club, idx) => (
              <div key={club.id} className="flex items-center gap-4 p-5 rounded-xl" style={{ backgroundColor: "#F8FAFC", border: "1px solid #F1F5F9" }}>
                <span className="text-2xl">{club.flag}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate" style={{ color: "#0f172a" }}>{club.name}</p>
                  <p className="text-xs mt-1" style={{ color: "#94a3b8" }}>Patrocinio ESG activo</p>
                  <ProgressBar value={brandCollabProgress[idx]} showPercent={true} height={4} />
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold" style={{ color: "#059669" }}>${brandCollabInvested[idx]}K</p>
                  <p className="text-xs" style={{ color: "#94a3b8" }}>invertido</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Marketplace preview — club/manager/admin ── */}
      {(role === "club" || role === "manager" || role === "admin") && (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="card p-8">
        <div className="flex items-center justify-between mb-7">
          <h3 className="font-bold text-base flex items-center gap-3" style={{ color: "#0F172A" }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#ECFEFF" }}>
              <ShoppingBag size={16} style={{ color: "#0891B2" }} />
            </div>
            Mis eventos en marketplace
          </h3>
          <Link href="/marketplace" className="text-sm font-semibold flex items-center gap-1.5 transition-colors hover:underline" style={{ color: "#3B82F6" }}>
            Ver marketplace <ArrowUpRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {openEvents.map((event) => (
            <div key={event.id} className="flex items-center gap-5 p-5 rounded-xl transition-all hover:shadow-md" style={{ backgroundColor: "#F8FAFC", border: "1px solid #F1F5F9" }}>
              <div
                className="w-20 h-20 rounded-2xl flex-shrink-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${event.image})` }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate" style={{ color: "#0f172a" }}>{event.title}</p>
                <span className={cn("text-xs", categoryColors[event.category])}>{categoryIcons[event.category]} {categoryLabels[event.category]}</span>
                <div className="mt-3">
                  <ProgressBar value={event.funded} max={event.budget} showPercent={false} height={4} />
                  <div className="flex justify-between text-xs mt-1.5">
                    <span className="font-semibold" style={{ color: "#059669" }}>${event.funded.toLocaleString()} financiado</span>
                    <span className="font-semibold" style={{ color: "#dc2626" }}>${event.remaining.toLocaleString()} restante</span>
                  </div>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="badge-orange text-xs">{event.daysLeft}d</div>
                <p className="text-[11px] mt-1.5" style={{ color: "#94A3B8" }}>restantes</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
      )}
    </div>
  );
}
