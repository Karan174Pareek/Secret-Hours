import React, { useRef, useMemo, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { AdaptiveDpr, PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Custom GLSL Shader for flowing Indian Zari Silk Fabric
 * Simulates organic ripples, gold specular glints, and cloth drape
 */
const FabricShader = {
  uniforms: {
    uTime: { value: 0 },
    uScroll: { value: 0 },
    uPointer: { value: new THREE.Vector2(0, 0) },
    uColorBase: { value: new THREE.Color('#FAF8F5') },
    uColorShadow: { value: new THREE.Color('#E5DEC9') },
    uColorGold: { value: new THREE.Color('#C59B27') },
  },
  vertexShader: `
    uniform float uTime;
    uniform float uScroll;
    uniform vec2 uPointer;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vUv = uv;
      vec3 pos = position;

      // Compound sinusoidal wave simulation for silk drape
      float wave1 = sin(pos.x * 2.0 + uTime * 1.2) * cos(pos.y * 1.8 + uTime * 0.9) * 0.28;
      float wave2 = sin(pos.x * 3.5 - pos.y * 2.2 + uTime * 1.6) * 0.12;
      float wave3 = cos((pos.x + pos.y) * 4.0 + uTime * 0.8) * 0.08;

      // Pointer interaction wave
      float distToPointer = length(pos.xy - uPointer * 2.5);
      float ripple = sin(distToPointer * 6.0 - uTime * 2.5) * exp(-distToPointer * 1.2) * 0.18;

      // Scroll linked depth wave
      float scrollWave = sin(pos.y * 3.0 + uScroll * 4.0) * 0.2;

      pos.z += wave1 + wave2 + wave3 + ripple + scrollWave;

      // Normal recalculation approximation
      vec3 transformedNormal = normal;
      transformedNormal.x += cos(pos.x * 2.0 + uTime) * 0.25;
      transformedNormal.y += sin(pos.y * 1.8 + uTime) * 0.25;
      vNormal = normalize(normalMatrix * transformedNormal);

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform vec3 uColorBase;
    uniform vec3 uColorShadow;
    uniform vec3 uColorGold;
    uniform float uTime;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);

      // Diffuse lighting
      vec3 lightDir = normalize(vec3(0.5, 0.8, 1.0));
      float diff = max(dot(normal, lightDir), 0.0);

      // Specular zari gold sheen (silk luster)
      vec3 halfDir = normalize(lightDir + viewDir);
      float spec = pow(max(dot(normal, halfDir), 0.0), 32.0);

      // Fresnel rim effect (delicate edge glow)
      float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.0);

      // Blend base ivory silk with shadow folds
      vec3 surfaceColor = mix(uColorShadow, uColorBase, diff * 0.8 + 0.2);

      // Add zari antique gold luster
      surfaceColor += uColorGold * spec * 0.65;
      surfaceColor += uColorGold * fresnel * 0.35;

      gl_FragColor = vec4(surfaceColor, 0.94);
    }
  `
};

/**
 * Flowing Silk Drape Mesh inside Canvas
 */
function FlowingFabricMesh({ smoothScroll, smoothPointerX, smoothPointerY }) {
  const meshRef = useRef();

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uScroll: { value: 0 },
    uPointer: { value: new THREE.Vector2(0, 0) },
    uColorBase: { value: new THREE.Color('#FAF8F5') },
    uColorShadow: { value: new THREE.Color('#DFD6C2') },
    uColorGold: { value: new THREE.Color('#C59B27') },
  }), []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Advance time uniform
    uniforms.uTime.value += delta * 0.85;

    // ZERO React setState: directly sample smoothed Motion values via .get()
    if (smoothScroll) {
      uniforms.uScroll.value = smoothScroll.get();
    }
    if (smoothPointerX && smoothPointerY) {
      uniforms.uPointer.value.set(smoothPointerX.get(), smoothPointerY.get());
    }

    // Subtle overall mesh breathing rotation
    meshRef.current.rotation.z = Math.sin(uniforms.uTime.value * 0.2) * 0.04;
    meshRef.current.rotation.x = -0.35 + (smoothPointerY ? smoothPointerY.get() * 0.08 : 0);
    meshRef.current.rotation.y = 0.25 + (smoothPointerX ? smoothPointerX.get() * 0.08 : 0);
  });

  return (
    <mesh ref={meshRef} position={[0.8, -0.2, 0]} rotation={[-0.35, 0.25, 0]}>
      <planeGeometry args={[7, 5, 64, 64]} />
      <shaderMaterial
        args={[FabricShader]}
        uniforms={uniforms}
        transparent={true}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/**
 * WebGL Support & Low-Power / Reduced-Motion Detection
 */
function useCanRenderWebGL() {
  const [canRender, setCanRender] = useState(true);

  useEffect(() => {
    // 1. Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setCanRender(false);
      return;
    }

    // 2. Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setCanRender(false);
      }
    } catch {
      setCanRender(false);
    }
  }, []);

  return canRender;
}

/**
 * HeroFabricCanvas
 * Full-screen or hero-contained WebGL scene with automatic off-screen pause
 */
export default function HeroFabricCanvas({
  smoothScroll,
  smoothPointerX,
  smoothPointerY,
  isVisible = true,
}) {
  const canRenderWebGL = useCanRenderWebGL();
  const [dpr, setDpr] = useState(1.5);

  // Fallback to static editorial image if WebGL is disabled or reduced-motion is requested
  if (!canRenderWebGL) {
    return (
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-40 mix-blend-multiply"
        style={{
          backgroundImage:
            'radial-gradient(circle at 70% 40%, rgba(197, 155, 39, 0.18) 0%, transparent 60%), linear-gradient(135deg, #FAF8F5 0%, #EFE8DC 100%)',
        }}
      />
    );
  }

  // If scrolled far out of view, pause/unmount rendering
  if (!isVisible) {
    return <div className="absolute inset-0 bg-transparent pointer-events-none" />;
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={dpr}
      >
        <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(1.5)} />
        <AdaptiveDpr pixelated={false} />
        
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 6, 4]} intensity={1.4} color="#FFF8E7" />
        <pointLight position={[-4, -2, 2]} intensity={0.6} color="#C59B27" />

        <Suspense fallback={null}>
          <FlowingFabricMesh
            smoothScroll={smoothScroll}
            smoothPointerX={smoothPointerX}
            smoothPointerY={smoothPointerY}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
