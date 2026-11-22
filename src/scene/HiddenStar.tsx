import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useUniverse } from '../store/useUniverse';
import { audioSynth } from '../utils/audioSynth';

export const HiddenStar: React.FC = () => {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const setFocusedTarget = useUniverse((s) => s.setFocusedTarget);
  const setCameraFocusPos = useUniverse((s) => s.setCameraFocusPos);
  const triggerEasterEgg = useUniverse((s) => s.triggerEasterEgg);
  const easterEggFound = useUniverse((s) => s.easterEggFound);

  const position: [number, number, number] = [0.8, -4.2, -3.5];

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime() * 3.0;
      // Secret gentle sparkle
      meshRef.current.rotation.y = t * 0.5;
      meshRef.current.rotation.z = t * 0.3;
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    audioSynth.playChime(1046.5); // high C crystal chime
    triggerEasterEgg();
    setCameraFocusPos(position);
    setFocusedTarget({ type: 'hidden', id: 'easter-egg-star' });
  };

  return (
    <group
      ref={meshRef}
      position={position}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <mesh>
        <octahedronGeometry args={[easterEggFound ? 0.35 : 0.18, 0]} />
        <meshBasicMaterial
          color={easterEggFound ? '#ff5fb7' : (hovered ? '#ffffff' : '#e0e7ff')}
          transparent
          opacity={easterEggFound ? 0.9 : (hovered ? 0.8 : 0.4)}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
};
