import { useEffect, useRef, useCallback, useState } from 'react';

interface SoundConfig {
  enabled?: boolean;
  masterVolume?: number;
}

class ProceduralSoundEngine {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isInitialized = false;
  private lastScrollY = 0;
  private scrollVelocity = 0;

  async init() {
    if (this.isInitialized) return;
    
    try {
      this.audioContext = new AudioContext();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = 0.03; // Very subtle
      this.isInitialized = true;
    } catch (e) {
      console.warn('Web Audio API not supported');
    }
  }

  setVolume(volume: number) {
    if (this.masterGain) {
      this.masterGain.gain.value = volume * 0.03;
    }
  }

  // Subtle hover tone
  playHoverTone(frequency = 440) {
    if (!this.audioContext || !this.masterGain) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }

  // Click sound
  playClickSound() {
    if (!this.audioContext || !this.masterGain) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);

    oscillator.frequency.value = 880;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }

  // Ambient scroll sound
  playScrollAmbient(velocity: number) {
    if (!this.audioContext || !this.masterGain) return;

    const normalizedVelocity = Math.min(Math.abs(velocity) / 50, 1);
    if (normalizedVelocity < 0.1) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);

    oscillator.type = 'sine';
    oscillator.frequency.value = 100 + normalizedVelocity * 200;

    filter.type = 'lowpass';
    filter.frequency.value = 500 + normalizedVelocity * 1000;

    gainNode.gain.setValueAtTime(normalizedVelocity * 0.2, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.15);
  }

  // Section transition sound
  playSectionTransition() {
    if (!this.audioContext || !this.masterGain) return;

    const frequencies = [330, 440, 550];
    
    frequencies.forEach((freq, i) => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.masterGain!);

      oscillator.frequency.value = freq;
      oscillator.type = 'sine';

      const startTime = this.audioContext!.currentTime + i * 0.05;
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.03);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.4);
    });
  }

  updateScroll(scrollY: number) {
    this.scrollVelocity = scrollY - this.lastScrollY;
    this.lastScrollY = scrollY;
    
    if (Math.abs(this.scrollVelocity) > 5) {
      this.playScrollAmbient(this.scrollVelocity);
    }
  }

  destroy() {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
      this.masterGain = null;
      this.isInitialized = false;
    }
  }
}

const soundEngine = new ProceduralSoundEngine();

export function useProceduralSound(config: SoundConfig = {}) {
  const { enabled = false, masterVolume = 0.5 } = config;
  const [isEnabled, setIsEnabled] = useState(enabled);
  const initialized = useRef(false);

  const init = useCallback(async () => {
    if (!initialized.current) {
      await soundEngine.init();
      initialized.current = true;
    }
  }, []);

  const toggle = useCallback(() => {
    setIsEnabled(prev => !prev);
  }, []);

  const playHover = useCallback((frequency?: number) => {
    if (isEnabled) soundEngine.playHoverTone(frequency);
  }, [isEnabled]);

  const playClick = useCallback(() => {
    if (isEnabled) soundEngine.playClickSound();
  }, [isEnabled]);

  const playSectionTransition = useCallback(() => {
    if (isEnabled) soundEngine.playSectionTransition();
  }, [isEnabled]);

  useEffect(() => {
    soundEngine.setVolume(masterVolume);
  }, [masterVolume]);

  useEffect(() => {
    if (!isEnabled) return;

    const handleScroll = () => {
      soundEngine.updateScroll(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isEnabled]);

  return {
    init,
    isEnabled,
    toggle,
    playHover,
    playClick,
    playSectionTransition,
  };
}
