import React from 'react';

/**
 * Fritz Haber Visual Novel - Pixel Art Scene Components
 *
 * Color Palette:
 * - Primary:    Prussian Blue   #193b6a / #1a3a5c / #0d2137
 * - Secondary:  Bitter Almond   #8B4513 / #6B3E26
 * - Accent:     Dark Red/Blood  #8B0000 / #660000
 * - Background: Near Black      #0a0a0f / #111111
 * - Highlight:  Pale Blue       #a8c0d8 / #c0d8e8
 */

export type HaberSceneType =
  | 'auschwitz_cell'
  | 'karlsruhe_lab'
  | 'ypres_battlefield'
  | 'berlin_garden_night'
  | 'nuremberg_cell'
  | 'cambridge_room'
  | 'berlin_philharmonic';

interface HaberStorySceneProps {
  type: HaberSceneType;
}

// ─── Palette helpers ───────────────────────────────────────────────
const C = {
  prussian1: '#193b6a',
  prussian2: '#1a3a5c',
  prussian3: '#0d2137',
  almond1:   '#8B4513',
  almond2:   '#6B3E26',
  blood1:    '#8B0000',
  blood2:    '#660000',
  black1:    '#0a0a0f',
  black2:    '#111111',
  pale1:     '#a8c0d8',
  pale2:     '#c0d8e8',
  // derived
  prussianMid: '#163359',
  wallDark:    '#1a2a3a',
  wallMid:     '#243444',
  wallLight:   '#2e3e52',
  brick1:      '#1e3040',
  brick2:      '#162838',
  brick3:      '#243448',
  mortar:      '#0f1e2e',
  // gas colours
  gasGreen1:  '#4a7a3a',
  gasGreen2:  '#3a6a2a',
  gasYellow:  '#7a9a4a',
  // moonlight
  moonGlow:   '#c0d8e8',
  moonHalo:   '#8ab0c8',
} as const;

// ─── Master component ──────────────────────────────────────────────
export const HaberStoryScenes: React.FC<HaberStorySceneProps> = ({ type }) => {
  const getSceneContent = () => {
    switch (type) {
      case 'auschwitz_cell':      return <AuschwitzCellScene />;
      case 'karlsruhe_lab':       return <ChemistryLabScene />;
      case 'ypres_battlefield':   return <YpresBattlefieldScene />;
      case 'berlin_garden_night': return <BerlinGardenNightScene />;
      case 'nuremberg_cell':       return <NurembergCellScene />;
      case 'cambridge_room':       return <BerlinConcertHallScene />;
      case 'berlin_philharmonic': return <BerlinConcertHallScene />;
      default:                    return <AuschwitzCellScene />;
    }
  };

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {getSceneContent()}
    </div>
  );
};

// ─── Scene 1: Auschwitz Cell ───────────────────────────────────────
const AuschwitzCellScene: React.FC = () => {
  const brickRow = (y: number, offset: number) => (
    <>
      {/* render ~15 bricks per row */}
      {[...Array(15)].map((_, i) => (
        <rect
          key={`b${y}-${i}`}
          x={offset + i * 60}
          y={y}
          width={56}
          height={22}
          fill={i % 3 === 0 ? C.brick1 : i % 3 === 1 ? C.brick2 : C.brick3}
          opacity={0.85 + (i % 4) * 0.03}
        />
      ))}
    </>
  );

  const mortarLine = (y: number) => (
    <rect x={0} y={y} width={920} height={4} fill={C.mortar} />
  );

  return (
    <svg viewBox="0 0 920 540" style={{ width: '100%', height: '100%', imageRendering: 'pixelated' }}>
      <defs>
        <filter id="auschwitzVignette">
          <feGaussianBlur stdDeviation="60" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <radialGradient id="cellLight" cx="50%" cy="20%" r="60%">
          <stop offset="0%" stopColor={C.prussian2} stopOpacity="0.4" />
          <stop offset="100%" stopColor={C.black1} stopOpacity="1" />
        </radialGradient>
        <pattern id="prussianMark" patternUnits="userSpaceOnUse" width="8" height="8">
          <rect width="8" height="8" fill="transparent" />
          <rect x="2" y="2" width="4" height="4" fill={C.prussian1} opacity="0.15" />
        </pattern>
      </defs>

      {/* Background */}
      <rect x={0} y={0} width={920} height={540} fill={C.black1} />

      {/* Brick wall - 10 rows */}
      {brickRow(0,   0)}
      {mortarLine(22)}
      {brickRow(26,  30)}
      {mortarLine(48)}
      {brickRow(52,  0)}
      {mortarLine(74)}
      {brickRow(78,  30)}
      {mortarLine(100)}
      {brickRow(104, 0)}
      {mortarLine(126)}
      {brickRow(130, 30)}
      {mortarLine(152)}
      {brickRow(156, 0)}
      {mortarLine(178)}
      {brickRow(182, 30)}
      {mortarLine(204)}
      {brickRow(208, 0)}
      {mortarLine(230)}
      {brickRow(234, 30)}
      {mortarLine(256)}
      {brickRow(260, 0)}
      {mortarLine(282)}
      {brickRow(286, 30)}
      {mortarLine(308)}
      {brickRow(312, 0)}
      {mortarLine(334)}
      {brickRow(338, 30)}
      {mortarLine(360)}
      {brickRow(364, 0)}
      {mortarLine(386)}
      {brickRow(390, 30)}
      {mortarLine(412)}
      {brickRow(416, 0)}
      {mortarLine(438)}
      {brickRow(442, 30)}
      {mortarLine(464)}
      {brickRow(468, 0)}

      {/* Prussian Blue marks - subtle stains */}
      {[80, 200, 340, 480].map((x, i) => (
        <ellipse key={`mark${i}`} cx={x} cy={150 + i * 90} rx={20 + i * 5} ry={12 + i * 3}
          fill={C.prussian2} opacity={0.12 + i * 0.02} />
      ))}

      {/* Prussian mark overlay texture */}
      <rect x={0} y={0} width={920} height={540} fill="url(#prussianMark)" />

      {/* Small high window with faint light */}
      <rect x={380} y={60} width={160} height={8} fill={C.prussian3} />
      <rect x={380} y={60} width={160} height={8} fill="#a8c0d8" opacity="0.06" />
      <rect x={388} y={68} width={144} height={6} fill={C.prussian3} />
      <rect x={388} y={68} width={144} height={6} fill="#a8c0d8" opacity="0.04" />
      {/* window bars */}
      {[0,1,2,3,4,5].map(i => (
        <rect key={`wb${i}`} x={388 + i * 24} y={60} width={4} height={540} fill={C.prussian3} opacity={0.6} />
      ))}

      {/* Floor */}
      <rect x={0} y={490} width={920} height={50} fill={C.mortar} />
      {[...Array(20)].map((_, i) => (
        <rect key={`fl${i}`} x={i * 48} y={490} width={44} height={50}
          fill={i % 2 === 0 ? C.brick2 : C.mortar} opacity={0.5} />
      ))}

      {/* Cold light from window */}
      <rect x={0} y={0} width={920} height={540} fill="url(#cellLight)" />

      {/* Heavy vignette */}
      <rect x={0} y={0} width={920} height={540} fill={C.black1} opacity="0.7" />

      {/* Bottom shadow */}
      <rect x={0} y={450} width={920} height={90} fill={C.black1} opacity="0.8" />
    </svg>
  );
};

// ─── Scene 2: Chemistry Lab 1907 ───────────────────────────────────
const ChemistryLabScene: React.FC = () => {
  return (
    <svg viewBox="0 0 920 540" style={{ width: '100%', height: '100%', imageRendering: 'pixelated' }}>
      <defs>
        <linearGradient id="labBg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={C.prussian3} />
          <stop offset="100%" stopColor={C.black1} />
        </linearGradient>
        <linearGradient id="blueLiquid" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a4a7a" />
          <stop offset="100%" stopColor={C.prussian1} />
        </linearGradient>
        <radialGradient id="lampGlow" cx="50%" cy="30%" r="50%">
          <stop offset="0%" stopColor="#ffcc66" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffcc66" stopOpacity="0" />
        </radialGradient>
        <filter id="labGlow">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Background */}
      <rect x={0} y={0} width={920} height={540} fill="url(#labBg)" />

      {/* Warm lamp glow from above */}
      <ellipse cx={460} cy={80} rx={300} ry={200} fill="url(#lampGlow)" />

      {/* Back wall / shelves */}
      <rect x={0} y={0} width={920} height={200} fill={C.prussian3} opacity="0.6" />
      {/* shelf planks */}
      {[60, 120, 180].map(y => (
        <rect key={`shelf${y}`} x={0} y={y} width={920} height={8} fill={C.wallMid} />
      ))}

      {/* Chemical bottles on shelves */}
      {/* Row 1 */}
      {[
        {x:60,  h:50, color:'#1a4a6a'},
        {x:130, h:65, color:'#1a3a5a'},
        {x:200, h:45, color:'#1a5a4a'},
        {x:270, h:70, color:'#1a3a6a'},
        {x:340, h:55, color:'#1a4a5a'},
        {x:580, h:60, color:'#1a3a5a'},
        {x:650, h:48, color:'#1a5a6a'},
        {x:720, h:65, color:'#1a4a4a'},
        {x:790, h:52, color:'#1a3a5a'},
      ].map((b, i) => (
        <g key={`bottle1-${i}`}>
          <rect x={b.x} y={120 - b.h} width={24} height={b.h} fill={b.color} opacity="0.8" />
          <rect x={b.x + 8} y={120 - b.h - 10} width={8} height={12} fill={C.wallLight} />
          <rect x={b.x} y={120 - b.h} width={24} height={4} fill="#a8c0d8" opacity="0.15" />
        </g>
      ))}

      {/* Row 2 */}
      {[
        {x:80,  h:45, color:'#1a3a5a'},
        {x:160, h:60, color:'#1a4a6a'},
        {x:240, h:50, color:'#1a3a4a'},
        {x:600, h:55, color:'#1a5a5a'},
        {x:680, h:42, color:'#1a3a6a'},
        {x:760, h:58, color:'#1a4a5a'},
      ].map((b, i) => (
        <g key={`bottle2-${i}`}>
          <rect x={b.x} y={180 - b.h} width={22} height={b.h} fill={b.color} opacity="0.8" />
          <rect x={b.x + 7} y={180 - b.h - 8} width={8} height={10} fill={C.wallLight} />
          <rect x={b.x} y={180 - b.h} width={22} height={3} fill="#a8c0d8" opacity="0.15" />
        </g>
      ))}

      {/* Large glass flask with blue liquid - center */}
      <g>
        {/* flask body */}
        <ellipse cx={460} cy={420} rx={80} ry={40} fill={C.prussian1} opacity="0.7" />
        <rect x={420} y={300} width={80} height={120} fill={C.prussian2} opacity="0.6" />
        {/* liquid */}
        <ellipse cx={460} cy={420} rx={72} ry={34} fill="url(#blueLiquid)" opacity="0.85" />
        {/* neck */}
        <rect x={444} y={260} width={32} height={50} fill={C.prussian2} opacity="0.6" />
        <rect x={444} y={260} width={32} height={6} fill={C.prussian3} opacity="0.5" />
        {/* flask highlight */}
        <rect x={432} y={320} width={8} height={80} fill="#a8c0d8" opacity="0.08" />
        {/* bubbling */}
        {[0,1,2].map(i => (
          <circle key={`bub${i}`} cx={440 + i * 15} cy={400 - i * 8} r={3 - i * 0.5}
            fill="#a8c0d8" opacity={0.3 - i * 0.08} />
        ))}
      </g>

      {/* Round bottom flask - left */}
      <g>
        <circle cx={180} cy={400} r={55} fill={C.prussian1} opacity="0.65" />
        <circle cx={180} cy={400} r={48} fill="url(#blueLiquid)" opacity="0.8" />
        <rect x={168} y={320} width={24} height={50} fill={C.prussian2} opacity="0.6" />
        <rect x={168} y={320} width={24} height={5} fill={C.prussian3} opacity="0.5" />
        <rect x={155} y={370} width={6} height={40} fill={C.prussian3} opacity="0.4" />
      </g>

      {/* Erlenmeyer flask - right */}
      <g>
        <polygon points="700,300 740,300 760,420 680,420" fill={C.prussian2} opacity="0.65" />
        <polygon points="704,305 736,305 754,415 686,415" fill="url(#blueLiquid)" opacity="0.8" />
        <rect x={700} y={280} width={40} height={24} fill={C.prussian2} opacity="0.6" />
        <rect x={700} y={280} width={40} height={5} fill={C.prussian3} opacity="0.5" />
      </g>

      {/* Lab bench */}
      <rect x={0} y={440} width={920} height={100} fill={C.wallDark} />
      <rect x={0} y={436} width={920} height={10} fill={C.wallMid} />

      {/* Bench items - dark silhouettes */}
      <rect x={60}  y={400} width={40} height={40} fill={C.prussian3} opacity="0.7" />
      <rect x={110} y={408} width={20} height={32} fill={C.prussian3} opacity="0.6" />
      <rect x={750} y={395} width={50} height={45} fill={C.prussian3} opacity="0.7" />
      <rect x={810} y={405} width={25} height={35} fill={C.prussian3} opacity="0.6" />

      {/* Gas tube / pipe on wall */}
      <rect x={0} y={240} width={920} height={6} fill={C.wallMid} />
      {[100, 300, 500, 700].map(x => (
        <rect key={`pipe${x}`} x={x} y={236} width={8} height={20} fill={C.wallLight} opacity="0.6" />
      ))}

      {/* Lamp above center flask */}
      <rect x={440} y={40}  width={40} height={8}  fill={C.wallMid} />
      <rect x={446} y={48}  width={28} height={20} fill="#ffcc66" opacity="0.7" />
      <rect x={444} y={68}  width={32} height={4}  fill={C.wallLight} opacity="0.4" />
      <ellipse cx={460} cy={90} rx={100} ry={60} fill="#ffcc66" opacity="0.06" />

      {/* Overall warm-blue contrast overlay */}
      <rect x={0} y={0} width={920} height={540} fill={C.black1} opacity="0.3" />

      {/* Scanlines */}
      <rect x={0} y={0} width={920} height={540}
        style={{ background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)' }} />
    </svg>
  );
};

// ─── Scene 3: Ypres Battlefield ────────────────────────────────────
const YpresBattlefieldScene: React.FC = () => {
  // Gas cloud using layered ellipses
  const gasLayers = [
    { cx: 200, cy: 280, rx: 250, ry: 80,  color: '#4a7a3a', opacity: 0.45 },
    { cx: 460, cy: 260, rx: 300, ry: 100, color: '#3a6a2a', opacity: 0.40 },
    { cx: 700, cy: 290, rx: 280, ry: 85,  color: '#5a8a4a', opacity: 0.38 },
    { cx: 350, cy: 240, rx: 200, ry: 70,  color: '#4a7a3a', opacity: 0.30 },
    { cx: 600, cy: 250, rx: 220, ry: 65,  color: '#6a9a5a', opacity: 0.28 },
    { cx: 100, cy: 310, rx: 180, ry: 55,  color: '#3a6a2a', opacity: 0.35 },
    { cx: 800, cy: 320, rx: 200, ry: 60,  color: '#4a8a3a', opacity: 0.32 },
  ];

  return (
    <svg viewBox="0 0 920 540" style={{ width: '100%', height: '100%', imageRendering: 'pixelated' }}>
      <defs>
        <linearGradient id="ypresSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a2a1a" />
          <stop offset="60%" stopColor="#2a3a2a" />
          <stop offset="100%" stopColor="#1a2a1a" />
        </linearGradient>
        <filter id="gasBlur">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <filter id="ypresGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Sky - toxic yellowish green tint */}
      <rect x={0} y={0} width={920} height={540} fill="url(#ypresSky)" />
      <rect x={0} y={0} width={920} height={540} fill="#3a5a2a" opacity="0.3" />

      {/* Distant explosions / flashes */}
      {[80, 320, 600, 820].map((x, i) => (
        <ellipse key={`flash${i}`} cx={x} cy={80 + i * 20} rx={30 + i * 10} ry={15}
          fill="#7a9a4a" opacity={0.08 + i * 0.02} />
      ))}

      {/* Gas clouds - layered behind trenches */}
      {gasLayers.map((g, i) => (
        <ellipse key={`gas${i}`} cx={g.cx} cy={g.cy} rx={g.rx} ry={g.ry}
          fill={g.color} opacity={g.opacity} filter="url(#gasBlur)" />
      ))}

      {/* Gas wisps - foreground */}
      {[...Array(30)].map((_, i) => (
        <ellipse key={`wisp${i}`}
          cx={Math.random() * 920}
          cy={200 + Math.random() * 200}
          rx={40 + Math.random() * 60}
          ry={15 + Math.random() * 25}
          fill="#4a7a3a"
          opacity={0.15 + Math.random() * 0.2}
          filter="url(#gasBlur)"
        />
      ))}

      {/* Ground / mud */}
      <rect x={0} y={400} width={920} height={140} fill="#1a1a0a" />
      <rect x={0} y={400} width={920} height={140} fill="#2a2a1a" opacity="0.5" />

      {/* Mud texture */}
      {[...Array(40)].map((_, i) => (
        <rect key={`mud${i}`}
          x={Math.random() * 920}
          y={410 + Math.random() * 120}
          width={20 + Math.random() * 40}
          height={4 + Math.random() * 8}
          fill="#2a3a1a"
          opacity={0.3 + Math.random() * 0.4}
        />
      ))}

      {/* Trenches - multiple layers */}
      {/* Back trench line */}
      <rect x={0} y={360} width={920} height={60} fill="#1a1a0a" />
      <rect x={0} y={355} width={920} height={12} fill="#2a2a1a" />
      <rect x={0} y={350} width={920} height={8}  fill="#1a1a0a" />

      {/* Sandbags - back trench */}
      {[...Array(30)].map((_, i) => (
        <ellipse key={`sb1-${i}`}
          cx={i * 32 + 10}
          cy={350}
          rx={14} ry={8}
          fill="#3a3a2a"
          opacity={0.7 + (i % 3) * 0.1}
        />
      ))}

      {/* Middle trench */}
      <rect x={0} y={420} width={920} height={80} fill="#111108" />
      <rect x={0} y={415} width={920} height={12} fill="#222218" />
      <rect x={0} y={410} width={920} height={8}  fill="#111108" />

      {/* Sandbags - front trench */}
      {[...Array(35)].map((_, i) => (
        <ellipse key={`sb2-${i}`}
          cx={i * 27 + 8}
          cy={412}
          rx={12} ry={7}
          fill="#3a3a28"
          opacity={0.8}
        />
      ))}

      {/* Trench silhouette - soldier figure far back */}
      <rect x={400} y={310} width={8}  height={50} fill="#0a0a05" opacity="0.8" />
      <rect x={392} y={300} width={24} height={16} fill="#0a0a05" opacity="0.8" />
      <rect x={388} y={318} width={10} height={20} fill="#0a0a05" opacity="0.8" />
      <rect x={412} y={318} width={10} height={20} fill="#0a0a05" opacity="0.8" />
      {/* gas mask shape */}
      <ellipse cx={404} cy={302} rx={8} ry={10} fill="#1a1a0a" opacity="0.9" />

      {/* Barbed wire */}
      {[200, 350, 550, 750].map((x, i) => (
        <g key={`wire${i}`}>
          <rect x={x} y={340} width={80} height={4} fill="#2a2a1a" />
          {[0,1,2,3,4,5].map(j => (
            <rect key={`w${j}`} x={x + j * 14} y={334} width={2} height={16} fill="#3a3a2a" opacity="0.8" />
          ))}
        </g>
      ))}

      {/* Dead trees - silhouettes */}
      {[
        {x:80,  h:120},
        {x:200, h:80},
        {x:700, h:100},
        {x:850, h:70},
      ].map((t, i) => (
        <g key={`tree${i}`}>
          <rect x={t.x} y={400 - t.h} width={8} height={t.h} fill="#0a0a05" opacity="0.7" />
          {[0,1,2,3].map(j => (
            <rect key={`br${j}`}
              x={t.x - 20 + j * 12}
              y={400 - t.h + 20 + j * 20}
              width={24}
              height={4}
              fill="#0a0a05"
              opacity={0.5 - j * 0.1}
            />
          ))}
        </g>
      ))}

      {/* Green toxic overlay */}
      <rect x={0} y={0} width={920} height={540} fill="#3a5a2a" opacity="0.12" />

      {/* Heavy vignette */}
      <rect x={0} y={0} width={920} height={540} fill={C.black1} opacity="0.65" />
    </svg>
  );
};

// ─── Scene 4: Berlin Garden Night ──────────────────────────────────
const BerlinGardenNightScene: React.FC = () => {
  return (
    <svg viewBox="0 0 920 540" style={{ width: '100%', height: '100%', imageRendering: 'pixelated' }}>
      <defs>
        <radialGradient id="moonHalo" cx="80%" cy="15%" r="40%">
          <stop offset="0%" stopColor={C.moonGlow} stopOpacity="0.3" />
          <stop offset="100%" stopColor={C.moonGlow} stopOpacity="0" />
        </radialGradient>
        <filter id="moonGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Night sky */}
      <rect x={0} y={0} width={920} height={540} fill={C.black1} />

      {/* Stars */}
      {[...Array(50)].map((_, i) => (
        <rect key={`star${i}`}
          x={20 + (i * 37) % 880}
          y={10 + (i * 23) % 200}
          width={2} height={2}
          fill={i % 4 === 0 ? C.pale2 : C.pale1}
          opacity={0.3 + (i % 5) * 0.12}
        />
      ))}

      {/* Moon */}
      <circle cx={780} cy={80} r={45} fill={C.moonGlow} opacity="0.12" />
      <circle cx={780} cy={80} r={32} fill={C.moonHalo} opacity="0.2" />
      <circle cx={780} cy={80} r={28} fill={C.pale2} opacity="0.25" />
      <circle cx={780} cy={80} r={20} fill="#d8e8f0" opacity="0.2" filter="url(#moonGlow)" />

      {/* Moonlight shaft */}
      <polygon points="600,0 900,0 1100,540 500,540" fill={C.moonGlow} opacity="0.02" />

      {/* Garden bed - dark earth */}
      <ellipse cx={460} cy={500} rx={500} ry={80} fill="#1a1208" />
      <rect x={0} y={460} width={920} height={80} fill="#1a1208" />

      {/* Grass patches */}
      {[...Array(60)].map((_, i) => (
        <rect key={`grass${i}`}
          x={Math.random() * 920}
          y={455 + Math.random() * 30}
          width={3 + Math.random() * 5}
          height={8 + Math.random() * 12}
          fill="#1a3a1a"
          opacity={0.6 + Math.random() * 0.3}
        />
      ))}

      {/* Rose bushes */}
      {[
        {x:100, y:440}, {x:250, y:450}, {x:400, y:435},
        {x:600, y:445}, {x:750, y:438}, {x:880, y:450},
      ].map((r, i) => (
        <g key={`rose${i}`}>
          {/* stems */}
          {[0,1,2,3].map(j => (
            <rect key={`s${j}`}
              x={r.x - 6 + j * 4}
              y={r.y - 30 - j * 8}
              width={2}
              height={30 + j * 8}
              fill="#2a3a1a"
              opacity={0.7}
            />
          ))}
          {/* rose blooms */}
          {[
            {bx:r.x - 10, by:r.y - 35, color:'#8B0000'},
            {bx:r.x + 2,  by:r.y - 42, color:'#660000'},
            {bx:r.x - 4, by:r.y - 30, color:'#8B0000'},
          ].map((b, j) => (
            <circle key={`b${j}`} cx={b.bx} cy={b.by} r={6 + j} fill={b.color} opacity={0.7 + j * 0.1} />
          ))}
          {/* rose leaves */}
          {[-8, 6].map(lx => (
            <ellipse key={`l${lx}`} cx={r.x + lx} cy={r.y - 20} rx={8} ry={4}
              fill="#2a4a2a" opacity={0.6} transform={`rotate(${lx > 0 ? 30 : -30}, ${r.x + lx}, ${r.y - 20})`} />
          ))}
        </g>
      ))}

      {/* Iron garden bench - silhouette */}
      <rect x={350} y={450} width={220} height={6} fill="#2a2a2a" />
      <rect x={360} y={456} width={8} height={30} fill="#1a1a1a" />
      <rect x={552} y={456} width={8} height={30} fill="#1a1a1a" />
      <rect x={360} y={438} width={8} height={20} fill="#1a1a1a" />
      <rect x={552} y={438} width={8} height={20} fill="#1a1a1a" />
      <rect x={358} y={432} width={214} height={6} fill="#2a2a2a" />

      {/* THE GUN - on the ground near bench */}
      {/* Barrel */}
      <rect x={440} y={478} width={60} height={8} fill="#3a3a3a" />
      {/* Grip */}
      <rect x={435} y={478} width={14} height={20} fill="#2a2a2a" />
      <rect x={437} y={480} width={10} height={16} fill="#3a3a3a" />
      {/* Trigger guard */}
      <rect x={448} y={486} width={12} height={4} fill="#2a2a2a" rx={2} />
      {/* Barrel detail */}
      <rect x={490} y={480} width={10} height={4} fill="#4a4a4a" />
      {/* Gun on its side */}
      <rect x={440} y={480} width={60} height={6} fill="#4a4a4a" opacity="0.9" />

      {/* Blood pool near gun */}
      <ellipse cx={470} cy={492} rx={20} ry={6} fill={C.blood2} opacity="0.6" />
      <ellipse cx={470} cy={492} rx={14} ry={4} fill={C.blood1} opacity="0.4" />

      {/* Path / walkway */}
      <ellipse cx={460} cy={520} rx={300} ry={40} fill="#1a1a18" />
      {[...Array(20)].map((_, i) => (
        <rect key={`stone${i}`}
          x={160 + i * 32}
          y={510 + (i % 3) * 8}
          width={24} height={8}
          fill="#2a2a28"
          opacity={0.5}
        />
      ))}

      {/* Dark tree in background */}
      <rect x={40} y={200} width={16} height={280} fill="#0a0a08" />
      {[0,1,2,3,4,5].map(j => (
        <rect key={`bbt${j}`}
          x={40 - 40 + j * 18}
          y={200 + j * 35}
          width={96}
          height={10}
          fill="#0a0a08"
          opacity={0.6 - j * 0.08}
        />
      ))}

      {/* Night overlay */}
      <rect x={0} y={0} width={920} height={540} fill={C.prussian3} opacity="0.4" />

      {/* Cold moonlight overlay */}
      <rect x={0} y={0} width={920} height={540} fill={C.moonGlow} opacity="0.04" />

      {/* Vignette */}
      <rect x={0} y={0} width={920} height={540} fill={C.black1} opacity="0.55" />
    </svg>
  );
};

// ─── Scene 5: Nuremberg Cell ────────────────────────────────────────
const NurembergCellScene: React.FC = () => {
  return (
    <svg viewBox="0 0 920 540" style={{ width: '100%', height: '100%', imageRendering: 'pixelated' }}>
      <defs>
        <linearGradient id="nurBg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={C.wallDark} />
          <stop offset="100%" stopColor={C.black2} />
        </linearGradient>
        <radialGradient id="nurWindowLight" cx="50%" cy="0%" r="80%">
          <stop offset="0%" stopColor={C.pale1} stopOpacity="0.12" />
          <stop offset="100%" stopColor={C.pale1} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background wall */}
      <rect x={0} y={0} width={920} height={540} fill="url(#nurBg)" />

      {/* Brick texture on wall */}
      {[...Array(20)].map((_, i) => (
        <rect key={`nbrick${i}`}
          x={(i % 5) * 184}
          y={Math.floor(i / 5) * 60}
          width={180} height={56}
          fill={i % 2 === 0 ? C.wallDark : C.prussian3}
          opacity={0.3}
        />
      ))}

      {/* Window with light */}
      <rect x={360} y={40} width={200} height={10} fill={C.wallMid} />
      <rect x={360} y={50} width={200} height={140} fill={C.pale1} opacity="0.08" />
      <rect x={360} y={50} width={200} height={140} fill="url(#nurWindowLight)" />
      {/* Window frame */}
      <rect x={356} y={40} width={208} height={8}   fill={C.wallLight} />
      <rect x={356} y={186} width={208} height={8}  fill={C.wallLight} />
      <rect x={356} y={40}  width={8}   height={154} fill={C.wallLight} />
      <rect x={556} y={40}  width={8}   height={154} fill={C.wallLight} />
      {/* Window bars */}
      {[0,1,2,3].map(i => (
        <rect key={`nwb${i}`} x={360 + 50 + i * 50} y={50} width={4} height={136}
          fill={C.wallMid} opacity="0.8" />
      ))}

      {/* Light shaft from window */}
      <polygon points="360,194 560,194 700,540 220,540"
        fill={C.pale1} opacity="0.03" />

      {/* IRON BARS - foreground */}
      {[0,1,2,3,4,5,6,7].map(i => (
        <rect key={`bar${i}`} x={180 + i * 80} y={0} width={10} height={540}
          fill="#2a2a3a" opacity="0.85" />
      ))}

      {/* Bar shadows on wall */}
      {[0,1,2,3,4,5,6,7].map(i => (
        <rect key={`bshadow${i}`} x={185 + i * 80} y={0} width={30} height={540}
          fill={C.black1} opacity="0.2" />
      ))}

      {/* Prison cot / bed - silhouette */}
      <rect x={80}  y={420} width={200} height={10} fill="#1a1a2a" />
      <rect x={80}  y={430} width={10}  height={60} fill="#1a1a2a" />
      <rect x={270} y={430} width={10}  height={60} fill="#1a1a2a" />
      <rect x={80}  y={400} width={200} height={20} fill="#1e1e2e" />
      {/* thin blanket */}
      <rect x={80} y={400} width={200} height={8} fill="#2a2a3a" opacity="0.7" />

      {/* Toilet - corner */}
      <rect x={750} y={430} width={80} height={20} fill="#1a1a2a" />
      <rect x={750} y={450} width={80} height={40} fill="#1a1a2a" />
      <rect x={750} y={430} width={10}  height={60} fill="#151520" />

      {/* Small table */}
      <rect x={500} y={440} width={80} height={6} fill="#1e1e2e" />
      <rect x={505} y={446} width={6}  height={50} fill="#1a1a28" />
      <rect x={570} y={446} width={6}  height={50} fill="#1a1a28" />

      {/* NAIL POLISH BOTTLE - red accent on table */}
      {/* tiny red rectangle - hint of vanity, humanity */}
      <rect x={530} y={432} width={8}  height={14} fill={C.blood1} opacity="0.8" />
      <rect x={530} y={429} width={8}  height={5}  fill={C.blood2} opacity="0.9" />
      {/* The red glow on the table */}
      <ellipse cx={534} cy={446} rx={10} ry={4} fill={C.blood1} opacity="0.15" />

      {/* Scratched tally marks on wall */}
      {[...Array(8)].map((_, i) => (
        <rect key={`tally${i}`}
          x={620 + (i % 4) * 6}
          y={280 + Math.floor(i / 4) * 12}
          width={3} height={10}
          fill={C.pale1}
          opacity={0.12 + (i % 3) * 0.04}
        />
      ))}

      {/* Floor */}
      <rect x={0} y={490} width={920} height={50} fill={C.black2} />
      {[...Array(15)].map((_, i) => (
        <rect key={`nfloor${i}`} x={i * 64} y={490} width={60} height={50}
          fill={i % 2 === 0 ? C.black2 : C.wallDark} opacity={0.5} />
      ))}

      {/* Blue-gray cold atmosphere */}
      <rect x={0} y={0} width={920} height={540} fill={C.prussian2} opacity="0.2" />

      {/* Heavy vignette - claustrophobic */}
      <rect x={0} y={0} width={920} height={540} fill={C.black1} opacity="0.7" />
      {/* Bright center from window */}
      <rect x={200} y={0} width={520} height={540} fill={C.black1} opacity="0.3" />
    </svg>
  );
};

// ─── Scene 6: Berlin Concert Hall ────────────────────────────────────
const BerlinConcertHallScene: React.FC = () => {
  return (
    <svg viewBox="0 0 920 540" style={{ width: '100%', height: '100%', imageRendering: 'pixelated' }}>
      <defs>
        <linearGradient id="hallBg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={C.prussian3} />
          <stop offset="100%" stopColor={C.black1} />
        </linearGradient>
        <radialGradient id="stageSpot" cx="50%" cy="20%" r="50%">
          <stop offset="0%" stopColor="#d8c888" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#d8c888" stopOpacity="0" />
        </radialGradient>
        <filter id="stageGlow">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Hall background */}
      <rect x={0} y={0} width={920} height={540} fill="url(#hallBg)" />

      {/* Balcony / upper tier */}
      <rect x={0} y={0} width={920} height={80} fill={C.prussian3} />
      <rect x={0} y={76} width={920} height={12} fill={C.wallMid} />
      {/* Balcony underside */}
      <rect x={0} y={76} width={920} height={40} fill={C.black2} />

      {/* Pillars */}
      {[
        {x:120}, {x:280}, {x:460}, {x:640}, {x:800},
      ].map((p, i) => (
        <rect key={`pillar${i}`} x={p.x} y={0} width={20} height={540} fill={C.prussian2} opacity="0.6" />
      ))}

      {/* Stage area */}
      <rect x={0} y={100} width={920} height={160} fill={C.black2} />
      <rect x={0} y={100} width={920} height={160} fill="url(#stageSpot)" />
      {/* Stage floor */}
      <rect x={0} y={230} width={920} height={30} fill="#3a3020" />

      {/* Stage spotlight glow */}
      <ellipse cx={460} cy={150} rx={200} ry={100} fill="#d8c888" opacity="0.08" filter="url(#stageGlow)" />

      {/* Orchestra musicians silhouettes */}
      {[
        {x:140, y:180}, {x:180, y:175}, {x:220, y:182}, {x:260, y:176},
        {x:300, y:180}, {x:340, y:174}, {x:380, y:181}, {x:420, y:177},
        {x:500, y:176}, {x:540, y:180}, {x:580, y:175}, {x:620, y:181},
        {x:660, y:177}, {x:700, y:179}, {x:740, y:176},
      ].map((m, i) => (
        <g key={`mus${i}`}>
          <rect x={m.x} y={m.y} width={10} height={30} fill="#1a1a1a" opacity="0.9" />
          <rect x={m.x - 2} y={m.y - 8} width={14} height={10} fill="#1a1a1a" opacity="0.9" />
          {/* instrument */}
          {i % 3 === 0 && <rect x={m.x + 3} y={m.y - 30} width={4} height={24} fill="#2a2a2a" opacity="0.7" />}
          {i % 3 === 1 && <rect x={m.x - 4} y={m.y - 20} width={18} height={4} fill="#2a2a2a" opacity="0.7" />}
          {i % 3 === 2 && <rect x={m.x + 2} y={m.y - 25} width={6} height={20} fill="#2a2a2a" opacity="0.7" />}
        </g>
      ))}

      {/* Conductor silhouette */}
      <rect x={448} y={155} width={12} height={40} fill="#1a1a1a" opacity="0.95" />
      <rect x={443} y={145} width={22} height={14} fill="#1a1a1a" opacity="0.95" />
      <rect x={455} y={100} width={6} height={50} fill="#2a2a2a" opacity="0.8" />

      {/* AUDIENCE - rows of young faces */}
      {/* Row 1 - closest */}
      {[...Array(18)].map((_, i) => (
        <g key={`face1-${i}`}>
          <rect
            x={20 + i * 50}
            y={330 + (i % 2) * 8}
            width={20} height={24}
            fill={i % 4 === 0 ? C.pale1 : i % 4 === 1 ? C.pale2 : '#c8d8e0'}
            opacity={0.55 - (i % 3) * 0.1}
          />
          {/* dark hair */}
          <rect
            x={20 + i * 50}
            y={326 + (i % 2) * 8}
            width={20} height={8}
            fill="#2a2a3a"
            opacity={0.5 - (i % 4) * 0.08}
          />
          {/* eyes */}
          <rect x={25 + i * 50} y={336 + (i % 2) * 8} width={4} height={4}
            fill={C.black1} opacity={0.6} />
          <rect x={31 + i * 50} y={336 + (i % 2) * 8} width={4} height={4}
            fill={C.black1} opacity={0.6} />
        </g>
      ))}

      {/* Row 2 */}
      {[...Array(20)].map((_, i) => (
        <rect key={`face2-${i}`}
          x={10 + i * 46}
          y={380 + (i % 3) * 6}
          width={18} height={22}
          fill={i % 3 === 0 ? C.pale1 : i % 3 === 1 ? C.pale2 : '#b8c8d0'}
          opacity={0.45 - (i % 4) * 0.08}
        />
      ))}

      {/* Row 3 - most distant, smallest */}
      {[...Array(24)].map((_, i) => (
        <rect key={`face3-${i}`}
          x={5 + i * 38}
          y={420 + (i % 4) * 5}
          width={14} height={18}
          fill={i % 2 === 0 ? C.pale1 : C.pale2}
          opacity={0.35 - (i % 5) * 0.05}
        />
      ))}

      {/* BASKETS - small collections baskets near some faces */}
      {[
        {x:100, y:355}, {x:300, y:362}, {x:500, y:358}, {x:700, y:354},
        {x:200, y:408}, {x:450, y:412}, {x:650, y:405},
      ].map((b, i) => (
        <g key={`basket${i}`}>
          {/* basket body */}
          <rect x={b.x} y={b.y} width={16} height={10} fill={C.almond2} opacity="0.7" />
          <rect x={b.x + 2} y={b.y + 2} width={12} height={2} fill={C.almond1} opacity="0.5" />
          {/* coins glimpsing */}
          <rect x={b.x + 4} y={b.y + 4} width={4} height={4}
            fill={C.pale1} opacity={0.2 + i * 0.05} />
        </g>
      ))}

      {/* Ceiling arches */}
      <polygon points="0,0 460,60 920,0" fill={C.prussian3} opacity="0.4" />
      <polygon points="0,0 460,40 920,0" fill={C.black1} opacity="0.3" />

      {/* Chandelier */}
      <rect x={450} y={80} width={20} height={10} fill={C.wallMid} />
      {[0,1,2,3,4].map(i => (
        <rect key={`ch${i}`} x={400 + i * 24} y={88} width={16} height={4}
          fill={C.pale1} opacity={0.08 + i * 0.02} />
      ))}

      {/* Tense atmosphere - cold blue overlay */}
      <rect x={0} y={0} width={920} height={540} fill={C.prussian2} opacity="0.25" />

      {/* Vignette */}
      <rect x={0} y={0} width={920} height={540} fill={C.black1} opacity="0.5" />
    </svg>
  );
};

// ─── Scene 7: Escape Road 1934 ─────────────────────────────────────
const EscapeRoadScene: React.FC = () => {
  return (
    <svg viewBox="0 0 920 540" style={{ width: '100%', height: '100%', imageRendering: 'pixelated' }}>
      <defs>
        <linearGradient id="roadSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0a0a12" />
          <stop offset="100%" stopColor={C.prussian3} />
        </linearGradient>
        <radialGradient id="headlight" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffeeaa" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#ffeeaa" stopOpacity="0" />
        </radialGradient>
        <filter id="roadBlur">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>

      {/* Sky */}
      <rect x={0} y={0} width={920} height={540} fill="url(#roadSky)" />

      {/* Stars - very sparse, cold */}
      {[...Array(20)].map((_, i) => (
        <rect key={`rstar${i}`}
          x={30 + (i * 53) % 860}
          y={10 + (i * 31) % 120}
          width={2} height={2}
          fill={C.pale1}
          opacity={0.15 + (i % 4) * 0.08}
        />
      ))}

      {/* Dark treeline - both sides */}
      {/* Left trees */}
      {[0,1,2,3,4,5,6,7].map(i => (
        <rect key={`ltree${i}`}
          x={-20 + i * 30}
          y={80 + i * 20}
          width={80}
          height={280 + i * 30}
          fill="#050508"
          opacity={0.8}
        />
      ))}
      {/* Right trees */}
      {[0,1,2,3,4,5,6,7].map(i => (
        <rect key={`rtree${i}`}
          x={860 - i * 30}
          y={80 + i * 20}
          width={80}
          height={280 + i * 30}
          fill="#050508"
          opacity={0.8}
        />
      ))}

      {/* Ground on sides */}
      <rect x={0} y={380} width={920} height={160} fill="#08080a" />
      <rect x={0} y={380} width={920} height={160} fill={C.prussian3} opacity="0.3" />

      {/* Road */}
      <rect x={200} y={0} width={520} height={540} fill="#111115" />
      {/* Road edges */}
      <rect x={200} y={0} width={8} height={540} fill="#1a1a20" />
      <rect x={712} y={0} width={8} height={540} fill="#1a1a20" />

      {/* Center line - dashed */}
      {[...Array(20)].map((_, i) => (
        <rect key={`dline${i}`}
          x={452} y={i * 30}
          width={16} height={18}
          fill="#2a2a30"
          opacity={0.5}
        />
      ))}

      {/* Road texture */}
      {[...Array(30)].map((_, i) => (
        <rect key={`rtex${i}`}
          x={220 + Math.random() * 480}
          y={Math.random() * 540}
          width={10 + Math.random() * 20}
          height={2}
          fill="#1a1a20"
          opacity={0.2 + Math.random() * 0.2}
        />
      ))}

      {/* CAR SILHOUETTE - center of road, slightly left */}
      {/* Car body */}
      <rect x={340} y={310} width={200} height={70} fill="#0a0a0e" opacity="0.95" />
      {/* Roof */}
      <rect x={370} y={280} width={140} height={35} fill="#0a0a0e" opacity="0.95" />
      {/* Windows - very dark */}
      <rect x={375} y={285} width={55} height={28} fill="#050508" opacity="0.9" />
      <rect x={450} y={285} width={55} height={28} fill="#050508" opacity="0.9" />
      {/* Wheels */}
      <circle cx={380} cy={380} r={28} fill="#0a0a0e" />
      <circle cx={380} cy={380} r={18} fill="#08080c" />
      <circle cx={500} cy={380} r={28} fill="#0a0a0e" />
      <circle cx={500} cy={380} r={18} fill="#08080c" />
      {/* Headlights - faint glow */}
      <ellipse cx={530} cy={340} rx={60} ry={40} fill="url(#headlight)" />
      <rect x={534} y={330} width={8} height={16} fill="#ffeeaa" opacity="0.15" />
      {/* Tail lights - very faint red */}
      <rect x={340} y={335} width={6} height={12} fill={C.blood2} opacity="0.2" />
      {/* Exhaust smoke */}
      {[...Array(8)].map((_, i) => (
        <ellipse key={`smoke${i}`}
          cx={330 - i * 15}
          cy={370 - i * 3}
          rx={10 + i * 4}
          ry={6 + i * 2}
          fill="#2a2a2a"
          opacity={0.1 - i * 0.01}
        />
      ))}

      {/* Headlight beams on road */}
      <polygon points="540,380 920,200 920,540"
        fill={C.moonGlow} opacity="0.02" />

      {/* Isolated feeling - no other cars, empty road stretching ahead */}
      {/* Distant road vanishing point */}
      <rect x={420} y={0} width={80} height={200} fill="#0a0a10" />

      {/* Dark mountains in far background */}
      <polygon points="0,200 150,80 300,150 450,60 600,130 750,50 920,140 920,200"
        fill="#08080c" opacity="0.8" />
      <polygon points="0,200 200,120 400,160 600,100 800,150 920,180 920,200"
        fill="#060608" opacity="0.6" />

      {/* Night atmosphere */}
      <rect x={0} y={0} width={920} height={540} fill={C.prussian2} opacity="0.35" />

      {/* Heavy vignette - isolated, end of journey */}
      <rect x={0} y={0} width={920} height={540} fill={C.black1} opacity="0.75" />
      {/* Slight bright center where car is */}
      <rect x={200} y={200} width={520} height={200} fill={C.black1} opacity="0.3" />
    </svg>
  );
};

export default HaberStoryScenes;
