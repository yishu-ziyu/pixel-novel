import { SettingsData } from './types';

type SoundType = 'bgm' | 'sfx';

interface SoundConfig {
  volume: number;
  loop?: boolean;
}

export class AudioManager {
  private bgmAudio: HTMLAudioElement | null = null;
  private sfxAudios: Map<string, HTMLAudioElement> = new Map();
  private settings: SettingsData;
  private currentBgm: string | null = null;

  constructor(settings: SettingsData) {
    this.settings = settings;
  }

  updateSettings(settings: SettingsData): void {
    this.settings = settings;
    if (this.bgmAudio) {
      this.bgmAudio.volume = this.settings.bgmVolume;
    }
    this.sfxAudios.forEach((audio) => {
      audio.volume = this.settings.sfxVolume;
    });
  }

  async playBgm(src: string, config: SoundConfig = { volume: 1, loop: true }): Promise<void> {
    try {
      if (this.currentBgm === src && this.bgmAudio) {
        if (this.bgmAudio.paused) {
          this.bgmAudio.play();
        }
        return;
      }

      if (this.bgmAudio) {
        this.bgmAudio.pause();
        this.bgmAudio.currentTime = 0;
      }

      const audio = new Audio(src);
      audio.volume = this.settings.bgmVolume * config.volume;
      audio.loop = config.loop !== false;
      
      this.bgmAudio = audio;
      this.currentBgm = src;
      
      await audio.play();
    } catch (error) {
      console.warn('Failed to play BGM:', error);
    }
  }

  stopBgm(): void {
    if (this.bgmAudio) {
      this.bgmAudio.pause();
      this.bgmAudio.currentTime = 0;
    }
  }

  pauseBgm(): void {
    if (this.bgmAudio) {
      this.bgmAudio.pause();
    }
  }

  resumeBgm(): void {
    if (this.bgmAudio) {
      this.bgmAudio.play().catch(() => {});
    }
  }

  async playSfx(src: string, config: SoundConfig = { volume: 1 }): Promise<void> {
    try {
      let audio = this.sfxAudios.get(src);
      
      if (!audio) {
        audio = new Audio(src);
        audio.volume = this.settings.sfxVolume * config.volume;
        audio.loop = config.loop || false;
        this.sfxAudios.set(src, audio);
      } else {
        audio.currentTime = 0;
        audio.volume = this.settings.sfxVolume * config.volume;
      }
      
      await audio.play();
    } catch (error) {
      console.warn('Failed to play SFX:', error);
    }
  }

  stopAllSfx(): void {
    this.sfxAudios.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
  }

  clearSfxCache(): void {
    this.stopAllSfx();
    this.sfxAudios.clear();
  }

  getBgmVolume(): number {
    return this.settings.bgmVolume;
  }

  getSfxVolume(): number {
    return this.settings.sfxVolume;
  }

  setBgmVolume(volume: number): void {
    this.settings.bgmVolume = Math.max(0, Math.min(1, volume));
    if (this.bgmAudio) {
      this.bgmAudio.volume = this.settings.bgmVolume;
    }
  }

  setSfxVolume(volume: number): void {
    this.settings.sfxVolume = Math.max(0, Math.min(1, volume));
    this.sfxAudios.forEach((audio) => {
      audio.volume = this.settings.sfxVolume;
    });
  }

  fadeOutBgm(durationMs: number = 1000): Promise<void> {
    return new Promise((resolve) => {
      if (!this.bgmAudio) {
        resolve();
        return;
      }

      const startVolume = this.bgmAudio.volume;
      const startTime = Date.now();
      
      const fadeInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / durationMs, 1);
        this.bgmAudio!.volume = startVolume * (1 - progress);
        
        if (progress >= 1) {
          clearInterval(fadeInterval);
          this.stopBgm();
          resolve();
        }
      }, 16);
    });
  }

  crossfadeBgm(newSrc: string, durationMs: number = 1000): Promise<void> {
    return new Promise((resolve) => {
      const fadeOutPromise = this.fadeOutBgm(durationMs / 2);
      
      setTimeout(() => {
        fadeOutPromise.then(() => {
          this.playBgm(newSrc).then(() => resolve());
        });
      }, durationMs / 2);
    });
  }
}
