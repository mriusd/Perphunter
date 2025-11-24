import React, { useState } from 'react';
import { ChevronsRight } from 'lucide-react';

export const TradeForm: React.FC = () => {
  const [leverage, setLeverage] = useState(5);
  const [side, setSide] = useState<'long' | 'short'>('long');

  return (
    <div className="flex flex-col h-full p-3 gap-4 font-mono text-sm bg-cosmic-bg/40">
      {/* Side Selector */}
      <div className="flex gap-2 mb-2 p-1 bg-black/40 rounded border border-cosmic-dim/30">
        <button 
          onClick={() => setSide('long')}
          className={`flex-1 py-2 text-center uppercase font-bold transition-all duration-300 skew-x-[-10deg] ${
            side === 'long' 
              ? 'bg-cosmic-green text-black shadow-[0_0_15px_rgba(0,255,157,0.4)]' 
              : 'text-cosmic-green hover:bg-cosmic-green/10'
          }`}
        >
          <span className="skew-x-[10deg] inline-block">LONG</span>
        </button>
        <button 
          onClick={() => setSide('short')}
          className={`flex-1 py-2 text-center uppercase font-bold transition-all duration-300 skew-x-[-10deg] ${
            side === 'short' 
              ? 'bg-cosmic-pink text-black shadow-[0_0_15px_rgba(255,0,60,0.4)]' 
              : 'text-cosmic-pink hover:bg-cosmic-pink/10'
          }`}
        >
          <span className="skew-x-[10deg] inline-block">SHORT</span>
        </button>
      </div>

      <div className="flex flex-col gap-1 group">
        <label className="text-cosmic-dim uppercase text-[10px] tracking-wider font-pixel">Position Size (USD)</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cosmic-cyan">$</span>
          <input 
            type="text" 
            defaultValue="1000" 
            className="cyber-input pl-8 text-lg font-bold" 
          />
          <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-cosmic-cyan group-hover:w-full transition-all duration-500"></div>
        </div>
      </div>

      <div className="flex flex-col gap-1 group">
        <label className="text-cosmic-dim uppercase text-[10px] tracking-wider font-pixel">Entry Price</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cosmic-cyan">@</span>
          <input 
            type="text" 
            placeholder="MARKET" 
            className="cyber-input pl-8" 
          />
          <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-cosmic-cyan group-hover:w-full transition-all duration-500"></div>
        </div>
      </div>

      {/* Leverage Slider */}
      <div className="flex flex-col gap-2 mt-2 p-2 border border-cosmic-dim/30 bg-black/20">
        <div className="flex justify-between text-xs text-cosmic-cyan font-bold uppercase">
          <span>Lev: {leverage}x</span>
          <span className="text-cosmic-dim">Max: 50x</span>
        </div>
        <input 
          type="range" 
          min="1" 
          max="50" 
          value={leverage} 
          onChange={(e) => setLeverage(Number(e.target.value))}
          className="accent-cosmic-cyan h-1 bg-cosmic-dim appearance-none cursor-pointer w-full"
        />
        <div className="flex justify-between text-[8px] text-cosmic-dim font-mono">
            {[1, 10, 20, 30, 40, 50].map(v => <span key={v}>|</span>)}
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-auto pt-2">
        <div className="flex justify-between text-xs mb-1 font-mono">
          <span className="text-cosmic-dim">Margin:</span>
          <span className="text-white">$200.00</span>
        </div>
        <div className="flex justify-between text-xs mb-4 font-mono">
          <span className="text-cosmic-dim">Liq. Price:</span>
          <span className="text-cosmic-pink">31,402.50</span>
        </div>
        
        <button className={`w-full font-bold py-3 uppercase transition-all flex items-center justify-center gap-2 group relative overflow-hidden ${
            side === 'long' 
                ? 'bg-cosmic-green text-black border border-cosmic-green hover:shadow-[0_0_20px_rgba(0,255,157,0.6)]' 
                : 'bg-cosmic-pink text-white border border-cosmic-pink hover:shadow-[0_0_20px_rgba(255,0,60,0.6)]'
        }`}>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative z-10 flex items-center gap-2">
                {side === 'long' ? 'BUY / LONG' : 'SELL / SHORT'} <ChevronsRight className="animate-pulse" size={16} />
            </span>
        </button>
      </div>
    </div>
  );
};
