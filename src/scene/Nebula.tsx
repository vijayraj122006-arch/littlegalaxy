import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import nebulaFrag from '../shaders/nebula.frag.glsl';
import { useTimeOfDay } from '../hooks/useTimeOfDay';

const nebulaVert = `
varying vec2 vUv;
varying vec3 vPosition;

void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const Nebula: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const timeOfDay = useTimeOfDay();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorCore: { value: new THREE.Color('#ff4d8d') }, // romantic warm rose
      uColorMid: { value: new THREE.Color('#8b5cf6') },  // deep celestial violet
      uColorOuter: { value: new THREE.Color('#38bdf8') }, // soft cyan starlight
      uTimeOfDay: { value: timeOfDay },
      uOpacity: { value: 0.6 },
    }),
    []
  );

  useFrame((state, delta) => {
    if (meshRef.current) {
      uniforms.uTime.value = state.clock.getElapsedTime();
      uniforms.uTimeOfDay.value = timeOfDay;
      meshRef.current.rotation.y += delta * 0.008;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} scale={[1, 0.45, 1]}>
      <sphereGeometry args={[90, 32, 32]} />
      <shaderMaterial
        vertexShader={nebulaVert}
        fragmentShader={nebulaFrag}
        uniforms={uniforms}
        side={THREE.BackSide}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};
