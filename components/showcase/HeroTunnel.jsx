import { useMemo, useRef } from 'react';
import { ManagedCanvas, GraphicsGuard, useSceneFrame } from './Graphics';
import { ShowcaseRuntime } from './Runtime';
import { MathUtils } from 'three';

const RINGS = 30;
const DEPTH = 42;

function Tunnel() {
  const group = useRef();
  const rings = useRef([]);
  const items = useMemo(() => Array.from({ length: RINGS }, (_, i) => i), []);

  useSceneFrame((state, delta, elapsed, animate) => {
    const speed = 3.2;
    const px = state.pointer.x;
    const py = state.pointer.y;
    rings.current.forEach((m, i) => {
      if (!m) return;
      if (!m.userData.z && m.userData.z !== 0) m.userData.z = -(i / RINGS) * DEPTH;
      m.userData.z += delta * speed;
      if (m.userData.z > 3) m.userData.z -= DEPTH;
      const z = m.userData.z;
      const far = Math.abs(z) / DEPTH; // 0 near … 1 far
      m.position.set(px * far * 3.2, py * far * 1.8 + Math.sin(z * 0.25 + elapsed * 0.5) * 0.35 * far, z);
      m.rotation.z = i * 0.22 + elapsed * 0.12 * (i % 2 ? 1 : -1);
      m.material.opacity = Math.min(0.9, (1 - far) * 1.4) * Math.min(1, (3 - z) * 0.8);
    });
    if (group.current) {
      group.current.rotation.z = MathUtils.lerp(group.current.rotation.z, px * 0.12, animate ? 0.05 : 1);
    }
  });

  return (
    <group ref={group}>
      {items.map((i) => (
        <mesh key={i} ref={(el) => (rings.current[i] = el)}>
          <torusGeometry args={[2.4 + (i % 3) * 0.25, 0.012, 6, i % 2 ? 6 : 64]} />
          <meshBasicMaterial color={i % 3 === 0 ? '#bfff3c' : '#8b7cff'} transparent opacity={0} />
        </mesh>
      ))}
    </group>
  );
}

export default function HeroTunnel({ active = true, reducedMotion = false, locale = 'en', pointerTarget }) {
  return <ShowcaseRuntime active={active} reducedMotion={reducedMotion}>
    <GraphicsGuard id="hero" locale={locale} decorative>
      <ManagedCanvas pointerTarget={pointerTarget} dpr={[1, 1.5]} camera={{ position: [0, 0, 5], fov: 60 }} gl={{ alpha: true, antialias: true }} aria-hidden="true">
        <Tunnel />
      </ManagedCanvas>
    </GraphicsGuard>
  </ShowcaseRuntime>;
}
