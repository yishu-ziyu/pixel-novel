import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Choice } from '../engine/types';

interface ChoicePanelProps {
  choices: Choice[];
  onSelect: (index: number) => void;
}

// Keywords that suggest a committed (one-way) choice
const COMMITTED_KEYWORDS = ['will', 'always', 'forever', 'never', 'must', 'shall', '决定', '承诺', '永远', '必然'];
// Keywords that suggest a critical/important choice
const CRITICAL_KEYWORDS = ['!', 'danger', 'warning', 'critical', 'final', 'last', '结束', '死亡', '危险', '关键', '最终'];

function inferChoiceType(choice: Choice): 'hub' | 'committed' | undefined {
  if (choice.choiceType) return choice.choiceType;

  const text = choice.text.toLowerCase();
  // Check for committed choice keywords
  for (const keyword of COMMITTED_KEYWORDS) {
    if (text.includes(keyword)) return 'committed';
  }
  return undefined;
}

function inferIsCritical(choice: Choice): boolean {
  if (choice.isCritical) return true;

  const text = choice.text.toLowerCase();
  for (const keyword of CRITICAL_KEYWORDS) {
    if (text.includes(keyword)) return true;
  }
  // Short choices with no punctuation are often casual (hub)
  // Very long choices might be more important
  if (choice.text.length > 50) return true;
  return false;
}

const CHOICES_PER_PAGE = 4;

export const ChoicePanel: React.FC<ChoicePanelProps> = ({ choices, onSelect }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const totalPages = Math.ceil(choices.length / CHOICES_PER_PAGE);
  const visibleChoices = choices.slice(
    currentPage * CHOICES_PER_PAGE,
    (currentPage + 1) * CHOICES_PER_PAGE
  );

  const handleSelect = useCallback((index: number) => {
    if (isAnimatingOut) return;

    setSelectedIndex(index);
    setIsAnimatingOut(true);

    // Play selection animation then transition
    setTimeout(() => {
      onSelect(index);
      setSelectedIndex(null);
      setIsAnimatingOut(false);
    }, 300);
  }, [isAnimatingOut, onSelect]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        setFocusedIndex((prev) => {
          const next = (prev + 1) % visibleChoices.length;
          buttonRefs.current[next]?.focus();
          return next;
        });
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        setFocusedIndex((prev) => {
          const next = (prev - 1 + visibleChoices.length) % visibleChoices.length;
          buttonRefs.current[next]?.focus();
          return next;
        });
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (focusedIndex !== null && !isAnimatingOut) {
          handleSelect(focusedIndex);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedIndex, visibleChoices.length, isAnimatingOut, handleSelect]);

  // Reset focus when page changes
  useEffect(() => {
    setFocusedIndex(0);
    buttonRefs.current[0]?.focus();
  }, [currentPage]);

  const getButtonStyle = (choice: Choice, index: number, actualIndex: number): React.CSSProperties => {
    const choiceType = inferChoiceType(choice);
    const isCritical = inferIsCritical(choice);
    const isHovered = hoveredIndex === actualIndex;
    const isSelected = selectedIndex === actualIndex;

    // Base styles
    const baseStyle: React.CSSProperties = {
      backgroundColor: '#222',
      border: '2px solid #fff',
      color: '#fff',
      padding: '12px 24px',
      fontSize: 10,
      cursor: isAnimatingOut ? 'default' : 'pointer',
      fontFamily: '"Press Start 2P", monospace',
      transition: 'all 0.15s ease-out',
      position: 'relative',
      overflow: 'hidden',
      outline: 'none',
    };

    // Layout: side by side for 2 choices, vertical for 3+
    const isSideBySide = choices.length === 2;

    if (isHovered && !isAnimatingOut) {
      baseStyle.transform = 'scale(1.05)';
      baseStyle.boxShadow = '0 0 20px rgba(255, 255, 255, 0.4)';
      baseStyle.backgroundColor = '#444';
    }

    if (isSelected) {
      baseStyle.transform = 'scale(0.95)';
      baseStyle.backgroundColor = '#fff';
      baseStyle.color = '#000';
    }

    // Hub vs Committed styling
    if (choiceType === 'hub') {
      baseStyle.border = '2px dashed #888';
      baseStyle.backgroundColor = 'rgba(50, 50, 50, 0.9)';
    } else if (choiceType === 'committed') {
      baseStyle.border = '2px solid #c44';
      baseStyle.boxShadow = isHovered ? '0 0 15px rgba(200, 68, 68, 0.5)' : 'none';
    }

    // Critical choice styling
    if (isCritical) {
      baseStyle.borderColor = '#f00';
      baseStyle.boxShadow = isHovered
        ? '0 0 25px rgba(255, 0, 0, 0.6)'
        : '0 0 10px rgba(255, 0, 0, 0.3)';
      baseStyle.animation = 'criticalPulse 2s infinite';
    }

    // Selected animation out
    if (isAnimatingOut && isSelected) {
      baseStyle.transform = 'scale(1.1)';
      baseStyle.opacity = 0;
      baseStyle.transition = 'all 0.3s ease-out';
    }

    return baseStyle;
  };

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        border: '3px solid #fff',
        borderRadius: 4,
        padding: '20px 40px',
        fontFamily: '"Press Start 2P", monospace',
      }}
    >
      {/* Critical choice warning */}
      <style>
        {`
          @keyframes criticalPulse {
            0%, 100% { box-shadow: 0 0 10px rgba(255, 0, 0, 0.3); }
            50% { box-shadow: 0 0 20px rgba(255, 0, 0, 0.6); }
          }
          @keyframes selectPop {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(0.95); }
          }
        `}
      </style>

      {/* Choice count indicator */}
      {choices.length > CHOICES_PER_PAGE && (
        <div style={{
          fontSize: 8,
          color: '#888',
          textAlign: 'center',
          marginBottom: 4,
        }}>
          {currentPage + 1} / {totalPages}
        </div>
      )}

      {/* Choices grid */}
      <div
        style={{
          display: choices.length === 2 ? 'flex' : 'flex',
          flexDirection: choices.length === 2 ? 'row' : 'column',
          gap: 12,
        }}
      >
        {visibleChoices.map((choice, index) => {
          const actualIndex = currentPage * CHOICES_PER_PAGE + index;
          const choiceType = inferChoiceType(choice);
          const isCritical = inferIsCritical(choice);

          return (
            <button
              key={actualIndex}
              ref={(el) => { buttonRefs.current[index] = el; }}
              onClick={() => handleSelect(actualIndex)}
              onMouseEnter={() => setHoveredIndex(actualIndex)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={getButtonStyle(choice, index, actualIndex)}
              onFocus={() => setFocusedIndex(index)}
            >
              {/* Critical indicator */}
              {isCritical && (
                <span style={{
                  marginRight: 8,
                  color: '#f00',
                  fontWeight: 'bold',
                }}>
                  !
                </span>
              )}

              {/* Hub/Committed indicator */}
              {choiceType === 'hub' && (
                <span style={{
                  marginRight: 8,
                  color: '#0f0',
                  fontSize: 8,
                }}>
                  &#9679;
                </span>
              )}
              {choiceType === 'committed' && (
                <span style={{
                  marginRight: 8,
                  color: '#f00',
                  fontSize: 8,
                }}>
                  &#9654;
                </span>
              )}

              {choice.text}

              {/* Critical icon for very important choices */}
              {isCritical && choice.text.length < 30 && (
                <span style={{
                  marginLeft: 8,
                  color: '#ff0',
                }}>
                  &#9888;
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Pagination for > 4 choices */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 8,
          marginTop: 8,
        }}>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              style={{
                width: 24,
                height: 24,
                backgroundColor: currentPage === i ? '#fff' : '#444',
                color: currentPage === i ? '#000' : '#fff',
                border: '1px solid #888',
                borderRadius: 2,
                cursor: 'pointer',
                fontSize: 8,
                fontFamily: '"Press Start 2P", monospace',
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};