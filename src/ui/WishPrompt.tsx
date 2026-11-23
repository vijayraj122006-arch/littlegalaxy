import React, { useState } from 'react';
import { useUniverse, Wish } from '../store/useUniverse';
import { audioSynth } from '../utils/audioSynth';
import { Send, Sparkles, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

export const WishPrompt: React.FC = () => {
  const [wishText, setWishText] = useState('');
  const [isReleasing, setIsReleasing] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const addWish = useUniverse((s) => s.addWish);
  const setWishPromptOpen = useUniverse((s) => s.setWishPromptOpen);
  const pendingWishPos = useUniverse((s) => s.pendingWishPos);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishText.trim()) return;

    // Trigger realistic ascending star release animation
    setIsReleasing(true);
    audioSynth.playWhoosh();
    audioSynth.playChime(880);

    // 1. Deliver wish directly to Vijay's email
    try {
      fetch("https://formsubmit.co/ajax/vijayraj122006@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          _subject: "A Little Universe ✨ A new wish from Pooja!",
          from_name: "Pooja",
          wish: wishText.trim(),
          date: new Date().toLocaleString(),
          recipient: "vijayraj122006@gmail.com"
        })
      }).catch((err) => console.log("FormSubmit dispatched:", err));
    } catch {}

    // 2. Launch glittering starlight confetti
    try {
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#ffd48a', '#ff5fb7', '#ffffff', '#38bdf8']
      });
    } catch {}

    // 3. Register the wish star in the 3D universe
    const pos = pendingWishPos || [
      (Math.random() - 0.5) * 26,
      2 + Math.random() * 8,
      (Math.random() - 0.5) * 26
    ];

    const newWish: Wish = {
      text: wishText.trim(),
      x: pos[0],
      y: pos[1],
      z: pos[2],
      at: Date.now()
    };
    addWish(newWish);

    // After realistic star ascension
    setTimeout(() => {
      setIsReleasing(false);
      setIsSent(true);
    }, 2200);
  };

  const handleSendToVijayWhatsApp = () => {
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
      zIndex: 85,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: isReleasing ? 'rgba(7, 8, 23, 0.4)' : 'rgba(7, 8, 23, 0.75)',
      backdropFilter: isReleasing ? 'none' : 'blur(10px)',
      WebkitBackdropFilter: isReleasing ? 'none' : 'blur(10px)',
      padding: '20px',
      transition: 'background 0.5s ease'
    }}>
      {/* Realistic Ascending Shooting Star Animation */}
      {isReleasing && (
        <div style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}>
          {/* Shooting Star Core with Comet Trail */}
          <div style={{
            position: 'absolute',
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            boxShadow: '0 0 45px 18px #ffd48a, 0 0 90px 30px #ff5fb7',
            animation: 'ascendStar 2.2s cubic-bezier(0.25, 1, 0.5, 1) forwards'
          }} />
        </div>
      )}

      {/* Main Dialog Box */}
      {!isReleasing && !isSent && (
        <div style={{
          maxWidth: '430px',
          width: '100%',
          background: 'rgba(15, 10, 36, 0.95)',
          border: '1px solid rgba(255, 212, 138, 0.45)',
          borderRadius: '24px',
          padding: '28px 22px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.7), 0 0 40px rgba(255, 212, 138, 0.25)',
          textAlign: 'center',
          color: '#fff',
          animation: 'fadeIn 0.3s ease'
        }}>
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
            color: '#fde68a',
            marginBottom: '20px',
            lineHeight: 1.4
          }}>
            Cast a secret wish into the stars. It will ascend into our galaxy and fly straight to Vijay's email ❤️
          </p>

          <form onSubmit={handleSubmit}>
            <textarea
              value={wishText}
              onChange={(e) => setWishText(e.target.value)}
              placeholder="What are you wishing for?..."
              rows={3}
              maxLength={150}
              autoFocus
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 212, 138, 0.4)',
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
                  padding: '11px 24px',
                  borderRadius: '24px',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 15px rgba(255, 212, 138, 0.4)'
                }}
              >
                <span>Release to the Stars</span>
                <Sparkles size={15} />
              </button>
              <button
                type="button"
                onClick={handleClose}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  padding: '11px 18px',
                  borderRadius: '24px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Confirmation Screen */}
      {!isReleasing && isSent && (
        <div style={{
          maxWidth: '430px',
          width: '100%',
          background: 'rgba(15, 10, 36, 0.95)',
          border: '1px solid rgba(255, 212, 138, 0.45)',
          borderRadius: '24px',
          padding: '30px 22px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.7), 0 0 40px rgba(255, 212, 138, 0.3)',
          textAlign: 'center',
          color: '#fff',
          animation: 'fadeIn 0.5s ease'
        }}>
          <div style={{ fontSize: '38px', marginBottom: '10px' }}>
            ✨💌✨
          </div>
          <h3 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '28px',
            fontWeight: 600,
            color: '#fff4e0',
            marginBottom: '8px'
          }}>
            Your Wish is in the Stars
          </h3>
          <p style={{
            fontFamily: 'Caveat, cursive',
            fontSize: '22px',
            color: '#ffd48a',
            marginBottom: '16px',
            lineHeight: 1.4
          }}>
            "{wishText}"
          </p>

          <p style={{
            fontSize: '13px',
            color: '#c4b5fd',
            marginBottom: '26px',
            lineHeight: 1.5
          }}>
            Your star has been placed in the galaxy and sent directly to Vijay's inbox (vijayraj122006@gmail.com) ❤️
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
            <button
              onClick={handleSendToVijayWhatsApp}
              style={{
                background: 'linear-gradient(135deg, #25D366, #128C7E)',
                border: 'none',
                color: '#fff',
                padding: '11px 22px',
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
              <Send size={15} />
              <span>Share on WhatsApp too 💬</span>
            </button>

            <button
              onClick={handleClose}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#e2e8f0',
                padding: '10px 22px',
                borderRadius: '24px',
                fontSize: '13px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                width: '100%'
              }}
            >
              Keep Exploring the Universe
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes ascendStar {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          40% {
            transform: translate(60px, -220px) scale(1.6);
            opacity: 1;
          }
          100% {
            transform: translate(140px, -650px) scale(0.2);
            opacity: 0;
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
