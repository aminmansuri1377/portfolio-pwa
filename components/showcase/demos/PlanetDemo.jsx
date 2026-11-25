import { useEffect, useMemo, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { ManagedCanvas as Canvas, useSceneFrame, FitScene } from '../Graphics';
import { useShowcaseMotion } from '../Runtime';
import { OrbitControls, Stars } from '@react-three/drei';
import { AdditiveBlending, BackSide, Vector3 } from 'three';
import { useTranslations } from 'next-intl';
import { ActionButton, Panel, RangeField } from '../controls';

const SUN = new Vector3(5, 2.2, 4).normalize();

const planetVertex = /* glsl */ `
  uniform vec3 uSun;
  varying vec3 vPos;
  varying vec3 vNormalV;
  varying vec3 vViewPos;
  varying vec3 vSunV;

  void main() {
    vPos = position;
    vNormalV = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vViewPos = mv.xyz;
    vSunV = normalize((viewMatrix * vec4(uSun, 0.0)).xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const planetFragment = /* glsl */ `
  uniform float uSeed;
  uniform float uSea;
  uniform float uTime;
  varying vec3 vPos;
  varying vec3 vNormalV;
  varying vec3 vViewPos;
  varying vec3 vSunV;

  float hash31(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float vnoise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash31(i + vec3(0.0, 0.0, 0.0)), hash31(i + vec3(1.0, 0.0, 0.0)), f.x),
          mix(hash31(i + vec3(0.0, 1.0, 0.0)), hash31(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
      mix(mix(hash31(i + vec3(0.0, 0.0, 1.0)), hash31(i + vec3(1.0, 0.0, 1.0)), f.x),
          mix(hash31(i + vec3(0.0, 1.0, 1.0)), hash31(i + vec3(1.0, 1.0, 1.0)), f.x), f.y),
      f.z);
  }

  float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 6; i++) {
      v += a * vnoise(p);
      p = p * 2.03 + vec3(11.3, 5.7, 3.1);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec3 dir = normalize(vPos);
    vec3 p = dir * 1.7 + vec3(uSeed * 7.13, uSeed * 3.71, uSeed * 5.37);
    float h = fbm(p);

    vec3 deep = vec3(0.02, 0.07, 0.2);
    vec3 shallow = vec3(0.06, 0.32, 0.5);
    vec3 sand = vec3(0.76, 0.69, 0.45);
    vec3 grass = vec3(0.18, 0.42, 0.16);
    vec3 rock = vec3(0.36, 0.31, 0.27);
    vec3 snow = vec3(0.95, 0.97, 1.0);

    vec3 col;
    float water = 0.0;
    if (h < uSea) {
      water = 1.0;
      col = mix(deep, shallow, smoothstep(uSea - 0.18, uSea, h));
    } else {
      float e = (h - uSea) / (1.0 - uSea);
      col = mix(sand, grass, smoothstep(0.0, 0.08, e));
      col = mix(col, rock, smoothstep(0.35, 0.6, e));
      col = mix(col, snow, smoothstep(0.62, 0.8, e));
    }
    // polar caps
    float lat = abs(dir.y) + (fbm(p * 2.0) - 0.5) * 0.18;
    col = mix(col, snow, smoothstep(0.8, 0.93, lat));

    vec3 n = normalize(vNormalV);
    vec3 V = normalize(-vViewPos);
    float ndl = dot(n, vSunV);
    float diff = max(ndl, 0.0);

    vec3 H = normalize(vSunV + V);
    float spec = pow(max(dot(n, H), 0.0), 70.0) * water * 0.9;

    vec3 lit = col * (0.05 + diff * 1.15) + spec;

    // slowly drifting clouds
    float c = fbm(dir * 3.4 + vec3(uTime * 0.02, 0.0, uSeed));
    c = smoothstep(0.52, 0.78, c);
    lit = mix(lit, vec3(1.0) * (0.06 + diff), c * 0.7);

    // atmospheric rim
    float rim = pow(1.0 - max(dot(n, V), 0.0), 3.0);
    lit += vec3(0.25, 0.5, 1.0) * rim * (0.12 + diff * 0.6);

    gl_FragColor = vec4(lit, 1.0);
    #include <colorspace_fragment>
  }
`;

const atmoVertex = /* glsl */ `
  varying vec3 vNormalV;
  void main() {
    vNormalV = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const atmoFragment = /* glsl */ `
  uniform vec3 uSun;
  varying vec3 vNormalV;
  void main() {
    vec3 n = normalize(vNormalV);
    vec3 sunV = normalize((viewMatrix * vec4(uSun, 0.0)).xyz);
    float intensity = pow(max(0.62 - dot(n, vec3(0.0, 0.0, 1.0)), 0.0), 3.0);
    float day = 0.3 + 0.7 * smoothstep(-0.4, 0.5, dot(n, sunV));
    gl_FragColor = vec4(vec3(0.28, 0.55, 1.0) * min(intensity * 2.2, 1.6) * day, 1.0);
  }
`;

function Planet({ seed, sea }) {
  const mesh = useRef();
  const moon = useRef();
  const invalidate = useThree(state => state.invalidate);
  const uniforms = useMemo(
    () => ({ uSun: { value: SUN }, uSeed: { value: 0 }, uSea: { value: 0.5 }, uTime: { value: 0 } }),
    []
  );
  const atmoUniforms = useMemo(() => ({ uSun: { value: SUN } }), []);

  useEffect(() => {
    uniforms.uSeed.value = seed;
    invalidate();
  }, [seed, uniforms, invalidate]);
  useEffect(() => {
    uniforms.uSea.value = sea;
    invalidate();
  }, [sea, uniforms, invalidate]);

  useSceneFrame((state, delta, elapsed, animate) => {
    uniforms.uTime.value = elapsed;
    if (mesh.current) mesh.current.rotation.y += delta * 0.06;
    if (moon.current) {
      const a = elapsed * 0.25;
      moon.current.position.set(Math.cos(a) * 2.5, Math.sin(a * 0.7) * 0.35, Math.sin(a) * 2.5);
      moon.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group rotation={[0.35, 0, 0.2]}>
      <mesh ref={mesh}>
        <sphereGeometry args={[1, 96, 96]} />
        <shaderMaterial uniforms={uniforms} vertexShader={planetVertex} fragmentShader={planetFragment} />
      </mesh>
      <mesh scale={1.16}>
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial
          uniforms={atmoUniforms}
          vertexShader={atmoVertex}
          fragmentShader={atmoFragment}
          side={BackSide}
          blending={AdditiveBlending}
          transparent
          depthWrite={false}
        />
      </mesh>
      <mesh ref={moon} scale={0.24} position={[2.5, 0, 0]}>
        <icosahedronGeometry args={[1, 3]} />
        <meshStandardMaterial color="#a4a4b2" roughness={1} flatShading />
      </mesh>
    </group>
  );
}

export default function PlanetDemo() {
  const t = useTranslations('Showcase.ui');
  const { animate } = useShowcaseMotion();
  const [seed, setSeed] = useState(0.37);
  const [sea, setSea] = useState(0.5);

  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="relative min-h-[300px] flex-1">
      <Canvas dpr={[1, 1.6]} camera={{ position: [0, 0.5, 4.4], fov: 42 }}>
        <color attach="background" args={['#030307']} />
        <ambientLight intensity={0.12} />
        <directionalLight position={SUN.clone().multiplyScalar(10).toArray()} intensity={2.2} />
        <Stars radius={60} depth={40} count={3500} factor={3.2} saturation={0} fade speed={animate ? .6 : 0} />
        <FitScene radius={2.85} position={[0, .5, 4.4]} />
        <Planet seed={seed} sea={sea} />
        <OrbitControls enablePan={false} minDistance={2.4} maxDistance={22} />
      </Canvas>
      </div>
      <div className="shrink-0 p-3">
        <Panel className="pointer-events-auto flex w-full max-w-xl flex-wrap items-end gap-x-6 gap-y-3">
          <div className="min-w-[180px] flex-1">
            <RangeField
              label={t('seaLevel')}
              min={0.35}
              max={0.65}
              step={0.005}
              value={sea}
              onChange={setSea}
              format={(v) => `${Math.round(v * 100)}%`}
            />
          </div>
          <ActionButton onClick={() => setSeed(Math.random() * 20)}>{t('newPlanet')}</ActionButton>
        </Panel>
      </div>
    </div>
  );
}
