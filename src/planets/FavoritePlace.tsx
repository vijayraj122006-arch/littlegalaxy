import React, { useState, useRef } from 'react';
import { PlanetDef } from '../content/planets';

interface Props {
  planet: PlanetDef;
  onClose: () => void;
}

export const FavoritePlace: React.FC<Props> = ({ planet, onClose }) => {
  const [panX, setPanX] = useState(0);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - startXRef.current;
    setPanX((prev) => (prev + dx * 0.4) % 360);
    startXRef.current = e.clientX;
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div style={{
      maxWidth: '480px',
      width: '92vw',
      background: 'rgba(11, 26, 46, 0.9)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(79, 214, 208, 0.4)',
      borderRadius: '24px',
      padding: '28px 24px',
      boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 35px rgba(79, 214, 208, 0.25)',
      color: '#fff',
      textAlign: 'center',
      userSelect: 'none'
    }}>
      <div style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#4fd6d0', marginBottom: '8px' }}>
        {planet.theme}
      </div>
      <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: 600, color: '#fff4e0', marginBottom: '8px' }}>
        {planet.payload.title || planet.name}
      </h2>
      <p style={{ fontSize: '12px', color: '#9cf0ec', marginBottom: '20px' }}>
        (Drag horizontally to explore the 360° view)
      </p>

      {/* Interactive 360 Panorama Viewport */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{
          height: '180px',
          borderRadius: '16px',
          overflow: 'hidden',
          position: 'relative',
          cursor: 'grab',
          background: 'radial-gradient(ellipse at bottom, #0d2b45 0%, #070817 100%)',
          marginBottom: '20px',
          border: '1px solid rgba(79, 214, 208, 0.2)'
        }}
      >
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          transform: `translateX(${panX}px)`,
          transition: isDraggingRef.current ? 'none' : 'transform 0.1s ease-out'
        }}>
          {/* Repeating panoramic scene elements */}
          {[-1, 0, 1].map((offset) => (
            <div key={offset} style={{
              minWidth: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-around',
              paddingBottom: '20px'
            }}>
              <div style={{ fontSize: '38px', filter: 'drop-shadow(0 0 10px #4fd6d0)' }}>🌙</div>
              <div style={{ fontSize: '28px', filter: 'drop-shadow(0 0 8px #ffd48a)' }}>✨</div>
              <div style={{ fontSize: '36px', filter: 'drop-shadow(0 0 12px #ff5fb7)' }}>🏮</div>
              <div style={{ fontSize: '30px', filter: 'drop-shadow(0 0 8px #9cf0ec)' }}>☕</div>
              <div style={{ fontSize: '32px', filter: 'drop-shadow(0 0 10px #fff4e0)' }}>🌌</div>
            </div>
          ))}
        </div>
      </div>

      <p style={{ fontFamily: 'Caveat, cursive', fontSize: '20px', color: '#e0e7ff', lineHeight: 1.4, marginBottom: '24px' }}>
        "{planet.payload.vibe}"
      </p>

      <button
        onClick={onClose}
        style={{
          background: 'linear-gradient(135deg, rgba(79,214,208,0.3), rgba(123,92,255,0.4))',
          border: '1px solid rgba(255,255,255,0.2)',
          color: '#fff',
          padding: '10px 24px',
          borderRadius: '20px',
          cursor: 'pointer',
          fontSize: '14px',
          fontFamily: 'inherit'
        }}
      >
        Back to Orbit
      </button>
    </div>
  );
};
