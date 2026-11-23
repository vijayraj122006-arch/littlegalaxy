import React, { useState, useEffect } from 'react';
import { useUniverse } from '../store/useUniverse';
import { audioSynth } from '../utils/audioSynth';
import { Heart, Delete } from 'lucide-react';

export const PasswordGate: React.FC = () => {
  const [pin, setPin] = useState<string>('');
  const [isShaking, setIsShaking] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const setStage = useUniverse((s) => s.setStage);

  // 6 digits PIN: 1 1 1 1 2 6
  const PIN_LENGTH = 6;

  const handleDigit = (digit: string) => {
    if (pin.length < 8 && !isSuccess) {
      // Keypad touch is completely silent as requested
      const newPin = pin + digit;
      setPin(newPin);

      // Check automatically when 6 or 8 digits entered
      if (newPin === '111126' || newPin === '11112026') {
        triggerSuccess();
      } else if (newPin.length >= PIN_LENGTH && newPin !== '111120') {
        triggerFailure();
      } else if (newPin.length === 8) {
        triggerFailure();
      }
    }
  };

  const handleDelete = () => {
    if (pin.length > 0 && !isSuccess) {
      setPin((prev) => prev.slice(0, -1));
    }
  };

  const triggerSuccess = () => {
    setIsSuccess(true);
    audioSynth.playChime(880);
    setTimeout(() => {
      audioSynth.playWhoosh();
      setStage('intro');
    }, 700);
  };

  const triggerFailure = () => {
    setIsShaking(true);
    setShowHint(true);
    audioSynth.playWhoosh();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate([40, 50, 60]); } catch {}
    }
    setTimeout(() => {
      setIsShaking(false);
      setPin('');
    }, 600);
  };

  // Keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) {
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, isSuccess]);

  const heartSlots = Array.from({ length: PIN_LENGTH });

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'radial-gradient(ellipse at center, #130a2a 0%, #060413 100%)',
      padding: '20px',
      userSelect: 'none',
      WebkitUserSelect: 'none'
    }}>
      {/* Ambient background rose aura */}
      <div style={{
        position: 'absolute',
        width: '360px',
        height: '360px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255, 95, 183, 0.22) 0%, rgba(123, 92, 255, 0.12) 50%, transparent 75%)',
        filter: 'blur(50px)',
        pointerEvents: 'none'
      }} />

      <div style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: '360px',
        width: '100%',
        textAlign: 'center',
        transform: isShaking ? 'translateX(-8px)' : 'none',
        transition: 'transform 0.1s ease-in-out'
      }}>
        {/* Pulsing Header Icon */}
        <div style={{
          width: '56px',
          height: '56px',
          margin: '0 auto 16px',
          borderRadius: '50%',
          background: 'rgba(255, 95, 183, 0.15)',
          border: '1px solid rgba(255, 95, 183, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 25px rgba(255, 95, 183, 0.35)',
          animation: 'heartBeat 2s infinite ease-in-out'
        }}>
          <Heart size={26} color="#ff5fb7" fill="#ff5fb7" />
        </div>

        <h1 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '32px',
          fontWeight: 400,
          color: '#fff4e0',
          marginBottom: '6px',
          letterSpacing: '1px'
        }}>
          A Little Universe
        </h1>

        <p style={{
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontSize: '14px',
          color: '#fbcfe8',
          marginBottom: '28px',
          letterSpacing: '0.5px'
        }}>
          Enter the day I proposed to you ❤️
        </p>

        {/* Heart Type PIN Display */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '14px',
          marginBottom: '32px'
        }}>
          {heartSlots.map((_, idx) => {
            const isFilled = idx < pin.length;
            return (
              <div
                key={idx}
                style={{
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  transform: isFilled ? 'scale(1.2)' : 'scale(1)',
                }}
              >
                {isFilled ? (
                  <Heart
                    size={26}
                    color="#ff5fb7"
                    fill="#ff5fb7"
                    style={{
                      filter: 'drop-shadow(0 0 10px rgba(255, 95, 183, 0.8))'
                    }}
                  />
                ) : (
                  <Heart
                    size={22}
                    color="rgba(255, 255, 255, 0.25)"
                    strokeWidth={1.5}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Sleek Touch Keypad */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          maxWidth: '280px',
          margin: '0 auto'
        }}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              onClick={() => handleDigit(digit)}
              style={{
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff4e0',
                fontSize: '20px',
                fontWeight: 400,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
                fontFamily: 'Cormorant Garamond, serif'
              }}
              onPointerDown={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255, 95, 183, 0.3)';
                (e.currentTarget as HTMLElement).style.transform = 'scale(0.92)';
              }}
              onPointerUp={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.05)';
                (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
              }}
            >
              {digit}
            </button>
          ))}

          {/* Empty spacer */}
          <div />

          {/* 0 */}
          <button
            onClick={() => handleDigit('0')}
            style={{
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff4e0',
              fontSize: '20px',
              fontWeight: 400,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
              fontFamily: 'Cormorant Garamond, serif'
            }}
            onPointerDown={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255, 95, 183, 0.3)';
              (e.currentTarget as HTMLElement).style.transform = 'scale(0.92)';
            }}
            onPointerUp={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.05)';
              (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
            }}
          >
            0
          </button>

          {/* Backspace */}
          <button
            onClick={handleDelete}
            style={{
              height: '56px',
              borderRadius: '50%',
              background: 'transparent',
              border: 'none',
              color: '#c4b5fd',
              fontSize: '18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease'
            }}
            onPointerDown={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'scale(0.92)';
            }}
            onPointerUp={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
            }}
          >
            <Delete size={20} />
          </button>
        </div>

        {showHint && (
          <p style={{
            fontFamily: 'Caveat, cursive',
            fontSize: '20px',
            color: '#ffd48a',
            marginTop: '24px',
            lineHeight: 1.3
          }}>
            Hint: The day I proposed to you (11 / 11 / 2026) ❤️
          </p>
        )}
      </div>

      <style>{`
        @keyframes heartBeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); filter: drop-shadow(0 0 15px rgba(255, 95, 183, 0.6)); }
        }
      `}</style>
    </div>
  );
};
