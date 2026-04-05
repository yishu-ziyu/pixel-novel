import React, { useEffect, useState, useRef } from 'react';

interface DialogueBoxProps {
  character?: string;
  text: string;
  onAdvance: () => void;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({ character, text, onAdvance }) => {
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
    </div>
  );
};
