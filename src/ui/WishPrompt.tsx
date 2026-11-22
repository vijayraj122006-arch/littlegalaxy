import React, { useState } from 'react';
import { useUniverse, Wish } from '../store/useUniverse';
import { audioSynth } from '../utils/audioSynth';
import { Send, Check, Sparkles } from 'lucide-react';

export const WishPrompt: React.FC = () => {
  const [wishText, setWishText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const addWish = useUniverse((s) => s.addWish);
  const setWishPromptOpen = useUniverse((s) => s.setWishPromptOpen);
  const pendingWishPos = useUniverse((s) => s.pendingWishPos);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishText.trim()) return;

    audioSynth.playWhoosh();
    audioSynth.playChime(880);

    const pos = pendingWishPos || [
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 30
    ];

    const newWish: Wish = {
      text: wishText.trim(),
      x: pos[0],
      y: pos[1],
      z: pos[2],
      at: Date.now()
    };

    addWish(newWish);
    setSubmitted(true);
  };

  const handleSendToVijay = () => {
    const textEncoded = encodeURIComponent(`Hey Vijay ✨ I made a wish in your little universe:\n"${wishText}"`);
    window.open(`https://api.whatsapp.com/send?text=${textEncoded}`, '_blank');
  };

  const handleClose = () => {
    setWishPromptOpen(false);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 80,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(7, 8, 23, 0.72)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '430px',
        width: '100%',
        background: 'rgba(13, 11, 46, 0.94)',
        border: '1px solid rgba(255, 212, 138, 0.45)',
        borderRadius: '24px',
        padding: '28px 24px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 40px rgba(255, 212, 138, 0.25)',
        textAlign: 'center',
        color: '#fff'
      }}>
        {!submitted ? (
          <>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>
              🌠
            </div>
            <h3 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '28px',
              fontWeight: 600,
              color: '#fff4e0',
              marginBottom: '6px'
            }}>
              Make a Wish
            </h3>
            <p style={{
              fontSize: '13px',
              color: '#ffd48a',
              marginBottom: '22px',
              lineHeight: 1.4
            }}>
              Cast a quiet thought into this sky. It will stay here as your own personal star.
            </p>

            <form onSubmit={handleSubmit}>
              <textarea
                value={wishText}
                onChange={(e) => setWishText(e.target.value)}
                placeholder="What are you hoping for?..."
                rows={3}
                maxLength={140}
                autoFocus
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 212, 138, 0.35)',
                  borderRadius: '16px',
                  padding: '14px 16px',
                  color: '#fff',
                  fontSize: '18px',
                  fontFamily: 'Caveat, cursive',
                  outline: 'none',
                  marginBottom: '20px',
                  resize: 'none',
                  boxSizing: 'border-box'
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #ffd48a, #ff5fb7)',
                    border: 'none',
                    color: '#070817',
                    padding: '10px 24px',
                    borderRadius: '20px',
                    fontWeight: 600,
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontFamily: 'inherit'
                  }}
                >
                  Release to the Stars ✨
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#fff',
                    padding: '10px 18px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontFamily: 'inherit'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        ) : (
          <div style={{ padding: '8px 4px' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>
              ✨🌟✨
            </div>
            <h3 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '28px',
              fontWeight: 600,
              color: '#fff4e0',
              marginBottom: '10px'
            }}>
              Your Wish is in the Sky
            </h3>
            <p style={{
              fontFamily: 'Caveat, cursive',
              fontSize: '22px',
              color: '#ffd48a',
              marginBottom: '24px',
              lineHeight: 1.4
            }}>
              "{wishText}"
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
              {/* Optional: Send to Vijay */}
              <button
                onClick={handleSendToVijay}
                style={{
                  background: 'linear-gradient(135deg, #25D366, #128C7E)',
                  border: 'none',
                  color: '#fff',
                  padding: '12px 24px',
                  borderRadius: '24px',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 15px rgba(37, 211, 102, 0.35)',
                  fontFamily: 'inherit',
                  width: '100%',
                  justifyContent: 'center'
                }}
              >
                <Send size={16} />
                <span>Send this wish to Vijay 💬</span>
              </button>

              <button
                onClick={handleClose}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#e2e8f0',
                  padding: '10px 24px',
                  borderRadius: '24px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  width: '100%'
                }}
              >
                Keep Exploring
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
