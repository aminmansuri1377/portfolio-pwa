import { memo, useEffect, useRef, useState } from 'react';
import { ManagedCanvas as Canvas, useSceneFrame, FitScene } from '../Graphics';
import { useShowcaseMotion } from '../Runtime';
import { ContactShadows, Environment, Float, Lightformer, OrbitControls } from '@react-three/drei';
import { useTranslations } from 'next-intl';
import { ActionButton, ChipGroup, Panel, Swatches } from '../controls';

const COLORS = ['#bfff3c', '#8b7cff', '#ff5d8f', '#4cc9f0', '#f4f4f0', '#1a1a24'];

const FINISHES = {
  matte: { metalness: 0, roughness: 0.85, clearcoat: 0, transmission: 0 },
  gloss: { metalness: 0.1, roughness: 0.12, clearcoat: 1, transmission: 0 },
  metal: { metalness: 1, roughness: 0.2, clearcoat: 0, transmission: 0 },
  glass: { metalness: 0, roughness: 0.05, clearcoat: 0, transmission: 1 },
};

function Product({ shape, finish, color }) {
  const mesh = useRef();
  const { animate } = useShowcaseMotion();

  // small "pop" whenever the geometry changes
  useEffect(() => {
    if (mesh.current) mesh.current.scale.setScalar(animate ? .6 : 1);
  }, [shape, animate]);

  useSceneFrame((state, delta, elapsed, animate) => {
    if (!mesh.current) return;
    const s = mesh.current.scale.x;
    mesh.current.scale.setScalar(animate ? s + (1 - s) * 0.12 : 1);
  });

  const f = FINISHES[finish];

  return (
    <Float enabled={animate} speed={1.6} rotationIntensity={0.35} floatIntensity={0.7}>
      <mesh ref={mesh} castShadow>
        {shape === 'knot' && <torusKnotGeometry args={[0.8, 0.28, 240, 36]} />}
        {shape === 'torus' && <torusGeometry args={[1, 0.4, 48, 96]} />}
        {shape === 'gem' && <icosahedronGeometry args={[1.25, 0]} />}
        {shape === 'capsule' && <capsuleGeometry args={[0.7, 1.2, 16, 48]} />}
        <meshPhysicalMaterial
          key={`${shape}-${finish}`}
          color={color}
          metalness={f.metalness}
          roughness={f.roughness}
          clearcoat={f.clearcoat}
          clearcoatRoughness={0.05}
          transmission={f.transmission}
          thickness={1.2}
          ior={1.45}
          flatShading={shape === 'gem'}
        />
      </mesh>
    </Float>
  );
}

const StudioLights = memo(function StudioLights() {
  return (<Environment resolution={256}>
          <Lightformer form="rect" intensity={4} position={[0, 5, -4]} scale={[12, 6, 1]} />
          <Lightformer form="ring" intensity={3.5} color="#bfff3c" position={[-6, 1, 2]} scale={4} />
          <Lightformer form="rect" intensity={3} color="#8b7cff" position={[6, 2, 3]} scale={[4, 8, 1]} />
          <Lightformer form="circle" intensity={2} color="#ffffff" position={[0, -3, 4]} scale={5} />
        </Environment>);
});

export default function ConfiguratorDemo() {
  const t = useTranslations('Showcase.ui');
  const { animate, reducedMotion } = useShowcaseMotion();
  const [shape, setShape] = useState('knot');
  const [finish, setFinish] = useState('gloss');
  const [color, setColor] = useState(COLORS[0]);
  const [auto, setAuto] = useState(true);

  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="relative min-h-[300px] flex-1">
      <Canvas dpr={[1, 1.6]} camera={{ position: [0, 0.4, 5.2], fov: 38 }} shadows>
        <FitScene radius={1.9} position={[0, .4, 5.2]} />
        <color attach="background" args={['#07070b']} />
        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 5, 4]} intensity={1.2} />
        <Product shape={shape} finish={finish} color={color} />
        <ContactShadows position={[0, -1.7, 0]} opacity={0.55} blur={2.6} scale={10} far={4} />
        <StudioLights />
        <OrbitControls enablePan={false} minDistance={3.4} maxDistance={18} autoRotate={auto && animate} autoRotateSpeed={1.4} />
      </Canvas>
      </div>
      <div className="shrink-0 p-3">
        <Panel className="pointer-events-auto flex max-h-[44vh] w-full flex-wrap items-end gap-x-6 gap-y-3 overflow-y-auto" data-lenis-prevent>
          <ChipGroup
            label={t('shape')}
            value={shape}
            onChange={setShape}
            options={['knot', 'torus', 'gem', 'capsule'].map((v) => ({ value: v, label: t(`shapes.${v}`) }))}
          />
          <ChipGroup
            label={t('finish')}
            value={finish}
            onChange={setFinish}
            options={['matte', 'gloss', 'metal', 'glass'].map((v) => ({ value: v, label: t(`finishes.${v}`) }))}
          />
          <Swatches label={t('color')} colors={COLORS} value={color} onChange={setColor} />
          <ActionButton onClick={() => setAuto((a) => !a)} aria-pressed={auto && animate} disabled={reducedMotion}>
            {auto && animate ? t('autoRotateOn') : t('autoRotateOff')}
          </ActionButton>
        </Panel>
      </div>
    </div>
  );
}
