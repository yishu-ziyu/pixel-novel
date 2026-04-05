import React, { useState, useEffect } from 'react';

interface PixelCharacterProps {
  character: 'silver_girl' | 'fox' | 'radish' | 'player';
  emotion?: 'neutral' | 'happy' | 'sad' | 'surprised' | 'curious' | 'gentle' | 'laugh' | 'smile';
  position?: 'left' | 'center' | 'right';
  speaking?: boolean;
}

export const PixelCharacter: React.FC<PixelCharacterProps> = ({
  character,
  emotion = 'neutral',
  position = 'center',
  speaking = false,
}) => {
  const [blinkFrame, setBlinkFrame] = useState(0);
  const [breathFrame, setBreathFrame] = useState(0);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinkFrame(prev => (prev + 1) % 60);
    }, 100);

    const breathInterval = setInterval(() => {
      setBreathFrame(prev => (prev + 1) % 40);
    }, 100);

    return () => {
      clearInterval(blinkInterval);
      clearInterval(breathInterval);
    };
  }, []);

  const isBlinking = blinkFrame >= 55 && blinkFrame <= 59;
  const breathOffset = Math.sin(breathFrame * 0.157) * 1;

  const getCharacterSprite = () => {
    switch (character) {
      case 'silver_girl':
        return <SilverGirlSprite emotion={emotion} isBlinking={isBlinking} breathOffset={breathOffset} speaking={speaking} />;
      case 'fox':
        return <FoxSprite emotion={emotion} isBlinking={isBlinking} breathOffset={breathOffset} speaking={speaking} />;
      case 'radish':
        return <RadishSprite emotion={emotion} isBlinking={isBlinking} breathOffset={breathOffset} speaking={speaking} />;
      case 'player':
      default:
        return <PlayerSprite emotion={emotion} isBlinking={isBlinking} breathOffset={breathOffset} speaking={speaking} />;
    }
  };

  const getPositionStyle = () => {
    switch (position) {
      case 'left':
        return { left: '10%', transform: 'translateX(0)' };
      case 'right':
        return { right: '10%', transform: 'translateX(0)' };
      case 'center':
      default:
        return { left: '50%', transform: 'translateX(-50%)' };
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '80px',
        ...getPositionStyle(),
        width: '160px',
        height: '240px',
        transition: 'all 0.3s ease',
        imageRendering: 'pixelated' as const,
      }}
    >
      {getCharacterSprite()}
    </div>
  );
};

const SilverGirlSprite: React.FC<{
  emotion: string;
  isBlinking: boolean;
  breathOffset: number;
  speaking: boolean;
}> = ({ emotion, isBlinking, breathOffset, speaking }) => {
  const eyeHeight = isBlinking ? 2 : 4;
  const eyeY = isBlinking ? 16 : 14;

  return (
    <svg viewBox="0 0 32 48" style={{ width: '100%', height: '100%', imageRendering: 'pixelated' }}>
      <g transform={`translate(0, ${-breathOffset})`}>
        <rect x="8" y="22" width="16" height="22" fill="#5566aa" />
        <rect x="10" y="26" width="12" height="3" fill="#7788cc" />
        
        <rect x="4" y="24" width="4" height="14" fill="#f0e8e0" />
        <rect x="24" y="24" width="4" height="14" fill="#f0e8e0" />

        <rect x="8" y="6" width="16" height="18" fill="#f0e8e0" />
        
        <rect x="6" y="2" width="20" height="7" fill="#e0d8d0" />
        <rect x="4" y="8" width="6" height="8" fill="#e0d8d0" />
        <rect x="22" y="8" width="6" height="8" fill="#e0d8d0" />
        
        <rect x="6" y="10" width="4" height="3" fill="#c8c0b8" />
        <rect x="22" y="10" width="4" height="3" fill="#c8c0b8" />

        <rect x="10" y={eyeY} width="4" height={eyeHeight} fill="#334455" />
        <rect x="18" y={eyeY} width="4" height={eyeHeight} fill="#334455" />
        
        {!isBlinking && (
          <>
            <rect x="11" y={eyeY + 1} width="2" height="2" fill="#fff" />
            <rect x="19" y={eyeY + 1} width="2" height="2" fill="#fff" />
          </>
        )}

        {emotion === 'happy' && (
          <>
            <rect x="8" y="18" width="4" height="2" fill="#ffaaaa" />
            <rect x="20" y="18" width="4" height="2" fill="#ffaaaa" />
            <rect x="12" y="20" width="8" height="2" fill="#cc8877" />
          </>
        )}
        {emotion === 'smile' && (
          <rect x="12" y="20" width="8" height="2" fill="#cc8877" />
        )}
        {emotion === 'surprised' && (
          <rect x="14" y="20" width="4" height="4" fill="#ffddcc" />
        )}
        {emotion === 'gentle' && (
          <>
            <rect x="11" y="12" width="3" height="1" fill="#665577" />
            <rect x="18" y="12" width="3" height="1" fill="#665577" />
            <rect x="13" y="20" width="6" height="2" fill="#cc8877" />
          </>
        )}

        <rect x="10" y="44" width="5" height="4" fill="#554433" />
        <rect x="17" y="44" width="5" height="4" fill="#554433" />

        {speaking && (
          <rect x="24" y="20" width="3" height="3" fill="#fff" opacity="0.8" />
        )}
      </g>
    </svg>
  );
};

const FoxSprite: React.FC<{
  emotion: string;
  isBlinking: boolean;
  breathOffset: number;
  speaking: boolean;
}> = ({ emotion, isBlinking, breathOffset, speaking }) => {
  const eyeHeight = isBlinking ? 2 : 4;
  const eyeY = isBlinking ? 18 : 16;

  return (
    <svg viewBox="0 0 32 48" style={{ width: '100%', height: '100%', imageRendering: 'pixelated' }}>
      <g transform={`translate(0, ${-breathOffset})`}>
        <rect x="8" y="24" width="16" height="20" fill="#222233" />
        <rect x="10" y="28" width="12" height="3" fill="#444455" />
        <rect x="12" y="32" width="8" height="4" fill="#ffffff" />
        <rect x="14" y="34" width="4" height="2" fill="#333333" />

        <rect x="4" y="26" width="6" height="16" fill="#cc7744" />
        <rect x="22" y="26" width="6" height="16" fill="#cc7744" />

        <rect x="8" y="10" width="16" height="16" fill="#cc7744" />
        
        <rect x="4" y="4" width="8" height="10" fill="#cc7744" />
        <rect x="20" y="4" width="8" height="10" fill="#cc7744" />
        <rect x="6" y="6" width="4" height="6" fill="#ffcccc" />
        <rect x="22" y="6" width="4" height="6" fill="#ffcccc" />

        <rect x="10" y={eyeY} width="5" height={eyeHeight} fill="#222" />
        <rect x="17" y={eyeY} width="5" height={eyeHeight} fill="#222" />
        
        {!isBlinking && (
          <>
            <rect x="12" y={eyeY + 1} width="2" height="2" fill="#fff" />
            <rect x="18" y={eyeY + 1} width="2" height="2" fill="#fff" />
          </>
        )}

        <rect x="14" y="22" width="4" height="3" fill="#222" />

        {emotion === 'happy' && (
          <rect x="12" y="24" width="8" height="2" fill="#885544" />
        )}
        {emotion === 'smile' && (
          <rect x="13" y="24" width="6" height="2" fill="#885544" />
        )}
        {emotion === 'surprised' && (
          <rect x="14" y="24" width="4" height="4" fill="#e8c8b8" />
        )}

        <rect x="24" y="30" width="6" height="18" fill="#cc7744" />
        <rect x="28" y="46" width="4" height="2" fill="#fff" />

        <rect x="10" y="44" width="5" height="4" fill="#333" />
        <rect x="17" y="44" width="5" height="4" fill="#333" />

        {speaking && (
          <rect x="26" y="24" width="3" height="3" fill="#fff" opacity="0.8" />
        )}
      </g>
    </svg>
  );
};

const RadishSprite: React.FC<{
  emotion: string;
  isBlinking: boolean;
  breathOffset: number;
  speaking: boolean;
}> = ({ emotion, isBlinking, breathOffset, speaking }) => {
  const eyeHeight = isBlinking ? 2 : 4;
  const eyeY = isBlinking ? 22 : 20;

  return (
    <svg viewBox="0 0 32 48" style={{ width: '100%', height: '100%', imageRendering: 'pixelated' }}>
      <g transform={`translate(0, ${-breathOffset})`}>
        <ellipse cx="16" cy="30" rx="10" ry="18" fill="#ff8888" />
        <rect x="8" y="18" width="4" height="24" fill="#ff9999" />
        <rect x="20" y="18" width="4" height="24" fill="#ff9999" />

        <rect x="12" y="4" width="3" height="14" fill="#88cc88" />
        <rect x="15" y="2" width="4" height="16" fill="#88cc88" />
        <rect x="18" y="4" width="3" height="14" fill="#88cc88" />

        <ellipse cx="16" cy="24" rx="8" ry="10" fill="#ffeedd" />

        <rect x="10" y={eyeY} width="5" height={eyeHeight} fill="#333" />
        <rect x="17" y={eyeY} width="5" height={eyeHeight} fill="#333" />
        
        {!isBlinking && (
          <>
            <rect x="12" y={eyeY + 1} width="2" height="2" fill="#fff" />
            <rect x="18" y={eyeY + 1} width="2" height="2" fill="#fff" />
          </>
        )}

        {emotion === 'happy' && (
          <>
            <rect x="8" y="28" width="5" height="3" fill="#ffcccc" />
            <rect x="19" y="28" width="5" height="3" fill="#ffcccc" />
            <rect x="13" y="30" width="6" height="2" fill="#cc8877" />
          </>
        )}
        {emotion === 'smile' && (
          <rect x="13" y="30" width="6" height="2" fill="#cc8877" />
        )}
        {emotion === 'curious' && (
          <ellipse cx="16" cy="30" rx="4" ry="5" fill="#ffeedd" />
        )}
        {emotion === 'surprised' && (
          <ellipse cx="16" cy="31" rx="3" ry="4" fill="#ffeedd" />
        )}

        <ellipse cx="6" cy="28" rx="4" ry="6" fill="#ff8888" />
        <ellipse cx="26" cy="28" rx="4" ry="6" fill="#ff8888" />

        <rect x="12" y="44" width="4" height="4" fill="#88cc88" />
        <rect x="16" y="44" width="4" height="4" fill="#88cc88" />

        {speaking && (
          <rect x="24" y="26" width="3" height="3" fill="#fff" opacity="0.8" />
        )}
      </g>
    </svg>
  );
};

const PlayerSprite: React.FC<{
  emotion: string;
  isBlinking: boolean;
  breathOffset: number;
  speaking: boolean;
}> = ({ emotion, isBlinking, breathOffset, speaking }) => {
  const eyeHeight = isBlinking ? 2 : 4;
  const eyeY = isBlinking ? 16 : 14;

  return (
    <svg viewBox="0 0 32 48" style={{ width: '100%', height: '100%', imageRendering: 'pixelated' }}>
      <g transform={`translate(0, ${-breathOffset})`}>
        <rect x="8" y="22" width="16" height="22" fill="#556688" />
        <rect x="10" y="26" width="12" height="3" fill="#ffcc00" />
        <rect x="14" y="26" width="4" height="3" fill="#ffaa00" />
        
        <rect x="4" y="24" width="5" height="18" fill="#f0e8e0" />
        <rect x="23" y="24" width="5" height="18" fill="#f0e8e0" />

        <rect x="8" y="6" width="16" height="18" fill="#f0e8e0" />
        
        <rect x="6" y="2" width="20" height="7" fill="#443322" />
        <rect x="4" y="8" width="4" height="8" fill="#443322" />
        <rect x="24" y="8" width="4" height="8" fill="#443322" />

        <rect x="10" y={eyeY} width="5" height={eyeHeight} fill="#333" />
        <rect x="17" y={eyeY} width="5" height={eyeHeight} fill="#333" />
        
        {!isBlinking && (
          <>
            <rect x="12" y={eyeY + 1} width="2" height="2" fill="#fff" />
            <rect x="18" y={eyeY + 1} width="2" height="2" fill="#fff" />
          </>
        )}

        {emotion === 'bored' && (
          <>
            <rect x="10" y="12" width="5" height="1" fill="#555" />
            <rect x="17" y="12" width="5" height="1" fill="#555" />
          </>
        )}
        {emotion === 'shocked' && (
          <ellipse cx="16" cy="24" rx="4" ry="5" fill="#ffddcc" />
        )}
        {emotion === 'happy' && (
          <rect x="12" y="20" width="8" height="2" fill="#cc8877" />
        )}
        {emotion === 'smile' && (
          <rect x="13" y="20" width="6" height="2" fill="#cc8877" />
        )}

        <rect x="10" y="44" width="5" height="4" fill="#333" />
        <rect x="17" y="44" width="5" height="4" fill="#333" />

        {speaking && (
          <rect x="24" y="20" width="3" height="3" fill="#fff" opacity="0.8" />
        )}
      </g>
    </svg>
  );
};
