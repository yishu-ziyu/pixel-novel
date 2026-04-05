import React from 'react';
import { Choice } from '../engine/types';

interface ChoicePanelProps {
  choices: Choice[];
  onSelect: (index: number) => void;
}

export const ChoicePanel: React.FC<ChoicePanelProps> = ({ choices, onSelect }) => {
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
      {choices.map((choice, index) => (
        <button
          key={index}
          onClick={() => onSelect(index)}
          style={{
            backgroundColor: '#222',
            border: '2px solid #fff',
            color: '#fff',
            padding: '12px 24px',
            fontSize: 10,
            cursor: 'pointer',
            fontFamily: '"Press Start 2P", monospace',
            transition: 'background-color 0.1s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#444')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#222')}
        >
          {choice.text}
        </button>
      ))}
    </div>
  );
};
