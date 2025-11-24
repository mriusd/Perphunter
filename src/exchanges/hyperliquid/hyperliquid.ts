import { BaseDEX } from '../common/baseDEX'
import { DEXType, Balance, Position, Order, OrderRequest, OrderResponse, MarketData, Market } from '../../types'

interface HyperliquidBalance {
  coin: string
  hold: string
  total: string
}

interface HyperliquidPosition {
  coin: string
  szi: string
  entryPx: string
  positionValue: string
  unrealizedPnl: string
  returnOnEquity: string
  leverage: {
    type: string
    value: number
  }
  liquidationPx: string
}

interface HyperliquidMarket {
  name: string
  szDecimals: number
  maxLeverage: number
  onlyIsolated: boolean
}

export class HyperliquidDEX extends BaseDEX {
  name = 'Hyperliquid'
  chainId = 42161 // Arbitrum
  
  constructor() {
    super()
    this.baseURL = 'https://api.hyperliquid.xyz'
  }

  async getBalances(): Promise<Balance[]> {
    try {
      const response = await this.makeRequest<HyperliquidBalance[]>('/info/userState')
      
      return response.map(balance => ({
        token: balance.coin,
        amount: balance.total,
        usdValue: parseFloat(balance.total), // Would need price conversion
        dex: DEXType.HYPERLIQUID,
      }))
    } catch (error) {
      console.error('Failed to fetch Hyperliquid balances:', error)
      return []
    }
  }

  async getPositions(): Promise<Position[]> {
    try {
      const response = await this.makeRequest<HyperliquidPosition[]>('/info/userState')
      
      return response
        .filter(pos => parseFloat(pos.szi) !== 0)
        .map(position => ({
          id: `${this.name}-${position.coin}`,
          market: position.coin,
          side: parseFloat(position.szi) > 0 ? 'long' : 'short',
          size: Math.abs(parseFloat(position.szi)).toString(),
          entryPrice: position.entryPx,
          markPrice: position.entryPx, // Would need current market price
          pnl: parseFloat(position.unrealizedPnl),
          pnlPercentage: parseFloat(position.returnOnEquity) * 100,
          margin: position.positionValue,
          liquidationPrice: position.liquidationPx,
          dex: DEXType.HYPERLIQUID,
          leverage: position.leverage.value,
        }))
    } catch (error) {
      console.error('Failed to fetch Hyperliquid positions:', error)
      return []
    }
  }

  async getOrderHistory(): Promise<Order[]> {
    try {
      // This would need proper authentication and user address
      return []
    } catch (error) {
      console.error('Failed to fetch Hyperliquid order history:', error)
      return []
    }
  }

  async placeOrder(order: OrderRequest): Promise<OrderResponse> {
    try {
      // This would need proper authentication and order placement
      return {
        success: false,
        error: 'Order placement not implemented - requires wallet connection',
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to place order: ${error instanceof Error ? error.message : 'Unknown error'}`,
      }
    }
  }

  async cancelOrder(orderId: string): Promise<boolean> {
    try {
      // This would need proper authentication
      return false
    } catch (error) {
      console.error('Failed to cancel Hyperliquid order:', error)
      return false
    }
  }

  async getMarketData(): Promise<MarketData[]> {
    try {
      const response = await this.makeRequest<any>('/info/allMids')
      
      return Object.entries(response).map(([symbol, price]) => ({
        symbol,
        price: String(price),
        bid: String(price), // Would need order book data
        ask: String(price), // Would need order book data
        volume: '0', // Would need volume data
        change: 0, // Would need 24h change data
        funding: 0, // Would need funding rate data
        openInterest: '0', // Would need OI data
      }))
    } catch (error) {
      console.error('Failed to fetch Hyperliquid market data:', error)
      return []
    }
  }

  async getMarkets(): Promise<Market[]> {
    try {
      // For now, return mock data to test the interface
      // TODO: Implement real Hyperliquid API calls
      console.log('HyperliquidDEX: Returning mock markets')
      return [
        {
          symbol: 'BTC-USD',
          baseAsset: 'BTC',
          quoteAsset: 'USD',
          price: '86351',
          change24h: 2443,
          changePercent24h: '+2.91%',
          volume24h: '$2,450,436,775',
          openInterest: '$2,363,999,729',
          fundingRate: '0.0100%',
          maxLeverage: 50,
          minOrderSize: '0.001',
          tickSize: '0.1',
          isActive: true,
          isFavorite: false,
          dex: DEXType.HYPERLIQUID,
          marketType: 'PERP' as const,
          lastUpdated: Date.now(),
        },
        {
          symbol: 'ETH-USD',
          baseAsset: 'ETH',
          quoteAsset: 'USD',
          price: '2818.0',
          change24h: 89.5,
          changePercent24h: '+3.28%',
          volume24h: '$1,004,265,430',
          openInterest: '$1,219,904,712',
          fundingRate: '0.0095%',
          maxLeverage: 50,
          minOrderSize: '0.01',
          tickSize: '0.1',
          isActive: true,
          isFavorite: false,
          dex: DEXType.HYPERLIQUID,
          marketType: 'PERP' as const,
          lastUpdated: Date.now(),
        },
        {
          symbol: 'ADA-USD',
          baseAsset: 'ADA',
          quoteAsset: 'USD',
          price: '0.41237',
          change24h: 0.01265,
          changePercent24h: '+3.16%',
          volume24h: '$4,196,721',
          openInterest: '$14,006,351',
          fundingRate: '0.0100%',
          maxLeverage: 20,
          minOrderSize: '1',
          tickSize: '0.00001',
          isActive: true,
          isFavorite: false,
          dex: DEXType.HYPERLIQUID,
          marketType: 'PERP' as const,
          lastUpdated: Date.now(),
        },
        {
          symbol: 'SOL-USD',
          baseAsset: 'SOL',
          quoteAsset: 'USD',
          price: '130.36',
          change24h: 3.68,
          changePercent24h: '+2.91%',
          volume24h: '$229,226,324',
          openInterest: '$433,562,091',
          fundingRate: '-0.0050%',
          maxLeverage: 20,
          minOrderSize: '0.1',
          tickSize: '0.01',
          isActive: true,
          isFavorite: false,
          dex: DEXType.HYPERLIQUID,
          marketType: 'PERP' as const,
          lastUpdated: Date.now(),
        }
      ]
    } catch (error) {
      console.error('Failed to fetch Hyperliquid markets:', error)
      return []
    }
  }

  async getMarketStats(symbol: string): Promise<MarketStats> {
    try {
      // This would need additional API calls for detailed stats
      return {
        high24h: '0',
        low24h: '0',
        volume24h: '0',
        turnover24h: '0',
        openInterest: '0',
        fundingRate: '0.0000%',
        nextFundingTime: Date.now() + 8 * 60 * 60 * 1000, // 8 hours from now
        indexPrice: '0',
        markPrice: '0',
        premiumRate: '0.0000%',
      }
    } catch (error) {
      console.error(`Failed to fetch market stats for ${symbol}:`, error)
      throw error
    }
  }

  async getAllMarketStats(): Promise<{ [symbol: string]: MarketStats }> {
    try {
      // This would batch fetch all market statistics
      return {}
    } catch (error) {
      console.error('Failed to fetch all market stats:', error)
      return {}
    }
  }
}