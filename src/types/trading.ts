import { DEXType } from './dex'

export interface OrderFormData {
  market: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit';
  size: string;
  price: string;
  leverage: number;
  stopLoss?: string;
  takeProfit?: string;
  dex: DEXType;
}

export interface TradingState {
  selectedDEX: DEXType;
  selectedMarket: string;
  orderForm: OrderFormData;
  isPlacingOrder: boolean;
  lastOrderResult?: {
    success: boolean;
    message: string;
  };
}

export interface Transaction {
  id: string;
  type: 'trade' | 'deposit' | 'withdrawal' | 'funding';
  market?: string;
  side?: 'buy' | 'sell';
  amount: string;
  price?: string;
  fee: string;
  timestamp: number;
  status: 'completed' | 'pending' | 'failed';
  txHash?: string;
  dex: DEXType;
}

export interface HistoryFilters {
  dex?: DEXType;
  market?: string;
  type?: string;
  dateFrom?: Date;
  dateTo?: Date;
}