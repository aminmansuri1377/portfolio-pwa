import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { FiArrowUpRight } from 'react-icons/fi';
import { FaGithub } from 'react-icons/fa';
import { Section, Reveal, Chip } from '../ui';
import { PROJECTS } from '../../lib/projects';
import { SITE } from '../../lib/site';

export default function Projects() {
  const t = useTranslations('Projects');

  return (
    <Section id="projects" kicker={t('kicker')} title={t('title')} subtitle={t('subtitle')}>
      <div className="grid gap-6 md:grid-cols-2">
        {PROJECTS.map((project, i) => (
          <Reveal
            key={project.slug}
            delay={0.06 * i}
            className={i === 0 ? 'md:col-span-2' : ''}
          >
            <Link
              href={`/projects/${project.slug}`}
              className="group block overflow-hidden rounded-2xl border border-white/10 bg-ink-900/70 transition duration-300 hover:border-lime/40 max-md:active:scale-[0.98]"
            >
              <div className={`relative overflow-hidden ${i === 0 ? 'aspect-[21/9]' : 'aspect-[16/9]'}`}>
                <Image
                  src={project.image}
                  alt={t(`cases.${project.slug}.title`)}
                  fill
                  sizes={i === 0 ? '(max-width: 768px) 100vw, 1100px' : '(max-width: 768px) 100vw, 550px'}
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />
                <span className="glass absolute left-4 top-4 rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-lime">
                  {t(`types.${project.type}`)}
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-display text-xl font-bold transition-colors group-hover:text-lime md:text-2xl">
                    {t(`cases.${project.slug}.title`)}
                  </h3>
                  <FiArrowUpRight
                    size={22}
                    className="mt-1 shrink-0 text-muted transition-all group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-lime"
                  />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {t(`cases.${project.slug}.tagline`)}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.slice(0, 5).map((tag) => (
                    <Chip key={tag}>{tag}</Chip>
                  ))}
                </div>
                <p className="mt-4 font-mono text-xs text-lime opacity-0 transition-opacity group-hover:opacity-100 max-md:opacity-100">
                  {t('viewCase')} →
                </p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <div className="mt-10 text-center">
          <a
            href={SITE.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 font-display text-sm font-semibold transition-colors hover:border-lime/50 hover:text-lime"
          >
            <FaGithub size={16} />
            {t('github')}
          </a>
        </div>
      </Reveal>
    </Section>
  );
}
