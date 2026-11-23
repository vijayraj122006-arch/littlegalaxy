import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { useUniverse } from '../store/useUniverse';
import { useGyro } from '../hooks/useGyro';
import { prefersReducedMotion, isMobileDevice } from '../utils/device';
import { MEMORIES } from '../content/memories';
import { audioSynth } from '../utils/audioSynth';

export const CameraRig: React.FC = () => {
  const { camera, gl } = useThree();
  const controlsRef = useRef<any>(null);

  const stage = useUniverse((s) => s.stage);
  const cameraFocusPos = useUniverse((s) => s.cameraFocusPos);
  const focusedTarget = useUniverse((s) => s.focusedTarget);
  const setWishPromptOpen = useUniverse((s) => s.setWishPromptOpen);

  const { tiltX, tiltY } = useGyro();
  const isReduced = prefersReducedMotion();
  const isMobile = isMobileDevice();

  // Overview camera coordinates (farther on portrait mobile to fit the whole galaxy)
  const defaultCamPos = isMobile ? { x: 0, y: 16, z: 38 } : { x: 0, y: 14, z: 30 };

  // Intro transition to Galaxy Hub
  useEffect(() => {
    if (stage === 'intro') {
      camera.position.set(0, 0, 8);
      camera.lookAt(0, 0, 0);
    } else if (stage === 'explore') {
      gsap.to(camera.position, {
        x: defaultCamPos.x,
        y: defaultCamPos.y,
        z: defaultCamPos.z,
        duration: isReduced ? 0.8 : 3.0,
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
        z: 42,
        duration: isReduced ? 1.0 : 4.0,
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
        duration: isReduced ? 0.6 : 1.8,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (controlsRef.current) {
            controlsRef.current.target.lerp(targetVec, 0.2);
            controlsRef.current.update();
          }
        }
      });
    } else if (!focusedTarget && stage === 'explore') {
      // Return to default hub view
      gsap.to(camera.position, {
        x: defaultCamPos.x,
        y: defaultCamPos.y,
        z: defaultCamPos.z,
        duration: 1.8,
        ease: 'power2.out',
        onUpdate: () => {
          if (controlsRef.current) {
            controlsRef.current.target.set(0, 0, 0);
            controlsRef.current.update();
          }
        }
      });
    }
  }, [cameraFocusPos, focusedTarget, stage, camera, isReduced, defaultCamPos]);

  // Gyro parallax & proximity
  useFrame(() => {
    if (stage === 'explore' && !focusedTarget) {
      if (Math.abs(tiltX) > 0.01 || Math.abs(tiltY) > 0.01) {
        camera.position.x += (tiltX * 1.5 - (camera.position.x - defaultCamPos.x)) * 0.02;
        camera.position.y += (-tiltY * 1.5 - (camera.position.y - defaultCamPos.y)) * 0.02;
      }

      let minDist = 999;
      MEMORIES.forEach((m) => {
        const d = camera.position.distanceTo(new THREE.Vector3(...m.position));
        if (d < minDist) minDist = d;
      });

      const prox = Math.max(0, Math.min(1, (16.0 - minDist) / 12.0));
      audioSynth.setProximity(prox);
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      rotateSpeed={0.7}
      zoomSpeed={0.8}
      minDistance={6}
      maxDistance={60}
      maxPolarAngle={Math.PI / 1.7}
      minPolarAngle={Math.PI / 8}
      enabled={stage === 'explore' && !focusedTarget}
    />
  );
};
