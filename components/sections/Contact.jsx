import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { FiCheck, FiCopy, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { Section, Reveal } from '../ui';
import { SITE } from '../../lib/site';

export default function Contact() {
  const t = useTranslations('Contact');
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // Clipboard unavailable (e.g. insecure context) – ignore.
    }
  };

  const cards = [
    {
      icon: FiMail,
      label: t('email'),
      value: SITE.email,
      href: `mailto:${SITE.email}`,
      action: (
        <button
          onClick={copyEmail}
          aria-label={t('copy')}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5 text-muted transition-colors hover:border-lime/40 hover:text-lime"
        >
          {copied ? <FiCheck size={15} className="text-lime" /> : <FiCopy size={15} />}
        </button>
      ),
    },
    {
      icon: FiPhone,
      label: t('phone'),
      value: SITE.phoneDisplay,
      href: SITE.whatsapp,
    },
    {
      icon: FaGithub,
      label: t('github'),
      value: SITE.githubHandle,
      href: SITE.github,
    },
    {
      icon: FaLinkedinIn,
      label: t('linkedin'),
      value: SITE.linkedinHandle,
      href: SITE.linkedin,
    },
  ];

  return (
    <Section id="contact" kicker={t('kicker')} title={t('title')}>
      <Reveal>
        <p className="max-w-2xl leading-relaxed text-muted md:text-lg">{t('text')}</p>
      </Reveal>
      <Reveal delay={0.1}>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-lime/30 bg-lime/10 px-4 py-1.5">
          <span className="h-2 w-2 rounded-full bg-lime" />
          <span className="font-mono text-xs text-lime">{t('availability')}</span>
        </div>
      </Reveal>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Reveal key={card.label} delay={0.06 * i}>
              <div className="glass flex items-center justify-between gap-4 rounded-2xl p-5 transition-colors hover:border-lime/30">
                <a
                  href={card.href}
                  target={card.href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  className="flex min-w-0 items-center gap-4"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-lime/10 text-lime">
                    <Icon size={18} />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-mono text-[10px] uppercase tracking-[0.25em] text-muted">{card.label}</span>
                    <span className="block truncate text-sm text-white/90">{card.value}</span>
                  </span>
                </a>
                {card.action}
              </div>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={0.15}>
        <div className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <a
            href={`mailto:${SITE.email}`}
            className="inline-flex items-center gap-2 rounded-full bg-lime px-8 py-4 font-display text-sm font-semibold text-ink-950 transition-shadow hover:shadow-glow"
          >
            <FiMail size={16} />
            {t('cta')}
          </a>
          <p className="flex items-center gap-2 font-mono text-xs text-muted">
            <FiMapPin size={14} className="text-lime" />
            {t('location')}: {t('locationValue')}
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
