'use client';

import { useState } from 'react';

const CarDiagram = ({ diagnosis, onPartClick }) => {
  const [hoveredPart, setHoveredPart] = useState(null);

  // Get part status color
  const getPartColor = (partId) => {
    const part = diagnosis?.parts?.find(p => p.id === partId);
    if (!part || part.status === 'not_checked') return '#3f3f46'; // Default gray
    
    const colors = {
      original: '#10b981', // Green
      painted: '#fbbf24', // Yellow
      replaced: '#3b82f6', // Blue
      damaged: '#ef4444', // Red
    };
    return colors[part.status] || '#3f3f46';
  };

  const getPartOpacity = (partId) => {
    const part = diagnosis?.parts?.find(p => p.id === partId);
    return part?.status === 'not_checked' ? 0.3 : 0.7;
  };

  const handlePartClick = (partId, partName) => {
    onPartClick({ id: partId, name: partName });
  };

  const carParts = [
    { id: 'hood', name: 'Hood (D)', path: 'M 240 140 L 310 140 L 310 200 L 240 200 Z' },
    { id: 'front_bumper', name: 'Front Bumper', path: 'M 220 200 L 330 200 L 330 220 L 220 220 Z' },
    { id: 'left_door', name: 'Left Door (D)', path: 'M 120 160 L 180 160 L 180 250 L 120 250 Z' },
    { id: 'right_door', name: 'Right Door (D)', path: 'M 370 160 L 430 160 L 430 250 L 370 250 Z' },
    { id: 'left_rear_door', name: 'Left Rear Door (B)', path: 'M 430 290 L 480 290 L 480 360 L 430 360 Z' },
    { id: 'right_rear_door', name: 'Right Rear Door (B)', path: 'M 70 290 L 120 290 L 120 360 L 70 360 Z' },
    { id: 'trunk', name: 'Trunk (L)', path: 'M 240 420 L 310 420 L 310 480 L 240 480 Z' },
    { id: 'rear_bumper', name: 'Rear Bumper (L)', path: 'M 220 480 L 330 480 L 330 500 L 220 500 Z' },
    { id: 'left_fender', name: 'Left Fender (P)', path: 'M 90 220 L 140 220 L 140 280 L 90 280 Z' },
    { id: 'right_fender', name: 'Right Fender (P)', path: 'M 410 220 L 460 220 L 460 280 L 410 280 Z' },
  ];

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <svg
        viewBox="0 0 550 600"
        className="w-full h-auto"
        style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))' }}
      >
        {/* Car Body Outline */}
        <g id="car-body">
          {/* Main body */}
          <rect x="200" y="220" width="150" height="180" fill="#27272a" stroke="#52525b" strokeWidth="2" rx="8" />
          
          {/* Hood */}
          <path
            d="M 240 140 Q 275 120 310 140 L 310 200 L 240 200 Z"
            fill={getPartColor('hood')}
            fillOpacity={getPartOpacity('hood')}
            stroke="#52525b"
            strokeWidth="2"
            className="cursor-pointer transition-all duration-200 hover:stroke-white hover:stroke-[3px]"
            onClick={() => handlePartClick('hood', 'Hood (D)')}
            onMouseEnter={() => setHoveredPart('hood')}
            onMouseLeave={() => setHoveredPart(null)}
          />
          <text x="275" y="170" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" pointerEvents="none">D</text>

          {/* Front Bumper */}
          <rect
            x="220"
            y="200"
            width="110"
            height="20"
            rx="4"
            fill={getPartColor('front_bumper')}
            fillOpacity={getPartOpacity('front_bumper')}
            stroke="#52525b"
            strokeWidth="2"
            className="cursor-pointer transition-all duration-200 hover:stroke-white hover:stroke-[3px]"
            onClick={() => handlePartClick('front_bumper', 'Front Bumper')}
            onMouseEnter={() => setHoveredPart('front_bumper')}
            onMouseLeave={() => setHoveredPart(null)}
          />

          {/* Left Side */}
          <g id="left-side">
            {/* Left Front Door */}
            <path
              d="M 120 160 L 180 160 L 180 250 L 120 250 Q 110 230 110 205 Q 110 180 120 160 Z"
              fill={getPartColor('left_door')}
              fillOpacity={getPartOpacity('left_door')}
              stroke="#52525b"
              strokeWidth="2"
              className="cursor-pointer transition-all duration-200 hover:stroke-white hover:stroke-[3px]"
              onClick={() => handlePartClick('left_door', 'Left Front Door (D)')}
              onMouseEnter={() => setHoveredPart('left_door')}
              onMouseLeave={() => setHoveredPart(null)}
            />
            <text x="150" y="210" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" pointerEvents="none">D</text>

            {/* Left Rear Door */}
            <path
              d="M 120 290 L 180 290 L 180 380 L 120 380 Q 110 360 110 335 Q 110 310 120 290 Z"
              fill={getPartColor('left_rear_door')}
              fillOpacity={getPartOpacity('left_rear_door')}
              stroke="#52525b"
              strokeWidth="2"
              className="cursor-pointer transition-all duration-200 hover:stroke-white hover:stroke-[3px]"
              onClick={() => handlePartClick('left_rear_door', 'Left Rear Door (B)')}
              onMouseEnter={() => setHoveredPart('left_rear_door')}
              onMouseLeave={() => setHoveredPart(null)}
            />
            <text x="150" y="340" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" pointerEvents="none">B</text>

            {/* Left Fender */}
            <circle
              cx="150"
              cy="250"
              r="25"
              fill={getPartColor('left_fender')}
              fillOpacity={getPartOpacity('left_fender')}
              stroke="#52525b"
              strokeWidth="2"
              className="cursor-pointer transition-all duration-200 hover:stroke-white hover:stroke-[3px]"
              onClick={() => handlePartClick('left_fender', 'Left Fender (P)')}
              onMouseEnter={() => setHoveredPart('left_fender')}
              onMouseLeave={() => setHoveredPart(null)}
            />
            <text x="150" y="255" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" pointerEvents="none">P</text>
          </g>

          {/* Right Side */}
          <g id="right-side">
            {/* Right Front Door */}
            <path
              d="M 370 160 L 430 160 Q 440 180 440 205 Q 440 230 430 250 L 370 250 Z"
              fill={getPartColor('right_door')}
              fillOpacity={getPartOpacity('right_door')}
              stroke="#52525b"
              strokeWidth="2"
              className="cursor-pointer transition-all duration-200 hover:stroke-white hover:stroke-[3px]"
              onClick={() => handlePartClick('right_door', 'Right Front Door (D)')}
              onMouseEnter={() => setHoveredPart('right_door')}
              onMouseLeave={() => setHoveredPart(null)}
            />
            <text x="400" y="210" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" pointerEvents="none">D</text>

            {/* Right Rear Door */}
            <path
              d="M 370 290 L 430 290 Q 440 310 440 335 Q 440 360 430 380 L 370 380 Z"
              fill={getPartColor('right_rear_door')}
              fillOpacity={getPartOpacity('right_rear_door')}
              stroke="#52525b"
              strokeWidth="2"
              className="cursor-pointer transition-all duration-200 hover:stroke-white hover:stroke-[3px]"
              onClick={() => handlePartClick('right_rear_door', 'Right Rear Door (B)')}
              onMouseEnter={() => setHoveredPart('right_rear_door')}
              onMouseLeave={() => setHoveredPart(null)}
            />
            <text x="400" y="340" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" pointerEvents="none">B</text>

            {/* Right Fender */}
            <circle
              cx="400"
              cy="250"
              r="25"
              fill={getPartColor('right_fender')}
              fillOpacity={getPartOpacity('right_fender')}
              stroke="#52525b"
              strokeWidth="2"
              className="cursor-pointer transition-all duration-200 hover:stroke-white hover:stroke-[3px]"
              onClick={() => handlePartClick('right_fender', 'Right Fender (P)')}
              onMouseEnter={() => setHoveredPart('right_fender')}
              onMouseLeave={() => setHoveredPart(null)}
            />
            <text x="400" y="255" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" pointerEvents="none">P</text>
          </g>

          {/* Trunk */}
          <path
            d="M 240 400 L 310 400 L 310 480 Q 275 500 240 480 Z"
            fill={getPartColor('trunk')}
            fillOpacity={getPartOpacity('trunk')}
            stroke="#52525b"
            strokeWidth="2"
            className="cursor-pointer transition-all duration-200 hover:stroke-white hover:stroke-[3px]"
            onClick={() => handlePartClick('trunk', 'Trunk (L)')}
            onMouseEnter={() => setHoveredPart('trunk')}
            onMouseLeave={() => setHoveredPart(null)}
          />
          <text x="275" y="445" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" pointerEvents="none">L</text>

          {/* Rear Bumper */}
          <rect
            x="220"
            y="480"
            width="110"
            height="20"
            rx="4"
            fill={getPartColor('rear_bumper')}
            fillOpacity={getPartOpacity('rear_bumper')}
            stroke="#52525b"
            strokeWidth="2"
            className="cursor-pointer transition-all duration-200 hover:stroke-white hover:stroke-[3px]"
            onClick={() => handlePartClick('rear_bumper', 'Rear Bumper (L)')}
            onMouseEnter={() => setHoveredPart('rear_bumper')}
            onMouseLeave={() => setHoveredPart(null)}
          />

          {/* Windshield indicators */}
          <rect x="230" y="220" width="90" height="40" fill="#1e293b" fillOpacity="0.5" stroke="#52525b" strokeWidth="1" rx="4" />
          <rect x="230" y="360" width="90" height="40" fill="#1e293b" fillOpacity="0.5" stroke="#52525b" strokeWidth="1" rx="4" />
        </g>

        {/* Hover Label */}
        {hoveredPart && (
          <g>
            <rect x="200" y="50" width="150" height="40" fill="#18181b" stroke="#a855f7" strokeWidth="2" rx="8" />
            <text x="275" y="75" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
              Click to inspect
            </text>
          </g>
        )}
      </svg>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#10b981' }}></div>
          <span className="text-muted">Original</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#fbbf24' }}></div>
          <span className="text-muted">Painted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3b82f6' }}></div>
          <span className="text-muted">Replaced</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ef4444' }}></div>
          <span className="text-muted">Damaged</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-card-border opacity-30"></div>
          <span className="text-muted">Not Checked</span>
        </div>
      </div>
    </div>
  );
};

export default CarDiagram;
