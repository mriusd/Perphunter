export enum DEXType {
  HYPERLIQUID = 'hyperliquid',
  LIGHTER = 'lighter',
}

export interface Balance {
  token: string;
  amount: string;
  usdValue: number;
  dex: DEXType;
}

export interface Position {
  id: string;
  market: string;
  side: 'long' | 'short';
  size: string;
  entryPrice: string;
  markPrice: string;
  pnl: number;
  pnlPercentage: number;
  margin: string;
  liquidationPrice: string;
  dex: DEXType;
  leverage: number;
}

export interface Market {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  price: string;
  change24h: number;
  volume24h: string;
  funding: number;
  dex: DEXType;
}

export interface OrderRequest {
  market: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit';
  size: string;
  price?: string;
  leverage?: number;
  stopLoss?: string;
  takeProfit?: string;
  dex: DEXType;
}

export interface Order {
  id: string;
  market: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit';
  size: string;
  price: string;
  status: 'pending' | 'filled' | 'cancelled' | 'rejected';
  filledSize: string;
  remainingSize: string;
  timestamp: number;
  dex: DEXType;
}

export interface OrderResponse {
  success: boolean;
  orderId?: string;
  error?: string;
}

export interface MarketData {
  symbol: string;
  price: string;
  bid: string;
  ask: string;
  volume: string;
  change: number;
  funding: number;
  openInterest: string;
}

export interface DEXInterface {
  name: string;
  chainId: number;
  getBalances(): Promise<Balance[]>;
  getPositions(): Promise<Position[]>;
  getOrderHistory(): Promise<Order[]>;
  placeOrder(order: OrderRequest): Promise<OrderResponse>;
  cancelOrder(orderId: string): Promise<boolean>;
  getMarketData(): Promise<MarketData[]>;
  getMarkets(): Promise<Market[]>;
  connect(): Promise<boolean>;
  disconnect(): Promise<void>;
}