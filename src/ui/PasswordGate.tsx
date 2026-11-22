import React, { useState } from 'react';
import { useUniverse } from '../store/useUniverse';
import { audioSynth } from '../utils/audioSynth';

export const PasswordGate: React.FC = () => {
  const [inputVal, setInputVal] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const setStage = useUniverse((s) => s.setStage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Normalize by stripping non-digit characters
    const normalized = inputVal.replace(/\D/g, '');

    // Accept 11112026, 111126
    if (normalized === '11112026' || normalized === '111126') {
      audioSynth.playChime(659.25);
      setStage('intro');
    } else {
      setIsShaking(true);
      setShowHint(true);
      audioSynth.playWhoosh();
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try { navigator.vibrate([40, 40, 40]); } catch {}
      }
      setTimeout(() => setIsShaking(false), 600);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'radial-gradient(ellipse at center, #0d0b2e 0%, #070817 100%)',
      padding: '24px'
    }}>
      {/* Background Star Ambient Glow */}
      <div style={{
        position: 'absolute',
        width: '320px',
        height: '320px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(123, 92, 255, 0.25) 0%, rgba(255, 95, 183, 0.1) 50%, transparent 75%)',
        filter: 'blur(40px)',
        pointerEvents: 'none'
      }} />

      <div style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center',
        transform: isShaking ? 'translateX(-10px)' : 'none',
        transition: 'transform 0.1s ease-in-out'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          margin: '0 auto 20px',
          borderRadius: '50%',
          background: 'rgba(255, 212, 138, 0.15)',
          border: '1px solid rgba(255, 212, 138, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          boxShadow: '0 0 25px rgba(255, 212, 138, 0.3)'
        }}>
          ✨
        </div>

        <h1 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '34px',
          fontWeight: 400,
          color: '#fff4e0',
          marginBottom: '8px',
          letterSpacing: '1px'
        }}>
          A Little Universe
        </h1>

        <p style={{
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontSize: '14px',
          color: '#a5b4fc',
          marginBottom: '32px',
          letterSpacing: '0.5px'
        }}>
          Enter the date to unlock the stars
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '18px' }}>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="DD/MM/YYYY"
              autoFocus
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.06)',
                border: isShaking ? '1px solid #ff5fb7' : '1px solid rgba(123, 92, 255, 0.4)',
                borderRadius: '16px',
                padding: '16px 20px',
                color: '#fff',
                fontSize: '18px',
                textAlign: 'center',
                outline: 'none',
                letterSpacing: '3px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                transition: 'border 0.2s ease, box-shadow 0.2s ease'
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #7b5cff 0%, #ff5fb7 100%)',
              border: 'none',
              borderRadius: '16px',
              padding: '14px 24px',
              color: '#fff',
              fontSize: '15px',
              fontWeight: 500,
              cursor: 'pointer',
              boxShadow: '0 10px 25px rgba(123, 92, 255, 0.35)',
              transition: 'transform 0.15s ease, opacity 0.15s ease',
              fontFamily: 'inherit'
            }}
          >
            Enter Universe
          </button>
        </form>

        {showHint && (
          <p style={{
            fontFamily: 'Caveat, cursive',
            fontSize: '18px',
            color: '#ffd48a',
            marginTop: '24px',
            opacity: 0.95
          }}>
            Hint: A date I'll always remember...
          </p>
        )}
      </div>
    </div>
  );
};
