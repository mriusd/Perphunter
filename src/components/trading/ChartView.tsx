import React, { useState } from 'react'

const ChartView: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h')
  
  const timeframes = ['1m', '5m', '15m', '1h', '4h', '1d']
  
  const currentPrice = '0.41188'
  const change = '+0.01194'
  const changePercent = '+2.99%'
  const volume24h = '$1,394,608.33'
  const high24h = '0.41188'
  const low24h = '0.40002'

  return (
    <div className="bg-[#1a2332] h-full flex flex-col">
      {/* Chart Header */}
      <div className="p-3 border-b border-[#2a3441]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <h2 className="text-white font-medium">ADA-USDC</h2>
            <span className="text-xs bg-[#2a3441] text-gray-300 px-2 py-1 rounded">Perp</span>
          </div>
          
          <div className="flex items-center space-x-4 text-xs">
            <div>
              <span className="text-gray-400">24h Change:</span>
              <span className="text-white ml-1">{changePercent}</span>
            </div>
            <div>
              <span className="text-gray-400">24h Volume:</span>
              <span className="text-white ml-1">{volume24h}</span>
            </div>
            <div>
              <span className="text-gray-400">Funding / Countdown:</span>
              <span className="text-[#00d4aa] ml-1">0.0013% / 00:25:49</span>
            </div>
          </div>
        </div>
        
        {/* Price and Stats */}
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-white">{currentPrice}</span>
            <span className="text-[#00d4aa] font-medium">{change}</span>
            <span className="text-[#00d4aa]">({changePercent})</span>
          </div>
          
          <div className="flex items-center space-x-4 text-xs text-gray-400">
            <div>
              <span>High: </span>
              <span className="text-white">{high24h}</span>
            </div>
            <div>
              <span>Low: </span>
              <span className="text-white">{low24h}</span>
            </div>
            <div>
              <span>Mark: </span>
              <span className="text-white">{currentPrice}</span>
            </div>
            <div>
              <span>Index: </span>
              <span className="text-white">0.41187</span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="px-3 py-2 border-b border-[#2a3441]">
        <div className="flex items-center space-x-1">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setSelectedTimeframe(tf)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                selectedTimeframe === tf
                  ? 'bg-[#00d4aa] text-black font-medium'
                  : 'text-gray-400 hover:text-white hover:bg-[#2a3441]'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Area */}
      <div className="flex-1 p-4">
        <div className="w-full h-full bg-[#0f1419] rounded flex items-center justify-center border border-[#2a3441]">
          {/* Placeholder for actual chart */}
          <div className="text-center">
            <div className="text-gray-400 text-sm mb-2">Chart Placeholder</div>
            <div className="text-xs text-gray-500">
              TradingView or custom charting library integration would go here
            </div>
            <div className="mt-4 w-64 h-32 bg-gradient-to-r from-[#00d4aa] to-[#00a884] opacity-20 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { ChartView }