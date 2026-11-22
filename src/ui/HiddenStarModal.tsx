import React from 'react';
import confetti from 'canvas-confetti';
import { audioSynth } from '../utils/audioSynth';

interface Props {
  onClose: () => void;
}

export const HiddenStarModal: React.FC<Props> = ({ onClose }) => {
  React.useEffect(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff5fb7', '#7b5cff', '#4fd6d0', '#ffd48a']
      });
    } catch {}
  }, []);

  const handleClose = () => {
    audioSynth.playWhoosh();
    onClose();
  };

  return (
    <div style={{
      maxWidth: '440px',
      width: '90vw',
      background: 'rgba(20, 10, 35, 0.94)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 95, 183, 0.5)',
      borderRadius: '24px',
      padding: '30px 24px',
      boxShadow: '0 20px 50px rgba(0,0,0,0.7), 0 0 45px rgba(255, 95, 183, 0.3)',
      color: '#fff',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '32px', marginBottom: '12px' }}>
        ✨🔮✨
      </div>

      <div style={{
        fontSize: '11px',
        letterSpacing: '3px',
        textTransform: 'uppercase',
        color: '#ff5fb7',
        marginBottom: '6px'
      }}>
        Secret Easter Egg Found
      </div>

      <h2 style={{
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: '28px',
        fontWeight: 600,
        color: '#fff4e0',
        marginBottom: '16px'
      }}>
        The Hidden Star
      </h2>

      <p style={{
        fontFamily: 'Caveat, cursive',
        fontSize: '23px',
        color: '#fbcfe8',
        lineHeight: 1.4,
        marginBottom: '20px'
      }}>
        "You always look a little closer than everyone else. That curiosity is one of the many things that make you so wonderful."
      </p>

      <div style={{
        fontSize: '13px',
        color: '#ffd48a',
        background: 'rgba(255, 212, 138, 0.15)',
        padding: '8px 16px',
        borderRadius: '12px',
        marginBottom: '24px'
      }}>
        🌠 Finale sequence has been unlocked!
      </div>

      <button
        onClick={handleClose}
        style={{
          background: 'linear-gradient(135deg, rgba(255,95,183,0.4), rgba(123,92,255,0.4))',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          color: '#fff',
          padding: '10px 28px',
          borderRadius: '20px',
          cursor: 'pointer',
          fontSize: '14px',
          fontFamily: 'inherit'
        }}
      >
        Sweet!
      </button>
    </div>
  );
};
