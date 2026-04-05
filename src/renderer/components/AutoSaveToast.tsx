import React, { useState, useEffect } from 'react';

interface AutoSaveToastProps {
  isVisible: boolean;
  onFadeOut?: () => void;
}

export const AutoSaveToast: React.FC<AutoSaveToastProps> = ({ isVisible, onFadeOut }) => {
  const [show, setShow] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      setFading(false);

      const fadeTimer = setTimeout(() => {
        setFading(true);
      }, 1800);

      const hideTimer = setTimeout(() => {
        setShow(false);
        if (onFadeOut) {
          onFadeOut();
        }
      }, 2000);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [isVisible, onFadeOut]);

  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 1000,
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.2s ease-out',
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(50, 50, 80, 0.95)',
          border: '2px solid #ffcc00',
          borderRadius: 8,
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: '#4ade80',
            animation: 'pulse 1s infinite',
          }}
        />
        <span
          style={{
            color: '#ffcc00',
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 10,
            textShadow: '1px 1px 0 #000',
          }}
        >
          Auto Saved
        </span>
      </div>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </div>
  );
};
