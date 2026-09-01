"use client";

import { motion } from "framer-motion";
import {
  Leaf, Trophy, ShoppingBag, TrendingUp, ArrowUpRight, AlertTriangle,
  CheckCircle, Clock, Zap, BarChart3, Target, Users, Brain,
  Shield, FileCheck, Building2, DollarSign, Eye, Briefcase, ClipboardCheck, Star, Wrench,
  FileText, TrendingDown, BarChart2,
} from "lucide-react";
import { StatCard, ProgressBar, SectionHeader } from "@/components/ui";
import { CategoryIcon } from "@/components/ui/icons";
import { categoryLabels, categoryColors, fanTiers } from "@/lib/data";
import { useResource } from "@/lib/useResource";
import { computeClubScore } from "@/lib/scoring";
import { useMemo } from "react";
import type { Club, ESGProject, Event as EventT, FanProfile } from "@/lib/types";
import { getStatusColor, getStatusLabel, cn } from "@/lib/utils";
import { useUser } from "@/lib/userContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell,
} from "recharts";

const NO_PROJECTS: ESGProject[] = [];
const NO_CLUBS: Club[] = [];
const NO_EVENTS: EventT[] = [];

type BrandProjectT = { id: string; brand: string; project: string; status: string; investment: number };
type SponsorLeadT = { id: string; brand: string; stage: string; amount: number };
type NotifT = { id: string; type: string; title: string; message: string; read: boolean; createdAt?: string };
type AdminStats = {
  clubs: number; events: number; brandInvestment: number;
  esgAvg: { esgScore: number | null } | null;
  growth: { month: string; clubs: number }[];
};
const NO_BRAND_PROJECTS: BrandProjectT[] = [];
const NO_LEADS: SponsorLeadT[] = [];
const NO_NOTIFS: NotifT[] = [];

const fmtMoney = (n: number) => `$${Math.round(n).toLocaleString()}`;
const relativeTime = (iso?: string) => {
  if (!iso) return "";
  const h = Math.floor((Date.now() - new Date(iso).getTime()) / 3_600_000);
  if (h < 1) return "Hace un momento";
  if (h < 24) return `Hace ${h}h`;
  return `Hace ${Math.floor(h / 24)}d`;
};
const FALLBACK_CLUB: Club = {
  id: "", name: "Mi organización", sport: "—", country: "—", flag: "",
  esgScore: 0, ranking: 0, environmental: 0, social: 0, governance: 0,
  transparency: 0, members: 0, founded: new Date().getFullYear(),
};

// Demo-only compliance scores per club (shown only to demo auditors)
const clubComplianceScores: Record<string, number> = {
  c1: 97, c2: 92, c3: 88, c4: 85, c5: 82, c6: 78, c7: 75, c8: 71, c9: 68, c10: 65,
};

// Demo-only brand collaboration data
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

const investmentData = [
  { category: "Ambiental", invested: 45000, roi: 320 },
  { category: "Social", invested: 32000, roi: 280 },
  { category: "Gobernanza", invested: 18000, roi: 190 },
  { category: "Deportivo", invested: 52000, roi: 410 },
];

const sportsPieData = [
  { name: "Fútbol", value: 60, color: "#10B981" },
  { name: "Rugby", value: 20, color: "#3B82F6" },
  { name: "Tenis", value: 20, color: "#F59E0B" },
];

const alerts = [
  { type: "warning", msg: "KPI Consumo hídrico supera el límite mensual", time: "Hace 5h" },
  { type: "success", msg: "Proyecto 'Inclusión Social' alcanzó hito mensual", time: "Hace 1d" },
  { type: "info", msg: "Nueva propuesta de patrocinio de ESPN recibida", time: "Hace 2d" },
];

const welcomeAlerts = [
  { type: "success", msg: "¡Bienvenido a BetterSport! Tu cuenta fue creada correctamente.", time: "Ahora" },
  { type: "info", msg: "Crea tu primer proyecto ESG para comenzar a construir tu puntaje.", time: "Ahora" },
];

// Demo-only auditor alerts
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
  solucion: [
    { label: "Catálogo", icon: <Wrench size={15} />, href: "/solutions", color: "#F97316" },
    { label: "Ver clubes", icon: <Building2 size={15} />, href: "/ranking", color: "#10B981" },
    { label: "Marketplace", icon: <ShoppingBag size={15} />, href: "/marketplace", color: "#06B6D4" },
    { label: "Ranking", icon: <Trophy size={15} />, href: "/ranking", color: "#F59E0B" },
  ],
  hincha: [
    { label: "Mi Fan Zone", icon: <Star size={15} />, href: "/fanzone", color: "#EC4899" },
    { label: "Ranking clubes", icon: <Trophy size={15} />, href: "/ranking", color: "#F59E0B" },
  ],
};

export default function DashboardPage() {
  const { activeUser, isDemo, loaded } = useUser();
  const role = activeUser?.role ?? "club";
  const clubId = activeUser?.clubId ?? null;

  const { data: projects } = useResource<ESGProject[]>(loaded && activeUser ? "/api/projects" : null, NO_PROJECTS);
  const { data: clubs } = useResource<Club[]>(loaded && activeUser ? "/api/clubs" : null, NO_CLUBS);
  const { data: rawEvents } = useResource<EventT[]>(loaded && activeUser ? "/api/events" : null, NO_EVENTS);
  const { data: notifications } = useResource<NotifT[]>(loaded && activeUser ? "/api/notifications" : null, NO_NOTIFS);
  const { data: adminStats } = useResource<AdminStats | null>(loaded && activeUser && role === "admin" ? "/api/admin/stats" : null, null);
  const { data: brandProjects } = useResource<BrandProjectT[]>(loaded && activeUser && role === "brand" ? "/api/brand-projects" : null, NO_BRAND_PROJECTS);
  const { data: leads } = useResource<SponsorLeadT[]>(
    loaded && activeUser && (role === "brand" || role === "club" || role === "manager") ? "/api/sponsor-leads" : null, NO_LEADS,
  );
  const { data: fanProfile } = useResource<FanProfile | null>(loaded && activeUser && role === "hincha" ? "/api/fan-profile" : null, null);
  const router = useRouter();

  const myClubBase = useMemo(() => clubs.find((c) => c.id === clubId), [clubs, clubId]);
  const liveClub = useMemo(() => (myClubBase ? computeClubScore(myClubBase, projects) : null), [myClubBase, projects]);
  const myClub = liveClub ?? FALLBACK_CLUB;
  const events = useMemo(() => rawEvents.map((e) => ({ ...e, remaining: e.budget - e.funded })), [rawEvents]);

  if (!loaded) return null;

  const activeProjects = projects.filter((p) => p.status === "in_progress");
  const openEvents = events.filter((e) => e.status === "negotiating").slice(0, 2);
  const quickActions = quickActionsMap[role] || quickActionsMap.club;
  // Whether this club account has any ESG data yet — drives empty vs. populated views.
  const hasClubData = projects.length > 0;
  // ESG profile values: demo uses the illustrative sample, real accounts use their live score.
  const clubRadar = isDemo ? radarData : [
    { subject: "Ambiental", value: liveClub?.environmental ?? 0 },
    { subject: "Social", value: liveClub?.social ?? 0 },
    { subject: "Gobernanza", value: liveClub?.governance ?? 0 },
    { subject: "Transparencia", value: liveClub?.transparency ?? 0 },
  ];

  // Real notifications → alert rows for the "Alertas y avisos" panel.
  const notifAlerts = notifications.slice(0, 5).map((n) => ({
    type: n.type === "error" ? "warning" : n.type,
    msg: n.title ? `${n.title}: ${n.message}` : n.message,
    time: relativeTime(n.createdAt),
  }));
  const panelAlerts = role === "admin"
    ? notifAlerts
    : notifAlerts.length > 0 ? notifAlerts : isDemo ? alerts : projects.length === 0 ? welcomeAlerts : [];

  // Real per-role figures.
  const activeBrandProjects = brandProjects.filter((p) => p.status === "Activo").length;
  const brandInvestmentTotal = brandProjects.reduce((a, p) => a + (Number(p.investment) || 0), 0);
  const closedSponsorships = leads.filter((l) => l.stage === "Cierre").reduce((a, l) => a + (Number(l.amount) || 0), 0);
  const fanTier = fanTiers.find((t) => t.name === fanProfile?.tier) ?? fanTiers[0];
  const growth = adminStats?.growth ?? [];
  const recommendedEvents = [...events].sort((a, b) => b.budget - a.budget).slice(0, 5);

  const roleSubtitle: Record<string, string> = {
    admin:    "Panel de administración · Vista global de la plataforma",
    club:     `${myClub.name} · ${myClub.flag} ${myClub.country}`,
    brand:    `${activeUser?.club ?? ""} · Panel de marca patrocinadora`,
    solucion: `${activeUser?.club ?? ""} · Proveedor de soluciones sostenibles`,
    hincha:   `Fan de ${activeUser?.club ?? ""} · Zona fan y recompensas`,
  };

  const greeting = new Date().getHours() < 13 ? "Buenos días" : new Date().getHours() < 20 ? "Buenas tardes" : "Buenas noches";

  /* ── Role-specific stat cards ── */
  const statCards: Record<string, React.ReactNode> = {
    admin: (
      <>
        <StatCard title="Clubes registrados" value={adminStats ? adminStats.clubs : "—"} subtitle="en la plataforma" icon={<Building2 size={20} />} color="green" delay={0} />
        <StatCard title="Eventos activos" value={adminStats ? adminStats.events : "—"} subtitle="en marketplace" icon={<ShoppingBag size={20} />} color="cyan" delay={0.1} />
        <StatCard title="Inversión de marcas" value={adminStats ? fmtMoney(adminStats.brandInvestment) : "—"} subtitle="en proyectos de marca" icon={<DollarSign size={20} />} color="purple" delay={0.2} />
        <StatCard title="Prom. ESG global" value={adminStats?.esgAvg?.esgScore != null ? adminStats.esgAvg.esgScore.toFixed(1) : "—"} subtitle="/ 100 puntos" icon={<Leaf size={20} />} color="orange" delay={0.3} />
      </>
    ),
    club: isDemo ? (
      <>
        <StatCard title="Puntaje ESG" value={myClub.esgScore.toFixed(1)} subtitle="/ 100 puntos" icon={<Leaf size={20} />} trend={{ value: 3.2, label: "vs mes anterior" }} color="green" delay={0} />
        <StatCard title="Posición ranking" value={`#${myClub.ranking}`} subtitle="de 280 clubes" icon={<Trophy size={20} />} trend={{ value: 2, label: "posiciones ↑" }} color="orange" delay={0.1} />
        <StatCard title="Proyectos activos" value={activeProjects.length} subtitle="en ejecución" icon={<Target size={20} />} trend={{ value: 0, label: "este mes" }} color="cyan" delay={0.2} />
        <StatCard title="Patrocinios" value="$90K" subtitle="financiados este año" icon={<TrendingUp size={20} />} trend={{ value: 18, label: "vs año anterior" }} color="purple" delay={0.3} />
      </>
    ) : (
      <>
        <StatCard title="Puntaje ESG" value={(liveClub?.esgScore ?? 0).toFixed(1)} subtitle="/ 100 puntos" icon={<Leaf size={20} />} color="green" delay={0} />
        <StatCard title="Posición ranking" value={liveClub && liveClub.ranking > 0 ? `#${liveClub.ranking}` : "—"} subtitle={liveClub && liveClub.ranking > 0 ? `de ${clubs.length} clubes` : "aún sin ranking"} icon={<Trophy size={20} />} color="orange" delay={0.1} />
        <StatCard title="Proyectos activos" value={activeProjects.length} subtitle="en ejecución" icon={<Target size={20} />} color="cyan" delay={0.2} />
        <StatCard title="Patrocinios" value={fmtMoney(closedSponsorships)} subtitle="cerrados con marcas" icon={<TrendingUp size={20} />} color="purple" delay={0.3} />
      </>
    ),
    brand: isDemo ? (
      <>
        <StatCard title="Patrocinios activos" value="8" subtitle="colaboraciones" icon={<Briefcase size={20} />} trend={{ value: 3, label: "nuevos este Q" }} color="green" delay={0} />
        <StatCard title="Inversión total" value="$147K" subtitle="este año" icon={<DollarSign size={20} />} trend={{ value: 32, label: "vs año anterior" }} color="cyan" delay={0.1} />
        <StatCard title="ROI promedio" value="340%" subtitle="retorno social" icon={<TrendingUp size={20} />} trend={{ value: 15, label: "mejora" }} color="purple" delay={0.2} />
        <StatCard title="Clubes patrocinados" value="5" subtitle="en la red" icon={<Building2 size={20} />} trend={{ value: 2, label: "este trimestre" }} color="orange" delay={0.3} />
      </>
    ) : (
      <>
        <StatCard title="Patrocinios activos" value={activeBrandProjects} subtitle="colaboraciones" icon={<Briefcase size={20} />} color="green" delay={0} />
        <StatCard title="Inversión total" value={fmtMoney(brandInvestmentTotal)} subtitle="en mis proyectos" icon={<DollarSign size={20} />} color="cyan" delay={0.1} />
        <StatCard title="ROI promedio" value="—" subtitle="sin datos aún" icon={<TrendingUp size={20} />} color="purple" delay={0.2} />
        <StatCard title="Clubes patrocinados" value="—" subtitle="sin datos aún" icon={<Building2 size={20} />} color="orange" delay={0.3} />
      </>
    ),
    solucion: isDemo ? (
      <>
        <StatCard title="Soluciones activas" value="12" subtitle="en clubes" icon={<Wrench size={20} />} trend={{ value: 4, label: "este mes" }} color="orange" delay={0} />
        <StatCard title="Clubes cliente" value="18" subtitle="en la red" icon={<Building2 size={20} />} trend={{ value: 3, label: "nuevos Q3" }} color="green" delay={0.1} />
        <StatCard title="Revenue YTD" value="$82K" subtitle="facturado" icon={<DollarSign size={20} />} trend={{ value: 27, label: "vs año anterior" }} color="cyan" delay={0.2} />
        <StatCard title="Valoración" value="4.8★" subtitle="de 5 estrellas" icon={<Star size={20} />} trend={{ value: 0.3, label: "mejora" }} color="purple" delay={0.3} />
      </>
    ) : (
      <>
        <StatCard title="Soluciones activas" value={0} subtitle="aún sin implementaciones registradas" icon={<Wrench size={20} />} color="orange" delay={0} />
        <StatCard title="Clubes cliente" value={0} subtitle="aún sin clubes vinculados" icon={<Building2 size={20} />} color="green" delay={0.1} />
        <StatCard title="Revenue YTD" value="—" subtitle="sin datos aún" icon={<DollarSign size={20} />} color="cyan" delay={0.2} />
        <StatCard title="Valoración" value="—" subtitle="sin valoraciones aún" icon={<Star size={20} />} color="purple" delay={0.3} />
      </>
    ),
    hincha: isDemo ? (
      <>
        <StatCard title="Puntos fan" value="1,240" subtitle="acumulados" icon={<Star size={20} />} trend={{ value: 120, label: "esta semana" }} color="purple" delay={0} />
        <StatCard title="Nivel" value="Plata" subtitle="Fan Zone" icon={<Trophy size={20} />} trend={{ value: 0, label: "próx. nivel: Oro" }} color="orange" delay={0.1} />
        <StatCard title="Acciones ESG" value="8" subtitle="completadas" icon={<Zap size={20} />} trend={{ value: 3, label: "este mes" }} color="green" delay={0.2} />
        <StatCard title="Recompensas" value="3" subtitle="disponibles" icon={<CheckCircle size={20} />} trend={{ value: 1, label: "nueva" }} color="cyan" delay={0.3} />
      </>
    ) : (
      <>
        <StatCard title="Puntos fan" value={(fanProfile?.points ?? 0).toLocaleString()} subtitle="acumulados" icon={<Star size={20} />} color="purple" delay={0} />
        <StatCard title="Nivel" value={fanTier.label} subtitle="Fan Zone" icon={<Trophy size={20} />} color="orange" delay={0.1} />
        <StatCard title="Acciones ESG" value={fanProfile?.completedActionIds?.length ?? 0} subtitle="completadas" icon={<Zap size={20} />} color="green" delay={0.2} />
        <StatCard title="Recompensas" value={fanProfile?.claimedRewardIds?.length ?? 0} subtitle="canjeadas" icon={<CheckCircle size={20} />} color="cyan" delay={0.3} />
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
          <h1 className="text-[22px] sm:text-[28px] lg:text-[34px] font-extrabold" style={{ color: "#f4f7fb", letterSpacing: "-0.03em" }}>
            {greeting}, {(activeUser?.name ?? "").split(" ")[0]} 👋
          </h1>
          <p className="text-[15px] mt-2" style={{ color: "#a8b3c4" }}>
            {roleSubtitle[role]} · {new Date().toLocaleDateString("es-CL", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
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
          {role === "brand" && (
            <>
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 4px 16px rgba(59,130,246,0.25)" }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all"
                style={{ backgroundColor: "rgba(59,130,246,0.08)", borderColor: "rgba(59,130,246,0.3)", color: "#3B82F6" }}
                onClick={() => router.push("/brands/projects")}
              >
                <FileText size={15} /> Solicitar Reporte Patrocinado
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 4px 16px rgba(139,92,246,0.25)" }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all"
                style={{ backgroundColor: "rgba(139,92,246,0.08)", borderColor: "rgba(139,92,246,0.3)", color: "#8B5CF6" }}
                onClick={() => router.push("/brands/config")}
              >
                <BarChart2 size={15} /> Performance Marketing
              </motion.button>
            </>
          )}
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
      {!(role === "auditor" && !isDemo) && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {statCards[role] || statCards.club}
        </div>
      )}

      {/* ── New club accounts with no ESG data yet ── */}
      {(role === "club" || role === "manager") && !isDemo && !hasClubData && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card p-10 text-center">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: "#ECFDF5" }}>
            <Leaf size={24} style={{ color: "#34d399" }} />
          </div>
          <h3 className="font-bold text-lg" style={{ color: "#f4f7fb" }}>Listo para crear tu estrategia ESG</h3>
          <p className="text-sm mt-2 max-w-md mx-auto" style={{ color: "#a8b3c4" }}>
            Todo parte por la estrategia: define tus desafíos, metas bajo estándares GRI y plan de inversión. De ahí nacen los proyectos que financian las marcas y alimentan tu Ranking.
          </p>
          <div className="flex items-center justify-center gap-3 mt-5 flex-wrap">
            <Link href="/ai-strategy" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold"
              style={{ background: "linear-gradient(100deg, #67e8f9, #22d3ee 55%, #a78bfa)", color: "#04121a" }}>
              <Brain size={15} /> Crear mi estrategia ESG
            </Link>
            <Link href="/esg/projects" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-slate-600"
              style={{ backgroundColor: "#161d29" }}>
              <Leaf size={15} /> Ir a proyectos
            </Link>
          </div>
        </motion.div>
      )}

      {/* ── Charts row ── */}
      {(role === "club" || role === "manager") && (isDemo || hasClubData) && (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-7">
        {/* Radar */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card p-8">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-base" style={{ color: "#f4f7fb" }}>Perfil ESG</h3>
            <span className="badge badge-green">{(isDemo ? 85.3 : (liveClub?.esgScore ?? 0)).toFixed(1)} pts</span>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <RadarChart data={clubRadar}>
              <PolarGrid stroke="#232c3a" strokeDasharray="3 3" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#a8b3c4", fontSize: 11, fontWeight: 500 }} />
              <Radar name="ESG" dataKey="value" stroke="#10B981" fill="#10B981" fillOpacity={0.12} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-3 mt-4 pt-4" style={{ borderTop: "1px solid #161d29" }}>
            {[
              { label: "Ambiental", value: clubRadar[0].value, color: "#10B981" },
              { label: "Social", value: clubRadar[1].value, color: "#06B6D4" },
              { label: "Gobernanza", value: clubRadar[2].value, color: "#8B5CF6" },
              { label: "Transparencia", value: clubRadar[3].value, color: "#F59E0B" },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span style={{ color: "#a8b3c4" }}>{item.label}</span>
                  <span style={{ color: item.color }} className="font-bold">{item.value}</span>
                </div>
                <ProgressBar value={item.value} color={item.color} showPercent={false} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Area chart — historical trend (demo only; real accounts have no history yet) */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card p-8 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-base" style={{ color: "#f4f7fb" }}>Evolución puntaje ESG</h3>
            <span className="badge badge-cyan">{isDemo ? "Últimos 8 meses" : "En construcción"}</span>
          </div>
          {isDemo ? (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={progressData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#161d29" />
                <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} domain={[60, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#10151f", border: "1px solid #232c3a", borderRadius: "12px", color: "#f4f7fb", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", padding: "10px 14px", fontSize: "13px" }}
                  formatter={(value) => [`${value} pts`, "Puntaje"]}
                />
                <Area type="monotone" dataKey="score" stroke="#10B981" strokeWidth={2.5} fill="url(#colorScore)" dot={{ fill: "#10B981", strokeWidth: 0, r: 4 }} activeDot={{ r: 6, fill: "#10B981", strokeWidth: 2, stroke: "#fff" }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center text-center" style={{ height: 260 }}>
              <p className="text-sm font-medium" style={{ color: "#a8b3c4" }}>Tu historial se construirá con el tiempo</p>
              <p className="text-xs mt-1.5 max-w-xs" style={{ color: "#94A3B8" }}>
                A medida que avances tus proyectos ESG, tu puntaje mensual se registrará aquí.
              </p>
            </div>
          )}
        </motion.div>
      </div>
      )}

      {/* ── Admin charts ── */}
      {role === "admin" && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-7">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card p-8">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-base" style={{ color: "#f4f7fb" }}>Crecimiento de la plataforma</h3>
            <span className="badge badge-green">{growth.length >= 2 ? `${growth.length} meses` : "En construcción"}</span>
          </div>
          {growth.length >= 2 ? (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={growth}>
                <defs>
                  <linearGradient id="colorClubs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#161d29" />
                <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: "#10151f", border: "1px solid #232c3a", borderRadius: "12px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", padding: "10px 14px", fontSize: "13px" }} />
                <Area type="monotone" dataKey="clubs" name="Clubes nuevos" stroke="#3B82F6" strokeWidth={2} fill="url(#colorClubs)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center text-center" style={{ height: 260 }}>
              <p className="text-sm font-medium" style={{ color: "#a8b3c4" }}>Historial en construcción</p>
              <p className="text-xs mt-1.5 max-w-xs" style={{ color: "#94A3B8" }}>
                El crecimiento mensual de clubes se mostrará cuando existan al menos dos meses de registros.
              </p>
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card p-8">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-base" style={{ color: "#f4f7fb" }}>Top clubes por ESG</h3>
            <span className="badge badge-cyan">{clubs.length} clubes</span>
          </div>
          <div className="space-y-4">
            {clubs.slice(0, 6).map((club, i) => (
              <div key={club.id} className="flex items-center gap-3">
                <span className="text-sm w-6 text-center font-bold" style={{ color: i < 3 ? "#0f172a" : "#94a3b8" }}>
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`}
                </span>
                <span className="text-sm">{club.flag}</span>
                <p className="text-sm font-medium flex-1 truncate" style={{ color: "#a8b3c4" }}>{club.name}</p>
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
      <div className="space-y-6">
        {!isDemo && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card p-10 text-center">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: "#ECFEFF" }}>
              <Briefcase size={24} style={{ color: "#22d3ee" }} />
            </div>
            <h3 className="font-bold text-lg" style={{ color: "#f4f7fb" }}>Aún no tienes patrocinios activos</h3>
            <p className="text-sm mt-2 max-w-md mx-auto" style={{ color: "#a8b3c4" }}>
              Explora los clubes y eventos recomendados para iniciar tu primera colaboración sostenible.
            </p>
            <Link href="/marketplace" className="inline-flex items-center gap-2 mt-5 px-5 py-3 rounded-xl text-sm font-semibold"
              style={{ background: "linear-gradient(100deg, #67e8f9, #22d3ee 55%, #a78bfa)", color: "#04121a" }}>
              <ShoppingBag size={15} /> Explorar marketplace
            </Link>
          </motion.div>
        )}
        {isDemo && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-7">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card p-8">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-base" style={{ color: "#f4f7fb" }}>Inversión por categoría</h3>
              <span className="badge badge-green">YTD</span>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={investmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#161d29" />
                <XAxis dataKey="category" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#10151f", border: "1px solid #232c3a", borderRadius: "12px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", padding: "10px 14px", fontSize: "13px" }} />
                <Bar dataKey="invested" name="Inversión ($)" fill="#06B6D4" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Sports distribution pie chart */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card p-8">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-base" style={{ color: "#f4f7fb" }}>Distribución por deporte</h3>
              <span className="badge badge-cyan">Inversión actual</span>
            </div>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="55%" height={220}>
                <PieChart>
                  <Pie data={sportsPieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                    {sportsPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#10151f", border: "1px solid #232c3a", borderRadius: "12px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", fontSize: "13px" }} formatter={(v) => [`${v}%`, ""]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-4">
                {sportsPieData.map((d) => (
                  <div key={d.name}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                        <span className="font-medium" style={{ color: "#a8b3c4" }}>{d.name}</span>
                      </div>
                      <span className="font-bold" style={{ color: d.color }}>{d.value}%</span>
                    </div>
                    <ProgressBar value={d.value} color={d.color} showPercent={false} height={4} />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-7">
          {/* Clubes recomendados */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="card p-8">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-base" style={{ color: "#f4f7fb" }}>Clubes recomendados para patrocinio</h3>
              <span className="badge badge-cyan">Por ESG score</span>
            </div>
            <div className="space-y-3">
              {clubs.slice(0, 5).map((club) => (
                <Link key={club.id} href="/brands/projects"
                  className="flex items-center gap-4 p-4 rounded-xl transition-all hover:bg-slate-50 hover:shadow-sm cursor-pointer group"
                  style={{ border: "1px solid #161d29" }}
                >
                  <span className="text-lg">{club.flag}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate group-hover:text-teal-600 transition-colors" style={{ color: "#f4f7fb" }}>{club.name}</p>
                    <p className="text-xs" style={{ color: "#94a3b8" }}>{club.country} · {club.sport}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold" style={{ color: "#10B981" }}>{club.esgScore}</p>
                    <p className="text-xs" style={{ color: "#94a3b8" }}>ESG score</p>
                  </div>
                  <ArrowUpRight size={14} className="text-slate-300 group-hover:text-teal-500 transition-colors flex-shrink-0" />
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Eventos recomendados para patrocinio */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="card p-8">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-base" style={{ color: "#f4f7fb" }}>Eventos recomendados para patrocinio</h3>
              <span className="badge badge-green">Por presupuesto</span>
            </div>
            {recommendedEvents.length === 0 && (
              <div className="text-center py-8">
                <p className="text-sm" style={{ color: "#94A3B8" }}>Aún no hay eventos publicados en el marketplace.</p>
              </div>
            )}
            <div className="space-y-3">
              {recommendedEvents.map((event) => (
                <Link key={event.id} href="/marketplace"
                  className="flex items-center gap-4 p-4 rounded-xl transition-all hover:bg-slate-50 hover:shadow-sm cursor-pointer group"
                  style={{ border: "1px solid #161d29" }}
                >
                  <span className="text-lg">{event.flag}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate group-hover:text-teal-600 transition-colors" style={{ color: "#f4f7fb" }}>{event.title}</p>
                    <p className="text-xs" style={{ color: "#94a3b8" }}>{event.country} · {event.sport}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold" style={{ color: "#10B981" }}>{fmtMoney(event.budget)}</p>
                    <p className="text-xs" style={{ color: "#94a3b8" }}>presupuesto</p>
                  </div>
                  <ArrowUpRight size={14} className="text-slate-300 group-hover:text-teal-500 transition-colors flex-shrink-0" />
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      )}

      {/* ── Auditor (real accounts): no audit records yet ── */}
      {role === "auditor" && !isDemo && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card p-10 text-center">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: "#EFF6FF" }}>
            <ClipboardCheck size={24} style={{ color: "#3B82F6" }} />
          </div>
          <h3 className="font-bold text-lg" style={{ color: "#f4f7fb" }}>Sin registros de auditoría aún</h3>
          <p className="text-sm mt-2 max-w-md mx-auto" style={{ color: "#a8b3c4" }}>
            Cuando los clubes registren proyectos, KPIs y documentación verificable, aquí verás su cumplimiento y las alertas de auditoría.
          </p>
          <Link href="/ranking" className="inline-flex items-center gap-2 mt-5 px-5 py-3 rounded-xl text-sm font-semibold text-slate-600"
            style={{ backgroundColor: "#161d29" }}>
            <Trophy size={15} /> Ver ranking de clubes
          </Link>
        </motion.div>
      )}

      {/* ── Auditor charts (demo sample) ── */}
      {role === "auditor" && isDemo && (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-7">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card p-8 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-base" style={{ color: "#f4f7fb" }}>Cumplimiento por club (últimas auditorías)</h3>
            <span className="badge badge-green">Q3 2024</span>
          </div>
          <div className="space-y-4">
            {clubs.slice(0, 6).map((club) => {
              const compliance = clubComplianceScores[club.id] ?? 80;
              return (
                <div key={club.id} className="flex items-center gap-3">
                  <span className="text-sm">{club.flag}</span>
                  <p className="text-sm font-medium w-40 truncate" style={{ color: "#a8b3c4" }}>{club.name}</p>
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
          <h3 className="font-bold text-base mb-5" style={{ color: "#f4f7fb" }}>Resumen de auditoría</h3>
          {[
            { label: "Documentos verificados", value: "156", icon: <FileCheck size={16} />, color: "#10B981" },
            { label: "KPIs auditados", value: "89", icon: <BarChart3 size={16} />, color: "#3B82F6" },
            { label: "No conformidades", value: "12", icon: <AlertTriangle size={16} />, color: "#F59E0B" },
            { label: "Acciones correctivas", value: "8", icon: <CheckCircle size={16} />, color: "#8B5CF6" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 py-3" style={{ borderBottom: "1px solid #161d29" }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: item.color + "10" }}>
                <span style={{ color: item.color }}>{item.icon}</span>
              </div>
              <div className="flex-1">
                <p className="text-xs" style={{ color: "#94a3b8" }}>{item.label}</p>
                <p className="text-sm font-bold" style={{ color: "#f4f7fb" }}>{item.value}</p>
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
            <h3 className="font-bold text-base flex items-center gap-3" style={{ color: "#f4f7fb" }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#ECFDF5" }}>
                <Target size={16} style={{ color: "#34d399" }} />
              </div>
              {role === "admin" ? "Proyectos ESG recientes (plataforma)" : "Proyectos ESG activos"}
            </h3>
            <Link href="/esg/projects" className="text-sm font-semibold flex items-center gap-1.5 transition-colors hover:underline" style={{ color: "#3B82F6" }}>
              Ver todos <ArrowUpRight size={12} />
            </Link>
          </div>
          {projects.length === 0 && (
            <div className="text-center py-10">
              <p className="text-sm" style={{ color: "#94A3B8" }}>Aún no tienes proyectos ESG.</p>
              <Link href="/esg/projects" className="inline-block mt-3 text-sm font-semibold hover:underline" style={{ color: "#34d399" }}>
                Crear mi primer proyecto →
              </Link>
            </div>
          )}
          <div className="space-y-5">
            {projects.map((project) => (
              <div key={project.id} className="p-5 rounded-xl" style={{ backgroundColor: "#10151f", border: "1px solid #161d29" }}>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-teal-600" style={{ backgroundColor: "rgba(45,212,191,0.1)", border: "1px solid rgba(45,212,191,0.25)" }}>
                      <CategoryIcon category={project.category} size={16} />
                    </span>
                    <div>
                      <p className="text-sm font-bold" style={{ color: "#f4f7fb" }}>{project.title}</p>
                      <p className="text-xs mt-1" style={{ color: "#94a3b8" }}>Resp: {project.responsible}</p>
                    </div>
                  </div>
                  <span className={getStatusColor(project.status)}>{getStatusLabel(project.status)}</span>
                </div>
                <ProgressBar value={project.progress} showPercent={true} label={categoryLabels[project.category]} />
                <div className="flex items-center gap-5 mt-3 pt-3" style={{ borderTop: "1px solid #161d29" }}>
                  <span className="text-xs" style={{ color: "#94a3b8" }}>Presupuesto: <span className="font-semibold" style={{ color: "#f4f7fb" }}>${project.budget.toLocaleString()}</span></span>
                  <span className="text-xs" style={{ color: "#94a3b8" }}>Gastado: <span className="font-semibold" style={{ color: "#34d399" }}>${project.spent.toLocaleString()}</span></span>
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
            <h3 className="font-bold text-base flex items-center gap-3 mb-6" style={{ color: "#f4f7fb" }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#FFF7ED" }}>
                <AlertTriangle size={16} style={{ color: "#fbbf24" }} />
              </div>
              Alertas y avisos
            </h3>
            {panelAlerts.length === 0 && (
              <p className="text-sm text-center py-4" style={{ color: "#94A3B8" }}>Sin avisos por ahora.</p>
            )}
            <div className="space-y-5">
              {panelAlerts.map((alert, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 flex-shrink-0">
                    {alert.type === "warning" && <AlertTriangle size={16} className="text-amber-400" />}
                    {alert.type === "success" && <CheckCircle size={16} className="text-teal-600" />}
                    {alert.type === "info" && <Zap size={16} className="text-blue-400" />}
                  </div>
                  <div>
                    <p className="text-sm leading-relaxed" style={{ color: "#a8b3c4" }}>{alert.msg}</p>
                    <p className="text-xs mt-1.5" style={{ color: "#94A3B8" }}>{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ranking */}
          <div className="card p-8">
            <h3 className="font-bold text-base flex items-center gap-3 mb-6" style={{ color: "#f4f7fb" }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#FFF7ED" }}>
                <Trophy size={16} style={{ color: "#D97706" }} />
              </div>
              Top 5 ranking
            </h3>
            <div className="space-y-3">
              {clubs.slice(0, 5).map((club, i) => (
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
                    style={{ color: club.id === myClub.id ? "#34d399" : "#475569" }}>
                    {club.name}
                  </p>
                  <span className={cn("text-[13px] font-bold flex-shrink-0 tabular-nums min-w-[36px] text-right")}
                    style={{ color: club.id === myClub.id ? "#34d399" : "#94A3B8" }}>
                    {club.esgScore}
                  </span>
                </div>
              ))}
            </div>
            <Link href="/ranking" className="flex items-center justify-center gap-2 w-full mt-6 pt-5 text-sm font-semibold transition-colors hover:underline" style={{ color: "#3B82F6", borderTop: "1px solid #161d29" }}>
              Ver ranking completo <ArrowUpRight size={13} />
            </Link>
          </div>
        </motion.div>
      </div>
      )}

      {/* ── Auditor alerts (demo sample) ── */}
      {role === "auditor" && isDemo && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="card p-8">
          <h3 className="font-bold text-base flex items-center gap-3 mb-6" style={{ color: "#f4f7fb" }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#FFF7ED" }}>
              <AlertTriangle size={16} style={{ color: "#fbbf24" }} />
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
                  <p className="text-sm leading-relaxed" style={{ color: "#a8b3c4" }}>{alert.msg}</p>
                  <p className="text-xs mt-1.5" style={{ color: "#94A3B8" }}>{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Brand: active collaborations ── */}
      {role === "brand" && isDemo && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="card p-8">
          <div className="flex items-center justify-between mb-7">
            <h3 className="font-bold text-base flex items-center gap-3" style={{ color: "#f4f7fb" }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#F0FDF4" }}>
                <Briefcase size={16} style={{ color: "#34d399" }} />
              </div>
              Colaboraciones activas
            </h3>
            <Link href="/brands/projects" className="text-sm font-semibold flex items-center gap-1.5 transition-colors hover:underline" style={{ color: "#3B82F6" }}>
              Ver proyectos <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {clubs.slice(0, 4).map((club, idx) => (
              <div key={club.id} className="flex items-center gap-4 p-5 rounded-xl" style={{ backgroundColor: "#10151f", border: "1px solid #161d29" }}>
                <span className="text-2xl">{club.flag}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate" style={{ color: "#f4f7fb" }}>{club.name}</p>
                  <p className="text-xs mt-1" style={{ color: "#94a3b8" }}>Patrocinio ESG activo</p>
                  <ProgressBar value={brandCollabProgress[idx]} showPercent={true} height={4} />
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold" style={{ color: "#34d399" }}>${brandCollabInvested[idx]}K</p>
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
          <h3 className="font-bold text-base flex items-center gap-3" style={{ color: "#f4f7fb" }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#ECFEFF" }}>
              <ShoppingBag size={16} style={{ color: "#22d3ee" }} />
            </div>
            Mis eventos en marketplace
          </h3>
          <Link href="/marketplace" className="text-sm font-semibold flex items-center gap-1.5 transition-colors hover:underline" style={{ color: "#3B82F6" }}>
            Ver marketplace <ArrowUpRight size={12} />
          </Link>
        </div>
        {openEvents.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm" style={{ color: "#94A3B8" }}>Aún no has publicado eventos en el marketplace.</p>
            <Link href="/marketplace/my-events" className="inline-block mt-3 text-sm font-semibold hover:underline" style={{ color: "#22d3ee" }}>
              Publicar mi primer evento →
            </Link>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {openEvents.map((event) => (
            <div key={event.id} className="flex items-center gap-5 p-5 rounded-xl transition-all hover:shadow-md" style={{ backgroundColor: "#10151f", border: "1px solid #161d29" }}>
              <div
                className="w-20 h-20 rounded-2xl flex-shrink-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${event.image})` }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate" style={{ color: "#f4f7fb" }}>{event.title}</p>
                <span className={cn("text-xs inline-flex items-center gap-1", categoryColors[event.category])}><CategoryIcon category={event.category} size={11} /> {categoryLabels[event.category]}</span>
                <div className="mt-3">
                  <ProgressBar value={event.funded} max={event.budget} showPercent={false} height={4} />
                  <div className="flex justify-between text-xs mt-1.5">
                    <span className="font-semibold" style={{ color: "#34d399" }}>${event.funded.toLocaleString()} financiado</span>
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
