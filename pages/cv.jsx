import { useTranslations } from 'next-intl';
import { FiDownload, FiMail } from 'react-icons/fi';
import Seo from '../components/Seo';
import { Reveal, Chip } from '../components/ui';
import { SKILL_GROUPS } from '../lib/skills';
import { SITE } from '../lib/site';

export default function CV() {
  const t = useTranslations('CV');
  const exp = useTranslations('Experience');
  const skills = useTranslations('Skills');
  const contact = useTranslations('Contact');
  const items = exp.raw('items');
  const languages = t.raw('langItems');

  return (
    <>
      <Seo title={t('title')} />
      <div className="container-x max-w-4xl pb-24 pt-32">
        <div className="no-print flex flex-wrap gap-3">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-full bg-lime px-6 py-3 font-display text-sm font-semibold text-ink-950 transition-shadow hover:shadow-glow"
          >
            <FiDownload size={15} />
            {t('print')}
          </button>
          <a
            href={`mailto:${SITE.email}?subject=CV%20Request`}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 font-display text-sm font-semibold transition-colors hover:border-lime/50 hover:text-lime"
          >
            <FiMail size={15} />
            {t('request')}
          </a>
        </div>

        <Reveal>
          <header className="mt-10 border-b border-white/10 pb-8">
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-lime">{t('title')}</p>
            <h1 className="mt-3 font-display text-4xl font-bold md:text-5xl">{SITE.name}</h1>
            <p className="mt-2 text-lg text-muted">Frontend Developer · React · Next.js · TypeScript</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Chip>{SITE.email}</Chip>
              <Chip>{SITE.phoneDisplay}</Chip>
              <Chip>{contact('locationValue')}</Chip>
              <Chip>{SITE.githubHandle}</Chip>
            </div>
          </header>
        </Reveal>

        <Reveal>
          <section className="mt-10">
            <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-lime">{t('profile')}</h2>
            <p className="mt-3 leading-relaxed text-muted">{t('profileText')}</p>
          </section>
        </Reveal>

        <section className="mt-10">
          <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-lime">{exp('kicker')}</h2>
          <div className="mt-6 space-y-8">
            {items.map((item) => (
              <Reveal key={item.company}>
                <div className="border-l border-white/10 pl-6">
                  <p className="font-mono text-xs text-lime">{item.period}</p>
                  <h3 className="mt-1 font-display text-lg font-bold">{item.role}</h3>
                  <p className="text-sm text-muted">{item.company}</p>
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
                    {item.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <Reveal>
          <section className="mt-10">
            <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-lime">{exp('eduTitle')}</h2>
            <p className="mt-3 font-display font-bold">{exp('degree')}</p>
            <p className="text-sm text-muted">{exp('school')}</p>
          </section>
        </Reveal>

        <Reveal>
          <section className="mt-10">
            <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-lime">{t('skills')}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {SKILL_GROUPS.map((group) => (
                <div key={group.key}>
                  <p className="text-sm font-semibold text-white/90">{skills(`categories.${group.key}`)}</p>
                  <p className="mt-1 text-sm text-muted">{group.items.map((s) => s.name).join(' · ')}</p>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="mt-10">
            <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-lime">{t('languages')}</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {languages.map((l) => (
                <Chip key={l.name}>{l.name} — {l.level}</Chip>
              ))}
            </div>
          </section>
        </Reveal>
      </div>
    </>
  );
}
