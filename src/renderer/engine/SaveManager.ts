import { SaveData, SettingsData, AchievementData, AutoSaveData } from './types';

const STORAGE_KEY_SAVES = 'pixel-novel-saves';
const STORAGE_KEY_SETTINGS = 'pixel-novel-settings';
const STORAGE_KEY_ACHIEVEMENTS = 'pixel-novel-achievements';
const STORAGE_KEY_AUTO_SAVE = 'pixel-novel-auto-save';
const MAX_SAVE_SLOTS = 5;
const AUTO_SAVE_SLOT_ID = -1;

export class SaveManager {
  private saves: SaveData[] = [];
  private settings!: SettingsData;
  private achievements: AchievementData[] = [];
  private autoSaveData: AutoSaveData = {
    lastAutoSaveSceneId: null,
    lastAutoSaveTime: 0,
    justLoaded: false,
  };

  constructor() {
    this.loadAllData();
  }

  private loadAllData(): void {
    try {
      const savesData = localStorage.getItem(STORAGE_KEY_SAVES);
      this.saves = savesData ? JSON.parse(savesData) : [];
    } catch (e) {
      this.saves = [];
    }

    try {
      const settingsData = localStorage.getItem(STORAGE_KEY_SETTINGS);
      this.settings = settingsData ? JSON.parse(settingsData) : this.getDefaultSettings();
    } catch (e) {
      this.settings = this.getDefaultSettings();
    }

    try {
      const achievementsData = localStorage.getItem(STORAGE_KEY_ACHIEVEMENTS);
      this.achievements = achievementsData ? JSON.parse(achievementsData) : [];
    } catch (e) {
      this.achievements = [];
    }

    try {
      const autoSaveData = localStorage.getItem(STORAGE_KEY_AUTO_SAVE);
      this.autoSaveData = autoSaveData ? JSON.parse(autoSaveData) : {
        lastAutoSaveSceneId: null,
        lastAutoSaveTime: 0,
        justLoaded: false,
      };
    } catch (e) {
      this.autoSaveData = {
        lastAutoSaveSceneId: null,
        lastAutoSaveTime: 0,
        justLoaded: false,
      };
    }
  }

  private saveAllData(): void {
    localStorage.setItem(STORAGE_KEY_SAVES, JSON.stringify(this.saves));
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(this.settings));
    localStorage.setItem(STORAGE_KEY_ACHIEVEMENTS, JSON.stringify(this.achievements));
    localStorage.setItem(STORAGE_KEY_AUTO_SAVE, JSON.stringify(this.autoSaveData));
  }

  private getDefaultSettings(): SettingsData {
    return {
      textSpeed: 1,
      autoPlayInterval: 2000,
      autoPlayStopOnInteraction: true,
      bgmVolume: 0.7,
      sfxVolume: 0.8,
      voiceVolume: 0.8,
      skipMode: 'skipUnread',
      fullscreen: false,
    };
  }

  getSaveSlots(): SaveData[] {
    const slots: SaveData[] = [];
    for (let i = 0; i < MAX_SAVE_SLOTS; i++) {
      const save = this.saves.find(s => s.saveId === i);
      if (save) {
        slots.push(save);
      } else {
        slots.push({
          saveId: i,
          saveName: 'Empty Slot',
          timestamp: 0,
          sceneId: '',
          dialogueIndex: 0,
          choicesMade: [],
          currentText: '',
        });
      }
    }
    return slots;
  }

  saveGame(saveId: number, saveName: string, sceneId: string, dialogueIndex: number, choicesMade: string[], currentText: string, thumbnail?: string, playTimeSeconds?: number): boolean {
    if (saveId < 0 || saveId >= MAX_SAVE_SLOTS) return false;

    const saveData: SaveData = {
      saveId,
      saveName: saveName || `Save ${saveId + 1}`,
      timestamp: Date.now(),
      sceneId,
      dialogueIndex,
      choicesMade,
      currentText,
      thumbnail,
      playTimeSeconds,
    };

    const existingIndex = this.saves.findIndex(s => s.saveId === saveId);
    if (existingIndex >= 0) {
      this.saves[existingIndex] = saveData;
    } else {
      this.saves.push(saveData);
    }

    this.saveAllData();
    return true;
  }

  loadGame(saveId: number): SaveData | null {
    const save = this.saves.find(s => s.saveId === saveId);
    return save || null;
  }

  deleteSave(saveId: number): boolean {
    const index = this.saves.findIndex(s => s.saveId === saveId);
    if (index >= 0) {
      this.saves.splice(index, 1);
      this.saveAllData();
      return true;
    }
    return false;
  }

  quickSave(sceneId: string, dialogueIndex: number, choicesMade: string[], currentText: string): boolean {
    return this.saveGame(0, 'Quick Save', sceneId, dialogueIndex, choicesMade, currentText);
  }

  quickLoad(): SaveData | null {
    return this.loadGame(0);
  }

  autoSave(
    sceneId: string,
    sceneName: string,
    dialogueIndex: number,
    choicesMade: string[],
    currentText: string,
    playTimeSeconds: number,
    thumbnail?: string
  ): boolean {
    const saveData: SaveData = {
      saveId: AUTO_SAVE_SLOT_ID,
      saveName: 'Auto Save',
      timestamp: Date.now(),
      sceneId,
      sceneName,
      dialogueIndex,
      choicesMade,
      currentText,
      thumbnail,
      playTimeSeconds,
    };

    const existingIndex = this.saves.findIndex(s => s.saveId === AUTO_SAVE_SLOT_ID);
    if (existingIndex >= 0) {
      this.saves[existingIndex] = saveData;
    } else {
      this.saves.push(saveData);
    }

    this.autoSaveData.lastAutoSaveSceneId = sceneId;
    this.autoSaveData.lastAutoSaveTime = Date.now();
    this.saveAllData();
    return true;
  }

  loadAutoSave(): SaveData | null {
    const save = this.saves.find(s => s.saveId === AUTO_SAVE_SLOT_ID);
    if (save) {
      this.autoSaveData.justLoaded = true;
      this.saveAllData();
    }
    return save || null;
  }

  getLastAutoSaveSceneId(): string | null {
    return this.autoSaveData.lastAutoSaveSceneId;
  }

  getLastAutoSaveTime(): number {
    return this.autoSaveData.lastAutoSaveTime;
  }

  hasJustLoaded(): boolean {
    return this.autoSaveData.justLoaded;
  }

  setJustLoaded(value: boolean): void {
    this.autoSaveData.justLoaded = value;
    this.saveAllData();
  }

  clearJustLoaded(): void {
    this.autoSaveData.justLoaded = false;
    this.saveAllData();
  }

  shouldAutoSave(sceneId: string): boolean {
    if (this.autoSaveData.justLoaded) {
      return false;
    }
    if (this.autoSaveData.lastAutoSaveSceneId === sceneId) {
      return false;
    }
    return true;
  }

  getSettings(): SettingsData {
    return { ...this.settings };
  }

  updateSettings(newSettings: Partial<SettingsData>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.saveAllData();
  }

  getAchievements(): AchievementData[] {
    return [...this.achievements];
  }

  unlockAchievement(id: string, name: string, description: string): boolean {
    const existing = this.achievements.find(a => a.id === id);
    if (existing?.unlocked) return false;

    const achievement: AchievementData = {
      id,
      name,
      description,
      unlocked: true,
      unlockedAt: Date.now(),
    };

    const existingIndex = this.achievements.findIndex(a => a.id === id);
    if (existingIndex >= 0) {
      this.achievements[existingIndex] = achievement;
    } else {
      this.achievements.push(achievement);
    }

    this.saveAllData();
    return true;
  }

  isAchievementUnlocked(id: string): boolean {
    return this.achievements.find(a => a.id === id)?.unlocked || false;
  }

  clearAllData(): void {
    this.saves = [];
    this.settings = this.getDefaultSettings();
    this.achievements = [];
    this.saveAllData();
  }

  formatTimestamp(timestamp: number): string {
    if (timestamp === 0) return '';
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
