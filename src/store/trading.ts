import { create } from 'zustand'
import { TradingState, OrderFormData, DEXType } from '@/types'

interface TradingStore extends TradingState {
  setSelectedDEX: (dex: DEXType) => void
  setSelectedMarket: (market: string) => void
  updateOrderForm: (data: Partial<OrderFormData>) => void
  setIsPlacingOrder: (isPlacing: boolean) => void
  setOrderResult: (result: { success: boolean; message: string }) => void
  resetOrderForm: () => void
}

const defaultOrderForm: OrderFormData = {
  market: '',
  side: 'buy',
  type: 'market',
  size: '',
  price: '',
  leverage: 1,
  dex: DEXType.HYPERLIQUID,
}

export const useTradingStore = create<TradingStore>((set, get) => ({
  selectedDEX: DEXType.HYPERLIQUID,
  selectedMarket: '',
  orderForm: defaultOrderForm,
  isPlacingOrder: false,
  lastOrderResult: undefined,

  setSelectedDEX: (dex) => 
    set((state) => ({ 
      selectedDEX: dex,
      orderForm: { ...state.orderForm, dex }
    })),

  setSelectedMarket: (market) =>
    set((state) => ({
      selectedMarket: market,
      orderForm: { ...state.orderForm, market }
    })),

  updateOrderForm: (data) =>
    set((state) => ({
      orderForm: { ...state.orderForm, ...data }
    })),

  setIsPlacingOrder: (isPlacing) =>
    set({ isPlacingOrder: isPlacing }),

  setOrderResult: (result) =>
    set({ lastOrderResult: result }),

  resetOrderForm: () =>
    set((state) => ({
      orderForm: { ...defaultOrderForm, dex: state.selectedDEX, market: state.selectedMarket }
    })),
}))