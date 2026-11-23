import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { generateBackgroundStars } from '../utils/galaxyMath';
import { isMobileDevice } from '../utils/device';

export const Starfield: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = isMobileDevice() ? 1500 : 3500;

  const positions = useMemo(() => generateBackgroundStars(count, 45, 110), [count]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const cols = new Float32Array(count * 3);
    const palette = [
      new THREE.Color('#ffffff'),
      new THREE.Color('#fff4e0'),
      new THREE.Color('#e0e7ff'),
      new THREE.Color('#ffd48a'),
      new THREE.Color('#ff8fa3')
    ];
    for (let i = 0; i < count; i++) {
      const col = palette[Math.floor(Math.random() * palette.length)];
      cols[i * 3] = col.r;
      cols[i * 3 + 1] = col.g;
      cols[i * 3 + 2] = col.b;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(cols, 3));
    return geo;
  }, [count, positions]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.004;
      pointsRef.current.rotation.x += delta * 0.001;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.55}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
