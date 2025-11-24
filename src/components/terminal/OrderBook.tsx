import React from 'react';
import { useOrderBook } from '../../hooks/useOrderBook';
import { useTerminalStore } from '../../store/useTerminalStore';

interface Order {
  price: number;
  size: number;
  total: number;
}

export const OrderBook: React.FC = () => {
  const { asks, bids } = useOrderBook();
  const selectedMarket = useTerminalStore(state => state.selectedMarket);

  // Calculate spread and mid price
  const bestAsk = asks.length > 0 ? asks[asks.length - 1].price : 0;
  const bestBid = bids.length > 0 ? bids[0].price : 0;
  const spread = bestAsk - bestBid;
  const spreadPercentage = bestAsk > 0 ? (spread / bestAsk) * 100 : 0;
  
  const Row = ({ order, type }: { order: Order; type: 'ask' | 'bid' }) => {
    const bgClass = type === 'ask' ? 'bg-cosmic-pink' : 'bg-cosmic-green';
    const textClass = type === 'ask' ? 'text-cosmic-pink' : 'text-cosmic-green';
    
    return (
      <div className="flex justify-between px-2 font-mono text-xs hover:bg-cosmic-dim/20 cursor-pointer relative group">
        {/* Depth Bar */}
        <div 
            className={`absolute top-0 ${type === 'ask' ? 'right-0' : 'right-0'} h-full opacity-10 ${bgClass}`} 
            style={{ width: `${Math.min(order.size * 20, 100)}%` }}
        />
        
        <span className={`w-1/3 text-left ${textClass} font-bold z-10`}>{order.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        <span className="w-1/3 text-right text-cosmic-text z-10">{order.size.toFixed(4)}</span>
        <span className="w-1/3 text-right text-cosmic-dim z-10">{order.total.toFixed(2)}</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-cosmic-bg/80 select-none text-sm">
      <div className="flex justify-between px-2 py-1 text-[10px] text-cosmic-dim border-b border-cosmic-dim/30 uppercase font-pixel tracking-wider">
        <span className="w-1/3 text-left">Price(USD)</span>
        <span className="w-1/3 text-right">Size({selectedMarket.base})</span>
        <span className="w-1/3 text-right">Total</span>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col-reverse">
        {asks.map((order, i) => <Row key={`ask-${i}`} order={order} type="ask" />)}
      </div>
      
      <div className="border-y border-cosmic-dim/50 py-2 text-center font-bold text-white my-1 bg-cosmic-card flex justify-between px-4 items-center">
        <div className="flex flex-col items-start">
            <span className={`text-lg glow-text ${selectedMarket.change24h >= 0 ? 'text-cosmic-green' : 'text-cosmic-pink'}`}>
                {selectedMarket.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            {spread > 0 && (
                <span className="text-[10px] text-cosmic-dim">
                    Spread: {spread.toFixed(2)} ({spreadPercentage.toFixed(3)}%)
                </span>
            )}
        </div>
        <span className="text-xs text-cosmic-dim">USD</span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {bids.map((order, i) => <Row key={`bid-${i}`} order={order} type="bid" />)}
      </div>
    </div>
  );
};
