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
    radius: 28,
    branches: 3,
    spin: 1.2,
    randomness: 0.45,
    power: 3.5,
    insideColor: '#ffd48a',    // warm gold center
    midColor1: '#ff5fb7',      // magenta mid
    midColor2: '#7b5cff',      // violet
    outsideColor: '#4fd6d0',   // teal outer edges
  };

  const colorInside = new THREE.Color(parameters.insideColor);
  const colorMid1 = new THREE.Color(parameters.midColor1);
  const colorMid2 = new THREE.Color(parameters.midColor2);
  const colorOutside = new THREE.Color(parameters.outsideColor);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    // Radius from center with bias towards core
    const r = Math.pow(Math.random(), parameters.power) * parameters.radius;
    const branchAngle = ((i % parameters.branches) / parameters.branches) * Math.PI * 2;
    const spinAngle = r * parameters.spin;

    // Random dispersion
    const randomX = Math.pow(Math.random(), 2) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * (r + 1.2);
    const randomY = Math.pow(Math.random(), 2) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * (r * 0.35 + 0.8);
    const randomZ = Math.pow(Math.random(), 2) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * (r + 1.2);

    positions[i3] = Math.cos(branchAngle + spinAngle) * r + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + randomZ;

    // Color gradient across galaxy radius
    const ratio = r / parameters.radius;
    let mixedColor = new THREE.Color();

    if (ratio < 0.25) {
      mixedColor.copy(colorInside).lerp(colorMid1, ratio / 0.25);
    } else if (ratio < 0.6) {
      mixedColor.copy(colorMid1).lerp(colorMid2, (ratio - 0.25) / 0.35);
    } else {
      mixedColor.copy(colorMid2).lerp(colorOutside, (ratio - 0.6) / 0.4);
    }

    // Add gentle pastel brightness
    mixedColor.addScalar((Math.random() - 0.5) * 0.12);

    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;

    // Size variation: smaller in outer arms, brighter in core
    sizes[i] = (1.0 - ratio * 0.4) * (Math.random() * 2.2 + 0.8);

    // Random twinkle offset
    twinkles[i] = Math.random() * Math.PI * 2;
  }

  return { positions, colors, sizes, twinkles };
}

export function generateBackgroundStars(count: number, minRadius: number = 35, maxRadius: number = 80): Float32Array {
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
