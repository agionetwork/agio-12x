'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Wallet, Copy, ExternalLink, CheckCircle, AlertCircle, Download } from 'lucide-react'
import toast from 'react-hot-toast'

interface WalletConnectionProps {
  isConnected: boolean
  walletAddress: string
  onConnect: (address: string) => void
  onDisconnect: () => void
}

export default function WalletConnection({ 
  isConnected, 
  walletAddress, 
  onConnect, 
  onDisconnect 
}: WalletConnectionProps) {
  const [balance, setBalance] = useState(0)
  const [usdcBalance, setUsdcBalance] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (isConnected && walletAddress) {
      fetchWalletData()
    }
  }, [isConnected, walletAddress])

  const fetchWalletData = async () => {
    setIsLoading(true)
    try {
      // Simular busca de dados da carteira
      await new Promise(resolve => setTimeout(resolve, 1000))
      setBalance(0.5) // SOL
      setUsdcBalance(100) // USDC
    } catch (error) {
      console.error('Erro ao buscar dados da carteira:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnect = async () => {
    try {
      if (typeof window !== 'undefined' && window.solana?.isPhantom) {
        const response = await window.solana.connect()
        onConnect(response.publicKey.toString())
        toast.success('Carteira conectada com sucesso!')
      } else {
        toast.error('Phantom Wallet não encontrado. Instale a extensão.')
      }
    } catch (error) {
      console.error('Erro ao conectar carteira:', error)
      toast.error('Erro ao conectar carteira')
    }
  }

  const handleDisconnect = () => {
    onDisconnect()
    setBalance(0)
    setUsdcBalance(0)
    toast.success('Carteira desconectada')
  }

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress)
      setCopied(true)
      toast.success('Endereço copiado!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Erro ao copiar endereço')
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  const openExplorer = () => {
    window.open(`https://explorer.solana.com/address/${walletAddress}`, '_blank')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Carteira Solana</h2>
        <p className="text-gray-600">Conecte sua carteira para receber USDC</p>
      </div>

      {!isConnected ? (
        <div className="text-center py-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="solana-gradient p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center"
          >
            <Wallet className="text-white" size={32} />
          </motion.div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Conecte sua Carteira
          </h3>
          <p className="text-gray-600 mb-6">
            Conecte sua carteira Phantom para receber USDC após o pagamento
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleConnect}
            className="btn-primary w-full"
          >
            <Wallet className="inline-block mr-2" size={20} />
            Conectar Phantom Wallet
          </motion.button>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="text-blue-600 mt-0.5" size={20} />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Não tem Phantom Wallet?</p>
                <a 
                  href="https://phantom.app/download" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  <Download className="mr-1" size={16} />
                  Baixar Phantom Wallet
                  <ExternalLink className="ml-1" size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Status da Carteira */}
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="text-green-600" size={24} />
              <div>
                <p className="font-medium text-green-900">Carteira Conectada</p>
                <p className="text-sm text-green-700">{formatAddress(walletAddress)}</p>
              </div>
            </div>
            <button
              onClick={handleDisconnect}
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              Desconectar
            </button>
          </div>

          {/* Endereço da Carteira */}
          <div>
            <label className="label">Endereço da Carteira</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={walletAddress}
                readOnly
                className="input-field flex-1 font-mono text-sm"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={copyAddress}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                {copied ? (
                  <CheckCircle className="text-green-600" size={20} />
                ) : (
                  <Copy className="text-gray-600" size={20} />
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openExplorer}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <ExternalLink className="text-gray-600" size={20} />
              </motion.button>
            </div>
          </div>

          {/* Saldos */}
          {isLoading ? (
            <div className="space-y-4">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">SOL</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{balance.toFixed(4)}</p>
                <p className="text-sm text-gray-500">Saldo SOL</p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">USDC</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{usdcBalance.toFixed(2)}</p>
                <p className="text-sm text-gray-500">Saldo USDC</p>
              </div>
            </div>
          )}

          {/* Aviso de Recebimento */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="text-blue-600 mt-0.5" size={20} />
              <div>
                <p className="text-sm text-blue-800">
                  <strong>Pronto para receber USDC!</strong> Após confirmar o pagamento, 
                  os USDC serão enviados automaticamente para esta carteira.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
