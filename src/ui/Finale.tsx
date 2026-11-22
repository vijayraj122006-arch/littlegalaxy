import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { FINALE_CONTENT } from '../content/finale';
import { useUniverse } from '../store/useUniverse';
import { audioSynth } from '../utils/audioSynth';

export const Finale: React.FC = () => {
  const setStage = useUniverse((s) => s.setStage);
  const [currentStep, setCurrentStep] = useState(0);
  const paragraphs = FINALE_CONTENT.paragraphs;
  const totalSteps = paragraphs.length + 1; // plus sign-off

  useEffect(() => {
    // Music swell and celestial celebration
    audioSynth.playFinaleSwell();
    try {
      confetti({
        particleCount: 70,
        spread: 100,
        origin: { y: 0.3 },
        colors: ['#ffd48a', '#ff5fb7', '#4fd6d0', '#ffffff']
      });
    } catch {}
  }, []);

  const handleAdvance = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
      audioSynth.playChime(523.25 + (currentStep % 6) * 70);
    }
  };

  const handleReturnToHub = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioSynth.playWhoosh();
    setStage('explore');
  };

  return (
    <div
      onClick={handleAdvance}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 95,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'radial-gradient(circle at center, rgba(13, 11, 46, 0.8) 0%, rgba(7, 8, 23, 0.94) 80%)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        padding: '24px',
        color: '#fff',
        cursor: currentStep < totalSteps ? 'pointer' : 'default',
        userSelect: 'none',
        overflowY: 'auto'
      }}
    >
      <div style={{
        maxWidth: '560px',
        width: '100%',
        textAlign: 'center',
        margin: 'auto'
      }}>
        {/* Title */}
        <h1 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '34px',
          fontWeight: 400,
          color: '#fff4e0',
          marginBottom: '28px',
          letterSpacing: '1px',
          textShadow: '0 0 25px rgba(255, 212, 138, 0.4)'
        }}>
          {FINALE_CONTENT.title}
        </h1>

        {/* Revealed paragraphs up to currentStep */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          marginBottom: '32px'
        }}>
          {paragraphs.slice(0, currentStep + 1).map((para, idx) => {
            const isLatest = idx === currentStep;
            return (
              <p
                key={idx}
                style={{
                  fontFamily: idx === 0 ? 'Cormorant Garamond, serif' : 'Plus Jakarta Sans, sans-serif',
                  fontSize: idx === 0 ? '24px' : '16px',
                  lineHeight: 1.6,
                  color: isLatest ? '#fff4e0' : 'rgba(255, 244, 224, 0.75)',
                  fontWeight: idx === 0 ? 500 : 300,
                  transition: 'opacity 0.6s ease-in, transform 0.6s ease-out',
                  opacity: 1,
                  transform: 'translateY(0)'
                }}
              >
                {para}
              </p>
            );
          })}

          {/* Sign-off */}
          {currentStep >= paragraphs.length && (
            <div style={{
              fontFamily: 'Caveat, cursive',
              fontSize: '28px',
              color: '#ffd48a',
              marginTop: '12px',
              animation: 'fadeIn 0.8s ease'
            }}>
              {FINALE_CONTENT.signOff}
            </div>
          )}
        </div>

        {/* Footer prompts / Keep Exploring button */}
        {currentStep < totalSteps ? (
          <div style={{
            fontSize: '12px',
            color: '#a5b4fc',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            opacity: 0.7,
            animation: 'pulse 2s infinite'
          }}>
            (tap anywhere to continue)
          </div>
        ) : (
          <div style={{ marginTop: '24px' }}>
            <button
              onClick={handleReturnToHub}
              style={{
                background: 'linear-gradient(135deg, rgba(255, 212, 138, 0.3), rgba(255, 95, 183, 0.3))',
                border: '1px solid rgba(255, 212, 138, 0.5)',
                color: '#ffd48a',
                padding: '12px 32px',
                borderRadius: '30px',
                fontSize: '15px',
                fontWeight: 500,
                letterSpacing: '1px',
                cursor: 'pointer',
                boxShadow: '0 0 30px rgba(255, 212, 138, 0.25)',
                transition: 'all 0.3s ease',
                fontFamily: 'inherit'
              }}
            >
              Keep Exploring the Universe 🌌
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
