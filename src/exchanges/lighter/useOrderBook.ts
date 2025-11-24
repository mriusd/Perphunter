import { useEffect, useRef, useState } from 'react';
import { useTerminalStore } from '../../store/useTerminalStore';

export interface OrderBookEntry {
  price: number;
  size: number;
  total: number;
}

interface LighterOrder {
  price: string;
  size: string;
}

export const useLighterOrderBook = () => {
  const selectedMarket = useTerminalStore((state) => state.selectedMarket);
  const [asks, setAsks] = useState<OrderBookEntry[]>([]);
  const [bids, setBids] = useState<OrderBookEntry[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  
  // State refs to handle incremental updates
  const stateRef = useRef<{ asks: LighterOrder[], bids: LighterOrder[] }>({ asks: [], bids: [] });

  useEffect(() => {
    if (selectedMarket?.dex !== 'Lighter') {
        setAsks([]);
        setBids([]);
        return;
    }

    const connect = () => {
      const ws = new WebSocket('wss://api.lighter.xyz/stream');
      wsRef.current = ws;

      ws.onopen = () => {
          let marketId = 1;
          // Basic mapping based on known Lighter IDs for now
          if (selectedMarket.symbol.includes('WBTC')) marketId = 2;
          
          ws.send(JSON.stringify({
            type: 'subscribe',
            channel: `order_book/${marketId}`
          }));
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        const type = message.type;

        if (type === 'subscribed/order_book') {
            stateRef.current = {
                asks: message.order_book.asks,
                bids: message.order_book.bids
            };
            updateUI();
        } else if (type === 'update/order_book') {
            updateState(message.order_book);
            updateUI();
        }
      };
      
      ws.onclose = () => {
          // Reconnect logic handled by parent effect re-running or could add interval
      };
    };

    const updateState = (update: { asks: LighterOrder[], bids: LighterOrder[] }) => {
        const updateSide = (current: LighterOrder[], updates: LighterOrder[]) => {
            const newCurrent = [...current];
            updates.forEach(newOrder => {
                const index = newCurrent.findIndex(o => o.price === newOrder.price);
                if (index !== -1) {
                    if (parseFloat(newOrder.size) === 0) {
                        newCurrent.splice(index, 1);
                    } else {
                        newCurrent[index] = newOrder;
                    }
                } else if (parseFloat(newOrder.size) > 0) {
                    newCurrent.push(newOrder);
                }
            });
            return newCurrent;
        };

        stateRef.current.asks = updateSide(stateRef.current.asks, update.asks);
        stateRef.current.bids = updateSide(stateRef.current.bids, update.bids);
    };

    const updateUI = () => {
        const processSide = (items: LighterOrder[], isAsk: boolean) => {
            const sorted = [...items].sort((a, b) => {
                const pA = parseFloat(a.price);
                const pB = parseFloat(b.price);
                return isAsk ? pA - pB : pB - pA;
            });
            
            const top = sorted.slice(0, 15);
            
            let total = 0;
            return top.map(item => {
                const size = parseFloat(item.size);
                total += size;
                return {
                    price: parseFloat(item.price),
                    size: size,
                    total: total
                };
            });
        };

        const newAsks = processSide(stateRef.current.asks, true);
        const newBids = processSide(stateRef.current.bids, false);

        setAsks(newAsks);
        setBids(newBids);
    };

    connect();

    return () => {
        if (wsRef.current) {
            wsRef.current.close();
        }
    };
  }, [selectedMarket.symbol, selectedMarket.dex]);

  return { asks, bids };
};
