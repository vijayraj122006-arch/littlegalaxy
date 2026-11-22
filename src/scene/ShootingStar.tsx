import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useUniverse } from '../store/useUniverse';

interface Trail {
  id: number;
  start: THREE.Vector3;
  dir: THREE.Vector3;
  progress: number;
  speed: number;
  length: number;
  color: THREE.Color;
}

export const ShootingStar: React.FC = () => {
  const stage = useUniverse((s) => s.stage);
  const wishes = useUniverse((s) => s.wishes);
  const [trails, setTrails] = useState<Trail[]>([]);
  const trailIdRef = useRef(0);

  // Spawn shooting star helper
  const spawnStar = (isFinale = false) => {
    const id = ++trailIdRef.current;
    const startX = (Math.random() - 0.5) * 40;
    const startY = 15 + Math.random() * 15;
    const startZ = (Math.random() - 0.5) * 40;

    const angle = (Math.random() * 0.4 + 0.6) * Math.PI; // diagonal downwards
    const dir = new THREE.Vector3(
      Math.cos(angle) * (Math.random() < 0.5 ? 1 : -1),
      -Math.sin(angle),
      (Math.random() - 0.5) * 0.5
    ).normalize();

    const colors = ['#fff4e0', '#ffd48a', '#4fd6d0', '#ff5fb7'];
    const chosenColor = new THREE.Color(colors[Math.floor(Math.random() * colors.length)]);

    const newTrail: Trail = {
      id,
      start: new THREE.Vector3(startX, startY, startZ),
      dir,
      progress: 0,
      speed: isFinale ? 0.035 + Math.random() * 0.03 : 0.02 + Math.random() * 0.015,
      length: 6 + Math.random() * 6,
      color: chosenColor,
    };

    setTrails((prev) => [...prev.slice(-15), newTrail]);
  };

  // Periodic random shooting star
  useEffect(() => {
    const interval = setInterval(() => {
      spawnStar(stage === 'finale');
    }, stage === 'finale' ? 600 : 4500);

    return () => clearInterval(interval);
  }, [stage]);

  // When a new wish is added, immediately launch a shooting star!
  useEffect(() => {
    if (wishes.length > 0) {
      spawnStar(false);
    }
  }, [wishes.length]);

  useFrame((_, delta) => {
    setTrails((prev) =>
      prev
        .map((t) => ({ ...t, progress: t.progress + t.speed * (delta * 60) }))
        .filter((t) => t.progress < 1.4)
    );
  });

  return (
    <group>
      {trails.map((t) => {
        const head = t.start.clone().addScaledVector(t.dir, t.progress * 40);
        const tail = head.clone().addScaledVector(t.dir, -t.length * Math.min(1, t.progress * 2));
        const alpha = Math.max(0, 1 - Math.pow(t.progress, 1.8));

        const positions = new Float32Array([
          head.x, head.y, head.z,
          tail.x, tail.y, tail.z
        ]);

        return (
          <line key={t.id}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[positions, 3]}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color={t.color}
              transparent
              opacity={alpha}
              linewidth={2}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </line>
        );
      })}
    </group>
  );
};
