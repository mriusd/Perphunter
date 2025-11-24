import React, { useState } from 'react'
import { useTradingStore } from '../../store'

const TradingPanel: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'limit' | 'market' | 'twap'>('limit')
  const [side, setSide] = useState<'buy' | 'sell'>('buy')
  const [size, setSize] = useState('')
  const [price, setPrice] = useState('')
  const [leverage, setLeverage] = useState('1')
  const [reduceOnly, setReduceOnly] = useState(false)

  const tabs = [
    { id: 'limit', label: 'Limit' },
    { id: 'market', label: 'Market' },
    { id: 'twap', label: 'TWAP' },
  ]

  return (
    <div className="bg-[#1a2332] h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-[#2a3441]">
        <h3 className="text-white font-medium text-sm">Cross</h3>
        <div className="flex items-center space-x-1 mt-2 text-xs">
          <span className="text-gray-400">10x</span>
          <button className="text-[#00d4aa] hover:text-[#00c499]">Edit</button>
        </div>
      </div>

      <div className="flex-1 p-3 space-y-4">
        {/* Order Type Tabs */}
        <div className="flex space-x-1 bg-[#0f1419] rounded p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors ${
                selectedTab === tab.id
                  ? 'bg-[#2a3441] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Buy/Sell Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setSide('buy')}
            className={`py-2 text-sm font-medium rounded transition-colors ${
              side === 'buy'
                ? 'bg-[#00d4aa] text-black'
                : 'bg-[#0f1419] text-gray-400 border border-[#2a3441] hover:text-white'
            }`}
          >
            Buy / Long
          </button>
          <button
            onClick={() => setSide('sell')}
            className={`py-2 text-sm font-medium rounded transition-colors ${
              side === 'sell'
                ? 'bg-[#ff6b6b] text-white'
                : 'bg-[#0f1419] text-gray-400 border border-[#2a3441] hover:text-white'
            }`}
          >
            Sell / Short
          </button>
        </div>

        {/* Size Input */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">Size (ADA)</label>
          <div className="relative">
            <input
              type="text"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full bg-[#0f1419] border border-[#2a3441] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00d4aa]"
              placeholder="0.00"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              ADA
            </div>
          </div>
        </div>

        {/* Price Input (for limit orders) */}
        {selectedTab === 'limit' && (
          <div>
            <label className="block text-xs text-gray-400 mb-1">Limit Price</label>
            <div className="relative">
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-[#0f1419] border border-[#2a3441] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00d4aa]"
                placeholder="0.00000"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                USDC
              </div>
            </div>
          </div>
        )}

        {/* Reduce Only Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">Reduce Only</span>
          <button
            onClick={() => setReduceOnly(!reduceOnly)}
            className={`relative w-10 h-5 rounded-full transition-colors ${
              reduceOnly ? 'bg-[#00d4aa]' : 'bg-[#2a3441]'
            }`}
          >
            <div
              className={`absolute w-4 h-4 bg-white rounded-full top-0.5 transition-transform ${
                reduceOnly ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Submit Button */}
        <button
          className={`w-full py-3 text-sm font-medium rounded transition-colors ${
            side === 'buy'
              ? 'bg-[#00d4aa] hover:bg-[#00c499] text-black'
              : 'bg-[#ff6b6b] hover:bg-[#ff5252] text-white'
          }`}
        >
          {side === 'buy' ? 'Buy' : 'Sell'} {size || '0'} ADA
        </button>

        {/* Account Info */}
        <div className="mt-6 pt-4 border-t border-[#2a3441] space-y-2 text-xs">
          <div className="flex justify-between text-gray-400">
            <span>Account Equity</span>
            <span className="text-white">$6130</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Perps Overview</span>
            <span className="text-white">$47.69</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Spot</span>
            <span className="text-white">$84.38</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Unrealized PnL</span>
            <span className="text-[#00d4aa]">$1.52</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Cross Margin Ratio</span>
            <span className="text-white">-4.17%</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Maintenance Margin</span>
            <span className="text-white">$33.74</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export { TradingPanel }