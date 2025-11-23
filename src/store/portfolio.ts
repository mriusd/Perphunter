import { create } from 'zustand'
import { Balance, Position, Transaction, PortfolioSummary } from '@/types'

interface PortfolioStore {
  balances: Balance[]
  positions: Position[]
  transactions: Transaction[]
  summary: PortfolioSummary
  isLoading: boolean
  error?: string

  setBalances: (balances: Balance[]) => void
  setPositions: (positions: Position[]) => void
  setTransactions: (transactions: Transaction[]) => void
  updateSummary: () => void
  setLoading: (loading: boolean) => void
  setError: (error?: string) => void
  addTransaction: (transaction: Transaction) => void
}

const defaultSummary: PortfolioSummary = {
  totalValue: 0,
  totalPnL: 0,
  totalPnLPercentage: 0,
  marginUsed: 0,
  marginAvailable: 0,
  positionsCount: 0,
  openOrdersCount: 0,
}

export const usePortfolioStore = create<PortfolioStore>((set, get) => ({
  balances: [],
  positions: [],
  transactions: [],
  summary: defaultSummary,
  isLoading: false,
  error: undefined,

  setBalances: (balances) => {
    set({ balances })
    get().updateSummary()
  },

  setPositions: (positions) => {
    set({ positions })
    get().updateSummary()
  },

  setTransactions: (transactions) => set({ transactions }),

  updateSummary: () => {
    const { balances, positions } = get()
    
    const totalValue = balances.reduce((sum, balance) => sum + balance.usdValue, 0)
    const totalPnL = positions.reduce((sum, position) => sum + position.pnl, 0)
    const marginUsed = positions.reduce((sum, position) => sum + parseFloat(position.margin), 0)
    const positionsCount = positions.length
    
    const summary: PortfolioSummary = {
      totalValue,
      totalPnL,
      totalPnLPercentage: totalValue > 0 ? (totalPnL / totalValue) * 100 : 0,
      marginUsed,
      marginAvailable: Math.max(0, totalValue - marginUsed),
      positionsCount,
      openOrdersCount: 0, // Will be updated when orders are implemented
    }

    set({ summary })
  },

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions]
    })),
}))