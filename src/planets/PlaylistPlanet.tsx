import React from 'react';
import { PlanetDef } from '../content/planets';
import { PLAYLIST_CONFIG } from '../content/playlist';
import { Music, ExternalLink, Heart } from 'lucide-react';
import { audioSynth } from '../utils/audioSynth';

interface Props {
  planet: PlanetDef;
  onClose: () => void;
}

export const PlaylistPlanet: React.FC<Props> = ({ planet, onClose }) => {
  const handleOpenSpotify = (url: string) => {
    audioSynth.playChime(659.25);
    window.open(url, '_blank');
  };

  return (
    <div style={{
      maxWidth: '480px',
      width: '92vw',
      background: 'rgba(18, 12, 38, 0.94)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 95, 183, 0.45)',
      borderRadius: '24px',
      padding: '28px 22px',
      boxShadow: '0 20px 50px rgba(0,0,0,0.7), 0 0 40px rgba(255, 95, 183, 0.25)',
      color: '#fff',
      textAlign: 'center',
      maxHeight: '88vh',
      overflowY: 'auto'
    }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '11px',
        letterSpacing: '3px',
        textTransform: 'uppercase',
        color: '#ff5fb7',
        marginBottom: '6px'
      }}>
        <Music size={13} />
        <span>A Universe of Sound</span>
      </div>

      <h2 style={{
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: '30px',
        fontWeight: 600,
        color: '#fff4e0',
        marginBottom: '6px'
      }}>
        {PLAYLIST_CONFIG.title}
      </h2>

      <p style={{
        fontFamily: 'Caveat, cursive',
        fontSize: '20px',
        color: '#ffd48a',
        marginBottom: '20px',
        lineHeight: 1.3
      }}>
        "{PLAYLIST_CONFIG.description}"
      </p>

      {/* Embedded Spotify Player for Mudhal Mazhai */}
      <div style={{
        borderRadius: '16px',
        overflow: 'hidden',
        marginBottom: '22px',
        boxShadow: '0 8px 25px rgba(0,0,0,0.4)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <iframe
          src="https://open.spotify.com/embed/track/4Nk88cgvkUWPz1gX2uoK4a?utm_source=generator&theme=0"
          width="100%"
          height="152"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title="Spotify Player"
          style={{ display: 'block' }}
        />
      </div>

      {/* Curated Track List with Romantic Notes */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        textAlign: 'left',
        marginBottom: '24px'
      }}>
        {PLAYLIST_CONFIG.tracks.map((track, idx) => (
          <div
            key={track.id}
            onClick={() => handleOpenSpotify(track.spotifyUri || PLAYLIST_CONFIG.spotifyPlaylistUrl)}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '14px 16px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}
            onPointerDown={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255, 95, 183, 0.15)';
            }}
            onPointerUp={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.04)';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#fff4e0' }}>
                {idx + 1}. {track.title}
              </div>
              <ExternalLink size={14} color="#ffd48a" />
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>
              {track.artist}
            </div>
            <div style={{ fontFamily: 'Caveat, cursive', fontSize: '18px', color: '#fbcfe8', marginTop: '2px' }}>
              "{track.note}"
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
        <button
          onClick={() => handleOpenSpotify(PLAYLIST_CONFIG.spotifyPlaylistUrl)}
          style={{
            background: 'linear-gradient(135deg, #1DB954, #128C7E)',
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
            boxShadow: '0 4px 15px rgba(29, 185, 84, 0.35)',
            fontFamily: 'inherit'
          }}
        >
          <Music size={16} />
          <span>Open on Spotify</span>
        </button>

        <button
          onClick={onClose}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: '24px',
            fontSize: '14px',
            cursor: 'pointer',
            fontFamily: 'inherit'
          }}
        >
          Back to Galaxy View 🌌
        </button>
      </div>
    </div>
  );
};
