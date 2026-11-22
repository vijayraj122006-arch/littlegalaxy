import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { PlanetDef } from '../content/planets';
import { audioSynth } from '../utils/audioSynth';

interface Props {
  planet: PlanetDef;
  onClose: () => void;
}

export const InsideJoke: React.FC<Props> = ({ planet, onClose }) => {
  const jokes = planet.payload.jokes || [];
  const [activeJokeIdx, setActiveJokeIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const handleReveal = () => {
    if (!revealed) {
      setRevealed(true);
      audioSynth.playChime(784.0);
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.65 },
          colors: ['#ffd48a', '#ff5fb7', '#4fd6d0']
        });
      } catch {}
    } else {
      // Advance to next joke
      setRevealed(false);
      setActiveJokeIdx((prev) => (prev + 1) % jokes.length);
      audioSynth.playWhoosh();
    }
  };

  const currentJoke = jokes[activeJokeIdx];

  return (
    <div style={{
      maxWidth: '460px',
      width: '90vw',
      background: 'rgba(28, 20, 10, 0.92)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 212, 138, 0.4)',
      borderRadius: '24px',
      padding: '28px 24px',
      boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 35px rgba(255, 212, 138, 0.25)',
      color: '#fff',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#ffd48a', marginBottom: '8px' }}>
        {planet.theme} ({activeJokeIdx + 1}/{jokes.length})
      </div>
      <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: 600, color: '#fff4e0', marginBottom: '20px' }}>
        {planet.name}
      </h2>

      {/* Joke Card */}
      <div
        onClick={handleReveal}
        style={{
          minHeight: '140px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '18px',
          padding: '20px',
          marginBottom: '24px',
          cursor: 'pointer',
          border: '1px dashed rgba(255, 212, 138, 0.4)',
          transition: 'all 0.3s ease'
        }}
      >
        <p style={{ fontSize: '17px', color: '#ffedd5', marginBottom: '12px', fontWeight: 500 }}>
          {currentJoke?.setup}
        </p>

        {revealed ? (
          <p style={{
            fontFamily: 'Caveat, cursive',
            fontSize: '24px',
            color: '#ffd48a',
            lineHeight: 1.3,
            animation: 'fadeIn 0.3s ease'
          }}>
            😄 {currentJoke?.punchline}
          </p>
        ) : (
          <div style={{
            fontSize: '13px',
            color: '#fbbf24',
            background: 'rgba(251, 191, 36, 0.15)',
            padding: '6px 16px',
            borderRadius: '12px'
          }}>
            👉 Tap to reveal punchline
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
        <button
          onClick={handleReveal}
          style={{
            background: 'rgba(255, 212, 138, 0.2)',
            border: '1px solid rgba(255, 212, 138, 0.4)',
            color: '#ffd48a',
            padding: '10px 20px',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '14px',
            fontFamily: 'inherit'
          }}
        >
          {revealed ? 'Next Joke ➡️' : 'Reveal'}
        </button>

        <button
          onClick={onClose}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '14px',
            fontFamily: 'inherit'
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};
