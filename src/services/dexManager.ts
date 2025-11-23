import { DEXType, DEXInterface } from '@/types'
import { HyperliquidDEX } from './hyperliquid/hyperliquid'
import { LighterDEX } from './lighter/lighter'

class DEXManager {
  private dexInstances: Map<DEXType, DEXInterface> = new Map()

  constructor() {
    this.initializeDEXes()
  }

  private initializeDEXes() {
    this.dexInstances.set(DEXType.HYPERLIQUID, new HyperliquidDEX())
    this.dexInstances.set(DEXType.LIGHTER, new LighterDEX())
  }

  getDEX(dexType: DEXType): DEXInterface | undefined {
    return this.dexInstances.get(dexType)
  }

  getAllDEXes(): DEXInterface[] {
    return Array.from(this.dexInstances.values())
  }

  getSupportedDEXes(): DEXType[] {
    return Array.from(this.dexInstances.keys())
  }

  async connectDEX(dexType: DEXType): Promise<boolean> {
    const dex = this.getDEX(dexType)
    if (!dex) {
      throw new Error(`DEX ${dexType} not supported`)
    }
    return dex.connect()
  }

  async disconnectDEX(dexType: DEXType): Promise<void> {
    const dex = this.getDEX(dexType)
    if (!dex) {
      throw new Error(`DEX ${dexType} not supported`)
    }
    return dex.disconnect()
  }

  async connectAllDEXes(): Promise<{ [key in DEXType]: boolean }> {
    const results = {} as { [key in DEXType]: boolean }
    
    for (const [dexType, dex] of this.dexInstances) {
      try {
        results[dexType] = await dex.connect()
      } catch (error) {
        console.error(`Failed to connect to ${dexType}:`, error)
        results[dexType] = false
      }
    }
    
    return results
  }

  async disconnectAllDEXes(): Promise<void> {
    const promises = Array.from(this.dexInstances.values()).map(dex => dex.disconnect())
    await Promise.all(promises)
  }
}

export const dexManager = new DEXManager()