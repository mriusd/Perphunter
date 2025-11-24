import { create } from 'zustand';
import { fetchHyperliquidMarkets } from '../exchanges/hyperliquid/api';
import { fetchLighterMarkets } from '../exchanges/lighter/api';

export type Exchange = 'Hyperliquid' | 'Lighter';

export interface Market {
  symbol: string;
  base: string;
  quote: string;
  price: number;
  change24h: number;
  volume24h: number;
  openInterest: number;
  fundingRate: number;
  dex?: Exchange; // Optional to avoid breaking existing Hyperliquid markets
}

interface TerminalState {
  selectedExchange: Exchange;
  selectedMarket: Market;
  markets: Record<Exchange, Market[]>;
  favorites: string[];
  isLoading: boolean;
  setExchange: (exchange: Exchange) => void;
  setMarket: (market: Market) => void;
  toggleFavorite: (symbol: string) => void;
  fetchMarkets: () => Promise<void>;
  updateMarket: (exchange: Exchange, symbol: string, updates: Partial<Market>) => void;
}

// Initial Fallback Data
const INITIAL_MARKETS: Record<Exchange, Market[]> = {
  Hyperliquid: [
    { symbol: 'BTC-USD', base: 'BTC', quote: 'USD', price: 0, change24h: 0, volume24h: 0, openInterest: 0, fundingRate: 0 },
  ],
  Lighter: [
    { symbol: 'WETH-USDC', base: 'WETH', quote: 'USDC', price: 0, change24h: 0, volume24h: 0, openInterest: 0, fundingRate: 0 },
  ]
};

export const useTerminalStore = create<TerminalState>((set, get) => ({
  selectedExchange: 'Hyperliquid',
  selectedMarket: INITIAL_MARKETS['Hyperliquid'][0],
  markets: INITIAL_MARKETS,
  favorites: [],
  isLoading: false,

  setExchange: (exchange) => {
    const markets = get().markets[exchange];
    set({ 
        selectedExchange: exchange, 
        selectedMarket: markets.length > 0 ? markets[0] : INITIAL_MARKETS[exchange][0] 
    });
  },

  setMarket: (market) => set({ selectedMarket: market }),

  toggleFavorite: (symbol) => set((state) => {
    const isFav = state.favorites.includes(symbol);
    return {
      favorites: isFav 
        ? state.favorites.filter(s => s !== symbol)
        : [...state.favorites, symbol]
    };
  }),

  fetchMarkets: async () => {
    set({ isLoading: true });
    try {
      // Fetch markets from all exchanges
      const [hlMarkets, lighterMarkets] = await Promise.all([
        fetchHyperliquidMarkets(),
        fetchLighterMarkets()
      ]);
      
      set(state => ({
        markets: {
          Hyperliquid: hlMarkets.length > 0 ? hlMarkets : state.markets.Hyperliquid,
          Lighter: lighterMarkets.length > 0 ? lighterMarkets : state.markets.Lighter
        },
        // If currently selected exchange is Hyperliquid, update selected market to real data if it was placeholder
        selectedMarket: (state.selectedExchange === 'Hyperliquid' && state.selectedMarket.price === 0 && hlMarkets.length > 0)
            ? hlMarkets[0]
            : (state.selectedExchange === 'Lighter' && state.selectedMarket.price === 0 && lighterMarkets.length > 0)
                ? lighterMarkets[0]
                : state.selectedMarket
      }));
    } catch (error) {
      console.error('Error updating markets:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateMarket: (exchange, symbol, updates) => set(state => {
    const exchangeMarkets = state.markets[exchange];
    const marketIndex = exchangeMarkets.findIndex(m => m.symbol === symbol);
    
    if (marketIndex === -1) return state;

    const newMarkets = [...exchangeMarkets];
    newMarkets[marketIndex] = { ...newMarkets[marketIndex], ...updates };

    return {
      markets: {
        ...state.markets,
        [exchange]: newMarkets
      },
      selectedMarket: (state.selectedExchange === exchange && state.selectedMarket.symbol === symbol)
        ? { ...state.selectedMarket, ...updates }
        : state.selectedMarket
    };
  })
}));
