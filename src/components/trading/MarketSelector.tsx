import React, { useState, useEffect } from 'react'
import { SearchIcon, StarIcon, TrendingUpIcon } from 'lucide-react'
import { universalMarketService } from '../../services/common/marketService'
import { Market, DEXType } from '../../types'

interface MarketSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelectMarket: (market: Market) => void
  currentMarket: string
  selectedExchange: DEXType
}

const MarketSelector: React.FC<MarketSelectorProps> = ({ isOpen, onClose, onSelectMarket, currentMarket, selectedExchange }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'All' | 'Strict'>('All')
  const [markets, setMarkets] = useState<Market[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadMarkets()
    }
  }, [isOpen, selectedExchange])

  const loadMarkets = async () => {
    setIsLoading(true)
    console.log('Loading markets for exchange:', selectedExchange)
    try {
      const marketData = await universalMarketService.getMarkets(selectedExchange)
      console.log('Loaded markets:', marketData)
      setMarkets(marketData)
    } catch (error) {
      console.error('Failed to load markets:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Filter markets based on search only (no tabs)
  const filteredMarkets = markets.filter(market => {
    const matchesSearch = market.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         market.baseAsset.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSearch
  })

  const handleToggleFavorite = (symbol: string, e: React.MouseEvent) => {
    e.stopPropagation()
    universalMarketService.toggleFavorite(symbol)
    // Update the local state
    setMarkets(prev => prev.map(market => 
      market.symbol === symbol 
        ? { ...market, isFavorite: !market.isFavorite }
        : market
    ))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1a2332] rounded-lg w-[800px] h-[600px] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-[#2a3441] flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-[#00d4aa] flex items-center justify-center">
                <span className="text-black font-bold text-sm">A</span>
              </div>
              <span className="text-white font-bold text-lg">{currentMarket}</span>
              <TrendingUpIcon className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <div>
                <span className="text-gray-400">Exchange:</span>
                <span className="text-white ml-1">{selectedExchange}</span>
              </div>
              <div>
                <span className="text-gray-400">Market Type:</span>
                <span className="text-white ml-1">PERP</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            ×
          </button>
        </div>

        {/* Search and Filters */}
        <div className="p-4 border-b border-[#2a3441]">
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0f1419] border border-[#2a3441] rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-[#00d4aa]"
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setFilterType('Strict')}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                  filterType === 'Strict'
                    ? 'bg-[#00d4aa] text-black'
                    : 'bg-[#2a3441] text-gray-300 hover:text-white'
                }`}
              >
                Strict
              </button>
              <button
                onClick={() => setFilterType('All')}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                  filterType === 'All'
                    ? 'bg-[#00d4aa] text-black'
                    : 'bg-[#2a3441] text-gray-300 hover:text-white'
                }`}
              >
                All
              </button>
            </div>
          </div>

        </div>

        {/* Markets Table */}
        <div className="flex-1 overflow-auto">
          <div className="sticky top-0 bg-[#1a2332] border-b border-[#2a3441]">
            <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs text-gray-400 font-medium">
              <div className="col-span-2">Symbol</div>
              <div className="col-span-2 text-right">Last Price</div>
              <div className="col-span-2 text-right">24hr Change</div>
              <div className="col-span-2 text-right">8hr Funding</div>
              <div className="col-span-2 text-right">Volume</div>
              <div className="col-span-2 text-right">Open Interest</div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-400">Loading markets...</div>
            </div>
          ) : (
            <div>
              {filteredMarkets.map((market) => (
                <button
                  key={market.symbol}
                  onClick={() => {
                    onSelectMarket(market)
                    onClose()
                  }}
                  className={`w-full grid grid-cols-12 gap-4 px-4 py-3 text-xs hover:bg-[#2a3441] transition-colors ${
                    market.symbol === currentMarket ? 'bg-[#2a3441]' : ''
                  }`}
                >
                  <div className="col-span-2 flex items-center space-x-2">
                    <button
                      onClick={(e) => handleToggleFavorite(market.symbol, e)}
                      className="hover:scale-110 transition-transform"
                    >
                      <StarIcon
                        className={`w-4 h-4 ${
                          market.isFavorite ? 'text-yellow-400 fill-current' : 'text-gray-600'
                        }`}
                      />
                    </button>
                    <span className="text-white font-medium">{market.symbol}</span>
                    <span className="text-gray-400">{market.maxLeverage}x</span>
                  </div>
                  <div className="col-span-2 text-right text-white">{market.price}</div>
                  <div className={`col-span-2 text-right ${
                    market.change24h >= 0 ? 'text-[#00d4aa]' : 'text-red-400'
                  }`}>
                    {market.change24h >= 0 ? '+' : ''}{market.change24h.toFixed(2)} / {market.changePercent24h}
                  </div>
                  <div className={`col-span-2 text-right ${
                    market.fundingRate.startsWith('-') ? 'text-red-400' : 'text-gray-300'
                  }`}>
                    {market.fundingRate}
                  </div>
                  <div className="col-span-2 text-right text-gray-300">{market.volume24h}</div>
                  <div className="col-span-2 text-right text-gray-300">{market.openInterest}</div>
                </button>
              ))}
              {filteredMarkets.length === 0 && !isLoading && (
                <div className="text-center py-12 text-gray-400">
                  No markets found
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export { MarketSelector }