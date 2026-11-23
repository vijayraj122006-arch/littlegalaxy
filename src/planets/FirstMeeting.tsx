import React, { useState } from 'react';
import { PlanetDef } from '../content/planets';
import { audioSynth } from '../utils/audioSynth';

interface Props {
  planet: PlanetDef;
  onClose: () => void;
}

export const FirstMeeting: React.FC<Props> = ({ planet, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const stages = planet.payload.stages || [];

  const handleStepChange = (idx: number) => {
    setCurrentStep(idx);
    audioSynth.playChime(440 + idx * 80);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(15); } catch {}
    }
  };

  return (
    <div style={{
      maxWidth: '460px',
      width: '90vw',
      background: 'rgba(13, 11, 46, 0.88)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 95, 183, 0.35)',
      borderRadius: '24px',
      padding: '28px 24px',
      boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 30px rgba(255, 95, 183, 0.2)',
      color: '#fff',
      textAlign: 'center',
      position: 'relative'
    }}>
      <div style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#ff5fb7', marginBottom: '8px' }}>
        {planet.theme}
      </div>
      <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: 600, color: '#fff4e0', marginBottom: '8px' }}>
        {planet.payload.title || planet.name}
      </h2>
      <div style={{ fontSize: '13px', color: '#a5b4fc', marginBottom: '24px' }}>
        Date: {planet.payload.date}
      </div>

      {/* Scrubbed Stage Card */}
      <div style={{
        minHeight: '110px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: 'rgba(255, 255, 255, 0.04)',
        borderRadius: '16px',
        padding: '16px 20px',
        marginBottom: '28px',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ fontSize: '14px', color: '#ffd48a', fontWeight: 600, marginBottom: '6px' }}>
          {stages[currentStep]?.time}
        </div>
        <p style={{ fontFamily: 'Caveat, cursive', fontSize: '21px', color: '#f3e8ff', lineHeight: 1.4 }}>
          "{stages[currentStep]?.text}"
        </p>
      </div>

      {/* Timeline Scrubbing Bar */}
      <div style={{ marginBottom: '24px' }}>
        <input
          type="range"
          min="0"
          max={stages.length - 1}
          value={currentStep}
          onChange={(e) => handleStepChange(Number(e.target.value))}
          style={{
            width: '100%',
            accentColor: '#ff5fb7',
            cursor: 'pointer'
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
          {stages.map((st: any, idx: number) => (
            <button
              key={idx}
              onClick={() => handleStepChange(idx)}
              style={{
                background: currentStep === idx ? '#ff5fb7' : 'rgba(255,255,255,0.15)',
                border: 'none',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                transform: currentStep === idx ? 'scale(1.5)' : 'scale(1)'
              }}
              aria-label={st.time}
            />
          ))}
        </div>
      </div>

      <button
        onClick={onClose}
        style={{
          background: 'linear-gradient(135deg, rgba(255,95,183,0.3), rgba(123,92,255,0.4))',
          border: '1px solid rgba(255,255,255,0.2)',
          color: '#fff',
          padding: '10px 24px',
          borderRadius: '20px',
          cursor: 'pointer',
          fontSize: '14px',
          fontFamily: 'inherit',
          transition: 'all 0.2s'
        }}
      >
        Back to Galaxy View 🌌
      </button>
    </div>
  );
};
