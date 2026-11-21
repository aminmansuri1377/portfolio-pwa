import { motion, useScroll } from 'framer-motion';

export function Reveal({ children, delay = 0, y = 28, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
}

export function Section({ id, kicker, title, subtitle, children, className = '' }) {
  return (
    <section id={id} className={`relative scroll-mt-24 py-24 md:py-32 ${className}`}>
      <div className="container-x">
        <Reveal>
          {kicker ? (
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-lime">{kicker}</p>
          ) : null}
          {title ? (
            <h2 className="mt-4 max-w-3xl font-display text-3xl font-bold leading-tight md:text-5xl">
              {title}
            </h2>
          ) : null}
          {subtitle ? (
            <p className="mt-4 max-w-2xl text-muted md:text-lg">{subtitle}</p>
          ) : null}
        </Reveal>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}

export function Chip({ children }) {
  return <span className="chip">{children}</span>;
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-lime"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
