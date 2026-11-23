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
  const flareRef = useRef<THREE.Mesh>(null);
  
  const visitedMemories = useUniverse((s) => s.visitedMemories);
  const isVisited = visitedMemories.includes(memory.id);

  const setFocusedTarget = useUniverse((s) => s.setFocusedTarget);
  const setCameraFocusPos = useUniverse((s) => s.setCameraFocusPos);

  const [hovered, setHovered] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimerRef = useRef<number | null>(null);

  const color = new THREE.Color(memory.color);
  const baseScale = isVisited ? 1.2 : 0.95;

  useFrame((state, delta) => {
    if (haloRef.current) {
      const t = state.clock.getElapsedTime() * 2.5 + memory.position[0];
      const pulse = Math.sin(t) * 0.15 + 1.05;
      haloRef.current.scale.setScalar((hovered ? 1.4 : 1.0) * pulse * baseScale);
    }
    if (flareRef.current) {
      flareRef.current.rotation.z += delta * 0.4;
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
      const duration = 900;
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
      {/* 1. Brilliant Point Star Core */}
      <mesh>
        <sphereGeometry args={[0.38 * baseScale, 20, 20]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>

      {/* 2. Soft Coronal Glow Sphere */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[0.9 * baseScale, 20, 20]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isVisited ? 0.75 : (hovered ? 0.9 : 0.45)}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* 3. Astronomical 4-Point Diffraction Flare Cross */}
      <mesh ref={flareRef}>
        <planeGeometry args={[2.4 * baseScale, 2.4 * baseScale]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 0.8 : (isVisited ? 0.5 : 0.3)}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 4. Charging Hold Ring for future stars */}
      {holdProgress > 0 && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.0, 1.3, 32]} />
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

      {/* 5. Minimal, Elegant Label (Only visible when hovered or focused, keeping sky realistic) */}
      {hovered && (
        <Html
          center
          position={[0, 1.4 * baseScale, 0]}
          distanceFactor={26}
          zIndexRange={[10, 0]}
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
            whiteSpace: 'nowrap',
            color: '#fff',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.5px',
            background: 'rgba(10, 8, 28, 0.85)',
            backdropFilter: 'blur(10px)',
            padding: '4px 10px',
            borderRadius: '12px',
            border: `1px solid ${memory.color}aa`,
            boxShadow: `0 4px 15px rgba(0,0,0,0.6), 0 0 15px ${memory.color}44`,
          }}
        >
          ✨ {memory.title}
        </Html>
      )}
    </group>
  );
};
