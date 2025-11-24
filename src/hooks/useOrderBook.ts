import { useTerminalStore } from '../store/useTerminalStore';
import { useHyperliquidOrderBook } from '../exchanges/hyperliquid/useOrderBook';
import { useLighterOrderBook } from '../exchanges/lighter/useOrderBook';

export const useOrderBook = () => {
  const selectedMarket = useTerminalStore((state) => state.selectedMarket);
  
  const hyperliquidBook = useHyperliquidOrderBook();
  const lighterBook = useLighterOrderBook();

  if (selectedMarket?.dex === 'Lighter') {
    return lighterBook;
  }
  
  return hyperliquidBook;
};
