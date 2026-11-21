import { useTranslations } from 'next-intl';
import Seo from '../components/Seo';
import { Reveal } from '../components/ui';

export default function Datenschutz() {
  const t = useTranslations('Privacy');
  const blocks = t.raw('blocks');

  return (
    <>
      <Seo title={t('title')} />
      <div className="container-x max-w-3xl pb-24 pt-32">
        <Reveal>
          <h1 className="font-display text-4xl font-bold">{t('title')}</h1>
          <p className="mt-3 font-mono text-xs text-muted">{t('updated')}</p>
        </Reveal>
        <div className="mt-10 space-y-8">
          {blocks.map((block) => (
            <Reveal key={block.h}>
              <h2 className="font-display text-lg font-bold">{block.h}</h2>
              <p className="mt-2 leading-relaxed text-muted">{block.p}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </>
  );
}
