"use client";

import {
  motion, useScroll, useTransform, useInView, AnimatePresence, type MotionValue,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ============================================================================
   Primitivas de movimiento de la web pública. Todo responde al scroll o al
   tiempo; nada depende del cursor (funciona igual en móvil y escritorio).
   ========================================================================= */

export const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Titular que entra palabra por palabra desde una máscara.
 * `inView`: anima al entrar en pantalla (framer). Sin `inView` anima al
 * montar con CSS puro: la entrada del hero no puede depender de la
 * hidratación (en carga fría las animaciones con retardo se quedaban en 0).
 */
export function WordReveal({
  text, className, delay = 0, stagger = 0.055, once = true, inView = false,
}: {
  text: string; className?: string; delay?: number; stagger?: number; once?: boolean; inView?: boolean;
}) {
  const words = text.split(" ");
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={`${w}-${i}`} className="inline-block overflow-hidden align-bottom pb-[0.1em] -mb-[0.1em] mr-[0.26em]">
          {inView ? (
            <motion.span
              className="inline-block"
              initial={{ y: "110%", rotate: 2 }}
              whileInView={{ y: 0, rotate: 0 }}
              viewport={{ once, margin: "-80px" }}
              transition={{ duration: 0.9, delay: delay + i * stagger, ease: EASE }}
            >
              {w}
            </motion.span>
          ) : (
            <span className="inline-block lp-rise" style={{ animationDelay: `${delay + i * stagger}s` }}>{w}</span>
          )}
        </span>
      ))}
    </span>
  );
}

/** Párrafo cuyas palabras se iluminan a medida que avanza el scroll. */
export function ScrollWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "end 0.45"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Word key={`${w}-${i}`} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </Word>
      ))}
    </p>
  );
}

function Word({ progress, range, children }: { progress: MotionValue<number>; range: [number, number]; children: ReactNode }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <span className="inline-block mr-[0.26em]">
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  );
}

/** Desplaza su contenido a distinta velocidad que la página (parallax). */
export function Parallax({
  children, className, speed = 0.18, style,
}: {
  children: ReactNode; className?: string; speed?: number; style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`${-speed * 100}%`, `${speed * 100}%`]);
  return (
    <motion.div ref={ref} style={{ y, ...style }} className={className}>
      {children}
    </motion.div>
  );
}

/** Imagen de fondo con parallax para secciones a sangre. */
export function ParallaxImage({ src, className, opacity = 0.5, speed = 0.15 }: { src: string; className?: string; opacity?: number; speed?: number }) {
  return (
    <div aria-hidden className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      <Parallax speed={speed} className="absolute -inset-y-[20%] inset-x-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" className="w-full h-full object-cover" style={{ opacity, filter: "saturate(0.85)" }} loading="lazy" />
      </Parallax>
    </div>
  );
}

/** Línea que crece al entrar en pantalla. */
export function GrowLine({ className, delay = 0, vertical = false, style }: { className?: string; delay?: number; vertical?: boolean; style?: React.CSSProperties }) {
  return (
    <motion.span
      aria-hidden
      style={style}
      className={cn("block origin-left", vertical && "origin-top", className)}
      initial={{ scaleX: vertical ? 1 : 0, scaleY: vertical ? 0 : 1 }}
      whileInView={{ scaleX: 1, scaleY: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1.1, delay, ease: EASE }}
    />
  );
}

/* ── Slider del hero ─────────────────────────────────────────────────────── */

export interface Slide { src: string; alt: string; caption: string }

/**
 * Slider a pantalla completa: fundido con zoom lento (Ken Burns), autoplay,
 * barra de progreso por slide y navegación por teclado/botones.
 */
export function HeroSlider({
  slides, interval = 6500, children, className,
}: {
  slides: Slide[]; interval?: number; children?: ReactNode; className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const go = useCallback((dir: 1 | -1) => setIndex((i) => (i + dir + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => go(1), interval);
    return () => clearInterval(id);
  }, [go, interval, paused, index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  // Parallax del slide respecto al scroll de la página.
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <motion.div aria-hidden className="absolute inset-0" style={{ y: imgY }}>
        <AnimatePresence initial={false}>
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.4, ease: "easeInOut" }, scale: { duration: 9, ease: "linear" } }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={slides[index].src} alt={slides[index].alt} className="w-full h-full object-cover" style={{ filter: "saturate(0.85) contrast(1.05)" }} />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(5,7,10,0.55) 0%, rgba(5,7,10,0.35) 40%, rgba(5,7,10,0.78) 78%, #05070a 100%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(5,7,10,0.55) 0%, transparent 60%)" }} />
      </motion.div>

      <motion.div className="relative" style={{ y: contentY, opacity: fade }}>
        {children}
      </motion.div>

      {/* Controles: progreso por slide + flechas */}
      <div className="absolute bottom-0 inset-x-0 z-20">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 pb-6 flex items-end justify-between gap-6">
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            {slides.map((s, i) => (
              <button
                key={s.src}
                onClick={() => setIndex(i)}
                aria-label={`Slide ${i + 1}`}
                className="relative h-6 flex-1 flex items-center"
              >
                <span className="block w-full h-px" style={{ backgroundColor: "rgba(244,247,251,0.2)" }} />
                {i === index && (
                  <motion.span
                    key={`${i}-${paused}`}
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-px origin-left w-full"
                    style={{ backgroundColor: "#f4f7fb" }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: paused ? 0.35 : 1 }}
                    transition={{ duration: paused ? 0.3 : interval / 1000, ease: "linear" }}
                  />
                )}
                {i < index && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-px w-full" style={{ backgroundColor: "rgba(244,247,251,0.6)" }} />}
              </button>
            ))}
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <AnimatePresence mode="wait">
              <motion.span
                key={index}
                className="font-mono text-[11px] uppercase tracking-[0.18em]"
                style={{ color: "rgba(244,247,251,0.6)" }}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.4 }}
              >
                {slides[index].caption}
              </motion.span>
            </AnimatePresence>
            <span className="font-mono text-[11px] tnum" style={{ color: "rgba(244,247,251,0.4)" }}>
              {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-1.5">
              {([-1, 1] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => go(d)}
                  aria-label={d === 1 ? "Siguiente" : "Anterior"}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
                  style={{ border: "1px solid rgba(244,247,251,0.18)", color: "#f4f7fb" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ transform: d === -1 ? "scaleX(-1)" : undefined }}>
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Pasos con panel fijo ───────────────────────────────────────────────── */

/** Notifica cuándo el paso ocupa el centro de la pantalla. */
export function StepTrigger({ index, onActive, children, className }: { index: number; onActive: (i: number) => void; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => { if (inView) onActive(index); }, [inView, index, onActive]);
  return <div ref={ref} className={className}>{children}</div>;
}

/* ── Tarjetas apiladas ──────────────────────────────────────────────────── */

/** `true` en pantallas de escritorio (≥1024px); `false` en el servidor y en móvil. */
function useIsDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return desktop;
}

/**
 * Cada tarjeta queda fija y la siguiente la cubre, encogiendo la anterior.
 * En móvil las tarjetas son más altas que la pantalla, así que ahí fluyen
 * normalmente: apilarlas taparía texto antes de poder leerlo.
 */
export function StackCard({ index, total, children, className }: { index: number; total: number; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const desktop = useIsDesktop();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const shrink = desktop && index < total - 1;
  const scale = useTransform(scrollYProgress, [0, 1], [1, shrink ? 0.92 : 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, shrink ? 0.55 : 1]);
  return (
    <div ref={ref} className="lg:sticky" style={{ top: `calc(5.5rem + ${index * 1.25}rem)` }}>
      <motion.div style={{ scale, opacity, transformOrigin: "top center" }} className={className}>
        {children}
      </motion.div>
    </div>
  );
}

/* ── Lightbox de video ──────────────────────────────────────────────────── */

export function VideoLightbox({ id, title, onClose, closeLabel }: { id: string | null; title?: string; onClose: () => void; closeLabel: string }) {
  useEffect(() => {
    if (!id) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [id, onClose]);

  return (
    <AnimatePresence>
      {id && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ backgroundColor: "rgba(5,7,10,0.9)", backdropFilter: "blur(14px)" }}
          onClick={onClose}
          role="dialog" aria-modal="true" aria-label={title}
        >
          <motion.div
            className="relative w-full max-w-5xl"
            initial={{ scale: 0.94, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 10 }}
            transition={{ duration: 0.45, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full overflow-hidden rounded-2xl" style={{ aspectRatio: "16 / 9", boxShadow: "0 40px 120px -30px rgba(0,0,0,0.8)" }}>
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
                style={{ border: 0 }}
              />
            </div>
            <button
              onClick={onClose}
              className="absolute -top-12 right-0 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em]"
              style={{ color: "rgba(244,247,251,0.75)" }}
            >
              {closeLabel}
              <span className="w-8 h-8 rounded-full flex items-center justify-center" style={{ border: "1px solid rgba(244,247,251,0.25)" }}>✕</span>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
