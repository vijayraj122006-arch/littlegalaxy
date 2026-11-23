import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { PlanetDef } from '../content/planets';
import { useUniverse } from '../store/useUniverse';
import { audioManager } from '../utils/audioManager';

interface PlanetProps {
  planet: PlanetDef;
}

export const Planet: React.FC<PlanetProps> = ({ planet }) => {
  const groupRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);

  const [hovered, setHovered] = useState(false);
  const visitedPlanets = useUniverse((s) => s.visitedPlanets);
  const isVisited = visitedPlanets.includes(planet.id);

  const setFocusedTarget = useUniverse((s) => s.setFocusedTarget);
  const setCameraFocusPos = useUniverse((s) => s.setCameraFocusPos);

  const color = new THREE.Color(planet.color);
  const glowColor = new THREE.Color(planet.glowColor);
  const planetRadius = planet.size * 1.35;

  useFrame((_, delta) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += delta * 0.3;
      sphereRef.current.rotation.x += delta * 0.05;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y -= delta * 0.2;
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    audioManager.playWhoosh();
    audioManager.playChime(523.25);
    setCameraFocusPos(planet.position);
    setFocusedTarget({ type: 'planet', id: planet.id });
  };

  return (
    <group
      ref={groupRef}
      position={planet.position}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* 3D Planet Core Sphere */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[planetRadius, 32, 32]} />
        <meshStandardMaterial
          color={color}
          roughness={0.35}
          metalness={0.15}
          emissive={color}
          emissiveIntensity={hovered ? 0.75 : 0.45}
        />
      </mesh>

      {/* Atmospheric Glow Shell */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[planetRadius * 1.25, 32, 32]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={hovered ? 0.6 : 0.4}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Radiant Planetary Ring */}
      <mesh rotation={[Math.PI / 3, Math.PI / 6, 0]}>
        <ringGeometry args={[planetRadius * 1.45, planetRadius * 2.1, 48]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Clear, Non-Suspending HTML Planet Label */}
      <Html
        center
        position={[0, planetRadius * 1.8, 0]}
        distanceFactor={28}
        zIndexRange={[10, 0]}
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          color: '#ffffff',
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontSize: '14px',
          fontWeight: 600,
          letterSpacing: '1px',
          textShadow: '0 2px 8px rgba(0,0,0,0.9), 0 0 14px rgba(255,255,255,0.7)',
          background: 'rgba(7, 8, 23, 0.7)',
          padding: '3px 10px',
          borderRadius: '12px',
          border: `1px solid ${planet.color}aa`,
          transform: hovered ? 'scale(1.15)' : 'scale(1)',
          transition: 'transform 0.2s ease',
        }}
      >
        🪐 {planet.name}
      </Html>
    </group>
  );
};
