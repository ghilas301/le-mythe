/**
 * Immersive Procedural Web Audio Engine
 * - Atmospheric Melancholic Ambient Music (Death Stranding / Low Roar inspired drone pads)
 * - Dynamic altitude wind synthesizer
 * - Solitary mountain bird calls
 * - Heavy granite friction & exertion sounds
 * - Contemplative silence transitions
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

  // Wind Ambient Nodes
  private windGain: GainNode | null = null;
  private windFilter: BiquadFilterNode | null = null;
  private windSource: AudioBufferSourceNode | null = null;

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
   * reminiscent of Death Stranding / ambient Nordic post-rock.
   */
  public startAmbientMusic() {
    if (this.isMuted || !this.musicEnabled || this.isMusicPlaying) return;
    const ctx = this.initContext();
    if (!ctx) return;

    this.isMusicPlaying = true;
    this.musicGain = ctx.createGain();
    this.musicGain.gain.setValueAtTime(0.001, ctx.currentTime);
    this.musicGain.gain.linearRampToValueAtTime(0.18 * this.masterVolume, ctx.currentTime + 3.0);
    this.musicGain.connect(ctx.destination);

    // Chords definitions (frequencies in Hz): Dm, Bb, F, Am
    const chords = [
      [73.42, 110.0, 146.83, 220.0, 293.66], // D2, A2, D3, A3, D4
      [58.27, 116.54, 146.83, 174.61, 233.08], // Bb1, Bb2, D3, F3, Bb3
      [87.31, 130.81, 174.61, 220.0, 261.63], // F2, C3, F3, A3, C4
      [55.0, 110.0, 164.81, 220.0, 261.63]   // A1, A2, E3, A3, C4
    ];

    let chordIdx = 0;

    const playChord = () => {
      if (!this.isMusicPlaying || !this.ctx || !this.musicGain) return;
      const t = this.ctx.currentTime;
      const notes = chords[chordIdx];
      chordIdx = (chordIdx + 1) % chords.length;

      // Create a lush pad with gentle detuning
      notes.forEach((freq, i) => {
        if (!this.ctx || !this.musicGain) return;
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        // Warm saw and sine mixture
        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, t);
        // Subtle drift detune
        osc.detune.setValueAtTime((Math.random() - 0.5) * 8, t);
        osc.detune.linearRampToValueAtTime((Math.random() - 0.5) * 12, t + 8);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(280 + i * 80, t);
        filter.frequency.linearRampToValueAtTime(450 + i * 50, t + 4);
        filter.frequency.linearRampToValueAtTime(260 + i * 60, t + 8);

        noteGain.gain.setValueAtTime(0.001, t);
        noteGain.gain.linearRampToValueAtTime(0.08 / (i + 1), t + 2.5);
        noteGain.gain.exponentialRampToValueAtTime(0.001, t + 8.5);

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
   * Continuous dynamic mountain wind (with seasonal weather modulation)
   */
  public updateAmbientWind(altitude: number, isPushing: boolean, seasonWindMod: number = 1.0) {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    if (!this.windSource) {
      // Create white noise buffer for continuous wind
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
      // Wind intensity increases with altitude, effort, and season (blizzard / squalls)
      const baseFreq = 180 + (seasonWindMod > 1.2 ? 140 : 0);
      const targetFreq = Math.min(1100, baseFreq + altitude * 1.6 + (isPushing ? 130 : 0));
      const targetGain = Math.min(
        0.13,
        (0.02 + altitude * 0.0003 + (isPushing ? 0.03 : 0)) * this.masterVolume * seasonWindMod
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
   * Solitary distant mountain bird cry (gliding hawk / raven)
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
    // Frequency glide simulating high bird cry
    osc.frequency.setValueAtTime(1800, t);
    osc.frequency.exponentialRampToValueAtTime(2400, t + 0.18);
    osc.frequency.exponentialRampToValueAtTime(1400, t + 0.65);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2000, t);
    filter.Q.setValueAtTime(4.0, t);

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
    filter.frequency.setValueAtTime(210, t);
    filter.Q.setValueAtTime(3.2, t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.26 * this.masterVolume, t + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.21);

    this.playNoiseGravel(t, 0.16, 0.13 * this.masterVolume);
  }

  /**
   * Gravel crunch noise
   */
  private playNoiseGravel(startTime: number, duration: number, volume: number) {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(420, startTime);
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
    osc.frequency.linearRampToValueAtTime(75, t + 0.25);

    gain.gain.setValueAtTime(0.14 * this.masterVolume, t);
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

    [0, 0.24, 0.52].forEach((offset, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(85 - idx * 16, t + offset);
      osc.frequency.exponentialRampToValueAtTime(28, t + offset + 0.4);

      gain.gain.setValueAtTime((0.36 - idx * 0.08) * this.masterVolume, t + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + offset);
      osc.stop(t + offset + 0.41);

      this.playNoiseGravel(t + offset, 0.45, 0.22 * this.masterVolume);
    });
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
