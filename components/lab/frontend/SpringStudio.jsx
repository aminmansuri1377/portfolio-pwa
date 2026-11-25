import {useEffect, useId, useRef, useState} from 'react';
import {motion, useAnimationControls} from 'framer-motion';
import styles from '../../../styles/lab-frontend.module.css';

const copy = {
  en: {title: 'Motion, with feeling.', intro: 'Drag the object. Let it go. Find your perfect spring.', stiffness: 'Stiffness', damping: 'Damping', soft: 'Soft', precise: 'Precise', playful: 'Playful', drag: 'Drag me', dragKeys: 'Spring object. Arrow keys move it, Home centers it, Enter plays the spring.', stage: 'Spring canvas. Drag the object or use the direction controls below.', reset: 'Reset', play: 'Auto play', pause: 'Pause', left: 'Left', right: 'Right', up: 'Up', down: 'Down', nudge: 'Move the object', reduced: 'Reduced motion is enabled. Controls update without animation.', note: 'A little tension. A little freedom.', feel: 'SPRING STUDIO', presets: 'Spring presets'},
  de: {title: 'Bewegung mit Gefühl.', intro: 'Zieh das Objekt. Lass es los. Finde die perfekte Feder.', stiffness: 'Federstärke', damping: 'Dämpfung', soft: 'Sanft', precise: 'Präzise', playful: 'Verspielt', drag: 'Zieh mich', dragKeys: 'Federobjekt. Pfeiltasten bewegen es, Pos1 zentriert es, Eingabe startet die Feder.', stage: 'Feder-Canvas. Ziehe das Objekt oder nutze die Richtungstasten darunter.', reset: 'Zurücksetzen', play: 'Automatisch', pause: 'Pause', left: 'Links', right: 'Rechts', up: 'Oben', down: 'Unten', nudge: 'Objekt bewegen', reduced: 'Reduzierte Bewegung ist aktiv. Die Steuerung reagiert ohne Animation.', note: 'Etwas Spannung. Etwas Freiheit.', feel: 'FEDER-STUDIO', presets: 'Feder-Vorlagen'}
};
const presets = {soft: [100, 16], precise: [300, 32], playful: [210, 8]};

export default function SpringStudio({locale, reducedMotion}) {
  const t = copy[locale] || copy.en;
  const uid = useId();
  const stageRef = useRef(null);
  const returnTimer = useRef(null);
  const drag = useRef(null);
  const [position, setPosition] = useState({x: 0, y: 0});
  const [stiffness, setStiffness] = useState(210);
  const [damping, setDamping] = useState(8);
  const [playing, setPlaying] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [bounds, setBounds] = useState({x: 120, y: 100});
  const animation = useAnimationControls();

  useEffect(() => {
    const next = {x: position.x, y: position.y, rotate: reducedMotion ? 0 : position.x / 12, scale: dragging && !reducedMotion ? 1.04 : 1};
    animation.stop();
    if (reducedMotion) animation.set(next);
    else animation.start({...next, transition: {type: 'spring', stiffness, damping, mass: 1}});
    return () => animation.stop();
  }, [animation, position, reducedMotion, dragging, stiffness, damping]);

  useEffect(() => {
    const element = stageRef.current;
    if (!element) return;
    const resize = () => {
      const next = {x: Math.max(0, element.clientWidth / 2 - 94), y: Math.max(0, element.clientHeight / 2 - 94)};
      setBounds(next);
      setPosition(value => ({x: Math.max(-next.x, Math.min(next.x, value.x)), y: Math.max(-next.y, Math.min(next.y, value.y))}));
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => clearTimeout(returnTimer.current), []);
  useEffect(() => {
    if (reducedMotion) {
      clearTimeout(returnTimer.current);
      setPlaying(false);
      drag.current = null;
      setDragging(false);
    }
  }, [reducedMotion]);
  useEffect(() => {
    if (!playing || reducedMotion) return;
    let step = 0;
    const positions = [[-.8, -.5], [.8, .6], [-.5, .8], [.6, -.7], [0, 0]];
    const update = () => {
      if (document.hidden) return;
      const [x, y] = positions[step++ % positions.length];
      setPosition({x: x * bounds.x, y: y * bounds.y});
    };
    update();
    const interval = setInterval(update, 1600);
    return () => clearInterval(interval);
  }, [playing, reducedMotion, bounds]);

  function nudge(x, y) {
    setPlaying(false);
    clearTimeout(returnTimer.current);
    setPosition({x: x * bounds.x * .85, y: y * bounds.y * .85});
    if (!reducedMotion) returnTimer.current = setTimeout(() => setPosition({x: 0, y: 0}), 650);
  }
  function reset() {
    clearTimeout(returnTimer.current);
    setPlaying(false);
    setPosition({x: 0, y: 0});
    setStiffness(210);
    setDamping(8);
  }
  function beginDrag(event) {
    if (event.button !== 0 || !event.isPrimary || drag.current) return;
    setPlaying(false);
    clearTimeout(returnTimer.current);
    const rect = event.currentTarget.getBoundingClientRect();
    drag.current = {id: event.pointerId, x: event.clientX - rect.left - rect.width / 2, y: event.clientY - rect.top - rect.height / 2};
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  }
  function moveDrag(event) {
    if (!drag.current || drag.current.id !== event.pointerId || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    setPosition({
      x: Math.max(-bounds.x, Math.min(bounds.x, event.clientX - rect.left - rect.width / 2 - drag.current.x)),
      y: Math.max(-bounds.y, Math.min(bounds.y, event.clientY - rect.top - rect.height / 2 - drag.current.y))
    });
  }
  function finishDrag(event) {
    if (!drag.current || drag.current.id !== event.pointerId) return;
    drag.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (!reducedMotion) setPosition({x: 0, y: 0});
  }
  function handleKeys(event) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const directions = {ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1]};
    if (directions[event.key]) {event.preventDefault(); nudge(...directions[event.key]);}
    else if (event.key === 'Home') {event.preventDefault(); setPlaying(false); clearTimeout(returnTimer.current); setPosition({x: 0, y: 0});}
    else if (event.key === 'Enter' || event.key === ' ') {event.preventDefault(); nudge(1, -.4);}
  }

  return <section className={styles.frontendDemo}>
    <div className={styles.studioIntro}><span className={styles.studioKicker}>{t.feel}</span><h3>{t.title}</h3><p>{t.intro}</p></div>
    <div className={styles.springWorkspace}>
      <div className={styles.springStage} ref={stageRef} role="group" aria-label={t.stage}>
        <div className={styles.springGrid} aria-hidden="true"/>
        <div className={styles.springCrosshair} aria-hidden="true"/>
        <span className={styles.springCoordinates} aria-hidden="true">x {Math.round(position.x)} / y {Math.round(position.y)}</span>
        <span className={styles.springStageTag}>{locale === 'de' ? 'BEWEGUNG / LAB' : 'MOTION / LAB'}</span>
        <motion.div initial={false} className={styles.springObject} role="button" tabIndex={0} aria-label={t.dragKeys} onKeyDown={handleKeys} animate={animation} onPointerDown={beginDrag} onPointerMove={moveDrag} onPointerUp={finishDrag} onPointerCancel={finishDrag} onLostPointerCapture={finishDrag}>
          <div className={styles.springObjectInner}><svg viewBox="0 0 80 80" aria-hidden="true"><path d="M40 8V72M8 40H72M17.4 17.4L62.6 62.6M17.4 62.6L62.6 17.4"/></svg><span>{t.drag}</span></div>
        </motion.div>
        <div className={styles.springStageNote}>{t.note}</div>
      </div>
      <div className={styles.springControls}>
        <div className={styles.presetButtons} role="group" aria-label={t.presets}>{Object.entries(presets).map(([key, value]) => <button type="button" key={key} aria-pressed={stiffness === value[0] && damping === value[1]} onClick={() => {setStiffness(value[0]); setDamping(value[1]); nudge(1, -.4);}}>{t[key]}</button>)}</div>
        <label className={styles.sliderLabel} htmlFor={`${uid}-stiffness`}><span>{t.stiffness}<output>{stiffness}</output></span><input id={`${uid}-stiffness`} type="range" min="60" max="420" step="10" value={stiffness} onChange={event => setStiffness(Number(event.target.value))}/></label>
        <label className={styles.sliderLabel} htmlFor={`${uid}-damping`}><span>{t.damping}<output>{damping}</output></span><input id={`${uid}-damping`} type="range" min="6" max="40" value={damping} onChange={event => setDamping(Number(event.target.value))}/></label>
        <div className={styles.springNudges} role="group" aria-label={t.nudge}><button type="button" onClick={() => nudge(-1, 0)}>{t.left}</button><button type="button" onClick={() => nudge(0, -1)}>{t.up}</button><button type="button" onClick={() => nudge(0, 1)}>{t.down}</button><button type="button" onClick={() => nudge(1, 0)}>{t.right}</button></div>
        <div className={styles.springActions}><button className={styles.primaryButton} type="button" disabled={reducedMotion} aria-pressed={playing} onClick={() => {clearTimeout(returnTimer.current); if (playing) animation.stop(); setPlaying(value => !value);}}>{playing ? t.pause : t.play}</button><button className={styles.secondaryButton} type="button" onClick={reset}>{t.reset}</button></div>
        <div className={styles.springFormula} aria-hidden="true"><span>F = −kx − cv</span><small>{t.stiffness} {stiffness} · {t.damping} {damping}</small></div>
      </div>
    </div>
    {reducedMotion && <p className={styles.demoFootnote}>{t.reduced}</p>}
  </section>;
}
