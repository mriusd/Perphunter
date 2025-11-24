import { useEffect, useRef } from 'react';
import { useTerminalStore } from '../../store/useTerminalStore';

export const useHyperliquidWebSocket = () => {
  const updateMarket = useTerminalStore((state) => state.updateMarket);
  const selectedBase = useTerminalStore((state) => state.selectedMarket?.base);
  
  const wsRef = useRef<WebSocket | null>(null);
  const currentSubRef = useRef<string | null>(null);
  const selectedBaseRef = useRef<string | undefined>(selectedBase);

  // Keep ref in sync with selected base to avoid stale closure in WebSocket callbacks
  useEffect(() => {
    selectedBaseRef.current = selectedBase;
  }, [selectedBase]);

  useEffect(() => {
    const connect = () => {
      try {
        const ws = new WebSocket('wss://api.hyperliquid.xyz/ws');
        wsRef.current = ws;

        ws.onopen = () => {
          console.log('Connected to Hyperliquid WebSocket');
          
          // 1. Subscribe to global mid prices (for the list)
          ws.send(JSON.stringify({
            method: 'subscribe',
            subscription: { type: 'allMids' }
          }));

          // 2. Subscribe to trades for the selected market (for accurate last price)
          if (selectedBaseRef.current) {
            const subMsg = {
                method: 'subscribe',
                subscription: { type: 'trades', coin: selectedBaseRef.current }
            };
            ws.send(JSON.stringify(subMsg));
            currentSubRef.current = selectedBaseRef.current;
          }
        };

        ws.onmessage = (event) => {
          const message = JSON.parse(event.data);
          const channel = message.channel;
          const data = message.data;

          if (channel === 'allMids') {
            // Update all markets with mid prices (fallback/list view)
            Object.entries(data.mids).forEach(([coin, price]: [string, any]) => {
              // Don't overwrite the selected market with mid price if we have trade data
              if (coin !== selectedBaseRef.current) {
                updateMarket('Hyperliquid', `${coin}-USD`, {
                    price: parseFloat(price)
                });
              }
            });
          } 
          
          if (channel === 'trades') {
             // Update selected market with REAL last trade price
             const trades = data;
             if (trades.length > 0) {
                const lastTrade = trades[trades.length - 1];
                updateMarket('Hyperliquid', `${lastTrade.coin}-USD`, {
                    price: parseFloat(lastTrade.px)
                });
             }
          }
        };

        ws.onclose = () => {
          console.log('Hyperliquid WebSocket disconnected. Reconnecting...');
          setTimeout(connect, 5000);
        };

        ws.onerror = (error) => {
          console.error('Hyperliquid WebSocket error:', error);
          ws.close();
        };
      } catch (error) {
        console.error('Failed to connect to Hyperliquid WebSocket:', error);
      }
    };

    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [updateMarket]); // Stable dependency

  // Handle subscription switching when selected market changes
  useEffect(() => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN && selectedBase) {
        if (currentSubRef.current !== selectedBase) {
            // Subscribe new
            const subMsg = {
                method: 'subscribe',
                subscription: { type: 'trades', coin: selectedBase }
            };
            ws.send(JSON.stringify(subMsg));
            currentSubRef.current = selectedBase;
        }
    }
  }, [selectedBase]);
};
