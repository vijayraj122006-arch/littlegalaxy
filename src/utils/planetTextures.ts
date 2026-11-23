import * as THREE from 'three';

/**
 * Procedural Realistic Planet Texture Generator
 * Generates high-resolution photographic-style surface maps, bump maps,
 * and ring textures in memory once at startup.
 */

// Cache textures so they are only built once
const textureCache = new Map<string, THREE.CanvasTexture>();

// 1. Realistic Lunar Surface Texture (The Red Moon / Eclipse)
export function getMoonTexture(): { map: THREE.CanvasTexture; bump: THREE.CanvasTexture } {
  const cacheKeyMap = 'moon_map';
  const cacheKeyBump = 'moon_bump';

  if (textureCache.has(cacheKeyMap) && textureCache.has(cacheKeyBump)) {
    return {
      map: textureCache.get(cacheKeyMap)!,
      bump: textureCache.get(cacheKeyBump)!,
    };
  }

  const width = 1024;
  const height = 512;

  // Surface Map
  const mapCanvas = document.createElement('canvas');
  mapCanvas.width = width;
  mapCanvas.height = height;
  const ctx = mapCanvas.getContext('2d')!;

  // Bump Map
  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = width;
  bumpCanvas.height = height;
  const bCtx = bumpCanvas.getContext('2d')!;

  // Base red lunar crust
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, '#5a121e');
  bgGrad.addColorStop(0.5, '#851e2f');
  bgGrad.addColorStop(1, '#420d15');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, width, height);

  // Lunar Maria (dark basalt volcanic plains)
  const maria = [
    { x: 300, y: 200, r: 120 },
    { x: 420, y: 240, r: 90 },
    { x: 250, y: 280, r: 80 },
    { x: 720, y: 220, r: 110 },
    { x: 620, y: 310, r: 95 },
    { x: 800, y: 270, r: 75 },
    { x: 500, y: 150, r: 65 },
  ];

  maria.forEach((m) => {
    const grad = ctx.createRadialGradient(m.x, m.y, 10, m.x, m.y, m.r);
    grad.addColorStop(0, 'rgba(40, 8, 14, 0.7)');
    grad.addColorStop(0.6, 'rgba(65, 12, 22, 0.5)');
    grad.addColorStop(1, 'rgba(85, 20, 32, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
    ctx.fill();

    const bGrad = bCtx.createRadialGradient(m.x, m.y, 10, m.x, m.y, m.r);
    bGrad.addColorStop(0, '#505050');
    bGrad.addColorStop(1, '#808080');
    bCtx.fillStyle = bGrad;
    bCtx.beginPath();
    bCtx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
    bCtx.fill();
  });

  // Impact Craters with rim highlights & dark centers
  for (let i = 0; i < 180; i++) {
    const cx = Math.random() * width;
    const cy = Math.random() * height;
    const cr = 2 + Math.random() * 18;

    // Rim highlight
    ctx.strokeStyle = 'rgba(255, 160, 180, 0.45)';
    ctx.lineWidth = Math.max(1, cr * 0.2);
    ctx.beginPath();
    ctx.arc(cx, cy, cr, 0, Math.PI * 2);
    ctx.stroke();

    // Crater floor
    ctx.fillStyle = 'rgba(25, 4, 8, 0.55)';
    ctx.beginPath();
    ctx.arc(cx, cy, cr * 0.8, 0, Math.PI * 2);
    ctx.fill();

    // Bump
    bCtx.strokeStyle = '#d0d0d0';
    bCtx.lineWidth = Math.max(1, cr * 0.25);
    bCtx.beginPath();
    bCtx.arc(cx, cy, cr, 0, Math.PI * 2);
    bCtx.stroke();

    bCtx.fillStyle = '#303030';
    bCtx.beginPath();
    bCtx.arc(cx, cy, cr * 0.8, 0, Math.PI * 2);
    bCtx.fill();
  }

  const mapTex = new THREE.CanvasTexture(mapCanvas);
  const bumpTex = new THREE.CanvasTexture(bumpCanvas);
  mapTex.wrapS = THREE.RepeatWrapping;
  bumpTex.wrapS = THREE.RepeatWrapping;

  textureCache.set(cacheKeyMap, mapTex);
  textureCache.set(cacheKeyBump, bumpTex);

  return { map: mapTex, bump: bumpTex };
}

// 2. Realistic Gas Giant Atmosphere (Our Playlist / Saturn Style)
export function getGasGiantTexture(): { map: THREE.CanvasTexture; ring: THREE.CanvasTexture } {
  const cacheKeyMap = 'gas_giant_map';
  const cacheKeyRing = 'gas_giant_ring';

  if (textureCache.has(cacheKeyMap) && textureCache.has(cacheKeyRing)) {
    return {
      map: textureCache.get(cacheKeyMap)!,
      ring: textureCache.get(cacheKeyRing)!,
    };
  }

  const width = 1024;
  const height = 512;

  // Atmospheric Bands Canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  const palette = [
    '#e9c46a', '#f4a261', '#e76f51', '#264653',
    '#2a9d8f', '#e9c46a', '#f4a261', '#fefae0',
    '#dda15e', '#bc6c25', '#fefae0', '#e9c46a',
  ];

  // Draw cloud bands with wave turbulence
  for (let y = 0; y < height; y++) {
    const bandIdx = Math.floor((y / height) * palette.length);
    const nextIdx = (bandIdx + 1) % palette.length;
    const factor = ((y / height) * palette.length) % 1;

    ctx.fillStyle = palette[bandIdx];
    ctx.fillRect(0, y, width, 1);
  }

  // Atmospheric turbulence & storm swirls
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  for (let y = 0; y < height; y++) {
    const wave = Math.sin(y * 0.08) * 12 + Math.cos(y * 0.03) * 20;
    for (let x = 0; x < width; x++) {
      const srcX = (x + Math.floor(wave) + width) % width;
      const srcIdx = (y * width + srcX) * 4;
      const targetIdx = (y * width + x) * 4;

      // Soft ambient noise
      const noise = (Math.random() - 0.5) * 8;
      data[targetIdx] = Math.min(255, Math.max(0, data[srcIdx] + noise));
      data[targetIdx + 1] = Math.min(255, Math.max(0, data[srcIdx + 1] + noise));
      data[targetIdx + 2] = Math.min(255, Math.max(0, data[srcIdx + 2] + noise));
    }
  }
  ctx.putImageData(imgData, 0, 0);

  // Storm vortex (Great Red/Gold Spot)
  const spotGrad = ctx.createRadialGradient(400, 320, 5, 400, 320, 45);
  spotGrad.addColorStop(0, '#f94144');
  spotGrad.addColorStop(0.5, '#f3722c');
  spotGrad.addColorStop(1, 'rgba(248, 150, 30, 0)');
  ctx.fillStyle = spotGrad;
  ctx.beginPath();
  ctx.ellipse(400, 320, 55, 30, 0, 0, Math.PI * 2);
  ctx.fill();

  // Saturn-like Concentric Rings Texture with Cassini Gap
  const ringCanvas = document.createElement('canvas');
  ringCanvas.width = 512;
  ringCanvas.height = 1;
  const rCtx = ringCanvas.getContext('2d')!;

  const ringGrad = rCtx.createLinearGradient(0, 0, 512, 0);
  ringGrad.addColorStop(0.0, 'rgba(233, 196, 106, 0.0)');
  ringGrad.addColorStop(0.15, 'rgba(244, 162, 97, 0.65)');
  ringGrad.addColorStop(0.35, 'rgba(233, 196, 106, 0.85)');
  ringGrad.addColorStop(0.48, 'rgba(254, 250, 224, 0.9)');
  // Cassini Division Gap
  ringGrad.addColorStop(0.50, 'rgba(0, 0, 0, 0.05)');
  ringGrad.addColorStop(0.53, 'rgba(0, 0, 0, 0.05)');
  ringGrad.addColorStop(0.55, 'rgba(233, 196, 106, 0.7)');
  ringGrad.addColorStop(0.85, 'rgba(244, 162, 97, 0.55)');
  ringGrad.addColorStop(1.0, 'rgba(233, 196, 106, 0.0)');

  rCtx.fillStyle = ringGrad;
  rCtx.fillRect(0, 0, 512, 1);

  const mapTex = new THREE.CanvasTexture(canvas);
  const ringTex = new THREE.CanvasTexture(ringCanvas);
  mapTex.wrapS = THREE.RepeatWrapping;

  textureCache.set(cacheKeyMap, mapTex);
  textureCache.set(cacheKeyRing, ringTex);

  return { map: mapTex, ring: ringTex };
}

// 3. Realistic Ice Giant / Cyan World (Music & Canvas / Neptune Style)
export function getIceGiantTexture(): { map: THREE.CanvasTexture; ring: THREE.CanvasTexture } {
  const cacheKeyMap = 'ice_giant_map';
  const cacheKeyRing = 'ice_giant_ring';

  if (textureCache.has(cacheKeyMap) && textureCache.has(cacheKeyRing)) {
    return {
      map: textureCache.get(cacheKeyMap)!,
      ring: textureCache.get(cacheKeyRing)!,
    };
  }

  const width = 1024;
  const height = 512;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Deep azure, cerulean, and teal bands
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0.0, '#03045e');
  grad.addColorStop(0.2, '#0077b6');
  grad.addColorStop(0.4, '#0096c7');
  grad.addColorStop(0.5, '#00b4d8');
  grad.addColorStop(0.65, '#0077b6');
  grad.addColorStop(0.85, '#023e8a');
  grad.addColorStop(1.0, '#03045e');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // High-altitude bright methane cirrus clouds
  ctx.fillStyle = 'rgba(224, 251, 252, 0.45)';
  for (let i = 0; i < 25; i++) {
    const cy = 120 + Math.random() * 280;
    const cx = Math.random() * width;
    const len = 40 + Math.random() * 120;
    const thickness = 2 + Math.random() * 5;

    ctx.beginPath();
    ctx.ellipse(cx, cy, len, thickness, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Tilted translucent ice ring
  const ringCanvas = document.createElement('canvas');
  ringCanvas.width = 512;
  ringCanvas.height = 1;
  const rCtx = ringCanvas.getContext('2d')!;

  const ringGrad = rCtx.createLinearGradient(0, 0, 512, 0);
  ringGrad.addColorStop(0.0, 'rgba(0, 180, 216, 0.0)');
  ringGrad.addColorStop(0.25, 'rgba(144, 224, 239, 0.5)');
  ringGrad.addColorStop(0.6, 'rgba(72, 202, 228, 0.75)');
  ringGrad.addColorStop(0.85, 'rgba(0, 119, 182, 0.4)');
  ringGrad.addColorStop(1.0, 'rgba(0, 119, 182, 0.0)');

  rCtx.fillStyle = ringGrad;
  rCtx.fillRect(0, 0, 512, 1);

  const mapTex = new THREE.CanvasTexture(canvas);
  const ringTex = new THREE.CanvasTexture(ringCanvas);
  mapTex.wrapS = THREE.RepeatWrapping;

  textureCache.set(cacheKeyMap, mapTex);
  textureCache.set(cacheKeyRing, ringTex);

  return { map: mapTex, ring: ringTex };
}
