import React, { useEffect, useRef } from 'react';
import { useTerminalStore } from '../../store/useTerminalStore';
import { fetchHyperliquidCandles } from '../../exchanges/hyperliquid/api';

// Datafeed implementation simulating real-time data
const Datafeed = {
  onReady: (callback: any) => {
    setTimeout(() => callback({
      supported_resolutions: ["1", "5", "15", "60", "240", "D"],
      supports_time: true,
    }), 0);
  },
  searchSymbols: (userInput: string, exchange: string, symbolType: string, onResultReadyCallback: any) => {
    const markets = Object.values(useTerminalStore.getState().markets).flat();
    const results = markets
        .filter(m => m.symbol.toLowerCase().includes(userInput.toLowerCase()))
        .map(m => ({
            symbol: m.symbol,
            full_name: m.symbol,
            description: m.symbol,
            exchange: 'Hyperliquid',
            type: 'crypto'
        }));
    onResultReadyCallback(results);
  },
  resolveSymbol: (symbolName: string, onSymbolResolvedCallback: any, onResolveErrorCallback: any) => {
    setTimeout(() => {
      onSymbolResolvedCallback({
        name: symbolName,
        description: symbolName.replace('-', ' / '),
        type: 'crypto',
        session: '24x7',
        timezone: 'Etc/UTC',
        exchange: 'Hyperliquid',
        minmov: 1,
        pricescale: 100, // TODO: dynamic precision based on market
        has_intraday: true,
        has_no_volume: false,
        supported_resolutions: ["1", "5", "15", "60", "240", "D"],
        volume_precision: 2,
        data_status: 'streaming',
      });
    }, 0);
  },
  getBars: async (symbolInfo: any, resolution: string, periodParams: any, onHistoryCallback: any, onErrorCallback: any) => {
    const { from, to, firstDataRequest } = periodParams;
    
    try {
        // Extract coin name from symbol (e.g. "BTC-USD" -> "BTC")
        const coin = symbolInfo.name.split('-')[0];
        
        const candles = await fetchHyperliquidCandles(
            coin, 
            resolution, 
            from * 1000, 
            to * 1000
        );

        if (!candles || candles.length === 0) {
            onHistoryCallback([], { noData: true });
            return;
        }

        const bars = candles.map(c => ({
            time: c.t,
            open: parseFloat(c.o),
            high: parseFloat(c.h),
            low: parseFloat(c.l),
            close: parseFloat(c.c),
            volume: parseFloat(c.v)
        }));

        // Update last price for the realtime subscription simulation/anchor
        if (firstDataRequest && bars.length > 0) {
            window.lastPrice = bars[bars.length - 1].close;
            // Store average volume for simulation
            const avgVol = bars.reduce((sum, b) => sum + b.volume, 0) / bars.length;
            window.avgVolume = avgVol;
        }

        onHistoryCallback(bars, { noData: false });
    } catch (error) {
        console.error('Error fetching bars:', error);
        onErrorCallback(error);
    }
  },
  subscribeBars: (symbolInfo: any, resolution: string, onRealtimeCallback: any, subscriberUID: string, onResetCacheNeededCallback: any) => {
    // Simulate real-time updates using actual market price from store if available
    const interval = setInterval(() => {
        const state = useTerminalStore.getState();
        const market = Object.values(state.markets).flat().find(m => m.symbol === symbolInfo.name);
        
        // Use real price if available, otherwise fallback to mock simulation
        let currentPrice = market?.price;
        
        if (!currentPrice && window.lastPrice) {
             const volatility = window.lastPrice * 0.0001;
             currentPrice = window.lastPrice + (Math.random() - 0.5) * volatility;
        }
        
        if (!currentPrice) currentPrice = 1000;
        
        window.lastPrice = currentPrice;

        // Calculate realistic volume increment
        // If we have avgVolume from history, use a small fraction of it per tick
        // 100ms tick = 10 ticks/sec = 600 ticks/min
        // So vol per tick should be approx avgVolume / 600
        const avgVol = window.avgVolume || 1000;
        const volPerTick = avgVol / 600; 
        const volume = volPerTick * (0.5 + Math.random()); // Randomize slightly

        onRealtimeCallback({
            time: Date.now(),
            open: currentPrice,
            high: currentPrice,
            low: currentPrice,
            close: currentPrice,
            volume: volume
        });
    }, 100); // Update faster to match websocket feel
    
    window.intervals = window.intervals || {};
    window.intervals[subscriberUID] = interval;
  },
  unsubscribeBars: (subscriberUID: string) => {
    if (window.intervals && window.intervals[subscriberUID]) {
        clearInterval(window.intervals[subscriberUID]);
    }
  }
};

declare global {
  interface Window {
    TradingView: any;
    lastPrice: number;
    avgVolume: number;
    intervals: Record<string, any>;
  }
}

export const TVChart: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);
  const selectedMarket = useTerminalStore(state => state.selectedMarket);

  // Initialize Chart
  useEffect(() => {
    if (!containerRef.current || !window.TradingView) return;

    const widgetOptions = {
      symbol: selectedMarket.symbol, // Use initial selected market
      datafeed: Datafeed,
      interval: '1',
      container: containerRef.current,
      library_path: '/charting_library/',
      locale: 'en',
      disabled_features: [
        'use_localstorage_for_settings',
        'header_symbol_search',
        'header_compare', 
        'header_screenshot',
      ],
      enabled_features: ['hide_left_toolbar_by_default'],
      fullscreen: false,
      autosize: true,
      theme: 'Dark',
      custom_css_url: '/tv_custom.css',
      overrides: {
        "paneProperties.background": "#050508",
        "paneProperties.vertGridProperties.color": "#1a1a2e",
        "paneProperties.horzGridProperties.color": "#1a1a2e",
        "scalesProperties.textColor": "#4a4a6a",
        "mainSeriesProperties.candleStyle.upColor": "#00ff9d",
        "mainSeriesProperties.candleStyle.downColor": "#ff003c",
        "mainSeriesProperties.candleStyle.wickUpColor": "#00ff9d",
        "mainSeriesProperties.candleStyle.wickDownColor": "#ff003c",
        "mainSeriesProperties.candleStyle.borderUpColor": "#00ff9d",
        "mainSeriesProperties.candleStyle.borderDownColor": "#ff003c",
      },
      loading_screen: { backgroundColor: "#050508" },
    };

    const tvWidget = new window.TradingView.widget(widgetOptions);
    widgetRef.current = tvWidget;
    
    tvWidget.onChartReady(() => {
        widgetRef.current = tvWidget;
    });

    return () => {
      if (widgetRef.current) {
        widgetRef.current.remove();
        widgetRef.current = null;
      }
    };
  }, []); // Only run once on mount

  // Update symbol when selectedMarket changes
  useEffect(() => {
    // Check if widget exists and is ready
    if (widgetRef.current && typeof widgetRef.current.activeChart === 'function') {
        try {
            const currentSymbol = widgetRef.current.activeChart().symbol();
            if (currentSymbol !== selectedMarket.symbol) {
                widgetRef.current.activeChart().setSymbol(selectedMarket.symbol, '1');
            }
        } catch (e) {
            console.log('Chart not ready yet');
        }
    }
  }, [selectedMarket.symbol]);

  return (
    <div ref={containerRef} className="w-full h-full relative" />
  );
};
