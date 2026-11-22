import { useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { useUniverse } from '../store/useUniverse';
import { CONFIG } from '../content/config';
import { audioSynth } from '../utils/audioSynth';

export function useAudio() {
  const { audioOn, setAudioOn } = useUniverse();
  const soundRef = useRef<Howl | null>(null);

  useEffect(() => {
    // Attempt to load external song if available
    let howl: Howl | null = null;
    try {
      howl = new Howl({
        src: [CONFIG.song.file],
        html5: true,
        loop: true,
        volume: 0.4,
        onloaderror: () => {
          // If external mp3 is not present yet, rely completely on audioSynth
          console.info("Using dreamy ambient synthesizer engine.");
        }
      });
      soundRef.current = howl;
    } catch {
      // Fallback
    }

    return () => {
      if (howl) {
        howl.stop();
        howl.unload();
      }
    };
  }, []);

  useEffect(() => {
    if (audioOn) {
      audioSynth.setMuted(false);
      audioSynth.startAmbient();
      if (soundRef.current && soundRef.current.state() === 'loaded') {
        soundRef.current.play();
      }
    } else {
      audioSynth.setMuted(true);
      if (soundRef.current) {
        soundRef.current.pause();
      }
    }
  }, [audioOn]);

  const toggle = () => {
    setAudioOn(!audioOn);
  };

  const playChime = (freq?: number) => {
    audioSynth.playChime(freq);
  };

  const playWhoosh = () => {
    audioSynth.playWhoosh();
  };

  const playRain = () => {
    audioSynth.playRainDrop();
  };

  const playFinale = () => {
    audioSynth.playFinaleSwell();
  };

  const updateProximity = (proximity: number) => {
    audioSynth.setProximity(proximity);
  };

  return {
    audioOn,
    toggle,
    playChime,
    playWhoosh,
    playRain,
    playFinale,
    updateProximity,
  };
}
