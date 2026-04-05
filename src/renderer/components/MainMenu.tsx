import React from 'react';

interface MainMenuProps {
  onNewGame: () => void;
  onLoadGame: () => void;
  onSettings: () => void;
  onCredits: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onNewGame,
  onLoadGame,
  onSettings,
  onCredits,
}) => {
  const menuItems = [
    { label: '新游戏', onClick: onNewGame },
    { label: '读取存档', onClick: onLoadGame },
    { label: '设置', onClick: onSettings },
    { label: '制作人员', onClick: onCredits },
  ];

  return (
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
          fontSize: 28,
          marginBottom: 8,
          textShadow: '3px 3px 0 #000',
          textAlign: 'center',
        }}
      >
        PIXEL NOVEL
      </div>
      <div
        style={{
          color: '#fff',
          fontFamily: '"Press Start 2P", monospace',
          fontSize: 12,
          marginBottom: 60,
          textShadow: '2px 2px 0 #000',
        }}
      >
        便利店夜班的奇妙客人
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {menuItems.map((item, index) => (
          <button
            key={index}
            style={{
              backgroundColor: 'rgba(50, 50, 80, 0.6)',
              border: '3px solid #666',
              borderRadius: 8,
              padding: '16px 48px',
              color: '#fff',
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 14,
              cursor: 'pointer',
              transition: 'all 0.2s',
              minWidth: 240,
            }}
            onClick={item.onClick}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(80, 80, 120, 0.8)';
              e.currentTarget.style.borderColor = '#ffcc00';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(50, 50, 80, 0.6)';
              e.currentTarget.style.borderColor = '#666';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 24,
          color: '#666',
          fontFamily: '"Press Start 2P", monospace',
          fontSize: 10,
        }}
      >
        按 ESC 暂停
      </div>
    </div>
  );
};
