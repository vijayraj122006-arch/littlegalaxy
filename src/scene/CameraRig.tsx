import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { useUniverse } from '../store/useUniverse';
import { useGyro } from '../hooks/useGyro';
import { prefersReducedMotion, isMobileDevice } from '../utils/device';
import { MEMORIES } from '../content/memories';

export const CameraRig: React.FC = () => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const isDraggingRef = useRef(false);

  const stage = useUniverse((s) => s.stage);
  const cameraFocusPos = useUniverse((s) => s.cameraFocusPos);
  const focusedTarget = useUniverse((s) => s.focusedTarget);

  const { tiltX, tiltY } = useGyro();
  const isReduced = prefersReducedMotion();
  const isMobile = isMobileDevice();

  // Overview camera coordinates
  const defaultCamPos = isMobile ? { x: 0, y: 16, z: 36 } : { x: 0, y: 14, z: 28 };

  // Stage camera transitions
  useEffect(() => {
    if (stage === 'intro') {
      camera.position.set(0, 0, 8);
      camera.lookAt(0, 0, 0);
    } else if (stage === 'explore') {
      gsap.to(camera.position, {
        x: defaultCamPos.x,
        y: defaultCamPos.y,
        z: defaultCamPos.z,
        duration: isReduced ? 0.8 : 2.5,
        ease: 'power2.inOut',
        onUpdate: () => {
          camera.lookAt(0, 0, 0);
          if (controlsRef.current) {
            controlsRef.current.target.set(0, 0, 0);
            controlsRef.current.update();
          }
        }
      });
    } else if (stage === 'finale') {
      gsap.to(camera.position, {
        x: 0,
        y: 22,
        z: 40,
        duration: isReduced ? 1.0 : 3.5,
        ease: 'expo.out',
        onUpdate: () => {
          camera.lookAt(0, 0, 0);
        }
      });
    }
  }, [stage, camera, isReduced, isMobile]);

  // Smooth camera fly-to when clicking a memory star or planet
  useEffect(() => {
    if (cameraFocusPos && stage === 'explore') {
      const [tx, ty, tz] = cameraFocusPos;
      const targetVec = new THREE.Vector3(tx, ty, tz);
      
      const offsetDir = targetVec.clone().normalize();
      if (offsetDir.length() < 0.1) offsetDir.set(0, 0.4, 1);
      const camTargetPos = targetVec.clone().add(offsetDir.multiplyScalar(5.5));

      gsap.to(camera.position, {
        x: camTargetPos.x,
        y: camTargetPos.y + 0.6,
        z: camTargetPos.z,
        duration: isReduced ? 0.6 : 1.6,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (controlsRef.current) {
            controlsRef.current.target.lerp(targetVec, 0.2);
            controlsRef.current.update();
          }
        }
      });
    } else if (!focusedTarget && stage === 'explore') {
      // Return smoothly to default hub view
      gsap.to(camera.position, {
        x: defaultCamPos.x,
        y: defaultCamPos.y,
        z: defaultCamPos.z,
        duration: 1.6,
        ease: 'power2.out',
        onUpdate: () => {
          if (controlsRef.current) {
            controlsRef.current.target.set(0, 0, 0);
            controlsRef.current.update();
          }
        }
      });
    }
  }, [cameraFocusPos, focusedTarget, stage, camera, isReduced]);

  // Subtle gyro parallax without fighting OrbitControls
  useFrame(() => {
    if (stage === 'explore' && !focusedTarget && !isDraggingRef.current) {
      if (Math.abs(tiltX) > 0.02 || Math.abs(tiltY) > 0.02) {
        camera.position.x += tiltX * 0.03;
        camera.position.y += -tiltY * 0.03;
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.8}
      zoomSpeed={0.9}
      minDistance={6}
      maxDistance={65}
      maxPolarAngle={Math.PI / 1.7}
      minPolarAngle={Math.PI / 8}
      autoRotate={stage === 'explore' && !focusedTarget && !isDraggingRef.current}
      autoRotateSpeed={0.35}
      enabled={stage === 'explore' && !focusedTarget}
      onStart={() => { isDraggingRef.current = true; }}
      onEnd={() => { isDraggingRef.current = false; }}
    />
  );
};
