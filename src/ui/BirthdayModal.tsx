import React, { useState, useRef } from 'react';
import { audioManager } from '../utils/audioManager';
import { CONFIG } from '../content/config';
import { Play, Pause, Volume2, Sparkles, Heart } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const BirthdayModal: React.FC<Props> = ({ onClose }) => {
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);

  const handleClose = () => {
    if (voiceAudioRef.current) {
      voiceAudioRef.current.pause();
    }
    audioManager.playWhoosh();
    onClose();
  };

  const toggleVoiceNote = () => {
    if (!voiceAudioRef.current) {
      voiceAudioRef.current = new Audio('/audio/voice-note.mp3');
      voiceAudioRef.current.onended = () => setIsPlayingVoice(false);
      voiceAudioRef.current.onerror = () => {
        // Fallback: If no custom MP3 uploaded yet, play sweet synthesized melody
        audioManager.playChime(523.25);
        setTimeout(() => audioManager.playChime(659.25), 250);
        setTimeout(() => audioManager.playChime(783.99), 500);
        setTimeout(() => audioManager.playChime(1046.5), 750);
        setIsPlayingVoice(true);
        setTimeout(() => setIsPlayingVoice(false), 2200);
      };
    }

    if (isPlayingVoice) {
      voiceAudioRef.current.pause();
      setIsPlayingVoice(false);
    } else {
      voiceAudioRef.current.play().then(() => {
        setIsPlayingVoice(true);
      }).catch(() => {
        // Soft chime fallback
        audioManager.playChime(880);
        setIsPlayingVoice(true);
        setTimeout(() => setIsPlayingVoice(false), 2000);
      });
    }
  };

  return (
    <div style={{
      maxWidth: '440px',
      width: '100%',
      background: 'rgba(22, 16, 38, 0.94)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      border: '1px solid rgba(255, 212, 138, 0.55)',
      borderRadius: '24px',
      padding: '28px 22px',
      boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 45px rgba(255, 212, 138, 0.3)',
      color: '#fff',
      textAlign: 'center',
      animation: 'slideUp 0.35s ease-out'
    }}>
      <div style={{
        width: '52px',
        height: '52px',
        margin: '0 auto 14px',
        borderRadius: '50%',
        background: 'rgba(255, 212, 138, 0.2)',
        border: '1px solid rgba(255, 212, 138, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        boxShadow: '0 0 25px rgba(255, 212, 138, 0.4)'
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
        fontSize: '28px',
        fontWeight: 600,
        color: '#fff4e0',
        marginBottom: '12px'
      }}>
        Happy Birthday, {CONFIG.recipientName} ✨
      </h2>

      <p style={{
        fontFamily: 'Caveat, cursive',
        fontSize: '22px',
        color: '#fef3c7',
        lineHeight: 1.4,
        marginBottom: '14px'
      }}>
        "A little late, but I wanted it to be right."
      </p>

      <p style={{
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        fontSize: '13px',
        color: '#fde68a',
        lineHeight: 1.6,
        marginBottom: '20px',
        opacity: 0.95
      }}>
        I hope this year brings you gentle mornings, endless reasons to laugh, and moments that make you smile from the inside out.
      </p>

      {/* Suggestion 1: Voice Note / Audio Message Player */}
      <div style={{
        background: 'rgba(255, 212, 138, 0.1)',
        border: '1px solid rgba(255, 212, 138, 0.35)',
        borderRadius: '18px',
        padding: '14px 18px',
        marginBottom: '22px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px'
      }}>
        <button
          onClick={toggleVoiceNote}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ffd48a, #ff5fb7)',
            border: 'none',
            color: '#1a1028',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 0 15px rgba(255, 212, 138, 0.5)',
            flexShrink: 0
          }}
        >
          {isPlayingVoice ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: '2px' }} />}
        </button>

        <div style={{ textAlign: 'left', flexGrow: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff4e0' }}>
            A Voice Note From Vijay 🎙️
          </div>
          <div style={{ fontSize: '11px', color: '#ffd48a', fontFamily: 'Caveat, cursive' }}>
            {isPlayingVoice ? 'Playing message...' : 'Tap to listen to Vijay\'s message'}
          </div>
        </div>

        {/* Animated Waveform Bars */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '22px' }}>
          {[12, 20, 16, 24, 14, 18, 10].map((h, i) => (
            <div
              key={i}
              style={{
                width: '3px',
                height: isPlayingVoice ? `${h}px` : '4px',
                backgroundColor: '#ffd48a',
                borderRadius: '2px',
                transition: 'height 0.25s ease',
                animation: isPlayingVoice ? `pulseWave 0.8s infinite ease-in-out alternate ${i * 0.1}s` : 'none'
              }}
            />
          ))}
        </div>
      </div>

      <div style={{
        fontFamily: 'Caveat, cursive',
        fontSize: '22px',
        color: '#ff90d4',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px'
      }}>
        <span>With all my heart, Vijay</span>
        <Heart size={16} fill="#ff90d4" />
      </div>

      <button
        onClick={handleClose}
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          color: '#fff',
          padding: '10px 24px',
          borderRadius: '20px',
          cursor: 'pointer',
          fontSize: '13px',
          fontFamily: 'inherit',
          transition: 'all 0.2s ease',
          width: '100%'
        }}
      >
        Back to Galaxy View 🌌
      </button>

      <style>{`
        @keyframes pulseWave {
          0% { height: 4px; }
          100% { height: 22px; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
