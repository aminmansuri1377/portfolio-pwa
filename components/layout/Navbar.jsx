import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { SITE } from '../../lib/site';

const SECTIONS = ['about', 'skills', 'experience', 'projects', 'contact'];

export default function Navbar() {
  const t = useTranslations('Nav');
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const isHome = router.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!isHome) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [isHome]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const goTo = (id) => (e) => {
    setOpen(false);
    if (!isHome) return;
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    if (window.__lenis) window.__lenis.scrollTo(el, { offset: -80 });
    else el.scrollIntoView({ behavior: 'smooth' });
    window.history.replaceState(null, '', `#${id}`);
  };

  const switchLocale = (locale) => {
    router.replace(router.asPath, router.asPath, { locale, scroll: false });
  };

  const LocaleToggle = ({ className = '' }) => (
    <div className={`flex items-center rounded-full border border-white/10 bg-white/5 p-1 ${className}`} role="group" aria-label={t('language')}>
      {['de', 'en'].map((l) => (
        <button
          key={l}
          onClick={() => switchLocale(l)}
          className={`rounded-full px-3 py-1 font-mono text-xs uppercase transition-colors ${
            router.locale === l ? 'bg-lime text-ink-950' : 'text-muted hover:text-white'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled ? 'border-b border-white/5 bg-ink-950/85 backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <nav className="container-x flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="group flex items-center gap-3" aria-label={SITE.name}>
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-lime font-display text-sm font-bold text-ink-950 transition-transform duration-300 group-hover:rotate-6">
            AM
          </span>
          <span className="hidden font-display text-sm font-semibold tracking-wide sm:block">
            {SITE.shortName}
            <span className="text-lime">.dev</span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {SECTIONS.map((id) => (
            <Link
              key={id}
              href={`/#${id}`}
              onClick={goTo(id)}
              className={`text-sm transition-colors hover:text-white ${
                active === id && isHome ? 'text-lime' : 'text-muted'
              }`}
            >
              {t(id)}
            </Link>
          ))}
          <Link
            href="/cv"
            className={`text-sm transition-colors hover:text-white ${
              router.pathname === '/cv' ? 'text-lime' : 'text-muted'
            }`}
          >
            {t('cv')}
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <LocaleToggle className="hidden sm:flex" />
          <button
            className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/5 lg:hidden"
            onClick={() => setOpen(true)}
            aria-label={t('menu')}
          >
            <FiMenu size={18} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col bg-ink-950/95 backdrop-blur-xl lg:hidden"
          >
            <div className="container-x flex h-16 items-center justify-between">
              <span className="font-display font-bold">
                {SITE.shortName}
                <span className="text-lime">.dev</span>
              </span>
              <button
                className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/5"
                onClick={() => setOpen(false)}
                aria-label={t('close')}
              >
                <FiX size={18} />
              </button>
            </div>
            <div className="container-x flex flex-1 flex-col justify-center gap-2 pb-16">
              {[...SECTIONS, 'cv'].map((id, i) => (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i }}
                >
                  <Link
                    href={id === 'cv' ? '/cv' : `/#${id}`}
                    onClick={id === 'cv' ? () => setOpen(false) : goTo(id)}
                    className="block py-2 font-display text-3xl font-bold text-white/90 transition-colors hover:text-lime"
                  >
                    {t(id)}
                  </Link>
                </motion.div>
              ))}
              <div className="mt-8 flex items-center gap-4">
                <LocaleToggle />
                <a href={SITE.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="text-muted hover:text-white">
                  <FaGithub size={20} />
                </a>
                <a href={SITE.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-muted hover:text-white">
                  <FaLinkedinIn size={20} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
