import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useUniverse } from '../store/useUniverse';

const MAX_STARS = 8;

interface ActiveStar {
  active: boolean;
  start: THREE.Vector3;
  dir: THREE.Vector3;
  progress: number;
  speed: number;
  length: number;
}

export const ShootingStar: React.FC = () => {
  const stage = useUniverse((s) => s.stage);
  const wishes = useUniverse((s) => s.wishes);

  const linesRef = useRef<THREE.LineSegments>(null);
  const poolRef = useRef<ActiveStar[]>(
    Array.from({ length: MAX_STARS }, () => ({
      active: false,
      start: new THREE.Vector3(),
      dir: new THREE.Vector3(),
      progress: 0,
      speed: 0.02,
      length: 8,
    }))
  );

  const posArray = useRef(new Float32Array(MAX_STARS * 6));

  const spawnStar = (isFinale = false) => {
    const star = poolRef.current.find((s) => !s.active);
    if (!star) return;

    star.active = true;
    star.start.set(
      (Math.random() - 0.5) * 45,
      14 + Math.random() * 14,
      (Math.random() - 0.5) * 45
    );

    const angle = (Math.random() * 0.4 + 0.6) * Math.PI;
    star.dir.set(
      Math.cos(angle) * (Math.random() < 0.5 ? 1 : -1),
      -Math.sin(angle),
      (Math.random() - 0.5) * 0.5
    ).normalize();

    star.progress = 0;
    star.speed = isFinale ? 0.035 + Math.random() * 0.02 : 0.018 + Math.random() * 0.012;
    star.length = 6 + Math.random() * 6;
  };

  // Periodic shooting stars
  useEffect(() => {
    const interval = setInterval(() => {
      spawnStar(stage === 'finale');
    }, stage === 'finale' ? 800 : 4000);

    return () => clearInterval(interval);
  }, [stage]);

  // Wish trigger
  useEffect(() => {
    if (wishes.length > 0) {
      spawnStar(false);
    }
  }, [wishes.length]);

  useFrame((_, delta) => {
    if (!linesRef.current) return;
    const geo = linesRef.current.geometry;
    const posAttr = geo.getAttribute('position') as THREE.BufferAttribute;
    if (!posAttr) return;

    const arr = posAttr.array as Float32Array;
    let anyActive = false;

    poolRef.current.forEach((star, idx) => {
      const offset = idx * 6;
      if (star.active) {
        star.progress += star.speed * (delta * 60);

        if (star.progress >= 1.4) {
          star.active = false;
          // Hide vertices
          arr[offset] = 0;
          arr[offset + 1] = 0;
          arr[offset + 2] = 0;
          arr[offset + 3] = 0;
          arr[offset + 4] = 0;
          arr[offset + 5] = 0;
        } else {
          anyActive = true;
          const headX = star.start.x + star.dir.x * star.progress * 42;
          const headY = star.start.y + star.dir.y * star.progress * 42;
          const headZ = star.start.z + star.dir.z * star.progress * 42;

          const len = star.length * Math.min(1, star.progress * 2.5);
          const tailX = headX - star.dir.x * len;
          const tailY = headY - star.dir.y * len;
          const tailZ = headZ - star.dir.z * len;

          arr[offset] = headX;
          arr[offset + 1] = headY;
          arr[offset + 2] = headZ;
          arr[offset + 3] = tailX;
          arr[offset + 4] = tailY;
          arr[offset + 5] = tailZ;
        }
      }
    });

    if (anyActive) {
      posAttr.needsUpdate = true;
    }
  });

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[posArray.current, 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color="#ffd48a"
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  );
};
