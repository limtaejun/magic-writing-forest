/**
 * sound-manager.js
 * Synthesized SFX + BGM playback with volume control
 */

class SoundManager {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.volume = 0.3;       // SFX volume
    this.bgmVolume = 0.25;   // BGM volume
    this._initialized = false;

    // BGM state
    this._bgm = null;         // current Audio element
    this._bgmScreen = null;   // which screen BGM is playing for
    this._bgmFiles = {
      map: 'assets/sounds/bgm/bgm-map.mp3',
      quest: 'assets/sounds/bgm/bgm-quest.mp3',
      reward: 'assets/sounds/bgm/bgm-reward.mp3',
      ponyville: 'assets/sounds/bgm/bgm-ponyville.mp3'
    };
    this._bgmCache = {};      // pre-loaded Audio elements
  }

  /** Initialize AudioContext (must be called after user gesture) */
  _ensureContext() {
    if (!this._initialized) {
      try {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this._initialized = true;
      } catch (e) {
        console.warn('Web Audio not supported');
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // ── Volume & Mute ──

  /** Toggle mute (SFX + BGM) */
  toggleMute() {
    this._ensureContext();
    this.muted = !this.muted;
    if (this._bgm) {
      this._bgm.muted = this.muted;
    }
    return this.muted;
  }

  /** Set master volume (0-1), affects both SFX and BGM */
  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    this.bgmVolume = this.volume * 0.8; // BGM slightly quieter than SFX
    if (this._bgm) {
      this._bgm.volume = this.bgmVolume;
    }
  }

  /** Get current volume (0-1) */
  getVolume() {
    return this.volume;
  }

  // ── BGM System ──

  /** Play BGM for a screen. Crossfades if changing. */
  playBGM(screen) {
    // Map screen names to BGM keys
    let bgmKey = 'map';
    if (screen === 'quest') bgmKey = 'quest';
    else if (screen === 'reward') bgmKey = 'reward';
    else if (screen === 'location-quests') bgmKey = 'ponyville';
    else if (screen === 'quest-list' || screen === 'sections') bgmKey = 'map';
    else if (screen === 'collection') bgmKey = 'map';

    // Already playing this BGM
    if (this._bgmScreen === bgmKey && this._bgm && !this._bgm.paused) return;

    const src = this._bgmFiles[bgmKey];
    if (!src) return;

    // Fade out current BGM
    if (this._bgm) {
      this._fadeOutBGM(this._bgm);
    }

    // Get or create Audio element
    let audio = this._bgmCache[bgmKey];
    if (!audio) {
      audio = new Audio(src);
      audio.loop = true;
      audio.preload = 'auto';
      this._bgmCache[bgmKey] = audio;
    }

    audio.volume = 0;
    audio.muted = this.muted;
    audio.currentTime = 0;

    const playPromise = audio.play();
    if (playPromise) {
      playPromise.catch(() => {
        // Autoplay blocked - will retry on next user interaction
      });
    }

    this._bgm = audio;
    this._bgmScreen = bgmKey;
    this._fadeInBGM(audio);
  }

  /** Stop BGM */
  stopBGM() {
    if (this._bgm) {
      this._fadeOutBGM(this._bgm);
      this._bgm = null;
      this._bgmScreen = null;
    }
  }

  /** Fade in BGM over 1 second */
  _fadeInBGM(audio) {
    const target = this.bgmVolume;
    let vol = 0;
    const step = target / 20;
    const interval = setInterval(() => {
      vol += step;
      if (vol >= target) {
        audio.volume = target;
        clearInterval(interval);
      } else {
        audio.volume = vol;
      }
    }, 50);
  }

  /** Fade out BGM over 0.5 second then pause */
  _fadeOutBGM(audio) {
    let vol = audio.volume;
    const step = vol / 10;
    const interval = setInterval(() => {
      vol -= step;
      if (vol <= 0.01) {
        audio.volume = 0;
        audio.pause();
        clearInterval(interval);
      } else {
        audio.volume = vol;
      }
    }, 50);
  }

  // ── SFX: Play a note ──

  _playTone(freq, duration, type, vol, delay) {
    if (this.muted || !this.ctx) return;
    const t = this.ctx.currentTime + (delay || 0);
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime((vol || 1) * this.volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + duration);
  }

  /** Play noise burst (for percussive sounds) */
  _playNoise(duration, vol, delay) {
    if (this.muted || !this.ctx) return;
    const t = this.ctx.currentTime + (delay || 0);
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 3);
    }
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime((vol || 0.3) * this.volume, t);
    source.connect(gain);
    gain.connect(this.ctx.destination);
    source.start(t);
  }

  // ── Sound Effects ──

  /** Button click - soft 'pop' */
  playClick() {
    this._ensureContext();
    this._playTone(880, 0.08, 'sine', 0.4);
    this._playTone(1200, 0.06, 'sine', 0.2, 0.03);
  }

  /** Navigate / screen transition */
  playNavigate() {
    this._ensureContext();
    this._playTone(523, 0.1, 'sine', 0.3);
    this._playTone(659, 0.1, 'sine', 0.3, 0.08);
    this._playTone(784, 0.15, 'sine', 0.3, 0.16);
  }

  /** Quest start - magic scroll unfurling */
  playQuestStart() {
    this._ensureContext();
    const notes = [392, 440, 523, 587, 659, 784];
    notes.forEach((n, i) => {
      this._playTone(n, 0.15, 'sine', 0.25, i * 0.06);
    });
    this._playNoise(0.1, 0.1, 0.1);
  }

  /** Typing - soft key tap */
  playType() {
    this._ensureContext();
    const freq = 800 + Math.random() * 400;
    this._playTone(freq, 0.03, 'square', 0.08);
  }

  /** Hint reveal */
  playHint() {
    this._ensureContext();
    this._playTone(659, 0.12, 'sine', 0.3);
    this._playTone(880, 0.2, 'triangle', 0.25, 0.1);
  }

  /** Submit answer */
  playSubmit() {
    this._ensureContext();
    this._playTone(523, 0.1, 'sine', 0.3);
    this._playTone(659, 0.15, 'sine', 0.3, 0.1);
  }

  /** Perfect answer - triumphant fanfare */
  playPerfect() {
    this._ensureContext();
    this._playTone(523, 0.2, 'sine', 0.4);
    this._playTone(659, 0.2, 'sine', 0.4, 0.15);
    this._playTone(784, 0.2, 'sine', 0.4, 0.3);
    this._playTone(1047, 0.4, 'sine', 0.5, 0.45);
    this._playTone(2093, 0.15, 'sine', 0.15, 0.6);
    this._playTone(2637, 0.15, 'sine', 0.1, 0.7);
    this._playTone(3136, 0.2, 'sine', 0.08, 0.8);
  }

  /** Close match - encouraging melody */
  playClose() {
    this._ensureContext();
    this._playTone(440, 0.15, 'sine', 0.3);
    this._playTone(523, 0.15, 'sine', 0.3, 0.12);
    this._playTone(440, 0.2, 'triangle', 0.2, 0.24);
  }

  /** Creative answer - whimsical sparkle */
  playCreative() {
    this._ensureContext();
    this._playTone(659, 0.15, 'sine', 0.3);
    this._playTone(784, 0.15, 'sine', 0.3, 0.1);
    this._playTone(988, 0.2, 'sine', 0.3, 0.2);
    this._playTone(1319, 0.25, 'triangle', 0.2, 0.3);
  }

  /** Stamp collected - satisfying 'pop-ding' */
  playStamp() {
    this._ensureContext();
    this._playNoise(0.05, 0.3);
    this._playTone(988, 0.2, 'sine', 0.4, 0.05);
    this._playTone(1319, 0.3, 'sine', 0.3, 0.15);
  }

  /** Level up - grand fanfare */
  playLevelUp() {
    this._ensureContext();
    const fanfare = [523, 587, 659, 784, 880, 1047, 1319, 1568];
    fanfare.forEach((n, i) => {
      this._playTone(n, 0.2, 'sine', 0.3, i * 0.1);
    });
    this._playTone(1047, 0.6, 'sine', 0.3, 0.9);
    this._playTone(1319, 0.6, 'sine', 0.25, 0.9);
    this._playTone(1568, 0.6, 'sine', 0.2, 0.9);
    for (let i = 0; i < 6; i++) {
      const f = 2000 + Math.random() * 2000;
      this._playTone(f, 0.1, 'sine', 0.08, 1.0 + i * 0.08);
    }
  }

  /** Error / wrong answer - gentle 'oops' */
  playError() {
    this._ensureContext();
    this._playTone(330, 0.15, 'sine', 0.25);
    this._playTone(277, 0.2, 'sine', 0.25, 0.12);
  }

  /** Back button */
  playBack() {
    this._ensureContext();
    this._playTone(659, 0.08, 'sine', 0.2);
    this._playTone(523, 0.1, 'sine', 0.2, 0.06);
  }
}

// Global instance
window.soundManager = new SoundManager();
