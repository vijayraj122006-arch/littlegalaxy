import { useState, useEffect, useCallback } from 'react';

export interface GyroState {
  tiltX: number; // -1 to 1
  tiltY: number; // -1 to 1
  hasPermission: boolean;
  needsPermissionButton: boolean;
  requestPermission: () => Promise<void>;
}

export function useGyro(): GyroState {
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [needsPermissionButton, setNeedsPermissionButton] = useState<boolean>(false);

  useEffect(() => {
    // Check if iOS 13+ permission is required
    if (
      typeof window !== 'undefined' &&
      typeof (DeviceOrientationEvent as any)?.requestPermission === 'function'
    ) {
      setNeedsPermissionButton(true);
    } else if (typeof window !== 'undefined') {
      // Standard Android or desktop fallback
      const handleOrientation = (e: DeviceOrientationEvent) => {
        if (e.gamma !== null && e.beta !== null) {
          // gamma: left-to-right (-90 to 90)
          // beta: front-to-back (-180 to 180)
          const normX = Math.max(-1, Math.min(1, e.gamma / 45));
          const normY = Math.max(-1, Math.min(1, (e.beta - 45) / 45));
          setTilt({ x: normX, y: normY });
          setHasPermission(true);
        }
      };

      window.addEventListener('deviceorientation', handleOrientation);
      return () => window.removeEventListener('deviceorientation', handleOrientation);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (
      typeof (DeviceOrientationEvent as any)?.requestPermission === 'function'
    ) {
      try {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        if (response === 'granted') {
          setHasPermission(true);
          setNeedsPermissionButton(false);
          const handleOrientation = (e: DeviceOrientationEvent) => {
            if (e.gamma !== null && e.beta !== null) {
              const normX = Math.max(-1, Math.min(1, e.gamma / 45));
              const normY = Math.max(-1, Math.min(1, (e.beta - 45) / 45));
              setTilt({ x: normX, y: normY });
            }
          };
          window.addEventListener('deviceorientation', handleOrientation);
        }
      } catch (err) {
        console.warn("DeviceOrientation permission rejected:", err);
      }
    }
  }, []);

  return {
    tiltX: tilt.x,
    tiltY: tilt.y,
    hasPermission,
    needsPermissionButton,
    requestPermission,
  };
}
