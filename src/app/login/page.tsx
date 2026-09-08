"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Leaf, Eye, EyeOff, ArrowRight, Trophy, BarChart3, Brain, ShieldCheck, Building2, Tag, Wrench, Star, Mail, Lock, Sparkles } from "lucide-react";
import { CountUp } from "@/components/fx";
import Link from "next/link";
import type { UserRole } from "@/lib/types";

/** Panel de acceso rápido demo — SOLO se muestra si NEXT_PUBLIC_ENABLE_DEMO=true (nunca por defecto en producción). */
const DEMO_ENABLED = process.env.NEXT_PUBLIC_ENABLE_DEMO === "true";
const DEMO_PASSWORD = "demo1234";
type DemoAccount = { id: string; name: string; email: string; role: UserRole };
const DEMO_ACCOUNTS: DemoAccount[] = [
  { id: "u1", name: "Carlos Rodríguez", email: "carlos@bettersport.com", role: "admin" },
  { id: "u2", name: "Felipe González", email: "felipe@clubrugby.cl", role: "club" },
  { id: "u3", name: "Alejandro Reyes", email: "alejandro@greensportsa.com", role: "brand" },
  { id: "u5", name: "Sergio Blanco", email: "sergio@ecosolutions.com", role: "solucion" },
  { id: "u7", name: "Martina Herrera", email: "martina@fanzone.com", role: "hincha" },
];

const features = [
  { icon: <Leaf size={20} />, title: "Gestión ESG", desc: "Monitorea y gestiona el desempeño ambiental, social y de gobernanza" },
  { icon: <Trophy size={20} />, title: "Ranking Sostenible", desc: "Posiciona tu club en el ranking de clubes más sostenibles" },
  { icon: <BarChart3 size={20} />, title: "Marketplace", desc: "Conecta con patrocinadores interesados en impacto sostenible" },
  { icon: <Brain size={20} />, title: "Motor IA", desc: "IA que genera tu estrategia ESG personalizada" },
];

const roleConfig: Record<string, { label: string; short: string; color: string; bg: string; icon: React.ReactNode; desc: string }> = {
  admin:   { label: "Administrador", short: "Admin",  color: "#8B5CF6", bg: "rgba(139,92,246,0.12)",  icon: <ShieldCheck size={15} />,  desc: "Acceso total a la plataforma" },
  club:    { label: "Club Deportivo", short: "Club", color: "#10B981", bg: "rgba(16,185,129,0.12)",  icon: <Building2 size={15} />,    desc: "Gestión ESG del club" },
  brand:   { label: "Marca", short: "Marca",          color: "#06B6D4", bg: "rgba(6,182,212,0.12)",   icon: <Tag size={15} />,          desc: "Patrocinios y eventos" },
  solucion: { label: "Proveedor de Soluciones", short: "Proveedor", color: "#F97316", bg: "rgba(249,115,22,0.12)", icon: <Wrench size={15} />, desc: "Ofrece soluciones sostenibles" },
  hincha:  { label: "Fan / Hincha", short: "Hincha",    color: "#EC4899", bg: "rgba(236,72,153,0.12)",  icon: <Star size={15} />,         desc: "Zona fan y recompensas" },
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);
  const [error, setError] = useState("");

  const doLogin = async (mail: string, pass: string) => {
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: mail, password: pass }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || "No se pudo iniciar sesión");
      return null;
    }
    return data.needsOnboarding ? "/onboarding" : "/dashboard";
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const dest = await doLogin(email, password);
    if (dest) router.push(dest);
    else setLoading(false);
  };

  const loginAs = async (account: DemoAccount) => {
    setSelectedDemo(account.id);
    const dest = await doLogin(account.email, DEMO_PASSWORD);
    if (dest) router.push(dest);
    else setSelectedDemo(null);
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden" style={{ backgroundColor: "#05070a" }}>
      {/* ── Foto deportiva nítida con degradé cinematográfico (sin blur) ── */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=2200&q=80"
          alt=""
          className="w-full h-full object-cover"
          style={{ opacity: 0.7, filter: "saturate(0.85) contrast(1.05)", transform: "scale(1.02)" }}
        />
        {/* oscurece hacia la derecha (donde va el formulario) y hacia abajo */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(100deg, rgba(5,7,10,0.55) 0%, rgba(5,7,10,0.72) 45%, rgba(5,7,10,0.9) 100%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(5,7,10,0.25) 0%, transparent 35%, rgba(5,7,10,0.85) 100%)" }} />
        {/* resplandores neón */}
        <div className="absolute -top-40 -left-32 w-[36rem] h-[36rem] rounded-full animate-drift" style={{ background: "radial-gradient(circle, rgba(34,211,238,0.18), transparent 65%)", filter: "blur(80px)" }} />
        <div className="absolute -bottom-40 right-[20%] w-[30rem] h-[30rem] rounded-full animate-drift" style={{ animationDelay: "-10s", background: "radial-gradient(circle, rgba(139,92,246,0.16), transparent 65%)", filter: "blur(80px)" }} />
        <div className="grid-plane absolute inset-0 opacity-30 mask-fade-b" />
      </div>

      {/* ── Panel izquierdo: marca + propuesta de valor ── */}
      <div className="hidden lg:flex lg:w-[52%] flex-col justify-between p-12 xl:p-16 relative z-10">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="BetterSport" className="h-9 w-auto object-contain" style={{ filter: "brightness(0) invert(1)" }} />
        </div>

        <div>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
            <p className="eyebrow flex items-center gap-2 mb-5">
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex w-full h-full rounded-full animate-pulse-ring" style={{ backgroundColor: "#22d3ee" }} />
                <span className="relative inline-flex w-2 h-2 rounded-full" style={{ backgroundColor: "#22d3ee" }} />
              </span>
              Plataforma ESG para el deporte
            </p>
            <h1 className="text-[2.75rem] xl:text-5xl font-extrabold text-white leading-[1.05] tracking-tight mb-5" style={{ fontFamily: "'Manrope', sans-serif" }}>
              Deporte que<br />
              <span className="text-gradient">impacta y crece.</span>
            </h1>
            <p className="text-base xl:text-lg leading-relaxed max-w-md" style={{ color: "rgba(244,247,251,0.68)" }}>
              Gestiona proyectos ESG, conecta con patrocinadores y lidera el ranking de clubes más sostenibles de Latinoamérica.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-3 mt-10 max-w-xl">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="glass glass-hover p-4 !rounded-xl"
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: "rgba(34,211,238,0.12)", color: "#22d3ee", border: "1px solid rgba(34,211,238,0.25)" }}>
                  {f.icon}
                </div>
                <p className="text-sm font-semibold text-white">{f.title}</p>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: "rgba(244,247,251,0.55)" }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-8">
          {[{ n: 500, s: "+", l: "Clubes" }, { n: 1200, s: "", l: "Proyectos" }, { n: 2.5, s: "M", l: "Patrocinios USD", p: "$" }].map((st) => (
            <div key={st.l}>
              <p className="text-2xl font-extrabold text-gradient tnum">
                <CountUp to={st.n} decimals={st.n % 1 ? 1 : 0} prefix={st.p ?? ""} suffix={st.s} />
              </p>
              <p className="eyebrow mt-1">{st.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Panel derecho: formulario ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 overflow-y-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md py-6"
        >
          {/* Logo móvil */}
          <div className="lg:hidden flex justify-center mb-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="BetterSport" className="h-9 w-auto object-contain" style={{ filter: "brightness(0) invert(1)" }} />
          </div>

          <div className="glass ring-gradient p-8 sm:p-10" style={{ backgroundColor: "rgba(11,15,22,0.82)" }}>
            <p className="eyebrow mb-3">Acceso a la plataforma</p>
            <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: "#f4f7fb", fontFamily: "'Manrope', sans-serif" }}>Bienvenido de vuelta</h2>
            <p className="text-sm mt-1.5 mb-8" style={{ color: "#8b95a5" }}>Ingresa tus credenciales para continuar</p>

            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="px-4 py-3 rounded-xl text-sm" style={{ backgroundColor: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", color: "#f87171" }}>
                  {error}
                </div>
              )}
              <div>
                <label className="eyebrow block mb-2">Correo electrónico</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#6b7789" }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field !pl-10 !py-3"
                    placeholder="tu@club.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="eyebrow">Contraseña</label>
                  <button type="button" onClick={() => setError("Recuperación de contraseña: escríbenos a soporte@bettersport.cl y la restablecemos por ti.")} className="text-[11px] transition-colors hover:text-teal-500" style={{ color: "#2dd4bf" }}>
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#6b7789" }} />
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field !pl-10 !pr-11 !py-3"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors"
                    style={{ color: "#6b7789" }}
                    aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center !py-3.5 !text-[15px] !rounded-xl disabled:opacity-70">
                {loading ? (
                  <div className="w-5 h-5 rounded-full border-2 animate-spin" style={{ borderColor: "rgba(4,18,26,0.25)", borderTopColor: "#04121a" }} />
                ) : (
                  <>Iniciar sesión <ArrowRight size={17} /></>
                )}
              </button>
            </form>

            <p className="text-center text-sm mt-7" style={{ color: "#8b95a5" }}>
              ¿No tienes cuenta?{" "}
              <Link href="/register" className="font-semibold transition-colors hover:text-teal-500" style={{ color: "#2dd4bf" }}>
                Registra tu club
              </Link>
            </p>
          </div>

          {/* ── Acceso rápido demo: siempre visible como chips (solo con NEXT_PUBLIC_ENABLE_DEMO=true) ── */}
          {DEMO_ENABLED && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="mt-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="h-px flex-1" style={{ backgroundColor: "rgba(244,247,251,0.1)" }} />
                <span className="eyebrow flex items-center gap-1.5"><Sparkles size={11} /> Explorar con un perfil demo</span>
                <span className="h-px flex-1" style={{ backgroundColor: "rgba(244,247,251,0.1)" }} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {DEMO_ACCOUNTS.map((user, i) => {
                  const rc = roleConfig[user.role];
                  const isSelected = selectedDemo === user.id;
                  return (
                    <motion.button
                      key={user.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.05 }}
                      onClick={() => loginAs(user)}
                      disabled={!!selectedDemo}
                      title={`${user.name} · ${user.email}`}
                      className="glass glass-hover !rounded-xl flex items-center gap-2.5 px-3 py-2.5 text-left disabled:opacity-60"
                      style={{ borderColor: isSelected ? `${rc.color}66` : undefined, backgroundColor: "rgba(11,15,22,0.7)" }}
                    >
                      <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ color: rc.color, backgroundColor: `${rc.color}1f`, border: `1px solid ${rc.color}40` }}>
                        {isSelected ? <div className="w-3.5 h-3.5 rounded-full border-2 animate-spin" style={{ borderColor: `${rc.color}40`, borderTopColor: rc.color }} /> : rc.icon}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs font-semibold truncate" style={{ color: "#f4f7fb" }}>{rc.short}</span>
                        <span className="block text-[10px] truncate" style={{ color: "#6b7789" }}>{user.name.split(" ")[0]}</span>
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
