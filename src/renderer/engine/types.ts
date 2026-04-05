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
  type: 'fade';
  duration?: number;
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
  dialogueIndex: number;
  choicesMade: string[];
  currentText: string;
  thumbnail?: string;
}

export interface SettingsData {
  textSpeed: number;
  autoPlayInterval: number;
  bgmVolume: number;
  sfxVolume: number;
  fullscreen: boolean;
}

export interface AchievementData {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: number;
}
