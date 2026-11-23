import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Nebula: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Generate lightweight, gorgeous cosmic dust dome texture once
  const nebulaTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // Deep space gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0.0, '#030209');
    grad.addColorStop(0.3, '#090518');
    grad.addColorStop(0.5, '#120824');
    grad.addColorStop(0.7, '#070a1e');
    grad.addColorStop(1.0, '#020208');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);

    // Ethereal cosmic dust clouds (soft airbrush blobs)
    const clouds = [
      { x: 120, y: 110, r: 140, color: 'rgba(255, 95, 183, 0.08)' },
      { x: 260, y: 150, r: 180, color: 'rgba(124, 58, 237, 0.12)' },
      { x: 380, y: 90, r: 130, color: 'rgba(56, 189, 248, 0.08)' },
      { x: 480, y: 170, r: 160, color: 'rgba(255, 95, 183, 0.07)' },
      { x: 200, y: 70, r: 120, color: 'rgba(79, 214, 208, 0.06)' },
    ];

    clouds.forEach((c) => {
      const radGrad = ctx.createRadialGradient(c.x, c.y, 10, c.x, c.y, c.r);
      radGrad.addColorStop(0, c.color);
      radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radGrad;
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fill();
    });

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    return tex;
  }, []);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.003;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[140, 32, 32]} />
      <meshBasicMaterial
        map={nebulaTexture}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
};
