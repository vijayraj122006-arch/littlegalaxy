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
  const flareRef = useRef<THREE.Mesh>(null);
  
  const setFocusedTarget = useUniverse((s) => s.setFocusedTarget);
  const setCameraFocusPos = useUniverse((s) => s.setCameraFocusPos);

  const [hovered, setHovered] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimerRef = useRef<number | null>(null);

  const isBirthdayToday = useMemo(() => {
    const now = new Date();
    return now.getDate() === CONFIG.birthday.day && (now.getMonth() + 1) === CONFIG.birthday.month;
  }, []);

  const starPosition: [number, number, number] = [10, 4.0, -7];
  const goldColor = '#ffd48a';

  useFrame((state, delta) => {
    if (haloRef.current) {
      const t = state.clock.getElapsedTime() * 2.8;
      const pulse = Math.sin(t) * 0.2 + 1.15;
      haloRef.current.scale.setScalar((hovered ? 1.5 : 1.1) * pulse);
    }
    if (flareRef.current) {
      flareRef.current.rotation.z += delta * 0.5;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 1.5;
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
    const duration = 800;
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
      {/* 1. Brilliant Golden Star Core */}
      <mesh>
        <sphereGeometry args={[0.55, 24, 24]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>

      {/* 2. Pulsing Golden Atmospheric Corona */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[1.3, 24, 24]} />
        <meshBasicMaterial
          color={goldColor}
          transparent
          opacity={hovered ? 0.95 : 0.65}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* 3. Astronomical Star Flare */}
      <mesh ref={flareRef}>
        <planeGeometry args={[3.2, 3.2]} />
        <meshBasicMaterial
          color={goldColor}
          transparent
          opacity={hovered ? 0.85 : 0.45}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 4. Delicate Starlight Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <ringGeometry args={[1.2, 1.5, 36]} />
        <meshBasicMaterial
          color={goldColor}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 5. Minimal Birthday Label on Hover */}
      {hovered && (
        <Html
          center
          position={[0, 1.8, 0]}
          distanceFactor={26}
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
            background: 'rgba(25, 18, 5, 0.85)',
            backdropFilter: 'blur(10px)',
            padding: '4px 12px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 212, 138, 0.7)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.6), 0 0 20px rgba(255, 212, 138, 0.5)',
          }}
        >
          ✨ Pooja's Birthday Star (17 Nov)
        </Html>
      )}
    </group>
  );
};
