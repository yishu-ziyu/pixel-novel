import React from 'react';

interface StorySelectorProps {
  onSelectStory: (storyId: string) => void;
  onBack: () => void;
}

export const StorySelector: React.FC<StorySelectorProps> = ({
  onSelectStory,
  onBack,
}) => {
  const stories = [
    {
      id: 'convenience_store',
      title: '便利店夜班的奇妙客人',
      description: '温馨治愈的便利店故事',
      theme: '温暖、治愈、奇幻'
    },
    {
      id: 'scott_antarctic',
      title: '最漫长的归途',
      description: '斯科特南极探险队的悲壮史诗',
      theme: '勇气、友谊、牺牲、尊严'
    },
    {
      id: 'haber_prussian_blue',
      title: '普鲁士蓝',
      description: '关于弗里茨·哈伯的科学、道德与救赎',
      theme: '科学、道德、悖论'
    }
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
          fontSize: 24,
          marginBottom: 40,
          textShadow: '3px 3px 0 #000',
        }}
      >
        选择故事
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          width: '80%',
          maxWidth: 500,
        }}
      >
        {stories.map((story) => (
          <button
            key={story.id}
            style={{
              backgroundColor: 'rgba(50, 50, 80, 0.6)',
              border: '3px solid #666',
              borderRadius: 8,
              padding: '20px 32px',
              color: '#fff',
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 12,
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'left',
            }}
            onClick={() => onSelectStory(story.id)}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(80, 80, 120, 0.8)';
              e.currentTarget.style.borderColor = '#ffcc00';
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(50, 50, 80, 0.6)';
              e.currentTarget.style.borderColor = '#666';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <div style={{ fontSize: 14, marginBottom: 8, color: '#ffcc00' }}>
              {story.title}
            </div>
            <div style={{ fontSize: 10, marginBottom: 4, color: '#aaa' }}>
              {story.description}
            </div>
            <div style={{ fontSize: 8, color: '#888' }}>
              主题：{story.theme}
            </div>
          </button>
        ))}
      </div>

      <button
        style={{
          marginTop: 40,
          backgroundColor: 'rgba(100, 100, 100, 0.6)',
          border: '2px solid #888',
          borderRadius: 8,
          padding: '12px 32px',
          color: '#fff',
          fontFamily: '"Press Start 2P", monospace',
          fontSize: 12,
          cursor: 'pointer',
        }}
        onClick={onBack}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(130, 130, 130, 0.8)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(100, 100, 100, 0.6)';
        }}
      >
        返回
      </button>
    </div>
  );
};
