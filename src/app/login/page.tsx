"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Leaf, Eye, EyeOff, ArrowRight, Trophy, BarChart3, Brain, ChevronDown, ShieldCheck, Building2, Tag, Briefcase, UserCircle2 } from "lucide-react";
import Link from "next/link";
import { mockUsers } from "@/lib/data";
import type { User } from "@/lib/types";

const features = [
  { icon: <Leaf size={20} />, title: "Gestión ESG", desc: "Monitorea y gestiona el desempeño ambiental, social y de gobernanza" },
  { icon: <Trophy size={20} />, title: "Ranking Sostenible", desc: "Posiciona tu club en el ranking de clubes más sostenibles" },
  { icon: <BarChart3 size={20} />, title: "Marketplace", desc: "Conecta con patrocinadores interesados en impacto sostenible" },
  { icon: <Brain size={20} />, title: "Motor IA", desc: "IA que genera tu estrategia ESG personalizada" },
];

const roleConfig: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode; desc: string }> = {
  admin:   { label: "Administrador",  color: "#8B5CF6", bg: "rgba(139,92,246,0.12)",  icon: <ShieldCheck size={15} />,  desc: "Acceso total a la plataforma" },
  club:    { label: "Club Deportivo", color: "#10B981", bg: "rgba(16,185,129,0.12)",  icon: <Building2 size={15} />,    desc: "Gestión ESG del club" },
  brand:   { label: "Marca",          color: "#06B6D4", bg: "rgba(6,182,212,0.12)",   icon: <Tag size={15} />,          desc: "Patrocinios y eventos" },
  manager: { label: "Consultor ESG",  color: "#F59E0B", bg: "rgba(245,158,11,0.12)",  icon: <Briefcase size={15} />,    desc: "Gestiona múltiples clubes" },
  auditor: { label: "Auditor ESG",    color: "#3B82F6", bg: "rgba(59,130,246,0.12)",  icon: <UserCircle2 size={15} />,  desc: "Revisión y verificación ESG" },
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("felipe@clubrugby.cl");
  const [password, setPassword] = useState("password123");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState<User | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const found = mockUsers.find((u) => u.email === email);
    if (found) {
      localStorage.setItem("bettersport_user", found.id);
      localStorage.removeItem("bettersport_user_data");
    }
    await new Promise((r) => setTimeout(r, 1000));
    router.push("/dashboard");
  };

  const loginAs = async (user: User) => {
    setSelectedDemo(user);
    setEmail(user.email);
    localStorage.setItem("bettersport_user", user.id);
    localStorage.removeItem("bettersport_user_data");
    await new Promise((r) => setTimeout(r, 700));
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#f8fafc" }}>
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0D1E35 0%, #0B1628 100%)" }} />
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #10B981 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #06B6D4 0%, transparent 70%)", filter: "blur(60px)" }} />

        <div className="relative z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="BetterSport" className="h-9 w-auto object-contain" style={{ filter: "brightness(0) invert(1)" }} />
        </div>

        <div className="relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl font-bold text-white leading-tight mb-4" style={{ fontFamily: "'Manrope', sans-serif" }}>
              La plataforma ESG<br />
              <span className="text-gradient">para el deporte sostenible</span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed max-w-md">
              Gestiona proyectos, conecta con patrocinadores y lidera el ranking de clubes más sostenibles de Latinoamérica.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 mt-10">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                className="p-4 rounded-2xl"
                style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: "rgba(16,185,129,0.15)", color: "#10B981" }}>
                  {f.icon}
                </div>
                <p className="text-sm font-semibold text-white">{f.title}</p>
                <p className="text-xs text-white/50 mt-1 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-6">
          {[{ n: "500+", l: "Clubes" }, { n: "1.2K", l: "Proyectos" }, { n: "$2.5M", l: "Patrocinios" }].map((s) => (
            <div key={s.l}>
              <p className="text-2xl font-bold text-gradient">{s.n}</p>
              <p className="text-xs text-white/50 mt-0.5">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — Login form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-lg py-10"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="BetterSport" className="h-9 w-auto object-contain" />
          </div>

          <div className="card p-10">
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Manrope', sans-serif" }}>Bienvenido de vuelta</h2>
              <p className="text-slate-400 text-sm mt-2">Ingresa tus credenciales para continuar</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-2.5">Correo electrónico</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="tu@club.com"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-2.5">Contraseña</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pr-10"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div className="flex justify-end mt-2">
                  <button type="button" className="text-xs text-teal-600 hover:text-teal-500 transition-colors">
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-2xl font-semibold text-slate-800 flex items-center justify-center gap-2 text-base transition-all duration-200 disabled:opacity-70"
                style={{ background: "linear-gradient(135deg, #10B981, #06B6D4)", boxShadow: "0 0 24px rgba(16,185,129,0.3)" }}
              >
                {loading ? (
                  <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <>
                    Iniciar sesión
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <p className="text-center text-sm text-slate-400">
                ¿No tienes cuenta?{" "}
                <Link href="/register" className="text-teal-600 hover:text-teal-500 font-medium transition-colors">
                  Registra tu club
                </Link>
              </p>
            </div>
          </div>

          {/* ── Demo Profiles ── */}
          <div className="mt-6">
            <button
              onClick={() => setShowDemo(!showDemo)}
              className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl text-sm font-medium transition-all"
              style={{ backgroundColor: "#f1f5f9", border: "1px solid #e2e8f0", color: "#475569" }}
            >
              <span className="flex items-center gap-2">
                <UserCircle2 size={16} className="text-teal-600" />
                Acceso rápido demo — elige un perfil
              </span>
              <motion.div animate={{ rotate: showDemo ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={16} className="text-slate-400" />
              </motion.div>
            </button>

            <AnimatePresence>
              {showDemo && (
                <motion.div
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 space-y-2">
                    {mockUsers.map((user, i) => {
                      const rc = roleConfig[user.role];
                      const isSelected = selectedDemo?.id === user.id;
                      return (
                        <motion.button
                          key={user.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.06 }}
                          onClick={() => loginAs(user)}
                          disabled={isSelected}
                          className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all hover:scale-[1.01] disabled:opacity-70"
                          style={{
                            backgroundColor: isSelected ? rc.bg : "#f8fafc",
                            border: `1px solid ${isSelected ? rc.color + "50" : "#e2e8f0"}`,
                          }}
                        >
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-800 font-bold text-sm flex-shrink-0"
                            style={{ background: `linear-gradient(135deg, ${rc.color}, ${rc.color}88)` }}
                          >
                            {user.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-semibold text-slate-900">{user.name}</span>
                              <span
                                className="text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1"
                                style={{ backgroundColor: rc.bg, color: rc.color, border: `1px solid ${rc.color}40` }}
                              >
                                {rc.icon} {rc.label}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5 truncate">{user.email}</p>
                            <p className="text-xs mt-0.5" style={{ color: rc.color + "99" }}>{rc.desc}</p>
                          </div>
                          <div className="flex-shrink-0">
                            {isSelected ? (
                              <div className="w-4 h-4 rounded-full border-2 border-white/20 animate-spin" style={{ borderTopColor: rc.color }} />
                            ) : (
                              <ArrowRight size={14} className="text-slate-300" />
                            )}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
