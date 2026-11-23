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
    radius: 30,
    branches: 2,               // 2 grand design spiral arms + spurs
    spin: 1.45,
    randomness: 0.38,
    power: 3.2,
    coreColor: '#fff8e7',      // radiant champagne gold core
    innerColor: '#ffd48a',     // warm amber
    armColor1: '#ff5fb7',      // romantic rose magenta
    armColor2: '#9d72ff',      // celestial deep violet
    outerColor: '#38bdf8',     // ethereal starlight cyan
  };

  const cCore = new THREE.Color(parameters.coreColor);
  const cInner = new THREE.Color(parameters.innerColor);
  const cArm1 = new THREE.Color(parameters.armColor1);
  const cArm2 = new THREE.Color(parameters.armColor2);
  const cOuter = new THREE.Color(parameters.outerColor);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    // Logarithmic radius distribution
    const r = Math.pow(Math.random(), parameters.power) * parameters.radius;
    
    // 2 main spiral arms, plus occasional spur branches (25% chance of bridge spur)
    const isSpur = Math.random() < 0.22;
    const branchOffset = isSpur ? (Math.random() * Math.PI) : 0;
    const branchAngle = ((i % parameters.branches) / parameters.branches) * Math.PI * 2 + branchOffset;
    const spinAngle = r * parameters.spin;

    // Natural exponential galactic disk thickness (thicker at core, flatter at arms)
    const heightSpread = Math.exp(-r * 0.12) * 1.8 + 0.4;
    const randomX = Math.pow(Math.random(), 2.2) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * (r * 0.7 + 1.2);
    const randomY = (Math.random() - 0.5) * heightSpread * (parameters.randomness * 2.8);
    const randomZ = Math.pow(Math.random(), 2.2) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * (r * 0.7 + 1.2);

    positions[i3] = Math.cos(branchAngle + spinAngle) * r + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + randomZ;

    // Realistic color blending from super-bright core to romantic colorful spiral arms
    const ratio = r / parameters.radius;
    const mixedColor = new THREE.Color();

    if (ratio < 0.15) {
      mixedColor.copy(cCore).lerp(cInner, ratio / 0.15);
    } else if (ratio < 0.45) {
      mixedColor.copy(cInner).lerp(cArm1, (ratio - 0.15) / 0.3);
    } else if (ratio < 0.75) {
      mixedColor.copy(cArm1).lerp(cArm2, (ratio - 0.45) / 0.3);
    } else {
      mixedColor.copy(cArm2).lerp(cOuter, (ratio - 0.75) / 0.25);
    }

    // Stellar temperature variations (some stars cooler peach, some hotter diamond blue)
    if (Math.random() < 0.12) {
      mixedColor.lerp(new THREE.Color('#ffffff'), 0.5);
    } else if (Math.random() < 0.08) {
      mixedColor.lerp(new THREE.Color('#ff8fa3'), 0.4);
    }

    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;

    // Size distribution: rare luminous giants, many delicate field stars
    const isGiant = Math.random() < 0.04;
    const baseSize = isGiant ? (3.5 + Math.random() * 2.5) : (0.8 + Math.random() * 1.6);
    sizes[i] = (1.1 - ratio * 0.3) * baseSize;

    // Random twinkle offset
    twinkles[i] = Math.random() * Math.PI * 2;
  }

  return { positions, colors, sizes, twinkles };
}

export function generateBackgroundStars(count: number, minRadius: number = 38, maxRadius: number = 95): Float32Array {
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
