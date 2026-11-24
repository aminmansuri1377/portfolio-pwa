import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { FiArrowDown, FiArrowUpRight } from "react-icons/fi";

const FLOATING_CHIPS = [
  {
    label: "TypeScript",
    pos: "left-[52%] top-[8.5rem]",
    delay: "-3s",
    dot: "bg-violet",
  },
  { label: "React", pos: "right-4 top-[13rem]", delay: "0s", dot: "bg-lime" },
  {
    label: "Next.js",
    pos: "right-3 top-[19rem]",
    delay: "-2s",
    dot: "bg-violet",
  },
  {
    label: "Three.js",
    pos: "right-8 top-[25rem]",
    delay: "-4s",
    dot: "bg-lime",
  },
];

const HeroScene = dynamic(() => import("../three/HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-[radial-gradient(circle_at_60%_40%,rgba(191,255,60,0.12),transparent_60%)]" />
  ),
});

export default function Hero() {
  const t = useTranslations("Hero");
  const roles = t.raw("roles");
  const stats = t.raw("stats");
  const [roleIndex, setRoleIndex] = useState(0);
  const [reduced, setReduced] = useState(false);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.15]);

  useEffect(() => {
    const isReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setReduced(isReduced);
    if (isReduced) return undefined;
    const id = setInterval(
      () => setRoleIndex((i) => (i + 1) % roles.length),
      2600,
    );
    return () => clearInterval(id);
  }, [roles.length]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-center overflow-hidden pt-24"
    >
      <div className="absolute inset-y-0 right-0 h-full w-full opacity-50 max-md:h-[68%] max-md:opacity-80 lg:w-[58%] lg:opacity-100">
        <HeroScene />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/70 to-transparent max-md:bg-gradient-to-b max-md:from-ink-950/10 max-md:via-ink-950/55 max-md:to-ink-950 lg:via-ink-950/30" />

      {/* Mobile-only decoration: glowing orbs + floating tech chips */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden md:hidden"
      >
        <span className="absolute -left-20 top-[28%] h-56 w-56 animate-float-slow rounded-full bg-lime/20 blur-3xl" />
        <span
          className="absolute -right-16 bottom-[18%] h-64 w-64 animate-float-slow rounded-full bg-violet/25 blur-3xl"
          style={{ animationDelay: "-4s" }}
        />
        {FLOATING_CHIPS.map((c) => (
          <span
            key={c.label}
            className={`glass absolute ${c.pos} animate-float inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[11px] text-white/80`}
            style={{ animationDelay: c.delay }}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
            {c.label}
          </span>
        ))}
      </div>

      <motion.div style={{ y, opacity }} className="container-x relative z-10">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
            </span>
            <span className="font-mono text-xs text-muted">{t("badge")}</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="mt-8 font-mono text-sm text-muted"
          >
            {t("greeting")} <span className="text-white">{t("name")}</span>
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="mt-3 font-display text-5xl font-bold leading-[1.04] tracking-tight sm:text-6xl md:text-7xl"
          >
            <span
              className="max-md:inline-block max-md:animate-blur-in"
              style={{ animationDelay: "0.3s" }}
            >
              {t("titleA")}
            </span>
            <br />
            <span
              className="max-md:inline-block max-md:animate-blur-in"
              style={{ animationDelay: "0.5s" }}
            >
              <span className="text-gradient max-md:animate-gradient-pan max-md:[background-size:200%_auto]">
                {t("titleB")}
              </span>
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-5 flex h-8 items-center font-display text-lg text-lime sm:text-xl"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={roleIndex}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
              >
                {roles[roleIndex]}
              </motion.span>
            </AnimatePresence>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          >
            {t("subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/#projects"
              className="group inline-flex items-center gap-2 rounded-full bg-lime px-7 py-3.5 font-display text-sm font-semibold text-ink-950 transition-[box-shadow,transform] hover:shadow-glow max-md:animate-glow-pulse max-md:active:scale-95"
            >
              {t("ctaProjects")}
              <FiArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-3.5 font-display text-sm font-semibold text-white transition-[color,border-color,transform] hover:border-lime/50 hover:text-lime max-md:active:scale-95"
            >
              {t("ctaContact")}
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75, duration: 0.7 }}
            className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-6 mb-8 md:mb-5"
          >
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="max-md:animate-pop-in"
                style={{ animationDelay: `${0.9 + i * 0.15}s` }}
              >
                <p className="font-display text-3xl font-bold text-lime">
                  {s.value}
                </p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted">
                  {s.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
          {t("scroll")}
        </span>
        <motion.span
          animate={reduced ? {} : { y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        >
          <FiArrowDown className="text-lime" />
        </motion.span>
      </motion.div>

      <p className="absolute bottom-8 right-8 z-10 hidden max-w-[220px] text-right font-mono text-[10px] leading-relaxed text-muted/70 lg:block">
        {t("scene")}
      </p>
    </section>
  );
}
