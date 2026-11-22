import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Memory } from '../content/memories';
import { useUniverse } from '../store/useUniverse';
import { audioSynth } from '../utils/audioSynth';

interface MemoryStarProps {
  memory: Memory;
}

export const MemoryStar: React.FC<MemoryStarProps> = ({ memory }) => {
  const meshRef = useRef<THREE.Group>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  
  const visitedMemories = useUniverse((s) => s.visitedMemories);
  const isVisited = visitedMemories.includes(memory.id);

  const isDrawMode = useUniverse((s) => s.isDrawMode);
  const selectedStarForDraw = useUniverse((s) => s.selectedStarForDraw);
  const setSelectedStarForDraw = useUniverse((s) => s.setSelectedStarForDraw);
  const addDrawnLine = useUniverse((s) => s.addDrawnLine);

  const setFocusedTarget = useUniverse((s) => s.setFocusedTarget);
  const setCameraFocusPos = useUniverse((s) => s.setCameraFocusPos);

  const [hovered, setHovered] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimerRef = useRef<number | null>(null);

  const color = new THREE.Color(memory.color);
  const baseScale = isVisited ? 1.25 : 0.95;

  useFrame((state, delta) => {
    if (haloRef.current) {
      // Gentle breathing pulse
      const t = state.clock.getElapsedTime() * 2.5 + memory.position[0];
      const pulse = Math.sin(t) * 0.18 + 1.0;
      haloRef.current.scale.setScalar((hovered ? 1.4 : 1.0) * pulse * baseScale);
    }

    if (ringRef.current && holdProgress > 0) {
      ringRef.current.rotation.z += delta * 4;
      ringRef.current.scale.setScalar(1.2 + holdProgress * 1.5);
    }
  });

  const handlePointerDown = (e: any) => {
    e.stopPropagation();

    // If in Draw Mode
    if (isDrawMode) {
      if (!selectedStarForDraw) {
        setSelectedStarForDraw(memory.id);
        audioSynth.playChime(587.33);
      } else {
        addDrawnLine([selectedStarForDraw, memory.id]);
        audioSynth.playChime(880);
      }
      return;
    }

    // Normal navigation mode
    if (memory.interaction === 'hold' && !isVisited) {
      // Begin 1.2s hold to ignite
      let start = performance.now();
      const duration = 1200;
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try { navigator.vibrate(20); } catch {}
      }

      const step = () => {
        const elapsed = performance.now() - start;
        const p = Math.min(1, elapsed / duration);
        setHoldProgress(p);

        if (p < 1) {
          holdTimerRef.current = requestAnimationFrame(step);
        } else {
          // Ignited!
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
      // Instant tap navigation
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

  const isSelectedInDraw = selectedStarForDraw === memory.id;

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
      {/* Central bright star sphere */}
      <mesh>
        <sphereGeometry args={[0.32 * baseScale, 16, 16]} />
        <meshBasicMaterial
          color={isVisited ? '#ffffff' : color}
          toneMapped={false}
        />
      </mesh>

      {/* Outer soft glowing halo */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[0.7 * baseScale, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isVisited ? 0.6 : (hovered ? 0.75 : 0.45)}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Hold-to-ignite charging ring */}
      {holdProgress > 0 && (
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.7, 0.85, 32]} />
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

      {/* Draw mode indicator ring */}
      {isSelectedInDraw && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.8, 0.95, 32]} />
          <meshBasicMaterial
            color="#ff5fb7"
            transparent
            opacity={0.9}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      )}
    </group>
  );
};
