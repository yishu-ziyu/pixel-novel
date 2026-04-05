import React from 'react';
import { SettingsData } from '../engine';

interface SettingsMenuProps {
  settings: SettingsData;
  onUpdateSettings: (settings: Partial<SettingsData>) => void;
  onClose: () => void;
}

export const SettingsMenu: React.FC<SettingsMenuProps> = ({
  settings,
  onUpdateSettings,
  onClose,
}) => {
  const handleTextSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateSettings({ textSpeed: parseFloat(e.target.value) });
  };

  const handleAutoPlayIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateSettings({ autoPlayInterval: parseInt(e.target.value) });
  };

  const handleBgmVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateSettings({ bgmVolume: parseFloat(e.target.value) });
  };

  const handleSfxVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateSettings({ sfxVolume: parseFloat(e.target.value) });
  };

  const handleFullscreenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateSettings({ fullscreen: e.target.checked });
    if (e.target.checked) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
      }}
    >
      <div
        style={{
          color: '#ffcc00',
          fontFamily: '"Press Start 2P", monospace',
          fontSize: 20,
          marginBottom: 32,
        }}
      >
        设置
      </div>

      <div
        style={{
          width: '80%',
          maxWidth: 500,
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        <div>
          <div
            style={{
              color: '#fff',
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 10,
              marginBottom: 8,
            }}
          >
            文本速度: {settings.textSpeed.toFixed(1)}x
          </div>
          <input
            type="range"
            min="0.5"
            max="5"
            step="0.5"
            value={settings.textSpeed}
            onChange={handleTextSpeedChange}
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <div
            style={{
              color: '#fff',
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 10,
              marginBottom: 8,
            }}
          >
            自动播放间隔: {(settings.autoPlayInterval / 1000).toFixed(1)}秒
          </div>
          <input
            type="range"
            min="1000"
            max="5000"
            step="500"
            value={settings.autoPlayInterval}
            onChange={handleAutoPlayIntervalChange}
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <div
            style={{
              color: '#fff',
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 10,
              marginBottom: 8,
            }}
          >
            背景音乐音量: {Math.round(settings.bgmVolume * 100)}%
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={settings.bgmVolume}
            onChange={handleBgmVolumeChange}
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <div
            style={{
              color: '#fff',
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 10,
              marginBottom: 8,
            }}
          >
            音效音量: {Math.round(settings.sfxVolume * 100)}%
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={settings.sfxVolume}
            onChange={handleSfxVolumeChange}
            style={{ width: '100%' }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              color: '#fff',
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 10,
            }}
          >
            全屏
          </span>
          <input
            type="checkbox"
            checked={settings.fullscreen}
            onChange={handleFullscreenChange}
            style={{
              width: 20,
              height: 20,
            }}
          />
        </div>
      </div>

      <button
        style={{
          marginTop: 40,
          backgroundColor: 'rgba(100, 100, 100, 0.8)',
          border: '2px solid #888',
          borderRadius: 8,
          padding: '12px 32px',
          color: '#fff',
          fontFamily: '"Press Start 2P", monospace',
          fontSize: 12,
          cursor: 'pointer',
        }}
        onClick={onClose}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(130, 130, 130, 0.8)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(100, 100, 100, 0.8)';
        }}
      >
        返回
      </button>
    </div>
  );
};
