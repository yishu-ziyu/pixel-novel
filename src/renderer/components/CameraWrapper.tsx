import React, { useEffect, useState } from 'react';
import { CameraState } from '../engine/types';

interface CameraWrapperProps {
  children: React.ReactNode;
  cameraState?: CameraState;
}

export const CameraWrapper: React.FC<CameraWrapperProps> = ({
  children,
  cameraState,
}) => {
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (cameraState && cameraState.shake > 0) {
      setIsShaking(true);
      const timer = setTimeout(() => setIsShaking(false), cameraState.duration);
      return () => clearTimeout(timer);
    }
  }, [cameraState]);

  if (!cameraState) {
    return <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>{children}</div>;
  }

  const { zoom, x, y, duration, easing, shake } = cameraState;

  const transformStyle: React.CSSProperties = {
    transition: `transform ${duration}ms ${easing}`,
    transformOrigin: 'center center',
    transform: `scale(${zoom}) translate(${-x}%, ${-y}%)`,
    width: '100%',
    height: '100%',
    position: 'relative',
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', backgroundColor: '#000' }}>
      <style>{`
        @keyframes cameraShake {
          0% { transform: translate(0, 0); }
          10% { transform: translate(${-2 * shake}px, ${-2 * shake}px); }
          20% { transform: translate(${2 * shake}px, ${-1 * shake}px); }
          30% { transform: translate(${-2 * shake}px, ${2 * shake}px); }
          40% { transform: translate(${2 * shake}px, ${1 * shake}px); }
          50% { transform: translate(${-1 * shake}px, ${-2 * shake}px); }
          60% { transform: translate(${1 * shake}px, ${2 * shake}px); }
          70% { transform: translate(${-2 * shake}px, ${1 * shake}px); }
          80% { transform: translate(${2 * shake}px, ${1 * shake}px); }
          90% { transform: translate(${-1 * shake}px, ${-1 * shake}px); }
          100% { transform: translate(0, 0); }
        }
        .camera-shake {
          animation: cameraShake 0.1s linear infinite;
        }
      `}</style>
      <div 
        className={isShaking ? 'camera-shake' : ''} 
        style={transformStyle}
      >
        {children}
      </div>
    </div>
  );
};
