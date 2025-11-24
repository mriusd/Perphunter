import { useEffect, useRef, useState } from 'react';
import { useTerminalStore } from '../../store/useTerminalStore';

export interface OrderBookEntry {
  price: number;
  size: number;
  total: number;
}

export const useHyperliquidOrderBook = () => {
  const selectedBase = useTerminalStore((state) => state.selectedMarket?.base);
  const [asks, setAsks] = useState<OrderBookEntry[]>([]);
  const [bids, setBids] = useState<OrderBookEntry[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const currentSubRef = useRef<string | null>(null);

  useEffect(() => {
    if (!selectedBase) return;

    const connect = () => {
      const ws = new WebSocket('wss://api.hyperliquid.xyz/ws');
      wsRef.current = ws;

      ws.onopen = () => {
        if (selectedBase) {
            const msg = {
                method: 'subscribe',
                subscription: { type: 'l2Book', coin: selectedBase }
            };
            ws.send(JSON.stringify(msg));
            currentSubRef.current = selectedBase;
        }
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.channel === 'l2Book') {
            const data = message.data;
            // data.levels is [[px, sz, n], ...] for bids and asks
            // levels[0] is bids, levels[1] is asks
            const rawBids = data.levels[0];
            const rawAsks = data.levels[1];

            // Process Bids
            let bidTotal = 0;
            const newBids = rawBids.slice(0, 15).map((level: any) => {
                const size = parseFloat(level.sz);
                bidTotal += size;
                return {
                    price: parseFloat(level.px),
                    size: size,
                    total: bidTotal
                };
            });

            // Process Asks
            let askTotal = 0;
            const newAsks = rawAsks.slice(0, 15).map((level: any) => {
                const size = parseFloat(level.sz);
                askTotal += size;
                return {
                    price: parseFloat(level.px),
                    size: size,
                    total: askTotal
                };
            });

            setBids(newBids);
            setAsks(newAsks); // Do not reverse asks, flex-col-reverse handles the display order
        }
      };

      ws.onclose = () => {
        // Reconnect logic could go here
      };
    };

    connect();

    return () => {
        if (wsRef.current) {
            wsRef.current.close();
        }
    };
  }, [selectedBase]);

  return { asks, bids };
};
