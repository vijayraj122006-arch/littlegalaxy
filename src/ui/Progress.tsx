import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, Compass, Music, X } from 'lucide-react';
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

  const [showPlayer, setShowPlayer] = useState(false);

  const { audioOn, toggle } = useAudio();
  const { needsPermissionButton, requestPermission } = useGyro();

  if (stage !== 'explore') return null;

  const totalMemories = MEMORIES.length;
  const progressRatio = Math.min(1, visitedMemories.length / totalMemories);

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
          background: 'rgba(13, 11, 46, 0.75)',
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
              stroke="#ff5fb7"
              strokeWidth="2.2"
              strokeDasharray={56.5}
              strokeDashoffset={56.5 * (1 - progressRatio)}
              strokeLinecap="round"
              transform="rotate(-90 12 12)"
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>
          <span style={{ fontSize: '12px', color: '#fff4e0', letterSpacing: '1px', fontWeight: 500 }}>
            {visitedMemories.length === totalMemories ? '✨ Constellation P (Pooja)' : `${visitedMemories.length} / ${totalMemories} stars`}
          </span>
          <span style={{ fontSize: '11px', color: '#c4b5fd' }}>
            • {visitedPlanets.length}/{PLANETS.length} worlds
          </span>
        </div>

        {/* Action icons (Spotify Player Toggle, Sound, Gyro) */}
        <div style={{
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {/* Mudhal Mazhai Player Toggle */}
          <button
            onClick={() => setShowPlayer(!showPlayer)}
            title="Play Mudhal Mazhai"
            style={{
              background: showPlayer ? 'rgba(29, 185, 84, 0.35)' : 'rgba(13, 11, 46, 0.75)',
              backdropFilter: 'blur(12px)',
              border: showPlayer ? '1px solid #1DB954' : '1px solid rgba(255, 255, 255, 0.18)',
              borderRadius: '20px',
              padding: '6px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: showPlayer ? '#1DB954' : '#6ee7b7',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: showPlayer ? '0 0 15px rgba(29, 185, 84, 0.4)' : 'none'
            }}
          >
            <Music size={14} />
            <span>Mudhal Mazhai</span>
          </button>

          {needsPermissionButton && (
            <button
              onClick={requestPermission}
              title="Enable phone tilt parallax"
              style={{
                background: 'rgba(13, 11, 46, 0.75)',
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
            title={audioOn ? "Mute synth ambient" : "Turn synth ambient on"}
            style={{
              background: 'rgba(13, 11, 46, 0.75)',
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

      {/* Floating Embedded Spotify Player Card */}
      {showPlayer && (
        <div style={{
          pointerEvents: 'auto',
          alignSelf: 'flex-end',
          maxWidth: '340px',
          width: '92%',
          background: 'rgba(13, 11, 46, 0.95)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(29, 185, 84, 0.45)',
          borderRadius: '20px',
          padding: '12px',
          boxShadow: '0 12px 35px rgba(0,0,0,0.6), 0 0 25px rgba(29, 185, 84, 0.25)',
          marginTop: '10px',
          position: 'relative',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px',
            padding: '0 4px'
          }}>
            <span style={{ fontSize: '11px', color: '#1DB954', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600 }}>
              Our Song
            </span>
            <button
              onClick={() => setShowPlayer(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>
          </div>
          <iframe
            src={CONFIG.song.spotifyEmbedUrl}
            width="100%"
            height="152"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title="Spotify Embed"
            style={{ borderRadius: '12px', display: 'block' }}
          />
        </div>
      )}

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
            background: 'rgba(13, 11, 46, 0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 95, 183, 0.4)',
            borderRadius: '24px',
            padding: '10px 22px',
            color: '#fff4e0',
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
          <Sparkles size={15} color="#ff5fb7" />
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
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
