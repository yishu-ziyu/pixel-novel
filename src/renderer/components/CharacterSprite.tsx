import React, { useState, useEffect } from 'react';

interface CharacterSpriteProps {
  character: string;
  emotion?: string;
  position: 'left' | 'center' | 'right';
  animation?: 'fadeIn' | 'slideInLeft' | 'slideInRight' | 'slideInCenter' | 'fadeOut' | 'slideOutLeft' | 'slideOutRight';
  onAnimationComplete?: () => void;
}

const positionStyles: Record<string, React.CSSProperties> = {
  left: { left: 0, bottom: 0 },
  center: { left: '50%', transform: 'translateX(-50%)', bottom: 0 },
  right: { right: 0, bottom: 0 },
};

const getAnimationKeyframes = (animation: string): string => {
  const animations: Record<string, string> = {
    fadeIn: `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `,
    slideInLeft: `
      @keyframes slideInLeft {
        from { opacity: 0; transform: translateX(-100px); }
        to { opacity: 1; transform: translateX(0); }
      }
    `,
    slideInRight: `
      @keyframes slideInRight {
        from { opacity: 0; transform: translateX(100px); }
        to { opacity: 1; transform: translateX(0); }
      }
    `,
    slideInCenter: `
      @keyframes slideInCenter {
        from { opacity: 0; transform: translateX(-50%) translateY(50px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
      }
    `,
    fadeOut: `
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
    `,
    slideOutLeft: `
      @keyframes slideOutLeft {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(-100px); }
      }
    `,
    slideOutRight: `
      @keyframes slideOutRight {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(100px); }
      }
    `,
  };
  return animations[animation] || animations.fadeIn;
};

export const CharacterSprite: React.FC<CharacterSpriteProps> = ({
  character,
  emotion = 'neutral',
  position,
  animation = 'fadeIn',
  onAnimationComplete,
}) => {
  const [imageError, setImageError] = useState(false);
  const [animationClass, setAnimationClass] = useState(animation);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const styleId = `character-animation-styles-${character}`;
    let styleElement = document.getElementById(styleId) as HTMLStyleElement | null;

    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = getAnimationKeyframes(animation);

    const handleAnimationEnd = (e: AnimationEvent) => {
      if (e.animationName === animation) {
        if (animation.startsWith('slideOut') || animation === 'fadeOut') {
          setIsVisible(false);
        }
        onAnimationComplete?.();
      }
    };

    const element = document.querySelector(`[data-character="${character}"]`);
    element?.addEventListener('animationend', handleAnimationEnd as EventListener);

    return () => {
      element?.removeEventListener('animationend', handleAnimationEnd as EventListener);
    };
  }, [animation, character, onAnimationComplete]);

  useEffect(() => {
    setAnimationClass(animation);
  }, [animation]);

  const spritePath = `/assets/characters/${character}/${emotion}.png`;

  if (!isVisible) return null;

  return (
    <div
      data-character={character}
      style={{
        position: 'absolute',
        width: 300,
        height: 400,
        ...positionStyles[position],
        animation: `${animationClass} 0.5s ease-out forwards`,
        imageRendering: 'pixelated',
      }}
    >
      {!imageError ? (
        <img
          src={spritePath}
          alt={character}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
          onError={() => setImageError(true)}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            borderRadius: 8,
            color: '#fff',
            fontSize: 12,
            fontFamily: '"Press Start 2P", monospace',
            textAlign: 'center',
            padding: 16,
          }}
        >
          {character}
        </div>
      )}
    </div>
  );
};
