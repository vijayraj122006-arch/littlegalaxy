import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { CONFIG } from '../content/config';
import { useUniverse } from '../store/useUniverse';
import { audioManager } from '../utils/audioManager';

export const BirthdayStar: React.FC = () => {
  const meshRef = useRef<THREE.Group>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  
  const setFocusedTarget = useUniverse((s) => s.setFocusedTarget);
  const setCameraFocusPos = useUniverse((s) => s.setCameraFocusPos);

  const [hovered, setHovered] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimerRef = useRef<number | null>(null);

  const isBirthdayToday = useMemo(() => {
    const now = new Date();
    return now.getDate() === CONFIG.birthday.day && (now.getMonth() + 1) === CONFIG.birthday.month;
  }, []);

  const starPosition: [number, number, number] = [3.5, 3.2, 4.0];
  const goldColor = '#ffd48a';

  useFrame((state, delta) => {
    if (haloRef.current) {
      const t = state.clock.getElapsedTime() * 2.5;
      const pulse = Math.sin(t) * 0.25 + 1.15;
      haloRef.current.scale.setScalar((hovered ? 1.6 : 1.1) * pulse);
    }

    if (ringRef.current && holdProgress > 0) {
      ringRef.current.rotation.z += delta * 5;
      ringRef.current.scale.setScalar(1.2 + holdProgress * 1.8);
    }
  });

  const openBirthdayModal = () => {
    audioManager.playWhoosh();
    audioManager.playChime(880);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate([40, 70, 100]); } catch {}
    }
    setCameraFocusPos(starPosition);
    setFocusedTarget({ type: 'birthday', id: 'birthday-star' });
  };

  const handlePointerDown = (e: any) => {
    e.stopPropagation();

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
        openBirthdayModal();
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

  // Support instant click/tap as well so users who don't hold still get the modal
  const handleClick = (e: any) => {
    e.stopPropagation();
    openBirthdayModal();
  };

  return (
    <group
      ref={meshRef}
      position={starPosition}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Central Radiant Gold Core */}
      <mesh>
        <sphereGeometry args={[0.7, 24, 24]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>

      {/* Pulsing Golden Aura */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[1.5, 24, 24]} />
        <meshBasicMaterial
          color={goldColor}
          transparent
          opacity={hovered ? 0.95 : 0.75}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Radiant Golden Rings */}
      <mesh ref={ringRef} rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <ringGeometry args={[1.5, 2.0, 36]} />
        <meshBasicMaterial
          color={goldColor}
          transparent
          opacity={0.65}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Clear, Non-Suspending HTML Birthday Label */}
      <Html
        center
        position={[0, 2.0, 0]}
        distanceFactor={24}
        zIndexRange={[10, 0]}
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          color: '#ffd48a',
          fontFamily: 'Caveat, cursive',
          fontSize: '18px',
          fontWeight: 700,
          letterSpacing: '1px',
          textShadow: '0 2px 8px rgba(0,0,0,0.9), 0 0 16px rgba(255, 212, 138, 0.8)',
          background: 'rgba(25, 18, 5, 0.75)',
          padding: '3px 12px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 212, 138, 0.6)',
          transform: hovered ? 'scale(1.15)' : 'scale(1)',
          transition: 'transform 0.2s ease',
        }}
      >
        ✨ Pooja's Day (17 Nov)
      </Html>
    </group>
  );
};
