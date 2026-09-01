"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, ArrowLeft, CheckCircle, Trophy, Tag, Wrench, Users } from "lucide-react";
import Link from "next/link";

type ClubOption = { id: string; name: string; sport: string; flag: string };

const roles = [
  {
    id: "club",
    label: "Club Deportivo",
    icon: Trophy,
    gradient: "from-emerald-500 to-cyan-500",
    color: "#10B981",
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.25)",
    desc: "Gestiona tu desempeño ESG y conecta con patrocinadores sostenibles",
  },
  {
    id: "brand",
    label: "Marca",
    icon: Tag,
    gradient: "from-blue-500 to-violet-500",
    color: "#3B82F6",
    bg: "rgba(59,130,246,0.1)",
    border: "rgba(59,130,246,0.25)",
    desc: "Patrocina proyectos deportivos sostenibles y mide tu impacto ESG",
  },
  {
    id: "solucion",
    label: "Solución",
    icon: Wrench,
    gradient: "from-violet-500 to-pink-500",
    color: "#8B5CF6",
    bg: "rgba(139,92,246,0.1)",
    border: "rgba(139,92,246,0.25)",
    desc: "Ofrece servicios y soluciones sostenibles a clubes y organizaciones",
  },
  {
    id: "hincha",
    label: "Hincha",
    icon: Users,
    gradient: "from-amber-500 to-orange-500",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.25)",
    desc: "Sigue el ranking, explora eventos y apoya el deporte sostenible",
  },
];

const steps = ["Tipo de cuenta", "Información básica", "Configurar acceso"];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState("club");
  const [form, setForm] = useState({ name: "", org: "", email: "", country: "Chile", sport: "", clubId: "" });
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [clubs, setClubs] = useState<ClubOption[]>([]);

  // Load the club list for the hincha picker.
  useEffect(() => {
    fetch("/api/public/clubs")
      .then((r) => r.json())
      .then((d) => setClubs(d.data ?? []))
      .catch(() => {});
  }, []);

  const handleSubmit = async () => {
    setError("");
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        password,
        role: selectedRole,
        country: form.country,
        sport: form.sport || undefined,
        org: selectedRole === "brand" || selectedRole === "solucion" || selectedRole === "club" ? form.org : undefined,
        clubId: selectedRole === "hincha" ? form.clubId : undefined,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || "No se pudo crear la cuenta");
      setLoading(false);
      return;
    }
    // Un club nuevo entra primero al Motor IA: "Listo para crear tu estrategia ESG".
    router.push(selectedRole === "brand" ? "/onboarding" : selectedRole === "club" ? "/ai-strategy" : "/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: "#10151f" }}>
      {/* Decorative bg */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-8" style={{ background: "radial-gradient(circle, #10B981, transparent)", filter: "blur(80px)" }} />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-8" style={{ background: "radial-gradient(circle, #06B6D4, transparent)", filter: "blur(80px)" }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg relative z-10"
      >
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <img src="/logo.svg" alt="BetterSport" className="h-9 w-auto object-contain" />
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={i < step ? { background: "linear-gradient(100deg, #67e8f9, #22d3ee 55%, #a78bfa)", color: "#0f172a" }
                    : i === step ? { background: "linear-gradient(135deg, #8B5CF6, #06B6D4)", color: "#0f172a" }
                    : { backgroundColor: "#161d29", color: "#94a3b8" }
                  }
                >
                  {i < step ? <CheckCircle size={14} /> : i + 1}
                </div>
                <span className={`text-xs hidden sm:block ${i === step ? "text-slate-800 font-medium" : "text-slate-400"}`}>{s}</span>
              </div>
              {i < 2 && <div className="w-6 h-px bg-slate-200" />}
            </div>
          ))}
        </div>

        <div className="card p-10">
          {/* Step 0: Role selection */}
          {step === 0 && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-xl font-bold text-slate-800 mb-2">¿Qué tipo de cuenta necesitas?</h2>
              <p className="text-slate-400 text-sm mb-6">Selecciona el perfil que mejor describe tu organización</p>
              <div className="space-y-3">
                {roles.map((role) => {
                  const Icon = role.icon;
                  const active = selectedRole === role.id;
                  return (
                    <motion.button
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full text-left p-4 rounded-2xl transition-all duration-200 flex items-center gap-4"
                      style={active
                        ? { background: role.bg, border: `1.5px solid ${role.border}` }
                        : { backgroundColor: "#10151f", border: "1.5px solid #232c3a" }
                      }
                    >
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200"
                        style={active
                          ? { background: `linear-gradient(135deg, ${role.color}, ${role.color}99)`, color: "#fff", boxShadow: `0 0 16px ${role.color}55` }
                          : { background: "#161d29", color: "#94a3b8" }
                        }
                      >
                        <Icon size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm" style={{ color: active ? role.color : "#0f172a" }}>{role.label}</p>
                        <p className="text-xs text-slate-400 mt-0.5 leading-snug">{role.desc}</p>
                      </div>
                      <div
                        className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200"
                        style={active ? { borderColor: role.color, background: role.color } : { borderColor: "#2a3442", background: "transparent" }}
                      >
                        {active && <CheckCircle size={12} className="text-white" />}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Step 1: Basic info */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Información básica</h2>
              <p className="text-slate-400 text-sm mb-6">Cuéntanos sobre ti</p>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider block mb-1.5">Tu nombre</label>
                  <input className="input-field" placeholder="Juan García" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                {(selectedRole === "club" || selectedRole === "brand" || selectedRole === "solucion") && (
                  <div>
                    <label className="text-xs text-slate-400 uppercase tracking-wider block mb-1.5">
                      {selectedRole === "club" ? "Nombre del club" : selectedRole === "solucion" ? "Nombre de la empresa" : "Nombre de la marca"}
                    </label>
                    <input
                      className="input-field"
                      placeholder={selectedRole === "club" ? "Club Deportivo Santiago" : selectedRole === "solucion" ? "GreenTech Solutions" : "Mi Marca"}
                      value={form.org}
                      onChange={(e) => setForm({ ...form, org: e.target.value })}
                    />
                  </div>
                )}
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider block mb-1.5">Correo electrónico</label>
                  <input className="input-field" type="email" placeholder="tu@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                {(selectedRole === "club") && (
                  <div>
                    <label className="text-xs text-slate-400 uppercase tracking-wider block mb-1.5">Deporte principal</label>
                    <input className="input-field" placeholder="Rugby, Fútbol..." value={form.sport} onChange={(e) => setForm({ ...form, sport: e.target.value })} />
                  </div>
                )}
                {selectedRole === "hincha" && (
                  <div>
                    <label className="text-xs text-slate-400 uppercase tracking-wider block mb-1.5">Club al que te vinculas</label>
                    <select
                      className="input-field"
                      value={form.clubId}
                      onChange={(e) => setForm({ ...form, clubId: e.target.value })}
                    >
                      <option value="">Seleccionar club...</option>
                      {clubs.map((club) => (
                        <option key={club.id} value={club.id}>
                          {club.flag} {club.name} — {club.sport}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider block mb-1.5">País</label>
                  <select className="input-field" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}>
                    {["Chile", "Argentina", "España", "Colombia", "México", "Perú", "Uruguay"].map((c) => (
                      <option key={c} value={c} style={{ backgroundColor: "#10151f" }}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Access */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Configura tu acceso</h2>
              <p className="text-slate-400 text-sm mb-6">Crea tu contraseña para acceder a la plataforma</p>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider block mb-1.5">Contraseña</label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      className="input-field pr-10"
                      placeholder="Mínimo 8 caracteres"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
                  <p className="text-xs text-teal-600 font-medium mb-2">Resumen de tu cuenta:</p>
                  <p className="text-xs text-slate-500">Rol: {roles.find((r) => r.id === selectedRole)?.label}</p>
                  {selectedRole === "hincha" ? (
                    <p className="text-xs text-slate-500">Club: {clubs.find((c) => c.id === form.clubId)?.name || "Sin seleccionar"}</p>
                  ) : (
                    <p className="text-xs text-slate-500">{form.org || "Tu organización"}</p>
                  )}
                  <p className="text-xs text-slate-500">{form.email || "tu@email.com"}</p>
                </div>
              </div>
            </motion.div>
          )}

          {error && (
            <div className="mt-6 px-4 py-3 rounded-xl text-sm" style={{ backgroundColor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "#dc2626" }}>
              {error}
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <button onClick={() => setStep(step - 1)} className="btn-secondary gap-2">
                <ArrowLeft size={16} /> Atrás
              </button>
            )}
            {step < 2 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex-1 h-11 rounded-xl font-semibold text-slate-800 flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(100deg, #67e8f9, #22d3ee 55%, #a78bfa)" }}
              >
                Continuar <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 h-11 rounded-xl font-semibold text-slate-800 flex items-center justify-center gap-2 disabled:opacity-70"
                style={{ background: "linear-gradient(100deg, #67e8f9, #22d3ee 55%, #a78bfa)", boxShadow: "0 0 24px rgba(16,185,129,0.3)" }}
              >
                {loading ? <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <>Crear cuenta <ArrowRight size={16} /></>}
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-sm text-slate-400 mt-6">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-teal-600 hover:text-teal-500 font-medium transition-colors">
            Iniciar sesión
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
