import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CONFIG } from '../content/config';
import { useUniverse } from '../store/useUniverse';
import { audioSynth } from '../utils/audioSynth';

export const BirthdayStar: React.FC = () => {
  const meshRef = useRef<THREE.Group>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  
  const setFocusedTarget = useUniverse((s) => s.setFocusedTarget);
  const setCameraFocusPos = useUniverse((s) => s.setCameraFocusPos);

  const [hovered, setHovered] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimerRef = useRef<number | null>(null);

  // Check if today is 17 Nov
  const isBirthdayToday = useMemo(() => {
    const now = new Date();
    return now.getDate() === CONFIG.birthday.day && (now.getMonth() + 1) === CONFIG.birthday.month;
  }, []);

  const starPosition: [number, number, number] = [3.2, 2.8, 3.5];
  const goldColor = '#ffd48a';

  useFrame((state, delta) => {
    if (haloRef.current) {
      const t = state.clock.getElapsedTime() * (isBirthdayToday ? 3.5 : 2.0);
      const pulse = Math.sin(t) * 0.25 + 1.1;
      haloRef.current.scale.setScalar((hovered ? 1.5 : 1.0) * pulse * (isBirthdayToday ? 1.4 : 1.1));
    }

    if (ringRef.current && holdProgress > 0) {
      ringRef.current.rotation.z += delta * 5;
      ringRef.current.scale.setScalar(1.2 + holdProgress * 1.8);
    }
  });

  const handlePointerDown = (e: any) => {
    e.stopPropagation();

    // Hold-to-ignite for birthday star
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
          try { navigator.vibrate([40, 70, 100]); } catch {}
        }
        setCameraFocusPos(starPosition);
        setFocusedTarget({ type: 'birthday', id: 'birthday-star' });
      }
    };
    holdTimerRef.current = requestAnimationFrame(step);
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
      position={starPosition}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Central warm gold core */}
      <mesh>
        <sphereGeometry args={[0.42, 24, 24]} />
        <meshBasicMaterial color="#fffbe6" toneMapped={false} />
      </mesh>

      {/* Pulsing golden aura */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[0.95, 24, 24]} />
        <meshBasicMaterial
          color={goldColor}
          transparent
          opacity={isBirthdayToday ? 0.8 : 0.55}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Charging hold ring */}
      {holdProgress > 0 && (
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.8, 1.0, 32]} />
          <meshBasicMaterial
            color="#fff4e0"
            transparent
            opacity={0.5 + holdProgress * 0.5}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      )}
    </group>
  );
};
