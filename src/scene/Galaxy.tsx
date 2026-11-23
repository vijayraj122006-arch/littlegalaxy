import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { generateGalaxyData } from '../utils/galaxyMath';
import { getParticleBudget } from '../utils/device';
import starVert from '../shaders/star.vert.glsl';
import starFrag from '../shaders/star.frag.glsl';

export const Galaxy: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const shaderMatRef = useRef<THREE.ShaderMaterial>(null);
  const { gl } = useThree();

  const particleCount = useMemo(() => getParticleBudget(), []);
  const galaxyData = useMemo(() => generateGalaxyData(particleCount), [particleCount]);

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
      uSizeMultiplier: { value: 1.15 },
    }),
    [gl]
  );

  useFrame((state, delta) => {
    if (shaderMatRef.current) {
      shaderMatRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.02;
    }
    if (coreRef.current) {
      coreRef.current.rotation.y -= delta * 0.05;
    }
  });

  return (
    <group>
      {/* 3D Spiral Arms Point Cloud */}
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

      {/* Central Radiant Galactic Sun Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[1.3, 32, 32]} />
        <meshBasicMaterial
          color="#fff6e5"
          toneMapped={false}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshBasicMaterial
          color="#ffd48a"
          transparent
          opacity={0.3}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};
