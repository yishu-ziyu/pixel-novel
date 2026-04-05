import React from 'react';
import { BackgroundTransition } from '../engine';

interface SceneRendererProps {
  background?: string;
  transition?: BackgroundTransition;
  previousBackground?: string;
}

export const SceneRenderer: React.FC<SceneRendererProps> = ({
  background,
  transition,
  previousBackground,
}) => {
  const getBgStyle = (bg: string) => {
    if (bg?.startsWith('http') || bg?.startsWith('/') || bg?.startsWith('./')) {
      return {
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    return { backgroundColor: bg || '#111' };
  };

  const getTransitionStyle = () => {
    switch (transition?.type) {
      case 'fade':
        return {
          opacity: 0,
          animation: 'fadeIn 0.8s ease-out forwards',
        };
      case 'slide':
        const slideDir = transition.direction || 'right';
        const dirMap = {
          left: { transform: 'translateX(-100%)' },
          right: { transform: 'translateX(100%)' },
          up: { transform: 'translateY(-100%)' },
          down: { transform: 'translateY(100%)' },
        };
        return {
          ...dirMap[slideDir],
          animation: `slideIn${slideDir.charAt(0).toUpperCase() + slideDir.slice(1)} 0.6s ease-out forwards`,
        };
      case 'dissolve':
        return {
          opacity: 0,
          animation: 'dissolve 1s ease-out forwards',
        };
      default:
        return {};
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        @keyframes slideInUp {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }
        @keyframes slideInDown {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes dissolve {
          from { opacity: 0; filter: blur(10px); }
          to { opacity: 1; filter: blur(0); }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.97; }
        }
        @keyframes rain {
          0% { transform: translateY(-10px); opacity: 1; }
          100% { transform: translateY(540px); opacity: 0; }
        }
      `}</style>

      {previousBackground && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            ...getBgStyle(previousBackground),
            opacity: 0.3,
            filter: 'blur(2px)',
          }}
        />
      )}

      <div
        style={{
          position: 'absolute',
          inset: 0,
          ...getBgStyle(background || '#1a1a2e'),
          ...getTransitionStyle(),
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.03) 26%, transparent 27%, transparent 74%, rgba(255,255,255,0.03) 75%, rgba(255,255,255,0.03) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.02) 26%, transparent 27%, transparent 74%, rgba(255,255,255,0.02) 75%, rgba(255,255,255,0.02) 76%, transparent 77%, transparent)',
          backgroundSize: '80px 80px',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.15) 50%)',
          backgroundSize: '100% 4px',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxShadow: 'inset 0 0 150px rgba(0,0,0,0.6)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: -100,
          background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.05), transparent)',
          animation: 'scanline 8s linear infinite',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          animation: 'flicker 0.15s infinite',
          pointerEvents: 'none',
        }}
      />

      {['night', 'dark', 'outside'].some(key => background?.toLowerCase().includes(key)) && (
        <>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${10 + i * 12}%`,
                width: '2px',
                height: '100px',
                background: 'linear-gradient(to bottom, transparent, rgba(174, 194, 224, 0.4), transparent)',
                animation: `rain ${1.5 + i * 0.2}s linear infinite`,
                animationDelay: `${i * 0.3}s`,
                opacity: 0.6,
              }}
            />
          ))}
        </>
      )}
    </div>
  );
};
