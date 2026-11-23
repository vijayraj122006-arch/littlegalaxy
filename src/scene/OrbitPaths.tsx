import React, { useMemo } from 'react';
import * as THREE from 'three';
import { PLANETS } from '../content/planets';

export const OrbitPaths: React.FC = () => {
  const orbits = useMemo(() => {
    return PLANETS.map((planet) => {
      const [x, y, z] = planet.position;
      const radius = Math.sqrt(x * x + z * z);
      const points: THREE.Vector3[] = [];
      const segments = 128;

      // Inclined elliptical orbit
      const tilt = (y / radius) * 0.8;
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        const px = Math.cos(theta) * radius;
        const pz = Math.sin(theta) * radius;
        const py = Math.sin(theta) * (y * 0.9);
        points.push(new THREE.Vector3(px, py, pz));
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      return {
        id: planet.id,
        geometry,
        color: new THREE.Color(planet.color),
      };
    });
  }, []);

  return (
    <group>
      {orbits.map((orb) => (
        <lineLoop key={orb.id} geometry={orb.geometry}>
          <lineBasicMaterial
            color={orb.color}
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </lineLoop>
      ))}
    </group>
  );
};
