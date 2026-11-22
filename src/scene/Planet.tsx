import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PlanetDef } from '../content/planets';
import { useUniverse } from '../store/useUniverse';
import { audioSynth } from '../utils/audioSynth';

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

  useFrame((_, delta) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += delta * 0.25;
      sphereRef.current.rotation.x += delta * 0.05;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y -= delta * 0.15;
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    audioSynth.playWhoosh();
    audioSynth.playChime(523.25);
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
      {/* Planetary Body */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[planet.size, 32, 32]} />
        <meshStandardMaterial
          color={color}
          roughness={0.65}
          metalness={0.2}
          emissive={color}
          emissiveIntensity={hovered ? 0.35 : 0.15}
        />
      </mesh>

      {/* Atmospheric Glow Shell */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[planet.size * 1.25, 32, 32]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={hovered ? 0.45 : (isVisited ? 0.35 : 0.22)}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Subtle Planetary Ring for visual delight */}
      <mesh rotation={[Math.PI / 3, Math.PI / 6, 0]}>
        <ringGeometry args={[planet.size * 1.4, planet.size * 1.85, 48]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Subtle Marker Label or Visited Sparkle */}
      {isVisited && (
        <mesh position={[0, planet.size * 1.6, 0]}>
          <octahedronGeometry args={[0.2, 0]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
      )}
    </group>
  );
};
