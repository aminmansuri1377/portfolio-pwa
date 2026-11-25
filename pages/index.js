import Head from 'next/head';
import { useTranslations } from 'next-intl';
import Seo from '../components/Seo';
import Hero from '../components/sections/Hero';
import Marquee from '../components/sections/Marquee';
import About from '../components/sections/About';
import Skills from '../components/sections/Skills';
import Experience from '../components/sections/Experience';
import Projects from '../components/sections/Projects';
import VisualLabSection from '../components/sections/VisualLabSection';
import Contact from '../components/sections/Contact';
import { SITE } from '../lib/site';

export default function Home() {
  const t = useTranslations('Meta');
  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE.name,
    url: SITE.url,
    jobTitle: 'Frontend Developer',
    email: `mailto:${SITE.email}`,
    sameAs: [SITE.github, SITE.linkedin],
    knowsAbout: ['React', 'Next.js', 'TypeScript', 'Three.js', 'Tailwind CSS'],
    description: t('description'),
  };

  return (
    <>
      <Seo />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
        />
      </Head>
      <Hero />
      <Marquee />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <VisualLabSection />
      <Contact />
    </>
  );
}
