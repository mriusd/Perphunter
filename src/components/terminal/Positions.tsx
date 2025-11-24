import React, { useEffect, useState, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { 
    fetchHyperliquidPositions, 
    fetchHyperliquidAccountSummary,
    fetchHyperliquidOpenOrders,
    fetchHyperliquidUserFills,
    fetchHyperliquidUserFunding,
    fetchHyperliquidHistoricalOrders,
    HyperliquidPosition,
    HyperliquidAccountSummary,
    HyperliquidOpenOrder,
    HyperliquidFill,
    HyperliquidFunding,
    HyperliquidHistoricalOrder
} from '../../exchanges/hyperliquid/api';
import { MoneyValue } from './MoneyValue';

type Tab = 'POSITIONS' | 'BALANCES' | 'OPEN ORDERS' | 'TRADES' | 'FUNDING' | 'ORDER HISTORY';
type SortDirection = 'asc' | 'desc';
interface SortConfig { key: string; direction: SortDirection }

const getSortedData = <T,>(data: T[], sortConfig: SortConfig | null, getValue: (item: T, key: string) => string | number) => {
    if (!sortConfig) return data;
    return [...data].sort((a, b) => {
        const valA = getValue(a, sortConfig.key);
        const valB = getValue(b, sortConfig.key);
        
        if (typeof valA === 'number' && typeof valB === 'number') {
            return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
        }
        return sortConfig.direction === 'asc' 
            ? String(valA).localeCompare(String(valB)) 
            : String(valB).localeCompare(String(valA));
    });
};

const SortableHeader: React.FC<{
    label: string,
    sortKey: string,
    currentSort: SortConfig | null,
    onSort: (key: string) => void,
    align?: 'left' | 'right' | 'center',
    className?: string
}> = ({ label, sortKey, currentSort, onSort, align = 'left', className = '' }) => {
    const isActive = currentSort?.key === sortKey;
    return (
        <th 
            className={`p-3 cursor-pointer hover:text-white transition-colors select-none ${align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'} ${className}`}
            onClick={() => onSort(sortKey)}
        >
            <div className={`flex items-center gap-1 ${align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start'}`}>
                {label}
                <div className="text-cosmic-cyan/50">
                    {isActive && currentSort.direction === 'asc' ? <ChevronUp size={12} className="text-cosmic-cyan" /> : 
                     isActive && currentSort.direction === 'desc' ? <ChevronDown size={12} className="text-cosmic-cyan" /> : 
                     <ChevronsUpDown size={12} className="opacity-30" />}
                </div>
            </div>
        </th>
    );
};

export const Positions: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<Tab>('POSITIONS');
  
  const [positions, setPositions] = useState<HyperliquidPosition[]>([]);
  const [summary, setSummary] = useState<HyperliquidAccountSummary | null>(null);
  const [openOrders, setOpenOrders] = useState<HyperliquidOpenOrder[]>([]);
  const [fills, setFills] = useState<HyperliquidFill[]>([]);
  const [funding, setFunding] = useState<HyperliquidFunding[]>([]);
  const [history, setHistory] = useState<HyperliquidHistoricalOrder[]>([]);
  
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
      if (!isConnected || !address) return;
      
      setLoading(true);
      try {
          switch (activeTab) {
              case 'POSITIONS':
                  setPositions(await fetchHyperliquidPositions(address));
                  break;
              case 'BALANCES':
                  setSummary(await fetchHyperliquidAccountSummary(address));
                  break;
              case 'OPEN ORDERS':
                  setOpenOrders(await fetchHyperliquidOpenOrders(address));
                  break;
              case 'TRADES':
                  setFills(await fetchHyperliquidUserFills(address));
                  break;
              case 'FUNDING':
                  setFunding(await fetchHyperliquidUserFunding(address));
                  break;
              case 'ORDER HISTORY':
                  setHistory(await fetchHyperliquidHistoricalOrders(address));
                  break;
          }
      } catch (e) {
          console.error('Error loading tab data:', e);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, [isConnected, address, activeTab]);

  if (!isConnected) {
    return (
      <div className="w-full h-full flex flex-col">
        <TabHeader activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 flex items-center justify-center font-mono text-xs bg-cosmic-bg/30 text-cosmic-dim">
            CONNECT WALLET TO VIEW {activeTab}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col font-mono text-xs bg-cosmic-bg/30">
      <TabHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 overflow-auto relative">
        {loading && (
            <div className="absolute top-0 left-0 w-full h-0.5 bg-cosmic-cyan/20 overflow-hidden">
                <div className="h-full bg-cosmic-cyan animate-progress origin-left"></div>
            </div>
        )}
        
        {activeTab === 'POSITIONS' && <PositionsTable positions={positions} loading={loading} />}
        {activeTab === 'BALANCES' && <BalancesView summary={summary} loading={loading} />}
        {activeTab === 'OPEN ORDERS' && <OpenOrdersTable orders={openOrders} loading={loading} />}
        {activeTab === 'TRADES' && <TradesTable fills={fills} loading={loading} />}
        {activeTab === 'FUNDING' && <FundingTable funding={funding} loading={loading} />}
        {activeTab === 'ORDER HISTORY' && <HistoryTable orders={history} loading={loading} />}
      </div>
    </div>
  );
};

const TabHeader: React.FC<{ activeTab: Tab, setActiveTab: (t: Tab) => void }> = ({ activeTab, setActiveTab }) => (
    <div className="flex border-b border-cosmic-dim/30 bg-cosmic-dim/10">
        {(['BALANCES', 'POSITIONS', 'OPEN ORDERS', 'TRADES', 'FUNDING', 'ORDER HISTORY'] as Tab[]).map(tab => (
            <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-[10px] uppercase tracking-wider font-pixel transition-all ${
                    activeTab === tab 
                        ? 'text-cosmic-cyan border-b-2 border-cosmic-cyan bg-cosmic-cyan/5' 
                        : 'text-cosmic-dim hover:text-cosmic-text hover:bg-white/5'
                }`}
            >
                {tab}
            </button>
        ))}
    </div>
);

const PositionsTable: React.FC<{ positions: HyperliquidPosition[], loading: boolean }> = ({ positions, loading }) => {
    const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

    const sortedPositions = useMemo(() => {
        return getSortedData(positions, sortConfig, (item, key) => {
            switch (key) {
                case 'coin': return item.coin;
                case 'szi': return parseFloat(item.szi);
                case 'entryPx': return parseFloat(item.entryPx);
                case 'positionValue': return parseFloat(item.positionValue);
                case 'unrealizedPnl': return parseFloat(item.unrealizedPnl);
                case 'returnOnEquity': return parseFloat(item.returnOnEquity);
                case 'leverage': return item.leverage.value;
                default: return '';
            }
        });
    }, [positions, sortConfig]);

    const requestSort = (key: string) => {
        let direction: SortDirection = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    return (
        <table className="w-full text-left border-collapse">
            <thead className="bg-cosmic-dim/30 text-cosmic-cyan sticky top-0 uppercase font-pixel tracking-wider text-[10px]">
                <tr>
                    <SortableHeader label="Asset" sortKey="coin" currentSort={sortConfig} onSort={requestSort} />
                    <SortableHeader label="Size" sortKey="szi" currentSort={sortConfig} onSort={requestSort} align="right" />
                    <SortableHeader label="Entry" sortKey="entryPx" currentSort={sortConfig} onSort={requestSort} align="right" />
                    <SortableHeader label="Value" sortKey="positionValue" currentSort={sortConfig} onSort={requestSort} align="right" />
                    <SortableHeader label="PnL" sortKey="unrealizedPnl" currentSort={sortConfig} onSort={requestSort} align="right" />
                    <SortableHeader label="ROE" sortKey="returnOnEquity" currentSort={sortConfig} onSort={requestSort} align="right" />
                    <SortableHeader label="Lev" sortKey="leverage" currentSort={sortConfig} onSort={requestSort} align="right" />
                </tr>
            </thead>
            <tbody className="divide-y divide-cosmic-dim/20">
                {sortedPositions.map((pos, i) => {
                    const isLong = parseFloat(pos.szi) > 0;
                    const roe = parseFloat(pos.returnOnEquity) * 100;
                    return (
                        <tr key={i} className="hover:bg-white/5 transition-colors group">
                            <td className="p-3 font-bold text-white group-hover:text-cosmic-cyan">{pos.coin}</td>
                            <td className={`p-3 text-right ${isLong ? 'text-cosmic-green' : 'text-cosmic-pink'}`}>{parseFloat(pos.szi).toFixed(4)}</td>
                            <td className="p-3 text-right text-cosmic-dim">{parseFloat(pos.entryPx).toFixed(2)}</td>
                            <td className="p-3 text-right text-cosmic-dim">
                                <MoneyValue value={pos.positionValue} colored={false} />
                            </td>
                            <td className="p-3 text-right font-bold">
                                <MoneyValue value={pos.unrealizedPnl} showSign />
                            </td>
                            <td className={`p-3 text-right ${roe >= 0 ? 'text-cosmic-green' : 'text-cosmic-pink'}`}>{roe.toFixed(2)}%</td>
                            <td className="p-3 text-right text-cosmic-dim">{pos.leverage.value}x</td>
                        </tr>
                    );
                })}
                {!loading && positions.length === 0 && <EmptyRow msg="NO OPEN POSITIONS" />}
            </tbody>
        </table>
    );
};

const BalancesView: React.FC<{ summary: HyperliquidAccountSummary | null, loading: boolean }> = ({ summary, loading }) => {
    if (loading && !summary) return null; // Let the progress bar show loading state
    if (!summary) return <div className="p-8 text-center text-cosmic-dim">NO BALANCE DATA</div>;
    
    return (
        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            <BalanceCard label="Account Value" value={<MoneyValue value={summary.accountValue} />} />
            <BalanceCard label="Withdrawable" value={<MoneyValue value={summary.withdrawable} />} />
            <BalanceCard label="Margin Used" value={<MoneyValue value={summary.totalMarginUsed} />} />
            <BalanceCard label="Total Ntl Pos" value={<MoneyValue value={summary.totalNtlPos} />} />
        </div>
    );
};

const BalanceCard: React.FC<{ label: string, value: React.ReactNode }> = ({ label, value }) => (
    <div className="bg-cosmic-card border border-cosmic-dim/30 p-4 rounded">
        <div className="text-cosmic-dim text-[10px] uppercase mb-1">{label}</div>
        <div className="text-xl font-bold glow-text">{value}</div>
    </div>
);

const OpenOrdersTable: React.FC<{ orders: HyperliquidOpenOrder[], loading: boolean }> = ({ orders, loading }) => {
    const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

    const sortedOrders = useMemo(() => {
        return getSortedData(orders, sortConfig, (item, key) => {
            switch (key) {
                case 'timestamp': return item.timestamp;
                case 'coin': return item.coin;
                case 'side': return item.side;
                case 'limitPx': return parseFloat(item.limitPx);
                case 'sz': return parseFloat(item.sz);
                default: return '';
            }
        });
    }, [orders, sortConfig]);

    const requestSort = (key: string) => {
        let direction: SortDirection = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    return (
        <table className="w-full text-left border-collapse">
            <thead className="bg-cosmic-dim/30 text-cosmic-cyan sticky top-0 uppercase font-pixel tracking-wider text-[10px]">
                <tr>
                    <SortableHeader label="Time" sortKey="timestamp" currentSort={sortConfig} onSort={requestSort} />
                    <SortableHeader label="Asset" sortKey="coin" currentSort={sortConfig} onSort={requestSort} />
                    <SortableHeader label="Side" sortKey="side" currentSort={sortConfig} onSort={requestSort} />
                    <SortableHeader label="Price" sortKey="limitPx" currentSort={sortConfig} onSort={requestSort} align="right" />
                    <SortableHeader label="Size" sortKey="sz" currentSort={sortConfig} onSort={requestSort} align="right" />
                    <th className="p-3 text-right">Filled</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-cosmic-dim/20">
                {sortedOrders.map((o, i) => (
                    <tr key={i} className="hover:bg-white/5">
                        <td className="p-3 text-cosmic-dim">{new Date(o.timestamp).toLocaleTimeString()}</td>
                        <td className="p-3 font-bold text-white">{o.coin}</td>
                        <td className={`p-3 font-bold ${o.side === 'B' ? 'text-cosmic-green' : 'text-cosmic-pink'}`}>{o.side === 'B' ? 'BUY' : 'SELL'}</td>
                        <td className="p-3 text-right text-cosmic-gold">{parseFloat(o.limitPx).toFixed(2)}</td>
                        <td className="p-3 text-right text-white">{o.sz}</td>
                        <td className="p-3 text-right text-cosmic-dim">0.0000</td>
                    </tr>
                ))}
                {!loading && orders.length === 0 && <EmptyRow msg="NO OPEN ORDERS" />}
            </tbody>
        </table>
    );
};

const TradesTable: React.FC<{ fills: HyperliquidFill[], loading: boolean }> = ({ fills, loading }) => {
    const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

    const sortedFills = useMemo(() => {
        return getSortedData(fills, sortConfig, (item, key) => {
            switch (key) {
                case 'time': return item.time;
                case 'coin': return item.coin;
                case 'side': return item.side;
                case 'px': return parseFloat(item.px);
                case 'sz': return parseFloat(item.sz);
                case 'fee': return parseFloat(item.fee);
                case 'closedPnl': return parseFloat(item.closedPnl);
                default: return '';
            }
        });
    }, [fills, sortConfig]);

    const requestSort = (key: string) => {
        let direction: SortDirection = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    return (
        <table className="w-full text-left border-collapse">
            <thead className="bg-cosmic-dim/30 text-cosmic-cyan sticky top-0 uppercase font-pixel tracking-wider text-[10px]">
                <tr>
                    <SortableHeader label="Time" sortKey="time" currentSort={sortConfig} onSort={requestSort} />
                    <SortableHeader label="Asset" sortKey="coin" currentSort={sortConfig} onSort={requestSort} />
                    <SortableHeader label="Side" sortKey="side" currentSort={sortConfig} onSort={requestSort} />
                    <SortableHeader label="Price" sortKey="px" currentSort={sortConfig} onSort={requestSort} align="right" />
                    <SortableHeader label="Size" sortKey="sz" currentSort={sortConfig} onSort={requestSort} align="right" />
                    <SortableHeader label="Fee" sortKey="fee" currentSort={sortConfig} onSort={requestSort} align="right" />
                    <SortableHeader label="PnL" sortKey="closedPnl" currentSort={sortConfig} onSort={requestSort} align="right" />
                </tr>
            </thead>
            <tbody className="divide-y divide-cosmic-dim/20">
                {sortedFills.map((f, i) => (
                    <tr key={i} className="hover:bg-white/5">
                        <td className="p-3 text-cosmic-dim">{new Date(f.time).toLocaleString()}</td>
                        <td className="p-3 font-bold text-white">{f.coin}</td>
                        <td className={`p-3 font-bold ${f.side === 'B' ? 'text-cosmic-green' : 'text-cosmic-pink'}`}>{f.side === 'B' ? 'BUY' : 'SELL'}</td>
                        <td className="p-3 text-right text-white">{parseFloat(f.px).toFixed(2)}</td>
                        <td className="p-3 text-right text-white">{f.sz}</td>
                        <td className="p-3 text-right">
                            <MoneyValue value={-parseFloat(f.fee)} decimals={3} colored />
                        </td>
                        <td className="p-3 text-right font-bold">
                            <MoneyValue value={f.closedPnl} colored />
                        </td>
                    </tr>
                ))}
                {!loading && fills.length === 0 && <EmptyRow msg="NO TRADE HISTORY" />}
            </tbody>
        </table>
    );
};

const FundingTable: React.FC<{ funding: HyperliquidFunding[], loading: boolean }> = ({ funding, loading }) => {
    const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

    const sortedFunding = useMemo(() => {
        return getSortedData(funding, sortConfig, (item, key) => {
            switch (key) {
                case 'time': return item.time;
                case 'szi': return parseFloat(item.szi);
                case 'fundingRate': return parseFloat(item.fundingRate);
                case 'usdc': return parseFloat(item.usdc);
                default: return '';
            }
        });
    }, [funding, sortConfig]);

    const requestSort = (key: string) => {
        let direction: SortDirection = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    return (
        <table className="w-full text-left border-collapse">
            <thead className="bg-cosmic-dim/30 text-cosmic-cyan sticky top-0 uppercase font-pixel tracking-wider text-[10px]">
                <tr>
                    <SortableHeader label="Time" sortKey="time" currentSort={sortConfig} onSort={requestSort} />
                    <SortableHeader label="Position" sortKey="szi" currentSort={sortConfig} onSort={requestSort} align="right" />
                    <SortableHeader label="Rate" sortKey="fundingRate" currentSort={sortConfig} onSort={requestSort} align="right" />
                    <SortableHeader label="Payment" sortKey="usdc" currentSort={sortConfig} onSort={requestSort} align="right" />
                </tr>
            </thead>
            <tbody className="divide-y divide-cosmic-dim/20">
                {sortedFunding.map((f, i) => {
                    const size = parseFloat(f.szi);
                    const rate = parseFloat(f.fundingRate);
                    const isLong = size > 0;
                    const isPositiveRate = rate > 0;
                    
                    return (
                    <tr key={i} className="hover:bg-white/5">
                        <td className="p-3 text-cosmic-dim">{new Date(f.time).toLocaleString()}</td>
                        <td className={`p-3 text-right ${isLong ? 'text-cosmic-green' : 'text-cosmic-pink'}`}>
                            {f.szi} {f.coin}
                        </td>
                        <td className={`p-3 text-right ${isPositiveRate ? 'text-cosmic-green' : 'text-cosmic-pink'}`}>{(rate * 100).toFixed(4)}%</td>
                        <td className="p-3 text-right font-bold">
                            <MoneyValue value={f.usdc} decimals={4} colored />
                        </td>
                    </tr>
                )})}
                {!loading && funding.length === 0 && <EmptyRow msg="NO FUNDING HISTORY" />}
            </tbody>
        </table>
    );
};

const HistoryTable: React.FC<{ orders: HyperliquidHistoricalOrder[], loading: boolean }> = ({ orders, loading }) => {
    const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

    const sortedOrders = useMemo(() => {
        return getSortedData(orders, sortConfig, (item, key) => {
            switch (key) {
                case 'timestamp': return item.timestamp;
                case 'orderType': return item.orderType;
                case 'side': return item.side;
                case 'origSz': return parseFloat(item.origSz);
                case 'filled': return item.status === 'filled' ? parseFloat(item.origSz) : (parseFloat(item.origSz) - parseFloat(item.sz));
                case 'value': {
                    const limitPrice = parseFloat(item.limitPx);
                    const price = limitPrice > 0 ? limitPrice : parseFloat(item.triggerPx);
                    return price * parseFloat(item.origSz);
                }
                case 'price': {
                    const limitPrice = parseFloat(item.limitPx);
                    return limitPrice > 0 ? limitPrice : parseFloat(item.triggerPx);
                }
                case 'reduceOnly': return item.reduceOnly ? 1 : 0;
                case 'status': return item.status;
                default: return '';
            }
        });
    }, [orders, sortConfig]);

    const requestSort = (key: string) => {
        let direction: SortDirection = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    return (
        <table className="w-full text-left border-collapse">
            <thead className="bg-cosmic-dim/30 text-cosmic-cyan sticky top-0 uppercase font-pixel tracking-wider text-[10px]">
                <tr>
                    <SortableHeader label="Time" sortKey="timestamp" currentSort={sortConfig} onSort={requestSort} />
                    <SortableHeader label="Type" sortKey="orderType" currentSort={sortConfig} onSort={requestSort} />
                    <SortableHeader label="Direction" sortKey="side" currentSort={sortConfig} onSort={requestSort} />
                    <SortableHeader label="Size" sortKey="origSz" currentSort={sortConfig} onSort={requestSort} align="right" />
                    <SortableHeader label="Filled" sortKey="filled" currentSort={sortConfig} onSort={requestSort} align="right" />
                    <SortableHeader label="Value" sortKey="value" currentSort={sortConfig} onSort={requestSort} align="right" />
                    <SortableHeader label="Price" sortKey="price" currentSort={sortConfig} onSort={requestSort} align="right" />
                    <SortableHeader label="Reduce" sortKey="reduceOnly" currentSort={sortConfig} onSort={requestSort} align="center" />
                    <th className="p-3 text-right">Trigger</th>
                    <th className="p-3 text-right">TP/SL</th>
                    <SortableHeader label="Status" sortKey="status" currentSort={sortConfig} onSort={requestSort} align="right" />
                </tr>
            </thead>
            <tbody className="divide-y divide-cosmic-dim/20">
                {sortedOrders.map((o, i) => {
                    const isBuy = o.side === 'B';
                    const limitPrice = parseFloat(o.limitPx);
                    const size = parseFloat(o.origSz);
                    const price = limitPrice > 0 ? limitPrice : parseFloat(o.triggerPx);
                    const value = price * size;
                    const filled = o.status === 'filled' ? size : (size - parseFloat(o.sz)); 
                    
                    return (
                    <tr key={i} className="hover:bg-white/5">
                        <td className="p-3 text-cosmic-dim">{new Date(o.timestamp).toLocaleString()}</td>
                        <td className="p-3 font-bold text-white uppercase">{o.orderType}</td>
                        <td className={`p-3 font-bold ${isBuy ? 'text-cosmic-green' : 'text-cosmic-pink'}`}>{isBuy ? 'LONG' : 'SHORT'}</td>
                        <td className="p-3 text-right text-white">{o.origSz} {o.coin}</td>
                        <td className="p-3 text-right text-cosmic-dim">{filled.toFixed(4)}</td>
                        <td className="p-3 text-right font-bold">
                             <MoneyValue value={value} colored={false} />
                        </td>
                        <td className="p-3 text-right text-cosmic-gold">{price > 0 ? price.toFixed(2) : 'MKT'}</td>
                        <td className="p-3 text-center text-cosmic-dim">{o.reduceOnly ? 'YES' : '-'}</td>
                        <td className="p-3 text-right text-cosmic-dim">
                            {o.isTrigger ? `${o.triggerCondition} ${parseFloat(o.triggerPx).toFixed(2)}` : '-'}
                        </td>
                        <td className="p-3 text-right text-cosmic-dim">
                            {o.orderType.includes('Take Profit') || o.orderType.includes('Stop') ? 'YES' : '-'}
                        </td>
                        <td className="p-3 text-right">
                            <span className={`px-2 py-0.5 rounded text-[10px] ${
                                o.status === 'filled' ? 'bg-cosmic-green/20 text-cosmic-green' : 
                                o.status === 'canceled' ? 'bg-cosmic-dim/20 text-cosmic-dim' : 'text-white'
                            }`}>
                                {o.status.toUpperCase()}
                            </span>
                        </td>
                    </tr>
                )})}
                {!loading && orders.length === 0 && <EmptyRow msg="NO ORDER HISTORY" />}
            </tbody>
        </table>
    );
};

const EmptyRow: React.FC<{ msg: string }> = ({ msg }) => (
    <tr>
        <td colSpan={10} className="p-8 text-center text-cosmic-dim italic">
            {msg}
        </td>
    </tr>
);
