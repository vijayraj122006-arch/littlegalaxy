import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PlanetDef } from '../content/planets';
import { useUniverse } from '../store/useUniverse';
import { audioManager } from '../utils/audioManager';
import {
  getMoonTexture,
  getGasGiantTexture,
  getIceGiantTexture,
} from '../utils/planetTextures';

interface PlanetProps {
  planet: PlanetDef;
}

type MoonTextures = { type: 'moon'; map: THREE.CanvasTexture; bump: THREE.CanvasTexture };
type RingedTextures = { type: 'gas' | 'ice'; map: THREE.CanvasTexture; ring: THREE.CanvasTexture };
type PlanetTextures = MoonTextures | RingedTextures;

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

  const planetRadius = planet.size * 1.1;

  // Load procedural textures for realistic planet look
  const textures = useMemo<PlanetTextures>(() => {
    if (planet.id === 'planet-first-meeting') {
      const data = getMoonTexture();
      return { type: 'moon', map: data.map, bump: data.bump };
    } else if (planet.id === 'planet-playlist') {
      const data = getGasGiantTexture();
      return { type: 'gas', map: data.map, ring: data.ring };
    } else {
      const data = getIceGiantTexture();
      return { type: 'ice', map: data.map, ring: data.ring };
    }
  }, [planet.id]);

  useFrame((state, delta) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += delta * 0.18;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y -= delta * 0.08;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.04;
    }
    // Subtle real-time orbital drift along 3D elliptical track
    if (groupRef.current) {
      const time = state.clock.getElapsedTime() * 0.025;
      const [bx, by, bz] = planet.position;
      const initialAngle = Math.atan2(bz, bx);
      const currentAngle = initialAngle + time;
      const r = Math.sqrt(bx * bx + bz * bz);
      groupRef.current.position.x = Math.cos(currentAngle) * r;
      groupRef.current.position.z = Math.sin(currentAngle) * r;
      groupRef.current.position.y = by + Math.sin(time * 2.0) * 0.6;
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    audioManager.playWhoosh();
    audioManager.playChime(523.25);
    if (groupRef.current) {
      const pos: [number, number, number] = [
        groupRef.current.position.x,
        groupRef.current.position.y,
        groupRef.current.position.z,
      ];
      setCameraFocusPos(pos);
    } else {
      setCameraFocusPos(planet.position);
    }
    setFocusedTarget({ type: 'planet', id: planet.id });
  };

  const glowColor = new THREE.Color(planet.glowColor);

  return (
    <group
      ref={groupRef}
      position={planet.position}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.08 : 1.0}
    >
      {/* 1. Realistic 3D Planet Surface Sphere */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[planetRadius, 48, 48]} />
        {textures.type === 'moon' && (
          <meshStandardMaterial
            map={textures.map}
            bumpMap={textures.bump}
            bumpScale={0.06}
            roughness={0.85}
            metalness={0.1}
            emissive={new THREE.Color('#38070d')}
            emissiveIntensity={hovered ? 0.4 : 0.2}
          />
        )}
        {textures.type === 'gas' && (
          <meshStandardMaterial
            map={textures.map}
            roughness={0.4}
            metalness={0.15}
            emissive={new THREE.Color('#331d04')}
            emissiveIntensity={hovered ? 0.35 : 0.15}
          />
        )}
        {textures.type === 'ice' && (
          <meshStandardMaterial
            map={textures.map}
            roughness={0.35}
            metalness={0.25}
            emissive={new THREE.Color('#031f3b')}
            emissiveIntensity={hovered ? 0.4 : 0.18}
          />
        )}
      </mesh>

      {/* 2. Realistic Atmospheric Edge Glow (BackSide Fresnel Rim) */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[planetRadius * 1.15, 36, 36]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={hovered ? 0.55 : (isVisited ? 0.35 : 0.22)}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* 3. Outer Ethereal Soft Corona */}
      <mesh>
        <sphereGeometry args={[planetRadius * 1.35, 24, 24]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={hovered ? 0.2 : 0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* 4. Realistic Rings (for Gas Giant & Ice Giant) */}
      {'ring' in textures && textures.ring && (
        <mesh
          ref={ringRef}
          rotation={[Math.PI / 2.8, Math.PI / 6, 0]}
        >
          <ringGeometry args={[planetRadius * 1.4, planetRadius * 2.4, 64]} />
          <meshBasicMaterial
            map={textures.ring}
            transparent
            opacity={hovered ? 0.9 : 0.75}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
};
