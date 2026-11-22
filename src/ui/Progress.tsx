import React from 'react';
import { Volume2, VolumeX, Sparkles, Compass, PenTool } from 'lucide-react';
import { useUniverse } from '../store/useUniverse';
import { useAudio } from '../hooks/useAudio';
import { useGyro } from '../hooks/useGyro';
import { MEMORIES } from '../content/memories';
import { PLANETS } from '../content/planets';

export const Progress: React.FC = () => {
  const stage = useUniverse((s) => s.stage);
  const setStage = useUniverse((s) => s.setStage);
  const visitedMemories = useUniverse((s) => s.visitedMemories);
  const visitedPlanets = useUniverse((s) => s.visitedPlanets);
  const finaleUnlocked = useUniverse((s) => s.finaleUnlocked);
  const isDrawMode = useUniverse((s) => s.isDrawMode);
  const toggleDrawMode = useUniverse((s) => s.toggleDrawMode);
  const setWishPromptOpen = useUniverse((s) => s.setWishPromptOpen);

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
        {/* Subtle Constellation Exploration Progress Ring */}
        <div style={{
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(13, 11, 46, 0.7)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          padding: '6px 14px',
          borderRadius: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}>
          {/* Circular SVG Progress Ring */}
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
            {visitedMemories.length} / {totalMemories}
          </span>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>
            • {visitedPlanets.length}/{PLANETS.length} worlds
          </span>
        </div>

        {/* Action icons (Sound, Draw Mode, Wish, Gyro) */}
        <div style={{
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {needsPermissionButton && (
            <button
              onClick={requestPermission}
              title="Enable phone tilt parallax"
              style={{
                background: 'rgba(13, 11, 46, 0.7)',
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

          {/* Draw Constellation Mode Toggle */}
          <button
            onClick={toggleDrawMode}
            title={isDrawMode ? "Exit Draw Mode" : "Draw Constellation"}
            style={{
              background: isDrawMode ? 'rgba(255, 95, 183, 0.35)' : 'rgba(13, 11, 46, 0.7)',
              backdropFilter: 'blur(12px)',
              border: isDrawMode ? '1px solid #ff5fb7' : '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '50%',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isDrawMode ? '#ff5fb7' : '#e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: isDrawMode ? '0 0 15px rgba(255,95,183,0.4)' : 'none'
            }}
          >
            <PenTool size={17} />
          </button>

          {/* Audio Mute/Unmute */}
          <button
            onClick={toggle}
            title={audioOn ? "Mute sound" : "Turn sound on"}
            style={{
              background: 'rgba(13, 11, 46, 0.7)',
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

      {/* Draw Mode Notification Banner */}
      {isDrawMode && (
        <div style={{
          alignSelf: 'center',
          pointerEvents: 'auto',
          background: 'rgba(255, 95, 183, 0.2)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 95, 183, 0.4)',
          borderRadius: '18px',
          padding: '8px 18px',
          color: '#ffddf4',
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 0 20px rgba(255, 95, 183, 0.25)'
        }}>
          <Sparkles size={15} color="#ff5fb7" />
          <span>Draw mode: tap stars to connect lines</span>
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
            background: 'rgba(13, 11, 46, 0.75)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 212, 138, 0.35)',
            borderRadius: '24px',
            padding: '10px 20px',
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
              background: 'linear-gradient(135deg, rgba(255, 95, 183, 0.85), rgba(123, 92, 255, 0.85))',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '24px',
              padding: '10px 22px',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 0 25px rgba(255, 95, 183, 0.5)',
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
