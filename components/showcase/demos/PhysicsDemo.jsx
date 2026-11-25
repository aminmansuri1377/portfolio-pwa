import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ActionButton, ChipGroup, Panel } from '../controls';
import { useShowcaseMotion } from '../Runtime';

const WORDS = ['React', 'Next.js', 'TypeScript', 'Three.js', 'GLSL', 'Framer', 'Tailwind', 'CSS', 'HTML', 'JS', 'Git', 'R3F', 'PWA', 'Vite', 'SVG', 'Canvas'];
const GRAVITY = { down: [0, 1], none: [0, 0], up: [0, -1] };

export default function PhysicsDemo() {
  const t = useTranslations('Showcase.ui');
  const { animate } = useShowcaseMotion();
  const activeRef = useRef(animate);
  activeRef.current = animate;
  const [unavailable, setUnavailable] = useState(false);
  const canvasRef = useRef(null);
  const [gravity, setGravity] = useState('down');
  const gravityRef = useRef('down');
  const api = useRef({ add: () => {}, shake: () => {}, sync: () => {}, step: () => {} });

  useEffect(() => {
    gravityRef.current = gravity;
  }, [gravity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) { setUnavailable(true); return; }
    let repaint = () => {};
    let w = 0;
    let h = 0;
    let raf = 0;
    const balls = [];
    const pointer = { x: 0, y: 0, grab: null };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!activeRef.current) repaint();
    };
    resize();

    const addBall = (label, x, y) => {
      const r = 24 + Math.min(22, label.length * 3.2);
      const px = x ?? r + Math.random() * Math.max(10, w - r * 2);
      const py = y ?? (activeRef.current ? -r - Math.random() * 120 : r + Math.random() * Math.max(10, h - r * 2));
      balls.push({
        label,
        r,
        x: px,
        y: py,
        px: px - (Math.random() - 0.5) * 4,
        py,
        hue: Math.random() < 0.5 ? 84 : 255,
        mass: r * r,
      });
    };
    WORDS.forEach((word, i) => addBall(word, w * (0.15 + 0.7 * ((i * 0.37) % 1)), -40 - i * 55));

    api.current.add = () => {
      for (let i = 0; i < 4; i++) addBall(WORDS[Math.floor(Math.random() * WORDS.length)]);
      while (balls.length > 90) balls.shift();
      if (!activeRef.current) { step(); draw(); }
    };
    api.current.shake = () => {
      balls.forEach((b) => {
        b.px = b.x - (Math.random() - 0.5) * 60;
        b.py = b.y - (Math.random() - 0.5) * 60 - 20;
      });
      if (!activeRef.current) { step(); draw(); }
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const step = () => {
      const [gx, gy] = GRAVITY[gravityRef.current];
      const SUB = 3;
      for (let s = 0; s < SUB; s++) {
        for (const b of balls) {
          const vx = (b.x - b.px) * 0.995;
          const vy = (b.y - b.py) * 0.995;
          b.px = b.x;
          b.py = b.y;
          b.x += vx + gx * 0.22;
          b.y += vy + gy * 0.22;
        }
        if (pointer.grab) {
          const b = pointer.grab;
          b.x += (pointer.x - b.x) * 0.35;
          b.y += (pointer.y - b.y) * 0.35;
        }
        for (let i = 0; i < balls.length; i++) {
          const a = balls[i];
          for (let j = i + 1; j < balls.length; j++) {
            const b = balls[j];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const min = a.r + b.r;
            const d2 = dx * dx + dy * dy;
            if (d2 < min * min && d2 > 0.0001) {
              const d = Math.sqrt(d2);
              const overlap = (min - d) / d;
              const total = a.mass + b.mass;
              const wa = b.mass / total;
              const wb = a.mass / total;
              a.x -= dx * overlap * wa;
              a.y -= dy * overlap * wa;
              b.x += dx * overlap * wb;
              b.y += dy * overlap * wb;
            }
          }
        }
        for (const b of balls) {
          // walls (no ceiling, so new balls can drop in)
          if (b.x < b.r) { b.x = b.r; b.px = b.x + (b.x - b.px) * 0.4; }
          if (b.x > w - b.r) { b.x = w - b.r; b.px = b.x + (b.x - b.px) * 0.4; }
          if (b.y > h - b.r) { b.y = h - b.r; b.py = b.y + (b.y - b.py) * 0.35; }
          if (b.y < b.r && b.py > b.y && gy < 0) { b.y = b.r; b.py = b.y + (b.y - b.py) * 0.35; }
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const b of balls) {
        const g = ctx.createRadialGradient(b.x - b.r * 0.35, b.y - b.r * 0.4, b.r * 0.1, b.x, b.y, b.r);
        g.addColorStop(0, `hsla(${b.hue}, 90%, 70%, 0.95)`);
        g.addColorStop(1, `hsla(${b.hue}, 80%, 38%, 0.9)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#060609';
        ctx.font = `600 ${Math.max(12, b.r * 0.38)}px system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(b.label, b.x, b.y);
      }
    };

    repaint = draw;
    let painted = false;
    let previous = 0;
    let carry = 0;
    const tick = now => {
      if (!activeRef.current) return;
      carry += previous ? Math.min((now - previous) / 1000, .05) : 1 / 60;
      previous = now;
      while (carry >= 1 / 60) { step(); carry -= 1 / 60; }
      draw();
      painted = true;
      raf = requestAnimationFrame(tick);
    };
    api.current.sync = () => {
      cancelAnimationFrame(raf);
      previous = 0;
      carry = 0;
      if (activeRef.current) raf = requestAnimationFrame(tick);
      else if (!painted) { for (let i = 0; i < 80; i++) step(); draw(); painted = true; }
    };
    api.current.step = () => { step(); draw(); };
    api.current.sync();

    const local = (e) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
    };
    const down = (e) => {
      if (!e.isPrimary) return;
      local(e);
      let best = null;
      let bestD = Infinity;
      for (const b of balls) {
        const d = Math.hypot(b.x - pointer.x, b.y - pointer.y);
        if (d < b.r && d < bestD) {
          best = b;
          bestD = d;
        }
      }
      pointer.grab = best;
      if (best) canvas.setPointerCapture?.(e.pointerId);
    };
    const move = e => {
      local(e);
      if (!activeRef.current && pointer.grab) {
        const ball = pointer.grab;
        ball.x = ball.px = Math.max(ball.r, Math.min(w - ball.r, pointer.x));
        ball.y = ball.py = Math.max(ball.r, Math.min(h - ball.r, pointer.y));
        draw();
      }
    };
    const up = e => {
      if (canvas.hasPointerCapture?.(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
      pointer.grab = null;
    };
    canvas.addEventListener('pointerdown', down);
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', up);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener('pointerdown', down);
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerup', up);
      canvas.removeEventListener('pointercancel', up);
      api.current = { add: () => {}, shake: () => {}, sync: () => {}, step: () => {} };
    };
  }, []);

  useEffect(() => api.current.sync(), [animate]);

  return (
    <div className="absolute inset-0 flex flex-col bg-[radial-gradient(circle_at_50%_100%,rgba(139,124,255,0.18),transparent_60%)]">
      <div className="relative min-h-[360px] flex-1">
        {unavailable && <p className="absolute inset-0 grid place-items-center p-6 text-center text-muted">{t('canvasUnavailable')}</p>}
        <canvas ref={canvasRef} className="h-full w-full touch-none" aria-label={t('physicsAria')} />
      </div>
      <div className="shrink-0 p-3">
        <Panel className="flex flex-wrap items-end gap-x-6 gap-y-3">
          <ChipGroup
            label={t('gravity')}
            value={gravity}
            onChange={setGravity}
            options={Object.keys(GRAVITY).map((v) => ({ value: v, label: t(`gravities.${v}`) }))}
          />
          <ActionButton onClick={() => api.current.add()}>{t('addBalls')}</ActionButton>
          <ActionButton onClick={() => api.current.shake()}>{t('shake')}</ActionButton>
          {!animate && <ActionButton onClick={() => api.current.step()}>{t('stepFrame')}</ActionButton>}
        </Panel>
      </div>
    </div>
  );
}
