import React from 'react';
import { CharacterSprite } from './CharacterSprite';
import { CharacterDisplay } from '../engine/types';
import { PixelCharacter } from './PixelCharacter';

interface CharacterLayerProps {
  characters: CharacterDisplay[];
  activeCharacter?: string;
  activeEmotion?: string;
}

export const CharacterLayer: React.FC<CharacterLayerProps> = ({
  characters,
  activeCharacter,
  activeEmotion,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
      }}
    >
      {characters.map((char, index) => {
        const emotion = activeCharacter === char.character 
          ? (activeEmotion as any) 
          : (char.emotion as any) || 'neutral';
        
        const position = char.sprite?.position || 'center';
        
        return (
          <PixelCharacter
            key={`${char.character}-${index}`}
            character={char.character as any}
            emotion={emotion}
            position={position as any}
            speaking={activeCharacter === char.character}
          />
        );
      })}
    </div>
  );
};
