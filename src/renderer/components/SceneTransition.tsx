import React, { useEffect, useState, useRef } from 'react';
import { BackgroundTransition } from '../engine/types';

interface SceneTransitionProps {
  transition: BackgroundTransition | undefined;
  onTransitionComplete: () => void;
  children: React.ReactNode;
}

type TransitionPhase = 'idle' | 'transitioning';

export const SceneTransition: React.FC<SceneTransitionProps> = ({
  transition,
  onTransitionComplete,
  children,
}) => {
  const [phase, setPhase] = useState<TransitionPhase>('idle');
  const [opacity, setOpacity] = useState(1);
  const [slideOffset, setSlideOffset] = useState(0);
  const [irisRadius, setIrisRadius] = useState(0);
  const [irisContraction, setIrisContraction] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const duration = transition?.duration ?? 600;

  useEffect(() => {
    if (!transition || transition.type === 'fade') {
      setPhase('idle');
      setOpacity(1);
      setSlideOffset(0);
      setIrisRadius(0);
      return;
    }

    const executeTransition = async () => {
      setPhase('transitioning');

      switch (transition.type) {
        case 'fadeToBlack':
          await executeFadeToBlack(duration);
          break;
        case 'crossDissolve':
          await executeCrossDissolve(duration);
          break;
        case 'slide':
          await executeSlide(duration, transition.direction ?? 'left');
          break;
        case 'iris':
          await executeIris(duration, transition.irisOrigin ?? 'center');
          break;
        default:
          break;
      }

      setPhase('idle');
      onTransitionComplete();
    };

    executeTransition();
  }, [transition]);

  const executeFadeToBlack = async (dur: number) => {
    const halfDuration = dur / 2;

    // Fade out current scene
    for (let i = 0; i <= 10; i++) {
      await sleep(halfDuration / 10);
      setOpacity(1 - i / 10);
    }

    // Brief black screen
    setOpacity(0);
    await sleep(50);

    // Fade in new scene
    for (let i = 0; i <= 10; i++) {
      await sleep(halfDuration / 10);
      setOpacity(i / 10);
    }
    setOpacity(1);
  };

  const executeCrossDissolve = async (dur: number) => {
    // Simultaneous cross-fade
    for (let i = 0; i <= 10; i++) {
      await sleep(dur / 10);
      setOpacity(1 - i / 10);
    }
    setOpacity(0);
  };

  const executeSlide = async (dur: number, direction: 'left' | 'right' | 'up' | 'down') => {
    const containerWidth = containerRef.current?.clientWidth ?? 920;
    const containerHeight = containerRef.current?.clientHeight ?? 540;

    let offsetX = 0;
    let offsetY = 0;

    switch (direction) {
      case 'left':
        offsetX = -containerWidth;
        break;
      case 'right':
        offsetX = containerWidth;
        break;
      case 'up':
        offsetY = -containerHeight;
        break;
      case 'down':
        offsetY = containerHeight;
        break;
    }

    // Slide out old, slide in new simultaneously
    for (let i = 0; i <= 10; i++) {
      await sleep(dur / 10);
      setSlideOffset((i / 10) * offsetX);
    }
    setSlideOffset(0);
  };

  const executeIris = async (dur: number, origin: 'center' | 'top' | 'bottom' | 'left' | 'right') => {
    const maxRadius = 1500; // Enough to cover the entire screen
    const halfDuration = dur / 2;

    // Contraction (scene transitioning to black iris)
    for (let i = 0; i <= 10; i++) {
      await sleep(halfDuration / 10);
      setIrisRadius(maxRadius * (1 - i / 10));
      setIrisContraction(true);
    }

    // Brief pause at full contraction
    await sleep(50);

    // Expansion (new scene revealed by expanding iris)
    for (let i = 0; i <= 10; i++) {
      await sleep(halfDuration / 10);
      setIrisRadius(maxRadius * (i / 10));
      setIrisContraction(false);
    }

    setIrisRadius(0);
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const getTransitionStyles = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      inset: 0,
      transition: 'none',
    };

    switch (transition?.type) {
      case 'fadeToBlack':
      case 'crossDissolve':
        return {
          ...baseStyle,
          opacity,
        };
      case 'slide':
        return {
          ...baseStyle,
          transform: `translateX(${slideOffset}px)`,
        };
      case 'iris':
        return baseStyle;
      default:
        return baseStyle;
    }
  };

  const renderIrisMask = () => {
    if (transition?.type !== 'iris' || irisRadius === 0) return null;

    const width = containerRef.current?.clientWidth ?? 920;
    const height = containerRef.current?.clientHeight ?? 540;

    let cx = width / 2;
    let cy = height / 2;

    switch (transition.irisOrigin) {
      case 'top':
        cy = 0;
        break;
      case 'bottom':
        cy = height;
        break;
      case 'left':
        cx = 0;
        break;
      case 'right':
        cx = width;
        break;
      default:
        break;
    }

    return (
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        <defs>
          <mask id="iris-mask">
            <rect x="0" y="0" width={width} height={height} fill="white" />
            <circle cx={cx} cy={cy} r={irisRadius} fill="black" />
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width={width}
          height={height}
          fill={irisContraction ? '#000' : 'transparent'}
          mask="url(#iris-mask)"
        />
        {!irisContraction && (
          <circle cx={cx} cy={cy} r={irisRadius} fill="#000" />
        )}
      </svg>
    );
  };

  if (phase === 'idle' && transition?.type !== 'fade') {
    return <>{children}</>;
  }

  return (
    <div ref={containerRef} style={{ position: 'absolute', inset: 0 }}>
      <div style={getTransitionStyles()}>
        {children}
      </div>
      {renderIrisMask()}
      {transition?.type === 'fadeToBlack' && opacity === 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#000',
          }}
        />
      )}
    </div>
  );
};

// Wrapper component that manages old and new scene rendering during transition
interface TransitionManagerProps {
  oldScene: React.ReactNode;
  newScene: React.ReactNode;
  transition: BackgroundTransition | undefined;
  onComplete: () => void;
}

export const TransitionManager: React.FC<TransitionManagerProps> = ({
  oldScene,
  newScene,
  transition,
  onComplete,
}) => {
  const [showOldScene, setShowOldScene] = useState(true);
  const [showNewScene, setShowNewScene] = useState(false);

  useEffect(() => {
    if (!transition || transition.type === 'fade') {
      setShowOldScene(false);
      setShowNewScene(true);
      onComplete();
      return;
    }

    const executeTransition = async () => {
      const duration = transition.duration ?? 600;

      // For iris and fadeToBlack, we need both scenes visible during transition
      if (transition.type === 'iris' || transition.type === 'fadeToBlack') {
        setShowOldScene(true);
        setShowNewScene(true);
        await sleep(duration);
        setShowOldScene(false);
        setShowNewScene(true);
      } else {
        // For crossDissolve and slide, new scene fades in as old fades out
        setShowOldScene(true);
        setShowNewScene(true);
        await sleep(duration);
        setShowOldScene(false);
        setShowNewScene(true);
      }

      onComplete();
    };

    executeTransition();
  }, [transition]);

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {showOldScene && (
        <div style={{ position: 'absolute', inset: 0 }}>
          {oldScene}
        </div>
      )}
      {showNewScene && (
        <SceneTransition transition={transition} onTransitionComplete={() => {}}>
          {newScene}
        </SceneTransition>
      )}
    </div>
  );
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
