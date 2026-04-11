import { NovelScript, Scene, Dialogue, EngineState, Choice, CharacterDisplay, BackgroundTransition, CameraState, CinematicIntent } from './types';
import { ScriptParser } from './ScriptParser';
import { SaveManager } from './SaveManager';
import { AudioManager } from './AudioManager';
import html2canvas from 'html2canvas';

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
  activeSprite?: import('./types').CharacterSpriteConfig;
  backgroundTransition?: BackgroundTransition;
  previousBackground?: string;
  saveManager?: SaveManager;
  choicesMade?: string[];
  textSpeed?: number;
  isAutoPlay?: boolean;
  isSkipping?: boolean;
  dialogueHistory?: Dialogue[];
  audioManager?: AudioManager;
  visitedSceneIds?: string[];
  visitedDialogueIds?: string[];
  currentDialogueId?: string;
  cameraState?: CameraState;
}

const INTENT_CAMERA_MAP: Record<CinematicIntent, Partial<CameraState>> = {
  intrigue: { zoom: 1.2, shake: 0, duration: 2000, easing: 'ease-in-out' },
  revelation: { zoom: 1.5, shake: 0.1, duration: 800, easing: 'ease-out' },
  melancholy: { zoom: 1.05, shake: 0, duration: 4000, easing: 'linear' },
  shock: { zoom: 1.3, shake: 0.5, duration: 150, easing: 'ease-in' },
  cozy: { zoom: 1.1, shake: 0.02, duration: 3000, easing: 'ease-in-out' },
  neutral: { zoom: 1.0, shake: 0, duration: 500, easing: 'ease-out' },
};

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
  private isSkipping: boolean = false;
  private autoPlayInterval: ReturnType<typeof setInterval> | null = null;
  private dialogueHistory: Dialogue[] = [];
  private audioManager: AudioManager;
  private visitedSceneIds: Set<string> = new Set();
  private visitedDialogueIds: Set<string> = new Set();
  private dialogueIdCounter: number = 0;
  private playTimeSeconds: number = 0;
  private playTimeInterval: ReturnType<typeof setInterval> | null = null;
  private onAutoSave?: () => void;
  private currentCameraState: CameraState = {
    zoom: 1.0,
    x: 0,
    y: 0,
    shake: 0,
    duration: 500,
    easing: 'ease-out',
  };

  constructor() {
    this.parser = new ScriptParser();
    this.saveManager = new SaveManager();
    const settings = this.saveManager.getSettings();
    this.textSpeed = settings.textSpeed;
    this.audioManager = new AudioManager(settings);
    this.startPlayTimeTracking();
  }

  private startPlayTimeTracking(): void {
    if (this.playTimeInterval) {
      clearInterval(this.playTimeInterval);
    }
    this.playTimeInterval = setInterval(() => {
      this.playTimeSeconds++;
    }, 1000);
  }

  public setOnAutoSaveCallback(callback: () => void): void {
    this.onAutoSave = callback;
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

  private calculateCameraState(dialogue: Dialogue | null): CameraState {
    const intent = dialogue?.intent || 'neutral';
    const config = INTENT_CAMERA_MAP[intent];
    
    let x = 0;
    let y = 0;

    // Automatic tracking: focal point on character position
    if (dialogue?.character && this.currentScene?.characters) {
      const charConfig = this.currentScene.characters.find(c => c.character === dialogue.character);
      const position = charConfig?.sprite?.position || dialogue.sprite?.position || 'center';
      
      if (position === 'left') x = -20;
      else if (position === 'right') x = 20;
      else x = 0;
      
      // Slight zoom adjustment for focus
      y = -5; // Focus a bit on the face area
    }

    return {
      zoom: config.zoom || 1.0,
      x: x,
      y: y,
      shake: config.shake || 0,
      duration: config.duration || 500,
      easing: config.easing || 'ease-out',
    };
  }

  private notify(): void {
    const dialogue = this.currentDialogue;
    let backgroundTransition: BackgroundTransition | undefined;

    if (this.currentScene?.backgroundTransition && this.currentScene.background !== this.previousBackground) {
      backgroundTransition = this.currentScene.backgroundTransition;
    }

    const currentDialogueId = this.getCurrentDialogueId();
    this.currentCameraState = this.calculateCameraState(dialogue);

    const data: EngineData = {
      script: this.script || undefined,
      scene: this.currentScene || undefined,
      dialogue: dialogue ?? undefined,
      choices: dialogue?.choices,
      currentText: this.displayedText,
      characters: this.currentScene?.characters || [],
      activeCharacter: dialogue?.character,
      activeEmotion: dialogue?.emotion,
      activeSprite: dialogue?.sprite,
      backgroundTransition,
      previousBackground: this.previousBackground,
      saveManager: this.saveManager,
      choicesMade: this.choicesMade,
      textSpeed: this.textSpeed,
      isAutoPlay: this.isAutoPlay,
      isSkipping: this.isSkipping,
      dialogueHistory: this.dialogueHistory,
      audioManager: this.audioManager,
      visitedSceneIds: Array.from(this.visitedSceneIds),
      visitedDialogueIds: Array.from(this.visitedDialogueIds),
      currentDialogueId,
      cameraState: this.currentCameraState,
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

    // Handle Ambience SFX
    this.audioManager.stopAllSfx();
    if (scene.ambience) {
      this.audioManager.playSfx(scene.ambience, { volume: 1, loop: true }).catch(() => {});
    }

    if (this.saveManager.shouldAutoSave(sceneId)) {
      this.performAutoSave();
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

    // Generate and track dialogue ID for skip mode
    const dialogueId = this.getCurrentDialogueId();
    this.visitedDialogueIds.add(dialogueId);

    if (dialogue) {
      this.dialogueHistory.push(dialogue);
      if (dialogue.sfx) {
        this.audioManager.playSfx(dialogue.sfx).catch(() => {});
      }
    }

    this.displayedText = '';
    this.state = dialogue.choices && dialogue.choices.length > 0 ? 'choice' : 'dialogue';
    this.notify();

    // For instant text speed, skip the typewriter effect
    if (this.textSpeed >= 5) {
      this.displayedText = dialogue.text;
      if (this.textInterval) clearInterval(this.textInterval);
      this.textInterval = null;
      this.notify();

      if (this.isAutoPlay && this.state === 'dialogue') {
        const autoPlayDelay = this.saveManager.getSettings().autoPlayInterval;
        setTimeout(() => {
          if (this.isAutoPlay) {
            this.advance();
          }
        }, autoPlayDelay);
      }
      return;
    }

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

    // Stop auto-play when user interacts
    if (this.isAutoPlay) {
      this.setAutoPlay(false);
    }

    if (this.textInterval) {
      const currentText = this.currentDialogue?.text || '';
      if (this.displayedText.length < currentText.length) {
        this.displayedText = currentText;
        if (this.textInterval) clearInterval(this.textInterval);
        this.textInterval = null;
        this.notify();
        return;
      }
    }

    if (!this.currentScene) return;

    // Skip mode: advance through visited dialogues until unvisited or end
    if (this.isSkipping) {
      this.advanceInSkipMode();
      return;
    }

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

  private advanceInSkipMode(): void {
    if (!this.currentScene) return;

    // First, check if current dialogue text is fully displayed
    const currentText = this.currentDialogue?.text || '';
    if (this.displayedText.length < currentText.length) {
      // Skip to full text first
      this.displayedText = currentText;
      if (this.textInterval) clearInterval(this.textInterval);
      this.textInterval = null;
      this.notify();
      return;
    }

    // Then advance to next dialogue
    if (this.dialogueIndex < this.currentScene.dialogues.length - 1) {
      const nextDialogueId = `${this.currentScene.id}-${this.dialogueIndex + 1}`;
      if (this.visitedDialogueIds.has(nextDialogueId)) {
        // Skip visited dialogue
        this.dialogueIndex++;
        this.displayedText = this.currentDialogue?.text || '';
        this.notify();
        // Continue skipping recursively
        this.advanceInSkipMode();
      } else {
        // Found unvisited dialogue, stop skipping
        this.dialogueIndex++;
        this.displayCurrentDialogue();
      }
    } else if (this.currentScene.nextSceneId) {
      // Check if next scene's first dialogue is visited
      const nextSceneFirstDialogueId = `${this.currentScene.nextSceneId}-0`;
      if (this.visitedDialogueIds.has(nextSceneFirstDialogueId)) {
        this.startScene(this.currentScene.nextSceneId);
        // Continue skipping in new scene
        this.advanceInSkipMode();
      } else {
        this.startScene(this.currentScene.nextSceneId);
      }
    } else {
      this.state = 'end';
      this.notify();
    }
  }

  selectChoice(choiceIndex: number): void {
    const dialogue = this.currentDialogue;
    if (!dialogue?.choices || !dialogue.choices[choiceIndex]) return;

    const choice = dialogue.choices[choiceIndex];
    this.choicesMade.push(`${this.currentScene?.id || 'unknown'}-${choiceIndex}`);

    if (this.saveManager.shouldAutoSave(choice.nextSceneId)) {
      this.performAutoSave();
    }

    const nextSceneId = choice.nextSceneId;
    this.startScene(nextSceneId);
  }

  getState(): EngineState {
    return this.state;
  }

  async saveGame(saveId: number, saveName?: string): Promise<boolean> {
    if (!this.currentScene) return false;
    
    let thumbnail: string | undefined;
    try {
      const canvas = await html2canvas(document.body, { 
        ignoreElements: (element) => element.id === 'ui-layer',
        scale: 0.25 // keep thumbnail small
      });
      thumbnail = canvas.toDataURL('image/jpeg', 0.6);
    } catch (e) {
      console.error('Failed to generate thumbnail', e);
    }

    return this.saveManager.saveGame(
      saveId,
      saveName || `Save ${saveId + 1}`,
      this.currentScene.id,
      this.dialogueIndex,
      this.choicesMade,
      this.displayedText,
      thumbnail,
      this.playTimeSeconds
    );
  }

  loadGame(saveId: number): boolean {
    const saveData = this.saveManager.loadGame(saveId);
    if (!saveData) return false;

    this.choicesMade = saveData.choicesMade;
    this.playTimeSeconds = saveData.playTimeSeconds || 0;
    this.startScene(saveData.sceneId);
    this.dialogueIndex = saveData.dialogueIndex;
    this.displayedText = saveData.currentText;

    if (this.currentScene) {
      const dialogue = this.currentScene.dialogues[this.dialogueIndex];
      if (dialogue) {
        this.state = dialogue.choices && dialogue.choices.length > 0 ? 'choice' : 'dialogue';
      }
    }

    if (saveId === 0) {
      this.saveManager.setJustLoaded(true);
    } else {
      this.saveManager.clearJustLoaded();
    }

    this.notify();
    return true;
  }

  async quickSave(): Promise<boolean> {
    if (!this.currentScene) return false;
    
    let thumbnail: string | undefined;
    try {
      const canvas = await html2canvas(document.body, { scale: 0.25 });
      thumbnail = canvas.toDataURL('image/jpeg', 0.6);
    } catch (e) {}

    return this.saveManager.saveGame(
      0,
      'Quick Save',
      this.currentScene.id,
      this.dialogueIndex,
      this.choicesMade,
      this.displayedText,
      thumbnail,
      this.playTimeSeconds
    );
  }

  private async performAutoSave(): Promise<void> {
    if (!this.currentScene) return;
    
    let thumbnail: string | undefined;
    try {
      const canvas = await html2canvas(document.body, { scale: 0.25 });
      thumbnail = canvas.toDataURL('image/jpeg', 0.6);
    } catch (e) {}

    this.saveManager.autoSave(
      this.currentScene.id,
      this.currentScene.name,
      this.dialogueIndex,
      this.choicesMade,
      this.displayedText,
      this.playTimeSeconds,
      thumbnail || this.currentScene.background
    );
    if (this.onAutoSave) {
      this.onAutoSave();
    }
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

  // Skip mode methods
  toggleSkipMode(): void {
    this.isSkipping = !this.isSkipping;
    this.notify();
  }

  getIsSkipping(): boolean {
    return this.isSkipping;
  }

  setSkipMode(enabled: boolean): void {
    this.isSkipping = enabled;
    this.notify();
  }

  getCurrentDialogueId(): string {
    if (!this.currentScene) return '';
    return `${this.currentScene.id}-${this.dialogueIndex}`;
  }

  isVisitedDialogue(dialogueId: string): boolean {
    return this.visitedDialogueIds.has(dialogueId);
  }

  getVisitedDialogueIds(): string[] {
    return Array.from(this.visitedDialogueIds);
  }
}
