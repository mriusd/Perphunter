import React, { useState, useMemo } from 'react';
import { ChevronDown, TrendingUp, Activity, DollarSign, BarChart2, Percent, Search, Star, ArrowUp, ArrowDown } from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';
import { useTerminalStore } from '../../store/useTerminalStore';

type SortKey = 'symbol' | 'price' | 'change24h' | 'volume24h';
type SortDirection = 'asc' | 'desc';

export const MarketStats: React.FC = () => {
  const { selectedExchange, selectedMarket, setMarket, markets, favorites, toggleFavorite } = useTerminalStore();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('volume24h');
  const [sortDir, setSortDir] = useState<SortDirection>('desc');

  const availableMarkets = markets[selectedExchange];

  const formatCompact = (val: number) => {
    return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(val);
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const filteredMarkets = useMemo(() => {
    let result = [...availableMarkets];

    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(m => m.symbol.toLowerCase().includes(lowerSearch));
    }

    result.sort((a, b) => {
      let valA = a[sortKey];
      let valB = b[sortKey];

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    // Prioritize favorites at the top
    result.sort((a, b) => {
      const favA = favorites.includes(a.symbol);
      const favB = favorites.includes(b.symbol);
      if (favA && !favB) return -1;
      if (!favA && favB) return 1;
      return 0;
    });

    return result;
  }, [availableMarkets, search, sortKey, sortDir, favorites]);

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-black/40 border-b border-cosmic-dim/30 font-mono text-sm">
      {/* Market Selector Popover */}
      <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
        <Popover.Trigger asChild>
          <button className="flex items-center gap-2 group cursor-pointer outline-none">
             <div className="flex flex-col items-start">
                <span className="text-[10px] text-cosmic-dim uppercase tracking-wider font-pixel">Market Pair</span>
                <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-white group-hover:text-cosmic-cyan transition-colors tracking-tighter">
                        {selectedMarket.symbol}
                    </span>
                    <ChevronDown size={16} className="text-cosmic-dim group-hover:text-cosmic-cyan transition-colors" />
                </div>
             </div>
          </button>
        </Popover.Trigger>

        <Popover.Portal>
            <Popover.Content 
                align="start" 
                sideOffset={5}
                className="w-[400px] max-h-[500px] flex flex-col rounded-md border border-cosmic-cyan/30 bg-cosmic-card shadow-[0_0_30px_rgba(0,240,255,0.2)] focus:outline-none z-50 animate-fade-in overflow-hidden"
            >
                {/* Search Header */}
                <div className="p-3 border-b border-cosmic-dim/30 bg-black/20">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cosmic-dim" />
                        <input 
                            type="text" 
                            placeholder="Search markets..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-black/40 border border-cosmic-dim text-cosmic-text pl-9 pr-3 py-1.5 text-xs focus:border-cosmic-cyan focus:outline-none focus:ring-1 focus:ring-cosmic-cyan/50 transition-all"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Sort Headers */}
                <div className="grid grid-cols-[24px_1fr_1fr_1fr_1fr] text-[10px] text-cosmic-dim uppercase px-2 py-1.5 bg-cosmic-dim/10 font-bold tracking-wider select-none">
                    <span></span>
                    <div className="cursor-pointer hover:text-white flex items-center gap-1" onClick={() => handleSort('symbol')}>
                        Asset {sortKey === 'symbol' && (sortDir === 'asc' ? <ArrowUp size={10}/> : <ArrowDown size={10}/>)}
                    </div>
                    <div className="text-right cursor-pointer hover:text-white flex items-center justify-end gap-1" onClick={() => handleSort('price')}>
                        Price {sortKey === 'price' && (sortDir === 'asc' ? <ArrowUp size={10}/> : <ArrowDown size={10}/>)}
                    </div>
                    <div className="text-right cursor-pointer hover:text-white flex items-center justify-end gap-1" onClick={() => handleSort('change24h')}>
                        24h {sortKey === 'change24h' && (sortDir === 'asc' ? <ArrowUp size={10}/> : <ArrowDown size={10}/>)}
                    </div>
                    <div className="text-right cursor-pointer hover:text-white flex items-center justify-end gap-1" onClick={() => handleSort('volume24h')}>
                        Vol {sortKey === 'volume24h' && (sortDir === 'asc' ? <ArrowUp size={10}/> : <ArrowDown size={10}/>)}
                    </div>
                </div>

                {/* Market List */}
                <div className="flex-1 overflow-y-auto scrollbar-thin p-1">
                    {filteredMarkets.map((market) => {
                        const isFav = favorites.includes(market.symbol);
                        return (
                            <div
                                key={market.symbol}
                                className={`grid grid-cols-[24px_1fr_1fr_1fr_1fr] items-center p-1.5 rounded transition-colors text-xs font-mono cursor-pointer group ${
                                    selectedMarket.symbol === market.symbol 
                                        ? 'bg-cosmic-cyan/10 text-cosmic-cyan' 
                                        : 'hover:bg-cosmic-dim/20 text-cosmic-text'
                                }`}
                                onClick={() => {
                                    setMarket(market);
                                    setIsOpen(false);
                                }}
                            >
                                <button 
                                    className={`hover:scale-110 transition-transform ${isFav ? 'text-cosmic-gold' : 'text-cosmic-dim hover:text-cosmic-gold'}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFavorite(market.symbol);
                                    }}
                                >
                                    <Star size={12} fill={isFav ? "currentColor" : "none"} />
                                </button>
                                <span className="font-bold text-left">{market.symbol}</span>
                                <span className="text-right text-white">{market.price.toLocaleString()}</span>
                                <span className={`text-right ${market.change24h >= 0 ? 'text-cosmic-green' : 'text-cosmic-pink'}`}>
                                    {market.change24h > 0 ? '+' : ''}{market.change24h.toFixed(1)}%
                                </span>
                                <span className="text-right text-cosmic-dim">{formatCompact(market.volume24h)}</span>
                            </div>
                        );
                    })}
                    {filteredMarkets.length === 0 && (
                        <div className="p-4 text-center text-cosmic-dim text-xs italic">
                            No markets found
                        </div>
                    )}
                </div>
            </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      {/* Stats Grid */}
      <div className="flex items-center gap-8 ml-8 flex-1 overflow-x-auto scrollbar-hide">
         <div className="flex flex-col">
            <span className="text-[10px] text-cosmic-dim uppercase flex items-center gap-1">
                <DollarSign size={10} /> Price
            </span>
            <span className="text-lg font-bold text-cosmic-cyan glow-text">
                {selectedMarket.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
         </div>

         <div className="flex flex-col">
            <span className="text-[10px] text-cosmic-dim uppercase flex items-center gap-1">
                <TrendingUp size={10} /> 24h Chg
            </span>
            <span className={`text-lg font-bold ${selectedMarket.change24h >= 0 ? 'text-cosmic-green' : 'text-cosmic-pink'}`}>
                {selectedMarket.change24h > 0 ? '+' : ''}{selectedMarket.change24h.toFixed(2)}%
            </span>
         </div>

         <div className="flex flex-col">
            <span className="text-[10px] text-cosmic-dim uppercase flex items-center gap-1">
                <BarChart2 size={10} /> 24h Vol
            </span>
            <span className="text-lg font-bold text-white">
                {formatCompact(selectedMarket.volume24h)}
            </span>
         </div>

         <div className="flex flex-col">
            <span className="text-[10px] text-cosmic-dim uppercase flex items-center gap-1">
                <Activity size={10} /> Open Int
            </span>
            <span className="text-lg font-bold text-white">
                {formatCompact(selectedMarket.openInterest)}
            </span>
         </div>

         <div className="flex flex-col">
            <span className="text-[10px] text-cosmic-dim uppercase flex items-center gap-1">
                <Percent size={10} /> Funding
            </span>
            <span className={`text-lg font-bold ${selectedMarket.fundingRate >= 0 ? 'text-cosmic-gold' : 'text-cosmic-pink'}`}>
                {selectedMarket.fundingRate.toFixed(4)}%
            </span>
         </div>
      </div>
    </div>
  );
};
