import { Market } from '../../store/useTerminalStore';

export const fetchLighterMarkets = async (): Promise<Market[]> => {
  try {
    // Lighter uses an orderbook model on Arbitrum.
    // Since there isn't a simple "all markets" metadata endpoint like Hyperliquid publicly documented without an API key,
    // we will return a static list of their main markets for now, or mock it with realistic data structure.
    // In a real app, this would query https://api.lighter.xyz/v1/markets or similar.
    
    // Returning the mock data from the previous implementation, but strictly typed.
    return [
        {
          symbol: 'WETH-USDC',
          base: 'WETH',
          quote: 'USDC',
          price: 2500.00,
          change24h: 1.2,
          volume24h: 15000000,
          openInterest: 5000000,
          fundingRate: 0.0001 * 24 * 100, // Daily %
          dex: 'Lighter'
        },
        {
          symbol: 'WBTC-USDC',
          base: 'WBTC',
          quote: 'USDC',
          price: 42000.00,
          change24h: -0.5,
          volume24h: 25000000,
          openInterest: 12000000,
          fundingRate: 0.0002 * 24 * 100,
          dex: 'Lighter'
        }
    ];
  } catch (error) {
    console.error('Failed to fetch Lighter markets:', error);
    return [];
  }
};
