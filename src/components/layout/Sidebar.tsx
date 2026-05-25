"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Trophy,
  Lightbulb,
  ShoppingBag,
  Users,
  ChevronDown,
  ChevronRight,
  Leaf,
  BarChart3,
  FileText,
  Wallet,
  Brain,
  Settings,
  Shield,
  Menu,
  X,
  Building2,
  Tag,
  ClipboardCheck,
  Eye,
  Wrench,
  Zap,
  Star,
  SlidersHorizontal,
  Database,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/lib/userContext";
import type { UserRole } from "@/lib/types";

interface NavItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  children?: NavItem[];
  roles?: UserRole[]; // qué roles ven este item (vacío = todos)
}

const allRoles: UserRole[] = ["admin", "club", "brand", "solucion"];

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard size={18} />,
    roles: [...allRoles, "hincha"],
  },
  {
    label: "Ranking",
    icon: <Trophy size={18} />,
    roles: allRoles,
    children: [
      { label: "Clubes", href: "/ranking", icon: <Trophy size={15} /> },
      { label: "Mi posición", href: "/ranking/position", icon: <BarChart3 size={15} />, roles: ["club", "admin"] },
    ],
  },
  {
    label: "Soluciones",
    href: "/solutions",
    icon: <Wrench size={18} />,
    roles: allRoles,
  },
  {
    label: "Proyectos de alto impacto",
    icon: <ShoppingBag size={18} />,
    roles: ["admin", "club", "brand", "solucion"],
    children: [
      { label: "Proyectos sostenibles", href: "/marketplace", icon: <ShoppingBag size={15} /> },
      { label: "Mis eventos", href: "/marketplace/my-events", icon: <FileText size={15} />, roles: ["club", "admin"] },
    ],
  },
  {
    label: "Marcas",
    icon: <Tag size={18} />,
    roles: ["admin", "brand"],
    children: [
      { label: "Ranking clubes",       href: "/brands/ranking", icon: <Trophy size={15} /> },
      { label: "Proyectos sostenibles", href: "/brands/projects", icon: <Leaf size={15} /> },
      { label: "Mi configuración",     href: "/brands/config",  icon: <SlidersHorizontal size={15} />, roles: ["brand"] },
    ],
  },
  {
    label: "Gestión ESG",
    icon: <Leaf size={18} />,
    roles: ["admin", "club"],
    children: [
      { label: "Mis proyectos", href: "/esg/projects", icon: <Lightbulb size={15} /> },
      { label: "KPIs e indicadores", href: "/esg/kpis", icon: <BarChart3 size={15} /> },
      { label: "Gestión documental", href: "/esg/documents", icon: <FileText size={15} /> },
      { label: "Presupuesto", href: "/esg/budget", icon: <Wallet size={15} /> },
    ],
  },
  {
    label: "Mis Soluciones",
    icon: <Wrench size={18} />,
    roles: ["admin", "solucion"],
    children: [
      { label: "Catálogo de soluciones", href: "/solutions", icon: <Wrench size={15} /> },
      { label: "Ver clubes",            href: "/ranking",   icon: <Eye size={15} /> },
    ],
  },
  {
    label: "Motor IA",
    href: "/ai-strategy",
    icon: <Brain size={18} />,
    roles: ["admin", "club"],
  },
  {
    label: "Mi Fan Zone",
    href: "/fanzone",
    icon: <Star size={18} />,
    roles: ["hincha", "admin"],
  },
  {
    label: "Engagement Hinchas",
    icon: <Users size={18} />,
    roles: ["admin", "club"],
    children: [
      { label: "Estrategia de Fidelización", href: "/fanzone", icon: <Zap size={15} /> },
    ],
  },
  {
    label: "Mi Club",
    icon: <Building2 size={18} />,
    roles: ["club"],
    children: [
      { label: "Perfil del club",      href: "/club/profile",        icon: <Users size={15} /> },
      { label: "Fan Zone",             href: "/club/fanzone",        icon: <Zap size={15} /> },
      { label: "Configurar Fan Zone",  href: "/club/fanzone/config", icon: <SlidersHorizontal size={15} /> },
      { label: "Configuración",        href: "/club/settings",       icon: <Settings size={15} /> },
    ],
  },
  {
    label: "Administración",
    icon: <Shield size={18} />,
    roles: ["admin"],
    children: [
      { label: "Todos los clubes",  href: "/ranking",       icon: <Building2 size={15} /> },
      { label: "Gestión de marcas", href: "/admin/brands",  icon: <Tag size={15} /> },
      { label: "Fan Zone",          href: "/fanzone",       icon: <Star size={15} /> },
      { label: "Configuración",     href: "/club/settings", icon: <Settings size={15} /> },
    ],
  },
  {
    label: "Data Intelligence",
    href: "/admin/data-intelligence",
    icon: <Database size={18} />,
    roles: ["admin"],
  },
];

const partners = [
  { name: "Claro", initials: "CL" },
  { name: "Rugby CL", initials: "RC" },
  { name: "ESPN", initials: "ES" },
  { name: "VTR", initials: "VT" },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ collapsed = false, onToggle, mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const { activeUser } = useUser();
  const [openMenus, setOpenMenus] = useState<string[]>(["Ranking", "Marketplace", "Marcas"]);

  // Auto-close drawer on mobile when navigating
  useEffect(() => {
    if (mobileOpen && onMobileClose) onMobileClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) =>
      prev.includes(label) ? prev.filter((m) => m !== label) : [...prev, label]
    );
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname === href || pathname.startsWith(href + "/");
  };

  // Filtrar items según el rol del usuario activo
  const filteredNavItems = navItems
    .filter((item) => !item.roles || item.roles.includes(activeUser.role))
    .map((item) => ({
      ...item,
      children: item.children?.filter((child) => !child.roles || child.roles.includes(activeUser.role)),
    }));

  return (
    <aside
      className={cn(
        "sidebar-bg h-screen flex flex-col overflow-hidden transition-all duration-300",
        // Mobile: fixed overlay drawer
        "fixed inset-y-0 left-0 z-50 lg:static lg:z-30",
        // Width: always 272px on mobile, collapsible on desktop
        "w-[272px]",
        collapsed ? "lg:w-16" : "lg:w-[272px]",
        // Slide in/out on mobile
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      {/* Logo */}
      <div className="flex-shrink-0 px-4 py-5 flex items-center gap-2" style={{ borderBottom: "1px solid #E2E8F0" }}>
        {collapsed ? (
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden" style={{ background: "linear-gradient(135deg, #10B981, #06B6D4)" }}>
            <Leaf size={18} color="#fff" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 min-w-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="BetterSport" className="h-8 w-auto object-contain" />
          </motion.div>
        )}
        <button
          onClick={onToggle}
          className="ml-auto flex-shrink-0 transition-colors rounded-md p-1 hover:bg-slate-100"
          style={{ color: "#94A3B8" }}
        >
          {collapsed ? <ChevronRight size={15} /> : <Menu size={15} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 min-h-0 overflow-y-auto py-5 px-4 space-y-1">
        {filteredNavItems.map((item) => (
          <NavItemComponent
            key={item.label}
            item={item}
            collapsed={collapsed}
            isActive={isActive}
            isOpen={openMenus.includes(item.label)}
            onToggle={() => toggleMenu(item.label)}
          />
        ))}
      </nav>

      {/* Partners */}
      {!collapsed && (
        <div className="flex-shrink-0 p-4" style={{ borderTop: "1px solid #E2E8F0" }}>
          <p className="text-[11px] mb-2.5 font-medium uppercase tracking-wider" style={{ color: "#94A3B8" }}>Partners</p>
          <div className="flex items-center gap-1.5">
            {partners.map((p) => (
              <div
                key={p.name}
                className="h-7 px-2.5 rounded-md flex items-center justify-center text-[10px] font-semibold"
                style={{ backgroundColor: "#F1F5F9", color: "#64748B" }}
                title={p.name}
              >
                {p.initials}
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}

interface NavItemComponentProps {
  item: NavItem;
  collapsed: boolean;
  isActive: (href?: string) => boolean;
  isOpen: boolean;
  onToggle: () => void;
  level?: number;
}

function NavItemComponent({ item, collapsed, isActive, isOpen, onToggle, level = 0 }: NavItemComponentProps) {
  const active = isActive(item.href);
  const hasChildren = item.children && item.children.length > 0;

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={onToggle}
          className={cn(
            "w-full nav-item justify-between",
            level > 0 && "pl-6"
          )}
        >
          <span className="flex items-center gap-3">
            <span className="flex-shrink-0">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </span>
          {!collapsed && (
            <ChevronDown
              size={14}
              className={cn("transition-transform duration-200", isOpen && "rotate-180")}
            />
          )}
        </button>

        <AnimatePresence>
          {isOpen && !collapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="ml-4 mt-0.5 space-y-0.5">
                {item.children!.map((child) => (
                  <Link
                    key={child.label}
                    href={child.href || "#"}
                    className={cn(
                      "nav-item pl-3 border border-transparent",
                      isActive(child.href) && "nav-item-active"
                    )}
                  >
                    <span className="flex-shrink-0">{child.icon}</span>
                    <span>{child.label}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <Link
      href={item.href || "#"}
      className={cn(
        "nav-item border border-transparent",
        active && "nav-item-active",
        level > 0 && "pl-6"
      )}
    >
      <span className="flex-shrink-0">{item.icon}</span>
      {!collapsed && <span>{item.label}</span>}
    </Link>
  );
}
