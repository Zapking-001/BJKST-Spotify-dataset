import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float time;
  uniform vec3 colorBase;
  uniform vec3 colorGlow;
  varying vec2 vUv;

  // Generic 2D noise
  float rand(vec2 n) { 
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
  }
  float noise(vec2 p){
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u*u*(3.0-2.0*u);
    float res = mix(
      mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
      mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
    return res*res;
  }

  void main() {
    vec2 uv = vUv;
    float t = time * 0.05;
    
    // Slow fluid nebula effect
    float n = noise(uv * 3.0 + t);
    n += noise(uv * 6.0 - t * 0.5) * 0.5;
    n += noise(uv * 12.0 + t * 0.2) * 0.25;
    
    // Vignette
    float dist = distance(uv, vec2(0.5));
    float vignette = smoothstep(0.8, 0.2, dist);

    vec3 finalColor = mix(colorBase, colorGlow, n * 0.4);
    finalColor *= vignette;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export const BackgroundShader = ({ currentAct }: { currentAct: number }) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
    }
  });

  const baseColor = new THREE.Color('#05070B');
  let glowColor = new THREE.Color('#064e3b'); // Act 1: Dark emerald
  if (currentAct === 2) glowColor = new THREE.Color('#164e63'); // Act 2: Dark cyan
  else if (currentAct === 3) glowColor = new THREE.Color('#881337'); // Act 3: Dark rose
  else if (currentAct === 4) glowColor = new THREE.Color('#78350f'); // Act 4: Dark amber

  return (
    <mesh>
      <planeGeometry args={[100, 100]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          time: { value: 0 },
          colorBase: { value: baseColor },
          colorGlow: { value: glowColor }
        }}
        depthWrite={false}
      />
    </mesh>
  );
};
