import React from 'react'
import { WalletIcon, TrendingUpIcon } from 'lucide-react'
import { Button } from '../ui'
import { useWallet } from '../../hooks/useWallet'

const Header: React.FC = () => {
  const { wallet, connect, disconnect } = useWallet()

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <header className="border-b border-gray-800 bg-gray-900">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-3">
          <TrendingUpIcon className="h-8 w-8 text-blue-500" />
          <h1 className="text-xl font-bold text-gradient">PerpHunter</h1>
          <span className="rounded-full bg-blue-600/20 px-2 py-1 text-xs text-blue-400">
            Beta
          </span>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-gray-300 hover:text-white transition-colors">
            Dashboard
          </a>
          <a href="#" className="text-gray-300 hover:text-white transition-colors">
            Trading
          </a>
          <a href="#" className="text-gray-300 hover:text-white transition-colors">
            Portfolio
          </a>
          <a href="#" className="text-gray-300 hover:text-white transition-colors">
            History
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          {wallet.isConnected ? (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-300">
                {formatAddress(wallet.address!)}
              </span>
              <Button variant="secondary" size="sm" onClick={disconnect}>
                Disconnect
              </Button>
            </div>
          ) : (
            <Button 
              onClick={connect}
              loading={wallet.isConnecting}
              className="flex items-center space-x-2"
            >
              <WalletIcon className="h-4 w-4" />
              <span>Connect Wallet</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

export { Header }