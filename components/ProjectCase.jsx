import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { FiArrowLeft, FiArrowUpRight, FiExternalLink } from 'react-icons/fi';
import Seo from './Seo';
import { Reveal, Chip } from './ui';
import { PROJECTS, getProject } from '../lib/projects';

export default function ProjectCase({ slug }) {
  const project = getProject(slug);
  const t = useTranslations(`Projects.cases.${slug}`);
  const p = useTranslations('Projects');
  const c = useTranslations('Case');

  const index = PROJECTS.findIndex((x) => x.slug === slug);
  const prev = PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(index + 1) % PROJECTS.length];

  const blocks = [
    { key: 'overview', text: t('overview') },
    { key: 'challenge', text: t('challenge') },
    { key: 'solution', text: t('solution') },
    { key: 'outcome', text: t('outcome') },
  ];

  return (
    <>
      <Seo title={t('title')} description={t('tagline')} />
      <article className="container-x pb-24 pt-32">
        <Reveal>
          <Link href="/#projects" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-muted transition-colors hover:text-lime">
            <FiArrowLeft size={14} />
            {c('back')}
          </Link>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Chip>{p(`types.${project.type}`)}</Chip>
            <Chip>{c('role')}: {t('role')}</Chip>
          </div>
          <h1 className="mt-5 font-display text-4xl font-bold leading-tight md:text-6xl">{t('title')}</h1>
          <p className="mt-4 max-w-3xl text-lg text-muted">{t('tagline')}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative mt-10 aspect-[21/10] overflow-hidden rounded-2xl border border-white/10">
            <Image
              src={project.hero}
              alt={t('title')}
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1100px"
              className="object-cover"
            />
          </div>
        </Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-10">
            {blocks.map((block, i) => (
              <Reveal key={block.key} delay={0.04 * i}>
                <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-lime">{c(block.key)}</h2>
                <p className="mt-3 leading-relaxed text-muted md:text-lg">{block.text}</p>
              </Reveal>
            ))}
            <Reveal>
              <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-lime">{c('features')}</h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {t.raw('features').map((f) => (
                  <li key={f} className="flex gap-3 text-sm text-muted">
                    <span className="text-lime">▹</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <Reveal delay={0.1}>
              <div className="glass rounded-2xl p-6">
                <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-muted">{c('stack')}</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Chip key={tag}>{tag}</Chip>
                  ))}
                </div>
                {project.live ? (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-lime px-6 py-3 font-display text-sm font-semibold text-ink-950 transition-shadow hover:shadow-glow"
                  >
                    <FiExternalLink size={15} />
                    {c('live')}
                  </a>
                ) : (
                  <p className="mt-6 text-sm text-muted">{c('noLive')}</p>
                )}
              </div>
            </Reveal>
            {project.gallery.length > 1 && (
              <Reveal delay={0.15}>
                <div className="glass rounded-2xl p-6">
                  <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-muted">{c('gallery')}</h2>
                  <div className="mt-4 space-y-4">
                    {project.gallery.slice(1).map((src) => (
                      <div key={src} className="relative aspect-video overflow-hidden rounded-xl border border-white/10">
                        <Image src={src} alt={t('title')} fill sizes="(max-width: 1024px) 100vw, 360px" className="object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}
          </div>
        </div>

        <Reveal>
          <div className="mt-20 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-2">
            <Link href={`/projects/${prev.slug}`} className="group glass rounded-2xl p-5 transition-colors hover:border-lime/30">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">← {c('prev')}</p>
              <p className="mt-2 font-display text-lg font-bold transition-colors group-hover:text-lime">
                {p(`cases.${prev.slug}.title`)}
              </p>
            </Link>
            <Link href={`/projects/${next.slug}`} className="group glass rounded-2xl p-5 text-right transition-colors hover:border-lime/30">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">{c('next')} →</p>
              <p className="mt-2 font-display text-lg font-bold transition-colors group-hover:text-lime">
                {p(`cases.${next.slug}.title`)}
              </p>
            </Link>
          </div>
        </Reveal>
      </article>
    </>
  );
}
