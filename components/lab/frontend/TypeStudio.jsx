import {useEffect, useId, useRef, useState} from 'react';
import styles from '../../../styles/lab-frontend.module.css';

const themes = [
  {name: 'Acid', bg: '#bfff3c', ink: '#15210c', accent: '#15210c'},
  {name: 'Cobalt', bg: '#244fe7', ink: '#f5f1e6', accent: '#bfff3c'},
  {name: 'Paper', bg: '#f2e9dd', ink: '#27251f', accent: '#d45837'},
  {name: 'Night', bg: '#171328', ink: '#c5b8ff', accent: '#bfff3c'}
];
const copy = {
  en: {title: 'Make a little noise.', intro: 'Your words. Your rhythm. A live art-direction playground.', text: 'Headline', theme: 'Color palette', scale: 'Type scale', tracking: 'Letter spacing', weight: 'Font weight', layout: 'Composition', poster: 'Poster', grid: 'Grid', reset: 'Reset', copy: 'Copy CSS', copied: 'CSS copied', fallback: 'Copy is unavailable here. Select the CSS below.', preview: 'Live poster preview', defaultText: 'MAKE\nSOMETHING\nMATTER.', label: 'TYPE / COLOR / COMPOSITION', posterNote: 'Good ideas deserve a bold first impression.', output: 'Generated CSS'},
  de: {title: 'Mach etwas Eindruck.', intro: 'Deine Worte. Dein Rhythmus. Ein Studio für Art Direction.', text: 'Überschrift', theme: 'Farbpalette', scale: 'Schriftgröße', tracking: 'Zeichenabstand', weight: 'Schriftstärke', layout: 'Komposition', poster: 'Poster', grid: 'Raster', reset: 'Zurücksetzen', copy: 'CSS kopieren', copied: 'CSS kopiert', fallback: 'Kopieren ist hier nicht möglich. Wähle das CSS unten aus.', preview: 'Live-Poster-Vorschau', defaultText: 'IDEEN\nWERDEN\nWIRKLICH.', label: 'TYPO / FARBE / KOMPOSITION', posterNote: 'Gute Ideen verdienen einen starken ersten Eindruck.', output: 'Generiertes CSS'}
};

export default function TypeStudio({locale, reducedMotion}) {
  const t = copy[locale] || copy.en;
  const uid = useId();
  const [text, setText] = useState(t.defaultText);
  const [themeIndex, setThemeIndex] = useState(0);
  const [scale, setScale] = useState(76);
  const [tracking, setTracking] = useState(-4);
  const [weight, setWeight] = useState(800);
  const [layout, setLayout] = useState('poster');
  const [copyStatus, setCopyStatus] = useState('');
  const resetTimer = useRef(null);
  const theme = themes[themeIndex];
  useEffect(() => () => clearTimeout(resetTimer.current), []);
  const css = `.poster-frame {\n  container-type: inline-size;\n  background: ${theme.bg};\n  color: ${theme.ink};\n}\n\n.poster-headline {\n  font-family: var(--font-body), Arial, Helvetica, sans-serif;\n  font-size: clamp(2rem, ${scale / 5}cqi, ${scale / 16}rem);\n  font-weight: ${weight};\n  letter-spacing: ${tracking / 100}em;\n  line-height: 0.98;\n  white-space: pre-wrap;\n  overflow-wrap: anywhere;\n}`;
  async function copyCss() {
    clearTimeout(resetTimer.current);
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(css);
      setCopyStatus('copied');
      resetTimer.current = setTimeout(() => setCopyStatus(''), 2200);
    } catch {setCopyStatus('fallback');}
  }
  function reset() {
    setText(t.defaultText); setThemeIndex(0); setScale(76); setTracking(-4); setWeight(800); setLayout('poster'); setCopyStatus('');
  }

  return <section className={styles.frontendDemo}>
    <div className={styles.studioIntro}><span className={styles.studioKicker}>{locale === 'de' ? 'TYPO-ATELIER' : 'TYPE ATELIER'}</span><h3>{t.title}</h3><p>{t.intro}</p></div>
    <div className={styles.typeWorkspace}>
      <div className={styles.typePoster} data-layout={layout} aria-label={t.preview} style={{'--poster-bg': theme.bg, '--poster-ink': theme.ink, '--poster-accent': theme.accent, '--poster-size': `${scale / 16}rem`, '--poster-fluid': `${scale / 5}cqi`, '--poster-tracking': `${tracking / 100}em`, '--poster-weight': weight, transitionDuration: reducedMotion ? '0s' : undefined}}>
        <div className={styles.posterHeader}><span>AM / STUDIO</span><svg viewBox="0 0 34 34" aria-hidden="true"><path d="M17 0V34M0 17H34M5 5L29 29M5 29L29 5"/></svg></div>
        <div className={styles.posterBody}><p className={styles.posterHeadline}>{text || ' '}</p><div className={styles.posterEmblem} aria-hidden="true"><i/><i/><i/><i/></div></div>
        <div className={styles.posterFooter}><span>{t.label}</span><p>{t.posterNote}</p></div>
      </div>
      <div className={styles.typeControls}>
        <label className={styles.textLabel} htmlFor={`${uid}-text`}>{t.text}<textarea id={`${uid}-text`} value={text} maxLength={80} rows={3} onChange={event => setText(event.target.value)}/></label>
        <fieldset className={styles.themeField}><legend>{t.theme}</legend><div>{themes.map((item, index) => <button type="button" key={item.name} aria-pressed={index === themeIndex} aria-label={item.name} title={item.name} onClick={() => setThemeIndex(index)} style={{background: item.bg, color: item.ink}}><span>Aa</span>{index === themeIndex && <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3 8 3 3 7-7"/></svg>}</button>)}</div></fieldset>
        <label className={styles.sliderLabel} htmlFor={`${uid}-scale`}><span>{t.scale}<output>{scale}px</output></span><input id={`${uid}-scale`} type="range" min="40" max="112" step="2" value={scale} onChange={event => setScale(Number(event.target.value))}/></label>
        <label className={styles.sliderLabel} htmlFor={`${uid}-tracking`}><span>{t.tracking}<output>{tracking / 100}em</output></span><input id={`${uid}-tracking`} type="range" min="-8" max="12" value={tracking} onChange={event => setTracking(Number(event.target.value))}/></label>
        <label className={styles.sliderLabel} htmlFor={`${uid}-weight`}><span>{t.weight}<output>{weight}</output></span><input id={`${uid}-weight`} type="range" min="300" max="900" step="100" value={weight} onChange={event => setWeight(Number(event.target.value))}/></label>
        <div className={styles.layoutChoice} role="group" aria-label={t.layout}>{['poster', 'grid'].map(item => <button type="button" key={item} aria-pressed={layout === item} onClick={() => setLayout(item)}>{t[item]}</button>)}</div>
        <div className={styles.springActions}><button className={styles.primaryButton} type="button" onClick={copyCss}>{copyStatus === 'copied' ? t.copied : t.copy}</button><button className={styles.secondaryButton} type="button" onClick={reset}>{t.reset}</button></div>
        <span className={styles.copyFeedback} role="status">{copyStatus === 'copied' ? t.copied : copyStatus === 'fallback' ? t.fallback : ''}</span>
      </div>
    </div>
    {copyStatus === 'fallback' && <label className={styles.cssFallback}>{t.output}<textarea readOnly value={css} rows={11} onFocus={event => event.target.select()}/></label>}
  </section>;
}
