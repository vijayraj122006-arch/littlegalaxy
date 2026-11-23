import React, { useMemo } from 'react';
import * as THREE from 'three';
import { MEMORIES, CONSTELLATION_LINES } from '../content/memories';
import { useUniverse } from '../store/useUniverse';

export const Constellation: React.FC = () => {
  const visitedMemories = useUniverse((s) => s.visitedMemories);
  const wishes = useUniverse((s) => s.wishes);

  const memoryPosMap = useMemo(() => {
    const map = new Map<string, [number, number, number]>();
    MEMORIES.forEach((m) => {
      map.set(m.id, m.position);
    });
    return map;
  }, []);

  // Compute glowing active lines and faint guide lines for Constellation "P"
  const { activePos, activeCols, guidePos } = useMemo(() => {
    const actP: number[] = [];
    const actC: number[] = [];
    const guiP: number[] = [];

    const gold = new THREE.Color('#ffd48a');
    const pink = new THREE.Color('#ff5fb7');

    const pEdges = CONSTELLATION_LINES['constellation-p'] || [];
    pEdges.forEach(([idA, idB]) => {
      const posA = memoryPosMap.get(idA);
      const posB = memoryPosMap.get(idB);
      if (!posA || !posB) return;

      const visitedA = visitedMemories.includes(idA);
      const visitedB = visitedMemories.includes(idB);

      if (visitedA && visitedB) {
        actP.push(...posA, ...posB);
        actC.push(pink.r, pink.g, pink.b, gold.r, gold.g, gold.b);
      } else {
        guiP.push(...posA, ...posB);
      }
    });

    return {
      activePos: new Float32Array(actP),
      activeCols: new Float32Array(actC),
      guidePos: new Float32Array(guiP),
    };
  }, [visitedMemories, memoryPosMap]);

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
      {/* 1. Blazing lit constellation lines for letter "P" */}
      {activePos.length > 0 && (
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[activePos, 3]}
            />
            <bufferAttribute
              attach="attributes-color"
              args={[activeCols, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            vertexColors
            transparent
            opacity={0.9}
            linewidth={2}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </lineSegments>
      )}

      {/* 2. Faint ethereal cosmic guide lines */}
      {guidePos.length > 0 && (
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[guidePos, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color="#a5b4fc"
            transparent
            opacity={0.12}
            linewidth={1}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </lineSegments>
      )}

      {/* 3. Released wish stars */}
      {wishPositions.length > 0 && (
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[wishPositions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.9}
            color="#ffd48a"
            transparent
            opacity={0.95}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      )}
    </group>
  );
};
