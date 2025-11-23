import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { useTradingData } from '@/hooks/useTradingData'
import { Position } from '@/types'

const PositionsTable: React.FC = () => {
  const { positions, isLoading, error } = useTradingData()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-800 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-400">Error loading positions</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Open Positions</CardTitle>
      </CardHeader>
      <CardContent>
        {positions.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No open positions</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-800">
                  <th className="pb-2">Market</th>
                  <th className="pb-2">Side</th>
                  <th className="pb-2">Size</th>
                  <th className="pb-2">Entry Price</th>
                  <th className="pb-2">Mark Price</th>
                  <th className="pb-2">PnL</th>
                  <th className="pb-2">DEX</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((position) => (
                  <PositionRow key={position.id} position={position} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

const PositionRow: React.FC<{ position: Position }> = ({ position }) => {
  const isProfit = position.pnl >= 0
  
  return (
    <tr className="border-b border-gray-800 text-sm">
      <td className="py-3 font-medium text-white">{position.market}</td>
      <td className="py-3">
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          position.side === 'long' 
            ? 'bg-green-500/20 text-green-400' 
            : 'bg-red-500/20 text-red-400'
        }`}>
          {position.side.toUpperCase()}
        </span>
      </td>
      <td className="py-3 text-gray-300">{position.size}</td>
      <td className="py-3 text-gray-300">${position.entryPrice}</td>
      <td className="py-3 text-gray-300">${position.markPrice}</td>
      <td className="py-3">
        <div className={isProfit ? 'text-green-400' : 'text-red-400'}>
          <div className="font-medium">
            {isProfit ? '+' : ''}${position.pnl.toFixed(2)}
          </div>
          <div className="text-xs">
            {isProfit ? '+' : ''}{position.pnlPercentage.toFixed(2)}%
          </div>
        </div>
      </td>
      <td className="py-3">
        <span className="px-2 py-1 rounded text-xs bg-gray-700 text-gray-300">
          {position.dex}
        </span>
      </td>
    </tr>
  )
}

export { PositionsTable }