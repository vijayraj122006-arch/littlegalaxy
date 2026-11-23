import React, { useState } from 'react';
import { Memory } from '../content/memories';
import { audioManager } from '../utils/audioManager';
import { Heart, Calendar, Send, Sparkles } from 'lucide-react';

interface Props {
  memory: Memory;
  onClose: () => void;
}

export const MemoryCard: React.FC<Props> = ({ memory, onClose }) => {
  const [selectedDate, setSelectedDate] = useState('This Saturday');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleClose = () => {
    audioManager.playWhoosh();
    onClose();
  };

  const isScreenshot = memory.photo?.endsWith('.jpg') || memory.photo?.endsWith('.png');
  const isCookieDate = memory.id === 'mem-p6';

  const handleSendCookieInvite = () => {
    const message = `Hey Vijay! ✨ I just unlocked the Cookie Taste Test star in your universe.\nLet's do our cookie date: ${selectedDate}! Kandipaaa chocolate chip cookies on me 🍪❤️`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div style={{
      maxWidth: '430px',
      width: '100%',
      background: 'rgba(15, 10, 36, 0.94)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      border: `1px solid ${memory.color}55`,
      borderRadius: '24px',
      padding: '24px 20px',
      boxShadow: `0 20px 50px rgba(0,0,0,0.8), 0 0 35px ${memory.color}25`,
      color: '#fff',
      position: 'relative',
      textAlign: 'center',
      animation: 'slideUp 0.3s ease-out'
    }}>
      {/* Memory Photo / Artwork */}
      <div style={{
        width: '100%',
        height: isScreenshot ? '240px' : '160px',
        borderRadius: '16px',
        overflow: 'hidden',
        background: `radial-gradient(circle at center, ${memory.color}25 0%, rgba(5, 4, 16, 0.95) 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '14px',
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
        fontSize: '26px',
        fontWeight: 600,
        color: '#fff4e0',
        marginBottom: '10px',
        letterSpacing: '0.5px'
      }}>
        {memory.title}
      </h2>

      <p style={{
        fontFamily: 'Caveat, cursive',
        fontSize: '22px',
        color: '#f8fafc',
        lineHeight: 1.45,
        marginBottom: isCookieDate ? '16px' : '22px',
        whiteSpace: 'pre-line'
      }}>
        "{memory.note}"
      </p>

      {/* Suggestion 2: Interactive Cookie Date Invitation */}
      {isCookieDate && (
        <div style={{
          background: 'rgba(255, 212, 138, 0.12)',
          border: '1px solid rgba(255, 212, 138, 0.4)',
          borderRadius: '18px',
          padding: '16px',
          marginBottom: '20px',
          textAlign: 'left'
        }}>
          <div style={{
            fontSize: '13px',
            fontWeight: 600,
            color: '#ffd48a',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Calendar size={15} />
            <span>Lock in our Cookie Date 🍪</span>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
            {['This Saturday', 'Sunday Evening', 'Next Weekend'].map((opt) => (
              <button
                key={opt}
                onClick={() => setSelectedDate(opt)}
                style={{
                  background: selectedDate === opt ? '#ffd48a' : 'rgba(255,255,255,0.08)',
                  color: selectedDate === opt ? '#1a1028' : '#e2e8f0',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: selectedDate === opt ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {opt}
              </button>
            ))}
          </div>

          <button
            onClick={handleSendCookieInvite}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #25D366, #128C7E)',
              border: 'none',
              borderRadius: '14px',
              color: '#fff',
              padding: '10px 14px',
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(37, 211, 102, 0.35)'
            }}
          >
            <Send size={14} />
            <span>Send Date Invite to Vijay 💬</span>
          </button>
        </div>
      )}

      <button
        onClick={handleClose}
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
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
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
