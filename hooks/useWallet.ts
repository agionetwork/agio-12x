'use client'

import { useState, useEffect, useCallback } from 'react'
import { Connection, PublicKey } from '@solana/web3.js'
import { WalletInfo, WalletConnectionResult } from '@/types/wallet'
import toast from 'react-hot-toast'

interface WalletState {
  connected: boolean
  publicKey: string | null
  walletType: string | null
  balance: number
  isLoading: boolean
  error: string | null
}

export function useWallet() {
  const [walletState, setWalletState] = useState<WalletState>({
    connected: false,
    publicKey: null,
    walletType: null,
    balance: 0,
    isLoading: false,
    error: null
  })

  // Verificar se uma carteira específica está instalada
  const checkWalletInstalled = useCallback((walletId: string): boolean => {
    if (typeof window === 'undefined') return false
    
    switch (walletId) {
      case 'phantom':
        return !!(window as any).solana?.isPhantom
      case 'solflare':
        return !!(window as any).solflare
      case 'backpack':
        return !!(window as any).backpack
      default:
        return true
    }
  }, [])

  // Conectar com uma carteira específica
  const connectWallet = async (walletInfo: WalletInfo): Promise<WalletConnectionResult | null> => {
    setWalletState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      if (walletInfo.type === 'embedded') {
        // Para carteiras embedded (Google), usar simulação por enquanto
        await new Promise(resolve => setTimeout(resolve, 1500))
        const mockAddress = '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM'
        
        setWalletState({
          connected: true,
          publicKey: mockAddress,
          walletType: walletInfo.name,
          balance: 0,
          isLoading: false,
          error: null
        })

        toast.success(`${walletInfo.name} conectado com sucesso!`)

        return {
          walletType: walletInfo.name,
          address: mockAddress,
          publicKey: mockAddress,
          connected: true
        }
      }

      // Para carteiras externas, verificar se estão instaladas
      const isInstalled = checkWalletInstalled(walletInfo.id)
      
      if (!isInstalled) {
        throw new Error(`${walletInfo.name} não está instalada. Instale primeiro!`)
      }

      // Tentar conectar com a carteira real
      let walletAdapter: any = null
      let publicKey: string | null = null

      switch (walletInfo.id) {
        case 'phantom':
          if ((window as any).solana?.isPhantom) {
            walletAdapter = (window as any).solana
            const response = await walletAdapter.connect().catch(() => null)
            publicKey = response?.publicKey?.toString?.() || walletAdapter?.publicKey?.toString?.() || null
          }
          break
        case 'solflare':
          if ((window as any).solflare) {
            walletAdapter = (window as any).solflare
            const response = await walletAdapter.connect().catch(() => null)
            publicKey = response?.publicKey?.toString?.() || walletAdapter?.publicKey?.toString?.() || null
          }
          break
        case 'backpack':
          if ((window as any).backpack) {
            walletAdapter = (window as any).backpack
            const response = await walletAdapter.connect().catch(() => null)
            publicKey = response?.publicKey?.toString?.() || walletAdapter?.publicKey?.toString?.() || null
          }
          break
      }

      if (publicKey) {
        setWalletState({
          connected: true,
          publicKey,
          walletType: walletInfo.name,
          balance: 0,
          isLoading: false,
          error: null
        })

        toast.success(`${walletInfo.name} conectado com sucesso!`)

        return {
          walletType: walletInfo.name,
          address: publicKey,
          publicKey,
          connected: true
        }
      } else {
        throw new Error('Falha ao obter chave pública')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      setWalletState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }))
      toast.error(errorMessage)
      return null
    }
  }

  // Desconectar carteira
  const disconnectWallet = async () => {
    setWalletState({
      connected: false,
      publicKey: null,
      walletType: null,
      balance: 0,
      isLoading: false,
      error: null
    })
    toast.success('Carteira desconectada')
  }

  // Buscar saldo da carteira
  const getBalance = async (publicKey: string) => {
    try {
      const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'
      const connection = new Connection(rpcUrl)
      const balance = await connection.getBalance(new PublicKey(publicKey))
      setWalletState(prev => ({ ...prev, balance: balance / 1e9 }))
    } catch (error) {
      console.error('Erro ao buscar saldo:', error)
      // Em caso de 403 ou falha, mantém balance em 0 sem quebrar UI
      setWalletState(prev => ({ ...prev, balance: 0 }))
    }
  }

  // Buscar saldo automaticamente quando conectar
  useEffect(() => {
    if (walletState.connected && walletState.publicKey) {
      getBalance(walletState.publicKey)
    }
  }, [walletState.connected, walletState.publicKey])

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
    checkWalletInstalled
  }
}
