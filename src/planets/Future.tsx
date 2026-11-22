import React, { useState } from 'react';
import { PlanetDef } from '../content/planets';
import { audioSynth } from '../utils/audioSynth';

interface Props {
  planet: PlanetDef;
  onClose: () => void;
}

export const Future: React.FC<Props> = ({ planet, onClose }) => {
  const dreams = planet.payload.dreams || [];
  const [ignitedIds, setIgnitedIds] = useState<string[]>([]);

  const handleIgnite = (id: string, idx: number) => {
    if (!ignitedIds.includes(id)) {
      setIgnitedIds((prev) => [...prev, id]);
      audioSynth.playChime(523.25 + idx * 90);
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try { navigator.vibrate(25); } catch {}
      }
    }
  };

  return (
    <div style={{
      maxWidth: '480px',
      width: '92vw',
      background: 'rgba(15, 12, 38, 0.94)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(123, 92, 255, 0.4)',
      borderRadius: '24px',
      padding: '28px 24px',
      boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 35px rgba(123, 92, 255, 0.25)',
      color: '#fff',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#7b5cff', marginBottom: '8px' }}>
        {planet.theme}
      </div>
      <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: 600, color: '#fff4e0', marginBottom: '8px' }}>
        {planet.name}
      </h2>
      <p style={{ fontSize: '12px', color: '#c4b5fd', marginBottom: '22px' }}>
        Tap each dark star to ignite a wish for tomorrow ({ignitedIds.length}/{dreams.length} ignited)
      </p>

      {/* Cluster of dark stars */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        marginBottom: '24px'
      }}>
        {dreams.map((d: any, idx: number) => {
          const isLit = ignitedIds.includes(d.id);
          return (
            <div
              key={d.id}
              onClick={() => handleIgnite(d.id, idx)}
              style={{
                background: isLit ? 'rgba(123, 92, 255, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                border: isLit ? '1px solid #a78bfa' : '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: isLit ? '0 0 16px rgba(123, 92, 255, 0.4)' : 'none',
                borderRadius: '16px',
                padding: '16px 12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <div style={{
                fontSize: '24px',
                marginBottom: '8px',
                filter: isLit ? 'drop-shadow(0 0 8px #ffd48a)' : 'grayscale(1)',
                opacity: isLit ? 1 : 0.4
              }}>
                {isLit ? '⭐' : '🌑'}
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: isLit ? '#ffd48a' : '#94a3b8', marginBottom: '4px' }}>
                {d.title}
              </div>
              {isLit && (
                <div style={{ fontFamily: 'Caveat, cursive', fontSize: '16px', color: '#e0e7ff', lineHeight: 1.2 }}>
                  "{d.note}"
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={onClose}
        style={{
          background: 'linear-gradient(135deg, rgba(123,92,255,0.4), rgba(255,95,183,0.3))',
          border: '1px solid rgba(255,255,255,0.2)',
          color: '#fff',
          padding: '10px 24px',
          borderRadius: '20px',
          cursor: 'pointer',
          fontSize: '14px',
          fontFamily: 'inherit'
        }}
      >
        Close Cluster
      </button>
    </div>
  );
};
