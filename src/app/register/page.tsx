"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Leaf, ArrowRight, Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";

const roles = [
  { id: "club", label: "Club Deportivo", icon: "⚽", desc: "Gestiona tu desempeño ESG y busca patrocinadores" },
  { id: "brand", label: "Marca / Patrocinador", icon: "🏷️", desc: "Encuentra proyectos sostenibles para patrocinar" },
  { id: "manager", label: "Gestor ESG / Consultor", icon: "📊", desc: "Apoya clubes en su estrategia de sostenibilidad" },
];

const steps = ["Tipo de cuenta", "Información básica", "Configurar acceso"];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState("club");
  const [form, setForm] = useState({ name: "", org: "", email: "", country: "Chile", sport: "" });
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: "#F8FAFC" }}>
      {/* Decorative bg */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-8" style={{ background: "radial-gradient(circle, #10B981, transparent)", filter: "blur(80px)" }} />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-8" style={{ background: "radial-gradient(circle, #06B6D4, transparent)", filter: "blur(80px)" }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg relative z-10"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #10B981, #06B6D4)" }}>
            <Leaf size={20} className="text-slate-900" />
          </div>
          <div className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Manrope', sans-serif" }}>
            <span>BETTER</span>
            <span className="ml-1" style={{ background: "linear-gradient(135deg, #10B981, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>SPORT</span>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={i < step ? { background: "linear-gradient(135deg, #10B981, #06B6D4)", color: "#0f172a" }
                    : i === step ? { background: "linear-gradient(135deg, #8B5CF6, #06B6D4)", color: "#0f172a" }
                    : { backgroundColor: "#f1f5f9", color: "#94a3b8" }
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
                {roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className="w-full text-left p-4 rounded-xl transition-all"
                    style={selectedRole === role.id
                      ? { background: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(6,182,212,0.15))", border: "1px solid rgba(16,185,129,0.4)" }
                      : { backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }
                    }
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{role.icon}</span>
                      <div>
                        <p className={`font-semibold text-sm ${selectedRole === role.id ? "text-teal-600" : "text-slate-900"}`}>{role.label}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{role.desc}</p>
                      </div>
                      {selectedRole === role.id && <CheckCircle size={16} className="text-teal-600 ml-auto flex-shrink-0" />}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 1: Basic info */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Información básica</h2>
              <p className="text-slate-400 text-sm mb-6">Cuéntanos sobre tu organización</p>
              <div className="space-y-4">
                {[
                  { label: "Tu nombre", key: "name", placeholder: "Juan García" },
                  { label: "Nombre de la organización", key: "org", placeholder: "Club Rugby Chile" },
                  { label: "Correo electrónico", key: "email", placeholder: "tu@organizacion.com", type: "email" },
                  { label: "Deporte principal", key: "sport", placeholder: "Rugby, Fútbol..." },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="text-xs text-slate-400 uppercase tracking-wider block mb-1.5">{f.label}</label>
                    <input
                      className="input-field"
                      type={f.type || "text"}
                      placeholder={f.placeholder}
                      value={form[f.key as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    />
                  </div>
                ))}
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider block mb-1.5">País</label>
                  <select className="input-field" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}>
                    {["Chile", "Argentina", "España", "Colombia", "México", "Perú", "Uruguay"].map((c) => (
                      <option key={c} value={c} style={{ backgroundColor: "#fff" }}>{c}</option>
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
                  <p className="text-xs text-slate-500">{form.org || "Tu organización"}</p>
                  <p className="text-xs text-slate-500">{form.email || "tu@email.com"}</p>
                </div>
              </div>
            </motion.div>
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
                style={{ background: "linear-gradient(135deg, #10B981, #06B6D4)" }}
              >
                Continuar <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 h-11 rounded-xl font-semibold text-slate-800 flex items-center justify-center gap-2 disabled:opacity-70"
                style={{ background: "linear-gradient(135deg, #10B981, #06B6D4)", boxShadow: "0 0 24px rgba(16,185,129,0.3)" }}
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
