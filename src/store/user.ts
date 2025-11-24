import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { WalletState, UserPreferences, DEXType } from '../types'

interface UserStore {
  wallet: WalletState
  preferences: UserPreferences
  
  setWallet: (wallet: Partial<WalletState>) => void
  updatePreferences: (preferences: Partial<UserPreferences>) => void
  disconnect: () => void
}

const defaultPreferences: UserPreferences = {
  defaultDEX: DEXType.HYPERLIQUID,
  slippageTolerance: 0.5,
  theme: 'dark',
  notifications: {
    trades: true,
    priceAlerts: true,
    funding: false,
  },
  tradingSettings: {
    defaultLeverage: 1,
    confirmationsRequired: true,
    autoStopLoss: false,
    autoTakeProfit: false,
  },
}

const defaultWallet: WalletState = {
  isConnected: false,
  isConnecting: false,
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      wallet: defaultWallet,
      preferences: defaultPreferences,

      setWallet: (wallet) =>
        set((state) => ({
          wallet: { ...state.wallet, ...wallet }
        })),

      updatePreferences: (preferences) =>
        set((state) => ({
          preferences: { ...state.preferences, ...preferences }
        })),

      disconnect: () =>
        set({
          wallet: defaultWallet
        }),
    }),
    {
      name: 'perphunter-user-store',
      partialize: (state) => ({
        preferences: state.preferences,
      }),
    }
  )
)