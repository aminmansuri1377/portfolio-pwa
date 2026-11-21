import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { FiArrowUp, FiMail } from 'react-icons/fi';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { SITE } from '../../lib/site';

export default function Footer() {
  const t = useTranslations('Footer');
  const nav = useTranslations('Nav');
  const year = new Date().getFullYear();

  const toTop = () => {
    if (window.__lenis) window.__lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-10 border-t border-white/5 bg-ink-900/60">
      <div className="container-x grid gap-10 py-14 md:grid-cols-3">
        <div>
          <p className="font-display text-lg font-bold">
            {SITE.name}
          </p>
          <p className="mt-3 max-w-xs text-sm text-muted">{t('tagline')}</p>
          <div className="mt-5 flex gap-3">
            <a href={SITE.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/5 text-muted transition-colors hover:border-lime/40 hover:text-lime">
              <FaGithub size={16} />
            </a>
            <a href={SITE.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/5 text-muted transition-colors hover:border-lime/40 hover:text-lime">
              <FaLinkedinIn size={16} />
            </a>
            <a href={`mailto:${SITE.email}`} aria-label={SITE.email} className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/5 text-muted transition-colors hover:border-lime/40 hover:text-lime">
              <FiMail size={16} />
            </a>
          </div>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">{t('navigation')}</p>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            {['about', 'skills', 'experience', 'projects', 'contact'].map((id) => (
              <Link key={id} href={`/#${id}`} className="text-muted transition-colors hover:text-lime">
                {nav(id)}
              </Link>
            ))}
            <Link href="/cv" className="text-muted transition-colors hover:text-lime">
              {nav('cv')}
            </Link>
          </div>
        </div>
        <div className="md:text-right">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Legal</p>
          <div className="mt-4 flex flex-col gap-2 text-sm md:items-end">
            <Link href="/impressum" className="text-muted transition-colors hover:text-lime">
              {t('impressum')}
            </Link>
            <Link href="/datenschutz" className="text-muted transition-colors hover:text-lime">
              {t('privacy')}
            </Link>
            <button onClick={toTop} className="mt-2 inline-flex items-center gap-2 text-muted transition-colors hover:text-lime">
              {t('top')} <FiArrowUp size={14} />
            </button>
          </div>
        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="container-x flex flex-col gap-2 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {SITE.name}. {t('rights')}</p>
          <p className="font-mono">{t('builtWith')}</p>
        </div>
      </div>
    </footer>
  );
}
