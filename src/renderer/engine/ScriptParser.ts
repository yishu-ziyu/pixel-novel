import { NovelScript, Scene, Dialogue, Choice, CharacterDisplay, CharacterSpriteConfig, BackgroundTransition } from './types';

export class ScriptParser {
  async loadScript(scriptPath: string): Promise<NovelScript | null> {
    try {
      const response = await fetch(`/assets/scripts/${scriptPath}`);
      if (!response.ok) {
        console.error(`Failed to load script: ${response.status} ${response.statusText}`);
        return null;
      }
      const script = await response.json() as NovelScript;
      if (!this.validateScript(script)) {
        console.error('Script validation failed');
        return null;
      }
      return script;
    } catch (error) {
      console.error('Failed to load script:', error);
      return null;
    }
  }

  validateScript(script: unknown): script is NovelScript {
    if (!script || typeof script !== 'object') return false;
    const s = script as Record<string, unknown>;
    if (typeof s.title !== 'string') return false;
    if (!Array.isArray(s.scenes)) return false;
    return s.scenes.every((scene: unknown) => this.validateScene(scene));
  }

  private validateScene(scene: unknown): boolean {
    if (!scene || typeof scene !== 'object') return false;
    const s = scene as Record<string, unknown>;
    if (typeof s.id !== 'string') return false;
    if (!Array.isArray(s.dialogues)) return false;

    if (s.backgroundTransition) {
      const bt = s.backgroundTransition as Record<string, unknown>;
      const validTypes = ['fade', 'fadeToBlack', 'crossDissolve', 'slide', 'iris'];
      if (!validTypes.includes(bt.type as string)) return false;
    }

    if (s.characters) {
      if (!Array.isArray(s.characters)) return false;
      if (!s.characters.every((c: unknown) => this.validateCharacterDisplay(c))) return false;
    }

    return s.dialogues.every((d: unknown) => this.validateDialogue(d));
  }

  private validateCharacterDisplay(char: unknown): boolean {
    if (!char || typeof char !== 'object') return false;
    const c = char as Record<string, unknown>;
    if (typeof c.character !== 'string') return false;

    if (c.sprite) {
      return this.validateCharacterSpriteConfig(c.sprite);
    }
    return true;
  }

  private validateCharacterSpriteConfig(sprite: unknown): sprite is CharacterSpriteConfig {
    if (!sprite || typeof sprite !== 'object') return false;
    const s = sprite as Record<string, unknown>;
    const validPositions = ['left', 'center', 'right'];
    if (!validPositions.includes(s.position as string)) return false;
    return true;
  }

  private validateDialogue(dialogue: unknown): dialogue is Dialogue {
    if (!dialogue || typeof dialogue !== 'object') return false;
    const d = dialogue as Record<string, unknown>;
    if (typeof d.text !== 'string') return false;

    if (d.choices) {
      if (!Array.isArray(d.choices)) return false;
      if (!d.choices.every((c: unknown) => this.validateChoice(c))) return false;
    }

    if (d.sprite) {
      if (!this.validateCharacterSpriteConfig(d.sprite)) return false;
    }

    return true;
  }

  private validateChoice(choice: unknown): choice is Choice {
    if (!choice || typeof choice !== 'object') return false;
    const c = choice as Record<string, unknown>;
    if (typeof c.text !== 'string') return false;
    if (typeof c.nextSceneId !== 'string') return false;
    return true;
  }

  getScene(script: NovelScript, sceneId: string): Scene | undefined {
    return script.scenes.find((s) => s.id === sceneId);
  }
}
