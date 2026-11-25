import { useId, useRef } from 'react';
import { useInView } from 'framer-motion';
import s from './showcase.module.css';

// Cheap, GPU-friendly "poster" for every demo. Real WebGL only starts when a demo is opened,
// so the gallery never holds more than one rendering context at a time.
const dots = (n, r0, r1, turns) =>
  Array.from({ length: n }, (_, i) => {
    const k = i / n;
    const a = k * Math.PI * 2 * turns + (i % 3) * 2.09;
    const r = r0 + (r1 - r0) * k;
    return { x: 100 + Math.cos(a) * r, y: 62 + Math.sin(a) * r * 0.55, o: 0.25 + (1 - k) * 0.75, r: 0.8 + (1 - k) * 1.6 };
  });

const ART = {
  galaxy: ({ accent }) => (
    <svg viewBox="0 0 200 124" className={`${s.spin} h-full w-full`} style={{ transformOrigin: '50% 50%' }}>
      {dots(150, 4, 78, 2.4).map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={i % 2 ? accent : '#8b7cff'} opacity={d.o} />
      ))}
    </svg>
  ),
  aurora: () => (
    <div className="absolute inset-0 overflow-hidden">
      <span className={`${s.drift} absolute -left-6 top-2 h-32 w-32 rounded-full bg-violet/60 blur-3xl`} />
      <span className={`${s.drift} absolute right-0 top-10 h-28 w-28 rounded-full bg-lime/50 blur-3xl`} style={{ animationDelay: '-3s' }} />
      <span className={`${s.drift} absolute bottom-0 left-1/3 h-24 w-40 rounded-full bg-violet/40 blur-3xl`} style={{ animationDelay: '-5s' }} />
    </div>
  ),
  cubes: ({ accent }) => (
    <div className="grid h-full w-full grid-cols-10 items-end gap-1.5 p-5">
      {Array.from({ length: 40 }, (_, i) => (
        <span
          key={i}
          className={`${s.wave} block h-14 rounded-[3px]`}
          style={{ background: i % 4 === 0 ? accent : '#8b7cff', animationDelay: `${((i % 10) + Math.floor(i / 10)) * -0.22}s` }}
        />
      ))}
    </div>
  ),
  configurator: ({ accent }) => (
    <div className="grid h-full place-items-center">
      <div className="relative grid h-28 w-28 place-items-center">
        <span className={`${s.spinFast} absolute inset-0 rounded-full`} style={{ background: `conic-gradient(${accent}, #8b7cff, #14141c, ${accent})`, WebkitMask: 'radial-gradient(circle, transparent 52%, #000 54%)', mask: 'radial-gradient(circle, transparent 52%, #000 54%)' }} />
        <span className={`${s.pulse} h-10 w-10 rounded-full`} style={{ background: accent, boxShadow: `0 0 40px ${accent}` }} />
      </div>
    </div>
  ),
  morph: ({ accent }) => (
    <svg viewBox="0 0 200 124" className="h-full w-full">
      {[26, 42, 58].map((r, k) => (
        <circle key={r} cx="100" cy="62" r={r} fill="none" stroke={k % 2 ? '#8b7cff' : accent} strokeWidth="2.4" strokeDasharray="1 7" strokeLinecap="round" className={k % 2 ? s.spinRev : s.spin} style={{ transformOrigin: '100px 62px' }} />
      ))}
    </svg>
  ),
  planet: ({ accent }) => (
    <div className="grid h-full place-items-center">
      <div className="relative h-24 w-24">
        <span className="absolute inset-0 rounded-full" style={{ background: `radial-gradient(circle at 30% 30%, ${accent}, #1a4a7a 55%, #04101f 100%)`, boxShadow: `0 0 30px ${accent}55` }} />
        <span className={`${s.spinRev} absolute -inset-5`}>
          <span className="absolute left-1/2 top-0 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-white/70" />
        </span>
      </div>
    </div>
  ),
  micro: ({ accent }) => (
    <div className="grid h-full place-items-center">
      <div className="flex items-center gap-4">
        <span className={`${s.bob} rounded-full px-5 py-2.5 font-display text-xs font-bold text-ink-950`} style={{ background: accent }}>Hover me</span>
        <span className={`${s.bob} h-14 w-20 rounded-xl border border-white/20 bg-gradient-to-br from-violet/60 to-lime/30`} style={{ animationDelay: '-2s', transform: 'rotate(-6deg)' }} />
      </div>
    </div>
  ),
  palette: ({ accent }) => (
    <div className="grid h-full place-items-center px-6">
      <div className="w-full max-w-[210px] rounded-xl border border-white/15 bg-ink-900 p-2 shadow-xl">
        <div className="mb-2 flex items-center gap-2 border-b border-white/10 pb-2 font-mono text-[10px] text-muted">⌕ <span style={{ color: accent }}>go to…</span><span className="ml-auto rounded bg-white/10 px-1">⌘K</span></div>
        {[0, 1, 2].map((i) => (
          <div key={i} className={`mb-1 h-4 rounded ${i === 0 ? 'bg-white/15' : 'bg-white/5'}`} style={{ width: `${90 - i * 14}%` }} />
        ))}
      </div>
    </div>
  ),
  theme: ({ accent }) => (
    <div className="grid h-full place-items-center">
      <div className="space-y-3">
        <div className="flex gap-2">
          {['#bfff3c', '#8b7cff', '#ff5d8f', '#4cc9f0', '#f4f4f0'].map((c, i) => (
            <span key={c} className={`${s.pulse} h-7 w-7 rounded-full`} style={{ background: c, animationDelay: `${i * -0.5}s` }} />
          ))}
        </div>
        {[70, 45].map((w) => (
          <div key={w} className="h-1.5 w-44 rounded-full bg-white/10"><div className="h-full rounded-full" style={{ width: `${w}%`, background: accent }} /></div>
        ))}
      </div>
    </div>
  ),
  flow: ({ accent }) => (
    <svg viewBox="0 0 200 124" className="h-full w-full">
      {Array.from({ length: 9 }, (_, i) => (
        <path key={i} d={`M-10 ${14 + i * 12} C 40 ${-10 + i * 16}, 90 ${60 + i * 6}, 140 ${30 + i * 8} S 200 ${20 + i * 10}, 220 ${40 + i * 7}`} fill="none" stroke={i % 2 ? '#8b7cff' : accent} strokeWidth="1.3" opacity="0.8" className={s.dash} style={{ animationDelay: `${i * -0.5}s` }} />
      ))}
    </svg>
  ),
  physics: ({ accent }) => (
    <div className="flex h-full items-center justify-center gap-3">
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} className={`${s.bounce} grid place-items-center rounded-full font-mono text-[9px] font-bold text-ink-950`} style={{ width: 30 + (i % 3) * 8, height: 30 + (i % 3) * 8, background: i % 2 ? '#8b7cff' : accent, animationDelay: `${i * -0.45}s` }}>
          {['JS', 'TS', 'R3F', 'CSS', 'Git'][i]}
        </span>
      ))}
    </div>
  ),
  dashboard: ({ accent, uid }) => (
    <svg viewBox="0 0 200 124" className="h-full w-full">
      <defs>
        <linearGradient id={uid} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={accent} stopOpacity="0.45" />
          <stop offset="1" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M10 90 Q 35 40 60 64 T 110 50 T 160 70 T 190 30 V 110 H 10 Z" fill={`url(#${uid})`} />
      <path d="M10 90 Q 35 40 60 64 T 110 50 T 160 70 T 190 30" fill="none" stroke={accent} strokeWidth="2" className={s.dash} />
    </svg>
  ),
};

export default function Thumb({ id, accent }) {
  const Art = ART[id];
  const uid = useId();
  const ref = useRef(null);
  const inView = useInView(ref, { margin: '80px' });
  return (
    <div ref={ref} data-active={inView ? 'true' : 'false'} className={`${s.poster} relative h-full w-full overflow-hidden bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.06),transparent_60%)]`}>
      <div className="absolute inset-0 grid place-items-center">{Art ? <Art accent={accent} uid={uid} /> : null}</div>
    </div>
  );
}
