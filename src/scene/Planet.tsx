import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { PlanetDef } from '../content/planets';
import { useUniverse } from '../store/useUniverse';
import { audioSynth } from '../utils/audioSynth';
import { Sparkles } from 'lucide-react';

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
  const planetRadius = planet.size * 1.35; // increased size for clear visibility

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
      {/* 3D Planet Core Sphere */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[planetRadius, 32, 32]} />
        <meshStandardMaterial
          color={color}
          roughness={0.4}
          metalness={0.15}
          emissive={color}
          emissiveIntensity={hovered ? 0.65 : 0.4}
        />
      </mesh>

      {/* Atmospheric Glow Shell */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[planetRadius * 1.25, 32, 32]} />
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

      {/* Radiant Planetary Ring */}
      <mesh rotation={[Math.PI / 3, Math.PI / 6, 0]}>
        <ringGeometry args={[planetRadius * 1.45, planetRadius * 2.1, 48]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.45}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Floating 3D Label Tag */}
      <Html
        position={[0, planetRadius * 1.8, 0]}
        center
        distanceFactor={22}
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
          whiteSpace: 'nowrap'
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: isVisited ? 'rgba(79, 214, 208, 0.45)' : 'rgba(13, 11, 46, 0.85)',
          backdropFilter: 'blur(8px)',
          border: `1px solid ${planet.glowColor}88`,
          borderRadius: '18px',
          padding: '5px 12px',
          color: '#fff',
          fontSize: '12px',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 600,
          boxShadow: `0 0 20px ${planet.color}66`,
          textShadow: '0 0 4px #000',
          transform: hovered ? 'scale(1.12)' : 'scale(1)',
          transition: 'transform 0.2s ease'
        }}>
          <Sparkles size={12} color={planet.color} />
          <span>{planet.name}</span>
        </div>
      </Html>
    </group>
  );
};
