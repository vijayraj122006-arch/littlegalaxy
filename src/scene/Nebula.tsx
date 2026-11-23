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
      uColorCore: { value: new THREE.Color('#ff5fb7') },
      uColorMid: { value: new THREE.Color('#7c3aed') },
      uColorOuter: { value: new THREE.Color('#38bdf8') },
      uTimeOfDay: { value: timeOfDay },
      uOpacity: { value: 0.65 },
    }),
    []
  );

  useFrame((state, delta) => {
    if (meshRef.current) {
      uniforms.uTime.value = state.clock.getElapsedTime();
      uniforms.uTimeOfDay.value = timeOfDay;
      meshRef.current.rotation.y += delta * 0.004;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} scale={[1, 1, 1]}>
      <sphereGeometry args={[140, 32, 32]} />
      <shaderMaterial
        vertexShader={nebulaVert}
        fragmentShader={nebulaFrag}
        uniforms={uniforms}
        side={THREE.BackSide}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
};
