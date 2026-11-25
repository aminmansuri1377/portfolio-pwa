import { useEffect, useMemo, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { ManagedCanvas as Canvas, useSceneFrame, FitScene } from '../Graphics';
import { useTranslations } from 'next-intl';
import { ActionButton } from '../controls';
import { AdditiveBlending, Color, MathUtils } from 'three';

const COUNT = 60000;

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uBurst;
  uniform float uPixelRatio;
  attribute float aScale;
  attribute float aRand;
  attribute vec3 aColor;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec3 p = position;
    float r = length(p.xz);
    float a = atan(p.z, p.x);
    // differential rotation: the core spins faster than the rim
    a += uTime * 0.22 / (0.6 + r * 0.5);

    // click shockwave: every star is pushed outwards by its own random amount
    float shock = uBurst * (0.6 + aRand) * (1.0 - uBurst * 0.4);
    r *= 1.0 + shock * 0.9;

    p.x = cos(a) * r;
    p.z = sin(a) * r;
    p.y += sin(uTime * 0.8 + aRand * 40.0) * 0.04 + shock * (aRand - 0.5) * 2.0;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * aScale * uPixelRatio * (1.0 / -mv.z);

    vColor = aColor;
    vAlpha = 0.55 + 0.45 * aRand;
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float s = pow(1.0 - d * 2.0, 2.2);
    gl_FragColor = vec4(vColor * (0.6 + s), s * vAlpha);
    #include <colorspace_fragment>
  }
`;

function Stars({ burst }) {
  const group = useRef();
  const material = useRef();

  const { positions, colors, scales, rands } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const scales = new Float32Array(COUNT);
    const rands = new Float32Array(COUNT);
    const inner = new Color('#bfff3c');
    const outer = new Color('#8b7cff');
    const mixed = new Color();
    const BRANCHES = 4;
    const RADIUS = 5;
    const SPIN = 1.1;
    const scatter = () => Math.pow(Math.random(), 3.2) * (Math.random() < 0.5 ? 1 : -1);

    for (let i = 0; i < COUNT; i++) {
      const r = Math.pow(Math.random(), 0.8) * RADIUS;
      const branch = ((i % BRANCHES) / BRANCHES) * Math.PI * 2;
      const angle = branch + r * SPIN;
      const k = 0.32 * r * 0.55 + 0.04;
      positions[i * 3] = Math.cos(angle) * r + scatter() * k;
      positions[i * 3 + 1] = scatter() * k * 0.6;
      positions[i * 3 + 2] = Math.sin(angle) * r + scatter() * k;

      mixed.copy(inner).lerp(outer, Math.min(1, r / RADIUS));
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;

      scales[i] = 0.35 + Math.random() * 1.1;
      rands[i] = Math.random();
    }
    return { positions, colors, scales, rands };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 36 },
      uBurst: { value: 0 },
      uPixelRatio: { value: 1 },
    }),
    []
  );

  const invalidate = useThree(state => state.invalidate);
  useEffect(() => {
    if (burst > 0) { uniforms.uBurst.value = 1; invalidate(); }
  }, [burst, uniforms, invalidate]);

  useSceneFrame((state, delta, elapsed, animate) => {
    uniforms.uTime.value = elapsed;
    uniforms.uPixelRatio.value = state.gl.getPixelRatio();
    uniforms.uBurst.value = Math.max(0, uniforms.uBurst.value - delta * 0.85);
    if (group.current) {
      group.current.rotation.x = MathUtils.lerp(group.current.rotation.x, 0.25 - state.pointer.y * 0.55, animate ? .05 : 1);
      group.current.rotation.z = MathUtils.lerp(group.current.rotation.z, state.pointer.x * 0.35, animate ? .05 : 1);
    }
  });

  return (
    <group ref={group}>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-aColor" args={[colors, 3]} />
          <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
          <bufferAttribute attach="attributes-aRand" args={[rands, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={material}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </points>
    </group>
  );
}

export default function GalaxyDemo() {
  const t = useTranslations('Showcase.ui');
  const [burst, setBurst] = useState(0);
  return (
    <div className="absolute inset-0" onPointerDown={event => { if (event.target.tagName === 'CANVAS') setBurst(value => value + 1); }}>
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 3.6, 7], fov: 55 }}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={['#050508']} />
      <FitScene radius={6.5} position={[0, 3.6, 7]} />
      <Stars burst={burst} />
    </Canvas>
      <div className="absolute bottom-4 left-4"><ActionButton onClick={() => setBurst(value => value + 1)}>{t('burst')}</ActionButton></div>
    </div>
  );
}
