export type CharacterAnimation = 'fadeIn' | 'slideInLeft' | 'slideInRight' | 'slideInCenter' | 'fadeOut' | 'slideOutLeft' | 'slideOutRight';

export interface CharacterSpriteConfig {
  position: 'left' | 'center' | 'right';
  emotion?: string;
  enter?: CharacterAnimation;
  exit?: CharacterAnimation;
}

export interface CharacterDisplay {
  character: string;
  emotion?: string;
  sprite?: CharacterSpriteConfig;
}

export interface Choice {
  text: string;
  nextSceneId: string;
}

export interface Dialogue {
  character?: string;
  emotion?: string;
  text: string;
  choices?: Choice[];
  sprite?: CharacterSpriteConfig;
}

export interface BackgroundTransition {
  type: 'fade' | 'fadeToBlack' | 'crossDissolve' | 'slide' | 'iris';
  duration?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
  irisOrigin?: 'center' | 'top' | 'bottom' | 'left' | 'right';
}

export interface Scene {
  id: string;
  name: string;
  background?: string;
  backgroundTransition?: BackgroundTransition;
  characters?: CharacterDisplay[];
  dialogues: Dialogue[];
  bgm?: string;
  ambience?: string;
  nextSceneId?: string;
}

export interface NovelScript {
  title: string;
  scenes: Scene[];
}

export type EngineState = 'idle' | 'dialogue' | 'choice' | 'end' | 'menu';

export interface SaveData {
  saveId: number;
  saveName: string;
  timestamp: number;
  sceneId: string;
  sceneName?: string;
  dialogueIndex: number;
  choicesMade: string[];
  currentText: string;
  thumbnail?: string;
  playTimeSeconds?: number;
}

export interface AutoSaveData {
  lastAutoSaveSceneId: string | null;
  lastAutoSaveTime: number;
  justLoaded: boolean;
}

export interface SettingsData {
  textSpeed: number; // 0.5=slow, 1=medium, 2=fast, 5=instant
  autoPlayInterval: number; // milliseconds: 1000, 2000, 3000
  bgmVolume: number;
  sfxVolume: number;
  fullscreen: boolean;
}

// Text speed presets
export type TextSpeedPreset = 'slow' | 'medium' | 'fast' | 'instant';

export const TEXT_SPEED_VALUES: Record<TextSpeedPreset, number> = {
  slow: 0.5,
  medium: 1,
  fast: 2,
  instant: 5,
};

export interface AchievementData {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: number;
}
