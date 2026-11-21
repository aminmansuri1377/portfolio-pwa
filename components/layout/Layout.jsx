import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import Lenis from 'lenis';
import Navbar from './Navbar';
import Footer from './Footer';
import { ScrollProgress } from '../ui';

function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 400, damping: 35 });
  const sy = useSpring(y, { stiffness: 400, damping: 35 });

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return undefined;
    setEnabled(true);
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [x, y]);

  if (!enabled) return null;
  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[70] hidden h-8 w-8 rounded-full border border-lime/60 mix-blend-difference md:block"
        style={{ x: sx, y: sy, translateX: '-50%', translateY: '-50%' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[70] hidden h-1.5 w-1.5 rounded-full bg-lime md:block"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
      />
    </>
  );
}

export default function Layout({ children }) {
  const router = useRouter();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    window.__lenis = lenis;
    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    const onRoute = () => {
      if (!window.location.hash) lenis.scrollTo(0, { immediate: true });
    };
    router.events.on('routeChangeComplete', onRoute);
    return () => {
      cancelAnimationFrame(rafId);
      router.events.off('routeChangeComplete', onRoute);
      lenis.destroy();
      window.__lenis = null;
    };
  }, [router.events]);

  return (
    <>
      <Cursor />
      <ScrollProgress />
      <div aria-hidden className="grid-bg pointer-events-none fixed inset-0 z-0" />
      <div aria-hidden className="noise pointer-events-none fixed inset-0 z-50" />
      <Navbar />
      <main className="relative z-10">{children}</main>
      <Footer />
    </>
  );
}
