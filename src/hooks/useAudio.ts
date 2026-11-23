import { useState, useEffect } from 'react';
import { audioManager } from '../utils/audioManager';
import { useUniverse } from '../store/useUniverse';

export function useAudio() {
  const audioOn = useUniverse((s) => s.audioOn);
  const setAudioOn = useUniverse((s) => s.setAudioOn);
  const [isPlaying, setIsPlaying] = useState<boolean>(audioManager.isPlaying());

  useEffect(() => {
    const unsub = audioManager.subscribe((playing) => {
      setIsPlaying(playing);
      setAudioOn(playing);
    });
    return unsub;
  }, [setAudioOn]);

  useEffect(() => {
    audioManager.setMuted(!audioOn);
  }, [audioOn]);

  const toggle = () => {
    const nowPlaying = audioManager.toggle();
    setAudioOn(nowPlaying);
  };

  const playChime = (freq?: number) => {
    audioManager.playChime(freq);
  };

  const playWhoosh = () => {
    audioManager.playWhoosh();
  };

  return {
    audioOn,
    isPlaying,
    toggle,
    playChime,
    playWhoosh,
    unlock: () => audioManager.unlock(),
  };
}
