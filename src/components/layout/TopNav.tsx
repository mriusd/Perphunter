import React, { useState } from 'react'
import { TrendingUpIcon, WalletIcon, ChevronDownIcon } from 'lucide-react'
import { Button } from '../ui'
import { useWallet } from '../../hooks/useWallet'
import { MarketSelector } from '../trading/MarketSelector'
import { DEXType } from '../../types'

const TopNav: React.FC = () => {
  const { wallet, connect, disconnect } = useWallet()
  const [isMarketSelectorOpen, setIsMarketSelectorOpen] = useState(false)
  const [selectedExchange, setSelectedExchange] = useState<DEXType>(DEXType.HYPERLIQUID)
  const [currentMarket, setCurrentMarket] = useState('ADA-USD')

  const exchanges = [
    { label: 'Hyperliquid', value: DEXType.HYPERLIQUID },
    { label: 'Lighter', value: DEXType.LIGHTER },
  ]
  
  const markets = [
    { symbol: 'ADA-USDC', price: '0.41188', change: '+5.96%', changePositive: true },
    { symbol: 'BTC-USDC', price: '42,786', change: '+2.47%', changePositive: true },
    { symbol: 'ETH-USDC', price: '2,486', change: '-1.15%', changePositive: false },
    { symbol: 'SOL-USDC', price: '89.42', change: '+3.85%', changePositive: true },
    { symbol: 'XRP-USDC', price: '0.57', change: '+7.64%', changePositive: true },
  ]

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const handleMarketSelect = (market: any) => {
    setCurrentMarket(market.symbol)
  }

  return (
    <>
      <nav className="bg-[#1a2332] border-b border-[#2a3441] px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Left Section - Logo, Exchange Selector, Current Market */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <TrendingUpIcon className="h-6 w-6 text-[#00d4aa]" />
              <span className="text-lg font-bold text-white">PerpHunter</span>
            </div>

            {/* Exchange Selector */}
            <div className="relative">
              <select
                value={selectedExchange}
                onChange={(e) => setSelectedExchange(e.target.value as DEXType)}
                className="bg-[#2a3441] text-white px-3 py-1.5 rounded text-sm border border-[#3a4451] focus:outline-none focus:border-[#00d4aa]"
              >
                {exchanges.map((exchange) => (
                  <option key={exchange.value} value={exchange.value}>
                    {exchange.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Current Market - Clickable */}
            <button
              onClick={() => setIsMarketSelectorOpen(true)}
              className="flex items-center space-x-2 bg-[#0f1419] hover:bg-[#2a3441] px-3 py-2 rounded border border-[#2a3441] transition-colors"
            >
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-[#00d4aa] flex items-center justify-center">
                  <span className="text-black font-bold text-xs">A</span>
                </div>
                <span className="text-white font-medium">{currentMarket}</span>
              </div>
              <ChevronDownIcon className="h-4 w-4 text-gray-400" />
            </button>
            
            {/* Navigation Items */}
            <div className="hidden md:flex items-center space-x-6 text-sm">
              <a href="/trading" className="text-white hover:text-[#00d4aa] transition-colors">Trade</a>
              <a href="/vaults" className="text-gray-300 hover:text-white transition-colors">Vaults</a>
              <a href="/portfolio" className="text-gray-300 hover:text-white transition-colors">Portfolio</a>
              <a href="/staking" className="text-gray-300 hover:text-white transition-colors">Staking</a>
              <a href="/referrals" className="text-gray-300 hover:text-white transition-colors">Referrals</a>
              <a href="/leaderboard" className="text-gray-300 hover:text-white transition-colors">Leaderboard</a>
            </div>
          </div>

          {/* Market Ticker */}
          <div className="hidden lg:flex items-center space-x-4 text-xs">
            {markets.map((market, index) => (
              <div key={market.symbol} className="flex items-center space-x-2">
                <span className="text-gray-300">{market.symbol}</span>
                <span className="text-white font-medium">{market.price}</span>
                <span className={market.changePositive ? 'text-[#00d4aa]' : 'text-[#ff6b6b]'}>
                  {market.change}
                </span>
              </div>
            ))}
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            {wallet.isConnected ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-300">
                  {formatAddress(wallet.address!)}
                </span>
                <button
                  onClick={disconnect}
                  className="bg-[#2a3441] hover:bg-[#3a4451] text-white px-3 py-1.5 rounded text-sm transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connect}
                className="bg-[#00d4aa] hover:bg-[#00c499] text-black px-4 py-1.5 rounded text-sm font-medium transition-colors flex items-center space-x-2"
              >
                <WalletIcon className="h-4 w-4" />
                <span>Connect</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Market Selector Dialog */}
      <MarketSelector
        isOpen={isMarketSelectorOpen}
        onClose={() => setIsMarketSelectorOpen(false)}
        onSelectMarket={handleMarketSelect}
        currentMarket={currentMarket}
        selectedExchange={selectedExchange}
      />
    </>
  )
}

export { TopNav }