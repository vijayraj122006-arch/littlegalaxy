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
  const ringRef = useRef<THREE.Mesh>(null);

  const [hovered, setHovered] = useState(false);
  const visitedPlanets = useUniverse((s) => s.visitedPlanets);
  const isVisited = visitedPlanets.includes(planet.id);

  const setFocusedTarget = useUniverse((s) => s.setFocusedTarget);
  const setCameraFocusPos = useUniverse((s) => s.setCameraFocusPos);

  const color = new THREE.Color(planet.color);
  const glowColor = new THREE.Color(planet.glowColor);
  const planetRadius = planet.size;

  useFrame((_, delta) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += delta * 0.25;
      sphereRef.current.rotation.x += delta * 0.04;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y -= delta * 0.15;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.08;
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
      {/* 3D Planet Core */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[planetRadius, 48, 48]} />
        <meshStandardMaterial
          color={color}
          roughness={0.45}
          metalness={0.2}
          emissive={color}
          emissiveIntensity={hovered ? 0.65 : (isVisited ? 0.45 : 0.3)}
        />
      </mesh>

      {/* Atmospheric Fresnel Glow Shell */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[planetRadius * 1.22, 36, 36]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={hovered ? 0.55 : 0.35}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Outer Ethereal Halo */}
      <mesh>
        <sphereGeometry args={[planetRadius * 1.45, 24, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 0.25 : 0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Radiant Planetary Rings */}
      <mesh ref={ringRef} rotation={[Math.PI / 3, Math.PI / 5, 0]}>
        <ringGeometry args={[planetRadius * 1.5, planetRadius * 2.3, 64]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={hovered ? 0.65 : 0.45}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Clean, Non-Suspending HTML Planet Label */}
      <Html
        center
        position={[0, planetRadius * 1.9, 0]}
        distanceFactor={32}
        zIndexRange={[10, 0]}
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          color: '#ffffff',
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontSize: '13px',
          fontWeight: 600,
          letterSpacing: '0.8px',
          textShadow: '0 2px 10px rgba(0,0,0,0.9), 0 0 12px rgba(255,255,255,0.7)',
          background: 'rgba(8, 7, 24, 0.78)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          padding: '4px 12px',
          borderRadius: '14px',
          border: `1px solid ${planet.color}aa`,
          boxShadow: `0 4px 15px rgba(0,0,0,0.5), 0 0 15px ${planet.color}33`,
          transform: hovered ? 'scale(1.15)' : 'scale(1)',
          transition: 'transform 0.2s ease',
        }}
      >
        🪐 {planet.name}
      </Html>
    </group>
  );
};
