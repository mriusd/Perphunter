import { useTerminalStore } from './store/useTerminalStore';
import { useHyperliquidWebSocket } from './exchanges/hyperliquid/useWebSocket';
import { useEffect, useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { TerminalHeader } from './components/terminal/TerminalHeader';
import { TerminalWindow } from './components/terminal/TerminalWindow';
import { OrderBook } from './components/terminal/OrderBook';
import { TVChart as Chart } from './components/terminal/TVChart';
import { TradeForm } from './components/terminal/TradeForm';
import { Positions } from './components/terminal/Positions';
import { MarketStats } from './components/terminal/MarketStats';

import './styles/globals.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

function App() {
  const fetchMarkets = useTerminalStore(state => state.fetchMarkets);
  
  // Initialize WebSockets
  useHyperliquidWebSocket();
  // useLighterWebSocket();
  
  useEffect(() => {
    fetchMarkets();
    const interval = setInterval(fetchMarkets, 10000);
    return () => clearInterval(interval);
  }, [fetchMarkets]);

  const [layouts, setLayouts] = useState({
    lg: [
      { i: 'chart', x: 0, y: 0, w: 9, h: 20, minW: 4, minH: 10 },
      { i: 'orderbook', x: 9, y: 0, w: 3, h: 14, minW: 2, minH: 8 },
      { i: 'trade', x: 9, y: 14, w: 3, h: 16, minW: 2, minH: 10 },
      { i: 'positions', x: 0, y: 20, w: 9, h: 10, minW: 4, minH: 4 },
    ]
  });

  return (
    <div className="h-screen w-screen flex flex-col bg-cosmic-bg text-cosmic-text overflow-hidden relative font-mono">
      <div className="scanlines pointer-events-none z-50"></div>
      <div className="cyber-grid pointer-events-none z-0"></div>
      
      <TerminalHeader />
      
      <div className="flex-1 overflow-hidden relative z-10">
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={20}
          draggableHandle=".grid-drag-handle"
          margin={[12, 12]}
          onLayoutChange={(_, allLayouts) => setLayouts(allLayouts as any)}
          isDraggable={true}
          isResizable={true}
        >
          <div key="chart">
            <TerminalWindow title="MARKET OVERVIEW" className="h-full">
              <div className="flex flex-col h-full">
                <MarketStats />
                <div className="flex-1 relative">
                   <Chart />
                </div>
              </div>
            </TerminalWindow>
          </div>

          <div key="orderbook">
            <TerminalWindow title="ORDER BOOK" className="h-full">
              <OrderBook />
            </TerminalWindow>
          </div>

          <div key="trade">
            <TerminalWindow title="EXECUTION" className="h-full">
              <TradeForm />
            </TerminalWindow>
          </div>

          <div key="positions">
            <TerminalWindow title="OPEN POSITIONS" className="h-full">
              <Positions />
            </TerminalWindow>
          </div>

        </ResponsiveGridLayout>
      </div>
      
      <div className="fixed bottom-4 left-4 z-40 opacity-50 hover:opacity-100 transition-opacity">
        <button 
          onClick={() => window.location.reload()} 
          className="cyber-btn text-xs"
        >
          RESET TERMINAL
        </button>
      </div>
    </div>
  );
}

export default App;
