import { createConfig, http } from 'wagmi'
import { arbitrum, mainnet } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo'

export const config = createConfig({
  chains: [arbitrum, mainnet],
  connectors: [
    injected(),
    walletConnect({ 
      projectId,
      metadata: {
        name: 'PerpHunter',
        description: 'Universal Crypto Perpetuals Trading Terminal',
        url: 'https://perphunter.com',
        icons: ['https://perphunter.com/icon.png']
      }
    }),
  ],
  transports: {
    [arbitrum.id]: http(),
    [mainnet.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}