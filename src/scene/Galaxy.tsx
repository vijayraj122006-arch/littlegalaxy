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

  // Robust Three.js BufferGeometry creation with standard attributes
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(galaxyData.positions, 3));
    geo.setAttribute('aColor', new THREE.BufferAttribute(galaxyData.colors, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(galaxyData.sizes, 1));
    geo.setAttribute('aTwinkle', new THREE.BufferAttribute(galaxyData.twinkles, 1));
    return geo;
  }, [galaxyData]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
      uSizeMultiplier: { value: 1.2 },
    }),
    [gl]
  );

  useFrame((state, delta) => {
    if (shaderMatRef.current) {
      shaderMatRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.025;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
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
