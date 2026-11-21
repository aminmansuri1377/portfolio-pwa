import { useTranslations } from 'next-intl';
import { FiAward } from 'react-icons/fi';
import { Section, Reveal } from '../ui';

export default function Experience() {
  const t = useTranslations('Experience');
  const items = t.raw('items');

  return (
    <Section id="experience" kicker={t('kicker')} title={t('title')}>
      <div className="relative ml-2 space-y-14 border-l border-white/10 pl-8 md:ml-4">
        {items.map((item, i) => (
          <Reveal key={item.company} delay={0.05 * i}>
            <div className="relative">
              <span className="absolute -left-[41px] top-1.5 h-3 w-3 rounded-full border-2 border-ink-950 bg-lime shadow-glow md:-left-[41px]" />
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-lime">{item.period}</p>
              <h3 className="mt-2 font-display text-xl font-bold md:text-2xl">{item.role}</h3>
              <p className="mt-1 text-sm text-muted">{item.company}</p>
              <ul className="mt-4 space-y-2">
                {item.bullets.map((b) => (
                  <li key={b} className="flex gap-3 text-sm leading-relaxed text-muted">
                    <span className="mt-0.5 text-lime">▹</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <div className="glass mt-16 flex flex-col gap-5 rounded-2xl p-7 sm:flex-row sm:items-center">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-lime/10 text-lime">
            <FiAward size={22} />
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">{t('eduTitle')}</p>
            <h3 className="mt-1 font-display text-lg font-bold">{t('degree')}</h3>
            <p className="text-sm text-muted">{t('school')}</p>
            <p className="mt-2 text-sm text-muted">{t('eduNote')}</p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
