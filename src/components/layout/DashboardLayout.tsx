"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { Toaster } from "react-hot-toast";
import { UserProvider } from "@/lib/userContext";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <UserProvider>
      <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "#F8FAFC" }}>
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

        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />
          <main className="flex-1 overflow-y-auto px-4 py-5 lg:px-10 lg:py-10">
            {children}
          </main>
        </div>

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#ffffff",
              color: "#0F172A",
              border: "1px solid #E2E8F0",
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

