import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Memory } from '../content/memories';
import { useUniverse } from '../store/useUniverse';
import { audioSynth } from '../utils/audioSynth';
import { Heart } from 'lucide-react';

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
          audioSynth.playWhoosh();
          audioSynth.playChime(880);
          if (typeof navigator !== 'undefined' && navigator.vibrate) {
            try { navigator.vibrate([30, 50, 90]); } catch {}
          }
          setCameraFocusPos(memory.position);
          setFocusedTarget({ type: 'memory', id: memory.id });
        }
      };
      holdTimerRef.current = requestAnimationFrame(step);
    } else {
      audioSynth.playChime(659.25);
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
        <sphereGeometry args={[1.2 * baseScale, 24, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isVisited ? 0.7 : (hovered ? 0.85 : 0.55)}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Shimmering Star Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <ringGeometry args={[1.1 * baseScale, 1.35 * baseScale, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.65}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Hold-to-ignite charging ring */}
      {holdProgress > 0 && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.3, 1.6, 32]} />
          <meshBasicMaterial
            color="#ffd48a"
            transparent
            opacity={0.4 + holdProgress * 0.6}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      )}

      {/* Floating 3D Starlight Label (Guarantees High Visibility) */}
      <Html
        position={[0, 1.4 * baseScale, 0]}
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
          gap: '5px',
          background: isVisited ? 'rgba(255, 95, 183, 0.45)' : 'rgba(13, 11, 46, 0.75)',
          backdropFilter: 'blur(8px)',
          border: `1px solid ${memory.color}88`,
          borderRadius: '16px',
          padding: '4px 10px',
          color: '#fff',
          fontSize: '11px',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 500,
          boxShadow: `0 0 15px ${memory.color}55`,
          textShadow: '0 0 4px #000',
          transform: hovered ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.2s ease'
        }}>
          <Heart size={10} fill={memory.color} color={memory.color} />
          <span>{memory.title}</span>
        </div>
      </Html>
    </group>
  );
};
