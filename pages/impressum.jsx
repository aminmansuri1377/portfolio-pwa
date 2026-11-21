import { useTranslations } from 'next-intl';
import Seo from '../components/Seo';
import { Reveal } from '../components/ui';
import { SITE } from '../lib/site';

export default function Impressum() {
  const t = useTranslations('Impressum');
  const blocks = t.raw('blocks');

  return (
    <>
      <Seo title={t('title')} />
      <div className="container-x max-w-3xl pb-24 pt-32">
        <Reveal>
          <h1 className="font-display text-4xl font-bold">{t('title')}</h1>
          <p className="mt-6 rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-200">
            {t('notice')}
          </p>
        </Reveal>
        <div className="mt-10 space-y-8">
          {blocks.map((block) => (
            <Reveal key={block.h}>
              <h2 className="font-display text-lg font-bold">{block.h}</h2>
              <p className="mt-2 whitespace-pre-line leading-relaxed text-muted">{block.p}</p>
            </Reveal>
          ))}
          <Reveal>
            <h2 className="font-display text-lg font-bold">{t('contactH')}</h2>
            <p className="mt-2 text-muted">
              E-Mail:{' '}
              <a href={`mailto:${SITE.email}`} className="text-lime underline-offset-4 hover:underline">
                {SITE.email}
              </a>
            </p>
          </Reveal>
        </div>
      </div>
    </>
  );
}
