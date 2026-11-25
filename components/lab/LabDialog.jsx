import { Component, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { FiChevronLeft, FiChevronRight, FiCopy, FiCheck, FiX, FiPause, FiPlay } from 'react-icons/fi';
import { LAB_EXPERIMENTS, LAB_VIEWS, getLabCopy } from '../../lib/lab';
import s from '../../styles/visual-lab.module.css';

function Loading({ error, retry }) {
  const { locale } = useRouter();
  const copy = getLabCopy(locale);
  if (error) return <div className={s.demoError} role="alert"><p>{copy.error}</p><button className={s.secondaryButton} onClick={retry}>{copy.retry}</button></div>;
  return <div className={s.demoLoading} role="status"><p className={s.srOnly}>{copy.loading}</p><span aria-hidden="true" /><span aria-hidden="true" /><span aria-hidden="true" /></div>;
}
const ShowcaseDemo = dynamic(() => import('../showcase/ShowcaseDemo'), { ssr: false, loading: Loading });
const SpatialDemo = dynamic(() => import('./spatial/SpatialDemo'), { ssr: false, loading: Loading });
const FrontendDemo = dynamic(() => import('./frontend/FrontendDemo'), { ssr: false, loading: Loading });
const InterfaceDemo = dynamic(() => import('./interfaces/InterfaceDemo'), { ssr: false, loading: Loading });

class ExperimentBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <div className={s.demoError} role="alert"><p>{this.props.copy.error}</p><button className={s.secondaryButton} onClick={() => this.setState({ failed: false })}>{this.props.copy.retry}</button></div>;
    return this.props.children;
  }
}

export default function LabDialog({ experiment, viewId, locale, copy, reducedMotion, onClose, onSelect, onMotionToggle, motionLocked }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [copyFallback, setCopyFallback] = useState('');
  const copyTimer = useRef();
  const index = LAB_EXPERIMENTS.findIndex(item => item.id === experiment.id);
  const view = LAB_VIEWS.find(item => item.id === viewId) || experiment;
  const details = copy.descriptions[view.id];

  useEffect(() => {
    const dialog = dialogRef.current;
    const priorFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const lenis = window.__lenis;
    const wasStopped = lenis?.isStopped;
    document.body.style.overflow = 'hidden';
    lenis?.stop();
    dialog.showModal();
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      clearTimeout(copyTimer.current);
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (!wasStopped) lenis?.start();
      if (priorFocus?.isConnected) priorFocus.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    setCopied(false);
    setCopyFallback('');
    if (dialogRef.current) dialogRef.current.scrollTop = 0;
  }, [view.id]);

  const copyLink = async () => {
    const url = new URL(window.location.href);
    url.search = '';
    url.searchParams.set('demo', view.id);
    url.hash = '';
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(url.href);
      setCopied(true);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopyFallback(url.href);
    }
  };

  const Demo = view.showcaseId ? ShowcaseDemo : view.category === 'spatial' ? SpatialDemo : view.category === 'creative' ? FrontendDemo : InterfaceDemo;
  return (
    <dialog ref={dialogRef} className={s.dialog} data-lenis-prevent data-paused={reducedMotion ? 'true' : 'false'} aria-labelledby="lab-dialog-title" aria-describedby="lab-dialog-description"
      onCancel={event => { event.preventDefault(); onClose(); }}
      onClick={event => { if (event.target === dialogRef.current) onClose(); }}>
      <div className={s.dialogInner} data-lenis-prevent>
        <header className={s.dialogBar}>
          <div className={s.dialogIdentity}><span className={s.dialogMark} style={{ backgroundColor: experiment.accent }} /><div><h2 id="lab-dialog-title">{experiment.name}</h2><p>{copy.categories[experiment.category]}</p></div></div>
          <div className={s.dialogActions}>
            <button onClick={() => onSelect(LAB_EXPERIMENTS[(index + LAB_EXPERIMENTS.length - 1) % LAB_EXPERIMENTS.length].id)} aria-label={copy.previous} title={copy.previous}><FiChevronLeft /></button>
            <button onClick={() => onSelect(LAB_EXPERIMENTS[(index + 1) % LAB_EXPERIMENTS.length].id)} aria-label={copy.next} title={copy.next}><FiChevronRight /></button>
            <button onClick={onMotionToggle} disabled={motionLocked} aria-pressed={reducedMotion} aria-label={motionLocked ? copy.motionReduced : reducedMotion ? copy.motionOff : copy.motionOn} title={motionLocked ? copy.motionReduced : reducedMotion ? copy.motionOff : copy.motionOn}>{reducedMotion ? <FiPlay /> : <FiPause />}</button>
            <button onClick={copyLink} aria-label={copied ? (locale === 'en' ? 'Link copied' : 'Link kopiert') : (locale === 'en' ? 'Copy demo link' : 'Demo-Link kopieren')} title={locale === 'en' ? 'Copy demo link' : 'Demo-Link kopieren'}>{copied ? <FiCheck /> : <FiCopy />}</button>
            <span className={s.closeHint}>{copy.closeHint}</span>
            <button ref={closeRef} onClick={onClose} aria-label={copy.close} title={copy.close} className={s.closeButton}><FiX /></button>
          </div>
        </header>
        {copyFallback && <label className={s.copyFallback}>{locale === 'en' ? 'Copy this link:' : 'Diesen Link kopieren:'}<input value={copyFallback} readOnly onFocus={event => event.target.select()} /></label>}
        <div className={s.srOnly} role="status">{copied ? (locale === 'en' ? 'Link copied' : 'Link kopiert') : ''}</div>
        {experiment.views.length > 1 && <div className={s.viewTabs} role="group" aria-label={locale === 'en' ? 'Choose a studio mode' : 'Studio-Modus wählen'}>
          {experiment.views.map(id => <button type="button" key={id} aria-pressed={view.id === id} onClick={() => onSelect(id)}>{copy.viewLabels[id]}</button>)}
        </div>}
        <div className={s.demoStage}>
          <ExperimentBoundary key={view.id} copy={copy}><Demo key={view.id} id={view.id} locale={locale} reducedMotion={reducedMotion} /></ExperimentBoundary>
        </div>
        <div className={s.dialogNote}>
          <div><span>{copy.detail}</span><p id="lab-dialog-description">{details[2]}</p></div>
          <div className={s.dialogTags}>{view.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
        </div>
      </div>
    </dialog>
  );
}
