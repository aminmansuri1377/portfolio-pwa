import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion, useInView } from 'framer-motion';
import { FiArrowUpRight } from 'react-icons/fi';
import { Reveal } from '../ui';
import { getLabCopy, LAB_EXPERIMENTS } from '../../lib/lab';
import s from '../showcase/showcase.module.css';

const FACES = ['f1', 'f2', 'f3', 'f4', 'f5', 'f6'];

export default function VisualLabSection() {
  const { locale } = useRouter();
  const copy = getLabCopy(locale);
  const reducedMotion = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { margin: '100px' });
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 120, damping: 18 });
  const sy = useSpring(py, { stiffness: 120, damping: 18 });
  const rotY = useTransform(sx, [-1, 1], [-14, 14]);
  const rotX = useTransform(sy, [-1, 1], [10, -10]);

  const onMove = (e) => {
    if (reducedMotion || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set(((e.clientX - r.left) / r.width) * 2 - 1);
    py.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  const count3d = LAB_EXPERIMENTS.filter((d) => d.category === 'spatial').length;
  const countUi = LAB_EXPERIMENTS.length - count3d;

  return (
    <section ref={ref} data-active={inView && !reducedMotion ? 'true' : 'false'} id="visual-lab" className={`${s.teaserRoot} relative scroll-mt-24 py-12 md:py-20`}>
      <div className="container-x">
        <Reveal>
          <Link
            href="/lab"
            prefetch={false}
            onPointerMove={onMove}
            onPointerLeave={onLeave}
            className="group relative block overflow-hidden rounded-[28px] p-px"
            aria-label={copy.teaserCta}
          >
            {/* rotating gradient border */}
            <span aria-hidden className="absolute inset-0 overflow-hidden rounded-[28px]">
              <span className={`${s.frame} ${s.frameSpin} absolute left-1/2 top-1/2 aspect-square w-[160%] -translate-x-1/2 -translate-y-1/2 opacity-60 transition-opacity duration-500 group-hover:opacity-100`} />
            </span>

            <div className="relative grid gap-8 overflow-hidden rounded-[27px] bg-ink-950 p-7 md:grid-cols-[1.15fr_1fr] md:p-12">
              <div aria-hidden className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-lime/10 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
              <div aria-hidden className="pointer-events-none absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-violet/20 blur-3xl" />

              <div className="relative z-10 flex flex-col justify-center">
                <p className="font-mono text-xs uppercase tracking-[0.35em] text-lime">{copy.teaserKicker}</p>
                <h2 className="mt-4 font-display text-4xl font-bold leading-[1.05] md:text-6xl">
                  {copy.teaserTitle} <span className="text-gradient">{copy.teaserAccent}</span>
                </h2>
                <p className="mt-5 max-w-md text-muted md:text-lg">{copy.teaserText}</p>

                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="chip">{count3d} × Three.js / WebGL</span>
                  <span className="chip">{countUi} × {locale === 'en' ? 'UI & Canvas' : 'UI & Canvas'}</span>
                  <span className="chip">0 × {locale === 'en' ? 'external assets' : 'externe Assets'}</span>
                </div>

                <span className="mt-8 inline-flex w-fit items-center gap-3 rounded-full bg-lime px-6 py-3 font-display text-sm font-bold text-ink-950 shadow-glow transition-transform duration-300 group-hover:scale-[1.04]">
                  {copy.teaserCta}
                  <FiArrowUpRight size={18} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </div>

              {/* CSS-only 3D scene: no extra WebGL context on the homepage */}
              <div aria-hidden className="relative z-10 grid min-h-[260px] place-items-center">
                <div className={`${s.ring} h-64 w-64 ${s.spin}`} style={{ borderStyle: 'dashed' }} />
                <div className={`${s.ring} h-44 w-44 ${s.spinRev}`} style={{ borderColor: 'rgba(191,255,60,0.25)' }} />
                <motion.div style={{ rotateX: rotX, rotateY: rotY }} className={`${s.scene} absolute`}>
                  <div className={s.cube}>
                    {FACES.map((f) => (
                      <span key={f} className={`${s.face} ${s[f]}`} />
                    ))}
                    <div className={s.core}>
                      {FACES.map((f) => (
                        <span key={f} className={`${s.coreFace} ${s[f]}`} />
                      ))}
                    </div>
                  </div>
                </motion.div>
                {['GLSL', 'Three.js', 'Framer', 'Canvas'].map((c, i) => (
                  <span
                    key={c}
                    className={`glass ${s.bob} absolute rounded-full px-3 py-1 font-mono text-xs text-white/80`}
                    style={{ left: `${[6, 66, 12, 70][i]}%`, top: `${[14, 22, 76, 78][i]}%`, animationDelay: `${i * -1.3}s` }}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
