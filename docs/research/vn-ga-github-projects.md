# GitHub Visual Novel & Interactive Fiction Open Source Project Analysis

## Project 1: WebGAL
**GitHub:** https://github.com/OpenWebGAL/WebGAL
**Tech Stack:** TypeScript, Vue 3, PixiJS
**Key Features:**
- Visual editor (WebGAL Terre) - no programming knowledge required
- WebGAL Script syntax with VS Code plugin
- PixiJS integration for custom effects
- Multi-language support (EN, JP, KO, FR, ZH)
- Save/load system, branching narratives
- Demo games available including a Steam title

## Project 2: PixiVN
**GitHub:** https://github.com/DRincs-Productions/pixi-vn
**Tech Stack:** TypeScript, PixiJS, React/Vue compatible
**Key Features:**
- Support for ink-script and Ren'Py syntax
- Modular architecture - use any UI framework
- Save states at every "story step" with backtracking
- Multiple game types: VN, Point & Click, RPG

## Project 3: webTaleKit
**GitHub:** https://github.com/EndoHizumi/webTaleKit
**Tech Stack:** TypeScript, HTML/CSS/JS for UI
**Key Features:**
- Full HTML/CSS/JS for UI customization
- Scene-based markup language
- Auto-scaling responsive design
- Built-in AI REST API integration
- Built-in translation support tool

## Project 4: NovelWrapper
**GitHub:** https://github.com/uteal/novelwrapper
**Tech Stack:** Vanilla JavaScript, CSS, no build tools
**Key Features:**
- Zero-dependency, embeddable
- Scene functions are just async JavaScript functions
- Character emotions via template literals
- Branching with conditional returns

## Project 5: RolePlayer (Chat-Based Narrative)
**GitHub:** https://github.com/azrael92/RolePlayer
**Tech Stack:** React 18, TypeScript, Express, PostgreSQL, OpenAI GPT-4o-mini
**Key Features:**
- AI game master with streaming SSE responses
- `<RP_DIRECTIVE>` tags for mid-chat visual changes
- Scene-driven chat with background images
- Avatar/background auto-assignment by scenario

## Project 6: Tuesday JS
**GitHub:** https://github.com/Kirilllive/tuesday-js
**Tech Stack:** Vanilla JavaScript, zero dependencies
**Key Features:**
- Zero third-party libraries
- Visual script editor with flowchart view
- Built-in translation tool with progress tracking
- Multi-platform deployment (web, desktop, Android)

## Project 7: Exodus Game (AI-Powered)
**GitHub:** https://github.com/aviosipov/exodus-game
**Tech Stack:** Next.js 15, React 19, Tailwind CSS v4
**Key Features:**
- AI-generated interactive visual novel
- Mini-games: Hebrew trivia, resource management
- Optional AI character chat with GPT
- MDX documentation

## Key Patterns Observed

### Dialogue Systems
- Template literal character expressions (NovelWrapper: `.angry`, `.smile` suffix)
- Scene/graph-based flow (WebGAL's branching)
- Choice tree state tracking (Sadako's named choices)
- HTTP-directive tags for live scene changes (RolePlayer's `<RP_DIRECTIVE>`)

### Save Systems
- Story-step snapshots (PixiVN - backtracking support)
- Local storage / JSON export
- AI-generated gameplay reports

### AI Integration
- REST API calls for generative content
- Streaming SSE with directive parsing
- AI character chat with scene directive tags

### UI/UX Patterns
- Visual script flowchart editors
- Character emotion sprites with state-based display
- Multi-language built-in with progress tracking
- Responsive scaling
