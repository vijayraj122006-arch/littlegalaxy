export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
};

export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const getParticleBudget = (): number => {
  if (isMobileDevice()) {
    return 6000; // Silky smooth 60 FPS on mobile GPUs
  }
  return 18000; // Crisp, balanced performance on desktop
};

export const getDeviceDpr = (): [number, number] => {
  if (typeof window === 'undefined') return [1, 2];
  const isMobile = isMobileDevice();
  const dpr = window.devicePixelRatio || 1;
  if (isMobile) {
    return [1, Math.min(1.5, dpr)]; // Prevent mobile GPU overload from 3x retina
  }
  return [1, Math.min(2, dpr)];
};

export const isWebGLAvailable = (): boolean => {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch {
    return false;
  }
};
