import { useEffect, useRef } from 'react';
import { useTerminalStore } from '../../store/useTerminalStore';

interface LighterOrder {
  price: string;
  size: string;
}

interface LighterOrderBookUpdate {
  asks: LighterOrder[];
  bids: LighterOrder[];
}

export const useLighterWebSocket = () => {
  const updateMarket = useTerminalStore((state) => state.updateMarket);
  const symbol = useTerminalStore((state) => state.selectedMarket.symbol);
  const dex = useTerminalStore((state) => state.selectedMarket.dex);
  
  const wsRef = useRef<WebSocket | null>(null);
  const orderBookStateRef = useRef<{ asks: LighterOrder[], bids: LighterOrder[] }>({ asks: [], bids: [] });

  useEffect(() => {
    if (dex !== 'Lighter') return;

    const connect = () => {
      try {
        const ws = new WebSocket('wss://api.lighter.xyz/stream');
        wsRef.current = ws;

        ws.onopen = () => {
          console.log('Connected to Lighter WebSocket');
          
          let marketId = 1;
          if (symbol.includes('BTC')) marketId = 2;
          
          ws.send(JSON.stringify({
            type: 'subscribe',
            channel: `order_book/${marketId}`
          }));
        };

        ws.onmessage = (event) => {
          const message = JSON.parse(event.data);
          const type = message.type;

          if (type === 'subscribed/order_book') {
            // Initial snapshot
            orderBookStateRef.current = {
                asks: message.order_book.asks,
                bids: message.order_book.bids
            };
            processOrderBookUpdate(orderBookStateRef.current);
          } else if (type === 'update/order_book') {
            // Incremental update
            updateOrderBookState(message.order_book);
            processOrderBookUpdate(orderBookStateRef.current);
          }
        };

        ws.onclose = () => {
          console.log('Lighter WebSocket disconnected. Reconnecting...');
          setTimeout(connect, 5000);
        };

        ws.onerror = (error) => {
          console.error('Lighter WebSocket error:', error);
          ws.close();
        };
      } catch (error) {
        console.error('Failed to connect to Lighter WebSocket:', error);
      }
    };

    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [symbol, dex, updateMarket]);

  const updateOrderBookState = (update: LighterOrderBookUpdate) => {
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
        return newCurrent.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    };

    orderBookStateRef.current.asks = updateSide(orderBookStateRef.current.asks, update.asks);
    orderBookStateRef.current.bids = updateSide(orderBookStateRef.current.bids, update.bids).sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
  };

  const processOrderBookUpdate = (book: { asks: LighterOrder[], bids: LighterOrder[] }) => {
    if (book.asks.length > 0 && book.bids.length > 0) {
        const bestAsk = parseFloat(book.asks[0].price);
        const bestBid = parseFloat(book.bids[0].price);
        const midPrice = (bestAsk + bestBid) / 2;

        updateMarket('Lighter', symbol, {
            price: midPrice
        });
    }
  };
};
