import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { useUniverse } from '../store/useUniverse';
import { useGyro } from '../hooks/useGyro';
import { prefersReducedMotion } from '../utils/device';
import { MEMORIES } from '../content/memories';
import { audioSynth } from '../utils/audioSynth';

export const CameraRig: React.FC = () => {
  const { camera, gl } = useThree();
  const controlsRef = useRef<any>(null);

  const stage = useUniverse((s) => s.stage);
  const cameraFocusPos = useUniverse((s) => s.cameraFocusPos);
  const focusedTarget = useUniverse((s) => s.focusedTarget);
  const isDrawMode = useUniverse((s) => s.isDrawMode);
  const setWishPromptOpen = useUniverse((s) => s.setWishPromptOpen);

  const { tiltX, tiltY } = useGyro();
  const isReduced = prefersReducedMotion();

  // Intro transition to Galaxy Hub
  useEffect(() => {
    if (stage === 'intro') {
      camera.position.set(0, 0, 4);
      camera.lookAt(0, 0, 0);
    } else if (stage === 'explore') {
      // Pull out smoothly to galaxy overview
      gsap.to(camera.position, {
        x: 0,
        y: 18,
        z: 28,
        duration: isReduced ? 0.8 : 3.2,
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
      // Cinematic pull back for the grand shower
      gsap.to(camera.position, {
        x: 0,
        y: 26,
        z: 36,
        duration: isReduced ? 1.0 : 4.5,
        ease: 'expo.out',
        onUpdate: () => {
          camera.lookAt(0, 0, 0);
        }
      });
    }
  }, [stage, camera, isReduced]);

  // Smooth camera fly-to when clicking a memory star or planet
  useEffect(() => {
    if (cameraFocusPos && stage === 'explore') {
      const [tx, ty, tz] = cameraFocusPos;
      const targetVec = new THREE.Vector3(tx, ty, tz);
      
      // Calculate comfortable offset position in front of target
      const offsetDir = targetVec.clone().normalize();
      if (offsetDir.length() < 0.1) offsetDir.set(0, 0.5, 1);
      const camTargetPos = targetVec.clone().add(offsetDir.multiplyScalar(4.5));

      gsap.to(camera.position, {
        x: camTargetPos.x,
        y: camTargetPos.y + 0.8,
        z: camTargetPos.z,
        duration: isReduced ? 0.6 : 2.0,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (controlsRef.current) {
            controlsRef.current.target.lerp(targetVec, 0.2);
            controlsRef.current.update();
          }
        }
      });
    } else if (!focusedTarget && stage === 'explore') {
      // Return to default hub view if closed
      gsap.to(camera.position, {
        x: 0,
        y: 18,
        z: 28,
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
  }, [cameraFocusPos, focusedTarget, stage, camera, isReduced]);

  // Frame update for gyro parallax and proximity audio calculation
  useFrame(() => {
    if (stage === 'explore' && !focusedTarget) {
      // Subtle gyro parallax
      if (Math.abs(tiltX) > 0.01 || Math.abs(tiltY) > 0.01) {
        camera.position.x += (tiltX * 1.5 - (camera.position.x - 0)) * 0.02;
        camera.position.y += (-tiltY * 1.5 - (camera.position.y - 18)) * 0.02;
      }

      // Proximity audio calculation: find closest memory star
      let minDist = 999;
      MEMORIES.forEach((m) => {
        const d = camera.position.distanceTo(new THREE.Vector3(...m.position));
        if (d < minDist) minDist = d;
      });

      // Scale proximity: distance 3.0 = 1.0 (very close), distance > 15.0 = 0.0
      const prox = Math.max(0, Math.min(1, (14.0 - minDist) / 10.0));
      audioSynth.setProximity(prox);
    }
  });

  // Handle tap on empty space for Make-A-Wish prompt
  useEffect(() => {
    const handleCanvasClick = (e: MouseEvent | TouchEvent) => {
      // If we are in explore stage and not currently viewing a modal or in draw mode
      const { stage, focusedTarget, isDrawMode, isWishPromptOpen } = useUniverse.getState();
      if (stage !== 'explore' || focusedTarget || isDrawMode || isWishPromptOpen) return;

      // Check if click was on empty space
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const rect = gl.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        -((clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      // Unproject a random 3D point in the sky for the wish
      const pos = raycaster.ray.origin.clone().add(raycaster.ray.direction.clone().multiplyScalar(22));
      setWishPromptOpen(true, [pos.x, pos.y, pos.z]);
    };

    const dom = gl.domElement;
    dom.addEventListener('dblclick', handleCanvasClick);
    return () => {
      dom.removeEventListener('dblclick', handleCanvasClick);
    };
  }, [gl, camera, setWishPromptOpen]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      rotateSpeed={0.65}
      zoomSpeed={0.8}
      minDistance={4}
      maxDistance={48}
      maxPolarAngle={Math.PI / 1.8}
      minPolarAngle={Math.PI / 8}
      enabled={stage === 'explore' && !focusedTarget}
    />
  );
};
