import React from 'react'

interface OrderBookEntry {
  price: number
  size: number
  total: number
}

const OrderBook: React.FC = () => {
  // Mock order book data
  const asks: OrderBookEntry[] = [
    { price: 0.41205, size: 2809, total: 15735 },
    { price: 0.41204, size: 3819, total: 12926 },
    { price: 0.41203, size: 1562, total: 9107 },
    { price: 0.41202, size: 243, total: 7545 },
    { price: 0.41201, size: 5686, total: 7302 },
    { price: 0.41200, size: 1616, total: 1616 },
  ]

  const bids: OrderBookEntry[] = [
    { price: 0.41177, size: 7600, total: 1700 },
    { price: 0.41176, size: 3708, total: 9408 },
    { price: 0.41175, size: 3733, total: 13141 },
    { price: 0.41174, size: 19366, total: 32507 },
    { price: 0.41173, size: 13201, total: 45708 },
    { price: 0.41172, size: 14817, total: 60525 },
  ]

  const spread = 0.00063
  const spreadPercent = 0.0076

  const formatPrice = (price: number) => price.toFixed(5)
  const formatSize = (size: number) => size.toLocaleString()

  return (
    <div className="bg-[#1a2332] h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-[#2a3441]">
        <h3 className="text-white font-medium text-sm">Order Book</h3>
      </div>

      {/* Order Book Content */}
      <div className="flex-1 overflow-hidden">
        {/* Column Headers */}
        <div className="grid grid-cols-3 gap-4 px-3 py-2 text-xs text-gray-400 border-b border-[#2a3441]">
          <div className="text-right">Price (USDC)</div>
          <div className="text-right">Size (ADA)</div>
          <div className="text-right">Total</div>
        </div>

        {/* Asks */}
        <div className="flex-1">
          {asks.reverse().map((ask, index) => (
            <div key={index} className="grid grid-cols-3 gap-4 px-3 py-1 text-xs hover:bg-[#2a3441] relative">
              {/* Background bar for size visualization */}
              <div 
                className="absolute right-0 top-0 h-full bg-red-500 opacity-10"
                style={{ width: `${(ask.size / Math.max(...asks.map(a => a.size))) * 100}%` }}
              />
              <div className="text-right text-red-400 relative z-10">{formatPrice(ask.price)}</div>
              <div className="text-right text-gray-300 relative z-10">{formatSize(ask.size)}</div>
              <div className="text-right text-gray-400 relative z-10">{formatSize(ask.total)}</div>
            </div>
          ))}
        </div>

        {/* Spread */}
        <div className="px-3 py-2 bg-[#2a3441] text-xs">
          <div className="text-center text-gray-400">
            Spread: {spread.toFixed(5)} ({spreadPercent.toFixed(4)}%)
          </div>
        </div>

        {/* Bids */}
        <div className="flex-1">
          {bids.map((bid, index) => (
            <div key={index} className="grid grid-cols-3 gap-4 px-3 py-1 text-xs hover:bg-[#2a3441] relative">
              {/* Background bar for size visualization */}
              <div 
                className="absolute right-0 top-0 h-full bg-green-500 opacity-10"
                style={{ width: `${(bid.size / Math.max(...bids.map(b => b.size))) * 100}%` }}
              />
              <div className="text-right text-green-400 relative z-10">{formatPrice(bid.price)}</div>
              <div className="text-right text-gray-300 relative z-10">{formatSize(bid.size)}</div>
              <div className="text-right text-gray-400 relative z-10">{formatSize(bid.total)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export { OrderBook }