'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Wallet, LogOut, Copy, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import WalletModal from './WalletModal'

export default function WalletConnection() {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
  const [walletType, setWalletType] = useState('')
  const [copied, setCopied] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleConnect = (type: string, address: string) => {
    setWalletType(type)
    setWalletAddress(address)
    setIsConnected(true)
    setIsModalOpen(false)
  }

  const handleDisconnect = async () => {
    try {
      setIsConnected(false)
      setWalletAddress('')
      setWalletType('')
      toast.success('Carteira desconectada')
    } catch (error) {
      console.error('Erro ao desconectar:', error)
      toast.error('Erro ao desconectar')
    }
  }

  const copyAddress = async () => {
    if (walletAddress) {
      await navigator.clipboard.writeText(walletAddress)
      setCopied(true)
      toast.success('Endereço copiado!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (isConnected && walletAddress) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-3"
      >
        {/* Wallet Info */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2"
        >
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-green-700">
            {formatAddress(walletAddress)}
          </span>
          <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
            {walletType}
          </span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={copyAddress}
            className="p-1 hover:bg-green-100 rounded-lg transition-colors"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4 text-green-600" />
            )}
          </motion.button>
        </motion.div>

        {/* Disconnect Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDisconnect}
          className="btn-outline flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </motion.button>
      </motion.div>
    )
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsModalOpen(true)}
        className="btn-primary flex items-center gap-2"
      >
        <Wallet className="w-5 h-5" />
        Connect Wallet
      </motion.button>

      <WalletModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConnect={handleConnect}
      />
    </>
  )
}
