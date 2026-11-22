import React, { useState } from 'react';
import { useUniverse, Wish } from '../store/useUniverse';
import { audioSynth } from '../utils/audioSynth';

export const WishPrompt: React.FC = () => {
  const [wishText, setWishText] = useState('');
  const addWish = useUniverse((s) => s.addWish);
  const setWishPromptOpen = useUniverse((s) => s.setWishPromptOpen);
  const pendingWishPos = useUniverse((s) => s.pendingWishPos);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishText.trim()) return;

    audioSynth.playWhoosh();
    audioSynth.playChime(880);

    const pos = pendingWishPos || [
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 30
    ];

    const newWish: Wish = {
      text: wishText.trim(),
      x: pos[0],
      y: pos[1],
      z: pos[2],
      at: Date.now()
    };

    addWish(newWish);
  };

  const handleCancel = () => {
    setWishPromptOpen(false);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 80,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(7, 8, 23, 0.65)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '420px',
        width: '100%',
        background: 'rgba(13, 11, 46, 0.92)',
        border: '1px solid rgba(255, 212, 138, 0.4)',
        borderRadius: '24px',
        padding: '28px 24px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 35px rgba(255, 212, 138, 0.25)',
        textAlign: 'center',
        color: '#fff'
      }}>
        <div style={{ fontSize: '28px', marginBottom: '8px' }}>
          🌠
        </div>
        <h3 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '26px',
          fontWeight: 600,
          color: '#fff4e0',
          marginBottom: '8px'
        }}>
          Make a Wish
        </h3>
        <p style={{
          fontSize: '13px',
          color: '#ffd48a',
          marginBottom: '20px'
        }}>
          Send a little thought into the galaxy. It will shine as a quiet star whenever you return.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={wishText}
            onChange={(e) => setWishText(e.target.value)}
            placeholder="Type your wish..."
            maxLength={120}
            autoFocus
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 212, 138, 0.3)',
              borderRadius: '16px',
              padding: '14px 18px',
              color: '#fff',
              fontSize: '16px',
              fontFamily: 'Caveat, cursive',
              outline: 'none',
              marginBottom: '20px'
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #ffd48a, #ff5fb7)',
                border: 'none',
                color: '#070817',
                padding: '10px 24px',
                borderRadius: '20px',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}
            >
              Release Star
            </button>
            <button
              type="button"
              onClick={handleCancel}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#fff',
                padding: '10px 20px',
                borderRadius: '20px',
                fontSize: '14px',
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
