import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { MotionConfig, motion, useInView, useReducedMotion } from 'framer-motion';
import { FiBox, FiPause, FiPlay, FiPlus, FiMail, FiArrowDown } from 'react-icons/fi';
import Seo from '../Seo';
import { getLabCopy, LAB_EXPERIMENTS, LAB_VIEWS, getLabExperiment } from '../../lib/lab';
import { SITE } from '../../lib/site';
import LabArtwork from './LabArtwork';
import Thumb from '../showcase/Thumbs';
import LabDialog from './LabDialog';
import s from '../../styles/visual-lab.module.css';

const HeroTunnel = dynamic(() => import('../showcase/HeroTunnel'), { ssr: false });

export default function VisualLab() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'de';
  const copy = getLabCopy(locale);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [paused, setPaused] = useState(false);
  const systemReduced = useReducedMotion();
  const reducedMotion = Boolean(systemReduced || paused);
  const heroRef = useRef(null);
  const heroVisible = useInView(heroRef, { margin: '100px' });
  const active = getLabExperiment(selected);
  const shown = LAB_EXPERIMENTS.filter(item => filter === 'all' || item.category === filter);

  useEffect(() => {
    if (!router.isReady) return;
    const demo = typeof router.query.demo === 'string' ? router.query.demo : '';
    setSelected(LAB_VIEWS.some(item => item.id === demo) ? demo : null);
  }, [router.isReady, router.query.demo]);

  function closeDemo() {
    setSelected(null);
    if (router.query.demo) router.replace({ pathname: '/lab', query: {} }, undefined, { shallow: true, scroll: false });
  }

  function selectDemo(id) {
    setSelected(id);
    if (router.query.demo) router.replace({ pathname: '/lab', query: { demo: id } }, undefined, { shallow: true, scroll: false });
  }

  return (
    <MotionConfig reducedMotion={reducedMotion ? 'always' : 'user'}>
      <Seo title="Visual Lab" description={copy.meta} path="/lab" />
      <div className={s.page} data-paused={reducedMotion ? 'true' : 'false'}>
        <section className={s.tunnelHero} ref={heroRef} aria-labelledby="lab-title">
          <div className={s.tunnelBackground} aria-hidden="true">
            {!active && <HeroTunnel active={heroVisible} reducedMotion={reducedMotion} locale={locale} pointerTarget={heroRef} />}
          </div>
          <div className={s.tunnelVignette} aria-hidden="true" />
          <div className={`${s.container} ${s.tunnelContent}`}>
            <p className={s.tunnelKicker}>{locale === 'en' ? 'VISUAL LAB — LIVE EXPERIMENTS' : 'VISUAL LAB — LIVE-EXPERIMENTE'}</p>
            <h1 id="lab-title" className={s.tunnelTitle} aria-label="Visual Lab">
              {['VISUAL', 'LAB'].map((word, wi) => <span key={word} className={wi ? s.gradientWord : undefined} aria-hidden="true">
                {word.split('').map((letter, i) => <motion.span key={i} initial={reducedMotion ? false : { opacity: 0, y: 40, rotateX: -60 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ delay: reducedMotion ? 0 : .1 + (wi * 6 + i) * .045, duration: reducedMotion ? 0 : .7 }}>{letter}</motion.span>)}
              </span>)}
            </h1>
            <p className={s.tunnelIntro}>{copy.intro}</p>
            <div className={s.tunnelButtons}>
              <a href="#experiments" className={s.primaryButton}>{copy.explore}<FiArrowDown aria-hidden="true" /></a>
              <button type="button" onClick={() => setSelected('galaxy')} className={s.textButton}><FiBox aria-hidden="true" />{locale === 'en' ? 'Enter the galaxy' : 'Galaxie betreten'}</button>
            </div>
            <div className={s.tunnelStats}>
              <div><strong>{LAB_EXPERIMENTS.length}</strong><span>{locale === 'en' ? 'Creative studios' : 'Kreative Studios'}</span></div>
              <div><strong>{LAB_VIEWS.length}</strong><span>{locale === 'en' ? 'Interactive modes' : 'Interaktive Modi'}</span></div>
              <div><strong>100%</strong><span>{locale === 'en' ? 'In your browser' : 'Im Browser'}</span></div>
            </div>
            <button type="button" className={s.motionButton} onClick={() => setPaused(value => !value)} disabled={Boolean(systemReduced)} aria-pressed={reducedMotion}>
              {reducedMotion ? <FiPlay aria-hidden="true" /> : <FiPause aria-hidden="true" />}{systemReduced ? copy.motionReduced : paused ? copy.motionOff : copy.motionOn}
            </button>
          </div>
        </section>

        <section id="experiments" className={`${s.collection} ${s.container}`} aria-labelledby="collection-title">
          <div className={s.collectionHeading}><div><p className={s.eyebrow}>{copy.collection}</p><h2 id="collection-title">{copy.collectionTitle}</h2></div><p>{copy.collectionText}</p></div>
          <div className={s.filterRow}>
            <div className={s.filters} role="group" aria-label={locale === 'en' ? 'Filter experiments' : 'Experimente filtern'}>
              {Object.entries(copy.categories).map(([key, label]) => <button key={key} className={filter === key ? s.filterActive : ''} onClick={() => setFilter(key)} aria-pressed={filter === key}>{label}<span>{key === 'all' ? LAB_EXPERIMENTS.length : LAB_EXPERIMENTS.filter(item => item.category === key).length}</span></button>)}
            </div>
            <span className={s.resultCount} role="status" aria-live="polite">{shown.length} / {LAB_EXPERIMENTS.length}</span>
          </div>
          <div className={s.gallery}>
            {shown.map(item => <motion.article layout={!reducedMotion} key={item.id} initial={false} animate={{ opacity: 1 }} transition={{ duration: .35 }} className={`${s.card} ${item.featured && filter === 'all' ? s.featuredCard : ''}`} style={{ '--card-accent': item.accent }}>
              <button className={s.cardButton} onClick={() => setSelected(item.id)} aria-label={`${copy.open}: ${item.name} — ${(copy.groupDescriptions[item.id] || copy.descriptions[item.id])[0]}`}>
                <div className={s.cardVisual}>
                  {item.showcaseId ? <div className={s.importedArtwork} aria-hidden="true"><Thumb id={item.showcaseId} accent={item.accent} /></div> : <LabArtwork kind={item.id} />}
                  <span className={s.categoryLabel}>{copy.categories[item.category]}</span>
                  {item.views.length > 1 && <span className={s.viewCount}>{item.views.length} {locale === 'en' ? 'interactive modes' : 'interaktive Modi'}</span>}
                  <span className={s.launchIcon} aria-hidden="true"><FiPlus /></span>
                  <span className={s.cardOpen}>{copy.open}<FiPlus aria-hidden="true" /></span>
                </div>
                <div className={s.cardBody}><div className={s.cardTitle}><h3>{item.name}</h3><span>{item.tags[0]}</span></div><h4>{(copy.groupDescriptions[item.id] || copy.descriptions[item.id])[0]}</h4><p>{(copy.groupDescriptions[item.id] || copy.descriptions[item.id])[1]}</p></div>
              </button>
            </motion.article>)}
          </div>
          <p className={s.frontendNote}>{copy.frontendNote}</p>
        </section>

        <section className={`${s.labContact} ${s.container}`}>
          <span className={s.contactStar} aria-hidden="true">✳</span>
          <div><h2>{copy.footerTitle}</h2><p>{copy.footerText}</p></div>
          <a href={`mailto:${SITE.email}`} className={s.primaryButton}><FiMail aria-hidden="true" />{copy.footerCta}</a>
          <Link href="/" className={s.backHome}>{locale === 'en' ? 'Back to portfolio' : 'Zurück zum Portfolio'}</Link>
        </section>
      </div>
      {active && <LabDialog experiment={active} viewId={selected} locale={locale} copy={copy} reducedMotion={reducedMotion} onClose={closeDemo} onSelect={selectDemo} onMotionToggle={() => setPaused(value => !value)} motionLocked={Boolean(systemReduced)} />}
    </MotionConfig>
  );
}
