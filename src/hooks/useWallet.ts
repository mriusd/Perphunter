import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useUserStore } from '../store'
import { useEffect } from 'react'

export const useWallet = () => {
  const { address, isConnected, isConnecting, chainId } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { wallet, setWallet, disconnect: storeDisconnect } = useUserStore()

  useEffect(() => {
    setWallet({
      address,
      isConnected,
      isConnecting,
      chainId,
    })
  }, [address, isConnected, isConnecting, chainId, setWallet])

  const handleConnect = async () => {
    const connector = connectors[0] // Use first available connector
    if (connector) {
      connect({ connector })
    }
  }

  const handleDisconnect = async () => {
    disconnect()
    storeDisconnect()
  }

  return {
    wallet,
    connectors,
    connect: handleConnect,
    disconnect: handleDisconnect,
  }
}