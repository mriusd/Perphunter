import React, { useState } from 'react'

interface Position {
  market: string
  side: 'Long' | 'Short'
  size: string
  entryPrice: string
  markPrice: string
  liqPrice: string
  margin: string
  pnl: string
  pnlPercent: string
  isProfit: boolean
}

interface Order {
  market: string
  side: 'Buy' | 'Sell'
  size: string
  price: string
  type: 'Limit' | 'Market'
  time: string
}

interface Trade {
  market: string
  side: 'Buy' | 'Sell'
  size: string
  price: string
  time: string
  fee: string
}

interface FundingPayment {
  market: string
  payment: string
  rate: string
  time: string
  isReceived: boolean
}

const BottomTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'positions' | 'orders' | 'history' | 'funding'>('positions')

  // Mock data
  const positions: Position[] = [
    {
      market: 'ETH',
      side: 'Long',
      size: '2.3 ETH',
      entryPrice: '2,500.00',
      markPrice: '2,480.00',
      liqPrice: '2,200.00',
      margin: '575.00',
      pnl: '-46.00',
      pnlPercent: '-1.84%',
      isProfit: false
    }
  ]

  const orders: Order[] = [
    {
      market: 'ADA-USDC',
      side: 'Buy',
      size: '1000',
      price: '0.41000',
      type: 'Limit',
      time: '14:23:45'
    }
  ]

  const trades: Trade[] = [
    {
      market: 'ADA-USDC',
      side: 'Buy',
      size: '500',
      price: '0.41150',
      time: '14:20:12',
      fee: '0.82'
    },
    {
      market: 'ADA-USDC',
      side: 'Sell',
      size: '300',
      price: '0.41200',
      time: '14:18:33',
      fee: '0.49'
    }
  ]

  const fundingPayments: FundingPayment[] = [
    {
      market: 'ETH',
      payment: '+0.12',
      rate: '0.0001%',
      time: '12:00:00',
      isReceived: true
    },
    {
      market: 'ADA',
      payment: '-0.05',
      rate: '0.0002%',
      time: '08:00:00',
      isReceived: false
    }
  ]

  const tabs = [
    { id: 'positions', label: 'Positions', count: positions.length },
    { id: 'orders', label: 'Open Orders', count: orders.length },
    { id: 'history', label: 'Trade History', count: trades.length },
    { id: 'funding', label: 'Funding History', count: fundingPayments.length },
  ]

  const renderPositions = () => (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-gray-400 border-b border-[#2a3441]">
            <th className="text-left py-2 px-3">Market</th>
            <th className="text-left py-2 px-3">Side</th>
            <th className="text-right py-2 px-3">Size</th>
            <th className="text-right py-2 px-3">Entry Price</th>
            <th className="text-right py-2 px-3">Mark Price</th>
            <th className="text-right py-2 px-3">Liq. Price</th>
            <th className="text-right py-2 px-3">Margin</th>
            <th className="text-right py-2 px-3">PnL</th>
          </tr>
        </thead>
        <tbody>
          {positions.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center py-8 text-gray-400">
                No open positions
              </td>
            </tr>
          ) : (
            positions.map((position, index) => (
              <tr key={index} className="border-b border-[#2a3441] hover:bg-[#2a3441]">
                <td className="py-2 px-3 text-white font-medium">{position.market}</td>
                <td className="py-2 px-3">
                  <span className={`px-2 py-1 rounded text-xs ${
                    position.side === 'Long' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {position.side}
                  </span>
                </td>
                <td className="py-2 px-3 text-right text-gray-300">{position.size}</td>
                <td className="py-2 px-3 text-right text-gray-300">${position.entryPrice}</td>
                <td className="py-2 px-3 text-right text-gray-300">${position.markPrice}</td>
                <td className="py-2 px-3 text-right text-gray-300">${position.liqPrice}</td>
                <td className="py-2 px-3 text-right text-gray-300">${position.margin}</td>
                <td className="py-2 px-3 text-right">
                  <div className={position.isProfit ? 'text-green-400' : 'text-red-400'}>
                    <div>${position.pnl}</div>
                    <div className="text-xs">{position.pnlPercent}</div>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )

  const renderOrders = () => (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-gray-400 border-b border-[#2a3441]">
            <th className="text-left py-2 px-3">Market</th>
            <th className="text-left py-2 px-3">Side</th>
            <th className="text-right py-2 px-3">Size</th>
            <th className="text-right py-2 px-3">Price</th>
            <th className="text-left py-2 px-3">Type</th>
            <th className="text-left py-2 px-3">Time</th>
            <th className="text-right py-2 px-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-8 text-gray-400">
                No open orders
              </td>
            </tr>
          ) : (
            orders.map((order, index) => (
              <tr key={index} className="border-b border-[#2a3441] hover:bg-[#2a3441]">
                <td className="py-2 px-3 text-white font-medium">{order.market}</td>
                <td className="py-2 px-3">
                  <span className={`text-xs ${
                    order.side === 'Buy' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {order.side}
                  </span>
                </td>
                <td className="py-2 px-3 text-right text-gray-300">{order.size}</td>
                <td className="py-2 px-3 text-right text-gray-300">${order.price}</td>
                <td className="py-2 px-3 text-gray-300">{order.type}</td>
                <td className="py-2 px-3 text-gray-300">{order.time}</td>
                <td className="py-2 px-3 text-right">
                  <button className="text-red-400 hover:text-red-300 text-xs">
                    Cancel
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )

  const renderHistory = () => (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-gray-400 border-b border-[#2a3441]">
            <th className="text-left py-2 px-3">Market</th>
            <th className="text-left py-2 px-3">Side</th>
            <th className="text-right py-2 px-3">Size</th>
            <th className="text-right py-2 px-3">Price</th>
            <th className="text-left py-2 px-3">Time</th>
            <th className="text-right py-2 px-3">Fee</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((trade, index) => (
            <tr key={index} className="border-b border-[#2a3441] hover:bg-[#2a3441]">
              <td className="py-2 px-3 text-white font-medium">{trade.market}</td>
              <td className="py-2 px-3">
                <span className={`text-xs ${
                  trade.side === 'Buy' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {trade.side}
                </span>
              </td>
              <td className="py-2 px-3 text-right text-gray-300">{trade.size}</td>
              <td className="py-2 px-3 text-right text-gray-300">${trade.price}</td>
              <td className="py-2 px-3 text-gray-300">{trade.time}</td>
              <td className="py-2 px-3 text-right text-gray-300">${trade.fee}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderFunding = () => (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-gray-400 border-b border-[#2a3441]">
            <th className="text-left py-2 px-3">Market</th>
            <th className="text-right py-2 px-3">Payment</th>
            <th className="text-right py-2 px-3">Rate</th>
            <th className="text-left py-2 px-3">Time</th>
          </tr>
        </thead>
        <tbody>
          {fundingPayments.map((funding, index) => (
            <tr key={index} className="border-b border-[#2a3441] hover:bg-[#2a3441]">
              <td className="py-2 px-3 text-white font-medium">{funding.market}</td>
              <td className={`py-2 px-3 text-right ${
                funding.isReceived ? 'text-green-400' : 'text-red-400'
              }`}>
                ${funding.payment}
              </td>
              <td className="py-2 px-3 text-right text-gray-300">{funding.rate}</td>
              <td className="py-2 px-3 text-gray-300">{funding.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'positions':
        return renderPositions()
      case 'orders':
        return renderOrders()
      case 'history':
        return renderHistory()
      case 'funding':
        return renderFunding()
      default:
        return renderPositions()
    }
  }

  return (
    <div className="bg-[#1a2332] h-full flex flex-col">
      {/* Tab Headers */}
      <div className="flex border-b border-[#2a3441]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.id
                ? 'text-white bg-[#2a3441]'
                : 'text-gray-400 hover:text-white hover:bg-[#2a3441]/50'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="ml-2 bg-[#00d4aa] text-black text-xs px-1.5 py-0.5 rounded">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto">
        {renderContent()}
      </div>
    </div>
  )
}

export { BottomTabs }