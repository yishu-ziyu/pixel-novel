import React, { useEffect, useState, useCallback, useRef } from 'react';
import { createVNEngine } from 'vn-engine';
import { MainMenu, PauseMenu, SaveLoadMenu, SettingsMenu, PixelArtScene } from './components';

type AppState = 'main_menu' | 'playing' | 'paused' | 'save_menu' | 'load_menu' | 'settings' | 'credits' | 'branch_tree';

export const VNEngineIntegration: React.FC = () => {
  const vnEngineRef = useRef<any>(null);
  const [appState, setAppState] = useState<AppState>('main_menu');
  const [currentResult, setCurrentResult] = useState<any>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const initEngine = async () => {
      const vnEngine = createVNEngine();
      await vnEngine.initialize();
      vnEngineRef.current = vnEngine;

      vnEngine.on('stateChange', (result: any) => {
        setCurrentResult(result);
      });

      vnEngine.on('loaded', () => {
        setScriptLoaded(true);
      });

      vnEngine.on('error', (error: string) => {
        console.error('VN Engine Error:', error);
      });
    };

    initEngine();
  }, []);

  const loadAndStartScript = useCallback(async () => {
    if (!vnEngineRef.current) return;

    const script = `
opening:
  - "（凌晨一点，24小时便利店，暖黄灯光，空无一人……）"
  - speaker: "你"
    say: "除了偶尔进来买水的醉汉，就是和泡面作伴……今天应该也会是无聊的一夜吧。"
  - speaker: "你"
    say: "（该做点什么好呢……）"
  - text: "该做点什么好呢……"
    choices:
      - text: "整理货架"
        goto: branch_shelf
      - text: "继续摸鱼玩手机"
        goto: branch_phone
      - text: "检查关东煮"
        goto: branch_oden

branch_shelf:
  - speaker: "你"
    say: "（走到零食区，伸手够向顶层的薯片）"
  - speaker: "???"
    say: "呀——吓到你了吗？"
  - speaker: "你"
    say: "哇啊啊啊！！（差点扔掉手里的薯片）"

branch_phone:
  - speaker: "你"
    say: "（继续刷手机，摸鱼才是夜班精髓嘛～）"
  - speaker: "你"
    say: "（叮——手机弹出一条推送）"
  - speaker: "系统"
    say: "「今夜，便利店将接待非人类客人」"
  - speaker: "你"
    say: "什么奇怪的推送……"

branch_oden:
  - speaker: "你"
    say: "（掀开关东煮锅盖，热气氤氲……）"
  - speaker: "你"
    say: "咦？！锅里怎么有个……小东西？！"
`;

    vnEngineRef.current.loadScript(script);
    vnEngineRef.current.startScene('opening');
    setAppState('playing');
  }, []);

  const handleContinue = useCallback(() => {
    if (vnEngineRef.current) {
      vnEngineRef.current.continue();
    }
  }, []);

  const handleChoice = useCallback((index: number) => {
    if (vnEngineRef.current) {
      vnEngineRef.current.makeChoice(index);
    }
  }, []);

  const handleNewGame = useCallback(() => {
    loadAndStartScript();
  }, [loadAndStartScript]);

  const handleResume = useCallback(() => {
    setAppState('playing');
  }, []);

  const handleMainMenu = useCallback(() => {
    if (vnEngineRef.current) {
      vnEngineRef.current.reset();
    }
    setAppState('main_menu');
  }, []);

  const handleSave = useCallback((saveId: number) => {
    console.log('Save game:', saveId);
    setAppState('paused');
  }, []);

  const handleLoad = useCallback((saveId: number) => {
    console.log('Load game:', saveId);
    setAppState('playing');
  }, []);

  const handleDelete = useCallback((saveId: number) => {
    console.log('Delete save:', saveId);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setAppState(appState === 'save_menu' || appState === 'load_menu' ? 'paused' : 'main_menu');
  }, [appState]);

  const handleUpdateSettings = useCallback((newSettings: any) => {
    console.log('Update settings:', newSettings);
  }, []);

  const handleSaveGame = useCallback(() => {
    setAppState('save_menu');
  }, []);

  const handleLoadGame = useCallback(() => {
    setAppState('load_menu');
  }, []);

  const handleSettings = useCallback(() => {
    setAppState('settings');
  }, []);

  const handleCredits = useCallback(() => {
    setAppState('credits');
  }, []);

  const handleBranchTree = useCallback(() => {
    setAppState('branch_tree');
  }, []);

  const currentSceneType = currentResult?.sceneId || 'convenience_store';

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

        {(appState === 'playing' || appState === 'paused' || appState === 'save_menu' || appState === 'load_menu' || appState === 'settings' || appState === 'branch_tree') && (
          <>
            <PixelArtScene
              type={currentSceneType as any}
              timeOfDay="night"
            />

            {currentResult?.type === 'display_dialogue' && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 20,
                  left: 20,
                  right: 20,
                  backgroundColor: 'rgba(0, 0, 0, 0.85)',
                  border: '3px solid #ffcc00',
                  borderRadius: 8,
                  padding: 16,
                  cursor: 'pointer',
                }}
                onClick={handleContinue}
              >
                {currentResult.speaker && (
                  <div
                    style={{
                      color: '#ffcc00',
                      fontFamily: '"Press Start 2P", monospace',
                      fontSize: 12,
                      marginBottom: 8,
                    }}
                  >
                    {currentResult.speaker}
                  </div>
                )}
                <div
                  style={{
                    color: '#fff',
                    fontFamily: '"Press Start 2P", monospace',
                    fontSize: 10,
                    lineHeight: 1.6,
                  }}
                >
                  {currentResult.content}
                </div>
              </div>
            )}

            {currentResult?.type === 'show_choices' && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 20,
                  left: 20,
                  right: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                {currentResult.choices?.map((choice: any, index: number) => (
                  <button
                    key={index}
                    style={{
                      backgroundColor: 'rgba(50, 50, 80, 0.9)',
                      border: '2px solid #666',
                      borderRadius: 6,
                      padding: '12px 24px',
                      color: '#fff',
                      fontFamily: '"Press Start 2P", monospace',
                      fontSize: 10,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onClick={() => handleChoice(index)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(80, 80, 120, 0.9)';
                      e.currentTarget.style.borderColor = '#ffcc00';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(50, 50, 80, 0.9)';
                      e.currentTarget.style.borderColor = '#666';
                    }}
                  >
                    {choice.text}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {appState === 'paused' && (
          <PauseMenu
            onResume={handleResume}
            onSave={handleSaveGame}
            onLoad={handleLoadGame}
            onSettings={handleSettings}
            onMainMenu={handleMainMenu}
            onBranchTree={handleBranchTree}
          />
        )}
      </div>
    </div>
  );
};
