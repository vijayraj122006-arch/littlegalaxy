import React, { useState } from 'react';
import { PlanetDef } from '../content/planets';
import { audioManager } from '../utils/audioManager';
import { Palette, ChevronLeft, ChevronRight, Heart, Sparkles } from 'lucide-react';

interface Props {
  planet: PlanetDef;
  onClose: () => void;
}

export const FavoritePlace: React.FC<Props> = ({ planet, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const artPieces = [
    {
      title: "Quiet Watercolors & Sketches",
      subtitle: "Her Artistic Soul",
      icon: "🎨",
      text: "How painting and sketching bring you quiet peace when days get loud. The world feels so much softer and warmer through your art.",
      tag: "Sketchbook"
    },
    {
      title: "Pinterest Moodboards & Aesthetic Eyes",
      subtitle: "Creative Inspirations",
      icon: "✨",
      text: "Losing track of time scrolling Pinterest for hours, collecting quiet aesthetic colors, cozy coffee scenes, and drawing inspirations.",
      tag: "Inspiration"
    },
    {
      title: "Dancing Cats & Harris Jayaraj Songs",
      subtitle: "Our Cozy Vibe",
      icon: "🐱",
      text: "Mundhinam Paartheney playing on loop, cute dancing cat stickers, and sharing little moments that make you smile without trying.",
      tag: "Soundtrack"
    }
  ];

  const handleNext = () => {
    audioManager.playChime(659.25);
    setCurrentSlide((prev) => (prev + 1) % artPieces.length);
  };

  const handlePrev = () => {
    audioManager.playChime(523.25);
    setCurrentSlide((prev) => (prev - 1 + artPieces.length) % artPieces.length);
  };

  const handleClose = () => {
    audioManager.playWhoosh();
    onClose();
  };

  const active = artPieces[currentSlide];

  return (
    <div style={{
      maxWidth: '460px',
      width: '100%',
      background: 'rgba(12, 28, 48, 0.94)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      border: '1px solid rgba(79, 214, 208, 0.5)',
      borderRadius: '24px',
      padding: '28px 22px',
      boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 40px rgba(79, 214, 208, 0.25)',
      color: '#fff',
      textAlign: 'center',
      animation: 'slideUp 0.3s ease-out'
    }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '11px',
        letterSpacing: '3px',
        textTransform: 'uppercase',
        color: '#4fd6d0',
        marginBottom: '6px'
      }}>
        <Palette size={13} />
        <span>Pooja's Creative Sanctuary</span>
      </div>

      <h2 style={{
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: '28px',
        fontWeight: 600,
        color: '#fff4e0',
        marginBottom: '6px'
      }}>
        Music & Canvas
      </h2>

      <p style={{
        fontFamily: 'Caveat, cursive',
        fontSize: '18px',
        color: '#a5f3fc',
        marginBottom: '20px'
      }}>
        A world made for your art, playlists, and quiet peace ✨
      </p>

      {/* Interactive Art Card */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(79, 214, 208, 0.35)',
        borderRadius: '20px',
        padding: '24px 20px',
        marginBottom: '20px',
        position: 'relative',
        minHeight: '180px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: '36px', marginBottom: '10px' }}>
          {active.icon}
        </div>

        <div style={{
          display: 'inline-block',
          fontSize: '10px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: '#4fd6d0',
          background: 'rgba(79, 214, 208, 0.15)',
          padding: '3px 10px',
          borderRadius: '10px',
          marginBottom: '8px'
        }}>
          {active.tag}
        </div>

        <h3 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '22px',
          color: '#fff4e0',
          marginBottom: '10px'
        }}>
          {active.title}
        </h3>

        <p style={{
          fontFamily: 'Caveat, cursive',
          fontSize: '20px',
          color: '#e0f2fe',
          lineHeight: 1.45,
          maxWidth: '360px'
        }}>
          "{active.text}"
        </p>

        {/* Carousel indicator dots */}
        <div style={{ display: 'flex', gap: '6px', marginTop: '16px' }}>
          {artPieces.map((_, idx) => (
            <div
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              style={{
                width: idx === currentSlide ? '18px' : '6px',
                height: '6px',
                borderRadius: '3px',
                backgroundColor: idx === currentSlide ? '#4fd6d0' : 'rgba(255,255,255,0.2)',
                cursor: 'pointer',
                transition: 'all 0.25s ease'
              }}
            />
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        <button
          onClick={handlePrev}
          style={{
            flex: 1,
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#e0f2fe',
            padding: '10px',
            borderRadius: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '12px'
          }}
        >
          <ChevronLeft size={16} />
          <span>Previous</span>
        </button>

        <button
          onClick={handleNext}
          style={{
            flex: 1,
            background: 'rgba(79, 214, 208, 0.2)',
            border: '1px solid rgba(79, 214, 208, 0.4)',
            color: '#a5f3fc',
            padding: '10px',
            borderRadius: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '12px',
            fontWeight: 500
          }}
        >
          <span>Next Piece</span>
          <ChevronRight size={16} />
        </button>
      </div>

      <button
        onClick={handleClose}
        style={{
          background: 'rgba(255, 255, 255, 0.06)',
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
