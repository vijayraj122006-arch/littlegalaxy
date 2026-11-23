import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { CONFIG } from '../content/config';
import { useUniverse } from '../store/useUniverse';
import { audioSynth } from '../utils/audioSynth';
import { Gift } from 'lucide-react';

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

  const handlePointerDown = (e: any) => {
    e.stopPropagation();

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
          opacity={isBirthdayToday ? 0.9 : 0.7}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Charging hold ring */}
      {holdProgress > 0 && (
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.4, 1.8, 32]} />
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

      {/* Floating 3D Label Tag */}
      <Html
        position={[0, 1.8, 0]}
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
          gap: '6px',
          background: 'rgba(255, 212, 138, 0.35)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 212, 138, 0.7)',
          borderRadius: '18px',
          padding: '5px 12px',
          color: '#fff',
          fontSize: '12px',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 600,
          boxShadow: '0 0 20px rgba(255, 212, 138, 0.5)',
          textShadow: '0 0 4px #000',
          transform: hovered ? 'scale(1.12)' : 'scale(1)',
          transition: 'transform 0.2s ease'
        }}>
          <Gift size={12} color="#ffd48a" />
          <span>Birthday Star (17 Nov)</span>
        </div>
      </Html>
    </group>
  );
};
