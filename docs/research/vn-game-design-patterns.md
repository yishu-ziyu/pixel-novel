# Interactive Narrative/Visual Novel Game Design Patterns

## 1. Dialogue System Patterns

### Typewriter Text Effects
- **Core Implementation**: Characters reveal progressively (10-30ms per character is typical)
- **Variations**: Character-by-character, Word-by-word, Line-by-line
- **Skip Functionality**: Players should be able to skip to full text or advance without waiting

### Choice/Branching UI Patterns
- **Hub vs Choice distinction**:
  - **Hubs**: Information dumps where players return after getting answers (non-committal)
  - **Choices**: One-way decisions with clear consequences
- **Optimal choice count**: 2-4 options per decision point
- **Signaling critical choices**: Characters should hint at importance ("No turning back now")

### Voice Acting / Auto-Play Modes
- Auto-play advances dialogue automatically after a configurable delay
- Skip mode bypasses already-read content
- Best practice: Allow players to set auto-play timing (1s, 2s, 3s, etc.)

## 2. Save/Load Systems

### Best Practices
1. **Version all save data** - Use meaningful version names
2. **Save individual flags** - Avoid packed bit fields
3. **Save IDs alongside data** - For dynamic lists (missions, NPCs)
4. **Dirty flag system**:
   - Level 1: "Save me now!"
   - Level 2: "Next time you save, ask me for fresh data"

### Auto-Save Patterns
- Save at chapter transitions
- Save before major choices
- "Robustness over recency" - a 5-minute-old correct save is better than a 30-second-old corrupted one

## 3. UI/UX Patterns

### Scene Transitions
| Type | Description | Use Case |
|------|-------------|----------|
| **Cross-dissolve** | New image dissolves over old | Smooth scene changes |
| **Fade to color** | Fade to black/white then to new | Time passage, mood shift |
| **Cut** | Instant switch | Abrupt changes, shock |
| **Mosaic/Pixelate** | Blocky transition | Comedy, stylized moments |
| **Iris** | Circular wipe | Perspective shifts |

### Character Sprite Positioning
- Center, left-center, right-center, far-left, far-right
- Layering: background -> midground -> characters -> foreground (dialogue box)
- Smooth position transitions (200-400ms ease)

### Settings Menu
- Text speed (slow/medium/fast/instant)
- Auto-play speed
- Sound volume (BGM, SFX, Voice separately)
- Skip mode preferences (skip unread / skip all)
- Font size / text color options

## 4. Game Feel / Interaction

### Keyboard Shortcuts
| Key | Action |
|-----|--------|
| Space / Enter | Advance dialogue |
| Escape | Open menu |
| Ctrl / S | Quick save |
| Tab | Skip mode toggle |
| Shift | Auto-play toggle |
| Q | Quick load |

### Mobile-Friendly Interactions
- Large tap targets (minimum 44px)
- Right-handed reach zones (bottom-right is comfortable)
- Gesture support (swipe to advance)

## 5. Narrative State Management

### Flag/Variable Patterns
- **Boolean flags**: Binary states (met_character, has_key)
- **Counters**: Numeric tracking (courage += 1, trust -= 2)
- **Lists**: Inventory, party members

### Lock Types for Conditional Content
1. **Accumulative**: Multiple scattered choices add up (morality meter)
2. **Convergent**: Multiple specific choices required together
3. **Direct**: Single prerequisite (item, background choice)
4. **Open**: No restrictions

## 6. Tool Recommendations

| Tool | Best For | Key Strength |
|------|----------|-------------|
| **Ren'Py** | Python-based VN engine | Mature, full-featured |
| **Naninovel** | Unity VN framework | C#/Unity integration |
| **Yarn Spinner** | Unity branching dialogue | Simple syntax, flowchart viz |
| **Ink** | Code-focused narrative | Elegant markup |
| **Twine** | Interactive fiction | Browser-based, free |

## Key Takeaways

1. **Dialogue**: Typewriter effect + instant skip is the baseline expectation
2. **Choices**: 2-4 per point, distinguish hubs from committed choices
3. **Saves**: Auto-save at transitions, version your data
4. **Transitions**: Cross-dissolve is safest default; use fades for emotional beats
5. **Mobile**: Consider reach zones, large tap targets
6. **State**: Save flags as individual booleans, track IDs for dynamic content
