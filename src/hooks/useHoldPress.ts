import { useState, useRef, useCallback } from 'react';

interface UseHoldPressOptions {
  duration?: number; // default 1200ms
  onComplete?: () => void;
  onCancel?: () => void;
}

export function useHoldPress({
  duration = 1200,
  onComplete,
  onCancel,
}: UseHoldPressOptions = {}) {
  const [progress, setProgress] = useState(0);
  const [isPressing, setIsPressing] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const start = useCallback(() => {
    setIsPressing(true);
    startTimeRef.current = performance.now();

    // Soft haptic feedback start
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(25); } catch {}
    }

    const step = (now: number) => {
      if (!startTimeRef.current) return;
      const elapsed = now - startTimeRef.current;
      const p = Math.min(1, elapsed / duration);
      setProgress(p);

      if (p < 1) {
        animationFrameRef.current = requestAnimationFrame(step);
      } else {
        setIsPressing(false);
        setProgress(0);
        startTimeRef.current = null;
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          try { navigator.vibrate([40, 60, 80]); } catch {}
        }
        onComplete?.();
      }
    };

    animationFrameRef.current = requestAnimationFrame(step);
  }, [duration, onComplete]);

  const cancel = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    startTimeRef.current = null;
    setIsPressing(false);
    setProgress(0);
    onCancel?.();
  }, [onCancel]);

  return {
    progress,
    isPressing,
    handlers: {
      onPointerDown: start,
      onPointerUp: cancel,
      onPointerLeave: cancel,
      onPointerCancel: cancel,
      onTouchStart: start,
      onTouchEnd: cancel,
      onMouseDown: start,
      onMouseUp: cancel,
      onMouseLeave: cancel,
    },
  };
}
