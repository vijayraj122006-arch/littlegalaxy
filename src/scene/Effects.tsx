import React from 'react';
import { EffectComposer, Bloom, Vignette, Noise, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { useUniverse } from '../store/useUniverse';
import { prefersReducedMotion } from '../utils/device';

export const Effects: React.FC = () => {
  const isLowQuality = useUniverse((s) => s.isLowQuality);
  const reducedMotion = prefersReducedMotion();

  if (isLowQuality || reducedMotion) {
    return (
      <EffectComposer multisampling={0}>
        <Bloom
          luminanceThreshold={0.2}
          luminanceSmoothing={0.8}
          intensity={1.2}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.15} darkness={0.85} />
      </EffectComposer>
    );
  }

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        luminanceThreshold={0.15}
        luminanceSmoothing={0.85}
        intensity={1.6}
        mipmapBlur
      />
      <Vignette
        eskil={false}
        offset={0.2}
        darkness={0.9}
        blendFunction={BlendFunction.NORMAL}
      />
      <ChromaticAberration
        offset={new THREE.Vector2(0.0012, 0.0012)}
        radialModulation={true}
        modulationOffset={0.65}
      />
      <Noise
        opacity={0.035}
        blendFunction={BlendFunction.OVERLAY}
      />
    </EffectComposer>
  );
};
