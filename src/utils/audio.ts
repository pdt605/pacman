/**
 * Pure Web Audio API Synthesizer for Retro Arcade Sound Effects
 * Custom tuned for academic/pacman audio styling.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private sirenOsc: OscillatorNode | null = null;
  private sirenGain: GainNode | null = null;
  private wakaToggle: boolean = false;
  private lastWakaTime: number = 0;

  constructor() {
    // AudioContext will be initialized on first user interaction to comply with browser autoplay policies
  }

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
    if (!val) {
      this.stopSiren();
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  // Waka Waka / Homework Grading chomp sound
  public playChomp() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    if (now - this.lastWakaTime < 0.08) return;
    this.lastWakaTime = now;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    this.wakaToggle = !this.wakaToggle;
    const startFreq = this.wakaToggle ? 420 : 280;
    const endFreq = this.wakaToggle ? 220 : 160;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.09);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  // Power Exam / Pop Quiz collected fanfare
  public playPowerPellet() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const freqs = [330, 440, 550, 660, 880];
    freqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      gain.gain.setValueAtTime(0.15, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.05 + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.14);
    });
  }

  // Grading a Student Ghost (+200, +400, +800, +1600)
  public playEatGhost(multiplier: number = 1) {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const baseFreq = 440 * (multiplier > 0 ? multiplier : 1);
    
    // Quick ascending harmonic burst
    const notes = [baseFreq, baseFreq * 1.25, baseFreq * 1.5, baseFreq * 2];
    notes.forEach((f, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, now + i * 0.04);
      osc.frequency.exponentialRampToValueAtTime(f * 1.1, now + i * 0.04 + 0.08);

      gain.gain.setValueAtTime(0.2, now + i * 0.04);
      gain.gain.linearRampToValueAtTime(0.01, now + i * 0.04 + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + i * 0.04);
      osc.stop(now + i * 0.04 + 0.1);
    });
  }

  // Academic Bonus Item Pickup (Coffee, Red Pen, Diploma)
  public playEatFruit() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const chords = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    
    chords.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0.18, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.06 + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.22);
    });
  }

  // Professor Life Lost / Disqualification
  public playDeath() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    // Classic downward sliding pitch
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.9);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.95);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 1.0);
  }

  // Level Cleared / Semester Passed Victory
  public playVictory() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Academic fanfare tune
    const melody = [
      { f: 523.25, d: 0.12 }, // C
      { f: 523.25, d: 0.12 }, // C
      { f: 523.25, d: 0.12 }, // C
      { f: 659.25, d: 0.24 }, // E
      { f: 783.99, d: 0.24 }, // G
      { f: 1046.50, d: 0.5 }, // C (high)
    ];

    let t = now;
    melody.forEach((note) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, t);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + note.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + note.d + 0.05);

      t += note.d + 0.04;
    });
  }

  // Game Start Academic Melody
  public playIntroTheme() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [
      { f: 493.88, d: 0.12 }, // B4
      { f: 987.77, d: 0.12 }, // B5
      { f: 739.99, d: 0.12 }, // F#5
      { f: 622.25, d: 0.12 }, // D#5
      { f: 987.77, d: 0.12 }, // B5
      { f: 739.99, d: 0.18 }, // F#5
      { f: 622.25, d: 0.25 }, // D#5
    ];

    let t = now;
    notes.forEach((note) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(note.f, t);

      gain.gain.setValueAtTime(0.14, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + note.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + note.d + 0.02);

      t += note.d;
    });
  }

  // Frightened siren loop management
  public startSiren() {
    if (!this.enabled || this.sirenOsc) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    this.sirenOsc = this.ctx.createOscillator();
    this.sirenGain = this.ctx.createGain();

    this.sirenOsc.type = 'sawtooth';
    this.sirenOsc.frequency.setValueAtTime(220, now);
    
    // LFO for pitch wobble
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(3, now);

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(60, now);

    lfo.connect(lfoGain);
    lfoGain.connect(this.sirenOsc.frequency);

    this.sirenGain.gain.setValueAtTime(0.05, now);

    this.sirenOsc.connect(this.sirenGain);
    this.sirenGain.connect(this.ctx.destination);

    this.sirenOsc.start(now);
    lfo.start(now);
  }

  public stopSiren() {
    if (this.sirenOsc) {
      try {
        this.sirenOsc.stop();
        this.sirenOsc.disconnect();
      } catch {
        // ignore if already stopped
      }
      this.sirenOsc = null;
      this.sirenGain = null;
    }
  }
}

export const sound = new SoundEngine();
