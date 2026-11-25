import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiCopy } from 'react-icons/fi';
import { useTranslations } from 'next-intl';
import { ActionButton, ChipGroup, RangeField } from '../controls';

const DENSITY = { compact: 0.75, cozy: 1, roomy: 1.3 };

function contrastColor(hue, saturation) {
  const lightness = .62;
  const a = (saturation / 100) * Math.min(lightness, 1 - lightness);
  const channel = n => { const k = (n + hue / 30) % 12; const v = lightness - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); return v <= .04045 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); };
  const luminance = .2126 * channel(0) + .7152 * channel(8) + .0722 * channel(4);
  return (luminance + .05) / .05 > 1.05 / (luminance + .05) ? '#060609' : '#ffffff';
}

export default function ThemeDemo() {
  const t = useTranslations('Showcase.ui');
  const [hue, setHue] = useState(84);
  const [sat, setSat] = useState(100);
  const [radius, setRadius] = useState(14);
  const [density, setDensity] = useState('cozy');
  const [mode, setMode] = useState('dark');
  const [copied, setCopied] = useState(false);
  const [manualCopy, setManualCopy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [email, setEmail] = useState('hello@northwind.dev');
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);

  const tokens = useMemo(() => {
    const dark = mode === 'dark';
    return {
      '--accent': `hsl(${hue} ${sat}% 62%)`,
      '--accent-contrast': contrastColor(hue, sat),
      '--bg': dark ? '#0c0c12' : '#f6f6f2',
      '--surface': dark ? '#14141c' : '#ffffff',
      '--text': dark ? '#f4f4f0' : '#15151c',
      '--muted': dark ? '#9c9ca8' : '#6b6b78',
      '--line': dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      '--radius': `${radius}px`,
      '--space': `${Math.round(16 * DENSITY[density])}px`,
    };
  }, [hue, sat, radius, density, mode]);

  const css = `:root {\n${Object.entries(tokens)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n')}\n}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(css);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1600);
    } catch (e) {
      setManualCopy(true);
    }
  };

  const bars = [42, 68, 51, 84, 63, 92, 74];

  return (
    <div className="absolute inset-0 overflow-y-auto p-4 md:p-6" data-lenis-prevent>
      <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[300px_1fr]">
        <div className="min-w-0 space-y-5 rounded-2xl border border-white/10 bg-ink-900/80 p-4">
          <RangeField label={t('hue')} min={0} max={360} value={hue} onChange={setHue} format={(v) => `${v}°`} />
          <RangeField label={t('saturation')} min={20} max={100} value={sat} onChange={setSat} format={(v) => `${v}%`} />
          <RangeField label={t('radius')} min={0} max={30} value={radius} onChange={setRadius} format={(v) => `${v}px`} />
          <ChipGroup
            label={t('density')}
            value={density}
            onChange={setDensity}
            options={Object.keys(DENSITY).map((v) => ({ value: v, label: t(`densities.${v}`) }))}
          />
          <ChipGroup
            label={t('mode')}
            value={mode}
            onChange={setMode}
            options={['dark', 'light'].map((v) => ({ value: v, label: t(`modes.${v}`) }))}
          />
          <pre className="max-h-52 overflow-auto rounded-xl bg-black/40 p-3 font-mono text-xs leading-relaxed text-lime/90">{css}</pre>
          <ActionButton onClick={copy} className="inline-flex items-center gap-2">
            {copied ? <FiCheck /> : <FiCopy />} {copied ? t('copied') : t('copyCss')}
          </ActionButton>
          {manualCopy && <label className="block text-sm text-muted">{t('copyManually')}<textarea aria-label={t('copyCss')} value={css} readOnly onFocus={event => event.target.select()} rows={8} className="mt-2 w-full rounded-lg border border-white/15 bg-black/30 p-3 font-mono text-sm" /></label>}
        </div>

        {/* preview — every value comes from the CSS variables above */}
        <div
          style={{ ...tokens, background: 'var(--bg)', color: 'var(--text)', borderRadius: 'calc(var(--radius) + 6px)', padding: 'var(--space)' }}
          className="min-w-0 border transition-colors duration-300"
        >
          <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space)' }}>
            <p className="font-display text-lg font-bold">Northwind<span style={{ color: 'var(--accent)' }}>.</span></p>
            <div className="flex gap-2">
              <span className="px-3 py-1 text-xs font-semibold" style={{ background: 'var(--accent)', color: 'var(--accent-contrast)', borderRadius: 'var(--radius)' }}>
                {t('badge')}
              </span>
            </div>
          </div>

          <div className="grid gap-[var(--space)] md:grid-cols-3" style={{ '--space': tokens['--space'] }}>
            {[
              ['2.4k', t('statUsers')],
              ['98%', t('statUptime')],
              ['$18k', t('statRevenue')],
            ].map(([v, l]) => (
              <div key={l} style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--radius)', padding: 'var(--space)' }}>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>{l}</p>
                <p className="mt-1 font-display text-2xl font-bold">{v}</p>
              </div>
            ))}
          </div>

          <div className="mt-[var(--space)] grid gap-[var(--space)] md:grid-cols-[1.4fr_1fr]" style={{ '--space': tokens['--space'] }}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--radius)', padding: 'var(--space)' }}>
              <p className="text-sm font-semibold">{t('chartTitle')}</p>
              <div className="mt-4 flex h-32 items-end gap-2">
                {bars.map((b, i) => (
                  <motion.div
                    key={i}
                    layout
                    animate={{ height: `${b}%` }}
                    transition={{ type: 'spring', stiffness: 120, damping: 14, delay: i * 0.03 }}
                    className="flex-1"
                    style={{ background: i === 5 ? 'var(--accent)' : 'var(--line)', borderRadius: 'calc(var(--radius) / 2.5)' }}
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--radius)', padding: 'var(--space)' }}>
              <input
                value={email}
                onChange={event => { setEmail(event.target.value); setSaved(false); }}
                aria-label="email"
                className="w-full bg-transparent px-3 py-2 text-base outline-none"
                style={{ border: '1px solid var(--line)', borderRadius: 'var(--radius)' }}
              />
              <div className="h-2 overflow-hidden" style={{ background: 'var(--line)', borderRadius: 999 }}>
                <div className="h-full w-2/3" style={{ background: 'var(--accent)' }} />
              </div>
              <button type="button" onClick={() => setSaved(true)} className="min-h-[44px] px-4 py-2 text-sm font-semibold" style={{ background: 'var(--accent)', color: 'var(--accent-contrast)', borderRadius: 'var(--radius)' }}>
                {t('primaryAction')}
              </button>
              <button type="button" onClick={() => { setHue(84); setSat(100); setRadius(14); setDensity('cozy'); setMode('dark'); setEmail('hello@northwind.dev'); setSaved(false); }} className="min-h-[44px] px-4 py-2 text-sm font-semibold" style={{ border: '1px solid var(--line)', borderRadius: 'var(--radius)' }}>
                {t('resetTheme')}
              </button>
              <p role="status" className="text-sm" style={{ color: 'var(--muted)' }}>{saved ? t('themeSaved') : t('sampleOnly')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
