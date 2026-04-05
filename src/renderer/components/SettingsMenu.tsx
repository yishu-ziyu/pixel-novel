import React, { useState } from 'react';
import { SettingsData, TEXT_SPEED_VALUES, TextSpeedPreset, SkipMode } from '../engine/types';

// Preset labels
const TEXT_SPEED_PRESETS: { label: string; value: TextSpeedPreset }[] = [
  { label: '慢', value: 'slow' },
  { label: '中', value: 'medium' },
  { label: '快', value: 'fast' },
  { label: '瞬间', value: 'instant' },
];

const AUTO_PLAY_INTERVALS = [
  { label: '1秒', value: 1000 },
  { label: '2秒', value: 2000 },
  { label: '3秒', value: 3000 },
  { label: '5秒', value: 5000 },
];

const SKIP_MODE_OPTIONS: { label: string; value: SkipMode }[] = [
  { label: '跳过未读', value: 'skipUnread' },
  { label: '跳过已读', value: 'skipAll' },
];

// Keyboard shortcuts mapping
const KEYBOARD_SHORTCUTS = [
  { key: 'Tab', action: '切换跳过模式' },
  { key: 'Space / Enter', action: '继续对话 / 跳过打字效果' },
  { key: 'A', action: '切换自动播放' },
  { key: 'Esc', action: '打开菜单' },
];

// Pixel-style button component
interface PixelButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  variant?: 'default' | 'danger';
}

const PixelButton: React.FC<PixelButtonProps> = ({
  children,
  onClick,
  active = false,
  variant = 'default',
}) => {
  const [hovered, setHovered] = useState(false);
  const bgColor = variant === 'danger'
    ? (hovered ? '#8b0000' : '#660000')
    : active
      ? (hovered ? '#cc9900' : '#ffcc00')
      : (hovered ? '#555' : '#444');

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: bgColor,
        border: `2px solid ${active ? '#fff' : '#888'}`,
        borderRadius: 4,
        padding: '8px 16px',
        color: active ? '#000' : '#fff',
        fontFamily: '"Press Start 2P", monospace',
        fontSize: 10,
        cursor: 'pointer',
        transition: 'all 0.1s',
        boxShadow: active ? '0 0 10px rgba(255, 204, 0, 0.5)' : 'none',
      }}
    >
      {children}
    </button>
  );
};

// Slider with label component
interface VolumeSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  muted?: boolean;
  onMuteToggle?: () => void;
}

const VolumeSlider: React.FC<VolumeSliderProps> = ({
  label,
  value,
  onChange,
  muted = false,
  onMuteToggle,
}) => {
  const percentage = Math.round(value * 100);

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
      }}>
        <span style={{
          color: '#fff',
          fontFamily: '"Press Start 2P", monospace',
          fontSize: 10,
        }}>
          {label}: {muted ? '静音' : `${percentage}%`}
        </span>
        {onMuteToggle && (
          <PixelButton onClick={onMuteToggle} active={!muted} variant="default">
            {muted ? '静音' : '开启'}
          </PixelButton>
        )}
      </div>
      <div style={{
        position: 'relative',
        height: 20,
        backgroundColor: '#222',
        border: '2px solid #555',
        borderRadius: 4,
      }}>
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: `${percentage}%`,
          backgroundColor: muted ? '#444' : '#ffcc00',
          transition: 'width 0.1s',
        }} />
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={muted ? 0 : value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          disabled={muted}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: 'pointer',
          }}
        />
      </div>
    </div>
  );
};

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
  const [activeTextPreset, setActiveTextPreset] = useState<TextSpeedPreset>(() => {
    const entry = Object.entries(TEXT_SPEED_VALUES).find(
      ([, v]) => Math.abs(v - settings.textSpeed) < 0.1
    );
    return (entry?.[0] as TextSpeedPreset) || 'medium';
  });
  const [mutedChannels, setMutedChannels] = useState({
    bgm: false,
    sfx: false,
    voice: false,
  });

  const handleTextPresetClick = (preset: TextSpeedPreset) => {
    setActiveTextPreset(preset);
    onUpdateSettings({ textSpeed: TEXT_SPEED_VALUES[preset] });
  };

  const handleSliderChange = (value: number) => {
    onUpdateSettings({ textSpeed: value });
    // Check if still matches a preset
    const entry = Object.entries(TEXT_SPEED_VALUES).find(
      ([, v]) => Math.abs(v - value) < 0.1
    );
    if (entry) {
      setActiveTextPreset(entry[0] as TextSpeedPreset);
    } else {
      setActiveTextPreset('medium'); // Clear preset selection when using slider
    }
  };

  const toggleMute = (channel: 'bgm' | 'sfx' | 'voice') => {
    setMutedChannels(prev => ({ ...prev, [channel]: !prev[channel] }));
  };

  const handleRestoreDefaults = () => {
    const defaults: SettingsData = {
      textSpeed: 1,
      autoPlayInterval: 2000,
      autoPlayStopOnInteraction: true,
      bgmVolume: 0.7,
      sfxVolume: 0.8,
      voiceVolume: 0.8,
      skipMode: 'skipUnread',
      fullscreen: false,
    };
    onUpdateSettings(defaults);
    setActiveTextPreset('medium');
    setMutedChannels({ bgm: false, sfx: false, voice: false });
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
        padding: 20,
      }}
    >
      {/* Modal container with pixel border */}
      <div
        style={{
          width: '100%',
          maxWidth: 600,
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: '#1a1a2e',
          border: '4px solid #ffcc00',
          borderRadius: 8,
          boxShadow: '0 0 30px rgba(255, 204, 0, 0.3), inset 0 0 20px rgba(0,0,0,0.5)',
          padding: 24,
        }}
      >
        {/* Title */}
        <div
          style={{
            color: '#ffcc00',
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 18,
            textAlign: 'center',
            marginBottom: 24,
            textShadow: '2px 2px 0 #000',
          }}
        >
          设置
        </div>

        {/* Section: Text Speed */}
        <div style={{ marginBottom: 28 }}>
          <div style={{
            color: '#ffcc00',
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 10,
            marginBottom: 12,
          }}>
            文本速度
          </div>

          {/* Preset buttons */}
          <div style={{
            display: 'flex',
            gap: 8,
            marginBottom: 12,
            flexWrap: 'wrap',
          }}>
            {TEXT_SPEED_PRESETS.map(preset => (
              <PixelButton
                key={preset.value}
                onClick={() => handleTextPresetClick(preset.value)}
                active={activeTextPreset === preset.value}
              >
                {preset.label}
              </PixelButton>
            ))}
          </div>

          {/* Speed slider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <span style={{
              color: '#888',
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 8,
              minWidth: 50,
            }}>
              {settings.textSpeed.toFixed(1)}x
            </span>
            <div style={{
              flex: 1,
              height: 16,
              backgroundColor: '#222',
              border: '2px solid #555',
              borderRadius: 4,
            }}>
              <div style={{
                height: '100%',
                width: `${((settings.textSpeed - 0.5) / 4.5) * 100}%`,
                backgroundColor: '#ffcc00',
                transition: 'width 0.1s',
              }} />
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.1"
                value={settings.textSpeed}
                onChange={(e) => handleSliderChange(parseFloat(e.target.value))}
                style={{
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer',
                }}
              />
            </div>
          </div>
        </div>

        {/* Section: Auto-play */}
        <div style={{ marginBottom: 28 }}>
          <div style={{
            color: '#ffcc00',
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 10,
            marginBottom: 12,
          }}>
            自动播放
          </div>

          {/* Interval selection */}
          <div style={{
            display: 'flex',
            gap: 8,
            marginBottom: 12,
            flexWrap: 'wrap',
          }}>
            {AUTO_PLAY_INTERVALS.map(interval => (
              <PixelButton
                key={interval.value}
                onClick={() => onUpdateSettings({ autoPlayInterval: interval.value })}
                active={settings.autoPlayInterval === interval.value}
              >
                {interval.label}
              </PixelButton>
            ))}
          </div>

          {/* Auto-play toggle */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <span style={{
              color: '#fff',
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 10,
            }}>
              交互时停止
            </span>
            <button
              onClick={() => onUpdateSettings({ autoPlayStopOnInteraction: !settings.autoPlayStopOnInteraction })}
              style={{
                width: 50,
                height: 26,
                backgroundColor: settings.autoPlayStopOnInteraction ? '#4a4' : '#444',
                border: '2px solid #888',
                borderRadius: 4,
                cursor: 'pointer',
                position: 'relative',
                transition: 'background-color 0.2s',
              }}
            >
              <div style={{
                position: 'absolute',
                top: 2,
                left: settings.autoPlayStopOnInteraction ? 24 : 2,
                width: 20,
                height: 20,
                backgroundColor: '#fff',
                borderRadius: 2,
                transition: 'left 0.2s',
              }} />
            </button>
          </div>
        </div>

        {/* Section: Volume */}
        <div style={{ marginBottom: 28 }}>
          <div style={{
            color: '#ffcc00',
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 10,
            marginBottom: 16,
          }}>
            音量
          </div>

          <VolumeSlider
            label="BGM"
            value={settings.bgmVolume}
            onChange={(v) => onUpdateSettings({ bgmVolume: v })}
            muted={mutedChannels.bgm}
            onMuteToggle={() => toggleMute('bgm')}
          />

          <VolumeSlider
            label="音效"
            value={settings.sfxVolume}
            onChange={(v) => onUpdateSettings({ sfxVolume: v })}
            muted={mutedChannels.sfx}
            onMuteToggle={() => toggleMute('sfx')}
          />

          <VolumeSlider
            label="语音"
            value={settings.voiceVolume}
            onChange={(v) => onUpdateSettings({ voiceVolume: v })}
            muted={mutedChannels.voice}
            onMuteToggle={() => toggleMute('voice')}
          />
        </div>

        {/* Section: Skip Mode */}
        <div style={{ marginBottom: 28 }}>
          <div style={{
            color: '#ffcc00',
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 10,
            marginBottom: 12,
          }}>
            跳过模式 (Tab)
          </div>

          <div style={{
            display: 'flex',
            gap: 8,
          }}>
            {SKIP_MODE_OPTIONS.map(option => (
              <PixelButton
                key={option.value}
                onClick={() => onUpdateSettings({ skipMode: option.value })}
                active={settings.skipMode === option.value}
              >
                {option.label}
              </PixelButton>
            ))}
          </div>
        </div>

        {/* Section: Display */}
        <div style={{ marginBottom: 28 }}>
          <div style={{
            color: '#ffcc00',
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 10,
            marginBottom: 12,
          }}>
            显示
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <span style={{
              color: '#fff',
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 10,
            }}>
              全屏
            </span>
            <button
              onClick={() => {
                const newFullscreen = !settings.fullscreen;
                onUpdateSettings({ fullscreen: newFullscreen });
                if (newFullscreen) {
                  document.documentElement.requestFullscreen().catch(() => {});
                } else {
                  document.exitFullscreen().catch(() => {});
                }
              }}
              style={{
                width: 50,
                height: 26,
                backgroundColor: settings.fullscreen ? '#4a4' : '#444',
                border: '2px solid #888',
                borderRadius: 4,
                cursor: 'pointer',
                position: 'relative',
                transition: 'background-color 0.2s',
              }}
            >
              <div style={{
                position: 'absolute',
                top: 2,
                left: settings.fullscreen ? 24 : 2,
                width: 20,
                height: 20,
                backgroundColor: '#fff',
                borderRadius: 2,
                transition: 'left 0.2s',
              }} />
            </button>
          </div>
        </div>

        {/* Section: Keyboard Shortcuts */}
        <div style={{ marginBottom: 28 }}>
          <div style={{
            color: '#ffcc00',
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 10,
            marginBottom: 12,
          }}>
            快捷键
          </div>

          <div style={{
            backgroundColor: '#111',
            border: '2px solid #444',
            borderRadius: 4,
            padding: 12,
          }}>
            {KEYBOARD_SHORTCUTS.map((shortcut, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '6px 0',
                  borderBottom: index < KEYBOARD_SHORTCUTS.length - 1 ? '1px solid #333' : 'none',
                }}
              >
                <span style={{
                  color: '#ffcc00',
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: 8,
                }}>
                  {shortcut.key}
                </span>
                <span style={{
                  color: '#888',
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: 8,
                }}>
                  {shortcut.action}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div style={{
          display: 'flex',
          gap: 16,
          justifyContent: 'center',
          marginTop: 24,
        }}>
          <PixelButton onClick={handleRestoreDefaults} variant="danger">
            恢复默认
          </PixelButton>
          <PixelButton onClick={onClose} active={true}>
            返回
          </PixelButton>
        </div>
      </div>
    </div>
  );
};
