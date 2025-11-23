import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'

const History: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">History</h1>
        <p className="text-gray-400">View your transaction history across all DEXes</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-gray-400">Your transaction history will be displayed here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export { History }