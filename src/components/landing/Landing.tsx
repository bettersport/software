"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight, Instagram, Youtube, Linkedin, Menu, X, Trophy,
  Target, Handshake, Landmark, Languages, PlayCircle, Sparkles,
} from "lucide-react";
import { Aurora, Reveal, Stagger, StaggerItem } from "@/components/fx";
import { COPY, VIDEOS, SOCIAL, PARTNERS, PLATFORM_URL, AWARDS_URL, type Lang } from "./content";
import { cn } from "@/lib/utils";

const WHAT_ICONS = [Target, Handshake, Landmark];

export function Landing() {
  const [lang, setLang] = useState<Lang>("es");
  const [menuOpen, setMenuOpen] = useState(false);
  const t = <T,>(v: Record<Lang, T>) => v[lang];

  const navLinks = [
    { href: "#que-hacemos", label: t(COPY.nav.what) },
    { href: "#como-funciona", label: t(COPY.nav.how) },
    { href: "#nosotros", label: t(COPY.nav.about) },
    { href: "#awards", label: t(COPY.nav.awards) },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#05070a" }}>
      {/* ══════════ NAV ══════════ */}
      <header className="sticky top-0 z-50 topbar-bg">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 h-16 flex items-center gap-6">
          <a href="#inicio" className="flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="BetterSport" className="h-7 w-auto object-contain" style={{ filter: "brightness(0) invert(1)" }} />
          </a>

          <nav className="hidden lg:flex items-center gap-7 ml-4">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="text-sm transition-colors hover:text-white" style={{ color: "#a8b3c4" }}>
                {l.label}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            {/* Selector de idioma */}
            <div className="flex items-center rounded-lg p-0.5" style={{ backgroundColor: "rgba(244,247,251,0.06)", border: "1px solid rgba(244,247,251,0.1)" }}>
              <Languages size={13} className="ml-1.5 mr-0.5" style={{ color: "#6b7789" }} />
              {(["es", "en"] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={cn("px-2 py-1 rounded-md text-[11px] font-mono font-semibold uppercase transition-all")}
                  style={lang === l
                    ? { backgroundColor: "rgba(34,211,238,0.15)", color: "#22d3ee" }
                    : { color: "#6b7789" }}
                  aria-pressed={lang === l}
                >
                  {l}
                </button>
              ))}
            </div>

            <a href={PLATFORM_URL} className="hidden sm:inline-flex btn-primary !py-2 !px-4 !text-[13px] !rounded-lg">
              {t(COPY.nav.platform)} <ArrowRight size={14} />
            </a>

            <button className="lg:hidden p-2 rounded-lg" style={{ color: "#a8b3c4" }} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menú">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="lg:hidden overflow-hidden px-5 pb-4 flex flex-col gap-1"
            style={{ borderTop: "1px solid rgba(244,247,251,0.08)" }}
          >
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="py-2.5 text-sm" style={{ color: "#a8b3c4" }}>
                {l.label}
              </a>
            ))}
            <a href={PLATFORM_URL} className="btn-primary justify-center mt-2 !py-2.5 !rounded-lg">
              {t(COPY.nav.platform)} <ArrowRight size={14} />
            </a>
          </motion.nav>
        )}
      </header>

      {/* ══════════ HERO ══════════ */}
      <section id="inicio" className="relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=2200&q=80"
            alt=""
            className="w-full h-full object-cover"
            style={{ opacity: 0.45, filter: "saturate(0.8)" }}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(5,7,10,0.72) 0%, rgba(5,7,10,0.82) 55%, #05070a 100%)" }} />
        </div>
        <Aurora intensity={0.7} className="-z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-8 pt-20 pb-16 lg:pt-28 lg:pb-24">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="max-w-4xl">
            <p className="eyebrow flex items-center gap-2 mb-6">
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex w-full h-full rounded-full animate-pulse-ring" style={{ backgroundColor: "#22d3ee" }} />
                <span className="relative inline-flex w-2 h-2 rounded-full" style={{ backgroundColor: "#22d3ee" }} />
              </span>
              {t(COPY.hero.eyebrow)}
            </p>

            <h1 className="text-[2.5rem] sm:text-5xl lg:text-[4.25rem] font-extrabold leading-[1.03] tracking-tight text-white" style={{ fontFamily: "'Manrope', sans-serif" }}>
              {t(COPY.hero.title1)}<br />
              <span className="text-gradient">{t(COPY.hero.title2)}</span>
            </h1>

            <p className="mt-7 text-base lg:text-xl leading-relaxed max-w-2xl" style={{ color: "rgba(244,247,251,0.72)" }}>
              {t(COPY.hero.lead)}
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-10">
              <a href={PLATFORM_URL} className="btn-primary !py-3.5 !px-6 !text-[15px] !rounded-xl">
                {t(COPY.hero.ctaPlatform)} <ArrowRight size={17} />
              </a>
              <a href={AWARDS_URL} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-[15px] font-semibold transition-all hover:scale-[1.02]"
                style={{ color: "#fbbf24", backgroundColor: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.35)" }}>
                <Trophy size={17} /> {t(COPY.hero.ctaAwards)}
              </a>
            </div>
          </motion.div>

          {/* Nos apoyan */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-16 lg:mt-24">
            <p className="eyebrow mb-4">{t(COPY.hero.partners)}</p>
            <div className="flex flex-wrap items-center gap-3">
              {PARTNERS.map((p) => (
                <div key={p.short} className="glass !rounded-xl px-5 py-3 flex flex-col" title={p.name}>
                  <span className="text-base font-extrabold tracking-tight text-white" style={{ fontFamily: "'Manrope', sans-serif" }}>{p.short}</span>
                  <span className="text-[10px] mt-0.5" style={{ color: "#6b7789" }}>{p.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════ QUÉ HACEMOS ══════════ */}
      <section id="que-hacemos" className="relative max-w-7xl mx-auto px-5 lg:px-8 py-20 lg:py-28">
        <Reveal>
          <p className="eyebrow mb-3">{t(COPY.what.eyebrow)}</p>
          <h2 className="text-3xl lg:text-[2.75rem] font-extrabold leading-tight tracking-tight max-w-3xl" style={{ color: "#f4f7fb", fontFamily: "'Manrope', sans-serif" }}>
            {t(COPY.what.title)}
          </h2>
        </Reveal>

        <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12">
          {COPY.what.cards.map((c, i) => {
            const Icon = WHAT_ICONS[i];
            return (
              <StaggerItem key={i}>
                <div className="glass glass-hover p-7 h-full">
                  <span className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                    style={{ color: "#22d3ee", backgroundColor: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.25)" }}>
                    <Icon size={20} />
                  </span>
                  <h3 className="text-lg font-bold mb-2.5" style={{ color: "#f4f7fb" }}>{t(c.title)}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#a8b3c4" }}>{t(c.text)}</p>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>

      {/* ══════════ CÓMO FUNCIONA ══════════ */}
      <section id="como-funciona" className="relative overflow-hidden py-20 lg:py-28" style={{ backgroundColor: "#0b0f16" }}>
        <div aria-hidden className="grid-plane absolute inset-0 opacity-40 mask-fade-b" />
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8">
          <Reveal>
            <p className="eyebrow mb-3">{t(COPY.how.eyebrow)}</p>
            <blockquote className="text-2xl lg:text-4xl font-extrabold leading-snug tracking-tight max-w-3xl" style={{ color: "#f4f7fb", fontFamily: "'Manrope', sans-serif" }}>
              <span className="text-gradient">&ldquo;{t(COPY.how.quote)}&rdquo;</span>
            </blockquote>
            <p className="mt-7 text-base leading-relaxed max-w-3xl" style={{ color: "#a8b3c4" }}>{t(COPY.how.lead)}</p>
          </Reveal>

          {/* Diagrama del modelo */}
          <div className="mt-14">
            <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {COPY.how.steps.map((s, i) => (
                <StaggerItem key={s.n}>
                  <div className="relative glass glass-hover p-6 h-full">
                    {/* conector hacia el siguiente paso */}
                    {i < COPY.how.steps.length - 1 && (
                      <span aria-hidden className="hidden lg:block absolute top-11 -right-4 w-8 h-px z-10"
                        style={{ background: "linear-gradient(90deg, rgba(34,211,238,0.5), rgba(34,211,238,0.1))" }} />
                    )}
                    <span className="font-mono text-xs font-bold tnum" style={{ color: "#22d3ee" }}>{s.n}</span>
                    <h3 className="text-base font-bold mt-3 mb-2" style={{ color: "#f4f7fb" }}>{t(s.title)}</h3>
                    <p className="text-[13px] leading-relaxed" style={{ color: "#8b95a5" }}>{t(s.text)}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          <Reveal delay={0.1}>
            <div className="glass ring-gradient p-8 lg:p-10 mt-6">
              <p className="eyebrow mb-3">{lang === "es" ? "Nuestro modelo" : "Our model"}</p>
              <h3 className="text-xl lg:text-2xl font-extrabold mb-4" style={{ color: "#f4f7fb", fontFamily: "'Manrope', sans-serif" }}>
                {t(COPY.how.modelTitle)}
              </h3>
              <p className="text-sm lg:text-base leading-relaxed max-w-4xl" style={{ color: "#a8b3c4" }}>{t(COPY.how.modelText)}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════ QUIÉNES SOMOS ══════════ */}
      <section id="nosotros" className="relative max-w-7xl mx-auto px-5 lg:px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-12 lg:gap-16">
          <Reveal>
            <p className="eyebrow mb-3">{t(COPY.about.eyebrow)}</p>
            <h2 className="text-3xl lg:text-[2.5rem] font-extrabold leading-tight tracking-tight" style={{ color: "#f4f7fb", fontFamily: "'Manrope', sans-serif" }}>
              {t(COPY.about.title)}
            </h2>
            <div className="glass p-6 mt-8">
              <Sparkles size={18} style={{ color: "#a78bfa" }} />
              <p className="text-sm leading-relaxed mt-3" style={{ color: "#c0c9d6" }}>{t(COPY.about.closing)}</p>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="space-y-4">
            {t(COPY.about.paragraphs).map((p, i) => (
              <p key={i} className="text-sm lg:text-base leading-relaxed" style={{ color: "#a8b3c4" }}>{p}</p>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ══════════ PROPÓSITO Y VISIÓN ══════════ */}
      <section className="relative py-20 lg:py-28" style={{ backgroundColor: "#0b0f16" }}>
        <div className="max-w-7xl mx-auto px-5 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[COPY.purpose, COPY.vision].map((block, bi) => (
            <Reveal key={bi} delay={bi * 0.1}>
              <div className="glass p-8 lg:p-10 h-full">
                <p className="eyebrow mb-4">{t(block.eyebrow)}</p>
                <h2 className="text-xl lg:text-2xl font-extrabold leading-snug tracking-tight mb-6" style={{ color: "#f4f7fb", fontFamily: "'Manrope', sans-serif" }}>
                  {t(block.title)}
                </h2>
                <div className="space-y-3.5">
                  {t(block.paragraphs).map((p, i) => (
                    <p key={i} className="text-sm leading-relaxed" style={{ color: "#8b95a5" }}>{p}</p>
                  ))}
                </div>
                {"closing" in block && (
                  <p className="text-sm font-semibold mt-6 pt-5" style={{ color: "#2dd4bf", borderTop: "1px solid rgba(244,247,251,0.08)" }}>
                    {t(block.closing)}
                  </p>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══════════ VIDEOS ══════════ */}
      <section id="galeria" className="relative max-w-7xl mx-auto px-5 lg:px-8 py-20 lg:py-28">
        <Reveal className="flex flex-wrap items-end justify-between gap-4 mb-12">
          <div>
            <p className="eyebrow mb-3">{t(COPY.videos.eyebrow)}</p>
            <h2 className="text-3xl lg:text-[2.5rem] font-extrabold leading-tight tracking-tight" style={{ color: "#f4f7fb", fontFamily: "'Manrope', sans-serif" }}>
              {t(COPY.videos.title)}
            </h2>
            <p className="text-sm mt-3 max-w-xl" style={{ color: "#8b95a5" }}>{t(COPY.videos.lead)}</p>
          </div>
          <a href={SOCIAL.youtube} target="_blank" rel="noopener noreferrer" className="btn-secondary !rounded-xl">
            <PlayCircle size={16} /> {t(COPY.videos.channel)}
          </a>
        </Reveal>

        <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {VIDEOS.map((v) => (
            <StaggerItem key={v.id}>
              <article className="glass glass-hover overflow-hidden h-full flex flex-col">
                <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${v.id}`}
                    title={t(v.title)}
                    loading="lazy"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                    style={{ border: 0 }}
                  />
                </div>
                <div className="p-5">
                  <span className="eyebrow">{t(v.cat)}</span>
                  <h3 className="text-sm font-semibold leading-snug mt-2" style={{ color: "#f4f7fb" }}>{t(v.title)}</h3>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* ══════════ AWARDS 2026 ══════════ */}
      <section id="awards" className="relative max-w-7xl mx-auto px-5 lg:px-8 pb-20 lg:pb-28">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl p-8 lg:p-14"
            style={{
              background: "radial-gradient(120% 140% at 0% 0%, rgba(251,191,36,0.16), transparent 55%), radial-gradient(120% 140% at 100% 100%, rgba(167,139,250,0.14), transparent 55%), linear-gradient(135deg, #0b0f16, #10151f)",
              border: "1px solid rgba(251,191,36,0.3)",
            }}>
            <div aria-hidden className="absolute -top-24 -right-20 w-80 h-80 rounded-full animate-drift" style={{ background: "radial-gradient(circle, rgba(251,191,36,0.18), transparent 65%)", filter: "blur(70px)" }} />
            <div className="relative flex flex-col lg:flex-row lg:items-center gap-8">
              <span className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ color: "#fbbf24", backgroundColor: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.35)" }}>
                <Trophy size={30} />
              </span>
              <div className="flex-1">
                <p className="eyebrow mb-2" style={{ color: "#fbbf24" }}>{t(COPY.awards.eyebrow)}</p>
                <h2 className="text-2xl lg:text-4xl font-extrabold leading-tight tracking-tight" style={{ color: "#f4f7fb", fontFamily: "'Manrope', sans-serif" }}>
                  {t(COPY.awards.title)}
                </h2>
                <p className="text-sm lg:text-base mt-3 max-w-2xl leading-relaxed" style={{ color: "#a8b3c4" }}>{t(COPY.awards.lead)}</p>
              </div>
              <a href={AWARDS_URL} className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-[15px] font-bold flex-shrink-0 transition-all hover:scale-[1.03]"
                style={{ color: "#04121a", background: "linear-gradient(100deg, #fcd34d, #fbbf24 60%, #fb923c)", boxShadow: "0 12px 36px -12px rgba(251,191,36,0.6)" }}>
                {t(COPY.awards.cta)} <ArrowRight size={17} />
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ══════════ CTA FINAL ══════════ */}
      <section className="relative overflow-hidden py-20 lg:py-28" style={{ backgroundColor: "#0b0f16" }}>
        <Aurora intensity={0.5} />
        <Reveal className="relative max-w-3xl mx-auto px-5 text-center">
          <h2 className="text-3xl lg:text-5xl font-extrabold leading-tight tracking-tight" style={{ color: "#f4f7fb", fontFamily: "'Manrope', sans-serif" }}>
            {t(COPY.cta.title)}
          </h2>
          <p className="text-base lg:text-lg mt-5 leading-relaxed" style={{ color: "#a8b3c4" }}>{t(COPY.cta.lead)}</p>
          <a href={PLATFORM_URL} className="btn-primary !py-4 !px-8 !text-base !rounded-xl mt-9 inline-flex">
            {t(COPY.cta.button)} <ArrowRight size={18} />
          </a>
        </Reveal>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer className="relative" style={{ borderTop: "1px solid rgba(244,247,251,0.08)" }}>
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12 flex flex-col md:flex-row md:items-center gap-8">
          <div className="flex-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="BetterSport" className="h-7 w-auto object-contain" style={{ filter: "brightness(0) invert(1)" }} />
            <p className="text-sm mt-3" style={{ color: "#6b7789" }}>{t(COPY.footer.tagline)}</p>
          </div>

          <div className="flex items-center gap-2">
            {[
              { Icon: Instagram, href: SOCIAL.instagram, label: "Instagram" },
              { Icon: Youtube, href: SOCIAL.youtube, label: "YouTube" },
              { Icon: Linkedin, href: SOCIAL.linkedin, label: "LinkedIn" },
            ].map(({ Icon, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                style={{ color: "#a8b3c4", backgroundColor: "rgba(244,247,251,0.05)", border: "1px solid rgba(244,247,251,0.1)" }}>
                <Icon size={17} />
              </a>
            ))}
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-5 lg:px-8 pb-8">
          <p className="text-xs" style={{ color: "#566173" }}>
            © {new Date().getFullYear()} BetterSport. {t(COPY.footer.rights)}
          </p>
        </div>
      </footer>
    </div>
  );
}
