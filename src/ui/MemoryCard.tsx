import React from 'react';
import { Memory } from '../content/memories';
import { audioSynth } from '../utils/audioSynth';

interface Props {
  memory: Memory;
  onClose: () => void;
}

export const MemoryCard: React.FC<Props> = ({ memory, onClose }) => {
  const handleClose = () => {
    audioSynth.playWhoosh();
    onClose();
  };

  return (
    <div style={{
      maxWidth: '430px',
      width: '90vw',
      background: 'rgba(13, 11, 46, 0.9)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: `1px solid ${memory.color}55`,
      borderRadius: '24px',
      padding: '24px',
      boxShadow: `0 20px 50px rgba(0,0,0,0.65), 0 0 35px ${memory.color}25`,
      color: '#fff',
      position: 'relative',
      textAlign: 'center'
    }}>
      {/* Memory Artwork / SVG Graphic */}
      <div style={{
        width: '100%',
        height: '180px',
        borderRadius: '16px',
        overflow: 'hidden',
        background: `radial-gradient(circle at center, ${memory.color}33 0%, rgba(7, 8, 23, 0.9) 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative'
      }}>
        {memory.photo && (
          <img
            src={memory.photo}
            alt={memory.title}
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        )}
      </div>

      {/* Tag / Category Badge */}
      <div style={{
        display: 'inline-block',
        fontSize: '11px',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        color: memory.color,
        background: `${memory.color}15`,
        border: `1px solid ${memory.color}44`,
        padding: '3px 12px',
        borderRadius: '12px',
        marginBottom: '10px'
      }}>
        {memory.tag} {memory.date ? `• ${memory.date}` : ''}
      </div>

      <h2 style={{
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: '28px',
        fontWeight: 600,
        color: '#fff4e0',
        marginBottom: '14px',
        letterSpacing: '0.5px'
      }}>
        {memory.title}
      </h2>

      <p style={{
        fontFamily: 'Caveat, cursive',
        fontSize: '22px',
        color: '#f8fafc',
        lineHeight: 1.45,
        marginBottom: '24px',
        whiteSpace: 'pre-line'
      }}>
        "{memory.note}"
      </p>

      <button
        onClick={handleClose}
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: '#fff',
          padding: '10px 28px',
          borderRadius: '20px',
          cursor: 'pointer',
          fontSize: '14px',
          fontFamily: 'inherit',
          transition: 'all 0.2s ease'
        }}
      >
        Close Star
      </button>
    </div>
  );
};
