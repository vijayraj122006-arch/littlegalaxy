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
  const baseScale = isVisited ? 1.3 : 1.1;

  useFrame((state, delta) => {
    if (haloRef.current) {
      const t = state.clock.getElapsedTime() * 2.2 + memory.position[0];
      const pulse = Math.sin(t) * 0.2 + 1.1;
      haloRef.current.scale.setScalar((hovered ? 1.5 : 1.0) * pulse * baseScale);
    }

    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 1.5;
    }
  });

  const handlePointerDown = (e: any) => {
    e.stopPropagation();

    if (memory.interaction === 'hold' && !isVisited) {
      let start = performance.now();
      const duration = 1200;
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
          audioManager.playWhoosh();
          audioManager.playChime(880);
          if (typeof navigator !== 'undefined' && navigator.vibrate) {
            try { navigator.vibrate([30, 50, 90]); } catch {}
          }
          setCameraFocusPos(memory.position);
          setFocusedTarget({ type: 'memory', id: memory.id });
        }
      };
      holdTimerRef.current = requestAnimationFrame(step);
    } else {
      audioManager.playChime(659.25);
      setCameraFocusPos(memory.position);
      setFocusedTarget({ type: 'memory', id: memory.id });
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
      {/* Central Radiant Star Sphere */}
      <mesh>
        <sphereGeometry args={[0.55 * baseScale, 24, 24]} />
        <meshBasicMaterial
          color="#ffffff"
          toneMapped={false}
        />
      </mesh>

      {/* Atmospheric Glowing Corona */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[1.25 * baseScale, 24, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isVisited ? 0.75 : (hovered ? 0.9 : 0.6)}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Shimmering Star Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <ringGeometry args={[1.15 * baseScale, 1.4 * baseScale, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Charging hold ring */}
      {holdProgress > 0 && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.3, 1.7, 32]} />
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

      {/* Clear, Non-Suspending HTML Starlight Label */}
      <Html
        center
        position={[0, 1.6 * baseScale, 0]}
        distanceFactor={24}
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          color: '#ffffff',
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontSize: '13px',
          fontWeight: 600,
          letterSpacing: '0.5px',
          textShadow: '0 2px 8px rgba(0,0,0,0.9), 0 0 12px rgba(255,255,255,0.6)',
          background: 'rgba(7, 8, 23, 0.65)',
          padding: '2px 8px',
          borderRadius: '10px',
          border: `1px solid ${memory.color}88`,
          transform: hovered ? 'scale(1.15)' : 'scale(1)',
          transition: 'transform 0.2s ease',
        }}
      >
        {memory.title}
      </Html>
    </group>
  );
};
