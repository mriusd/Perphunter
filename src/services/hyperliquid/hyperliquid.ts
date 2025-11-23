import { BaseDEX } from '@/services/common/baseDEX'
import { DEXType, Balance, Position, Order, OrderRequest, OrderResponse, MarketData, Market } from '@/types'

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
      const response = await this.makeRequest<HyperliquidMarket[]>('/info/meta')
      
      return response.map(market => ({
        symbol: market.name,
        baseAsset: market.name.split('-')[0],
        quoteAsset: 'USD',
        price: '0', // Would need current price
        change24h: 0, // Would need 24h change
        volume24h: '0', // Would need 24h volume
        funding: 0, // Would need funding rate
        dex: DEXType.HYPERLIQUID,
      }))
    } catch (error) {
      console.error('Failed to fetch Hyperliquid markets:', error)
      return []
    }
  }
}