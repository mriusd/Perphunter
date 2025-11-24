import React, { useEffect, useRef, useState } from 'react';

export const Chart: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [data, setData] = useState<number[]>([]);

  // Resize observer
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Data generator
  useEffect(() => {
    const initialData = Array(100).fill(0).map((_, i) => 35000 + Math.sin(i/5) * 500 + Math.random() * 100);
    setData(initialData);

    const interval = setInterval(() => {
      setData(prev => {
        const last = prev[prev.length - 1];
        const next = last + (Math.random() * 40 - 20);
        return [...prev.slice(1), next];
      });
    }, 100); // Faster updates for cyberpunk feel
    return () => clearInterval(interval);
  }, []);

  if (dimensions.width === 0) return <div ref={containerRef} className="w-full h-full" />;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;
  const padding = 20;

  // Generate points for SVG polyline
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * (dimensions.width - padding * 2) + padding;
    const y = dimensions.height - ((val - min) / range) * (dimensions.height - padding * 2) - padding;
    return `${x},${y}`;
  }).join(' ');

  // Close the path for the area gradient
  const areaPoints = `${points} ${dimensions.width - padding},${dimensions.height - padding} ${padding},${dimensions.height - padding}`;

  return (
    <div ref={containerRef} className="w-full h-full bg-cosmic-bg/50 relative overflow-hidden">
      {/* Grid Lines */}
      <svg width="100%" height="100%" className="absolute inset-0 opacity-20 pointer-events-none">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1a1a2e" strokeWidth="1"/>
          </pattern>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00f0ff" />
            <stop offset="100%" stopColor="#ff003c" />
          </linearGradient>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <svg width="100%" height="100%" className="relative z-10 filter drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]">
        <polygon points={areaPoints} fill="url(#areaGradient)" />
        <polyline
          points={points}
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        {/* Last price indicator dot */}
        {data.length > 0 && (
            <circle 
                cx={(dimensions.width - padding * 2) + padding} 
                cy={dimensions.height - ((data[data.length - 1] - min) / range) * (dimensions.height - padding * 2) - padding} 
                r="3" 
                fill="#fff"
                className="animate-ping"
            />
        )}
      </svg>

      <div className="absolute top-4 left-4">
        <div className="flex items-baseline gap-2">
            <h2 className="text-2xl font-bold text-white font-mono tracking-tighter">BTC-USD</h2>
            <span className="text-cosmic-cyan font-mono text-xl glow-text">{data[data.length-1]?.toFixed(2)}</span>
        </div>
        <div className="flex gap-4 text-xs font-mono text-cosmic-dim mt-1">
            <span>24H VOL: <span className="text-cosmic-text">1.2B</span></span>
            <span>24H HIGH: <span className="text-cosmic-green">36,400</span></span>
        </div>
      </div>
    </div>
  );
};
