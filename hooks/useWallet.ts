'use client'

import { useState, useEffect, useCallback } from 'react'
import { PublicKey } from '@solana/web3.js'
import { connectWallet, getUSDCBalance, WalletInfo } from '@/lib/solana'
import toast from 'react-hot-toast'

export function useWallet() {
  const [isConnected, setIsConnected] = useState(false)
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const connect = useCallback(async () => {
    setIsLoading(true)
    try {
      const info = await connectWallet()
      if (info) {
        setWalletInfo(info)
        setIsConnected(true)
        toast.success('Carteira conectada com sucesso!')
      } else {
        toast.error('Erro ao conectar carteira')
      }
    } catch (error) {
      console.error('Erro ao conectar carteira:', error)
      toast.error('Erro ao conectar carteira')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const disconnect = useCallback(() => {
    setWalletInfo(null)
    setIsConnected(false)
    toast.success('Carteira desconectada')
  }, [])

  const refreshBalance = useCallback(async () => {
    if (!walletInfo?.publicKey) return

    try {
      const usdcBalance = await getUSDCBalance(walletInfo.publicKey)
      setWalletInfo(prev => prev ? { ...prev, usdcBalance } : null)
    } catch (error) {
      console.error('Erro ao atualizar saldo:', error)
    }
  }, [walletInfo?.publicKey])

  // Verificar se Phantom está disponível
  useEffect(() => {
    const checkPhantom = () => {
      if (typeof window !== 'undefined' && window.solana?.isPhantom) {
        // Phantom está disponível
        return true
      }
      return false
    }

    if (checkPhantom()) {
      // Verificar se já está conectado
      window.solana?.connect()
        .then((response: any) => {
          if (response?.publicKey) {
            connect()
          }
        })
        .catch(() => {
          // Usuário não está conectado
        })
    }
  }, [connect])

  return {
    isConnected,
    walletInfo,
    isLoading,
    connect,
    disconnect,
    refreshBalance
  }
}
