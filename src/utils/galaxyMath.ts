import * as THREE from 'three';

export interface GalaxyData {
  positions: Float32Array;
  colors: Float32Array;
  sizes: Float32Array;
  twinkles: Float32Array;
}

export function generateGalaxyData(count: number): GalaxyData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const twinkles = new Float32Array(count);

  const parameters = {
    radius: 38,
    branches: 3,               // 3 majestic spiral arms
    spin: 1.25,
    randomness: 0.28,
    power: 1.45,               // Balanced natural distribution across arms
    coreColor: '#fff1d6',      // soft champagne starlight (not blown-out white)
    innerColor: '#ffb5a7',     // delicate warm peach/rose
    armColor1: '#d8b4fe',      // soft lavender starlight
    armColor2: '#818cf8',      // celestial indigo
    outerColor: '#38bdf8',     // ethereal cyan starlight
  };

  const cCore = new THREE.Color(parameters.coreColor);
  const cInner = new THREE.Color(parameters.innerColor);
  const cArm1 = new THREE.Color(parameters.armColor1);
  const cArm2 = new THREE.Color(parameters.armColor2);
  const cOuter = new THREE.Color(parameters.outerColor);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    // Radius distribution: starts from soft core and flows through arms
    const r = (0.05 + Math.pow(Math.random(), parameters.power) * 0.95) * parameters.radius;
    
    // 3 main spiral arms with subtle natural divergence
    const branchAngle = ((i % parameters.branches) / parameters.branches) * Math.PI * 2;
    const spinAngle = r * parameters.spin * 0.08;

    // Natural 3D disk thickness: gentle dome at center, thinning towards edges
    const diskThickness = Math.max(0.4, (1.0 - r / parameters.radius) * 2.5);
    const randomAngle = Math.random() * Math.PI * 2;
    const spread = Math.pow(Math.random(), 2.0) * parameters.randomness * (r * 0.35 + 1.2);
    
    const randomX = Math.cos(randomAngle) * spread;
    const randomY = (Math.random() - 0.5) * diskThickness * 2.0;
    const randomZ = Math.sin(randomAngle) * spread;

    positions[i3] = Math.cos(branchAngle + spinAngle) * r + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + randomZ;

    // Realistic astronomical color grading across spiral arms
    const ratio = r / parameters.radius;
    const mixedColor = new THREE.Color();

    if (ratio < 0.2) {
      mixedColor.copy(cCore).lerp(cInner, ratio / 0.2);
    } else if (ratio < 0.5) {
      mixedColor.copy(cInner).lerp(cArm1, (ratio - 0.2) / 0.3);
    } else if (ratio < 0.8) {
      mixedColor.copy(cArm1).lerp(cArm2, (ratio - 0.5) / 0.3);
    } else {
      mixedColor.copy(cArm2).lerp(cOuter, (ratio - 0.8) / 0.2);
    }

    // Stellar variance: hot blue stars, warm gold stars
    if (Math.random() < 0.15) {
      mixedColor.lerp(new THREE.Color('#ffffff'), 0.4);
    } else if (Math.random() < 0.1) {
      mixedColor.lerp(new THREE.Color('#ffd48a'), 0.3);
    }

    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;

    // Size: small crisp stars with occasional bright beacon stars
    const isBeacon = Math.random() < 0.03;
    const baseSize = isBeacon ? (2.2 + Math.random() * 1.8) : (0.7 + Math.random() * 1.2);
    sizes[i] = baseSize;

    twinkles[i] = Math.random() * Math.PI * 2;
  }

  return { positions, colors, sizes, twinkles };
}

export function generateBackgroundStars(count: number, minRadius: number = 45, maxRadius: number = 130): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = minRadius + Math.random() * (maxRadius - minRadius);

    positions[i3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = r * Math.cos(phi);
  }
  return positions;
}
