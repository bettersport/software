"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  ChevronDown,
  Settings,
  LogOut,
  User,
  UserCircle2,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/lib/userContext";
import { useResource, apiSend } from "@/lib/useResource";
import { useRouter } from "next/navigation";

type Notif = { id: string; type: string; title: string; message: string; read: boolean; createdAt?: string };
const NO_NOTIFS: Notif[] = [];

const relativeTime = (iso?: string) => {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return "Hace un momento";
  if (h < 24) return `Hace ${h}h`;
  return `Hace ${Math.floor(h / 24)}d`;
};



const roleConfig: Record<string, { label: string; badge: string; color: string }> = {
  admin:   { label: "Administrador", badge: "badge-purple", color: "#8B5CF6" },
  club:    { label: "Club Deportivo", badge: "badge-green",  color: "#10B981" },
  brand:   { label: "Marca",         badge: "badge-cyan",   color: "#06B6D4" },
  manager: { label: "Consultor ESG", badge: "badge-orange", color: "#F59E0B" },
  auditor: { label: "Auditor ESG",   badge: "badge-blue",   color: "#3B82F6" },
  solucion: { label: "Proveedor de soluciones", badge: "badge-orange", color: "#F97316" },
  hincha:  { label: "Hincha",        badge: "badge-purple", color: "#EC4899" },
};

export function TopBar({ onMobileMenuToggle }: { onMobileMenuToggle?: () => void }) {
  const { activeUser, loaded, logout } = useUser();
  const router = useRouter();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [search, setSearch] = useState("");
  const { data: notifications, reload: reloadNotifs } = useResource<Notif[]>(loaded && activeUser ? "/api/notifications" : null, NO_NOTIFS);

  const role = roleConfig[activeUser?.role ?? "club"] ?? roleConfig.club;
  const unreadCount = notifications.filter((n) => !n.read).length;
  const userName = activeUser?.name ?? "";

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const markRead = async (ids?: string[]) => {
    try {
      await apiSend("/api/notifications", "PATCH", ids ? { ids } : {});
      await reloadNotifs();
    } catch {
      /* keep current state */
    }
  };

  const submitSearch = () => {
    const q = search.trim();
    if (!q) return;
    router.push(`/esg/projects?q=${encodeURIComponent(q)}`);
  };

  const notifTypeColors: Record<string, string> = {
    success: "text-emerald-400",
    warning: "text-amber-400",
    error: "text-red-400",
    info: "text-blue-400",
  };

  const notifDotColors: Record<string, string> = {
    success: "bg-emerald-400",
    warning: "bg-amber-400",
    error: "bg-red-400",
    info: "bg-blue-400",
  };

  return (
    <header className="topbar-bg h-14 flex items-center px-4 lg:px-6 gap-3 sticky top-0 z-20">
      {/* Mobile hamburger */}
      <button
        className="lg:hidden btn-ghost h-9 w-9 p-0 justify-center flex-shrink-0"
        onClick={onMobileMenuToggle}
      >
        <Menu size={20} />
      </button>

      {/* Search — hidden on mobile */}
      <div className="hidden sm:flex flex-1 max-w-sm">
        <div className="relative w-full">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#94A3B8" }} />
          <input
            type="text"
            placeholder="Buscar proyectos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") submitSearch(); }}
            className="input-field pl-9 h-9"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifs(!showNotifs); setShowUser(false); }}
            className="btn-ghost h-9 w-9 p-0 justify-center rounded-lg relative"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold" style={{ backgroundColor: "#10B981", color: "#fff" }}>
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifs && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-80 card z-50 overflow-hidden"
              >
                <div className="p-4 flex items-center justify-between" style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <span className="font-semibold text-sm" style={{ color: "#0f172a" }}>Notificaciones</span>
                  <div className="flex items-center gap-2">
                    <span className="badge badge-green text-xs">{unreadCount} nuevas</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => markRead()}
                        className="text-xs font-medium hover:underline"
                        style={{ color: "#3B82F6" }}
                      >
                        Marcar todas como leídas
                      </button>
                    )}
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 && (
                    <p className="p-6 text-center text-xs" style={{ color: "#94a3b8" }}>No tienes notificaciones.</p>
                  )}
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => { if (!notif.read) markRead([notif.id]); }}
                      className={cn(
                        "p-4 hover:bg-slate-50 transition-colors cursor-pointer",
                        !notif.read && "bg-slate-50/50"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn("w-2 h-2 rounded-full mt-1.5 flex-shrink-0", notifDotColors[notif.type])} />
                        <div className="flex-1 min-w-0">
                          <p className={cn("text-sm font-medium", notifTypeColors[notif.type])}>{notif.title}</p>
                          <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "#64748b" }}>{notif.message}</p>
                          <p className="text-xs mt-1" style={{ color: "#94a3b8" }}>{relativeTime(notif.createdAt)}</p>
                        </div>
                        {!notif.read && <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: "#10B981" }} />}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User */}
        <div className="relative">
          <button
            onClick={() => { setShowUser(!showUser); setShowNotifs(false); }}
            className="flex items-center gap-2.5 h-9 px-2.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: `linear-gradient(135deg, ${role.color}, ${role.color}99)`, color: "#fff" }}>
              {userName.charAt(0)}
            </div>
            <span className="hidden sm:block text-sm font-medium" style={{ color: "#0f172a" }}>{userName.split(" ")[0]}</span>
            <ChevronDown size={12} style={{ color: "#94a3b8" }} />
          </button>

          <AnimatePresence>
            {showUser && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-56 card py-2 z-50"
              >
                <div className="px-4 py-3" style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${role.color}, ${role.color}99)`, color: "#fff" }}>
                      {userName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: "#0f172a" }}>{userName}</p>
                      <p className="text-xs truncate" style={{ color: "#94a3b8" }}>{activeUser?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`${role.badge} badge`}>{role.label}</span>
                    {activeUser?.country && <span className="text-xs" style={{ color: "#94a3b8" }}>{activeUser.country}</span>}
                  </div>
                </div>
                {[
                  { icon: <User size={14} />, label: "Mi perfil", href: "/club/profile" },
                  { icon: <Settings size={14} />, label: "Configuración", href: "/club/settings" },
                  { icon: <UserCircle2 size={14} />, label: "Cambiar de cuenta", href: "/login", switchAccount: true },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={async () => {
                      setShowUser(false);
                      if (item.switchAccount) { await logout(); }
                      router.push(item.href);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-sm transition-colors"
                    style={{ color: "#64748b" }}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
                <div className="mt-1 pt-1" style={{ borderTop: "1px solid #f1f5f9" }}>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-500/10 text-sm text-red-400 hover:text-red-300 transition-colors"
                  >
                    <LogOut size={14} />
                    Cerrar sesión
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
