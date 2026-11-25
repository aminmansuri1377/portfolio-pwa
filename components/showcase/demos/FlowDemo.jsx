import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ActionButton, ChipGroup, Panel } from '../controls';
import { useShowcaseMotion } from '../Runtime';

const PALETTES = {
  neon: [84, 255],
  ember: [8, 48],
  ocean: [175, 230],
};

function makeNoise() {
  const perm = new Uint8Array(512);
  const base = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [base[i], base[j]] = [base[j], base[i]];
  }
  for (let i = 0; i < 512; i++) perm[i] = base[i & 255];
  const g = (h) => (h & 1 ? 1 : -1);
  const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
  // 2D gradient-ish noise, returns roughly -1..1
  return (x, y) => {
    const xi = Math.floor(x) & 255;
    const yi = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const u = fade(xf);
    const v = fade(yf);
    const val = (a, b, dx, dy) => g(perm[perm[a] + b]) * dx + g(perm[perm[a] + b] >> 1) * dy;
    const n00 = val(xi, yi, xf, yf);
    const n10 = val(xi + 1, yi, xf - 1, yf);
    const n01 = val(xi, yi + 1, xf, yf - 1);
    const n11 = val(xi + 1, yi + 1, xf - 1, yf - 1);
    const a = n00 + u * (n10 - n00);
    const b = n01 + u * (n11 - n01);
    return a + v * (b - a);
  };
}

export default function FlowDemo() {
  const t = useTranslations('Showcase.ui');
  const { animate } = useShowcaseMotion();
  const activeRef = useRef(animate);
  activeRef.current = animate;
  const syncRef = useRef(() => {});
  const repaintRef = useRef(() => {});
  const [unavailable, setUnavailable] = useState(false);
  const canvasRef = useRef(null);
  const [palette, setPalette] = useState('neon');
  const paletteRef = useRef('neon');
  const clearRef = useRef(() => {});

  useEffect(() => {
    paletteRef.current = palette;
    if (!activeRef.current) repaintRef.current();
  }, [palette]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) { setUnavailable(true); return; }
    const noise = makeNoise();
    let repaint = () => {};
    const COUNT = 1800;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let time = 0;
    const pointer = { x: -9999, y: -9999, down: false };
    const parts = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#050508';
      ctx.fillRect(0, 0, w, h);
      if (!activeRef.current) repaint();
    };

    const spawn = (p) => {
      p.x = Math.random() * w;
      p.y = Math.random() * h;
      p.life = 80 + Math.random() * 220;
      p.hue = Math.random();
      return p;
    };

    resize();
    for (let i = 0; i < COUNT; i++) parts.push(spawn({}));
    clearRef.current = () => {
      ctx.fillStyle = '#050508';
      ctx.fillRect(0, 0, w, h);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const step = () => {
      time += 0.004;
      ctx.fillStyle = 'rgba(5,5,8,0.07)';
      ctx.fillRect(0, 0, w, h);
      const [h1, h2] = PALETTES[paletteRef.current];
      const scale = 0.0021;
      ctx.lineWidth = 1.1;

      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        const angle = noise(p.x * scale + time, p.y * scale - time) * Math.PI * 3.2;
        let vx = Math.cos(angle) * 1.5;
        let vy = Math.sin(angle) * 1.5;

        // the pointer swirls the field; holding the button pulls particles in
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 22500) {
          const f = (1 - d2 / 22500) * 3.2;
          const d = Math.sqrt(d2) || 1;
          if (pointer.down) {
            vx -= (dx / d) * f * 1.4;
            vy -= (dy / d) * f * 1.4;
          } else {
            vx += (-dy / d) * f;
            vy += (dx / d) * f;
          }
        }

        const nx = p.x + vx;
        const ny = p.y + vy;
        const hue = h1 + (h2 - h1) * ((p.hue + angle * 0.08 + 1) % 1);
        ctx.strokeStyle = `hsla(${hue}, 95%, 62%, 0.55)`;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(nx, ny);
        ctx.stroke();
        p.x = nx;
        p.y = ny;
        p.life -= 1;
        if (p.life <= 0 || p.x < -5 || p.x > w + 5 || p.y < -5 || p.y > h + 5) spawn(p);
      }
    };
    let painted = false;
    let previous = 0;
    let carry = 0;
    repaint = () => { for (let k = 0; k < 80; k++) step(); painted = true; };
    repaintRef.current = repaint;
    const tick = now => {
      if (!activeRef.current) return;
      carry += previous ? Math.min((now - previous) / 1000, .05) : 1 / 60;
      previous = now;
      while (carry >= 1 / 60) { step(); carry -= 1 / 60; painted = true; }
      raf = requestAnimationFrame(tick);
    };
    syncRef.current = () => {
      cancelAnimationFrame(raf);
      previous = 0;
      carry = 0;
      if (activeRef.current) raf = requestAnimationFrame(tick);
      else if (!painted) repaint();
    };
    syncRef.current();

    const rect = () => canvas.getBoundingClientRect();
    const move = (e) => {
      const r = rect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
    };
    const down = (e) => {
      if (!e.isPrimary) return;
      canvas.setPointerCapture?.(e.pointerId);
      move(e);
      pointer.down = true;
    };
    const up = e => {
      if (e?.pointerId != null && canvas.hasPointerCapture?.(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
      pointer.down = false;
    };
    const leave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
      pointer.down = false;
    };
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', up);
    canvas.addEventListener('pointerleave', leave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      canvas.removeEventListener('pointercancel', up);
      syncRef.current = () => {};
      repaintRef.current = () => {};
      canvas.removeEventListener('pointerleave', leave);
    };
  }, []);

  useEffect(() => syncRef.current(), [animate]);

  return (
    <div className="absolute inset-0">
      {unavailable && <p className="absolute inset-0 grid place-items-center p-6 text-center text-muted">{t('canvasUnavailable')}</p>}
      <canvas ref={canvasRef} className="h-full w-full touch-none" aria-label={t('flowAria')} />
      <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center px-3">
        <Panel className="pointer-events-auto flex flex-wrap items-end gap-x-6 gap-y-3">
          <ChipGroup
            label={t('palette')}
            value={palette}
            onChange={setPalette}
            options={Object.keys(PALETTES).map((v) => ({ value: v, label: t(`palettes.${v}`) }))}
          />
          <ActionButton onClick={() => clearRef.current()}>{t('clear')}</ActionButton>
        </Panel>
      </div>
    </div>
  );
}
