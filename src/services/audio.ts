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
    } else {
      try {
        this.musicGain.gain.cancelScheduledValues(ctx.currentTime);
        this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, ctx.currentTime);
        this.musicGain.gain.linearRampToValueAtTime(0.18 * this.masterVolume, ctx.currentTime + 2.0);
      } catch {}
    }

    // 432 Hz Meditative Harmonies (Deep Relaxation & Contemplation)
    // Rooted in 432 Hz Pythagorean / Solfeggio tuning (A=432 Hz):
    // 108 Hz (A2), 162 Hz (E3), 216 Hz (A3), 270 Hz (C#4), 324 Hz (E4), 432 Hz (A4)
    const meditationChords = [
      // 1. Serene Stillness (A minor 9 in 432Hz)
      [108.0, 162.0, 216.0, 256.8, 324.0, 432.0],
      // 2. Open Sky (F maj7 add9 in 432Hz)
      [85.6, 128.5, 171.2, 216.0, 256.8, 342.5],
      // 3. Ancient Earth (C maj9 in 432Hz)
      [128.5, 162.0, 192.8, 240.8, 288.0, 385.7],
      // 4. Pure Presence (D suspended / 432Hz)
      [72.0, 144.0, 216.0, 288.0, 324.0, 432.0]
    ];

    // Serene Contemplation Chords during Sisyphus's conscious Walk Down
    const descentChords = [
      [108.0, 162.0, 216.0, 270.0, 324.0, 432.0], // A major add9
      [96.2, 144.3, 192.5, 240.6, 288.7, 385.0],  // F# minor 7
      [128.5, 171.2, 216.0, 256.8, 342.5, 432.0], // D major 7
      [81.0, 121.5, 162.0, 216.0, 243.0, 324.0]   // E sus4
    ];

    const currentProgression = descentMode ? descentChords : meditationChords;
    let chordIdx = 0;

    const playChord = () => {
      if (!this.isMusicPlaying || !this.ctx || !this.musicGain) return;
      const t = this.ctx.currentTime;
      const notes = currentProgression[chordIdx];
      chordIdx = (chordIdx + 1) % currentProgression.length;

      // Every 2 chords, strike a soft resonant Tibetan singing bowl
      if (chordIdx % 2 === 0) {
        this.playTibetanSingingBowl(216);
      } else if (Math.random() > 0.4) {
        this.playZenChime();
      }

      notes.forEach((freq, i) => {
        if (!this.ctx || !this.musicGain) return;
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        // Warm pure sine waves for deep meditative relaxation
        osc.type = i === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, t);
        // Ultra subtle analog drift (0.3 Hz phase sweep)
        osc.detune.setValueAtTime((Math.random() - 0.5) * 4, t);
        osc.detune.linearRampToValueAtTime((Math.random() - 0.5) * 7, t + 9.5);

        filter.type = 'lowpass';
        const cutoff = 360 + i * 65;
        filter.frequency.setValueAtTime(cutoff, t);
        filter.frequency.linearRampToValueAtTime(cutoff + 80, t + 4.5);
        filter.frequency.linearRampToValueAtTime(cutoff, t + 9.5);

        noteGain.gain.setValueAtTime(0.001, t);
        noteGain.gain.linearRampToValueAtTime((0.08 / (i * 0.7 + 1)) * this.masterVolume, t + 3.5);
        noteGain.gain.exponentialRampToValueAtTime(0.001, t + 10.0);

        osc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(this.musicGain);

        osc.start(t);
        osc.stop(t + 10.2);
      });
    };

    playChord();
    this.musicInterval = window.setInterval(playChord, 9500);
  }

  /**
   * Resonant Tibetan Singing Bowl Synthesizer (432 Hz harmonic ratio)
   * Authentic multi-overtone metallic resonance with long tranquil decay
   */
  public playTibetanSingingBowl(fundamental = 216) {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;
    const t = ctx.currentTime;

    // Authentic singing bowl inharmonic overtone ratios (1.0, 2.76, 5.40, 8.93)
    const partials = [
      { ratio: 1.0, gain: 0.12, decay: 9.0 },
      { ratio: 2.76, gain: 0.07, decay: 7.5 },
      { ratio: 5.40, gain: 0.035, decay: 5.5 },
      { ratio: 8.93, gain: 0.015, decay: 3.5 }
    ];

    partials.forEach((p) => {
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(fundamental * p.ratio, t);
      // Subtle vibrato (beating effect typical of hand-hammered singing bowls)
      osc.detune.setValueAtTime(0, t);
      osc.detune.linearRampToValueAtTime(Math.sin(p.ratio) * 6, t + p.decay);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(p.gain * this.masterVolume, t + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + p.decay);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + p.decay + 0.1);
    });
  }

  /**
   * Zen Wind Chime / Koshi Bell Sparkle
   */
  public playZenChime() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;
    const t = ctx.currentTime;

    const chimeFreqs = [864, 1080, 1296, 1728, 2160];
    const freq = chimeFreqs[Math.floor(Math.random() * chimeFreqs.length)];

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.04 * this.masterVolume, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 3.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 3.3);
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
