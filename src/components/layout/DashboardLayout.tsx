"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { Toaster } from "react-hot-toast";
import { UserProvider } from "@/lib/userContext";

/**
 * Imagen ambiental por sección: deportistas en acción, casi apagadas bajo un
 * overlay oscuro — textura, no protagonismo.
 */
const SECTION_BACKGROUNDS: { prefix: string; image: string }[] = [
  { prefix: "/dashboard", image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1920&q=60" },        // corredora al amanecer
  { prefix: "/ranking", image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1920&q=60" },       // estadio de noche
  { prefix: "/marketplace", image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=1920&q=60" },   // fútbol en cancha
  { prefix: "/esg", image: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=1920&q=60" },           // ciclista en ruta
  { prefix: "/ai-strategy", image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1920&q=60" },      // básquetbol bajo focos
  { prefix: "/fanzone", image: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=1920&q=60" },       // hinchada
  { prefix: "/club", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&q=60" },          // entrenamiento
  { prefix: "/solutions", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=60" },     // gimnasio
  { prefix: "/brands", image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1920&q=60" },        // estadio de noche
  { prefix: "/admin", image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1920&q=60" },         // salida de atletismo
];
const DEFAULT_BACKGROUND = "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1920&q=60";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const sectionImage =
    SECTION_BACKGROUNDS.find((s) => pathname.startsWith(s.prefix))?.image ?? DEFAULT_BACKGROUND;

  return (
    <UserProvider>
      <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "#05070a" }}>
        {/* Mobile backdrop */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />

        <div className="flex-1 flex flex-col overflow-hidden min-w-0 relative">
          {/* Imagen deportiva de fondo por sección, apenas visible bajo el overlay */}
          <div aria-hidden className="absolute inset-0 pointer-events-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={sectionImage}
              src={sectionImage}
              alt=""
              className="w-full h-full object-cover"
              style={{ opacity: 0.55, filter: "saturate(0.7)" }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(5,7,10,0.84) 0%, rgba(5,7,10,0.92) 45%, rgba(5,7,10,0.97) 100%)",
              }}
            />
          </div>

          <div className="relative z-10 flex flex-col flex-1 min-h-0">
            <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />
            <main className="flex-1 overflow-y-auto px-4 py-5 lg:px-10 lg:py-10">
              {children}
            </main>
          </div>
        </div>

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#10151f",
              color: "#f4f7fb",
              border: "1px solid #232c3a",
              borderRadius: "12px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
              fontSize: "13px",
            },
          }}
        />
      </div>
    </UserProvider>
  );
}
