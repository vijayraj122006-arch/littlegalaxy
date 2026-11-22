import React, { useState, useEffect, useMemo } from 'react';
import { useUniverse } from '../store/useUniverse';
import { CONFIG } from '../content/config';
import { useAudio } from '../hooks/useAudio';

export const Intro: React.FC = () => {
  const setStage = useUniverse((s) => s.setStage);
  const { toggle, playChime } = useAudio();
  const setAudioOn = useUniverse((s) => s.setAudioOn);

  const [displayedText, setDisplayedText] = useState('');
  const fullText = CONFIG.introLine; // "I made you a small universe."
  const [showButton, setShowButton] = useState(false);

  const isBirthdayToday = useMemo(() => {
    const now = new Date();
    return now.getDate() === CONFIG.birthday.day && (now.getMonth() + 1) === CONFIG.birthday.month;
  }, []);

  // Typewriter effect
  useEffect(() => {
    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < fullText.length) {
        setDisplayedText(fullText.slice(0, currentIdx + 1));
        currentIdx++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowButton(true), 600);
      }
    }, 90);

    return () => clearInterval(interval);
  }, [fullText]);

  const handleBegin = () => {
    // Start audio on user gesture
    setAudioOn(true);
    playChime(587.33);
    setStage('explore');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 90,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#070817',
      color: '#fff',
      padding: '24px',
      textAlign: 'center'
    }}>
      {/* Solitary pulsing start star */}
      <div style={{
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        backgroundColor: '#ffd48a',
        boxShadow: '0 0 25px 8px rgba(255, 212, 138, 0.7)',
        marginBottom: '40px',
        animation: 'pulse 3s infinite ease-in-out'
      }} />

      {isBirthdayToday && (
        <div style={{
          fontFamily: 'Caveat, cursive',
          fontSize: '24px',
          color: '#ffd48a',
          marginBottom: '16px'
        }}>
          Happy Birthday, {CONFIG.recipientName} ✨
        </div>
      )}

      <h1 style={{
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: '32px',
        fontWeight: 300,
        color: '#fff4e0',
        minHeight: '44px',
        letterSpacing: '1px',
        maxWidth: '480px',
        lineHeight: 1.4
      }}>
        {displayedText}
        <span style={{ opacity: 0.6 }}>|</span>
      </h1>

      {showButton && (
        <button
          onClick={handleBegin}
          style={{
            marginTop: '48px',
            background: 'transparent',
            border: '1px solid rgba(255, 212, 138, 0.4)',
            color: '#ffd48a',
            padding: '14px 36px',
            borderRadius: '30px',
            fontSize: '15px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            cursor: 'pointer',
            boxShadow: '0 0 30px rgba(255, 212, 138, 0.15)',
            transition: 'all 0.3s ease',
            fontFamily: 'Plus Jakarta Sans, sans-serif'
          }}
        >
          Tap to begin
        </button>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.6); opacity: 1; box-shadow: 0 0 35px 12px rgba(255, 212, 138, 0.9); }
        }
      `}</style>
    </div>
  );
};
