/**
 * Centralized Audio Manager for "A Little Universe"
 * Seamlessly manages background song playback (Mudhal Mazhai)
 * and low-latency synthesized UI sound effects.
 */

class AudioManager {
  private bgAudio: HTMLAudioElement | null = null;
  private audioCtx: AudioContext | null = null;
  private isUnlocked: boolean = false;
  private isMuted: boolean = false;
  private listeners: Set<(playing: boolean) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      this.initBgAudio();
      this.setupGlobalUnlock();
    }
  }

  private initBgAudio() {
    try {
      this.bgAudio = new Audio();
      this.bgAudio.loop = true;
      this.bgAudio.preload = 'auto';
      this.bgAudio.volume = 0.7;
      // Support both formats
      const canM4a = this.bgAudio.canPlayType('audio/mp4; codecs="mp4a.40.2"');
      if (canM4a) {
        this.bgAudio.src = '/audio/ambient.m4a';
      } else {
        this.bgAudio.src = '/audio/ambient.mp3';
      }
    } catch (e) {
      console.warn('Audio initialization notice:', e);
    }
  }

  private setupGlobalUnlock() {
    const unlockHandler = () => {
      this.unlock();
      window.removeEventListener('pointerdown', unlockHandler);
      window.removeEventListener('touchstart', unlockHandler);
      window.removeEventListener('keydown', unlockHandler);
    };

    window.addEventListener('pointerdown', unlockHandler, { passive: true });
    window.addEventListener('touchstart', unlockHandler, { passive: true });
    window.addEventListener('keydown', unlockHandler, { passive: true });
  }

  public unlock(): void {
    if (this.isUnlocked) return;
    this.isUnlocked = true;

    // Initialize Web Audio Context
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx && !this.audioCtx) {
        this.audioCtx = new AudioCtx();
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
    } catch {}

    // Start background song
    if (this.bgAudio && !this.isMuted) {
      const playPromise = this.bgAudio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.notifyListeners(true);
          })
          .catch((err) => {
            console.info('Auto-play note:', err);
          });
      }
    }
  }

  public play(): void {
    if (this.bgAudio) {
      this.bgAudio.play().then(() => this.notifyListeners(true)).catch(() => {});
    }
  }

  public pause(): void {
    if (this.bgAudio) {
      this.bgAudio.pause();
      this.notifyListeners(false);
    }
  }

  public toggle(): boolean {
    if (!this.bgAudio) return false;
    if (this.bgAudio.paused) {
      this.isMuted = false;
      this.play();
      return true;
    } else {
      this.isMuted = true;
      this.pause();
      return false;
    }
  }

  public isPlaying(): boolean {
    return !!(this.bgAudio && !this.bgAudio.paused);
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (muted) {
      this.pause();
    } else {
      this.play();
    }
  }

  public subscribe(cb: (playing: boolean) => void): () => void {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notifyListeners(playing: boolean) {
    this.listeners.forEach((cb) => {
      try { cb(playing); } catch {}
    });
  }

  // Synthesized crystal chimes (for star clicks, discoveries, success)
  public playChime(freq: number = 784): void {
    if (this.isMuted) return;
    try {
      if (!this.audioCtx) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) this.audioCtx = new AudioCtx();
      }
      if (this.audioCtx) {
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
        const ctx = this.audioCtx;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 1.0);
      }
    } catch {}
  }

  // Soft transition whoosh
  public playWhoosh(): void {
    if (this.isMuted) return;
    try {
      if (!this.audioCtx) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) this.audioCtx = new AudioCtx();
      }
      if (this.audioCtx) {
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
        const ctx = this.audioCtx;
        const now = ctx.currentTime;

        const bufferSize = ctx.sampleRate * 0.35;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(250, now);
        filter.frequency.exponentialRampToValueAtTime(900, now + 0.18);
        filter.frequency.exponentialRampToValueAtTime(150, now + 0.35);
        filter.Q.setValueAtTime(2.5, now);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start(now);
        noise.stop(now + 0.36);
      }
    } catch {}
  }
}

export const audioManager = new AudioManager();
