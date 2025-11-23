import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { useTradingData } from '@/hooks/useTradingData'
import { Balance } from '@/types'

const BalancesCard: React.FC = () => {
  const { balances, isLoading, error } = useTradingData()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Balances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 bg-gray-800 rounded"></div>
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
          <CardTitle>Balances</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-400">Error loading balances</p>
        </CardContent>
      </Card>
    )
  }

  const totalValue = balances.reduce((sum, balance) => sum + balance.usdValue, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Balances</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border-b border-gray-800 pb-3">
            <div className="text-2xl font-bold text-white">
              ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-sm text-gray-400">Total Value</div>
          </div>

          {balances.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No balances found</p>
          ) : (
            <div className="space-y-3">
              {balances.map((balance, index) => (
                <BalanceItem key={`${balance.dex}-${balance.token}-${index}`} balance={balance} />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

const BalanceItem: React.FC<{ balance: Balance }> = ({ balance }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
          <span className="text-xs font-medium text-white">
            {balance.token.slice(0, 2)}
          </span>
        </div>
        <div>
          <div className="font-medium text-white">{balance.token}</div>
          <div className="text-xs text-gray-400">
            <span className="px-1.5 py-0.5 rounded text-xs bg-gray-700">
              {balance.dex}
            </span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-medium text-white">
          {parseFloat(balance.amount).toLocaleString(undefined, { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 6 
          })}
        </div>
        <div className="text-sm text-gray-400">
          ${balance.usdValue.toLocaleString(undefined, { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
          })}
        </div>
      </div>
    </div>
  )
}

export { BalancesCard }