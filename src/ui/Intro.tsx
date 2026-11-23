import React, { useState, useEffect, useMemo } from 'react';
import { useUniverse } from '../store/useUniverse';
import { CONFIG } from '../content/config';
import { useAudio } from '../hooks/useAudio';
import { Heart, Sparkles, Music } from 'lucide-react';

export const Intro: React.FC = () => {
  const setStage = useUniverse((s) => s.setStage);
  const { playChime } = useAudio();
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
        setTimeout(() => setShowButton(true), 500);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [fullText]);

  const handleBegin = () => {
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
      background: 'radial-gradient(ellipse at center, #100b28 0%, #050410 100%)',
      color: '#fff',
      padding: '24px',
      textAlign: 'center'
    }}>
      {/* Solitary pulsing romantic heart star */}
      <div style={{
        position: 'relative',
        marginBottom: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          backgroundColor: '#ff5fb7',
          boxShadow: '0 0 35px 12px rgba(255, 95, 183, 0.75)',
          animation: 'starPulse 3s infinite ease-in-out'
        }} />
        <div style={{
          position: 'absolute',
          color: '#fff4e0',
          fontSize: '12px',
          filter: 'drop-shadow(0 0 8px #ffd48a)'
        }}>
          ✨
        </div>
      </div>

      {isBirthdayToday && (
        <div style={{
          fontFamily: 'Caveat, cursive',
          fontSize: '26px',
          color: '#ffd48a',
          marginBottom: '16px',
          animation: 'fadeIn 1s ease'
        }}>
          Happy Birthday, {CONFIG.recipientName} ❤️
        </div>
      )}

      <h1 style={{
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: '34px',
        fontWeight: 300,
        color: '#fff4e0',
        minHeight: '48px',
        letterSpacing: '1px',
        maxWidth: '520px',
        lineHeight: 1.4,
        textShadow: '0 0 20px rgba(255, 212, 138, 0.3)'
      }}>
        {displayedText}
        <span style={{ opacity: 0.6, color: '#ff5fb7' }}>|</span>
      </h1>

      <p style={{
        fontFamily: 'Caveat, cursive',
        fontSize: '21px',
        color: '#c4b5fd',
        marginTop: '12px',
        opacity: showButton ? 0.9 : 0,
        transition: 'opacity 0.6s ease'
      }}>
        Every star has a story, every planet is a memory.
      </p>

      {showButton && (
        <div style={{
          marginTop: '40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px',
          animation: 'fadeIn 0.8s ease'
        }}>
          <button
            onClick={handleBegin}
            style={{
              background: 'linear-gradient(135deg, rgba(255, 95, 183, 0.35), rgba(123, 92, 255, 0.45))',
              border: '1px solid rgba(255, 95, 183, 0.55)',
              color: '#fff4e0',
              padding: '14px 42px',
              borderRadius: '30px',
              fontSize: '15px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              boxShadow: '0 0 35px rgba(255, 95, 183, 0.35)',
              transition: 'all 0.3s ease',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <Sparkles size={16} color="#ffd48a" />
            <span>Tap to begin</span>
            <Heart size={15} color="#ff5fb7" fill="#ff5fb7" />
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            color: '#a5b4fc',
            opacity: 0.8
          }}>
            <Music size={13} color="#6ee7b7" />
            <span>Sound on for the best experience • Mudhal Mazhai</span>
          </div>
        </div>
      )}

      <style>{`
        @keyframes starPulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.6); opacity: 1; box-shadow: 0 0 45px 16px rgba(255, 95, 183, 0.9); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
