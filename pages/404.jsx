import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { FiArrowLeft } from 'react-icons/fi';
import Seo from '../components/Seo';

export default function NotFound() {
  const t = useTranslations('NotFound');
  return (
    <>
      <Seo title={t('title')} />
      <div className="container-x flex min-h-screen flex-col items-center justify-center text-center">
        <p className="text-gradient font-display text-[120px] font-bold leading-none md:text-[180px]">404</p>
        <h1 className="mt-4 font-display text-2xl font-bold">{t('title')}</h1>
        <p className="mt-3 max-w-md text-muted">{t('text')}</p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-lime px-7 py-3.5 font-display text-sm font-semibold text-ink-950 transition-shadow hover:shadow-glow"
        >
          <FiArrowLeft size={15} />
          {t('home')}
        </Link>
      </div>
    </>
  );
}
