"use client";

import { useEffect, useRef, useState } from 'react';

const PATH_DATA = "M840 0.5C1071.93 0.5 1281.9 20.9811 1433.86 54.0879C1509.85 70.6422 1571.31 90.3479 1613.76 112.213C1634.99 123.146 1651.43 134.606 1662.57 146.462C1673.7 158.315 1679.5 170.533 1679.5 183C1679.5 195.467 1673.7 207.685 1662.57 219.538C1651.43 231.394 1634.99 242.854 1613.76 253.787C1571.31 275.652 1509.85 295.358 1433.86 311.912C1281.9 345.019 1071.93 365.5 840 365.5C608.065 365.5 398.103 345.019 246.137 311.912C170.15 295.358 108.691 275.652 66.2402 253.787C45.0145 242.854 28.5666 231.394 17.4307 219.538C6.29703 207.685 0.5 195.467 0.5 183C0.5 170.533 6.29703 158.315 17.4307 146.462C28.5666 134.606 45.0145 123.146 66.2402 112.213C108.691 90.3479 170.15 70.6422 246.137 54.0879C398.103 20.9811 608.065 0.5 840 0.5Z";
const VIEWBOX_HEIGHT = 366;
const CENTER_Y = VIEWBOX_HEIGHT / 2; // 183
const SNAP_THRESHOLD_ENTER = 80;
const SNAP_THRESHOLD_EXIT = 100;

const SvgCoordinatePicker = () => {
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [isTagging, setIsTagging] = useState(false);
  const [hoverPoint, setHoverPoint] = useState(null);
  const [selectedSide, setSelectedSide] = useState('top');
  const svgRef = useRef(null);
  const pathRef = useRef(null);
  const pathPointsRef = useRef([]);

  // Pre-calculate points along the path for fast lookup
  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const length = path.getTotalLength();
    const points = [];
    const precision = 2; // Every 2px for high accuracy

    for (let i = 0; i <= length; i += precision) {
      const p = path.getPointAtLength(i);
      points.push({ x: p.x, y: p.y, length: i });
    }
    
    // Add the very last point
    const lastP = path.getPointAtLength(length);
    points.push({ x: lastP.x, y: lastP.y, length: length });

    pathPointsRef.current = points;
  }, []);

  const getClosestPointOnPath = (event, svg, path) => {
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;

    // Transform screen coordinates to SVG coordinates
    const ctm = svg.getScreenCTM();
    if (!ctm) return { point: path.getPointAtLength(0), distance: Infinity };
    
    const cursorPoint = point.matrixTransform(ctm.inverse());

    // Use pre-calculated points for coarse search
    const points = pathPointsRef.current;
    if (points.length === 0) return { point: path.getPointAtLength(0), distance: Infinity };

    let minDistance = Infinity;
    let bestLength = 0;
    let found = false;

    // Fast iteration through LUT with filtering
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      
      // Filter based on selected side
      // Center Y is 183. Top is < 183, Bottom is > 183.
      // We give a small buffer (e.g. 1px) to include the exact center line if needed
      if (selectedSide === 'top' && p.y > CENTER_Y) continue;
      if (selectedSide === 'bottom' && p.y < CENTER_Y) continue;

      const dist = (p.x - cursorPoint.x) ** 2 + (p.y - cursorPoint.y) ** 2;
      if (dist < minDistance) {
        minDistance = dist;
        bestLength = p.length;
        found = true;
      }
    }

    // If no point found in the selected half (unlikely unless cursor is extremely far and logic is weird), return infinity
    if (!found) return { point: path.getPointAtLength(0), distance: Infinity };

    // Fine search around the best coarse point
    // Search +/- 2px (precision) range
    const startLen = Math.max(0, bestLength - 2);
    const endLen = Math.min(path.getTotalLength(), bestLength + 2);
    
    let bestPoint = path.getPointAtLength(bestLength);
    
    for (let len = startLen; len <= endLen; len += 0.1) { // High precision 0.1
      const p = path.getPointAtLength(len);
      
      // Apply same filter to fine search to be strictly correct
      if (selectedSide === 'top' && p.y > CENTER_Y + 0.1) continue;
      if (selectedSide === 'bottom' && p.y < CENTER_Y - 0.1) continue;

      const dist = (p.x - cursorPoint.x) ** 2 + (p.y - cursorPoint.y) ** 2;
      if (dist < minDistance) {
        minDistance = dist;
        bestPoint = p;
      }
    }

    return { point: bestPoint, distance: Math.sqrt(minDistance) };
  };

  const handleSvgClick = (event) => {
    const svg = svgRef.current;
    const path = pathRef.current;
    if (!svg || !path) return;

    if (!isTagging) return; // Only allow pinning when in tagging mode

    const { point, distance } = getClosestPointOnPath(event, svg, path);

    // Threshold for clicking (e.g., 80px - approx 40px on screen)
    if (distance > SNAP_THRESHOLD_ENTER) return;

    setSelectedPoint({
      x: point.x,
      y: point.y,
    });
    setIsTagging(false);
    setHoverPoint(null);
  };

  const handleMouseMove = (event) => {
    if (!isTagging) return;
    const svg = svgRef.current;
    const path = pathRef.current;
    if (!svg || !path) return;

    const { point, distance } = getClosestPointOnPath(event, svg, path);
    
    // Hysteresis:
    // If we are currently showing the ghost point (hoverPoint is not null), keep showing it until distance > 100.
    // If we are NOT showing it, only start showing it if distance < 80.
    const currentThreshold = hoverPoint ? SNAP_THRESHOLD_EXIT : SNAP_THRESHOLD_ENTER;

    if (distance > currentThreshold) {
      setHoverPoint(null);
      return;
    }

    setHoverPoint({
      x: point.x,
      y: point.y,
    });
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex items-center gap-4">
        <select
          value={selectedSide}
          onChange={(e) => {
            setSelectedSide(e.target.value);
            setHoverPoint(null); // Reset hover point when switching sides
            setSelectedPoint(null); // Optional: clear selection or keep it? Let's keep it simple.
          }}
          className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="top">Top Half</option>
          <option value="bottom">Bottom Half</option>
        </select>

        <button
          onClick={() => {
            setIsTagging(!isTagging);
            setHoverPoint(null);
          }}
          className={`px-6 py-2 rounded-full font-semibold transition-colors ${
            isTagging
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isTagging ? 'Cancel Tagging' : 'Tag a Point'}
        </button>
      </div>

      <div className="relative border border-gray-200 rounded-lg p-2 bg-white shadow-sm">
        <svg
          ref={svgRef}
          width="800" // Reduced size for better visibility on screen, viewBox handles scaling
          height="174" // Proportional to original 1680x366
          viewBox={`0 0 1680 ${VIEWBOX_HEIGHT}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-auto max-w-4xl ${isTagging && hoverPoint ? 'cursor-none' : 'cursor-default'}`}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverPoint(null)}
          onClick={handleSvgClick}
          role="application"
          aria-label="Coordinate Picker"
        >
          {/* Invisible thicker path for easier clicking */}
          <path
            d={PATH_DATA}
            stroke="transparent"
            strokeWidth="20"
            fill="none"
            className={isTagging && hoverPoint ? 'cursor-none' : 'cursor-default'}
          />
          {/* Visible path */}
          <path
            ref={pathRef}
            d={PATH_DATA}
            stroke="#343434"
            fill="none"
            pointerEvents="none" // Let clicks pass through to the hit area
          />
          
          {/* Hover Point (Ghost) */}
          {isTagging && hoverPoint && (
            <circle
              cx={hoverPoint.x}
              cy={hoverPoint.y}
              r="8"
              fill="rgba(239, 68, 68, 0.9)" // Increased opacity
              stroke="white"
              strokeWidth="2"
              pointerEvents="none"
            />
          )}

          {selectedPoint && (
            <g pointerEvents={isTagging ? "none" : "auto"}>
              <circle
                cx={selectedPoint.x}
                cy={selectedPoint.y}
                r="10"
                fill="#ef4444"
                stroke="white"
                strokeWidth="2"
              />
              <g transform={`translate(${selectedPoint.x}, ${selectedPoint.y - 25})`}>
                <rect
                  x="-70"
                  y="-25"
                  width="140"
                  height="30"
                  rx="15"
                  fill="black"
                  fillOpacity="0.8"
                />
                <text
                  x="0"
                  y="-5"
                  textAnchor="middle"
                  fill="white"
                  fontSize="14"
                  fontWeight="bold"
                  dominantBaseline="middle"
                >
                  {selectedPoint.x.toFixed(0)}, {selectedPoint.y.toFixed(0)}
                </text>
                {/* Little triangle pointer */}
                <path d="M -5 -2 L 0 5 L 5 -2 Z" fill="black" fillOpacity="0.8" />
              </g>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};

export default SvgCoordinatePicker;
