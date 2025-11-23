# PerpHunter - Universal Crypto Perpetuals Trading Terminal

A unified frontend-only trading interface for perpetual futures across multiple decentralized exchanges. PerpHunter allows traders to manage positions, view balances, track transaction history, and execute trades on multiple perp DEXes through a single, intuitive interface.

## 🎯 Project Overview

### Core Objectives
- **Multi-DEX Trading**: Support for multiple perpetual futures DEXes through a unified interface
- **Portfolio Management**: Real-time balance and position tracking across all connected exchanges
- **Trade Execution**: Seamless order placement with DEX selection
- **Transaction History**: Comprehensive trade and transaction logging
- **Frontend-Only Architecture**: No backend dependency, direct blockchain/API integration

### Initial Supported DEXes
1. **Hyperliquid** - High-performance perp DEX on Arbitrum
2. **Lighter** - Orderbook-based perp trading platform

## 🛠 Technical Stack

### Frontend Framework
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized production builds
- **Tailwind CSS** for utility-first styling and responsive design

### State Management
- **Zustand** or **Redux Toolkit** for global state management
- **React Query/TanStack Query** for API state management and caching
- **Jotai** for atomic state management (if needed for complex forms)

### Web3 Integration
- **ethers.js** or **viem** for blockchain interactions
- **WalletConnect v2** for wallet connectivity
- **wagmi** for React hooks and wallet management

### UI/UX Libraries
- **Radix UI** or **Headless UI** for accessible component primitives
- **Framer Motion** for smooth animations
- **React Hook Form** with **Zod** for form validation
- **Recharts** or **TradingView Charting Library** for price charts

### Development Tools
- **TypeScript 5+** for static typing
- **ESLint** + **Prettier** for code formatting
- **Husky** for git hooks
- **Vitest** for unit testing
- **Playwright** for e2e testing

## 📁 Project Structure

```
perphunter/
├── public/
│   ├── icons/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   ├── trading/         # Trading-specific components
│   │   ├── portfolio/       # Portfolio management components
│   │   └── layout/          # Layout components
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Trading.tsx
│   │   ├── Portfolio.tsx
│   │   └── History.tsx
│   ├── hooks/
│   │   ├── useWallet.ts
│   │   ├── useTradingData.ts
│   │   └── usePositions.ts
│   ├── services/
│   │   ├── hyperliquid/
│   │   ├── lighter/
│   │   └── common/
│   ├── store/
│   │   ├── trading.ts
│   │   ├── portfolio.ts
│   │   └── user.ts
│   ├── types/
│   │   ├── trading.ts
│   │   ├── dex.ts
│   │   └── user.ts
│   ├── utils/
│   │   ├── formatters.ts
│   │   ├── calculations.ts
│   │   └── constants.ts
│   ├── styles/
│   │   └── globals.css
│   └── App.tsx
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## 🔧 Core Features

### 1. Wallet Integration
- **Multi-wallet support**: MetaMask, WalletConnect, Coinbase Wallet
- **Chain switching**: Automatic network detection and switching
- **Wallet state persistence**: Remember connected wallet across sessions

### 2. DEX Integration Architecture

#### Hyperliquid Integration
- **REST API**: Direct integration with Hyperliquid's REST API
- **WebSocket**: Real-time price feeds and order updates
- **Account management**: Balance, positions, and order history
- **Order placement**: Market, limit, and conditional orders

#### Lighter Integration
- **API Integration**: REST API for account and trading data
- **Real-time updates**: WebSocket for live market data
- **Order management**: Full order lifecycle management

#### Common DEX Interface
```typescript
interface DEXInterface {
  name: string;
  chainId: number;
  getBalances(): Promise<Balance[]>;
  getPositions(): Promise<Position[]>;
  getOrderHistory(): Promise<Order[]>;
  placeOrder(order: OrderRequest): Promise<OrderResponse>;
  cancelOrder(orderId: string): Promise<boolean>;
  getMarketData(): Promise<MarketData>;
}
```

### 3. Trading Interface
- **Order placement form**: Market/Limit orders with size and price inputs
- **DEX selection**: Dropdown to choose preferred exchange
- **Position sizing**: Leverage calculator and position size helpers
- **Risk management**: Stop-loss and take-profit order types

### 4. Portfolio Dashboard
- **Unified balance view**: Aggregated balances across all connected DEXes
- **Position overview**: Real-time P&L, margin usage, and liquidation prices
- **Performance metrics**: Daily/weekly/monthly performance tracking
- **Asset allocation**: Visual breakdown of positions by asset and DEX

### 5. Transaction History
- **Unified history**: Combined transaction log from all DEXes
- **Filtering**: By DEX, asset, date range, and transaction type
- **Export functionality**: CSV/JSON export for tax reporting
- **Trade analytics**: Performance metrics and trade analysis

## 📊 Data Management

### State Structure
```typescript
interface AppState {
  user: {
    wallet: WalletState;
    preferences: UserPreferences;
  };
  trading: {
    selectedDEX: DEXType;
    orderForm: OrderFormState;
    markets: Market[];
  };
  portfolio: {
    balances: Balance[];
    positions: Position[];
    totalPnL: number;
  };
  history: {
    transactions: Transaction[];
    filters: HistoryFilters;
  };
}
```

### Caching Strategy
- **React Query**: Cache market data, balances, and positions
- **Local Storage**: Persist user preferences and DEX selections
- **Session Storage**: Temporary data for forms and filters

## 🔒 Security Considerations

### Wallet Security
- **No private key storage**: Use wallet providers for transaction signing
- **Read-only access**: Only request necessary permissions
- **Secure connections**: HTTPS for all API communications

### API Security
- **Rate limiting**: Implement client-side rate limiting
- **Error handling**: Graceful handling of API failures
- **Input validation**: Validate all user inputs with Zod schemas

## 🚀 Development Phases

### Phase 1: Foundation (Weeks 1-2)
- [ ] Project setup with Vite + React + TypeScript
- [ ] Basic UI components with Tailwind
- [ ] Wallet connection infrastructure
- [ ] Basic routing and layout

### Phase 2: DEX Integration (Weeks 3-4)
- [ ] Hyperliquid API integration
- [ ] Lighter API integration
- [ ] Common DEX interface implementation
- [ ] Real-time data connections

### Phase 3: Core Features (Weeks 5-6)
- [ ] Trading interface implementation
- [ ] Portfolio dashboard
- [ ] Order management system
- [ ] Basic position tracking

### Phase 4: Advanced Features (Weeks 7-8)
- [ ] Transaction history interface
- [ ] Advanced order types
- [ ] Performance analytics
- [ ] Export functionality

### Phase 5: Polish & Optimization (Weeks 9-10)
- [ ] UI/UX improvements
- [ ] Performance optimization
- [ ] Error handling enhancement
- [ ] Testing and bug fixes

## 🧪 Testing Strategy

### Unit Testing
- **Component testing**: React Testing Library for UI components
- **Hook testing**: Custom hooks with @testing-library/react-hooks
- **Utility testing**: Pure functions and calculations

### Integration Testing
- **API integration**: Mock DEX APIs for testing
- **Wallet integration**: Mock wallet providers
- **State management**: Store interactions and data flow

### E2E Testing
- **User workflows**: Complete trading and portfolio management flows
- **Cross-browser testing**: Chrome, Firefox, Safari compatibility
- **Mobile responsiveness**: Touch interactions and responsive design

## 📱 Responsive Design

### Breakpoints
- **Mobile**: 320px - 768px (primary focus on portrait)
- **Tablet**: 768px - 1024px (landscape and portrait)
- **Desktop**: 1024px+ (multiple screen sizes)

### Mobile-First Approach
- Touch-friendly interface elements
- Optimized trading forms for mobile
- Swipeable tabs and modals
- Responsive charts and data tables

## 🔮 Future Enhancements

### Additional DEX Support
- **GMX**: Integrate with GMX V2 for additional liquidity
- **Drift**: Support for Solana-based perpetuals
- **dYdX**: Integration with dYdX V4

### Advanced Features
- **Portfolio analytics**: Advanced P&L tracking and performance metrics
- **Automated trading**: Simple automation rules and alerts
- **Social features**: Trade sharing and leaderboards
- **Advanced charting**: Full TradingView integration

### Technical Improvements
- **Progressive Web App**: Offline capabilities and app-like experience
- **Desktop app**: Electron wrapper for desktop users
- **Backend integration**: Optional backend for advanced features

## 🔧 Setup Instructions

### Prerequisites
- Node.js 18+ and npm/yarn
- Git for version control
- Modern browser with Web3 support

### Installation
```bash
git clone <repository-url>
cd perphunter
npm install
npm run dev
```

### Environment Configuration
```env
VITE_HYPERLIQUID_API_URL=https://api.hyperliquid.xyz
VITE_LIGHTER_API_URL=https://api.lighter.xyz
VITE_WALLETCONNECT_PROJECT_ID=your_project_id
```

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Please read CONTRIBUTING.md for contribution guidelines and code of conduct.

---

**PerpHunter** - Unified perpetual futures trading across the DeFi ecosystem.