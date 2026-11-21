import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { FiLayers, FiUsers, FiZap } from 'react-icons/fi';
import { Section, Reveal, Chip } from '../ui';
import me from '../../public/assets/me.jpeg';

const ICONS = [FiZap, FiLayers, FiUsers];

export default function About() {
  const t = useTranslations('About');
  const highlights = t.raw('highlights');
  const facts = t.raw('facts');

  return (
    <Section id="about" kicker={t('kicker')} title={t('title')}>
      <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <div className="relative mx-auto max-w-sm">
            <div aria-hidden className="absolute -inset-3 rotate-2 rounded-3xl border border-lime/25" />
            <div className="relative overflow-hidden rounded-2xl border border-white/10">
              <Image
                src={me}
                alt={t('photoAlt')}
                placeholder="blur"
                className="aspect-[4/5] w-full object-cover"
                sizes="(max-width: 1024px) 80vw, 380px"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/90 to-transparent p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-lime">
                  Frontend · React · Next.js
                </p>
              </div>
            </div>
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="glass absolute -bottom-5 -right-4 rounded-xl px-4 py-3"
            >
              <p className="font-display text-sm font-bold text-lime">{t('badge')}</p>
            </motion.div>
          </div>
        </Reveal>

        <div>
          <Reveal delay={0.1}>
            <div className="space-y-5 leading-relaxed text-muted">
              <p>{t('p1')}</p>
              <p>{t('p2')}</p>
              <p className="text-white/90">{t('p3')}</p>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-7 flex flex-wrap gap-2">
              {facts.map((f) => (
                <Chip key={f}>{f}</Chip>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      <div className="mt-16 grid gap-5 sm:grid-cols-3">
        {highlights.map((h, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <Reveal key={h.title} delay={0.08 * i}>
              <div className="glass h-full rounded-2xl p-6 transition-colors hover:border-lime/30">
                <Icon className="text-lime" size={22} />
                <h3 className="mt-4 font-display text-lg font-bold">{h.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{h.text}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
