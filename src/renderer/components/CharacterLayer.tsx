import React, { useState, useEffect } from 'react';
import { CharacterSprite } from './CharacterSprite';
import { CharacterDisplay, CharacterSpriteConfig } from '../engine/types';
import { PixelCharacter } from './PixelCharacter';

interface CharacterLayerProps {
  characters: CharacterDisplay[];
  activeCharacter?: string;
  activeEmotion?: string;
  activeSprite?: CharacterSpriteConfig;
}

export const CharacterLayer: React.FC<CharacterLayerProps> = ({
  characters,
  activeCharacter,
  activeEmotion,
  activeSprite,
}) => {
  const [characterAnimMap, setCharacterAnimMap] = useState<Record<string, string>>({});

  useEffect(() => {
    setCharacterAnimMap(prev => {
      const newMap = { ...prev };
      let changed = false;

      characters.forEach(char => {
        const isSpeaker = activeCharacter === char.character;
        let animation = char.sprite?.enter || 'fadeIn';

        if (isSpeaker && activeSprite) {
          if (activeSprite.enter) animation = activeSprite.enter;
          if (activeSprite.exit) animation = activeSprite.exit;
        }

        const isCurrentlyExiting = prev[char.character]?.includes('Out');
        const isSpecificallyEntering = isSpeaker && activeSprite && activeSprite.enter;

        // If currently exiting, don't revert to enter animation UNLESS specifically told to enter
        if (isCurrentlyExiting && !isSpecificallyEntering) {
          animation = prev[char.character];
        }

        if (prev[char.character] !== animation) {
          newMap[char.character] = animation;
          changed = true;
        }
      });

      return changed ? newMap : prev;
    });
  }, [characters, activeCharacter, activeSprite]);
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
      }}
    >
      {characters.map((char, index) => {
        const isSpeaker = activeCharacter === char.character;
        const emotion = isSpeaker 
          ? (activeEmotion as any) 
          : (char.emotion as any) || 'neutral';
        
        let position = char.sprite?.position || 'center';
        if (isSpeaker && activeSprite?.position) {
          position = activeSprite.position;
        }
        
        const animation = characterAnimMap[char.character] || char.sprite?.enter || 'fadeIn';
        
        return (
          <PixelCharacter
            key={`${char.character}-${index}`}
            character={char.character as any}
            emotion={emotion}
            position={position as any}
            speaking={isSpeaker}
            animation={animation as any}
          />
        );
      })}
    </div>
  );
};
