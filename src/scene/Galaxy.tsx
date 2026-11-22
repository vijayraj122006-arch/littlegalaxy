import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { generateGalaxyData } from '../utils/galaxyMath';
import { getParticleBudget } from '../utils/device';
import starVert from '../shaders/star.vert.glsl';
import starFrag from '../shaders/star.frag.glsl';

export const Galaxy: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const shaderMatRef = useRef<THREE.ShaderMaterial>(null);
  const { gl } = useThree();

  const particleCount = useMemo(() => getParticleBudget(), []);
  const galaxyData = useMemo(() => generateGalaxyData(particleCount), [particleCount]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
      uSizeMultiplier: { value: 1.0 },
    }),
    [gl]
  );

  useFrame((state, delta) => {
    if (shaderMatRef.current) {
      shaderMatRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
    if (pointsRef.current) {
      // Gentle dreamy idle drift
      pointsRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[galaxyData.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-aColor"
          args={[galaxyData.colors, 3]}
        />
        <bufferAttribute
          attach="attributes-aSize"
          args={[galaxyData.sizes, 1]}
        />
        <bufferAttribute
          attach="attributes-aTwinkle"
          args={[galaxyData.twinkles, 1]}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={shaderMatRef}
        vertexShader={starVert}
        fragmentShader={starFrag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};
