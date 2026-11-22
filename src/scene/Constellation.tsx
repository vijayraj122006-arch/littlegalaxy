import React, { useMemo } from 'react';
import * as THREE from 'three';
import { MEMORIES, CONSTELLATION_LINES } from '../content/memories';
import { useUniverse } from '../store/useUniverse';

export const Constellation: React.FC = () => {
  const visitedMemories = useUniverse((s) => s.visitedMemories);
  const drawnLines = useUniverse((s) => s.drawnLines);
  const wishes = useUniverse((s) => s.wishes);

  // Map of memory ID to position
  const memoryPosMap = useMemo(() => {
    const map = new Map<string, [number, number, number]>();
    MEMORIES.forEach((m) => {
      map.set(m.id, m.position);
    });
    return map;
  }, []);

  // Compute active lines for predefined constellations (e.g. 'P')
  const { linePositions, lineColors } = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];

    const gold = new THREE.Color('#ffd48a');
    const cyan = new THREE.Color('#4fd6d0');
    const pink = new THREE.Color('#ff5fb7');

    // 1. Check predefined constellation "P"
    const pEdges = CONSTELLATION_LINES['constellation-p'] || [];
    pEdges.forEach(([idA, idB]) => {
      // Connect if both are visited, or if at least one is visited connect with subtle glow
      const visitedA = visitedMemories.includes(idA);
      const visitedB = visitedMemories.includes(idB);

      if (visitedA && visitedB) {
        const posA = memoryPosMap.get(idA);
        const posB = memoryPosMap.get(idB);
        if (posA && posB) {
          positions.push(...posA, ...posB);
          colors.push(pink.r, pink.g, pink.b, gold.r, gold.g, gold.b);
        }
      }
    });

    // 2. User drawn constellation lines
    drawnLines.forEach(([idA, idB]) => {
      const posA = memoryPosMap.get(idA);
      const posB = memoryPosMap.get(idB);
      if (posA && posB) {
        positions.push(...posA, ...posB);
        colors.push(cyan.r, cyan.g, cyan.b, cyan.r, cyan.g, cyan.b);
      }
    });

    return {
      linePositions: new Float32Array(positions),
      lineColors: new Float32Array(colors),
    };
  }, [visitedMemories, drawnLines, memoryPosMap]);

  // Wish stars positions
  const wishPositions = useMemo(() => {
    const arr = new Float32Array(wishes.length * 3);
    wishes.forEach((w, idx) => {
      arr[idx * 3] = w.x;
      arr[idx * 3 + 1] = w.y;
      arr[idx * 3 + 2] = w.z;
    });
    return arr;
  }, [wishes]);

  return (
    <group>
      {/* Glowing constellation lines */}
      {linePositions.length > 0 && (
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[linePositions, 3]}
            />
            <bufferAttribute
              attach="attributes-color"
              args={[lineColors, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            vertexColors
            transparent
            opacity={0.85}
            linewidth={2}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </lineSegments>
      )}

      {/* Persistent faint wish stars */}
      {wishPositions.length > 0 && (
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[wishPositions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={1.2}
            color="#ffe6b8"
            transparent
            opacity={0.7}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      )}
    </group>
  );
};
