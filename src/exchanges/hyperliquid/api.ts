import { Market } from '../../store/useTerminalStore';

interface HyperliquidMeta {
  universe: Array<{
    name: string;
    szDecimals: number;
    maxLeverage: number;
    onlyIsolated: boolean;
  }>;
}

interface HyperliquidAssetCtx {
  dayNtlVlm: string;
  funding: string;
  markPx: string;
  midPx: string;
  openInterest: string;
  prevDayPx: string;
}

export const fetchHyperliquidMarkets = async (): Promise<Market[]> => {
  try {
    // Fetch metadata and asset contexts in parallel
    const [metaRes, ctxRes] = await Promise.all([
      fetch('https://api.hyperliquid.xyz/info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'meta' })
      }),
      fetch('https://api.hyperliquid.xyz/info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'metaAndAssetCtxs' })
      })
    ]);

    const meta = await metaRes.json();
    const ctxs = await ctxRes.json();

    // Map the response to our Market interface
    return ctxs[0].universe.map((asset: any, index: number) => {
      const ctx = ctxs[1][index];
      const prevDayPx = parseFloat(ctx.prevDayPx);
      const markPx = parseFloat(ctx.markPx);
      const change24h = ((markPx - prevDayPx) / prevDayPx) * 100;

      return {
        symbol: `${asset.name}-USD`,
        base: asset.name,
        quote: 'USD',
        price: markPx,
        change24h: parseFloat(change24h.toFixed(2)),
        volume24h: parseFloat(ctx.dayNtlVlm),
        openInterest: parseFloat(ctx.openInterest) * markPx, // Convert to USD value
        fundingRate: parseFloat(ctx.funding) * 100 * 24, // Convert hourly funding to daily percentage
        dex: 'Hyperliquid'
      };
    });
  } catch (error) {
    console.error('Failed to fetch Hyperliquid markets:', error);
    return [];
  }
};

export interface HyperliquidCandle {
  t: number; // Open time
  T: number; // Close time
  s: string; // Symbol
  i: string; // Interval
  o: string; // Open
  c: string; // Close
  h: string; // High
  l: string; // Low
  v: string; // Volume
  n: number; // Number of trades
}

export const fetchHyperliquidCandles = async (
  coin: string, 
  resolution: string, 
  startTime: number, 
  endTime: number
): Promise<HyperliquidCandle[]> => {
  try {
    // Map TradingView resolution to Hyperliquid interval
    // TV: 1, 5, 15, 60, D, W
    // HL: 1m, 5m, 15m, 1h, 4h, 1d
    const intervalMap: Record<string, string> = {
        '1': '1m',
        '5': '5m',
        '15': '15m',
        '60': '1h',
        '240': '4h',
        'D': '1d',
        '1D': '1d',
        'W': '1w'
    };

    const interval = intervalMap[resolution] || '1h';

    const response = await fetch('https://api.hyperliquid.xyz/info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'candleSnapshot',
        req: {
          coin,
          interval,
          startTime: startTime,
          endTime: endTime
        }
      })
    });

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Failed to fetch Hyperliquid candles:', error);
    return [];
  }
};

export interface HyperliquidPosition {
  coin: string;
  szi: string; // Size
  entryPx: string;
  positionValue: string;
  unrealizedPnl: string;
  returnOnEquity: string;
  liquidationPx: string | null;
  leverage: {
    type: string;
    value: number;
  };
}

export const fetchHyperliquidPositions = async (user: string): Promise<HyperliquidPosition[]> => {
  try {
    const response = await fetch('https://api.hyperliquid.xyz/info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'clearinghouseState',
        user: user
      })
    });

    const data = await response.json();
    // data.assetPositions is the array we want
    if (data && data.assetPositions) {
        return data.assetPositions.map((pos: any) => ({
            coin: pos.position.coin,
            szi: pos.position.szi,
            entryPx: pos.position.entryPx,
            positionValue: pos.position.positionValue,
            unrealizedPnl: pos.position.unrealizedPnl,
            returnOnEquity: pos.position.returnOnEquity,
            liquidationPx: pos.position.liquidationPx,
            leverage: pos.position.leverage
        }));
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch Hyperliquid positions:', error);
    return [];
  }
};

export interface HyperliquidAccountSummary {
  accountValue: string;
  totalMarginUsed: string;
  totalNtlPos: string;
  marginSummary: {
    accountValue: string;
    totalMarginUsed: string;
    totalNtlPos: string;
    totalRawUsd: string;
  };
  crossMaintenanceMarginUsed: string;
  withdrawable: string;
}

export const fetchHyperliquidAccountSummary = async (user: string): Promise<HyperliquidAccountSummary | null> => {
    try {
        const response = await fetch('https://api.hyperliquid.xyz/info', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'clearinghouseState',
                user: user
            })
        });
        const data = await response.json();
        if (data && data.marginSummary) {
            return {
                accountValue: data.marginSummary.accountValue,
                totalMarginUsed: data.marginSummary.totalMarginUsed,
                totalNtlPos: data.marginSummary.totalNtlPos,
                marginSummary: data.marginSummary,
                crossMaintenanceMarginUsed: data.crossMaintenanceMarginUsed,
                withdrawable: data.withdrawable
            };
        }
        return null;
    } catch (error) {
        console.error('Failed to fetch Hyperliquid account summary:', error);
        return null;
    }
};

export interface HyperliquidOpenOrder {
    coin: string;
    side: string;
    limitPx: string;
    sz: string;
    oid: number;
    timestamp: number;
}

export const fetchHyperliquidOpenOrders = async (user: string): Promise<HyperliquidOpenOrder[]> => {
    try {
        const response = await fetch('https://api.hyperliquid.xyz/info', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'openOrders',
                user: user
            })
        });
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Failed to fetch Hyperliquid open orders:', error);
        return [];
    }
};

export interface HyperliquidFill {
    coin: string;
    px: string;
    sz: string;
    side: string;
    time: number;
    startPosition: string;
    dir: string; // "Open Long", "Close Short", etc.
    closedPnl: string;
    hash: string;
    oid: number;
    fee: string;
}

export const fetchHyperliquidUserFills = async (user: string): Promise<HyperliquidFill[]> => {
    try {
        const response = await fetch('https://api.hyperliquid.xyz/info', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'userFills',
                user: user
            })
        });
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Failed to fetch Hyperliquid user fills:', error);
        return [];
    }
};

export interface HyperliquidFunding {
    coin: string;
    usdc: string;
    szi: string;
    fundingRate: string;
    time: number;
}

export const fetchHyperliquidUserFunding = async (user: string): Promise<HyperliquidFunding[]> => {
    try {
        const response = await fetch('https://api.hyperliquid.xyz/info', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'userFunding',
                user: user,
                startTime: Date.now() - 7 * 24 * 60 * 60 * 1000 // Last 7 days
            })
        });
        const data = await response.json();
        
        if (Array.isArray(data)) {
            return data.map((item: any) => {
                // Funding updates are often wrapped in a 'delta' object
                const details = item.delta || item;
                return {
                    coin: details.coin || '',
                    usdc: details.usdc || '0',
                    szi: details.szi || '0',
                    fundingRate: details.fundingRate || '0',
                    time: item.time || Date.now()
                };
            }).sort((a, b) => b.time - a.time);
        }
        return [];
    } catch (error) {
        console.error('Failed to fetch Hyperliquid funding history:', error);
        return [];
    }
};

export interface HyperliquidHistoricalOrder {
    coin: string;
    side: string;
    limitPx: string;
    sz: string;
    oid: number;
    timestamp: number;
    status: string; // "filled", "canceled", etc.
    triggerCondition: string;
    isTrigger: boolean;
    triggerPx: string;
    children: any[];
    orderType: string;
    origSz: string;
    reduceOnly: boolean;
}

export const fetchHyperliquidHistoricalOrders = async (user: string): Promise<HyperliquidHistoricalOrder[]> => {
    try {
        const response = await fetch('https://api.hyperliquid.xyz/info', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'historicalOrders',
                user: user
            })
        });
        const data = await response.json();
        
        if (Array.isArray(data)) {
            return data.map((item: any) => {
                const o = item.order;
                return {
                    coin: o.coin,
                    side: o.side,
                    limitPx: o.limitPx,
                    sz: o.sz, // Remaining size
                    oid: o.oid,
                    timestamp: o.timestamp,
                    status: item.status,
                    triggerCondition: o.triggerCondition,
                    isTrigger: o.isTrigger,
                    triggerPx: o.triggerPx,
                    children: o.children || [],
                    orderType: o.orderType,
                    origSz: o.origSz,
                    reduceOnly: o.reduceOnly
                };
            }).sort((a, b) => b.timestamp - a.timestamp);
        }
        return [];
    } catch (error) {
        console.error('Failed to fetch Hyperliquid historical orders:', error);
        return [];
    }
};
