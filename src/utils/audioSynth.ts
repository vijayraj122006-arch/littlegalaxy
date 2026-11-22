/**
 * Procedural Dreamy Celestial Synthesizer
 * Provides rich ambient chords, pentatonic celestial chimes,
 * rain droplets for the song planet, and cinematic swells.
 */

class DreamyAudioEngine {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private proximityGain: GainNode | null = null;
  private isMuted: boolean = false;
  private ambientOscillators: OscillatorNode[] = [];
  private ambientInterval: number | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.ambientGain) {
      this.ambientGain.gain.setValueAtTime(muted ? 0 : 0.25, this.ctx ? this.ctx.currentTime : 0);
    }
    if (this.proximityGain) {
      this.proximityGain.gain.setValueAtTime(muted ? 0 : 0.15, this.ctx ? this.ctx.currentTime : 0);
    }
  }

  public startAmbient() {
    this.initContext();
    if (!this.ctx || this.ambientGain) return;

    const ctx = this.ctx;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.25, ctx.currentTime);
    masterGain.connect(ctx.destination);
    this.ambientGain = masterGain;

    // Create a proximity layer for zooming into stars
    const proxGain = ctx.createGain();
    proxGain.gain.setValueAtTime(0, ctx.currentTime);
    proxGain.connect(ctx.destination);
    this.proximityGain = proxGain;

    // Pentatonic scale frequencies representing "Mudhal Mazhai" dreamy mood (D minor / F major: D, F, G, A, C)
    const baseFreqs = [146.83, 174.61, 220.0, 261.63, 293.66, 349.23];

    // Lush ambient drones with gentle low-pass filter
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, ctx.currentTime);
    filter.connect(masterGain);

    baseFreqs.slice(0, 3).forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Subtle detune for shimmer
      osc.detune.setValueAtTime((idx - 1) * 7, ctx.currentTime);

      oscGain.gain.setValueAtTime(0.12 / (idx + 1), ctx.currentTime);
      osc.connect(oscGain);
      oscGain.connect(filter);
      osc.start();
      this.ambientOscillators.push(osc);
    });

    // Random gentle harp/bell notes drifting in the background
    this.ambientInterval = window.setInterval(() => {
      if (this.isMuted || !this.ctx) return;
      const notes = [440, 523.25, 587.33, 659.25, 783.99, 880];
      const randomNote = notes[Math.floor(Math.random() * notes.length)];
      this.playChime(randomNote, 0.08);
    }, 4500);
  }

  public setProximity(proximity: number) {
    // proximity from 0 (far) to 1 (close to star)
    if (!this.ctx || !this.proximityGain || this.isMuted) return;
    const targetGain = Math.min(0.2, Math.max(0, proximity * 0.2));
    this.proximityGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.3);
  }

  public playChime(freq: number = 659.25, volume: number = 0.2) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    // Envelope: quick attack, long crystal-clear decay
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 2.0);
  }

  public playWhoosh() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const ctx = this.ctx;
    // Noise buffer whoosh
    const bufferSize = ctx.sampleRate * 0.8;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(200, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.4);
    filter.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.8);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.3);
    gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.8);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
    noise.stop(ctx.currentTime + 0.85);
  }

  public playRainDrop() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Pitch bends down quickly like water drop
    const startFreq = 1200 + Math.random() * 400;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(350, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.16);
  }

  public playFinaleSwell() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const chord = [220, 277.18, 329.63, 440, 554.37, 659.25, 880];
    chord.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.15 / (i + 1), ctx.currentTime + 2.5);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 7.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.1);
      osc.stop(ctx.currentTime + 8.0);
    });
  }

  public destroy() {
    if (this.ambientInterval) {
      clearInterval(this.ambientInterval);
    }
    this.ambientOscillators.forEach((osc) => {
      try { osc.stop(); } catch {}
    });
    this.ambientOscillators = [];
    if (this.ctx) {
      try { this.ctx.close(); } catch {}
      this.ctx = null;
    }
  }
}

export const audioSynth = new DreamyAudioEngine();
