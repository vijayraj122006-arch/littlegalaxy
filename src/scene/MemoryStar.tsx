import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Memory } from '../content/memories';
import { useUniverse } from '../store/useUniverse';
import { audioManager } from '../utils/audioManager';

interface MemoryStarProps {
  memory: Memory;
}

export const MemoryStar: React.FC<MemoryStarProps> = ({ memory }) => {
  const meshRef = useRef<THREE.Group>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  
  const visitedMemories = useUniverse((s) => s.visitedMemories);
  const isVisited = visitedMemories.includes(memory.id);

  const setFocusedTarget = useUniverse((s) => s.setFocusedTarget);
  const setCameraFocusPos = useUniverse((s) => s.setCameraFocusPos);

  const [hovered, setHovered] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimerRef = useRef<number | null>(null);

  const color = new THREE.Color(memory.color);
  const baseScale = isVisited ? 1.25 : 1.05;

  useFrame((state, delta) => {
    if (haloRef.current) {
      const t = state.clock.getElapsedTime() * 2.2 + memory.position[0];
      const pulse = Math.sin(t) * 0.18 + 1.1;
      haloRef.current.scale.setScalar((hovered ? 1.4 : 1.0) * pulse * baseScale);
    }

    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 1.2;
    }
  });

  const triggerOpen = () => {
    audioManager.playWhoosh();
    audioManager.playChime(784);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate([30, 50, 90]); } catch {}
    }
    setCameraFocusPos(memory.position);
    setFocusedTarget({ type: 'memory', id: memory.id });
  };

  const handlePointerDown = (e: any) => {
    e.stopPropagation();

    if (memory.interaction === 'hold' && !isVisited) {
      let start = performance.now();
      const duration = 1000;
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try { navigator.vibrate(25); } catch {}
      }

      const step = () => {
        const elapsed = performance.now() - start;
        const p = Math.min(1, elapsed / duration);
        setHoldProgress(p);

        if (p < 1) {
          holdTimerRef.current = requestAnimationFrame(step);
        } else {
          setHoldProgress(0);
          holdTimerRef.current = null;
          triggerOpen();
        }
      };
      holdTimerRef.current = requestAnimationFrame(step);
    } else {
      triggerOpen();
    }
  };

  const handlePointerUp = () => {
    if (holdTimerRef.current) {
      cancelAnimationFrame(holdTimerRef.current);
      holdTimerRef.current = null;
      setHoldProgress(0);
    }
  };

  return (
    <group
      ref={meshRef}
      position={memory.position}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Central Radiant White Star Core */}
      <mesh>
        <sphereGeometry args={[0.5 * baseScale, 24, 24]} />
        <meshBasicMaterial
          color="#ffffff"
          toneMapped={false}
        />
      </mesh>

      {/* Atmospheric Glowing Corona */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[1.15 * baseScale, 24, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isVisited ? 0.7 : (hovered ? 0.85 : 0.5)}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Delicate Star Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <ringGeometry args={[1.05 * baseScale, 1.25 * baseScale, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Charging hold ring */}
      {holdProgress > 0 && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.2, 1.5, 32]} />
          <meshBasicMaterial
            color="#ffd48a"
            transparent
            opacity={0.5 + holdProgress * 0.5}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      )}

      {/* Clean, Non-Suspending Frosted Starlight Badge */}
      <Html
        center
        position={[0, 1.6 * baseScale, 0]}
        distanceFactor={28}
        zIndexRange={[10, 0]}
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          color: '#ffffff',
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '0.5px',
          textShadow: '0 2px 8px rgba(0,0,0,0.9), 0 0 10px rgba(255,255,255,0.6)',
          background: 'rgba(8, 7, 24, 0.72)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          padding: '3px 10px',
          borderRadius: '12px',
          border: `1px solid ${memory.color}88`,
          boxShadow: `0 2px 10px rgba(0,0,0,0.5), 0 0 12px ${memory.color}22`,
          transform: hovered ? 'scale(1.15)' : 'scale(1)',
          transition: 'transform 0.2s ease',
        }}
      >
        ✨ {memory.title}
      </Html>
    </group>
  );
};
