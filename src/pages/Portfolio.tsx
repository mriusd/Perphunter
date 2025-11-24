import React from 'react'
import { PositionsTable } from '../components/portfolio/PositionsTable'
import { BalancesCard } from '../components/portfolio/BalancesCard'

const Portfolio: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Portfolio</h1>
        <p className="text-gray-400">Manage your positions and balances across all DEXes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PositionsTable />
        </div>
        <div>
          <BalancesCard />
        </div>
      </div>
    </div>
  )
}

export { Portfolio }