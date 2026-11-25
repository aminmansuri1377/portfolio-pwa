import {useId, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import styles from '../../../styles/lab-frontend.module.css';

const words = {
  en: {
    eyebrow: 'FIELD — AN EDITORIAL EXPERIMENT', project: 'Select an art direction',
    previous: 'Previous project', next: 'Next project', keyboard: 'Use the left and right keys to explore.',
    caption: 'Original vector artwork · Responsive art direction',
    slides: [
      {name: 'Soft signal', category: 'OBJECT STUDY', title: 'A softer kind\nof signal.', copy: 'A study in balance, warm surfaces and the space between things.', type: 'Objects / Form / Color'},
      {name: 'Quiet architecture', category: 'SPATIAL STUDY', title: 'Space to\nthink differently.', copy: 'Monolithic forms. Long shadows. A little room for the unexpected.', type: 'Space / Light / Rhythm'},
      {name: 'In good orbit', category: 'SYSTEM STUDY', title: 'Everything\nis connected.', copy: 'A graphic system built from repetition, contrast and circular thinking.', type: 'Systems / Type / Motion'}
    ]
  },
  de: {
    eyebrow: 'FIELD — EIN EDITORIALES EXPERIMENT', project: 'Gestaltung auswählen',
    previous: 'Vorheriges Projekt', next: 'Nächstes Projekt', keyboard: 'Mit den Pfeiltasten links und rechts entdecken.',
    caption: 'Originale Vektorgrafik · Responsives Art-Direction-Konzept',
    slides: [
      {name: 'Sanftes Signal', category: 'OBJEKTSTUDIE', title: 'Ein sanfteres\nSignal.', copy: 'Eine Studie über Balance, warme Oberflächen und den Raum dazwischen.', type: 'Objekte / Form / Farbe'},
      {name: 'Stille Architektur', category: 'RAUMSTUDIE', title: 'Raum für\nneue Gedanken.', copy: 'Monolithische Formen. Lange Schatten. Platz für das Unerwartete.', type: 'Raum / Licht / Rhythmus'},
      {name: 'Im Orbit', category: 'SYSTEMSTUDIE', title: 'Alles ist\nverbunden.', copy: 'Ein grafisches System aus Wiederholung, Kontrast und kreisenden Ideen.', type: 'Systeme / Typo / Bewegung'}
    ]
  }
};

function Sculpture({prefix}) {
  return <svg viewBox="0 0 600 520" aria-hidden="true" className={styles.artSvg}>
    <defs>
      <linearGradient id={`${prefix}-clay`} x1="0" x2="1" y1="0" y2=".5"><stop stopColor="#ffbda6"/><stop offset=".43" stopColor="#e66743"/><stop offset="1" stopColor="#822c23"/></linearGradient>
      <linearGradient id={`${prefix}-metal`} x1=".18" x2=".87" y1="0" y2="1"><stop stopColor="#ffffff"/><stop offset=".24" stopColor="#e9dcd1"/><stop offset=".45" stopColor="#9a827a"/><stop offset=".52" stopColor="#f7e7dc"/><stop offset="1" stopColor="#3f3435"/></linearGradient>
      <radialGradient id={`${prefix}-shadow`}><stop stopColor="#7b3626" stopOpacity=".25"/><stop offset="1" stopColor="#7b3626" stopOpacity="0"/></radialGradient>
      <linearGradient id={`${prefix}-blue`} x1="0" x2="1"><stop stopColor="#567fc7"/><stop offset=".5" stopColor="#2456a5"/><stop offset="1" stopColor="#122e60"/></linearGradient>
    </defs>
    <circle cx="350" cy="232" r="195" fill="#f5cbb4"/>
    <path d="M22 406H580" stroke="#c78b74" strokeOpacity=".4"/>
    <ellipse cx="326" cy="435" rx="212" ry="41" fill={`url(#${prefix}-shadow)`}/>
    <path d="M194 338H380V385Q380 419 287 419Q194 419 194 385Z" fill={`url(#${prefix}-clay)`}/>
    <ellipse cx="287" cy="339" rx="93" ry="34" fill="#ffb092"/>
    <path d="M210 266H369V325Q369 355 289 355Q210 355 210 325Z" fill={`url(#${prefix}-clay)`}/>
    <ellipse cx="289" cy="266" rx="80" ry="31" fill="#fbae94"/>
    <path d="M178 212H397V257Q397 296 287 296Q178 296 178 257Z" fill={`url(#${prefix}-clay)`}/>
    <ellipse cx="287" cy="212" rx="110" ry="40" fill="#ffbea2"/>
    <ellipse cx="287" cy="212" rx="57" ry="20" fill="#b8543c"/>
    <ellipse cx="286" cy="219" rx="50" ry="14" fill="#9f4330"/>
    <circle cx="293" cy="146" r="64" fill={`url(#${prefix}-metal)`}/>
    <ellipse cx="272" cy="112" rx="26" ry="12" fill="#fff7ec" opacity=".65" transform="rotate(-30 272 112)"/>
    <g transform="translate(389 315) rotate(18)"><rect width="68" height="113" rx="33" fill={`url(#${prefix}-blue)`}/><ellipse cx="34" cy="17" rx="32" ry="15" fill="#7695ce"/></g>
    <circle cx="132" cy="298" r="9" fill="#284e8a"/>
    <path d="M115 106H174M144 77V135" stroke="#9c5b44" strokeWidth="1"/>
    <text x="463" y="130" fill="#b7775d" fontSize="14" fontFamily="monospace" transform="rotate(90 463 130)">FORM / FEELING</text>
  </svg>;
}

function Architecture({prefix}) {
  return <svg viewBox="0 0 600 520" aria-hidden="true" className={styles.artSvg}>
    <defs>
      <linearGradient id={`${prefix}-stone`} x1="0" x2="1"><stop stopColor="#d8dfed"/><stop offset="1" stopColor="#8197b8"/></linearGradient>
      <linearGradient id={`${prefix}-portal`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#202d4d"/><stop offset="1" stopColor="#587da8"/></linearGradient>
      <linearGradient id={`${prefix}-floor`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#9fbbd2"/><stop offset="1" stopColor="#b7ccd9"/></linearGradient>
    </defs>
    <circle cx="375" cy="151" r="91" fill="#f8df86"/>
    <path d="M0 355L600 319V520H0Z" fill={`url(#${prefix}-floor)`}/>
    <path d="M163 387L387 401L533 488H283Z" fill="#6a8199" opacity=".4"/>
    <path d="M170 133L350 106L403 139V398L350 416L170 386Z" fill={`url(#${prefix}-stone)`}/>
    <path d="M350 106L403 139V398L350 416Z" fill="#637e9e"/>
    <path d="M207 378V240C207 177 313 161 313 229V396Z" fill={`url(#${prefix}-portal)`}/>
    <path d="M207 378L258 353L313 369V396Z" fill="#bdcdde"/>
    <path d="M207 240C207 177 313 161 313 229" fill="none" stroke="#eef0ef" strokeWidth="3"/>
    <g fill="#d3deea" stroke="#8c9eb2" strokeWidth="1">
      <path d="M207 378L313 396V409L199 391Z"/><path d="M199 391L313 409V422L188 403Z"/><path d="M188 403L313 422V435L176 416Z"/><path d="M176 416L313 435V448L163 429Z"/>
    </g>
    <path d="M73 306L131 292L131 386L73 401Z" fill="#abc1d6"/><path d="M73 306L111 326L169 312L131 292Z" fill="#e0e7ed"/><path d="M111 326L169 312V406L111 421Z" fill="#8da9c3"/>
    <circle cx="449" cy="345" r="30" fill="#e97750"/>
    <path d="M432 371L490 392L523 390L463 369Z" fill="#718da6" opacity=".55"/>
    <path d="M486 130V222M470 146H502" stroke="#476583" strokeOpacity=".6"/>
    <text x="52" y="94" fill="#607d9b" fontSize="14" fontFamily="monospace">SPACE / STILLNESS</text>
  </svg>;
}

function OrbitArtwork() {
  return <svg viewBox="0 0 600 520" aria-hidden="true" className={styles.artSvg}>
    <circle cx="300" cy="260" r="191" fill="#d8ed85"/>
    <g fill="none" stroke="#173a33" strokeWidth="1.5">
      {[0, 30, 60, 90, 120, 150].map(angle => <ellipse key={angle} cx="300" cy="260" rx="185" ry="68" transform={`rotate(${angle} 300 260)`}/>)}
      <circle cx="300" cy="260" r="186"/>
    </g>
    <circle cx="300" cy="260" r="65" fill="#173a33"/>
    <circle cx="305" cy="252" r="22" fill="#e2efbb"/>
    <circle cx="436" cy="133" r="26" fill="#eb784f"/>
    <circle cx="138" cy="354" r="16" fill="#173a33"/>
    <path d="M52 75H104M78 49V101M489 434H541M515 408V460" stroke="#a3ba79"/>
    <text x="80" y="468" fill="#a7c08c" fontSize="14" fontFamily="monospace">FORM FOLLOWS CONNECTION</text>
  </svg>;
}

export default function EditorialGallery({locale, reducedMotion}) {
  const t = words[locale] || words.en;
  const [active, setActive] = useState(0);
  const uid = useId().replace(/:/g, '');
  const slide = t.slides[active];
  const step = direction => setActive(value => (value + direction + 3) % 3);
  return <section className={styles.frontendDemo} aria-label={locale === 'de' ? 'Editoriale Galerie' : 'Editorial gallery'}>
    <div className={styles.galleryTop}><span>{t.eyebrow}</span><span className={styles.fieldMark}>field<span>®</span></span></div>
    <div className={styles.galleryTabs} role="group" aria-label={t.project}>
      {t.slides.map((item, i) => <button type="button" key={item.name} aria-pressed={i === active} onClick={() => setActive(i)}>{item.name}</button>)}
    </div>
    <div className={styles.galleryStage} data-scene={active} role="group" tabIndex={0} aria-label={t.keyboard} onKeyDown={event => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === 'ArrowRight') {event.preventDefault(); step(1);}
      if (event.key === 'ArrowLeft') {event.preventDefault(); step(-1);}
    }}>
      <AnimatePresence key={reducedMotion ? 'still' : 'animated'} mode="wait" initial={false}>
        <motion.div className={styles.galleryScene} key={active} initial={{opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 12}} animate={{opacity: 1, y: 0}} exit={{opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : -8}} transition={{duration: reducedMotion ? 0 : .24}}>
          <div className={styles.galleryCopy}><span className={styles.galleryCategory}>{slide.category}</span><h3>{slide.title}</h3><p>{slide.copy}</p><span className={styles.galleryType}>{slide.type}</span></div>
          <div className={styles.galleryArt}>{active === 0 ? <Sculpture prefix={uid}/> : active === 1 ? <Architecture prefix={uid}/> : <OrbitArtwork/>}</div>
        </motion.div>
      </AnimatePresence>
      <div className={styles.galleryFooter}><span aria-live="polite">{slide.name}</span><div><button type="button" onClick={() => step(-1)} aria-label={t.previous}><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m12 5-5 5 5 5"/></svg></button><button type="button" onClick={() => step(1)} aria-label={t.next}><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m8 5 5 5-5 5"/></svg></button></div></div>
    </div>
    <p className={styles.demoFootnote}>{t.caption}</p>
  </section>;
}
