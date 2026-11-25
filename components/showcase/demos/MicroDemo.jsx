import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useShowcaseMotion } from '../Runtime';

function Cell({ title, children, className = '' }) {
  return (
    <div className={`relative flex min-h-[230px] flex-col rounded-2xl border border-white/10 bg-ink-900/70 p-4 ${className}`}>
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">{title}</p>
      <div className="flex flex-1 items-center justify-center py-4">{children}</div>
    </div>
  );
}

function Magnetic() {
  const { animate } = useShowcaseMotion();
  const t = useTranslations('Showcase.ui');
  const ref = useRef(null);
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 14, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 14, mass: 0.4 });
  useEffect(() => { if (!animate) { x.jump(0); y.jump(0); } }, [animate, x, y]);

  const move = (e) => {
    if (!animate) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.45);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.45);
  };
  const leave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="grid h-40 w-full place-items-center" onPointerMove={move} onPointerLeave={leave}>
      <motion.button
        ref={ref}
        style={{ x, y }}
        type="button"
        whileTap={animate ? { scale: 0.92 } : undefined}
        className="rounded-full bg-lime px-8 py-4 font-display text-sm font-bold text-ink-950 shadow-glow"
      >
        <motion.span style={{ x: useTransform(x, (v) => v * 0.35), y: useTransform(y, (v) => v * 0.35) }} className="block">
          {t('magnetic')}
        </motion.span>
      </motion.button>
    </div>
  );
}

function Tilt() {
  const { animate } = useShowcaseMotion();
  const t = useTranslations('Showcase.ui');
  const ref = useRef(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 200, damping: 20 });
  const sy = useSpring(py, { stiffness: 200, damping: 20 });
  useEffect(() => { if (!animate) { px.set(.5); py.set(.5); sx.jump(.5); sy.jump(.5); } }, [animate, px, py, sx, sy]);
  const rotateY = useTransform(sx, [0, 1], [-16, 16]);
  const rotateX = useTransform(sy, [0, 1], [14, -14]);
  const glare = useTransform([sx, sy], ([a, b]) => `radial-gradient(circle at ${a * 100}% ${b * 100}%, rgba(255,255,255,0.28), transparent 55%)`);

  const move = (e) => {
    if (!animate) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const leave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <div className="[perspective:800px]" onPointerMove={move} onPointerLeave={leave}>
      <motion.div
        ref={ref}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative h-40 w-64 overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-violet/60 via-ink-800 to-lime/40 p-5"
      >
        <motion.div style={{ background: glare }} className="pointer-events-none absolute inset-0" />
        <div style={{ transform: 'translateZ(40px)' }}>
          <p className="font-mono text-xs uppercase tracking-widest text-white/70">{t('tiltKicker')}</p>
          <p className="mt-2 font-display text-2xl font-bold leading-tight">{t('tilt')}</p>
        </div>
      </motion.div>
    </div>
  );
}

function Spotlight() {
  const t = useTranslations('Showcase.ui');
  const wrap = useRef(null);
  const onMove = (e) => {
    const cards = wrap.current.querySelectorAll('[data-card]');
    cards.forEach((c) => {
      const r = c.getBoundingClientRect();
      c.style.setProperty('--mx', `${e.clientX - r.left}px`);
      c.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  };
  return (
    <div ref={wrap} onPointerMove={onMove} className="grid w-full grid-cols-3 gap-2">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          data-card
          className="relative h-28 overflow-hidden rounded-xl border border-white/10 bg-ink-800 p-3"
          style={{
            backgroundImage:
              'radial-gradient(160px circle at var(--mx, -200px) var(--my, -200px), rgba(191,255,60,0.22), transparent 70%)',
          }}
        >
          <p className="font-mono text-xs text-lime">0{i}</p>
          <p className="mt-6 font-display text-sm font-semibold">{t(`spot${i}`)}</p>
        </div>
      ))}
    </div>
  );
}

const GLYPHS = '!<>-_\\/[]{}—=+*^?#________';

function Scramble() {
  const { animate } = useShowcaseMotion();
  const t = useTranslations('Showcase.ui');
  const target = t('scrambleText');
  const [text, setText] = useState(target);
  const raf = useRef(0);

  useEffect(() => {
    setText(target);
    return () => cancelAnimationFrame(raf.current);
  }, [target, animate]);

  const run = () => {
    cancelAnimationFrame(raf.current);
    if (!animate) { setText(target); return; }
    const start = performance.now();
    const duration = 900;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const out = target
        .split('')
        .map((ch, i) => {
          if (ch === ' ') return ' ';
          if (i / target.length < p) return ch;
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
        .join('');
      setText(out);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };

  return (
    <button
      type="button"
      onClick={run}
      onPointerEnter={run}
      onFocus={run}
      aria-label={target}
      className="text-center font-display text-3xl font-bold tracking-tight text-gradient"
    >
      <span aria-hidden>{text}</span>
    </button>
  );
}

function Toggle() {
  const t = useTranslations('Showcase.ui');
  const [on, setOn] = useState(false);
  return (
    <button
      type="button"
      role="switch"
      aria-label={t('cellToggle')}
      aria-checked={on}
      onClick={() => setOn((v) => !v)}
      className={`flex h-16 w-32 items-center rounded-full border p-2 transition-colors ${
        on ? 'border-lime/60 bg-lime/20' : 'border-white/15 bg-white/5'
      }`}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
        className={`grid h-12 w-12 place-items-center rounded-full font-mono text-xs font-bold ${
          on ? 'ml-auto bg-lime text-ink-950' : 'bg-white/80 text-ink-950'
        }`}
      >
        {on ? t('on') : t('off')}
      </motion.span>
    </button>
  );
}

function Ripple() {
  const { animate } = useShowcaseMotion();
  const t = useTranslations('Showcase.ui');
  const [ripples, setRipples] = useState([]);
  const timers = useRef(new Set());
  useEffect(() => { const pending = timers.current; return () => pending.forEach(clearTimeout); }, []);
  useEffect(() => { if (!animate) setRipples([]); }, [animate]);
  const click = (e) => {
    if (!animate) return;
    const r = e.currentTarget.getBoundingClientRect();
    const id = Math.random();
    setRipples((l) => [...l.slice(-9), { id, x: e.detail ? e.clientX - r.left : r.width / 2, y: e.detail ? e.clientY - r.top : r.height / 2 }]);
    const timer = setTimeout(() => { setRipples((l) => l.filter((q) => q.id !== id)); timers.current.delete(timer); }, 700);
    timers.current.add(timer);
  };
  return (
    <button
      type="button"
      onClick={click}
      className="relative overflow-hidden rounded-xl border border-violet/50 bg-violet/20 px-10 py-5 font-display text-sm font-semibold"
    >
      {t('ripple')}
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          initial={{ scale: 0, opacity: 0.55 }}
          animate={{ scale: 14, opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="pointer-events-none absolute h-8 w-8 rounded-full bg-white"
          style={{ left: r.x - 16, top: r.y - 16 }}
        />
      ))}
    </button>
  );
}

export default function MicroDemo() {
  const t = useTranslations('Showcase.ui');
  return (
    <div className="absolute inset-0 overflow-y-auto p-4 md:p-8" data-lenis-prevent>
      <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
        <Cell title={t('cellMagnetic')}>
          <Magnetic />
        </Cell>
        <Cell title={t('cellTilt')}>
          <Tilt />
        </Cell>
        <Cell title={t('cellToggle')}>
          <Toggle />
        </Cell>
        <Cell title={t('cellSpotlight')} className="md:col-span-2">
          <Spotlight />
        </Cell>
        <Cell title={t('cellRipple')}>
          <Ripple />
        </Cell>
        <Cell title={t('cellScramble')} className="md:col-span-3">
          <Scramble />
        </Cell>
      </div>
    </div>
  );
}
