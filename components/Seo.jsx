import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import { SITE } from '../lib/site';

export default function Seo({ title, description, path }) {
  const t = useTranslations('Meta');
  const router = useRouter();
  const pageTitle = title ? `${title} · ${SITE.name}` : t('title');
  const desc = description || t('description');

  let clean = path || router.asPath.split('#')[0].split('?')[0];
  if (clean === '/en') clean = '/';
  if (clean.startsWith('/en/')) clean = clean.slice(3);
  if (clean.length > 1 && clean.endsWith('/')) clean = clean.slice(0, -1);
  const deUrl = SITE.url + (clean === '/' ? '/' : clean);
  const enUrl = SITE.url + '/en' + (clean === '/' ? '' : clean);

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={desc} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={router.locale === 'en' ? enUrl : deUrl} />
      <link rel="alternate" hrefLang="de" href={deUrl} />
      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="x-default" href={deUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={router.locale === 'en' ? enUrl : deUrl} />
      <meta property="og:image" content={`${SITE.url}/icons/icon-512.png`} />
      <meta property="og:locale" content={router.locale === 'en' ? 'en_US' : 'de_DE'} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={desc} />
    </Head>
  );
}
