import React, { useEffect, useState, useRef } from 'react';

interface DialogueBoxProps {
  character?: string;
  text: string;
  onAdvance: () => void;
  isAutoPlay?: boolean;
  isSkipping?: boolean;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({ character, text, onAdvance, isAutoPlay, isSkipping }) => {
  const [isAnimating, setIsAnimating] = useState(true);
  const [showCursor, setShowCursor] = useState(true);
  const cursorIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [text]);

  useEffect(() => {
    cursorIntervalRef.current = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => {
      if (cursorIntervalRef.current) clearInterval(cursorIntervalRef.current);
    };
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        border: '3px solid #fff',
        borderRadius: 4,
        padding: '16px 24px',
        cursor: 'pointer',
        fontFamily: '"Press Start 2P", monospace',
        fontSize: 12,
        lineHeight: 1.8,
        color: '#fff',
        minHeight: 100,
        animation: isAnimating ? 'slideUpFadeIn 0.3s ease-out' : 'none',
      }}
      onClick={onAdvance}
    >
      <style>
        {`
          @keyframes slideUpFadeIn {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
      {character && (
        <div
          style={{
            color: '#ffcc00',
            marginBottom: 8,
            fontSize: 10,
            textShadow: '2px 2px 0 #000',
          }}
        >
          {character}
        </div>
      )}
      <div style={{ textShadow: '1px 1px 0 #000' }}>{text}</div>
      <div
        style={{
          position: 'absolute',
          bottom: 8,
          right: 12,
          opacity: 0.6,
          fontSize: 8,
          visibility: showCursor ? 'visible' : 'hidden',
        }}
      >
        CLICK TO CONTINUE
      </div>
      {/* Status indicators */}
      {(isAutoPlay || isSkipping) && (
        <div
          style={{
            position: 'absolute',
            top: 8,
            right: 12,
            display: 'flex',
            gap: 8,
          }}
        >
          {isAutoPlay && (
            <span
              style={{
                backgroundColor: '#4a9eff',
                color: '#fff',
                padding: '2px 6px',
                borderRadius: 2,
                fontSize: 6,
                animation: 'pulse 1s infinite',
              }}
            >
              AUTO
            </span>
          )}
          {isSkipping && (
            <span
              style={{
                backgroundColor: '#ff6b6b',
                color: '#fff',
                padding: '2px 6px',
                borderRadius: 2,
                fontSize: 6,
                animation: 'pulse 0.5s infinite',
              }}
            >
              SKIP
            </span>
          )}
        </div>
      )}
    </div>
  );
};
