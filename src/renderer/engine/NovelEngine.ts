import { NovelScript, Scene, Dialogue, EngineState, Choice, CharacterDisplay, BackgroundTransition, SaveData } from './types';
import { ScriptParser } from './ScriptParser';
import { SaveManager } from './SaveManager';
import { AudioManager } from './AudioManager';

type EngineListener = (state: EngineState, data: EngineData) => void;

export interface EngineData {
  script?: NovelScript;
  scene?: Scene;
  dialogue?: Dialogue;
  choices?: Choice[];
  currentText?: string;
  characters?: CharacterDisplay[];
  activeCharacter?: string;
  activeEmotion?: string;
  backgroundTransition?: BackgroundTransition;
  previousBackground?: string;
  saveManager?: SaveManager;
  choicesMade?: string[];
  textSpeed?: number;
  isAutoPlay?: boolean;
  dialogueHistory?: Dialogue[];
  audioManager?: AudioManager;
  visitedSceneIds?: string[];
}

export class NovelEngine {
  private script: NovelScript | null = null;
  private currentScene: Scene | null = null;
  private dialogueIndex: number = 0;
  private state: EngineState = 'idle';
  private displayedText: string = '';
  private textInterval: ReturnType<typeof setInterval> | null = null;
  private listeners: EngineListener[] = [];
  private parser: ScriptParser;
  private previousBackground: string | undefined = undefined;
  private saveManager: SaveManager;
  private choicesMade: string[] = [];
  private autoSaveInterval: ReturnType<typeof setInterval> | null = null;
  private textSpeed: number = 1;
  private isAutoPlay: boolean = false;
  private autoPlayInterval: ReturnType<typeof setInterval> | null = null;
  private dialogueHistory: Dialogue[] = [];
  private audioManager: AudioManager;
  private visitedSceneIds: Set<string> = new Set();

  constructor() {
    this.parser = new ScriptParser();
    this.saveManager = new SaveManager();
    const settings = this.saveManager.getSettings();
    this.textSpeed = settings.textSpeed;
    this.audioManager = new AudioManager(settings);
  }

  async loadScript(scriptPath: string): Promise<boolean> {
    const script = await this.parser.loadScript(scriptPath);
    if (!script || !this.parser.validateScript(script)) {
      return false;
    }
    this.script = script;
    this.startScene(script.scenes[0].id);
    return true;
  }

  subscribe(listener: EngineListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(): void {
    const dialogue = this.currentDialogue;
    let backgroundTransition: BackgroundTransition | undefined;

    if (this.currentScene?.backgroundTransition && this.currentScene.background !== this.previousBackground) {
      backgroundTransition = this.currentScene.backgroundTransition;
    }

    const data: EngineData = {
      script: this.script || undefined,
      scene: this.currentScene || undefined,
      dialogue,
      choices: dialogue?.choices,
      currentText: this.displayedText,
      characters: this.currentScene?.characters || [],
      activeCharacter: dialogue?.character,
      activeEmotion: dialogue?.emotion,
      backgroundTransition,
      previousBackground: this.previousBackground,
      saveManager: this.saveManager,
      choicesMade: this.choicesMade,
      textSpeed: this.textSpeed,
      isAutoPlay: this.isAutoPlay,
      dialogueHistory: this.dialogueHistory,
      audioManager: this.audioManager,
      visitedSceneIds: Array.from(this.visitedSceneIds),
    };
    this.listeners.forEach((l) => l(this.state, data));
  }

  private get currentDialogue(): Dialogue | null {
    if (!this.currentScene) return null;
    return this.currentScene.dialogues[this.dialogueIndex] || null;
  }

  startScene(sceneId: string): void {
    if (!this.script) return;
    const scene = this.script.scenes.find((s) => s.id === sceneId);
    if (!scene) return;

    if (this.currentScene?.background) {
      this.previousBackground = this.currentScene.background;
    }
    this.currentScene = scene;
    this.dialogueIndex = 0;
    this.visitedSceneIds.add(sceneId);

    if (scene.bgm) {
      this.audioManager.playBgm(scene.bgm).catch(() => {});
    } else if (this.currentScene?.bgm !== scene.bgm) {
      this.audioManager.fadeOutBgm(500);
    }

    this.displayCurrentDialogue();
  }

  getVisitedSceneIds(): string[] {
    return Array.from(this.visitedSceneIds);
  }

  private displayCurrentDialogue(): void {
    const dialogue = this.currentDialogue;
    if (!dialogue) {
      this.state = 'end';
      this.notify();
      return;
    }

    if (dialogue) {
      this.dialogueHistory.push(dialogue);
    }

    this.displayedText = '';
    this.state = dialogue.choices && dialogue.choices.length > 0 ? 'choice' : 'dialogue';
    this.notify();

    const baseDelay = 50;
    const delay = baseDelay / this.textSpeed;

    let charIndex = 0;
    if (this.textInterval) clearInterval(this.textInterval);
    this.textInterval = setInterval(() => {
      if (charIndex < dialogue.text.length) {
        this.displayedText += dialogue.text[charIndex];
        charIndex++;
        this.notify();
      } else {
        if (this.textInterval) clearInterval(this.textInterval);
        this.textInterval = null;

        if (this.isAutoPlay && this.state === 'dialogue') {
          const autoPlayDelay = this.saveManager.getSettings().autoPlayInterval;
          setTimeout(() => {
            if (this.isAutoPlay) {
              this.advance();
            }
          }, autoPlayDelay);
        }
      }
    }, delay);
  }

  advance(): void {
    if (this.state === 'choice') return;

    if (this.textInterval) {
      if (this.displayedText.length < this.currentDialogue?.text.length) {
        this.displayedText = this.currentDialogue?.text || '';
        if (this.textInterval) clearInterval(this.textInterval);
        this.textInterval = null;
        this.notify();
        return;
      }
    }

    if (!this.currentScene) return;
    if (this.dialogueIndex < this.currentScene.dialogues.length - 1) {
      this.dialogueIndex++;
      this.displayCurrentDialogue();
    } else {
      if ('nextSceneId' in this.currentScene && this.currentScene.nextSceneId) {
        this.startScene(this.currentScene.nextSceneId);
      } else {
        this.state = 'end';
        this.notify();
      }
    }
  }

  selectChoice(choiceIndex: number): void {
    const dialogue = this.currentDialogue;
    if (!dialogue?.choices || !dialogue.choices[choiceIndex]) return;
    
    const choice = dialogue.choices[choiceIndex];
    this.choicesMade.push(`${this.currentScene?.id || 'unknown'}-${choiceIndex}`);
    const nextSceneId = choice.nextSceneId;
    this.startScene(nextSceneId);
  }

  getState(): EngineState {
    return this.state;
  }

  saveGame(saveId: number, saveName?: string): boolean {
    if (!this.currentScene) return false;
    return this.saveManager.saveGame(
      saveId,
      saveName || `Save ${saveId + 1}`,
      this.currentScene.id,
      this.dialogueIndex,
      this.choicesMade,
      this.displayedText
    );
  }

  loadGame(saveId: number): boolean {
    const saveData = this.saveManager.loadGame(saveId);
    if (!saveData) return false;
    
    this.choicesMade = saveData.choicesMade;
    this.startScene(saveData.sceneId);
    this.dialogueIndex = saveData.dialogueIndex;
    this.displayedText = saveData.currentText;
    
    if (this.currentScene) {
      const dialogue = this.currentScene.dialogues[this.dialogueIndex];
      if (dialogue) {
        this.state = dialogue.choices && dialogue.choices.length > 0 ? 'choice' : 'dialogue';
      }
    }
    
    this.notify();
    return true;
  }

  quickSave(): boolean {
    if (!this.currentScene) return false;
    return this.saveManager.quickSave(
      this.currentScene.id,
      this.dialogueIndex,
      this.choicesMade,
      this.displayedText
    );
  }

  quickLoad(): boolean {
    return this.loadGame(0);
  }

  getSaveManager(): SaveManager {
    return this.saveManager;
  }

  startAutoSave(intervalMs: number = 30000): void {
    this.stopAutoSave();
    this.autoSaveInterval = setInterval(() => {
      this.quickSave();
    }, intervalMs);
  }

  stopAutoSave(): void {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
    }
  }

  toggleMenu(): void {
    if (this.state === 'menu') {
      this.state = this.currentDialogue?.choices && this.currentDialogue.choices.length > 0 ? 'choice' : 'dialogue';
    } else {
      this.state = 'menu';
    }
    this.notify();
  }

  setTextSpeed(speed: number): void {
    this.textSpeed = Math.max(0.5, Math.min(5, speed));
    this.saveManager.updateSettings({ textSpeed: this.textSpeed });
    this.notify();
  }

  getTextSpeed(): number {
    return this.textSpeed;
  }

  toggleAutoPlay(): void {
    this.isAutoPlay = !this.isAutoPlay;
    
    if (!this.isAutoPlay && this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    } else if (this.isAutoPlay && this.state === 'dialogue' && !this.textInterval) {
      const autoPlayDelay = this.saveManager.getSettings().autoPlayInterval;
      setTimeout(() => {
        if (this.isAutoPlay) {
          this.advance();
        }
      }, autoPlayDelay);
    }
    
    this.notify();
  }

  setAutoPlay(enabled: boolean): void {
    this.isAutoPlay = enabled;
    
    if (!this.isAutoPlay && this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
    
    this.notify();
  }

  getAutoPlay(): boolean {
    return this.isAutoPlay;
  }

  setAutoPlayInterval(intervalMs: number): void {
    this.saveManager.updateSettings({ autoPlayInterval: intervalMs });
  }

  getDialogueHistory(): Dialogue[] {
    return [...this.dialogueHistory];
  }

  clearHistory(): void {
    this.dialogueHistory = [];
  }
}
