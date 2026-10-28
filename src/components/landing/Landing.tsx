"use client";

import { useCallback, useState } from "react";
import { motion, useScroll, useSpring, useMotionValueEvent, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ArrowUpRight, Instagram, Youtube, Linkedin, Menu, X, Trophy,
  Target, Handshake, Landmark, Play, Sparkles,
} from "lucide-react";
import { Aurora, Reveal, Stagger, StaggerItem, Marquee } from "@/components/fx";
import {
  WordReveal, ScrollWords, Parallax, ParallaxImage, GrowLine, HeroSlider,
  StepTrigger, StackCard, VideoLightbox, EASE, type Slide,
} from "./motion";
import { COPY, VIDEOS, SOCIAL, PARTNERS, BRAND_LOGOS, FOOTER_LOGOS, PLATFORM_URL, AWARDS_URL, type Lang } from "./content";
import { cn } from "@/lib/utils";

const WHAT_ICONS = [Target, Handshake, Landmark];
const EVENT_PHOTOS = ["/media/footer-light-1.png", "/media/footer-light-3.png", "/media/footer-light-4.png", "/media/footer-light-2.png"];

const SLIDES: Record<Lang, Slide[]> = {
  es: [
    { src: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=2200&q=80", alt: "Estadio iluminado de noche", caption: "Estadios" },
    { src: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=2200&q=80", alt: "Corredores en una carrera urbana", caption: "Eventos" },
    { src: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=2200&q=80", alt: "Ciclistas en competencia", caption: "Federaciones" },
    { src: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=2200&q=80", alt: "Atleta entrenando al amanecer", caption: "Clubes" },
  ],
  en: [
    { src: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=2200&q=80", alt: "Stadium lit at night", caption: "Stadiums" },
    { src: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=2200&q=80", alt: "Runners in a city race", caption: "Events" },
    { src: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=2200&q=80", alt: "Cyclists racing", caption: "Federations" },
    { src: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=2200&q=80", alt: "Athlete training at dawn", caption: "Clubs" },
  ],
};

export function Landing() {
  const [lang, setLang] = useState<Lang>("es");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [video, setVideo] = useState<string | null>(null);
  const t = <T,>(v: Record<Lang, T>) => v[lang];

  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));
  const onStep = useCallback((i: number) => setActiveStep(i), []);

  const navLinks = [
    { href: "#que-hacemos", label: t(COPY.nav.what) },
    { href: "#como-funciona", label: t(COPY.nav.how) },
    { href: "#nosotros", label: t(COPY.nav.about) },
    { href: "#awards", label: t(COPY.nav.awards) },
  ];

  const featured = VIDEOS[0];
  const step = COPY.how.steps[activeStep];

  return (
    <div className="grain min-h-screen" style={{ backgroundColor: "#05070a" }}>
      {/* Barra de progreso de lectura */}
      <motion.div aria-hidden className="fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left" style={{ scaleX: progress, background: "linear-gradient(90deg, #22d3ee, #a78bfa)" }} />

      {/* ══════════ NAV flotante ══════════ */}
      <header className="fixed top-0 inset-x-0 z-50 pointer-events-none">
        <div className={cn("mx-auto px-4 transition-all duration-500", scrolled ? "max-w-5xl pt-3" : "max-w-7xl pt-5")}>
          <div
            className={cn("pointer-events-auto flex items-center gap-6 px-4 lg:px-5 transition-all duration-500 rounded-2xl", scrolled ? "h-14" : "h-16")}
            style={scrolled
              ? { backgroundColor: "rgba(11,15,22,0.72)", backdropFilter: "blur(18px) saturate(1.3)", border: "1px solid rgba(244,247,251,0.1)", boxShadow: "0 20px 60px -30px rgba(0,0,0,0.8)" }
              : { backgroundColor: "transparent", border: "1px solid transparent" }}
          >
            <a href="#inicio" className="flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.svg" alt="BetterSport" className="h-6 w-auto object-contain" style={{ filter: "brightness(0) invert(1)" }} />
            </a>

            <nav className="hidden lg:flex items-center gap-7 ml-4">
              {navLinks.map((l) => (
                <a key={l.href} href={l.href} className="group relative text-[13px] font-medium transition-colors hover:text-white" style={{ color: "#c0c9d6" }}>
                  {l.label}
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" style={{ backgroundColor: "#22d3ee" }} />
                </a>
              ))}
            </nav>

            <div className="ml-auto flex items-center gap-2.5">
              <div className="flex items-center rounded-full p-0.5" style={{ backgroundColor: "rgba(244,247,251,0.06)", border: "1px solid rgba(244,247,251,0.1)" }}>
                {(["es", "en"] as Lang[]).map((l) => (
                  <button key={l} onClick={() => setLang(l)} aria-pressed={lang === l}
                    className="px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold uppercase transition-all"
                    style={lang === l ? { backgroundColor: "#f4f7fb", color: "#05070a" } : { color: "#8b95a5" }}>
                    {l}
                  </button>
                ))}
              </div>
              <a href={PLATFORM_URL} className="hidden sm:inline-flex items-center gap-2 h-10 px-4 rounded-full text-[13px] font-semibold transition-all hover:gap-3"
                style={{ backgroundColor: "#f4f7fb", color: "#05070a" }}>
                {t(COPY.nav.login)} <ArrowUpRight size={14} />
              </a>
              <button className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center" style={{ color: "#f4f7fb", border: "1px solid rgba(244,247,251,0.15)" }} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menú">
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Menú móvil a pantalla completa */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            className="fixed inset-0 z-40 lg:hidden flex flex-col justify-end px-6 pb-10 pt-28"
            style={{ backgroundColor: "rgba(5,7,10,0.96)", backdropFilter: "blur(20px)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            {navLinks.map((l, i) => (
              <motion.a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                className="font-display text-4xl font-semibold py-3 text-white"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + i * 0.06, ease: EASE }}>
                {l.label}
              </motion.a>
            ))}
            <a href={PLATFORM_URL} className="btn-primary justify-center mt-6 !py-4 !rounded-full">
              {t(COPY.nav.platform)} <ArrowRight size={16} />
            </a>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* ══════════ HERO · slider ══════════ */}
      <section id="inicio">
        <HeroSlider slides={t(SLIDES)} className="min-h-[100svh]">
          <div className="max-w-7xl mx-auto px-5 lg:px-8 min-h-[100svh] flex flex-col justify-end pb-28 pt-32">
            <motion.p
              className="eyebrow flex items-center gap-2 mb-7"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7, ease: EASE }}
            >
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex w-full h-full rounded-full animate-pulse-ring" style={{ backgroundColor: "#22d3ee" }} />
                <span className="relative inline-flex w-2 h-2 rounded-full" style={{ backgroundColor: "#22d3ee" }} />
              </span>
              {t(COPY.hero.eyebrow)}
            </motion.p>

            <h1 className="font-display font-semibold text-white leading-[0.95] text-[3.1rem] sm:text-[4.5rem] lg:text-[6.4rem] xl:text-[7.2rem] max-w-[14ch]">
              <WordReveal text={t(COPY.hero.title1)} delay={0.3} />
              <br />
              <WordReveal text={t(COPY.hero.title2)} delay={0.55} className="font-accent text-gradient" />
            </h1>

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:items-end">
              <motion.p
                className="text-base lg:text-xl leading-relaxed max-w-xl"
                style={{ color: "rgba(244,247,251,0.78)" }}
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0, duration: 0.8, ease: EASE }}
              >
                {t(COPY.hero.lead)}
              </motion.p>

              <motion.div
                className="flex flex-wrap items-center gap-3"
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.15, duration: 0.8, ease: EASE }}
              >
                <a href={PLATFORM_URL} className="btn-primary !py-4 !px-7 !text-[15px] !rounded-full">
                  {t(COPY.hero.ctaPlatform)} <ArrowRight size={17} />
                </a>
                <a href={AWARDS_URL} className="inline-flex items-center gap-2 px-6 py-4 rounded-full text-[15px] font-semibold transition-all hover:bg-white/10"
                  style={{ color: "#f4f7fb", border: "1px solid rgba(244,247,251,0.25)", backdropFilter: "blur(10px)" }}>
                  <Trophy size={16} style={{ color: "#fbbf24" }} /> {t(COPY.hero.ctaAwards)}
                </a>
              </motion.div>
            </div>
          </div>
        </HeroSlider>

        {/* Cinta de hechos + apoyos */}
        <div className="relative" style={{ backgroundColor: "#05070a", borderTop: "1px solid rgba(244,247,251,0.08)", borderBottom: "1px solid rgba(244,247,251,0.08)" }}>
          <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr]">
            <div className="flex items-center gap-4 px-5 lg:px-8 py-4 lg:py-0" style={{ borderRight: "1px solid rgba(244,247,251,0.08)" }}>
              <span className="eyebrow whitespace-nowrap">{t(COPY.hero.partners)}</span>
              <div className="flex items-center gap-2">
                {PARTNERS.map((p) => (
                  <span key={p.short} title={p.name} className="font-display font-bold text-sm tracking-tight px-3 py-1.5 rounded-full" style={{ color: "#f4f7fb", border: "1px solid rgba(244,247,251,0.14)" }}>
                    {p.short}
                  </span>
                ))}
              </div>
            </div>
            <Marquee speed={38} className="py-4">
              {t(COPY.hero.facts).map((f) => (
                <span key={f} className="inline-flex items-center gap-5 mx-5 font-mono text-[11px] uppercase tracking-[0.2em] whitespace-nowrap" style={{ color: "rgba(244,247,251,0.6)" }}>
                  {f} <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#22d3ee" }} />
                </span>
              ))}
            </Marquee>
          </div>
        </div>
      </section>

      {/* ══════════ MARCAS + QUÉ HACEMOS · papel ══════════ */}
      <section id="que-hacemos" className="paper relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8 pt-16 lg:pt-20">
          <Reveal className="flex items-center gap-5">
            <p className="eyebrow whitespace-nowrap">{t(COPY.hero.brands)}</p>
            <GrowLine className="h-px flex-1" style={{ backgroundColor: "rgba(5,7,10,0.12)" }} />
          </Reveal>
        </div>
        <div className="mt-8 space-y-5">
          <Marquee speed={60}>
            {BRAND_LOGOS.slice(0, 8).map((src) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={src} src={src} alt="" loading="lazy" className="lp-logo h-9 lg:h-11 w-auto object-contain mx-9" />
            ))}
          </Marquee>
          <Marquee speed={72} className="[&>div]:[animation-direction:reverse]">
            {BRAND_LOGOS.slice(8).map((src) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={src} src={src} alt="" loading="lazy" className="lp-logo h-9 lg:h-11 w-auto object-contain mx-9" />
            ))}
          </Marquee>
        </div>

        <div className="relative max-w-7xl mx-auto px-5 lg:px-8 pt-24 lg:pt-32 pb-24 lg:pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
            <div className="lg:col-span-8">
              <Reveal><p className="eyebrow mb-4">{t(COPY.what.eyebrow)}</p></Reveal>
              <h2 className="font-display font-semibold leading-[0.98] text-4xl sm:text-5xl lg:text-[4.5rem]" style={{ color: "#05070a" }}>
                <WordReveal text={t(COPY.what.title)} inView stagger={0.04} />
              </h2>
            </div>
            <Reveal delay={0.2} className="lg:col-span-4 lg:pb-3">
              <p className="text-base leading-relaxed" style={{ color: "#5b6472" }}>{t(COPY.how.lead)}</p>
            </Reveal>
          </div>

          {/* Bento */}
          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-14 lg:mt-20">
            {COPY.what.cards.map((c, i) => {
              const Icon = WHAT_ICONS[i];
              const wide = i === 0;
              return (
                <StaggerItem key={i} className={cn(wide && "md:col-span-2")}>
                  <article className={cn("paper-card relative overflow-hidden h-full p-8 lg:p-10 flex flex-col", wide && "lg:min-h-[26rem]")}>
                    <div className={cn("flex flex-col h-full", wide && "lg:max-w-[52%]")}>
                      <div className="flex items-center justify-between">
                        <span className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ color: "#0e7490", backgroundColor: "rgba(14,116,144,0.08)" }}>
                          <Icon size={20} />
                        </span>
                        <span className="font-display font-semibold text-5xl lg:text-6xl text-outline leading-none">0{i + 1}</span>
                      </div>
                      <h3 className="font-display font-semibold text-2xl lg:text-[1.9rem] leading-tight mt-8 tracking-tight" style={{ color: "#05070a" }}>{t(c.title)}</h3>
                      <p className="text-[15px] leading-relaxed mt-4" style={{ color: "#5b6472" }}>{t(c.text)}</p>
                    </div>

                    {wide && (
                      <div aria-hidden className="hidden lg:block absolute right-0 top-0 bottom-0 w-[46%]">
                        {EVENT_PHOTOS.map((src, k) => (
                          <Parallax key={src} speed={0.08 + k * 0.05} className="absolute" style={{
                            width: "54%",
                            left: `${[2, 44, 10, 50][k]}%`,
                            top: `${[-6, 8, 48, 52][k]}%`,
                            transform: `rotate(${[-6, 5, 4, -5][k]}deg)`,
                          }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={src} alt="" className="w-full h-auto" style={{ filter: "drop-shadow(0 20px 30px rgba(5,7,10,0.25))" }} loading="lazy" />
                          </Parallax>
                        ))}
                      </div>
                    )}
                  </article>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* ══════════ MANIFIESTO · scroll ══════════ */}
      <section className="relative overflow-hidden py-28 lg:py-44" style={{ backgroundColor: "#05070a" }}>
        <ParallaxImage src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=2000&q=70" opacity={0.18} speed={0.2} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(60% 50% at 50% 50%, transparent, #05070a 100%)" }} />
        <div className="relative max-w-6xl mx-auto px-5 lg:px-8">
          <Reveal><p className="eyebrow mb-10 text-center">{t(COPY.how.eyebrow)}</p></Reveal>
          <ScrollWords
            text={t(COPY.how.quote)}
            className="font-display font-semibold text-white text-center leading-[1.02] text-4xl sm:text-5xl lg:text-[5.2rem] tracking-tight"
          />
        </div>
      </section>

      {/* ══════════ CÓMO FUNCIONA · pasos fijos ══════════ */}
      <section id="como-funciona" className="relative" style={{ backgroundColor: "#0b0f16", borderTop: "1px solid rgba(244,247,251,0.06)" }}>
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-24 lg:py-32 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Panel fijo */}
          <div className="lg:sticky lg:top-28 self-start">
            <p className="eyebrow mb-5">{t(COPY.how.stepsEyebrow)}</p>
            <div className="relative h-[8rem] lg:h-[11rem] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={activeStep}
                  className="font-display font-semibold text-[7rem] lg:text-[10rem] leading-none text-gradient absolute left-0 top-0"
                  initial={{ y: "40%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "-40%", opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  {step.n}
                </motion.span>
              </AnimatePresence>
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={activeStep} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4, ease: EASE }}>
                <h2 className="font-display font-semibold text-3xl lg:text-5xl text-white tracking-tight leading-tight">{t(step.title)}</h2>
                <p className="mt-4 text-base lg:text-lg leading-relaxed max-w-md" style={{ color: "#a8b3c4" }}>{t(step.text)}</p>
              </motion.div>
            </AnimatePresence>
            <div className="flex items-center gap-2 mt-8">
              {COPY.how.steps.map((s, i) => (
                <span key={s.n} className="h-1 rounded-full transition-all duration-500" style={{ width: i === activeStep ? 40 : 12, backgroundColor: i <= activeStep ? "#22d3ee" : "rgba(244,247,251,0.15)" }} />
              ))}
            </div>
          </div>

          {/* Pasos que disparan el panel */}
          <div className="flex flex-col gap-5 lg:py-[20vh]">
            {COPY.how.steps.map((s, i) => (
              <StepTrigger key={s.n} index={i} onActive={onStep}>
                <motion.article
                  className="glass p-7 lg:p-9 transition-colors duration-500"
                  animate={{ borderColor: i === activeStep ? "rgba(34,211,238,0.45)" : "rgba(244,247,251,0.08)", scale: i === activeStep ? 1 : 0.985 }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs tnum" style={{ color: "#22d3ee" }}>{s.n}</span>
                    <span className="w-2 h-2 rounded-full transition-colors duration-500" style={{ backgroundColor: i === activeStep ? "#22d3ee" : "rgba(244,247,251,0.2)" }} />
                  </div>
                  <h3 className="font-display font-semibold text-2xl mt-5 text-white tracking-tight">{t(s.title)}</h3>
                  <p className="text-[15px] leading-relaxed mt-3" style={{ color: "#8b95a5" }}>{t(s.text)}</p>
                </motion.article>
              </StepTrigger>
            ))}
          </div>
        </div>

        {/* Technology Licensing Model: flujo animado */}
        <div className="max-w-7xl mx-auto px-5 lg:px-8 pb-24 lg:pb-32">
          <Reveal>
            <div className="glass ring-gradient p-8 lg:p-12 overflow-hidden relative">
              <Aurora intensity={0.35} />
              <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div>
                  <p className="eyebrow mb-4">{lang === "es" ? "Nuestro modelo" : "Our model"}</p>
                  <h3 className="font-display font-semibold text-3xl lg:text-4xl text-white tracking-tight">{t(COPY.how.modelTitle)}</h3>
                  <p className="text-[15px] lg:text-base leading-relaxed mt-5" style={{ color: "#a8b3c4" }}>{t(COPY.how.modelText)}</p>
                </div>
                <div className="relative">
                  <svg viewBox="0 0 520 160" className="w-full h-auto" aria-hidden>
                    <defs>
                      <linearGradient id="flow" x1="0" x2="1"><stop offset="0" stopColor="#22d3ee" /><stop offset="1" stopColor="#a78bfa" /></linearGradient>
                    </defs>
                    <path d="M70 80 H170 M240 80 H340 M410 80 H450" stroke="url(#flow)" strokeWidth="2" className="animate-flow" fill="none" />
                    <path d="M450 80 C 490 80, 490 20, 450 20 H 110 C 70 20, 70 60, 90 70" stroke="rgba(167,139,250,0.45)" strokeWidth="1.5" strokeDasharray="4 6" fill="none" className="animate-flow" />
                    {t(COPY.how.flow).map((label, i) => {
                      const cx = [70, 205, 375, 480][i];
                      return (
                        <g key={label}>
                          <circle cx={cx} cy="80" r="30" fill="#0b0f16" stroke="rgba(34,211,238,0.5)" strokeWidth="1.5" />
                          <circle cx={cx} cy="80" r="6" fill="#22d3ee">
                            <animate attributeName="r" values="5;8;5" dur="2.4s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
                          </circle>
                          <text x={cx} y="132" textAnchor="middle" fill="#c0c9d6" fontSize="12" fontFamily="JetBrains Mono, monospace" letterSpacing="1.5">{label.toUpperCase()}</text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════ NOSOTROS · tarjetas apiladas ══════════ */}
      <section id="nosotros" className="relative" style={{ backgroundColor: "#05070a" }}>
        <div className="max-w-7xl mx-auto px-5 lg:px-8 pt-24 lg:pt-32">
          <Reveal><p className="eyebrow mb-4">{t(COPY.about.eyebrow)}</p></Reveal>
          <h2 className="font-display font-semibold text-white leading-[0.98] text-4xl sm:text-5xl lg:text-[4.5rem] max-w-4xl tracking-tight">
            <WordReveal text={t(COPY.about.title)} inView stagger={0.04} />
          </h2>
        </div>

        <div className="max-w-7xl mx-auto px-5 lg:px-8 pt-16 pb-24 lg:pb-40 space-y-6">
          {[
            { block: COPY.about, tone: "paper" as const },
            { block: COPY.purpose, tone: "glass" as const },
            { block: COPY.vision, tone: "violet" as const },
          ].map(({ block, tone }, i, arr) => (
            <StackCard key={i} index={i} total={arr.length}>
              <div
                className={cn("relative overflow-hidden rounded-[2rem] p-8 lg:p-14 min-h-[60vh] flex flex-col", tone === "paper" && "paper-card", tone === "glass" && "glass")}
                style={tone === "violet"
                  ? { background: "linear-gradient(135deg, #140f2b, #0b0f16 60%)", border: "1px solid rgba(167,139,250,0.35)" }
                  : tone === "paper" ? { backgroundColor: "#f4f7fb" } : undefined}
              >
                {tone === "violet" && <div aria-hidden className="absolute -top-40 -right-40 w-[34rem] h-[34rem] rounded-full animate-drift" style={{ background: "radial-gradient(circle, rgba(167,139,250,0.35), transparent 65%)", filter: "blur(60px)" }} />}
                {tone === "glass" && <Aurora intensity={0.4} />}
                <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 flex-1">
                  <div className="lg:col-span-5">
                    <p className="eyebrow mb-4" style={tone === "paper" ? { color: "#0e7490" } : undefined}>{t(block.eyebrow)}</p>
                    <h3 className="font-display font-semibold text-3xl lg:text-[2.6rem] leading-[1.05] tracking-tight" style={{ color: tone === "paper" ? "#05070a" : "#f4f7fb" }}>
                      {t(block.title)}
                    </h3>
                    <p className="font-accent text-2xl lg:text-3xl mt-8 leading-snug" style={{ color: tone === "paper" ? "#0e7490" : "#2dd4bf" }}>
                      {t(block.closing)}
                    </p>
                  </div>
                  <div className="lg:col-span-7 space-y-4 lg:columns-2 lg:gap-8">
                    {t(block.paragraphs).map((p, k) => (
                      <p key={k} className="text-[15px] leading-relaxed break-inside-avoid" style={{ color: tone === "paper" ? "#5b6472" : "#a8b3c4" }}>{p}</p>
                    ))}
                  </div>
                </div>
                <span className="absolute bottom-6 right-8 font-mono text-[11px] tnum" style={{ color: tone === "paper" ? "rgba(5,7,10,0.35)" : "rgba(244,247,251,0.35)" }}>
                  {String(i + 1).padStart(2, "0")} / {String(arr.length).padStart(2, "0")}
                </span>
              </div>
            </StackCard>
          ))}
        </div>
      </section>

      {/* ══════════ GALERÍA · video destacado + lightbox ══════════ */}
      <section id="galeria" className="relative py-24 lg:py-32" style={{ backgroundColor: "#0b0f16", borderTop: "1px solid rgba(244,247,251,0.06)" }}>
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <Reveal className="flex flex-wrap items-end justify-between gap-6 mb-12">
            <div>
              <p className="eyebrow mb-4">{t(COPY.videos.eyebrow)}</p>
              <h2 className="font-display font-semibold text-white text-4xl sm:text-5xl lg:text-[4rem] leading-[0.98] tracking-tight">{t(COPY.videos.title)}</h2>
              <p className="text-base mt-4 max-w-xl" style={{ color: "#8b95a5" }}>{t(COPY.videos.lead)}</p>
            </div>
            <a href={SOCIAL.youtube} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 h-11 px-5 rounded-full text-[13px] font-semibold transition-colors hover:bg-white/10" style={{ color: "#f4f7fb", border: "1px solid rgba(244,247,251,0.2)" }}>
              <Youtube size={15} /> {t(COPY.videos.channel)}
            </a>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <Reveal className="lg:col-span-8">
              <VideoCard video={featured} lang={lang} big onPlay={setVideo} playLabel={t(COPY.videos.play)} />
            </Reveal>
            <Stagger className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-5">
              {VIDEOS.slice(1).map((v) => (
                <StaggerItem key={v.id}>
                  <VideoCard video={v} lang={lang} onPlay={setVideo} playLabel={t(COPY.videos.play)} />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* ══════════ AWARDS 2026 ══════════ */}
      <section id="awards" className="relative overflow-hidden py-28 lg:py-40" style={{ backgroundColor: "#05070a" }}>
        <ParallaxImage src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=2000&q=70" opacity={0.22} speed={0.18} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #05070a 0%, rgba(5,7,10,0.5) 50%, #05070a 100%)" }} />
        <div aria-hidden className="absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none select-none">
          <Parallax speed={0.3}>
            <p className="font-display font-bold text-outline text-center leading-none text-[26vw] lg:text-[22vw]" style={{ WebkitTextStrokeColor: "rgba(251,191,36,0.22)" }}>2026</p>
          </Parallax>
        </div>
        <div className="relative max-w-5xl mx-auto px-5 lg:px-8 text-center">
          <Reveal>
            <span className="inline-flex w-16 h-16 rounded-full items-center justify-center mb-8" style={{ color: "#fbbf24", backgroundColor: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.4)" }}>
              <Trophy size={26} />
            </span>
            <p className="eyebrow mb-5" style={{ color: "#fbbf24" }}>{t(COPY.awards.eyebrow)}</p>
          </Reveal>
          <h2 className="font-display font-semibold text-white text-4xl sm:text-6xl lg:text-[5.4rem] leading-[0.96] tracking-tight">
            <WordReveal text={t(COPY.awards.title)} inView stagger={0.05} />
          </h2>
          <Reveal delay={0.2}>
            <p className="text-base lg:text-lg mt-7 max-w-2xl mx-auto leading-relaxed" style={{ color: "#c0c9d6" }}>{t(COPY.awards.lead)}</p>
            <a href={AWARDS_URL} className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-[15px] font-bold mt-10 transition-transform hover:scale-[1.03]"
              style={{ color: "#04121a", background: "linear-gradient(100deg, #fcd34d, #fbbf24 60%, #fb923c)", boxShadow: "0 20px 50px -16px rgba(251,191,36,0.6)" }}>
              {t(COPY.awards.cta)} <ArrowRight size={17} />
            </a>
          </Reveal>
        </div>
      </section>

      {/* ══════════ CTA FINAL ══════════ */}
      <section className="paper relative overflow-hidden py-28 lg:py-40">
        <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(60% 60% at 50% 100%, rgba(34,211,238,0.18), transparent 70%)" }} />
        <div className="relative max-w-5xl mx-auto px-5 lg:px-8 text-center">
          <Reveal><Sparkles size={22} className="mx-auto mb-8" style={{ color: "#0e7490" }} /></Reveal>
          <h2 className="font-display font-semibold leading-[0.96] text-5xl sm:text-6xl lg:text-[6.5rem] tracking-tight" style={{ color: "#05070a" }}>
            <WordReveal text={t(COPY.cta.title)} inView stagger={0.06} />
          </h2>
          <Reveal delay={0.2}>
            <p className="text-base lg:text-xl mt-8 max-w-2xl mx-auto leading-relaxed" style={{ color: "#5b6472" }}>{t(COPY.cta.lead)}</p>
            <a href={PLATFORM_URL} className="inline-flex items-center gap-3 mt-10 h-14 pl-7 pr-2 rounded-full text-base font-semibold transition-all hover:gap-4" style={{ backgroundColor: "#05070a", color: "#f4f7fb" }}>
              {t(COPY.cta.button)}
              <span className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "#22d3ee", color: "#04121a" }}><ArrowUpRight size={18} /></span>
            </a>
          </Reveal>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer className="relative overflow-hidden" style={{ backgroundColor: "#05070a", borderTop: "1px solid rgba(244,247,251,0.08)" }}>
        <div className="max-w-7xl mx-auto px-5 lg:px-8 pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            <div className="md:col-span-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.svg" alt="BetterSport" className="h-7 w-auto object-contain" style={{ filter: "brightness(0) invert(1)" }} />
              <p className="font-accent text-2xl mt-5 max-w-sm leading-snug" style={{ color: "#c0c9d6" }}>{t(COPY.footer.tagline)}</p>
            </div>
            <div className="md:col-span-3">
              <p className="eyebrow mb-4">{lang === "es" ? "Navegación" : "Navigation"}</p>
              <ul className="space-y-2.5">
                {navLinks.map((l) => (
                  <li key={l.href}><a href={l.href} className="text-sm transition-colors hover:text-white" style={{ color: "#8b95a5" }}>{l.label}</a></li>
                ))}
                <li><a href={PLATFORM_URL} className="text-sm transition-colors hover:text-white" style={{ color: "#8b95a5" }}>{t(COPY.nav.platform)}</a></li>
              </ul>
            </div>
            <div className="md:col-span-4">
              <p className="eyebrow mb-4">{t(COPY.hero.partners)}</p>
              <div className="flex items-center gap-2 flex-wrap">
                {FOOTER_LOGOS.map((src) => (
                  <span key={src} className="inline-flex items-center h-11 px-3.5 rounded-xl" style={{ backgroundColor: "#f4f7fb" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="h-6 w-auto object-contain" loading="lazy" />
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-6">
                {[
                  { Icon: Instagram, href: SOCIAL.instagram, label: "Instagram" },
                  { Icon: Youtube, href: SOCIAL.youtube, label: "YouTube" },
                  { Icon: Linkedin, href: SOCIAL.linkedin, label: "LinkedIn" },
                ].map(({ Icon, href, label }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
                    style={{ color: "#c0c9d6", border: "1px solid rgba(244,247,251,0.14)" }}>
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 mt-14 pt-6" style={{ borderTop: "1px solid rgba(244,247,251,0.08)" }}>
            <p className="text-xs" style={{ color: "#566173" }}>© {new Date().getFullYear()} BetterSport. {t(COPY.footer.rights)}</p>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: "#566173" }}>Santiago · Chile</p>
          </div>
        </div>

        {/* Marca gigante recortada */}
        <div aria-hidden className="relative h-[13vw] lg:h-[11vw] overflow-hidden select-none pointer-events-none">
          <p className="font-display font-bold text-outline leading-none text-center text-[19vw] lg:text-[16.5vw] absolute inset-x-0 -top-[1vw] whitespace-nowrap" style={{ WebkitTextStrokeColor: "rgba(244,247,251,0.1)" }}>
            BETTERSPORT
          </p>
        </div>
      </footer>

      <VideoLightbox id={video} title={VIDEOS.find((v) => v.id === video)?.title[lang]} onClose={() => setVideo(null)} closeLabel={t(COPY.videos.close)} />
    </div>
  );
}

/* ── Tarjeta de video (miniatura + play; el iframe solo carga en el lightbox) ── */
function VideoCard({ video, lang, big = false, onPlay, playLabel }: {
  video: (typeof VIDEOS)[number]; lang: Lang; big?: boolean; onPlay: (id: string) => void; playLabel: string;
}) {
  return (
    <button
      onClick={() => onPlay(video.id)}
      className="group relative w-full overflow-hidden rounded-[1.5rem] text-left"
      style={{ aspectRatio: big ? "16 / 9" : "16 / 10", border: "1px solid rgba(244,247,251,0.1)" }}
      aria-label={`${playLabel}: ${video.title[lang]}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://i.ytimg.com/vi/${video.id}/${big ? "maxresdefault" : "hqdefault"}.jpg`}
        alt=""
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
        style={{ filter: "saturate(0.9)" }}
      />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(5,7,10,0.1) 30%, rgba(5,7,10,0.85) 100%)" }} />
      <div className={cn("absolute inset-x-0 bottom-0 flex items-end justify-between gap-4", big ? "p-7 lg:p-9" : "p-5")}>
        <div className="min-w-0">
          <span className="eyebrow">{video.cat[lang]}</span>
          <h3 className={cn("font-display font-semibold text-white leading-tight mt-2 tracking-tight", big ? "text-xl lg:text-3xl max-w-2xl" : "text-sm lg:text-base line-clamp-2")}>{video.title[lang]}</h3>
        </div>
        <span className={cn("flex-shrink-0 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110", big ? "w-16 h-16" : "w-11 h-11")}
          style={{ backgroundColor: "#f4f7fb", color: "#05070a" }}>
          <Play size={big ? 22 : 15} fill="currentColor" />
        </span>
      </div>
    </button>
  );
}
