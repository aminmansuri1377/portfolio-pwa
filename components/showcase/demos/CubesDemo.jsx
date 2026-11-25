import { useMemo, useRef } from 'react';
import { ManagedCanvas as Canvas, useSceneFrame } from '../Graphics';
import { Color, Object3D, Plane, Vector3 } from 'three';

const N = 48;
const GAP = 0.34;
const SIZE = GAP * 0.78;

function Grid() {
  const mesh = useRef();
  const light = useRef();
  const dummy = useMemo(() => new Object3D(), []);
  const color = useMemo(() => new Color(), []);
  const palette = useMemo(
    () => ({ low: new Color('#1a1a2a'), mid: new Color('#8b7cff'), high: new Color('#bfff3c') }),
    []
  );
  const plane = useMemo(() => new Plane(new Vector3(0, 1, 0), 0), []);
  const hit = useMemo(() => new Vector3(), []);
  const cursor = useRef(new Vector3(0, 0, 0));

  useSceneFrame((state, delta, elapsed, animate) => {
    const t = elapsed;
    state.raycaster.setFromCamera(state.pointer, state.camera);
    if (state.raycaster.ray.intersectPlane(plane, hit)) cursor.current.lerp(hit, animate ? .14 : 1);
    const cx = cursor.current.x;
    const cz = cursor.current.z;

    let i = 0;
    for (let ix = 0; ix < N; ix++) {
      for (let iz = 0; iz < N; iz++) {
        const x = (ix - N / 2 + 0.5) * GAP;
        const z = (iz - N / 2 + 0.5) * GAP;
        const wave = 0.32 * Math.sin(x * 0.9 + t * 1.2) * Math.cos(z * 0.9 - t * 0.9);
        const dist = Math.hypot(x - cx, z - cz);
        const bump = Math.exp(-dist * dist * 0.7) * 1.9 * (0.65 + 0.35 * Math.sin(t * 4 - dist * 3));
        const h = Math.max(0.12, 0.55 + wave + bump);

        dummy.position.set(x, h / 2, z);
        dummy.scale.set(1, h, 1);
        dummy.updateMatrix();
        mesh.current.setMatrixAt(i, dummy.matrix);

        const n = Math.min(1, Math.max(0, (h - 0.2) / 2.1));
        if (n < 0.5) color.copy(palette.low).lerp(palette.mid, n * 2);
        else color.copy(palette.mid).lerp(palette.high, (n - 0.5) * 2);
        mesh.current.setColorAt(i, color);
        i++;
      }
    }
    mesh.current.instanceMatrix.needsUpdate = true;
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true;
    if (light.current) light.current.position.set(cx, 2.2, cz);
  });

  return (
    <>
      <instancedMesh ref={mesh} args={[null, null, N * N]} frustumCulled={false}>
        <boxGeometry args={[SIZE, 1, SIZE]} />
        <meshStandardMaterial roughness={0.35} metalness={0.35} />
      </instancedMesh>
      <pointLight ref={light} color="#bfff3c" intensity={30} distance={9} />
    </>
  );
}

export default function CubesDemo() {
  return (
    <Canvas dpr={[1, 1.6]} camera={{ position: [0, 7.5, 9.5], fov: 45 }}>
      <color attach="background" args={['#050508']} />
      <fog attach="fog" args={['#050508', 10, 22]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 9, 4]} intensity={1.6} />
      <Grid />
    </Canvas>
  );
}
