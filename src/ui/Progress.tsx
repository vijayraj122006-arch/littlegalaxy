import React from 'react';
import { Volume2, VolumeX, Sparkles, Compass, Music } from 'lucide-react';
import { useUniverse } from '../store/useUniverse';
import { useAudio } from '../hooks/useAudio';
import { useGyro } from '../hooks/useGyro';
import { CONFIG } from '../content/config';
import { MEMORIES } from '../content/memories';
import { PLANETS } from '../content/planets';

export const Progress: React.FC = () => {
  const stage = useUniverse((s) => s.stage);
  const setStage = useUniverse((s) => s.setStage);
  const visitedMemories = useUniverse((s) => s.visitedMemories);
  const visitedPlanets = useUniverse((s) => s.visitedPlanets);
  const finaleUnlocked = useUniverse((s) => s.finaleUnlocked);
  const setWishPromptOpen = useUniverse((s) => s.setWishPromptOpen);

  const { audioOn, toggle } = useAudio();
  const { needsPermissionButton, requestPermission } = useGyro();

  if (stage !== 'explore') return null;

  const totalMemories = MEMORIES.length;
  const progressRatio = Math.min(1, visitedMemories.length / totalMemories);

  const handleOpenSong = () => {
    window.open(CONFIG.song.spotifyUrl, '_blank');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 50,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: 'env(safe-area-inset-top, 16px) 16px env(safe-area-inset-bottom, 20px) 16px'
    }}>
      {/* Top Header Controls Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
      }}>
        {/* Subtle Constellation Exploration Progress */}
        <div style={{
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(13, 11, 46, 0.72)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          padding: '6px 14px',
          borderRadius: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24">
            <circle
              cx="12"
              cy="12"
              r="9"
              fill="none"
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="2"
            />
            <circle
              cx="12"
              cy="12"
              r="9"
              fill="none"
              stroke="#ffd48a"
              strokeWidth="2.2"
              strokeDasharray={56.5}
              strokeDashoffset={56.5 * (1 - progressRatio)}
              strokeLinecap="round"
              transform="rotate(-90 12 12)"
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>
          <span style={{ fontSize: '12px', color: '#ffd48a', letterSpacing: '1px', fontWeight: 500 }}>
            {visitedMemories.length} / {totalMemories} stars
          </span>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>
            • {visitedPlanets.length}/{PLANETS.length} worlds
          </span>
        </div>

        {/* Action icons (Sound, Song link, Gyro) */}
        <div style={{
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {/* Song button */}
          <button
            onClick={handleOpenSong}
            title="Listen to Mudhal Mazhai"
            style={{
              background: 'rgba(13, 11, 46, 0.72)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(110, 231, 183, 0.35)',
              borderRadius: '20px',
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#6ee7b7',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            <Music size={14} />
            <span style={{ display: 'none', md: 'inline' } as any}>Mudhal Mazhai</span>
          </button>

          {needsPermissionButton && (
            <button
              onClick={requestPermission}
              title="Enable phone tilt parallax"
              style={{
                background: 'rgba(13, 11, 46, 0.72)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(79, 214, 208, 0.4)',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4fd6d0',
                cursor: 'pointer'
              }}
            >
              <Compass size={17} />
            </button>
          )}

          {/* Audio Mute/Unmute */}
          <button
            onClick={toggle}
            title={audioOn ? "Mute sound" : "Turn sound on"}
            style={{
              background: 'rgba(13, 11, 46, 0.72)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '50%',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: audioOn ? '#ffd48a' : '#94a3b8',
              cursor: 'pointer'
            }}
          >
            {audioOn ? <Volume2 size={17} /> : <VolumeX size={17} />}
          </button>
        </div>
      </div>

      {/* Bottom Floating Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '12px',
        width: '100%'
      }}>
        {/* Make a Wish Button */}
        <button
          onClick={() => setWishPromptOpen(true)}
          style={{
            pointerEvents: 'auto',
            background: 'rgba(13, 11, 46, 0.8)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 212, 138, 0.4)',
            borderRadius: '24px',
            padding: '10px 22px',
            color: '#ffd48a',
            fontSize: '13px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            transition: 'all 0.2s ease'
          }}
        >
          <Sparkles size={15} />
          <span>Make a wish</span>
        </button>

        {/* Finale Trigger Button when Unlocked */}
        {finaleUnlocked && (
          <button
            onClick={() => setStage('finale')}
            style={{
              pointerEvents: 'auto',
              background: 'linear-gradient(135deg, rgba(255, 95, 183, 0.9), rgba(123, 92, 255, 0.9))',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              borderRadius: '24px',
              padding: '10px 22px',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 0 25px rgba(255, 95, 183, 0.55)',
              animation: 'glowPulse 2.5s infinite alternate ease-in-out'
            }}
          >
            <span>The Finale ✨</span>
          </button>
        )}
      </div>

      <style>{`
        @keyframes glowPulse {
          0% { box-shadow: 0 0 15px rgba(255, 95, 183, 0.4); transform: scale(1); }
          100% { box-shadow: 0 0 30px rgba(255, 212, 138, 0.7); transform: scale(1.04); }
        }
      `}</style>
    </div>
  );
};
