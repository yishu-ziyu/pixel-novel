import React from 'react';
import { SaveData, SaveManager } from '../engine';

interface SaveLoadMenuProps {
  saveManager: SaveManager;
  onSave: (saveId: number) => void;
  onLoad: (saveId: number) => void;
  onDelete: (saveId: number) => void;
  onClose: () => void;
  mode: 'save' | 'load';
}

function formatPlayTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
}

export const SaveLoadMenu: React.FC<SaveLoadMenuProps> = ({
  saveManager,
  onSave,
  onLoad,
  onDelete,
  onClose,
  mode,
}) => {
  const saveSlots = saveManager.getSaveSlots();

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
      }}
    >
      <div
        style={{
          color: '#fff',
          fontFamily: '"Press Start 2P", monospace',
          fontSize: 20,
          marginBottom: 24,
          textShadow: '2px 2px 0 #000',
        }}
      >
        {mode === 'save' ? '保存游戏' : '读取存档'}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(1, 1fr)',
          gap: 12,
          width: '80%',
          maxWidth: 500,
        }}
      >
        {saveSlots.map((slot, index) => (
          <div
            key={slot.saveId}
            style={{
              backgroundColor: slot.timestamp > 0 ? 'rgba(50, 50, 80, 0.8)' : 'rgba(30, 30, 50, 0.8)',
              border: '2px solid #555',
              borderRadius: 8,
              padding: 16,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#ffcc00';
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#555';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            onClick={() => {
              if (mode === 'save') {
                onSave(slot.saveId);
              } else if (slot.timestamp > 0) {
                onLoad(slot.saveId);
              }
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  color: '#ffcc00',
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: 10,
                }}
              >
                存档槽 {slot.saveId + 1}
              </span>
              {slot.timestamp > 0 && (
                <span
                  style={{
                    color: '#aaa',
                    fontFamily: '"Press Start 2P", monospace',
                    fontSize: 8,
                  }}
                >
                  {saveManager.formatTimestamp(slot.timestamp)}
                </span>
              )}
            </div>
            <div
              style={{
                color: slot.timestamp > 0 ? '#fff' : '#666',
                fontFamily: '"Press Start 2P", monospace',
                fontSize: 10,
                marginBottom: 4,
              }}
            >
              {slot.timestamp > 0 ? slot.saveName : '空槽位'}
            </div>
            {slot.timestamp > 0 && (
              <div
                style={{
                  color: '#888',
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: 8,
                }}
              >
                {slot.currentText.substring(0, 50)}
                {slot.currentText.length > 50 ? '...' : ''}
              </div>
            )}
            {slot.timestamp > 0 && slot.sceneName && (
              <div
                style={{
                  color: '#aaa',
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: 8,
                  marginTop: 4,
                }}
              >
                Scene: {slot.sceneName}
              </div>
            )}
            {slot.timestamp > 0 && slot.playTimeSeconds !== undefined && (
              <div
                style={{
                  color: '#888',
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: 8,
                }}
              >
                Play Time: {formatPlayTime(slot.playTimeSeconds)}
              </div>
            )}
            {slot.timestamp > 0 && mode === 'load' && (
              <button
                style={{
                  marginTop: 8,
                  backgroundColor: 'rgba(200, 50, 50, 0.8)',
                  border: '1px solid #ff4444',
                  borderRadius: 4,
                  padding: '4px 8px',
                  color: '#fff',
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: 8,
                  cursor: 'pointer',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(slot.saveId);
                }}
              >
                删除
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        style={{
          marginTop: 24,
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
