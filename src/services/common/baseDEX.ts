import { DEXInterface, Balance, Position, Order, OrderRequest, OrderResponse, MarketData, Market } from '@/types'

export abstract class BaseDEX implements DEXInterface {
  abstract name: string
  abstract chainId: number
  
  protected apiKey?: string
  protected baseURL: string = ''
  protected isConnected: boolean = false

  constructor(apiKey?: string) {
    this.apiKey = apiKey
  }

  abstract getBalances(): Promise<Balance[]>
  abstract getPositions(): Promise<Position[]>
  abstract getOrderHistory(): Promise<Order[]>
  abstract placeOrder(order: OrderRequest): Promise<OrderResponse>
  abstract cancelOrder(orderId: string): Promise<boolean>
  abstract getMarketData(): Promise<MarketData[]>
  abstract getMarkets(): Promise<Market[]>
  
  async connect(): Promise<boolean> {
    try {
      // Base connection logic
      this.isConnected = true
      return true
    } catch (error) {
      console.error(`Failed to connect to ${this.name}:`, error)
      return false
    }
  }

  async disconnect(): Promise<void> {
    this.isConnected = false
  }

  protected async makeRequest<T>(
    endpoint: string, 
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
        ...options?.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  protected formatNumber(value: string | number, decimals: number = 6): string {
    return Number(value).toFixed(decimals)
  }
}