import React from 'react';
import { audioSynth } from '../utils/audioSynth';
import { CONFIG } from '../content/config';

interface Props {
  onClose: () => void;
}

export const BirthdayModal: React.FC<Props> = ({ onClose }) => {
  const handleClose = () => {
    audioSynth.playWhoosh();
    onClose();
  };

  return (
    <div style={{
      maxWidth: '460px',
      width: '90vw',
      background: 'rgba(28, 20, 10, 0.94)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 212, 138, 0.55)',
      borderRadius: '24px',
      padding: '32px 24px',
      boxShadow: '0 20px 50px rgba(0,0,0,0.7), 0 0 45px rgba(255, 212, 138, 0.35)',
      color: '#fff',
      textAlign: 'center'
    }}>
      <div style={{
        width: '56px',
        height: '56px',
        margin: '0 auto 16px',
        borderRadius: '50%',
        background: 'rgba(255, 212, 138, 0.2)',
        border: '1px solid rgba(255, 212, 138, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '28px'
      }}>
        🌟
      </div>

      <div style={{
        fontSize: '11px',
        letterSpacing: '3px',
        textTransform: 'uppercase',
        color: '#ffd48a',
        marginBottom: '6px'
      }}>
        17 November • The Birthday Star
      </div>

      <h2 style={{
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: '30px',
        fontWeight: 600,
        color: '#fff4e0',
        marginBottom: '18px'
      }}>
        Happy Birthday, {CONFIG.recipientName} ✨
      </h2>

      <p style={{
        fontFamily: 'Caveat, cursive',
        fontSize: '22px',
        color: '#fef3c7',
        lineHeight: 1.5,
        marginBottom: '16px'
      }}>
        "A little late, but I wanted it to be right."
      </p>

      <p style={{
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        fontSize: '14px',
        color: '#fde68a',
        lineHeight: 1.6,
        marginBottom: '28px',
        opacity: 0.9
      }}>
        I hope this coming year brings you gentle mornings, reasons to laugh out loud, and moments that make you smile from the inside out.
      </p>

      <p style={{
        fontFamily: 'Caveat, cursive',
        fontSize: '20px',
        color: '#ffd48a',
        marginBottom: '24px'
      }}>
        — Vijay
      </p>

      <button
        onClick={handleClose}
        style={{
          background: 'linear-gradient(135deg, rgba(255, 212, 138, 0.35), rgba(255, 95, 183, 0.35))',
          border: '1px solid rgba(255, 212, 138, 0.5)',
          color: '#ffd48a',
          padding: '12px 30px',
          borderRadius: '24px',
          cursor: 'pointer',
          fontSize: '14px',
          fontFamily: 'inherit'
        }}
      >
        Keep Shining 💫
      </button>
    </div>
  );
};
