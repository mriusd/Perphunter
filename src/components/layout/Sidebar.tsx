import React from 'react'
import { 
  BarChart3Icon, 
  TrendingUpIcon, 
  WalletIcon, 
  HistoryIcon,
  SettingsIcon,
  ExternalLinkIcon
} from 'lucide-react'
import { cn } from '../../utils/cn'

interface SidebarProps {
  className?: string
}

const navigation = [
  { name: 'Dashboard', icon: BarChart3Icon, href: '/', current: true },
  { name: 'Trading', icon: TrendingUpIcon, href: '/trading', current: false },
  { name: 'Portfolio', icon: WalletIcon, href: '/portfolio', current: false },
  { name: 'History', icon: HistoryIcon, href: '/history', current: false },
]

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  return (
    <div className={cn('flex w-64 flex-col bg-gray-900 border-r border-gray-800', className)}>
      <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
        <div className="flex flex-1 flex-col">
          <nav className="flex-1 space-y-1 px-4">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={cn(
                  item.current
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors'
                )}
              >
                <item.icon
                  className={cn(
                    item.current ? 'text-white' : 'text-gray-400 group-hover:text-white',
                    'mr-3 h-5 w-5 flex-shrink-0'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </a>
            ))}
          </nav>

          <div className="mt-8">
            <div className="px-4 mb-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                DEX Links
              </h3>
            </div>
            <nav className="space-y-1 px-4">
              <a
                href="https://app.hyperliquid.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors"
              >
                <ExternalLinkIcon className="text-gray-400 group-hover:text-white mr-3 h-4 w-4 flex-shrink-0" />
                Hyperliquid
              </a>
              <a
                href="https://lighter.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors"
              >
                <ExternalLinkIcon className="text-gray-400 group-hover:text-white mr-3 h-4 w-4 flex-shrink-0" />
                Lighter
              </a>
            </nav>
          </div>
        </div>

        <div className="px-4 py-4 border-t border-gray-800">
          <a
            href="#"
            className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors"
          >
            <SettingsIcon className="text-gray-400 group-hover:text-white mr-3 h-5 w-5 flex-shrink-0" />
            Settings
          </a>
        </div>
      </div>
    </div>
  )
}

export { Sidebar }