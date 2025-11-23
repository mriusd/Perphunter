import { DEXType } from './dex'

export interface WalletState {
  address?: string;
  chainId?: number;
  isConnected: boolean;
  isConnecting: boolean;
  connector?: string;
}

export interface UserPreferences {
  defaultDEX: DEXType;
  slippageTolerance: number;
  theme: 'light' | 'dark';
  notifications: {
    trades: boolean;
    priceAlerts: boolean;
    funding: boolean;
  };
  tradingSettings: {
    defaultLeverage: number;
    confirmationsRequired: boolean;
    autoStopLoss: boolean;
    autoTakeProfit: boolean;
  };
}

export interface PortfolioSummary {
  totalValue: number;
  totalPnL: number;
  totalPnLPercentage: number;
  marginUsed: number;
  marginAvailable: number;
  positionsCount: number;
  openOrdersCount: number;
}