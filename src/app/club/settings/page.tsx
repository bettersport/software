"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, User, Bell, Shield, Palette, ChevronRight, Check } from "lucide-react";
import { useUser } from "@/lib/userContext";
import toast from "react-hot-toast";

const sections = [
  { id: "perfil", label: "Perfil de usuario", icon: <User size={16} /> },
  { id: "notificaciones", label: "Notificaciones", icon: <Bell size={16} /> },
  { id: "seguridad", label: "Seguridad", icon: <Shield size={16} /> },
  { id: "apariencia", label: "Apariencia", icon: <Palette size={16} /> },
];

const notificationDefaults = [
  { id: "n1", label: "Nuevos eventos en el marketplace", enabled: true },
  { id: "n2", label: "Cambios en el ranking", enabled: true },
  { id: "n3", label: "Actualizaciones de proyectos ESG", enabled: true },
  { id: "n4", label: "Nuevas propuestas de marcas", enabled: false },
  { id: "n5", label: "Resumen semanal ESG", enabled: true },
  { id: "n6", label: "Alertas de KPIs críticos", enabled: true },
];

const roleLabel: Record<string, string> = {
  admin: "Administrador",
  club: "Director ESG",
  brand: "Director de Patrocinios",
  manager: "Consultor ESG",
  auditor: "Auditor ESG",
};

export default function ClubSettingsPage() {
  const { activeUser } = useUser();
  const [active, setActive] = useState("perfil");
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState(notificationDefaults);

  // Controlled profile fields
  const [nameVal, setNameVal] = useState(activeUser?.name ?? "");
  const [emailVal, setEmailVal] = useState(activeUser?.email ?? "");
  const [clubVal, setClubVal] = useState(activeUser?.club || "");

  // Sync fields once the authenticated user loads
  useEffect(() => {
    setNameVal(activeUser?.name ?? "");
    setEmailVal(activeUser?.email ?? "");
    setClubVal(activeUser?.club || "");
  }, [activeUser?.id]);

  // Controlled security fields
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  const toggleNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n))
    );
  };

  const handleSave = () => {
    if (active === "perfil") {
      if (!nameVal.trim() || !emailVal.trim()) {
        toast.error("El nombre y el email son obligatorios");
        return;
      }
      // No user-update endpoint yet — local state already holds the edited values.
    } else if (active === "seguridad") {
      if (!currentPwd || !newPwd || !confirmPwd) {
        toast.error("Completa todos los campos de contraseña");
        return;
      }
      if (newPwd !== confirmPwd) {
        toast.error("Las contraseñas no coinciden");
        return;
      }
      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
    }
    setSaved(true);
    toast.success("Configuración guardada");
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
          <Settings size={18} className="text-slate-500" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Configuración</h1>
          <p className="text-sm text-slate-400">Gestiona las preferencias de tu cuenta y organización</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Sidebar nav */}
        <div className="card p-2 h-fit">
          {sections.map((s) => (
            <button key={s.id} onClick={() => setActive(s.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${active === s.id ? "bg-teal-50 text-teal-600 border border-teal-200" : "text-slate-400 hover:text-slate-800 hover:bg-slate-50 border border-transparent"}`}>
              {s.icon}
              <span className="font-medium">{s.label}</span>
              {active === s.id && <ChevronRight size={14} className="ml-auto" />}
            </button>
          ))}
        </div>

        {/* Panel content */}
        <motion.div key={active} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="md:col-span-2 card p-7 space-y-6">
          {active === "perfil" && (
            <>
              <h3 className="font-semibold text-slate-900">Información de perfil</h3>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Nombre completo</label>
                <input type="text" value={nameVal} onChange={(e) => setNameVal(e.target.value)} className="input-field w-full" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Email</label>
                <input type="email" value={emailVal} onChange={(e) => setEmailVal(e.target.value)} className="input-field w-full" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Cargo</label>
                <input type="text" value={roleLabel[activeUser?.role ?? ""] || (activeUser?.role ?? "")} className="input-field w-full opacity-60 cursor-not-allowed" readOnly />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Organización</label>
                <input type="text" value={clubVal} onChange={(e) => setClubVal(e.target.value)} className="input-field w-full" />
              </div>
            </>
          )}

          {active === "notificaciones" && (
            <>
              <h3 className="font-semibold text-slate-900">Preferencias de notificaciones</h3>
              {notifications.map((n) => (
                <div key={n.id} className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-600">{n.label}</span>
                  <button
                    onClick={() => toggleNotification(n.id)}
                    className={`w-10 h-5 rounded-full transition-all relative ${n.enabled ? "bg-teal-500" : "bg-slate-200"}`}
                  >
                    <span
                      className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all"
                      style={{ left: n.enabled ? "22px" : "2px" }}
                    />
                  </button>
                </div>
              ))}
            </>
          )}

          {active === "seguridad" && (
            <>
              <h3 className="font-semibold text-slate-900">Seguridad de la cuenta</h3>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Contraseña actual</label>
                <input type="password" placeholder="••••••••" value={currentPwd} onChange={(e) => setCurrentPwd(e.target.value)} className="input-field w-full" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Nueva contraseña</label>
                <input type="password" placeholder="Mínimo 8 caracteres" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} className="input-field w-full" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Confirmar contraseña</label>
                <input type="password" placeholder="Repetir contraseña" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} className="input-field w-full" />
              </div>
              <div className="p-3 rounded-xl" style={{ backgroundColor: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}>
                <p className="text-xs text-amber-600">🔐 Autenticación de dos factores disponible próximamente</p>
              </div>
            </>
          )}

          {active === "apariencia" && (
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
                <Settings size={24} className="text-slate-300" />
              </div>
              <p className="text-slate-400 text-sm">Esta sección estará disponible próximamente</p>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button onClick={handleSave} className={`btn-primary flex items-center gap-2 ${saved ? "bg-teal-600" : ""}`}>
              {saved ? <><Check size={16} /> Guardado</> : "Guardar cambios"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
