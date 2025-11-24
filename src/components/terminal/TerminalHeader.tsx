import React, { useEffect, useState } from 'react';
import { Wifi, Radio, Layers, Wallet } from 'lucide-react';
import { useTerminalStore, Exchange } from '../../store/useTerminalStore';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount } from 'wagmi';

export const TerminalHeader: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const { selectedExchange, setExchange } = useTerminalStore();
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-cosmic-card/80 text-cosmic-text p-1 flex justify-between items-center border-b border-cosmic-cyan/30 font-pixel text-sm select-none backdrop-blur-md z-50">
      <div className="flex items-center gap-6 px-4">
        <div className="flex items-center gap-2 text-cosmic-cyan animate-pulse">
          <Radio size={18} />
          <span className="font-bold tracking-widest text-lg text-glow-cyan">PERP_HUNTER</span>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <div className="flex bg-black/40 border border-cosmic-dim/50 rounded p-0.5">
             {(['Hyperliquid', 'Lighter'] as Exchange[]).map((ex) => (
                <button
                  key={ex}
                  onClick={() => setExchange(ex)}
                  className={`px-3 py-0.5 text-xs font-bold uppercase transition-all ${
                    selectedExchange === ex 
                      ? 'bg-cosmic-cyan text-black shadow-[0_0_10px_rgba(0,240,255,0.3)]' 
                      : 'text-cosmic-dim hover:text-cosmic-text hover:bg-cosmic-dim/20'
                  }`}
                >
                  {ex}
                </button>
             ))}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 text-cosmic-dim text-xs border-l border-cosmic-dim/30 pl-4">
          <Layers size={14} />
          <span>NET: {selectedExchange === 'Hyperliquid' ? 'ARB' : 'ETH'}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-6 px-4 font-mono text-xs">
        <button 
            onClick={() => open()} 
            className={`flex items-center gap-2 px-3 py-1 rounded border transition-all ${
                isConnected 
                ? 'bg-cosmic-green/20 border-cosmic-green text-cosmic-green hover:bg-cosmic-green/30' 
                : 'bg-cosmic-pink/20 border-cosmic-pink text-cosmic-pink hover:bg-cosmic-pink/30 animate-pulse'
            }`}
        >
            <Wallet size={14} />
            <span className="font-bold">
                {isConnected 
                    ? `${address?.slice(0, 6)}...${address?.slice(-4)}` 
                    : 'CONNECT WALLET'
                }
            </span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-cosmic-cyan">{time.toISOString().split('T')[1].split('.')[0]} UTC</span>
          <Wifi size={14} className="text-cosmic-cyan animate-pulse" />
        </div>
      </div>
    </header>
  );
};
