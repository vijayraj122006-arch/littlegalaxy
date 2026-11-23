import React, { useState, useEffect } from 'react';
import { useUniverse } from '../store/useUniverse';
import { audioManager } from '../utils/audioManager';
import { Heart, Delete, Sparkles } from 'lucide-react';

export const PasswordGate: React.FC = () => {
  const [pin, setPin] = useState<string>('');
  const [isShaking, setIsShaking] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const setStage = useUniverse((s) => s.setStage);

  // Proposed date: 11 / 11 / 2026
  // Accepts either 6 digits (111126) or 8 digits (11112026)
  const handleDigit = (digit: string) => {
    // Unlock and start audio on first touch
    audioManager.unlock();

    if (pin.length < 8 && !isSuccess) {
      const newPin = pin + digit;
      setPin(newPin);

      // Check for success immediately
      if (newPin === '111126' || newPin === '11112026') {
        triggerSuccess();
        return;
      }

      // If user typed 6 digits and it's not the prefix of 11112026
      if (newPin.length === 6 && newPin !== '111120') {
        triggerFailure();
        return;
      }

      // If user typed 8 digits and it didn't match
      if (newPin.length === 8) {
        triggerFailure();
        return;
      }
    }
  };

  const handleDelete = () => {
    audioManager.unlock();
    if (pin.length > 0 && !isSuccess) {
      setPin((prev) => prev.slice(0, -1));
    }
  };

  const triggerSuccess = () => {
    setIsSuccess(true);
    audioManager.playChime(880);
    setTimeout(() => {
      audioManager.playWhoosh();
      setStage('intro');
    }, 700);
  };

  const triggerFailure = () => {
    setIsShaking(true);
    audioManager.playWhoosh();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate([40, 50, 60]); } catch {}
    }
    setTimeout(() => {
      setIsShaking(false);
      setPin('');
    }, 550);
  };

  // Physical keyboard listener
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

  // Display 6 heart slots by default (or expands to 8 if user types past 6)
  const slotCount = Math.max(6, pin.length);
  const heartSlots = Array.from({ length: slotCount });

  return (
    <div
      onClick={() => audioManager.unlock()}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'radial-gradient(ellipse at center, #140b2a 0%, #060413 100%)',
        padding: '20px',
        userSelect: 'none',
        WebkitUserSelect: 'none'
      }}
    >
      {/* Ambient background rose aura */}
      <div style={{
        position: 'absolute',
        width: '380px',
        height: '380px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255, 95, 183, 0.25) 0%, rgba(123, 92, 255, 0.12) 50%, transparent 75%)',
        filter: 'blur(55px)',
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
        {/* Pulsing Header Heart Icon */}
        <div style={{
          width: '58px',
          height: '58px',
          margin: '0 auto 16px',
          borderRadius: '50%',
          background: 'rgba(255, 95, 183, 0.18)',
          border: '1px solid rgba(255, 95, 183, 0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 28px rgba(255, 95, 183, 0.4)',
          animation: 'heartBeat 2s infinite ease-in-out'
        }}>
          <Heart size={28} color="#ff5fb7" fill="#ff5fb7" />
        </div>

        <h1 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '34px',
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
          marginBottom: '10px',
          letterSpacing: '0.5px'
        }}>
          Enter the day I proposed to you ❤️
        </p>

        {/* Prominent, loving Hint displayed clearly */}
        <div style={{
          fontFamily: 'Caveat, cursive',
          fontSize: '20px',
          color: '#ffd48a',
          marginBottom: '24px',
          background: 'rgba(255, 212, 138, 0.1)',
          border: '1px solid rgba(255, 212, 138, 0.25)',
          padding: '6px 14px',
          borderRadius: '20px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: '0 0 15px rgba(255, 212, 138, 0.15)'
        }}>
          <Sparkles size={16} color="#ffd48a" />
          <span>Hint: 11 / 11 / 2026</span>
        </div>

        {/* Heart Type PIN Display */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '28px'
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
                      filter: 'drop-shadow(0 0 10px rgba(255, 95, 183, 0.85))'
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

        {/* Completely Silent Touch Keypad */}
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
                fontSize: '22px',
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
              fontSize: '22px',
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
            <Delete size={22} />
          </button>
        </div>
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
