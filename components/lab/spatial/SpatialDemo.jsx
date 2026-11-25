import { useState } from 'react';
import { FiBox, FiPause, FiPlay, FiRotateCcw, FiSliders } from 'react-icons/fi';
import Scene from './Scene';
import styles from '../../../styles/lab-spatial.module.css';

const PALETTE = [
  { hex: '#bfff3c', en: 'Acid', de: 'Acid' },
  { hex: '#ad9bff', en: 'Iris', de: 'Iris' },
  { hex: '#ff997d', en: 'Coral', de: 'Koralle' },
  { hex: '#c8d2dc', en: 'Titanium', de: 'Titan' },
];
const COPY = {
  en: {
    aura: { name: 'AURA', subtitle: 'Sound, in a different form.', descriptor: 'STUDIO HEADPHONES', control: 'Make it yours.', hint: 'Drag to rotate the product', detail: 'A procedural product model. Explore the finish, construction and every angle.' },
    flux: { name: 'FLUX', subtitle: 'A study in constant change.', descriptor: 'GENERATIVE SCULPTURE', control: 'Shape the unexpected.', hint: 'Drag to explore the sculpture', detail: 'Change the geometry, deformation and material of a living digital sculpture.' },
    orbit: { name: 'ORBIT', subtitle: 'A universe at your fingertips.', descriptor: 'PARTICLE SYSTEM', control: 'Set your own orbit.', hint: 'Drag to orbit the galaxy', detail: 'Thousands of individually colored particles, arranged in a spiral you control.' },
    finish: 'Colorway', deformation: 'Deformation', spiral: 'Spiral tension', shape: 'Geometry', sphere: 'Sphere', knot: 'Knot', arms: 'Spiral arms', three: 'Three', five: 'Five', exploded: 'Exploded view', wireframe: 'Wireframe', pause: 'Pause motion', play: 'Play motion', reset: 'Reset view', reduced: 'Motion reduced by your device settings.', angle: 'View angle', studio: 'INTERACTIVE STUDIO',
  },
  de: {
    aura: { name: 'AURA', subtitle: 'Klang in einer anderen Form.', descriptor: 'STUDIO-KOPFHÖRER', control: 'Dein eigener Look.', hint: 'Ziehen, um das Produkt zu drehen', detail: 'Ein prozedurales Produktmodell. Oberfläche, Konstruktion und jeden Blickwinkel entdecken.' },
    flux: { name: 'FLUX', subtitle: 'Eine Studie des Wandels.', descriptor: 'GENERATIVE SKULPTUR', control: 'Das Unerwartete formen.', hint: 'Ziehen, um die Skulptur zu erkunden', detail: 'Geometrie, Verformung und Material einer lebendigen digitalen Skulptur verändern.' },
    orbit: { name: 'ORBIT', subtitle: 'Ein Universum zum Anfassen.', descriptor: 'PARTIKELSYSTEM', control: 'Deine eigene Umlaufbahn.', hint: 'Ziehen, um die Galaxie zu drehen', detail: 'Tausende individuell eingefärbte Partikel bilden eine steuerbare Spiralgalaxie.' },
    finish: 'Farbwelt', deformation: 'Verformung', spiral: 'Spiralspannung', shape: 'Geometrie', sphere: 'Kugel', knot: 'Knoten', arms: 'Spiralarme', three: 'Drei', five: 'Fünf', exploded: 'Explosionsansicht', wireframe: 'Drahtgitter', pause: 'Bewegung pausieren', play: 'Bewegung starten', reset: 'Ansicht zurücksetzen', reduced: 'Bewegung gemäß Geräteeinstellung reduziert.', angle: 'Blickwinkel', studio: 'INTERAKTIVES STUDIO',
  },
};

export default function SpatialDemo({ id = 'aura', locale = 'en', reducedMotion = false }) {
  const lang = locale === 'de' ? 'de' : 'en';
  const t = COPY[lang];
  const copy = t[id] || t.aura;
  const [color, setColor] = useState(PALETTE[0].hex);
  const [intensity, setIntensity] = useState(0.45);
  const [variant, setVariant] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [exploded, setExploded] = useState(false);
  const [wireframe, setWireframe] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [viewAngle, setViewAngle] = useState(0);
  const [hasWebGL, setHasWebGL] = useState(null);
  const reset = () => {
    setColor(PALETTE[0].hex); setIntensity(0.45); setVariant(0);
    setAutoRotate(true); setExploded(false); setWireframe(false);
    setResetKey((key) => key + 1);
    setViewAngle(0);
  };
  return (
    <section className={styles.demo} style={{ '--spatial-accent': color }} aria-label={`${copy.name} — ${copy.descriptor}`}>
      <div className={`${styles.stage} ${id === 'orbit' ? styles.galaxyStage : ''}`}>
        <div className={styles.stageHeading}><span>{copy.descriptor}</span><h3>{copy.name}<span>®</span></h3><p>{copy.subtitle}</p></div>
        <div className={styles.stageFloor} aria-hidden="true" />
        <div className={styles.canvasSlot}>
          <Scene mode={id} color={color} intensity={intensity} variant={variant} autoRotate={autoRotate} exploded={exploded} wireframe={wireframe} reducedMotion={reducedMotion} locale={lang} resetKey={resetKey} viewAngle={viewAngle} onSupportChange={setHasWebGL} />
        </div>
        <div className={styles.stageFooter}><FiBox aria-hidden="true" /><span>{copy.hint}</span><span className={styles.materialName}>{PALETTE.find((item) => item.hex === color)?.[lang]}</span></div>
      </div>
      <aside className={styles.controls}>
        <span className={styles.controlKicker}><FiSliders aria-hidden="true" />{t.studio}</span>
        <h4>{copy.control}</h4>
        <p className={styles.controlDescription}>{copy.detail}</p>
        <fieldset className={styles.fieldset}>
          <legend>{t.finish}</legend>
          <div className={styles.swatches}>
            {PALETTE.map((item) => <button type="button" key={item.hex} aria-label={item[lang]} aria-pressed={color === item.hex} title={item[lang]} className={styles.swatch} style={{ '--swatch': item.hex }} onClick={() => setColor(item.hex)}><span /></button>)}
          </div>
        </fieldset>
        {id !== 'aura' && <fieldset className={styles.fieldset}>
          <legend>{id === 'orbit' ? t.arms : t.shape}</legend>
          <div className={styles.segmented}>
            {[0, 1].map((value) => <button key={value} type="button" aria-pressed={variant === value} onClick={() => setVariant(value)}>{id === 'orbit' ? (value ? t.five : t.three) : (value ? t.knot : t.sphere)}</button>)}
          </div>
        </fieldset>}
        {id !== 'aura' && <label className={styles.sliderLabel}>
          <span>{id === 'orbit' ? t.spiral : t.deformation}<output>{Math.round(intensity * 100)}%</output></span>
          <input type="range" min="0" max="1" step="0.01" value={intensity} onChange={(event) => setIntensity(Number(event.target.value))} />
        </label>}
        {id === 'aura' && <button type="button" className={styles.toggle} aria-pressed={exploded} onClick={() => setExploded((value) => !value)}><span>{t.exploded}</span><span className={styles.toggleTrack} aria-hidden="true"><i /></span></button>}
        {id !== 'orbit' && <button type="button" className={styles.toggle} aria-pressed={wireframe} disabled={!hasWebGL} onClick={() => setWireframe((value) => !value)}><span>{t.wireframe}</span><span className={styles.toggleTrack} aria-hidden="true"><i /></span></button>}
        <label className={styles.sliderLabel}><span>{t.angle}<output>{viewAngle}°</output></span><input type="range" min="-180" max="180" step="5" value={viewAngle} onChange={(event) => { setViewAngle(Number(event.target.value)); setAutoRotate(false); }} /></label>
        <div className={styles.controlActions}>
          <button type="button" onClick={() => setAutoRotate((value) => !value)} aria-pressed={!autoRotate} disabled={reducedMotion || !hasWebGL}>{autoRotate ? <FiPause aria-hidden="true" /> : <FiPlay aria-hidden="true" />}{autoRotate ? t.pause : t.play}</button>
          <button type="button" onClick={reset}><FiRotateCcw aria-hidden="true" />{t.reset}</button>
        </div>
        {reducedMotion && <p className={styles.motionNote}>{t.reduced}</p>}
      </aside>
    </section>
  );
}
