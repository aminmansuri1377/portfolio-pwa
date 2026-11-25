import { useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { ManagedCanvas as Canvas, useSceneFrame } from '../Graphics';
import { Vector2 } from 'three';

const vertexShader = /* glsl */ `
  void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

// Domain-warped fractal noise (Inigo Quilez style): f(p + fbm(p + fbm(p)))
const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uRes;
  uniform vec2 uMouse;
  uniform vec2 uClickPos;
  uniform float uClick;

  float hash21(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * vnoise(p);
      p = p * 2.02 + vec2(1.7, 9.2);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uRes;
    vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
    vec2 m = (uMouse * uRes - 0.5 * uRes) / uRes.y;
    float t = uTime * 0.12;

    vec2 q = vec2(fbm(p * 2.0 + t), fbm(p * 2.0 + vec2(5.2, 1.3) - t));
    vec2 r = vec2(
      fbm(p * 2.0 + 4.0 * q + vec2(1.7, 9.2) + 0.6 * t),
      fbm(p * 2.0 + 4.0 * q + vec2(8.3, 2.8) - 0.5 * t)
    );
    float f = fbm(p * 2.0 + 4.0 * r);

    // the pointer is a soft light that bends the field
    float d = length(p - m);
    f += 0.38 * exp(-d * 3.2);

    vec3 ink = vec3(0.024, 0.024, 0.036);
    vec3 violet = vec3(0.545, 0.486, 1.0);
    vec3 lime = vec3(0.749, 1.0, 0.235);

    vec3 col = mix(ink, violet, smoothstep(0.18, 0.72, f));
    col = mix(col, lime, smoothstep(0.62, 1.08, f * f * 1.6 + q.x * 0.25));

    // click ripple
    vec2 cp = (uClickPos * uRes - 0.5 * uRes) / uRes.y;
    float rd = length(p - cp);
    float ring = (1.0 - smoothstep(0.0, 0.04, abs(rd - uClick * 1.5))) * (1.0 - uClick);
    col += lime * 0.35 * ring;

    // vignette + fine grain
    col *= 1.0 - 0.6 * dot(uv - 0.5, uv - 0.5) * 2.0;
    col += (hash21(gl_FragCoord.xy + uTime) - 0.5) * 0.02;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function Field() {
  const gl = useThree((s) => s.gl);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRes: { value: new Vector2(1, 1) },
      uMouse: { value: new Vector2(0.5, 0.5) },
      uClickPos: { value: new Vector2(0.5, 0.5) },
      uClick: { value: 1 },
    }),
    []
  );
  const target = useMemo(() => new Vector2(), []);

  useEffect(() => {
    const el = gl.domElement;
    const down = () => {
      uniforms.uClickPos.value.copy(uniforms.uMouse.value);
      uniforms.uClick.value = 0;
    };
    el.addEventListener('pointerdown', down);
    return () => el.removeEventListener('pointerdown', down);
  }, [gl, uniforms]);

  useSceneFrame((state, delta, elapsed, animate) => {
    const dpr = state.gl.getPixelRatio();
    uniforms.uTime.value = elapsed;
    uniforms.uRes.value.set(state.size.width * dpr, state.size.height * dpr);
    target.set((state.pointer.x + 1) / 2, (state.pointer.y + 1) / 2);
    uniforms.uMouse.value.lerp(target, animate ? .08 : 1);
    uniforms.uClick.value = Math.min(1, uniforms.uClick.value + delta * 0.7);
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function AuroraDemo() {
  return (
    <Canvas dpr={[1, 1.5]} gl={{ antialias: false }}>
      <Field />
    </Canvas>
  );
}
