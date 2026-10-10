/**
 * Immersive Procedural Web Audio Engine — Le Mythe de Sisyphe
 * - Atmospheric Melancholic Drone Synthesizer (Dm, Bb, F, Am / Serene D major for descent)
 * - Dynamic altitude wind synthesizer (modulated by biome and squalls)
 * - Heavy granite friction & mineral scrape
 * - Human physical presence: Exertion breathing & heavy stone footsteps
 * - Catastrophic tumbling avalanche bass impact
 * - Serene stillness & meditative tones during Sisyphus's descent
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;
  public musicEnabled: boolean = true;
  public masterVolume: number = 0.7;

  // Ambient Music Nodes
  private musicGain: GainNode | null = null;
  private musicInterval: number | null = null;
  private isMusicPlaying: boolean = false;
  private isDescentMode: boolean = false;

  // Wind Ambient Nodes
  private windGain: GainNode | null = null;
  private windFilter: BiquadFilterNode | null = null;
  private windSource: AudioBufferSourceNode | null = null;

  // Last sound throttle times
  private lastFootstepTime: number = 0;
  private lastBreathTime: number = 0;

  constructor() {
    try {
      const savedMuted = localStorage.getItem('eternal_push_muted');
      if (savedMuted !== null) this.isMuted = savedMuted === 'true';

      const savedMusic = localStorage.getItem('eternal_push_music_on');
      if (savedMusic !== null) this.musicEnabled = savedMusic === 'true';
    } catch {
      // LocalStorage fallback
    }
  }

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    try {
      localStorage.setItem('eternal_push_muted', String(muted));
    } catch {}

    if (muted) {
      this.stopAmbientWind();
      this.stopAmbientMusic();
    } else if (this.musicEnabled) {
      this.startAmbientMusic();
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public toggleMusic(): boolean {
    this.musicEnabled = !this.musicEnabled;
    try {
      localStorage.setItem('eternal_push_music_on', String(this.musicEnabled));
    } catch {}

    if (!this.musicEnabled) {
      this.stopAmbientMusic();
    } else if (!this.isMuted) {
      this.startAmbientMusic();
    }
    return this.musicEnabled;
  }

  /**
   * Ambient Music Engine:
   * Generates warm, melancholic, evolving chord progressions (D minor / F major / A minor)
   */
  public startAmbientMusic(descentMode = false) {
    if (this.isMuted || !this.musicEnabled) return;
    const ctx = this.initContext();
    if (!ctx) return;

    if (this.isMusicPlaying && this.isDescentMode === descentMode) return;

    this.isDescentMode = descentMode;
    this.isMusicPlaying = true;

    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }

    if (!this.musicGain) {
      this.musicGain = ctx.createGain();
      this.musicGain.gain.setValueAtTime(0.001, ctx.currentTime);
      this.musicGain.gain.linearRampToValueAtTime(0.18 * this.masterVolume, ctx.currentTime + 3.0);
      this.musicGain.connect(ctx.destination);
    }

    // Struggle Chords: Dm, Bb, F, Am
    const struggleChords = [
      [73.42, 110.0, 146.83, 220.0, 293.66], // D2, A2, D3, A3, D4
      [58.27, 116.54, 146.83, 174.61, 233.08], // Bb1, Bb2, D3, F3, Bb3
      [87.31, 130.81, 174.61, 220.0, 261.63], // F2, C3, F3, A3, C4
      [55.0, 110.0, 164.81, 220.0, 261.63]   // A1, A2, E3, A3, C4
    ];

    // Serene Contemplation Chords during Sisyphus's conscious Walk Down (D major, Bm, G, A)
    const descentChords = [
      [73.42, 110.0, 146.83, 220.0, 277.18], // D2, A2, D3, A3, C#4 (maj7)
      [61.74, 123.47, 146.83, 185.00, 246.94], // B1, B2, D3, F#3, B3
      [98.0, 146.83, 196.0, 246.94, 293.66],  // G2, D3, G3, B3, D4
      [55.0, 110.0, 164.81, 220.0, 277.18]   // A1, A2, E3, A3, C#4
    ];

    const currentProgression = descentMode ? descentChords : struggleChords;
    let chordIdx = 0;

    const playChord = () => {
      if (!this.isMusicPlaying || !this.ctx || !this.musicGain) return;
      const t = this.ctx.currentTime;
      const notes = currentProgression[chordIdx];
      chordIdx = (chordIdx + 1) % currentProgression.length;

      notes.forEach((freq, i) => {
        if (!this.ctx || !this.musicGain) return;
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = descentMode ? 'sine' : (i % 2 === 0 ? 'sine' : 'triangle');
        osc.frequency.setValueAtTime(freq, t);
        osc.detune.setValueAtTime((Math.random() - 0.5) * 6, t);
        osc.detune.linearRampToValueAtTime((Math.random() - 0.5) * 10, t + 8);

        filter.type = 'lowpass';
        const cutoff = descentMode ? 500 + i * 80 : 280 + i * 70;
        filter.frequency.setValueAtTime(cutoff, t);
        filter.frequency.linearRampToValueAtTime(cutoff + 120, t + 4);
        filter.frequency.linearRampToValueAtTime(cutoff, t + 8);

        noteGain.gain.setValueAtTime(0.001, t);
        noteGain.gain.linearRampToValueAtTime((descentMode ? 0.09 : 0.07) / (i + 1), t + 3.0);
        noteGain.gain.exponentialRampToValueAtTime(0.001, t + 8.6);

        osc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(this.musicGain);

        osc.start(t);
        osc.stop(t + 8.8);
      });
    };

    playChord();
    this.musicInterval = window.setInterval(playChord, 8000);
  }

  public stopAmbientMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    if (this.musicGain && this.ctx) {
      try {
        this.musicGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 1.5);
      } catch {}
    }
  }

  /**
   * Continuous dynamic mountain wind
   */
  public updateAmbientWind(altitude: number, isPushing: boolean, seasonWindMod: number = 1.0) {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    if (!this.windSource) {
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(240, ctx.currentTime);
      filter.Q.setValueAtTime(1.2, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.02 * this.masterVolume, ctx.currentTime);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();

      this.windSource = noise;
      this.windFilter = filter;
      this.windGain = gain;
    }

    if (this.windFilter && this.windGain) {
      const baseFreq = 180 + (seasonWindMod > 1.2 ? 140 : 0);
      const targetFreq = Math.min(1200, baseFreq + altitude * 1.5 + (isPushing ? 120 : 0));
      const targetGain = Math.min(
        0.14,
        (0.02 + altitude * 0.0003 + (isPushing ? 0.025 : 0)) * this.masterVolume * seasonWindMod
      );

      this.windFilter.frequency.setTargetAtTime(targetFreq, ctx.currentTime, 0.4);
      this.windGain.gain.setTargetAtTime(targetGain, ctx.currentTime, 0.4);
    }
  }

  public stopAmbientWind() {
    if (this.windSource) {
      try {
        this.windSource.stop();
        this.windSource.disconnect();
      } catch {}
      this.windSource = null;
      this.windFilter = null;
      this.windGain = null;
    }
  }

  /**
   * Heavy mountain footstep crunch into dirt/gravel
   */
  public playFootstep(strideLeft: boolean) {
    if (this.isMuted) return;
    const now = performance.now();
    if (now - this.lastFootstepTime < 240) return;
    this.lastFootstepTime = now;

    const ctx = this.initContext();
    if (!ctx) return;
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    const baseFreq = strideLeft ? 78 : 72;
    osc.frequency.setValueAtTime(baseFreq, t);
    osc.frequency.exponentialRampToValueAtTime(32, t + 0.12);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(160, t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.18 * this.masterVolume, t + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.13);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.14);

    this.playNoiseGravel(t, 0.11, 0.09 * this.masterVolume);
  }

  /**
   * Heavy human exertion breath
   */
  public playExertionBreath() {
    if (this.isMuted) return;
    const now = performance.now();
    if (now - this.lastBreathTime < 1800) return;
    this.lastBreathTime = now;

    const ctx = this.initContext();
    if (!ctx) return;
    const t = ctx.currentTime;

    // Breath is soft filtered noise
    const bufferSize = Math.floor(ctx.sampleRate * 0.45);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(540, t);
    filter.frequency.exponentialRampToValueAtTime(320, t + 0.45);
    filter.Q.setValueAtTime(2.2, t);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.07 * this.masterVolume, t + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.44);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(t);
    noise.stop(t + 0.46);
  }

  /**
   * Solitary distant mountain bird cry (hawk or raven)
   */
  public playDistantBird() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1750, t);
    osc.frequency.exponentialRampToValueAtTime(2350, t + 0.18);
    osc.frequency.exponentialRampToValueAtTime(1380, t + 0.65);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1950, t);
    filter.Q.setValueAtTime(3.8, t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.045 * this.masterVolume, t + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.75);
  }

  /**
   * Heavy stone friction scrape when pushing
   */
  public playPushScrape(pitchMod: number = 1.0) {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(62 * pitchMod, t);
    osc.frequency.exponentialRampToValueAtTime(42 * pitchMod, t + 0.2);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(220, t);
    filter.Q.setValueAtTime(3.2, t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.25 * this.masterVolume, t + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.21);

    this.playNoiseGravel(t, 0.16, 0.12 * this.masterVolume);
  }

  /**
   * Gravel crunch noise
   */
  private playNoiseGravel(startTime: number, duration: number, volume: number) {
    if (!this.ctx) return;
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(440, startTime);
    filter.Q.setValueAtTime(1.8, startTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    whiteNoise.start(startTime);
    whiteNoise.stop(startTime + duration);
  }

  /**
   * Slipping warning tremolo
   */
  public playSlipWarning() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(105, t);
    osc.frequency.linearRampToValueAtTime(70, t + 0.25);

    gain.gain.setValueAtTime(0.15 * this.masterVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.26);
  }

  /**
   * Catastrophic boulder tumbling crash
   */
  public playCatastrophicRoll() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const t = ctx.currentTime;

    [0, 0.22, 0.48, 0.85].forEach((offset, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(90 - idx * 15, t + offset);
      osc.frequency.exponentialRampToValueAtTime(26, t + offset + 0.5);

      gain.gain.setValueAtTime((0.40 - idx * 0.08) * this.masterVolume, t + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + offset);
      osc.stop(t + offset + 0.51);

      this.playNoiseGravel(t + offset, 0.5, 0.25 * this.masterVolume);
    });
  }

  /**
   * Passing Cairn / Landmark discovery chime
   */
  public playCairnBell() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(659.25, t); // E5
    osc.frequency.exponentialRampToValueAtTime(659.25, t + 1.2);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.12 * this.masterVolume, t + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 1.25);
  }

  public playClick() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.08);

    gain.gain.setValueAtTime(0.08 * this.masterVolume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.09);
  }
}

export const soundEngine = new SoundEngine();
