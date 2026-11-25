import { useEffect, useMemo, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { ManagedCanvas as Canvas, useSceneFrame, FitScene } from '../Graphics';
import { AdditiveBlending, Color, MathUtils } from 'three';
import { useTranslations } from 'next-intl';
import { ChipGroup, Panel } from '../controls';

const COUNT = 9000;
const TAU = Math.PI * 2;

// Each generator writes the position of particle `i` into out[o..o+2].
const GENERATORS = {
  sphere(i, out, o) {
    const k = i + 0.5;
    const phi = Math.acos(1 - (2 * k) / COUNT);
    const theta = Math.PI * (1 + Math.sqrt(5)) * k;
    const r = 1.7;
    out[o] = Math.cos(theta) * Math.sin(phi) * r;
    out[o + 1] = Math.cos(phi) * r;
    out[o + 2] = Math.sin(theta) * Math.sin(phi) * r;
  },
  torus(i, out, o) {
    const u = Math.random() * TAU;
    const v = Math.random() * TAU;
    const R = 1.5;
    const r = 0.58;
    out[o] = (R + r * Math.cos(v)) * Math.cos(u);
    out[o + 1] = r * Math.sin(v);
    out[o + 2] = (R + r * Math.cos(v)) * Math.sin(u);
  },
  cube(i, out, o) {
    const s = 1.45;
    const a = Math.floor(Math.random() * 3);
    const sign = Math.random() < 0.5 ? -1 : 1;
    const p = [(Math.random() * 2 - 1) * s, (Math.random() * 2 - 1) * s, (Math.random() * 2 - 1) * s];
    p[a] = sign * s;
    out[o] = p[0];
    out[o + 1] = p[1];
    out[o + 2] = p[2];
  },
  helix(i, out, o) {
    const t = (i / COUNT) * 2 - 1;
    const strand = i % 3;
    const a = t * Math.PI * 5;
    const r = 0.95;
    if (strand === 2) {
      // rungs between the two strands
      const k = Math.random() * 2 - 1;
      out[o] = Math.cos(a) * r * k;
      out[o + 1] = t * 2.4;
      out[o + 2] = Math.sin(a) * r * k;
    } else {
      const ph = strand === 0 ? 0 : Math.PI;
      out[o] = Math.cos(a + ph) * r + (Math.random() - 0.5) * 0.08;
      out[o + 1] = t * 2.4;
      out[o + 2] = Math.sin(a + ph) * r + (Math.random() - 0.5) * 0.08;
    }
  },
  heart(i, out, o) {
    const t = Math.random() * TAU;
    const fill = Math.sqrt(Math.random());
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    const s = 0.105 * fill;
    out[o] = x * s;
    out[o + 1] = y * s + 0.1;
    out[o + 2] = (Math.random() - 0.5) * 1.1 * Math.sqrt(1 - fill * fill + 0.05);
  },
};

function build(name) {
  const arr = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) GENERATORS[name](i, arr, i * 3);
  return arr;
}

function Particles({ shape }) {
  const points = useRef();
  const group = useRef();
  const invalidate = useThree(state => state.invalidate);
  const target = useMemo(() => build(shape), [shape]);

  useEffect(() => { invalidate(); }, [target, invalidate]);

  const { positions, colors, speeds } = useMemo(() => {
    const positions = build('sphere');
    const colors = new Float32Array(COUNT * 3);
    const speeds = new Float32Array(COUNT);
    const a = new Color('#bfff3c');
    const b = new Color('#8b7cff');
    const c = new Color();
    for (let i = 0; i < COUNT; i++) {
      c.copy(a).lerp(b, Math.random());
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
      speeds[i] = 0.025 + Math.random() * 0.06;
    }
    return { positions, colors, speeds };
  }, []);

  useSceneFrame((state, delta, elapsed, animate) => {
    const tgt = target;
    if (!tgt || !points.current) return;
    const t = elapsed;
    for (let i = 0; i < COUNT; i++) {
      const k = animate ? 1 - Math.pow(1 - speeds[i], delta * 60) : 1;
      const i3 = i * 3;
      positions[i3] += (tgt[i3] - positions[i3]) * k;
      positions[i3 + 1] += (tgt[i3 + 1] - positions[i3 + 1]) * k;
      positions[i3 + 2] += (tgt[i3 + 2] - positions[i3 + 2]) * k;
    }
    // gentle shimmer so a settled shape still feels alive
    points.current.material.size = 0.04 + Math.sin(t * 2) * 0.004;
    points.current.geometry.attributes.position.needsUpdate = true;
    group.current.rotation.y += delta * 0.18;
    group.current.rotation.x = MathUtils.lerp(group.current.rotation.x, -state.pointer.y * 0.5, animate ? .05 : 1);
    group.current.rotation.z = MathUtils.lerp(group.current.rotation.z, state.pointer.x * 0.25, animate ? .05 : 1);
  });

  return (
    <group ref={group}>
      <points ref={points} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0.9}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </points>
    </group>
  );
}

export default function MorphDemo() {
  const t = useTranslations('Showcase.ui');
  const [shape, setShape] = useState('sphere');

  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="relative min-h-[300px] flex-1">
      <Canvas dpr={[1, 1.6]} camera={{ position: [0, 0, 6.2], fov: 50 }}>
        <color attach="background" args={['#050508']} />
        <FitScene radius={2.7} />
        <Particles shape={shape} />
      </Canvas>
      </div>
      <div className="shrink-0 p-3">
        <Panel className="pointer-events-auto">
          <ChipGroup
            label={t('shape')}
            value={shape}
            onChange={setShape}
            options={Object.keys(GENERATORS).map((v) => ({ value: v, label: t(`morphShapes.${v}`) }))}
          />
        </Panel>
      </div>
    </div>
  );
}
