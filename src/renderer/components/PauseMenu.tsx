import React from 'react';

interface PauseMenuProps {
  onResume: () => void;
  onSave: () => void;
  onLoad: () => void;
  onSettings: () => void;
  onMainMenu: () => void;
  onBranchTree: () => void;
}

export const PauseMenu: React.FC<PauseMenuProps> = ({
  onResume,
  onSave,
  onLoad,
  onSettings,
  onMainMenu,
  onBranchTree,
}) => {
  const menuItems = [
    { label: '继续游戏', onClick: onResume },
    { label: '保存游戏', onClick: onSave },
    { label: '读取存档', onClick: onLoad },
    { label: '分支树', onClick: onBranchTree },
    { label: '设置', onClick: onSettings },
    { label: '主菜单', onClick: onMainMenu },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
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
          fontSize: 16,
          marginBottom: 20,
          textShadow: '2px 2px 0 #000',
        }}
      >
        已暂停
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {menuItems.map((item, index) => (
          <button
            key={index}
            style={{
              backgroundColor: 'rgba(50, 50, 80, 0.6)',
              border: '3px solid #666',
              borderRadius: 8,
              padding: '12px 40px',
              color: '#fff',
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 12,
              cursor: 'pointer',
              transition: 'all 0.2s',
              minWidth: 200,
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
          marginTop: 40,
          color: '#fff',
          fontFamily: '"Press Start 2P", monospace',
          fontSize: 8,
        }}
      >
        F5: 快速存档 | F9: 快速读档
      </div>
    </div>
  );
};
