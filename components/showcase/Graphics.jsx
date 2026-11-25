import { Component, createContext, useContext, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MathUtils, Vector3 } from 'three';
import { useShowcaseMotion } from './Runtime';
import Thumb from './Thumbs';
import s from './showcase.module.css';

const Failure = createContext(() => {});

export function TunnelPoster() {
  return <svg className={s.tunnelPoster} viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    {Array.from({ length: 30 }, (_, i) => {
      const radius = 43 + Math.pow(i / 29, 1.8) * 700;
      const hex = Array.from({ length: 6 }, (_, j) => { const a = j * Math.PI / 3; return `${Math.cos(a) * radius},${Math.sin(a) * radius}`; }).join(' ');
      return <g key={i} transform={`translate(600 390) rotate(${i * 12.6})`} opacity={.15 + i / 45} fill="none" stroke={i % 3 === 0 ? '#bfff3c' : '#8b7cff'} strokeWidth="1.35">
        {i % 2 ? <polygon points={hex} /> : <circle r={radius} />}
      </g>;
    })}
  </svg>;
}

function GraphicsFallback({ id, locale, retry, decorative, pending }) {
  const en = locale === 'en';
  if (decorative) return <TunnelPoster />;
  return <div className={s.graphicsFallback}>
    <div className={s.fallbackArt} aria-hidden="true"><Thumb id={id} accent="#bfff3c" /></div>
    <div className={s.fallbackMessage} role="status">
      <p>{pending ? (en ? 'Preparing the scene…' : 'Die Szene wird vorbereitet…') : en ? 'A preview of this 3D experiment' : 'Eine Vorschau dieses 3D-Experiments'}</p>
      {!pending && <span>{en ? 'WebGL 2 is unavailable in this browser. Try a browser with hardware acceleration to explore the live scene.' : 'WebGL 2 ist in diesem Browser nicht verfügbar. Mit Hardwarebeschleunigung lässt sich die Szene interaktiv erkunden.'}</span>}
      {!pending && <button type="button" onClick={retry}>{en ? 'Try 3D again' : '3D erneut versuchen'}</button>}
    </div>
  </div>;
}

class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

// Probe before mounting the renderer. The gallery stays usable without WebGL.
export function GraphicsGuard({ children, id, locale = 'en', decorative = false }) {
  const [supported, setSupported] = useState(null);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const probe = document.createElement('canvas');
    probe.width = probe.height = 1;
    let gl;
    try { gl = probe.getContext('webgl2', { alpha: true, antialias: false, powerPreference: 'low-power' }); setSupported(Boolean(gl)); }
    catch { setSupported(false); }
    finally { gl?.getExtension('WEBGL_lose_context')?.loseContext(); }
  }, [attempt]);
  const retry = () => { setSupported(null); setAttempt(value => value + 1); };
  if (!supported) return <GraphicsFallback id={id} locale={locale} decorative={decorative} pending={supported === null} retry={retry} />;
  return <Failure.Provider value={() => setSupported(false)}><SceneBoundary key={attempt} onFailure={() => setSupported(false)}>{children}</SceneBoundary></Failure.Provider>;
}

function CanvasLifecycle({ pointerTarget }) {
  const reportFailure = useContext(Failure);
  const state = useThree();
  useEffect(() => {
    const canvas = state.gl.domElement;
    const source = pointerTarget?.current || canvas;
    const lost = event => { event.preventDefault(); reportFailure(); };
    const move = event => {
      const rect = canvas.getBoundingClientRect();
      state.pointer.set((event.clientX - rect.left) / Math.max(1, rect.width) * 2 - 1, 1 - (event.clientY - rect.top) / Math.max(1, rect.height) * 2);
      state.invalidate();
    };
    const invalidate = () => state.invalidate();
    canvas.addEventListener('webglcontextlost', lost);
    source.addEventListener('pointermove', move, { passive: true });
    source.addEventListener('pointerdown', invalidate, { passive: true });
    return () => {
      canvas.removeEventListener('webglcontextlost', lost);
      source.removeEventListener('pointermove', move);
      source.removeEventListener('pointerdown', invalidate);
    };
  }, [state, reportFailure, pointerTarget]);
  return null;
}

export function ManagedCanvas({ children, pointerTarget, ...props }) {
  const { animate } = useShowcaseMotion();
  return <Canvas {...props} frameloop={animate ? 'always' : 'demand'}>
    <CanvasLifecycle pointerTarget={pointerTarget} />{children}
  </Canvas>;
}

// Keep elapsed time continuous across pause, hidden tabs and demand rendering.
export function useSceneFrame(callback) {
  const { animate } = useShowcaseMotion();
  const time = useRef(0);
  useFrame((state, rawDelta) => {
    const delta = animate ? Math.min(rawDelta, .05) : 0;
    time.current += delta;
    callback(state, delta, time.current, animate);
  });
}

export function FitScene({ radius, position = [0, 0, 6] }) {
  const { camera, size, invalidate } = useThree();
  const [x, y, z] = position;
  useEffect(() => {
    const halfY = MathUtils.degToRad(camera.fov / 2);
    const halfX = Math.atan(Math.tan(halfY) * size.width / Math.max(1, size.height));
    const distance = radius * 1.08 / Math.sin(Math.min(halfY, halfX));
    camera.position.copy(new Vector3(x, y, z).normalize().multiplyScalar(distance));
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, size.width, size.height, radius, x, y, z, invalidate]);
  return null;
}
