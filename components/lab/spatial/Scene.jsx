import { Component, Suspense, memo, useEffect, useId, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, OrbitControls } from '@react-three/drei';
import { AdditiveBlending, Color, MathUtils } from 'three';
import styles from '../../../styles/lab-spatial.module.css';

/** Every surface, light and particle in this scene is generated locally. */
class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError?.(); }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

function Poster({ mode, color, failed, onRetry, locale, exploded = false, variant = 0, intensity = 0.45, viewAngle = 0 }) {
  const uid = useId().replace(/:/g, '');
  const blob = Array.from({ length: 96 }, (_, i) => {
    const angle = i / 96 * Math.PI * 2;
    const radius = 145 + intensity * 32 * (Math.sin(angle * 3) + Math.cos(angle * 5) * 0.4);
    return `${i ? 'L' : 'M'}${250 + Math.cos(angle) * radius},${250 + Math.sin(angle) * radius}`;
  }).join(' ') + 'Z';
  return (
    <div className={`${styles.poster} ${styles[`poster_${mode}`] || ''}`} style={{ '--spatial-accent': color }}>
      {mode === 'aura' ? (
        <div className={styles.posterHeadphones} aria-hidden="true" style={{ '--cup-offset': exploded ? '30px' : '0px', '--pose': `${viewAngle * 0.15 - 14}deg` }}>
          <div className={styles.headband} /><div className={styles.headbandInner} />
          <div className={styles.cupLeft}><i /></div><div className={styles.cupRight}><i /></div>
        </div>
      ) : mode === 'orbit' ? (
        <div className={styles.posterGalaxy} aria-hidden="true" style={{ transform: `rotateX(52deg) rotateZ(${(variant ? 30 : -15) + viewAngle}deg) scale(${0.8 + intensity * 0.28})` }}>
          <svg viewBox="0 0 500 500" className={styles.galaxyArms}>
            {Array.from({ length: variant % 2 ? 5 : 3 }, (_, arm) => {
              const path = Array.from({ length: 96 }, (_, i) => {
                const radius = i * 2.35;
                const angle = arm / (variant % 2 ? 5 : 3) * Math.PI * 2 + radius * (0.006 + intensity * 0.016);
                return `${i ? 'L' : 'M'}${250 + Math.cos(angle) * radius},${250 + Math.sin(angle) * radius}`;
              }).join(' ');
              return <g key={arm} fill="none" strokeLinecap="round"><path d={path} stroke={color} strokeWidth="14" opacity=".16" /><path d={path} stroke={color} strokeWidth="3" strokeDasharray=".2 7" /><path d={path} stroke="#c7b4ff" strokeWidth="2" strokeDasharray=".2 11" transform={`rotate(5 250 250)`} /></g>;
            })}
          </svg>
          <b />
        </div>
      ) : (
        <svg className={styles.posterSculpture} viewBox="0 0 500 500" aria-hidden="true" style={{ transform: `rotate(${(variant ? 25 : -12) + viewAngle * 0.4}deg)` }}>
          <defs>
            <linearGradient id={`${uid}-metal`} x1="0" y1="0" x2="1" y2="0.85">
              <stop offset="0" stopColor="#e4f8ce" /><stop offset=".13" stopColor="#768c59" /><stop offset=".27" stopColor={color} /><stop offset=".39" stopColor="#e0ead5" /><stop offset=".47" stopColor="#42503b" /><stop offset=".59" stopColor="#a09ad1" /><stop offset=".69" stopColor="#252437" /><stop offset=".83" stopColor="#d2c9f5" /><stop offset="1" stopColor={color} />
            </linearGradient>
            <linearGradient id={`${uid}-edge`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ebffe0" stopOpacity=".75" /><stop offset=".4" stopColor="#c5ff5e" stopOpacity=".08" /><stop offset="1" stopColor="#ece6ff" stopOpacity=".5" /></linearGradient>
            <filter id={`${uid}-shadow`} x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="8" dy="18" stdDeviation="12" floodColor="#000" floodOpacity=".55" /></filter>
          </defs>
          <ellipse cx="250" cy="270" rx="215" ry="90" fill="none" stroke={color} strokeOpacity=".25" strokeWidth="1" transform="rotate(-25 250 250)" />
          {mode === 'flux' && variant % 2 === 0 ? <path d={blob} fill={`url(#${uid}-metal)`} stroke={`url(#${uid}-edge)`} strokeWidth="2" filter={`url(#${uid}-shadow)`} /> : <g filter={`url(#${uid}-shadow)`} fill="none" stroke={`url(#${uid}-metal)`} strokeWidth={mode === 'flux' ? 60 + intensity * 20 : 58} strokeLinecap="round">
            <path d="M 172 122 C 262 54 401 125 378 233 C 354 343 128 425 102 297 C 78 182 274 80 347 191 C 409 285 259 438 172 350 C 81 258 84 189 172 122 Z" />
          </g>}
          {(mode !== 'flux' || variant % 2 === 1) && <path d="M 172 100 C 277 44 401 132 378 233 C 363 297 288 347 205 350" fill="none" stroke={`url(#${uid}-edge)`} strokeWidth="3" strokeLinecap="round" />}
          <circle cx="421" cy="187" r="5" fill={color} />
        </svg>
      )}
      {failed && mode !== 'hero' && (
        <div className={styles.fallback} role="status">
          <p>{locale === 'de' ? 'Grafische Vorschau · WebGL ist hier nicht verfügbar.' : 'Illustrated preview · WebGL is unavailable here.'}</p>
          <button type="button" onClick={onRetry}>{locale === 'de' ? 'Erneut versuchen' : 'Try again'}</button>
        </div>
      )}
    </div>
  );
}

const StudioLights = memo(function StudioLights() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 7, 4]} intensity={3.4} color="#efffde" />
      <pointLight position={[-4, 1, 2]} color="#8b7cff" intensity={24} />
      <pointLight position={[2, -2, 3]} color="#bfff3c" intensity={12} />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={5} position={[0, 5, -3]} rotation={[Math.PI / 2, 0, 0]} scale={[10, 2, 1]} />
        <Lightformer form="rect" intensity={4} position={[-5, 1, 3]} rotation={[0, Math.PI / 2, 0]} scale={[2, 8, 1]} />
        <Lightformer form="rect" intensity={2.8} position={[5, -1, 1]} rotation={[0, -Math.PI / 2, 0]} scale={[2, 6, 1]} color="#bfff3c" />
        <Lightformer form="ring" intensity={3} position={[0, 0, 5]} scale={5} color="#c6bbff" />
      </Environment>
    </>
  );
});

const fluxVertex = `
  uniform float uTime;
  uniform float uIntensity;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vWave;
  void main() {
    float wave = sin(position.y * 4.5 + uTime * 0.65) * sin(position.x * 3.5 - uTime * 0.4);
    wave += 0.35 * sin(position.z * 6.0 + position.y * 2.0 + uTime * 0.75);
    vec3 p = position + normal * wave * uIntensity * 0.52;
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(p, 1.0)).xyz;
    vWave = wave;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;
const fluxFragment = `
  uniform vec3 uColor;
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vWave;
  void main() {
    vec3 n = normalize(vNormal);
    vec3 viewDir = normalize(-vPosition);
    float fresnel = pow(1.0 - abs(dot(n, viewDir)), 2.0);
    float bands = sin(n.y * 9.0 + n.x * 4.0 + vWave * 1.8 + uTime * 0.08) * 0.5 + 0.5;
    vec3 base = mix(vec3(0.08, 0.055, 0.17), uColor * 0.85, smoothstep(0.1, 0.9, bands));
    base = mix(base, vec3(0.58, 0.48, 0.95), fresnel * 0.8);
    float gloss = pow(max(dot(reflect(-normalize(vec3(1.0, 2.0, 3.0)), n), viewDir), 0.0), 34.0);
    float ribbon = pow(max(0.0, sin(n.x * 4.0 + n.y * 3.0 + 0.6)), 22.0);
    gl_FragColor = vec4(base + gloss * 0.85 + ribbon * 0.3, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

function Sculpture({ mode, animate, color, intensity, variant, wireframe }) {
  const group = useRef();
  const material = useRef();
  const { invalidate } = useThree();
  // Keep the material's uniform objects stable; the effect updates their values.
  const [uniforms] = useState(() => ({ uTime: { value: 0 }, uIntensity: { value: intensity }, uColor: { value: new Color(color) } }));
  useEffect(() => { uniforms.uIntensity.value = intensity; uniforms.uColor.value.set(color); invalidate(); }, [color, intensity, uniforms, invalidate]);
  useFrame((state, delta) => {
    if (!animate || !group.current) return;
    group.current.rotation.y += Math.min(delta, 0.05) * (mode === 'hero' ? 0.11 : 0.18);
    group.current.rotation.x = MathUtils.damp(group.current.rotation.x, state.pointer.y * 0.18 - 0.2, 2.5, delta);
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.55) * 0.065;
    if (material.current) material.current.uniforms.uTime.value += Math.min(delta, 0.05);
  });
  return (
    <group ref={group} rotation={[-0.2, 0.4, -0.43]}>
      <mesh>
        {mode === 'hero' || variant % 2 === 1
          ? <torusKnotGeometry args={[1.13, mode === 'hero' ? 0.39 : 0.34, 160, 28, 2, 3]} />
          : <sphereGeometry args={[1.45, 80, 64]} />}
        {mode === 'hero'
          ? <meshPhysicalMaterial color="#c5e8ad" metalness={0.9} roughness={0.17} clearcoat={1} clearcoatRoughness={0.12} iridescence={1} iridescenceIOR={1.45} iridescenceThicknessRange={[140, 430]} />
          : <shaderMaterial ref={material} vertexShader={fluxVertex} fragmentShader={fluxFragment} uniforms={uniforms} wireframe={wireframe} />}
      </mesh>
      {mode === 'hero' && (
        <group rotation={[0.7, -0.4, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[2.05, 0.006, 6, 140]} />
            <meshBasicMaterial color="#c5ff80" transparent opacity={0.36} />
          </mesh>
          <mesh position={[2.05, 0, 0]}>
            <sphereGeometry args={[0.065, 16, 16]} />
            <meshBasicMaterial color="#d9ff9d" />
          </mesh>
        </group>
      )}
    </group>
  );
}

function Headphones({ animate, color, exploded, wireframe }) {
  const group = useRef();
  useFrame((_, delta) => {
    if (animate && group.current) group.current.rotation.y += Math.min(delta, 0.05) * 0.2;
  });
  const metal = { color, metalness: 0.68, roughness: 0.23, clearcoat: 1, wireframe };
  return (
    <group ref={group} rotation={[0.12, -0.52, -0.06]} position={[0, 0.05, 0]}>
      <mesh position={[0, 0.13, 0]}>
        <torusGeometry args={[1.12, 0.105, 16, 90, Math.PI]} />
        <meshPhysicalMaterial {...metal} />
      </mesh>
      <mesh position={[0, 0.13, 0]}>
        <torusGeometry args={[1.005, 0.074, 14, 80, Math.PI]} />
        <meshStandardMaterial color="#1c1d22" roughness={0.85} wireframe={wireframe} />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * 1.1, -0.13, 0]}>
            <cylinderGeometry args={[0.055, 0.055, 0.6, 16]} />
            <meshStandardMaterial color="#cfd3d8" metalness={1} roughness={0.18} wireframe={wireframe} />
          </mesh>
          <group position={[side * (1.09 + (exploded ? 0.45 : 0)), -0.57, 0]} rotation={[0, 0, side * -0.12]}>
            <mesh scale={[0.29, 0.65, 0.48]}>
              <sphereGeometry args={[1, 40, 32]} />
              <meshPhysicalMaterial {...metal} />
            </mesh>
            <mesh position={[side * (0.26 + (exploded ? 0.22 : 0)), 0, 0]} rotation={[0, 0, Math.PI / 2]} scale={[1.34, 1, 1]}>
              <cylinderGeometry args={[0.36, 0.36, 0.045, 64]} />
              <meshPhysicalMaterial {...metal} metalness={0.85} roughness={0.3} />
            </mesh>
            <mesh position={[-side * (0.19 + (exploded ? 0.3 : 0)), 0, 0]} rotation={[0, Math.PI / 2, 0]} scale={[0.87, 1.25, 1]}>
              <torusGeometry args={[0.37, 0.105, 16, 64]} />
              <meshStandardMaterial color="#16171c" roughness={0.96} wireframe={wireframe} />
            </mesh>
            <mesh position={[-side * (0.18 + (exploded ? 0.3 : 0)), 0, 0]} rotation={[0, 0, Math.PI / 2]} scale={[1.3, 1, 1]}>
              <cylinderGeometry args={[0.28, 0.28, 0.02, 40]} />
              <meshStandardMaterial color="#090a0d" roughness={1} wireframe={wireframe} />
            </mesh>
            <mesh position={[side * (0.29 + (exploded ? 0.22 : 0)), 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <torusGeometry args={[0.1, 0.012, 8, 32]} />
              <meshStandardMaterial color="#202125" metalness={0.6} roughness={0.3} />
            </mesh>
            {[0, 1, 2].map((i) => (
              <mesh key={i} position={[side * 0.26, -0.31 + i * 0.09, 0.12]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.015, 0.015, 0.04, 8]} />
                <meshBasicMaterial color="#111317" />
              </mesh>
            ))}
          </group>
        </group>
      ))}
    </group>
  );
}

const particleVertex = `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float aSize;
  varying vec3 vColor;
  void main() {
    vColor = color;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float shimmer = 0.78 + sin(uTime * 0.8 + position.x * 5.0) * 0.22;
    gl_PointSize = min(16.0, aSize * uPixelRatio * shimmer * (18.0 / -mv.z));
    gl_Position = projectionMatrix * mv;
  }
`;
const particleFragment = `
  varying vec3 vColor;
  void main() {
    float radius = length(gl_PointCoord - 0.5);
    if (radius > 0.5) discard;
    float glow = pow(1.0 - radius * 2.0, 1.8);
    gl_FragColor = vec4(vColor, glow);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

function Galaxy({ animate, color, intensity, variant }) {
  const group = useRef();
  const mat = useRef();
  const geometry = useRef();
  const { viewport, invalidate } = useThree();
  const data = useMemo(() => {
    const count = 6000;
    const position = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    let seed = 90210;
    const rand = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    const inner = new Color(color);
    const outer = new Color('#7e62dc');
    const tint = new Color();
    const arms = variant % 2 ? 5 : 3;
    for (let i = 0; i < count; i += 1) {
      const r = Math.pow(rand(), 0.85) * 2.7;
      const angle = (i % arms) / arms * Math.PI * 2 + r * (0.45 + intensity * 1.8);
      const spread = Math.pow(rand(), 3) * (rand() < 0.5 ? -1 : 1) * (0.18 + r * 0.24);
      position[i * 3] = Math.cos(angle) * r + spread;
      position[i * 3 + 1] = (rand() - 0.5) * (0.12 + r * 0.12);
      position[i * 3 + 2] = Math.sin(angle) * r + spread;
      tint.copy(inner).lerp(outer, r / 2.7);
      colors.set([tint.r, tint.g, tint.b], i * 3);
      sizes[i] = 0.65 + rand() * 2.7;
    }
    return { position, colors, sizes };
  }, [color, intensity, variant]);
  const [uniforms] = useState(() => ({ uTime: { value: 0 }, uPixelRatio: { value: 1 } }));
  useEffect(() => {
    // Replacing an attribute's typed array alone does not upload it to the GPU.
    // All arrays keep the same length, so reuse their buffers and mark changes.
    if (geometry.current) {
      Object.values(geometry.current.attributes).forEach((attribute) => { attribute.needsUpdate = true; });
    }
    invalidate();
  }, [data, invalidate]);
  useEffect(() => { uniforms.uPixelRatio.value = viewport.dpr; invalidate(); }, [viewport.dpr, uniforms, invalidate]);
  useFrame((_, delta) => {
    if (!animate) return;
    group.current.rotation.y += Math.min(delta, 0.05) * 0.065;
    mat.current.uniforms.uTime.value += Math.min(delta, 0.05);
  });
  return (
    <group ref={group} rotation={[0.5, 0, 0.2]}>
      <points frustumCulled={false}>
        <bufferGeometry ref={geometry}>
          <bufferAttribute attach="attributes-position" count={data.position.length / 3} array={data.position} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={data.colors.length / 3} array={data.colors} itemSize={3} />
          <bufferAttribute attach="attributes-aSize" count={data.sizes.length} array={data.sizes} itemSize={1} />
        </bufferGeometry>
        <shaderMaterial ref={mat} uniforms={uniforms} vertexShader={particleVertex} fragmentShader={particleFragment} vertexColors transparent depthWrite={false} blending={AdditiveBlending} />
      </points>
      <mesh>
        <sphereGeometry args={[0.095, 24, 16]} />
        <meshBasicMaterial color="#f6ffd9" />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.19, 0.009, 8, 80]} />
        <meshBasicMaterial color={color} transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

function ContextWatch({ onLost }) {
  const { gl } = useThree();
  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (event) => { event.preventDefault(); onLost(); };
    canvas.addEventListener('webglcontextlost', lost);
    return () => canvas.removeEventListener('webglcontextlost', lost);
  }, [gl, onLost]);
  return null;
}

function ViewControls({ angle, reduced, mode }) {
  const controls = useRef();
  const { camera, invalidate } = useThree();
  useEffect(() => {
    camera.position.set(...(mode === 'orbit' ? [0, 3.4, 5.2] : [0, 0.2, mode === 'aura' ? 6.2 : 6.5]));
    controls.current?.target.set(0, 0, 0);
    controls.current?.update();
    invalidate();
  }, [camera, invalidate, mode]);
  useEffect(() => {
    controls.current?.setAzimuthalAngle(angle * Math.PI / 180);
    invalidate();
  }, [angle, invalidate]);
  return <OrbitControls ref={controls} enableZoom={false} enablePan={false} enableDamping={!reduced} minPolarAngle={0.2} maxPolarAngle={Math.PI - 0.2} />;
}

function FramedModel({ mode, intensity, exploded, children }) {
  const { size, camera } = useThree();
  const vertical = MathUtils.degToRad(camera.fov / 2);
  const horizontal = Math.atan(Math.tan(vertical) * size.width / Math.max(1, size.height));
  const distance = mode === 'orbit' ? Math.hypot(3.4, 5.2) : Math.hypot(0.2, mode === 'aura' ? 6.2 : 6.5);
  // Bounds include maximum deformation and the spread of an exploded product.
  // A bounding sphere stays framed even when OrbitControls changes the angle.
  const radius = mode === 'orbit' ? 3.9 : mode === 'aura' ? (exploded ? 2.3 : 1.85) : mode === 'flux' ? 2.1 + intensity * 0.7 : 2.25;
  const scale = Math.min(1, distance * Math.sin(Math.min(vertical, horizontal)) * 0.9 / radius);
  return <group scale={scale}>{children}</group>;
}

export default function Scene({ mode = 'hero', active = true, reducedMotion = false, color = '#bfff3c', variant = 0, intensity = 0.45, autoRotate = true, exploded = false, wireframe = false, locale = 'en', resetKey = 0, viewAngle = 0, onSupportChange }) {
  const host = useRef();
  const [supported, setSupported] = useState(null);
  const [visible, setVisible] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const [lost, setLost] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [systemReduced, setSystemReduced] = useState(true);
  useEffect(() => {
    let context;
    try {
      const test = document.createElement('canvas');
      test.width = 1;
      test.height = 1;
      context = test.getContext('webgl2', { failIfMajorPerformanceCaveat: false });
      setSupported(Boolean(context));
      onSupportChange?.(Boolean(context));
      context?.getExtension('WEBGL_lose_context')?.loseContext();
    } catch { setSupported(false); onSupportChange?.(false); }
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setSystemReduced(media.matches);
    const updateVisibility = () => setTabVisible(!document.hidden);
    updateMotion(); updateVisibility();
    media.addEventListener('change', updateMotion);
    document.addEventListener('visibilitychange', updateVisibility);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '80px' });
    if (host.current) observer.observe(host.current);
    return () => {
      observer.disconnect();
      media.removeEventListener('change', updateMotion);
      document.removeEventListener('visibilitychange', updateVisibility);
    };
  }, [attempt, onSupportChange]);
  const running = active && visible && tabVisible && !reducedMotion && !systemReduced && autoRotate;
  const retry = () => { setLost(false); setSupported(null); setAttempt((v) => v + 1); };
  const fail = () => { setLost(true); onSupportChange?.(false); };
  const fallback = <Poster mode={mode} color={color} failed={supported === false || lost} onRetry={retry} locale={locale} exploded={exploded} variant={variant} intensity={intensity} viewAngle={viewAngle} />;
  return (
    <div ref={host} className={`${styles.scene} ${mode === 'hero' ? styles.heroScene : ''}`}>
      {supported && !lost ? (
        <SceneBoundary key={attempt} onError={fail} fallback={<Poster mode={mode} color={color} failed onRetry={retry} locale={locale} exploded={exploded} variant={variant} intensity={intensity} viewAngle={viewAngle} />}>
          <Canvas
            dpr={[1, 1.6]}
            camera={{ position: mode === 'orbit' ? [0, 3.4, 5.2] : [0, 0.2, mode === 'aura' ? 6.2 : 6.5], fov: 42 }}
            frameloop={running ? 'always' : 'demand'}
            gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
            role="img"
            aria-label={locale === 'de' ? (mode === 'aura' ? 'Interaktives 3D-Kopfhörermodell' : mode === 'orbit' ? 'Interaktive Partikelgalaxie' : 'Interaktive 3D-Skulptur') : (mode === 'aura' ? 'Interactive 3D headphone model' : mode === 'orbit' ? 'Interactive particle galaxy' : 'Interactive 3D sculpture')}
          >
            <ContextWatch onLost={fail} />
            <Suspense fallback={null}>
              {(mode === 'hero' || mode === 'aura') && <StudioLights />}
              <FramedModel mode={mode} intensity={intensity} exploded={exploded}>
              {mode === 'aura' ? <Headphones key={resetKey} animate={running} color={color} exploded={exploded} wireframe={wireframe} />
                : mode === 'orbit' ? <Galaxy key={resetKey} animate={running} color={color} intensity={intensity} variant={variant} />
                  : <Sculpture key={resetKey} mode={mode} animate={running} color={color} intensity={intensity} variant={variant} wireframe={wireframe} />}
              </FramedModel>
              {mode !== 'hero' && <ViewControls key={`${mode}-${resetKey}`} mode={mode} angle={viewAngle} reduced={reducedMotion || systemReduced} />}
            </Suspense>
          </Canvas>
        </SceneBoundary>
      ) : fallback}
    </div>
  );
}
