import { SaveData, SettingsData, AchievementData } from './types';

const STORAGE_KEY_SAVES = 'pixel-novel-saves';
const STORAGE_KEY_SETTINGS = 'pixel-novel-settings';
const STORAGE_KEY_ACHIEVEMENTS = 'pixel-novel-achievements';
const MAX_SAVE_SLOTS = 5;

export class SaveManager {
  private saves: SaveData[] = [];
  private settings!: SettingsData;
  private achievements: AchievementData[] = [];

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
  }

  private saveAllData(): void {
    localStorage.setItem(STORAGE_KEY_SAVES, JSON.stringify(this.saves));
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(this.settings));
    localStorage.setItem(STORAGE_KEY_ACHIEVEMENTS, JSON.stringify(this.achievements));
  }

  private getDefaultSettings(): SettingsData {
    return {
      textSpeed: 1,
      autoPlayInterval: 2000,
      bgmVolume: 0.7,
      sfxVolume: 0.8,
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

  saveGame(saveId: number, saveName: string, sceneId: string, dialogueIndex: number, choicesMade: string[], currentText: string, thumbnail?: string): boolean {
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
