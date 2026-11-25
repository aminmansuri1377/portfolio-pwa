import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ActionButton, ChipGroup } from '../controls';
import { useShowcaseMotion } from '../Runtime';

const W = 640;
const H = 220;
const PAD = { l: 38, r: 12, t: 14, b: 26 };

function smooth(pts) {
  if (pts.length < 2) return '';
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    d += ` Q${x0},${y0} ${(x0 + x1) / 2},${(y0 + y1) / 2}`;
  }
  const last = pts[pts.length - 1];
  return `${d} L${last[0]},${last[1]}`;
}

function Counter({ value, prefix = '', suffix = '', decimals = 0 }) {
  const { animate: moving } = useShowcaseMotion();
  const mv = useMotionValue(value);
  const text = useTransform(mv, (v) => `${prefix}${v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`);
  useEffect(() => {
    if (!moving) { mv.jump(value); return; }
    const c = animate(mv, value, { duration: 0.8, ease: 'easeOut' });
    return () => c.stop();
  }, [value, mv, moving]);
  return <motion.span>{text}</motion.span>;
}

function seedSeries(n) {
  const out = [];
  let v = 60;
  for (let i = 0; i < n; i++) {
    v = Math.max(15, Math.min(95, v + (Math.random() - 0.48) * 14));
    out.push(v);
  }
  return out;
}

const SEGMENTS = [
  { key: 'segDirect', value: 38, color: '#bfff3c' },
  { key: 'segSearch', value: 27, color: '#8b7cff' },
  { key: 'segSocial', value: 21, color: '#ff5d8f' },
  { key: 'segEmail', value: 14, color: '#4cc9f0' },
];

function Donut({ t }) {
  const [hover, setHover] = useState(null);
  const R = 62;
  const C = 2 * Math.PI * R;
  let offset = 0;
  const total = SEGMENTS.reduce((s, x) => s + x.value, 0);
  const active = hover != null ? SEGMENTS[hover] : null;
  return (
    <div className="flex flex-wrap items-center gap-4">
      <svg viewBox="0 0 160 160" className="h-36 w-36 shrink-0 -rotate-90" role="img" aria-label={t('donutAria')}>
        {SEGMENTS.map((s, i) => {
          const len = (s.value / total) * C;
          const el = (
            <motion.circle
              key={s.key}
              cx="80"
              cy="80"
              r={R}
              fill="none"
              stroke={s.color}
              strokeWidth={hover === i ? 22 : 16}
              strokeDasharray={`${len - 3} ${C - len + 3}`}
              strokeDashoffset={-offset}
              initial={{ opacity: 0 }}
              animate={{ opacity: hover == null || hover === i ? 1 : 0.3 }}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: 'pointer', transition: 'stroke-width 0.2s' }}
            />
          );
          offset += len;
          return el;
        })}
        <g className="rotate-90" style={{ transformOrigin: '80px 80px' }}>
          <text x="80" y="78" textAnchor="middle" fill="#fff" fontSize="22" fontWeight="700">
            {active ? `${active.value}%` : '100%'}
          </text>
          <text x="80" y="96" textAnchor="middle" fill="#9c9ca8" fontSize="9">
            {active ? t(active.key) : t('segTotal')}
          </text>
        </g>
      </svg>
      <ul className="space-y-2 text-xs">
        {SEGMENTS.map((s, i) => (
          <li
            key={s.key}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            className="text-muted"
          >
            <button type="button" aria-pressed={hover === i} onFocus={() => setHover(i)} onClick={() => setHover(i)} className="flex min-h-[36px] items-center gap-2 text-left">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
            {t(s.key)} · {s.value}%
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function DashboardDemo() {
  const t = useTranslations('Showcase.ui');
  const { animate: moving, reducedMotion } = useShowcaseMotion();
  const areaId = useId();
  const [range, setRange] = useState('60');
  const [live, setLive] = useState(true);
  const [series, setSeries] = useState(() => seedSeries(120));
  const [hoverIdx, setHoverIdx] = useState(null);
  const svg = useRef(null);

  useEffect(() => {
    if (!live || !moving) return undefined;
    const id = setInterval(() => {
      setSeries((s) => {
        const last = s[s.length - 1];
        const next = Math.max(15, Math.min(95, last + (Math.random() - 0.48) * 14));
        return [...s.slice(1), next];
      });
    }, 1000);
    return () => clearInterval(id);
  }, [live, moving]);

  const view = useMemo(() => series.slice(-Number(range)), [series, range]);
  useEffect(() => setHoverIdx(null), [range]);
  const pts = useMemo(
    () =>
      view.map((v, i) => [
        PAD.l + (i / (view.length - 1)) * (W - PAD.l - PAD.r),
        PAD.t + (1 - v / 100) * (H - PAD.t - PAD.b),
      ]),
    [view]
  );
  const line = smooth(pts);
  const area = `${line} L${pts[pts.length - 1][0]},${H - PAD.b} L${pts[0][0]},${H - PAD.b} Z`;
  const current = view[view.length - 1];
  const avg = view.reduce((a, b) => a + b, 0) / view.length;
  const peak = Math.max(...view);

  const onMove = (e) => {
    const r = svg.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * W;
    const i = Math.round(((x - PAD.l) / (W - PAD.l - PAD.r)) * (view.length - 1));
    setHoverIdx(Math.max(0, Math.min(view.length - 1, i)));
  };

  const hp = hoverIdx != null ? pts[hoverIdx] : null;
  const bars = useMemo(() => Array.from({ length: 12 }, (_, i) => 30 + Math.abs(Math.sin(i * 1.7 + 1)) * 60), []);

  return (
    <div className="absolute inset-0 overflow-y-auto p-4 md:p-6" data-lenis-prevent>
      <div className="mx-auto max-w-5xl space-y-4">
        <p className="text-sm text-muted">{t('sampleOnly')}</p>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            [t('kpiNow'), <Counter key="a" value={current} decimals={1} suffix="%" />],
            [t('kpiAvg'), <Counter key="b" value={avg} decimals={1} suffix="%" />],
            [t('kpiPeak'), <Counter key="c" value={peak} decimals={1} suffix="%" />],
            [t('kpiUsers'), <Counter key="d" value={Math.round(current * 38.4)} />],
          ].map(([label, node]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-ink-900/80 p-4">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">{label}</p>
              <p className="mt-2 font-display text-2xl font-bold">{node}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-white/10 bg-ink-900/80 p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <p className="font-display text-sm font-semibold">
              {t('chartLoad')} {live && moving && <span className="ml-2 inline-block h-2 w-2 animate-pulse rounded-full bg-lime align-middle" />}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <ChipGroup
                label={t('timeRange')}
                value={range}
                onChange={setRange}
                options={[
                  { value: '30', label: '30s' },
                  { value: '60', label: '60s' },
                  { value: '120', label: '120s' },
                ]}
              />
              <ActionButton disabled={reducedMotion} onClick={() => setLive((v) => !v)}>{live && moving ? t('pause') : t('resume')}</ActionButton>
            </div>
          </div>
          <svg
            ref={svg}
            viewBox={`0 0 ${W} ${H}`}
            className="w-full touch-none"
            onPointerMove={onMove}
            onPointerLeave={() => setHoverIdx(null)}
            role="img"
            aria-label={t('chartLoad')}
          >
            <defs>
              <linearGradient id={areaId} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#bfff3c" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#bfff3c" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0, 25, 50, 75, 100].map((g) => {
              const y = PAD.t + (1 - g / 100) * (H - PAD.t - PAD.b);
              return (
                <g key={g}>
                  <line x1={PAD.l} x2={W - PAD.r} y1={y} y2={y} stroke="rgba(255,255,255,0.07)" />
                  <text x={PAD.l - 8} y={y + 3} textAnchor="end" fontSize="9" fill="#9c9ca8">{g}</text>
                </g>
              );
            })}
            <path d={area} fill={`url(#${areaId})`} />
            <path d={line} fill="none" stroke="#bfff3c" strokeWidth="2" strokeLinecap="round" />
            {hp && (
              <g>
                <line x1={hp[0]} x2={hp[0]} y1={PAD.t} y2={H - PAD.b} stroke="rgba(255,255,255,0.3)" strokeDasharray="3 3" />
                <circle cx={hp[0]} cy={hp[1]} r="5" fill="#060609" stroke="#bfff3c" strokeWidth="2" />
                <g transform={`translate(${Math.min(hp[0] + 8, W - 90)}, ${Math.max(hp[1] - 30, 4)})`}>
                  <rect width="82" height="22" rx="6" fill="#14141c" stroke="rgba(255,255,255,0.15)" />
                  <text x="41" y="15" textAnchor="middle" fontSize="11" fill="#fff" fontWeight="600">
                    {view[hoverIdx].toFixed(1)}%
                  </text>
                </g>
              </g>
            )}
          </svg>
          <label className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted">{t('inspectChart')}<input type="range" min={0} max={view.length - 1} value={Math.min(hoverIdx ?? view.length - 1, view.length - 1)} onChange={event => setHoverIdx(Number(event.target.value))} className="h-8 min-w-[140px] flex-1 accent-lime" /><output className="font-mono text-white">{view[Math.min(hoverIdx ?? view.length - 1, view.length - 1)].toFixed(1)}%</output></label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-ink-900/80 p-4">
            <p className="mb-3 font-display text-sm font-semibold">{t('chartSources')}</p>
            <Donut t={t} />
          </div>
          <div className="rounded-2xl border border-white/10 bg-ink-900/80 p-4">
            <p className="mb-3 font-display text-sm font-semibold">{t('chartHours')}</p>
            <div className="flex h-32 items-end gap-1.5">
              {bars.map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${b}%` }}
                  transition={{ delay: i * 0.04, type: 'spring', stiffness: 110, damping: 14 }}
                  whileHover={{ scaleY: 1.06, backgroundColor: '#bfff3c' }}
                  className="flex-1 origin-bottom rounded-t bg-violet/70"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
