import React, { useEffect, useState, useCallback } from 'react';
import { NovelEngine, EngineState, EngineData, SettingsData } from './engine';
import { DialogueBox, ChoicePanel, CharacterLayer, MainMenu, PauseMenu, SaveLoadMenu, SettingsMenu, PixelArtScene, BranchTreeViewer, StorySelector } from './components';

const engine = new NovelEngine();

type AppState = 'main_menu' | 'story_selector' | 'playing' | 'paused' | 'save_menu' | 'load_menu' | 'settings' | 'credits' | 'branch_tree';

const App: React.FC = () => {
  const [engineState, setEngineState] = useState<EngineState>('idle');
  const [engineData, setEngineData] = useState<EngineData>({});
  const [appState, setAppState] = useState<AppState>('main_menu');
  const [settings, setSettings] = useState<SettingsData>(() => engine.getSaveManager().getSettings());

  useEffect(() => {
    const unsubscribe = engine.subscribe((state, data) => {
      setEngineState(state);
      setEngineData(data);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (appState === 'playing') {
        if (e.key === 'Escape') {
          setAppState('paused');
        } else if (e.key === 'F5') {
          engine.quickSave();
          alert('Quick Saved!');
        } else if (e.key === 'F9') {
          if (engine.quickLoad()) {
            alert('Quick Loaded!');
          }
        } else if (e.key === 'a' || e.key === 'A') {
          engine.toggleAutoPlay();
        }
      } else if (appState === 'paused' || appState === 'branch_tree') {
        if (e.key === 'Escape') {
          setAppState('playing');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [appState]);

  const handleNewGame = useCallback(() => {
    setAppState('story_selector');
  }, []);

  const handleSelectStory = useCallback((storyId: string) => {
    if (storyId === 'convenience_store') {
      engine.loadScript('convenience_store.json');
    } else if (storyId === 'scott_antarctic') {
      engine.loadScript('scott_antarctic.json');
    }
    engine.startAutoSave();
    setAppState('playing');
  }, []);

  const handleLoadGame = useCallback(() => {
    setAppState('load_menu');
  }, []);

  const handleSaveGame = useCallback(() => {
    setAppState('save_menu');
  }, []);

  const handleResume = useCallback(() => {
    setAppState('playing');
  }, []);

  const handleMainMenu = useCallback(() => {
    engine.stopAutoSave();
    engine.setAutoPlay(false);
    setAppState('main_menu');
  }, []);

  const handleSave = useCallback((saveId: number) => {
    if (engine.saveGame(saveId)) {
      alert('Game Saved!');
      setAppState('paused');
    }
  }, []);

  const handleLoad = useCallback((saveId: number) => {
    if (engine.loadGame(saveId)) {
      setSettings(engine.getSaveManager().getSettings());
      setAppState('playing');
    }
  }, []);

  const handleDelete = useCallback((saveId: number) => {
    if (confirm('Delete this save?')) {
      engine.getSaveManager().deleteSave(saveId);
    }
  }, []);

  const handleSettings = useCallback(() => {
    setSettings(engine.getSaveManager().getSettings());
    setAppState('settings');
  }, []);

  const handleBranchTree = useCallback(() => {
    setAppState('branch_tree');
  }, []);

  const handleCredits = useCallback(() => {
    setAppState('credits');
  }, []);

  const handleCloseMenu = useCallback(() => {
    setAppState(appState === 'save_menu' || appState === 'load_menu' ? 'paused' : 'main_menu');
  }, [appState]);

  const handleUpdateSettings = useCallback((newSettings: Partial<SettingsData>) => {
    engine.getSaveManager().updateSettings(newSettings);
    setSettings(prev => ({ ...prev, ...newSettings }));
    if (newSettings.textSpeed !== undefined) {
      engine.setTextSpeed(newSettings.textSpeed);
    }
  }, []);

  const handleAdvance = useCallback(() => {
    engine.advance();
  }, []);

  const handleSelectChoice = useCallback((index: number) => {
    engine.selectChoice(index);
  }, []);

  const handleSceneSelect = useCallback((sceneId: string) => {
    engine.startScene(sceneId);
    setAppState('playing');
  }, []);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        fontFamily: '"Press Start 2P", monospace',
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
        rel="stylesheet"
      />
      <div
        style={{
          position: 'relative',
          width: 920,
          height: 540,
        }}
      >
        {appState === 'main_menu' && (
          <MainMenu
            onNewGame={handleNewGame}
            onLoadGame={handleLoadGame}
            onSettings={handleSettings}
            onCredits={handleCredits}
          />
        )}

        {appState === 'story_selector' && (
          <StorySelector
            onSelectStory={handleSelectStory}
            onBack={() => setAppState('main_menu')}
          />
        )}

        {appState === 'branch_tree' && engineData.script && (
          <BranchTreeViewer
            script={engineData.script}
            currentSceneId={engineData.scene?.id}
            visitedSceneIds={engineData.visitedSceneIds}
            onSceneSelect={handleSceneSelect}
          />
        )}

        {(appState === 'playing' || appState === 'paused' || appState === 'save_menu' || appState === 'load_menu' || appState === 'settings') && (
          <>
            <PixelArtScene
              type={(engineData.scene?.id as any) || 'convenience_store'}
              timeOfDay="night"
            />

            <CharacterLayer
              characters={engineData.characters || []}
              activeCharacter={engineData.activeCharacter}
              activeEmotion={engineData.activeEmotion}
            />

            {engineState === 'dialogue' && engineData.dialogue && (
              <DialogueBox
                character={engineData.dialogue.character}
                text={engineData.currentText || ''}
                onAdvance={handleAdvance}
              />
            )}

            {engineState === 'choice' && engineData.choices && (
              <ChoicePanel choices={engineData.choices} onSelect={handleSelectChoice} />
            )}

            {engineState === 'end' && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  color: '#fff',
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: 16,
                  textAlign: 'center',
                }}
              >
                THE END
              </div>
            )}

            {engineState === 'idle' && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  color: '#fff',
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: 12,
                }}
              >
                加载中...
              </div>
            )}

            {appState === 'playing' && (
              <div
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: 8,
                  display: 'flex',
                  gap: 16,
                }}
              >
                {engineData.isAutoPlay && <span>自动播放</span>}
                <span>ESC: 菜单</span>
                <span>A: 自动</span>
              </div>
            )}
          </>
        )}

        {appState === 'paused' && engineData.saveManager && (
          <PauseMenu
            onResume={handleResume}
            onSave={handleSaveGame}
            onLoad={handleLoadGame}
            onSettings={handleSettings}
            onMainMenu={handleMainMenu}
            onBranchTree={handleBranchTree}
          />
        )}

        {appState === 'save_menu' && engineData.saveManager && (
          <SaveLoadMenu
            saveManager={engineData.saveManager}
            onSave={handleSave}
            onLoad={() => {}}
            onDelete={() => {}}
            onClose={handleCloseMenu}
            mode="save"
          />
        )}

        {appState === 'load_menu' && engineData.saveManager && (
          <SaveLoadMenu
            saveManager={engineData.saveManager}
            onSave={() => {}}
            onLoad={handleLoad}
            onDelete={handleDelete}
            onClose={handleCloseMenu}
            mode="load"
          />
        )}

        {appState === 'settings' && (
          <SettingsMenu
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onClose={handleCloseMenu}
          />
        )}

        {appState === 'credits' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: '#111',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundImage: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            }}
          >
            <div
              style={{
                color: '#ffcc00',
                fontFamily: '"Press Start 2P", monospace',
                fontSize: 20,
                marginBottom: 40,
              }}
            >
              CREDITS
            </div>
            <div
              style={{
                color: '#fff',
                fontFamily: '"Press Start 2P", monospace',
                fontSize: 10,
                textAlign: 'center',
                lineHeight: 2,
                marginBottom: 40,
              }}
            >
              <div>Game & Story by</div>
              <div>Pixel Novel Team</div>
              <div style={{ marginTop: 20 }}>Special Thanks</div>
              <div>All Players</div>
            </div>
            <button
              style={{
                backgroundColor: 'rgba(100, 100, 100, 0.8)',
                border: '2px solid #888',
                borderRadius: 8,
                padding: '12px 32px',
                color: '#fff',
                fontFamily: '"Press Start 2P", monospace',
                fontSize: 12,
                cursor: 'pointer',
              }}
              onClick={handleCloseMenu}
            >
              BACK
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
