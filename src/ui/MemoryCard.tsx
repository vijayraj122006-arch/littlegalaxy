import React from 'react';
import { Memory } from '../content/memories';
import { audioSynth } from '../utils/audioSynth';
import { Heart } from 'lucide-react';

interface Props {
  memory: Memory;
  onClose: () => void;
}

export const MemoryCard: React.FC<Props> = ({ memory, onClose }) => {
  const handleClose = () => {
    audioSynth.playWhoosh();
    onClose();
  };

  const isScreenshot = memory.photo?.endsWith('.jpg') || memory.photo?.endsWith('.png');

  return (
    <div style={{
      maxWidth: '430px',
      width: '90vw',
      background: 'rgba(15, 10, 36, 0.94)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      border: `1px solid ${memory.color}55`,
      borderRadius: '24px',
      padding: '24px 20px',
      boxShadow: `0 20px 50px rgba(0,0,0,0.7), 0 0 35px ${memory.color}25`,
      color: '#fff',
      position: 'relative',
      textAlign: 'center',
      maxHeight: '88vh',
      overflowY: 'auto'
    }}>
      {/* Memory Photo / Artwork */}
      <div style={{
        width: '100%',
        height: isScreenshot ? '240px' : '170px',
        borderRadius: '16px',
        overflow: 'hidden',
        background: `radial-gradient(circle at center, ${memory.color}25 0%, rgba(5, 4, 16, 0.95) 100%)`,
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
              objectFit: isScreenshot ? 'contain' : 'cover'
            }}
          />
        )}
      </div>

      {/* Tag / Category Badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '11px',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        color: memory.color,
        background: `${memory.color}15`,
        border: `1px solid ${memory.color}44`,
        padding: '4px 14px',
        borderRadius: '14px',
        marginBottom: '10px'
      }}>
        <Heart size={11} fill={memory.color} color={memory.color} />
        <span>{memory.tag} {memory.date ? `• ${memory.date}` : ''}</span>
      </div>

      <h2 style={{
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: '28px',
        fontWeight: 600,
        color: '#fff4e0',
        marginBottom: '12px',
        letterSpacing: '0.5px'
      }}>
        {memory.title}
      </h2>

      <p style={{
        fontFamily: 'Caveat, cursive',
        fontSize: '22px',
        color: '#f8fafc',
        lineHeight: 1.45,
        marginBottom: '22px',
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
