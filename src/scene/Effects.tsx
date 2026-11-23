import React from 'react';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { useUniverse } from '../store/useUniverse';
import { prefersReducedMotion, isMobileDevice } from '../utils/device';

class PostprocessingErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any) {
    console.warn('Postprocessing gracefully bypassed:', error);
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

export const Effects: React.FC = () => {
  const isLowQuality = useUniverse((s) => s.isLowQuality);
  const reducedMotion = prefersReducedMotion();
  const isMobile = isMobileDevice();

  // On mobile or low quality devices, bypass postprocessing passes for locked 60 FPS
  if (isMobile || isLowQuality || reducedMotion) {
    return null;
  }

  return (
    <PostprocessingErrorBoundary>
      <EffectComposer multisampling={0}>
        <Bloom
          luminanceThreshold={0.45}
          luminanceSmoothing={0.3}
          intensity={0.7}
          mipmapBlur
        />
        <Vignette
          eskil={false}
          offset={0.55}
          darkness={0.35}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>
    </PostprocessingErrorBoundary>
  );
};
