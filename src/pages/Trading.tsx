import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { OrderForm } from '@/components/trading/OrderForm'

const Trading: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Trading</h1>
        <p className="text-gray-400">Place orders across multiple perpetual futures DEXes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Price Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex items-center justify-center bg-gray-800 rounded-lg">
                <p className="text-gray-400">Chart will be integrated here</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <OrderForm />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Book</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-gray-400">Order book will be displayed here</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-gray-400">Recent trades will be shown here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export { Trading }