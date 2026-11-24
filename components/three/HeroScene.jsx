import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sparkles } from '@react-three/drei';
import { MathUtils } from 'three';

function Sculpture({ reduced }) {
  const group = useRef();
  const shell = useRef();
  const scroll = useRef(0);
  const mobile = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const sync = () => {
      mobile.current = mq.matches;
    };
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scroll.current = max > 0 ? window.scrollY / max : 0;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const isMobile = mobile.current;
    if (!reduced) {
      // phones: spin faster and breathe so the hero feels alive
      group.current.rotation.y += delta * (isMobile ? 0.32 : 0.12);
      shell.current.rotation.z -= delta * (isMobile ? 0.14 : 0.05);
      group.current.position.y = Math.sin(t * 0.6) * 0.12;
    }
    // phones have a narrow canvas: shrink the sculpture so the rings aren't cropped
    const targetScale = isMobile ? 0.62 + (reduced ? 0 : Math.sin(t * 1.4) * 0.025) : 1;
    group.current.scale.setScalar(MathUtils.lerp(group.current.scale.x, targetScale, 0.1));
    const targetX = state.pointer.y * 0.25 + scroll.current * 0.9;
    group.current.rotation.x = MathUtils.lerp(group.current.rotation.x, targetX, 0.06);
    group.current.rotation.z = MathUtils.lerp(group.current.rotation.z, state.pointer.x * 0.12, 0.06);
  });

  return (
    <group ref={group}>
      <Float speed={1.4} rotationIntensity={0.35} floatIntensity={0.8}>
        <mesh scale={1.35}>
          <sphereGeometry args={[1, 64, 64]} />
          <MeshDistortMaterial color="#1a1a24" metalness={0.6} roughness={0.25} distort={0.42} speed={1.6} />
        </mesh>
      </Float>
      <mesh ref={shell} scale={2.05}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#bfff3c" wireframe transparent opacity={0.28} />
      </mesh>
      <mesh rotation={[Math.PI / 2.2, 0, 0]} scale={2.6}>
        <torusGeometry args={[1, 0.004, 8, 128]} />
        <meshBasicMaterial color="#8b7cff" transparent opacity={0.5} />
      </mesh>
      <mesh rotation={[Math.PI / 1.7, 0.4, 0]} scale={2.9}>
        <torusGeometry args={[1, 0.002, 8, 128]} />
        <meshBasicMaterial color="#bfff3c" transparent opacity={0.18} />
      </mesh>
      <Sparkles count={80} scale={8} size={2.2} speed={0.3} opacity={0.5} color="#bfff3c" />
    </group>
  );
}

export default function HeroScene() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  return (
    <Canvas
      dpr={[1, 1.8]}
      camera={{ position: [0, 0, 6], fov: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      frameloop={reduced ? 'demand' : 'always'}
      aria-hidden
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 4]} intensity={2} />
      <pointLight position={[-5, -2, -4]} intensity={60} distance={18} color="#bfff3c" />
      <pointLight position={[5, -3, 2]} intensity={40} distance={16} color="#8b7cff" />
      <Sculpture reduced={reduced} />
    </Canvas>
  );
}
