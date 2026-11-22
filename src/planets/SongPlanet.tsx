import React, { useState, useEffect } from 'react';
import { PlanetDef } from '../content/planets';
import { audioSynth } from '../utils/audioSynth';

interface Props {
  planet: PlanetDef;
  onClose: () => void;
}

interface Drop {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
}

export const SongPlanet: React.FC<Props> = ({ planet, onClose }) => {
  const [drops, setDrops] = useState<Drop[]>([]);
  const [dropCount, setDropCount] = useState(0);

  // Add rain drop when screen is tapped
  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    audioSynth.playRainDrop();
    audioSynth.playChime(587.33 + (dropCount % 5) * 60);

    const newDrop: Drop = {
      id: Date.now() + Math.random(),
      x,
      y: 0,
      size: 10 + Math.random() * 14,
      speed: 3 + Math.random() * 4
    };

    setDrops((prev) => [...prev.slice(-25), newDrop]);
    setDropCount((c) => c + 1);
  };

  // Animate rain falling down
  useEffect(() => {
    const interval = setInterval(() => {
      setDrops((prev) =>
        prev
          .map((d) => ({ ...d, y: d.y + d.speed }))
          .filter((d) => d.y < 280)
      );
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      maxWidth: '480px',
      width: '92vw',
      background: 'rgba(10, 28, 26, 0.92)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(110, 231, 183, 0.4)',
      borderRadius: '24px',
      padding: '28px 24px',
      boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 35px rgba(110, 231, 183, 0.25)',
      color: '#fff',
      textAlign: 'center',
      userSelect: 'none'
    }}>
      <div style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#6ee7b7', marginBottom: '8px' }}>
        {planet.theme}
      </div>
      <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: 600, color: '#fff4e0', marginBottom: '4px' }}>
        "{planet.payload.songTitle}"
      </h2>
      <p style={{ fontSize: '12px', color: '#a7f3d0', marginBottom: '16px' }}>
        Tap anywhere inside the box to create showers of celestial rain
      </p>

      {/* Interactive Rain Box */}
      <div
        onClick={handleTap}
        style={{
          height: '200px',
          borderRadius: '16px',
          background: 'radial-gradient(ellipse at top, rgba(16, 185, 129, 0.15) 0%, rgba(7, 8, 23, 0.8) 100%)',
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
          border: '1px solid rgba(110, 231, 183, 0.25)',
          marginBottom: '20px'
        }}
      >
        {drops.map((d) => (
          <div
            key={d.id}
            style={{
              position: 'absolute',
              left: `${d.x}px`,
              top: `${d.y}px`,
              width: '2px',
              height: `${d.size * 2}px`,
              background: 'linear-gradient(to bottom, rgba(110, 231, 183, 0), #6ee7b7)',
              borderRadius: '2px',
              boxShadow: '0 0 8px #6ee7b7'
            }}
          />
        ))}

        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: 0,
          right: 0,
          fontSize: '13px',
          color: 'rgba(255,255,255,0.6)'
        }}>
          💧 {dropCount} gentle droplets fallen
        </div>
      </div>

      <p style={{ fontFamily: 'Caveat, cursive', fontSize: '20px', color: '#d1fae5', lineHeight: 1.4, marginBottom: '22px' }}>
        "{planet.payload.caption}"
      </p>

      <button
        onClick={onClose}
        style={{
          background: 'linear-gradient(135deg, rgba(16,185,129,0.3), rgba(79,214,208,0.4))',
          border: '1px solid rgba(255,255,255,0.2)',
          color: '#fff',
          padding: '10px 24px',
          borderRadius: '20px',
          cursor: 'pointer',
          fontSize: '14px',
          fontFamily: 'inherit'
        }}
      >
        Close Planet
      </button>
    </div>
  );
};
