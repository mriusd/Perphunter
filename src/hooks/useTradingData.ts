import { useQuery } from '@tanstack/react-query'
import { dexManager } from '../services'
import { DEXType, Balance, Position, Market } from '../types'

export const useTradingData = (dex?: DEXType) => {
  const {
    data: balances = [],
    isLoading: balancesLoading,
    error: balancesError,
  } = useQuery({
    queryKey: ['balances', dex],
    queryFn: async (): Promise<Balance[]> => {
      if (dex) {
        const dexInstance = dexManager.getDEX(dex)
        return dexInstance ? await dexInstance.getBalances() : []
      }
      
      // Get balances from all DEXes
      const allDEXes = dexManager.getAllDEXes()
      const balancePromises = allDEXes.map(dexInstance => dexInstance.getBalances())
      const balanceResults = await Promise.all(balancePromises)
      return balanceResults.flat()
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  })

  const {
    data: positions = [],
    isLoading: positionsLoading,
    error: positionsError,
  } = useQuery({
    queryKey: ['positions', dex],
    queryFn: async (): Promise<Position[]> => {
      if (dex) {
        const dexInstance = dexManager.getDEX(dex)
        return dexInstance ? await dexInstance.getPositions() : []
      }
      
      // Get positions from all DEXes
      const allDEXes = dexManager.getAllDEXes()
      const positionPromises = allDEXes.map(dexInstance => dexInstance.getPositions())
      const positionResults = await Promise.all(positionPromises)
      return positionResults.flat()
    },
    refetchInterval: 10000, // Refetch every 10 seconds
  })

  const {
    data: markets = [],
    isLoading: marketsLoading,
    error: marketsError,
  } = useQuery({
    queryKey: ['markets', dex],
    queryFn: async (): Promise<Market[]> => {
      if (dex) {
        const dexInstance = dexManager.getDEX(dex)
        return dexInstance ? await dexInstance.getMarkets() : []
      }
      
      // Get markets from all DEXes
      const allDEXes = dexManager.getAllDEXes()
      const marketPromises = allDEXes.map(dexInstance => dexInstance.getMarkets())
      const marketResults = await Promise.all(marketPromises)
      return marketResults.flat()
    },
    staleTime: 300000, // Markets don't change often, 5 minutes stale time
    refetchInterval: 300000, // Refetch every 5 minutes
  })

  return {
    balances,
    positions,
    markets,
    isLoading: balancesLoading || positionsLoading || marketsLoading,
    error: balancesError || positionsError || marketsError,
  }
}