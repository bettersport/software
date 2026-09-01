"use client";

import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ============================================================================
   Efectos de movimiento — portados de Spec Research.
   ========================================================================= */

/**
 * Fondo ambiental: manchas de luz a la deriva + rejilla de plano + viñeta.
 * Puramente decorativo, aria-hidden. El contenedor padre debe ser `relative`.
 */
export function Aurora({ className, intensity = 1 }: { className?: string; intensity?: number }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div
        className="absolute -top-[22rem] left-1/2 h-[52rem] w-[62rem] -translate-x-1/2 rounded-full blur-[120px] animate-drift"
        style={{
          background: `radial-gradient(circle, color-mix(in oklab, var(--color-neon) ${Math.round(30 * intensity)}%, transparent), transparent 66%)`,
        }}
      />
      <div
        className="absolute top-1/4 -right-40 h-[34rem] w-[34rem] rounded-full blur-[120px] animate-drift"
        style={{
          animationDelay: "-8s",
          background: `radial-gradient(circle, color-mix(in oklab, var(--color-violet-accent) ${Math.round(20 * intensity)}%, transparent), transparent 68%)`,
        }}
      />
      <div className="grid-plane absolute inset-0 opacity-60 mask-fade-b" />
      {/* viñeta suave: contiene el resplandor sin apagarlo */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(135% 95% at 50% 8%, transparent 55%, color-mix(in oklab, var(--color-plane) 88%, transparent) 100%)",
        }}
      />
    </div>
  );
}

const easeOut = [0.22, 1, 0.36, 1] as const;

/** Revela el contenido al entrar en pantalla. */
export function Reveal({
  children, delay = 0, y = 22, className, once = true,
}: {
  children: ReactNode; delay?: number; y?: number; className?: string; once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}

/** Contenedor que revela a sus hijos en cascada. */
export function Stagger({
  children, className, gap = 0.07, delay = 0,
}: {
  children: ReactNode; className?: string; gap?: number; delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={{ show: { transition: { staggerChildren: gap, delayChildren: delay } } }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children, className, y = 18,
}: {
  children: ReactNode; className?: string; y?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
      }}
    >
      {children}
    </motion.div>
  );
}

/** Número que cuenta hacia su valor al entrar en pantalla. */
export function CountUp({
  to, decimals = 0, prefix = "", suffix = "", className, duration = 1.4,
}: {
  to: number; decimals?: number; prefix?: string; suffix?: string; className?: string; duration?: number;
}) {
  const fmt = (v: number) =>
    v.toLocaleString("es-CL", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  const ref = useRef<HTMLSpanElement>(null);
  // Margen positivo: la cuenta arranca antes de ser visible; el 0 nunca se ve.
  const inView = useInView(ref, { once: true, margin: "240px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { duration: duration * 1000, bounce: 0 });
  const text = useTransform(spring, fmt);
  // Arranca en el valor final: si la animación no se dispara, se lee el correcto.
  const [display, setDisplay] = useState(() => fmt(to));

  useEffect(() => {
    if (inView) mv.set(to);
  }, [inView, to, mv]);

  useEffect(() => text.on("change", setDisplay), [text]);

  return (
    <span ref={ref} className={cn("tnum", className)}>
      {prefix}{display}{suffix}
    </span>
  );
}

/** Resplandor que sigue al cursor dentro de la tarjeta. */
export function Spotlight({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: -999, y: -999 });

  return (
    <div
      ref={ref}
      className={cn("group relative", className)}
      onPointerMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
      }}
      onPointerLeave={() => setPos({ x: -999, y: -999 })}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10"
        style={{
          background: `radial-gradient(340px circle at ${pos.x}px ${pos.y}px, color-mix(in oklab, var(--color-neon) 10%, transparent), transparent 70%)`,
        }}
      />
      {children}
    </div>
  );
}
