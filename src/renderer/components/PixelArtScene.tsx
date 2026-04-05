import React from 'react';

interface PixelArtSceneProps {
  type: 'convenience_store' | 'rainy_outside' | 'park' | 'room';
  timeOfDay?: 'day' | 'night' | 'evening';
}

export const PixelArtScene: React.FC<PixelArtSceneProps> = ({
  type,
  timeOfDay = 'night',
}) => {
  const getSceneContent = () => {
    switch (type) {
      case 'convenience_store':
        return <ConvenienceStoreScene timeOfDay={timeOfDay} />;
      case 'rainy_outside':
        return <RainyOutsideScene />;
      case 'park':
        return <ParkScene timeOfDay={timeOfDay} />;
      case 'room':
        return <RoomScene timeOfDay={timeOfDay} />;
      default:
        return <ConvenienceStoreScene timeOfDay={timeOfDay} />;
    }
  };

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {getSceneContent()}
    </div>
  );
};

const ConvenienceStoreScene: React.FC<{ timeOfDay: 'day' | 'night' | 'evening' }> = ({ timeOfDay }) => {
  const isNight = timeOfDay === 'night' || timeOfDay === 'evening';
  
  return (
    <svg viewBox="0 0 920 540" style={{ width: '100%', height: '100%' }}>
      <defs>
        <pattern id="floorTile" patternUnits="userSpaceOnUse" width="32" height="32">
          <rect width="16" height="16" fill="#8b7355" />
          <rect x="16" y="0" width="16" height="16" fill="#7a6248" />
          <rect x="0" y="16" width="16" height="16" fill="#7a6248" />
          <rect x="16" y="16" width="16" height="16" fill="#8b7355" />
        </pattern>
        <pattern id="wallTile" patternUnits="userSpaceOnUse" width="8" height="8">
          <rect width="8" height="8" fill="#f0e6d3" />
          <rect x="0" y="0" width="1" height="8" fill="#e0d6c3" />
          <rect x="0" y="0" width="8" height="1" fill="#e0d6c3" />
        </pattern>
        <filter id="neonGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <rect x="0" y="0" width="920" height="540" fill={isNight ? '#1a1a2e' : '#87ceeb'} />

      <rect x="0" y="0" width="920" height="300" fill="url(#wallTile)" />
      <rect x="0" y="300" width="920" height="240" fill="url(#floorTile)" />

      <rect x="650" y="80" width="200" height="250" fill="#444" />
      <rect x="660" y="90" width="180" height="230" fill={isNight ? '#336699' : '#87ceeb'} />
      <rect x="660" y="90" width="180" height="230" fill="rgba(255,255,255,0.1)" />
      <line x1="750" y1="90" x2="750" y2="320" stroke="#666" strokeWidth="4" />
      <line x1="660" y1="205" x2="840" y2="205" stroke="#666" strokeWidth="4" />

      <rect x="50" y="150" width="120" height="200" fill="#5588cc" />
      <rect x="55" y="155" width="110" height="190" fill="#6699dd" />
      <rect x="70" y="170" width="80" height="120" fill="#4477bb" />
      <circle cx="140" cy="250" r="6" fill="#ffcc00" />

      <rect x="200" y="120" width="350" height="180" fill="#444" rx="4" />
      <rect x="210" y="130" width="330" height="160" fill="#111" />

      <rect x="220" y="140" width="100" height="70" fill="#ff6b6b" />
      <rect x="330" y="140" width="100" height="70" fill="#4ecdc4" />
      <rect x="220" y="220" width="100" height="60" fill="#ffe66d" />
      <rect x="330" y="220" width="100" height="60" fill="#95e1d3" />

      <text x="270" y="115" fill={isNight ? '#ff0' : '#cc0'} fontSize="12" fontFamily="monospace" filter="url(#neonGlow)">
        24H CONVENIENCE
      </text>

      <rect x="50" y="340" width="140" height="180" fill="#888" />
      <rect x="55" y="345" width="130" height="60" fill="#f0f0f0" />
      <rect x="55" y="410" width="130" height="100" fill="#e0e0e0" />
      <rect x="70" y="355" width="100" height="40" fill="#333" />

      <rect x="250" y="320" width="120" height="200" fill="#999" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x="255" y={330 + i * 38} width="110" height="32" fill="#ddd" />
      ))}
      <rect x="265" y="335" width="40" height="22" fill="#ff6b6b" />
      <rect x="310" y="335" width="40" height="22" fill="#4ecdc4" />
      <rect x="265" y="373" width="40" height="22" fill="#ffe66d" />
      <rect x="310" y="373" width="40" height="22" fill="#95e1d3" />

      <rect x="420" y="320" width="100" height="200" fill="#777" />
      {[0, 1, 2, 3].map((i) => (
        <React.Fragment key={i}>
          <rect x="425" y={330 + i * 48} width="90" height="42" fill="#fff" />
          <rect x="430" y={335 + i * 48} width="80" height="32" fill="#f5f5f5" />
        </React.Fragment>
      ))}

      <rect x="550" y="350" width="70" height="120" fill="#666" />
      <rect x="555" y="355" width="60" height="110" fill="#888" />
      <rect x="560" y="360" width="50" height="40" fill="#333" />
      <rect x="560" y="410" width="50" height="30" fill="#555" />

      {isNight && (
        <rect x="0" y="0" width="920" height="540" fill="rgba(0,0,30,0.3)" />
      )}
    </svg>
  );
};

const RainyOutsideScene: React.FC = () => {
  return (
    <svg viewBox="0 0 920 540" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="nightSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0a0a1a" />
          <stop offset="100%" stopColor="#1a1a3a" />
        </linearGradient>
        <filter id="streetLightGlow">
          <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <rect x="0" y="0" width="920" height="540" fill="url(#nightSky)" />

      {[...Array(30)].map((_, i) => (
        <circle
          key={i}
          cx={50 + Math.random() * 820}
          cy={30 + Math.random() * 120}
          r={1 + Math.random()}
          fill="#fff"
          opacity={0.3 + Math.random() * 0.7}
        />
      ))}

      <rect x="0" y="200" width="200" height="200" fill="#2a2a4a" />
      <rect x="20" y="220" width="40" height="40" fill="#4a4a6a" />
      <rect x="80" y="220" width="40" height="40" fill="#4a4a6a" />
      <rect x="140" y="220" width="40" height="40" fill="#4a4a6a" />
      <rect x="20" y="280" width="40" height="40" fill="#ffcc66" opacity="0.6" />
      <rect x="80" y="280" width="40" height="40" fill="#4a4a6a" />
      <rect x="140" y="280" width="40" height="40" fill="#ffcc66" opacity="0.4" />

      <rect x="250" y="150" width="150" height="250" fill="#333355" />
      <rect x="270" y="170" width="50" height="50" fill="#555577" />
      <rect x="330" y="170" width="50" height="50" fill="#555577" />
      <rect x="270" y="240" width="50" height="50" fill="#ffcc66" opacity="0.5" />
      <rect x="330" y="240" width="50" height="50" fill="#ffcc66" opacity="0.7" />
      <rect x="270" y="310" width="50" height="50" fill="#555577" />
      <rect x="330" y="310" width="50" height="50" fill="#555577" />

      <rect x="450" y="180" width="180" height="220" fill="#2a2a4a" />
      {[0, 1, 2].map((row) => (
        [0, 1, 2, 3].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={465 + col * 42}
            y={200 + row * 60}
            width={30}
            height={45}
            fill={Math.random() > 0.5 ? '#ffcc66' : '#4a4a6a'}
            opacity={Math.random() > 0.5 ? 0.6 : 1}
          />
        ))
      ))}

      <rect x="680" y="220" width="200" height="180" fill="#333355" />
      <rect x="700" y="240" width="60" height="50" fill="#ffcc66" opacity="0.5" />
      <rect x="780" y="240" width="60" height="50" fill="#555577" />
      <rect x="700" y="310" width="60" height="50" fill="#555577" />
      <rect x="780" y="310" width="60" height="50" fill="#ffcc66" opacity="0.4" />

      <rect x="0" y="400" width="920" height="140" fill="#2a2a2a" />
      <rect x="0" y="430" width="920" height="4" fill="#ffcc00" opacity="0.6" />
      <rect x="0" y="470" width="920" height="4" fill="#ffcc00" opacity="0.6" />

      <rect x="150" y="250" width="16" height="150" fill="#444" />
      <rect x="142" y="230" width="32" height="20" fill="#555" />
      <ellipse cx="158" cy="240" rx="60" ry="40" fill="#ffcc66" opacity="0.2" filter="url(#streetLightGlow)" />

      <rect x="550" y="250" width="16" height="150" fill="#444" />
      <rect x="542" y="230" width="32" height="20" fill="#555" />
      <ellipse cx="558" cy="240" rx="60" ry="40" fill="#ffcc66" opacity="0.2" filter="url(#streetLightGlow)" />

      {[...Array(60)].map((_, i) => (
        <line
          key={i}
          x1={Math.random() * 920}
          y1={Math.random() * 540}
          x2={Math.random() * 920 - 20}
          y2={Math.random() * 540 + 30}
          stroke="#88aacc"
          strokeWidth="1"
          opacity={0.3 + Math.random() * 0.4}
        />
      ))}

      <rect x="0" y="0" width="920" height="540" fill="rgba(20,40,60,0.4)" />
    </svg>
  );
};

const ParkScene: React.FC<{ timeOfDay: 'day' | 'night' | 'evening' }> = ({ timeOfDay }) => {
  const isNight = timeOfDay === 'night' || timeOfDay === 'evening';
  
  return (
    <svg viewBox="0 0 920 540" style={{ width: '100%', height: '100%' }}>
      <rect x="0" y="0" width="920" height="350" fill={isNight ? '#1a1a3a' : '#87ceeb'} />
      
      {isNight && [...Array(20)].map((_, i) => (
        <circle
          key={i}
          cx={30 + Math.random() * 860}
          cy={20 + Math.random() * 150}
          r={1 + Math.random() * 2}
          fill="#fff"
          opacity={0.4 + Math.random() * 0.6}
        />
      ))}

      {!isNight && (
        <circle cx="800" cy="80" r="40" fill="#ffcc00" />
      )}
      {isNight && (
        <circle cx="800" cy="80" r="35" fill="#f0f0e0" />
      )}

      <ellipse cx="460" cy="380" rx="500" ry="100" fill={isNight ? '#1a3a1a' : '#4a7c4a'} />
      <ellipse cx="460" cy="420" rx="520" ry="120" fill={isNight ? '#143014' : '#3d6b3d'} />

      {[100, 200, 350, 550, 700, 800].map((x, i) => (
        <g key={i}>
          <rect x={x - 15} y="200" width="30" height="180" fill={isNight ? '#3d2817' : '#5d3817'} />
          <ellipse cx={x} cy="150" rx="60" ry="80" fill={isNight ? '#1a4a2a' : '#3a7a4a'} />
          <ellipse cx={x - 30} cy="170" rx="40" ry="50" fill={isNight ? '#1a4a2a' : '#4a8a5a'} />
          <ellipse cx={x + 30} cy="165" rx="45" ry="55" fill={isNight ? '#1a4a2a' : '#4a8a5a'} />
        </g>
      ))}

      <rect x="150" y="420" width="620" height="20" fill={isNight ? '#5a4a3a' : '#8a7a5a'} />

      <rect x="300" y="360" width="320" height="15" fill={isNight ? '#4a3a2a' : '#7a6a4a'} />
      <ellipse cx="300" cy="367" rx="15" ry="8" fill={isNight ? '#4a3a2a' : '#7a6a4a'} />
      <ellipse cx="620" cy="367" rx="15" ry="8" fill={isNight ? '#4a3a2a' : '#7a6a4a'} />

      <rect x="410" y="350" width="100" height="100" fill={isNight ? '#6a5a4a' : '#9a8a6a'} />
      <rect x="430" y="360" width="60" height="45" fill={isNight ? '#4a3a2a' : '#7a6a4a'} />
      <rect x="440" y="320" width="40" height="30" fill={isNight ? '#5a4a3a' : '#8a7a5a'} />
      <rect x="435" y="300" width="50" height="20" fill={isNight ? '#4a3a2a' : '#7a6a4a'} />

      {[250, 380, 540, 670].map((x, i) => (
        <g key={i}>
          <rect x={x - 3} y="440" width="6" height="40" fill={isNight ? '#2a4a2a' : '#4a7a4a'} />
          <circle cx={x} cy="430" r="12" fill={i % 2 === 0 ? '#ff6b6b' : '#ffcc00'} />
          {[...Array(6)].map((_, j) => (
            <ellipse
              key={j}
              cx={x + Math.cos(j * Math.PI / 3) * 15}
              cy={430 + Math.sin(j * Math.PI / 3) * 15}
              rx="8"
              ry="5"
              fill={i % 2 === 0 ? '#ff8888' : '#ffdd66'}
            />
          ))}
        </g>
      ))}

      {isNight && (
        <rect x="0" y="0" width="920" height="540" fill="rgba(0,0,30,0.4)" />
      )}
    </svg>
  );
};

const RoomScene: React.FC<{ timeOfDay: 'day' | 'night' | 'evening' }> = ({ timeOfDay }) => {
  const isNight = timeOfDay === 'night' || timeOfDay === 'evening';
  
  return (
    <svg viewBox="0 0 920 540" style={{ width: '100%', height: '100%' }}>
      <defs>
        <pattern id="wallpaper" patternUnits="userSpaceOnUse" width="64" height="64">
          <rect width="64" height="64" fill={isNight ? '#3a3a5a' : '#e8d8c8'} />
          <rect x="0" y="0" width="32" height="32" fill={isNight ? '#353555' : '#e0d0c0'} opacity="0.5" />
          <rect x="32" y="32" width="32" height="32" fill={isNight ? '#353555' : '#e0d0c0'} opacity="0.5" />
        </pattern>
        <pattern id="woodFloor" patternUnits="userSpaceOnUse" width="32" height="16">
          <rect width="32" height="16" fill={isNight ? '#4a3a2a' : '#8b6914'} />
          <line x1="0" y1="8" x2="32" y2="8" stroke={isNight ? '#3a2a1a' : '#7a5a14'} strokeWidth="1" />
        </pattern>
      </defs>

      <rect x="0" y="0" width="920" height="540" fill="url(#wallpaper)" />

      <rect x="0" y="350" width="920" height="190" fill="url(#woodFloor)" />

      <rect x="100" y="100" width="150" height="180" fill="#333" />
      <rect x="108" y="108" width="134" height="164" fill={isNight ? '#1a1a3a' : '#87ceeb'} />
      <rect x="108" y="108" width="134" height="164" fill="rgba(255,255,255,0.1)" />
      <line x1="175" y1="108" x2="175" y2="272" stroke="#555" strokeWidth="6" />
      <line x1="108" y1="190" x2="242" y2="190" stroke="#555" strokeWidth="6" />
      <rect x="95" y="90" width="160" height="20" fill={isNight ? '#4a3a2a' : '#6a4a2a'} />
      <rect x="95" y="280" width="160" height="20" fill={isNight ? '#4a3a2a' : '#6a4a2a'} />
      <rect x="90" y="90" width="10" height="210" fill={isNight ? '#4a3a2a' : '#6a4a2a'} />
      <rect x="250" y="90" width="10" height="210" fill={isNight ? '#4a3a2a' : '#6a4a2a'} />

      <rect x="650" y="60" width="100" height="290" fill={isNight ? '#3a2a1a' : '#5a3a1a'} />
      <rect x="655" y="65" width="90" height="280" fill={isNight ? '#4a3a2a' : '#6a4a2a'} />
      <rect x="670" y="80" width="60" height="120" fill={isNight ? '#2a2a4a' : '#4a4a6a'} />
      <circle cx="730" cy="220" r="8" fill={isNight ? '#887733' : '#ccaa44'} />
      <rect x="655" y="65" width="5" height="280" fill={isNight ? '#2a1a0a' : '#4a2a0a'} />

      <rect x="350" y="280" width="220" height="70" fill={isNight ? '#4a3a2a' : '#8a6a3a'} />
      <rect x="355" y="285" width="210" height="15" fill={isNight ? '#5a4a3a' : '#9a7a4a'} />
      <rect x="370" y="350" width="15" height="40" fill={isNight ? '#3a2a1a' : '#6a4a2a'} />
      <rect x="535" y="350" width="15" height="40" fill={isNight ? '#3a2a1a' : '#6a4a2a'} />

      <rect x="380" y="255" width="60" height="25" fill={isNight ? '#5a5a7a' : '#d0d0e0'} />
      <rect x="460" y="260" width="40" height="20" fill={isNight ? '#3a3a3a' : '#4a4a4a'} />
      <rect x="465" y="265" width="10" height="10" fill="#4ecdc4" />
      <rect x="480" y="265" width="10" height="10" fill="#ff6b6b" />

      <rect x="750" y="250" width="120" height="100" fill={isNight ? '#3a2a1a' : '#6a4a2a'} />
      <rect x="755" y="255" width="110" height="90" fill={isNight ? '#4a3a2a' : '#7a5a3a'} />
      <rect x="760" y="260" width="100" height="40" fill={isNight ? '#2a2a3a' : '#f0f0f0'} />
      <rect x="765" y="310" width="90" height="30" fill={isNight ? '#2a2a3a' : '#f0f0f0'} />
      <rect x="765" y="310" width="30" height="30" fill={isNight ? '#3a3a4a' : '#e0e0e0'} />
      <rect x="800" y="310" width="25" height="30" fill={isNight ? '#3a3a4a' : '#e0e0e0'} />
      <rect x="830" y="310" width="20" height="30" fill={isNight ? '#3a3a4a' : '#e0e0e0'} />

      <rect x="150" y="300" width="40" height="50" fill={isNight ? '#5a4a3a' : '#8a6a4a'} />
      <ellipse cx="170" cy="300" rx="30" ry="15" fill={isNight ? '#5a4a3a' : '#8a6a4a'} />
      <rect x="165" y="260" width="10" height="40" fill={isNight ? '#4a3a2a' : '#6a4a2a'} />
      <ellipse cx="170" cy="255" rx="25" ry="20" fill={isNight ? '#ffcc66' : '#ffe088'} opacity="0.8" />
      {isNight && (
        <ellipse cx="170" cy="250" rx="60" ry="40" fill="#ffcc66" opacity="0.15" />
      )}

      <rect x="300" y="310" width="15" height="80" fill={isNight ? '#4a4a6a' : '#8a8aaa'} />
      <ellipse cx="307" cy="305" rx="12" ry="8" fill={isNight ? '#4a4a6a' : '#8a8aaa'} />
      <ellipse cx="310" cy="280" rx="25" ry="30" fill={isNight ? '#3a3a5a' : '#e0e0f0'} />
      <rect x="290" y="275" width="40" height="15" fill={isNight ? '#2a2a4a' : '#c0c0e0'} />

      {isNight && (
        <rect x="0" y="0" width="920" height="540" fill="rgba(0,0,30,0.35)" />
      )}
    </svg>
  );
};
