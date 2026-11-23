import React from 'react';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { useUniverse } from '../store/useUniverse';
import { prefersReducedMotion } from '../utils/device';

export const Effects: React.FC = () => {
  const isLowQuality = useUniverse((s) => s.isLowQuality);
  const reducedMotion = prefersReducedMotion();

  if (isLowQuality || reducedMotion) {
    return (
      <EffectComposer multisampling={0}>
        <Bloom
          luminanceThreshold={0.08}
          luminanceSmoothing={0.7}
          intensity={1.0}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.5} darkness={0.35} />
      </EffectComposer>
    );
  }

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        luminanceThreshold={0.08}
        luminanceSmoothing={0.7}
        intensity={1.3}
        mipmapBlur
      />
      {/* Gentle soft edge vignette (never obscuring stars or planets) */}
      <Vignette
        eskil={false}
        offset={0.6}
        darkness={0.35}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
};
