import React from 'react'

interface TradingLayoutProps {
  children: React.ReactNode
}

const TradingLayout: React.FC<TradingLayoutProps> = ({ children }) => {
  return (
    <div className="h-screen bg-[#0f1419] text-white overflow-hidden">
      <div className="h-full grid grid-rows-[auto_1fr]">
        {children}
      </div>
    </div>
  )
}

export { TradingLayout }