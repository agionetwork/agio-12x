'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Wallet, Smartphone, ExternalLink, Copy, Check } from 'lucide-react'
import toast from 'react-hot-toast'

interface WalletModalProps {
  isOpen: boolean
  onClose: () => void
  onConnect: (walletType: string, address: string) => void
}

const WALLET_OPTIONS = [
  {
    id: 'google',
    name: 'Google',
    description: 'Login com Google',
    icon: '🔵',
    color: 'from-blue-500 to-blue-600',
    type: 'embedded'
  },
  {
    id: 'phantom',
    name: 'Phantom',
    description: 'Carteira Phantom',
    icon: '👻',
    color: 'from-purple-500 to-purple-600',
    type: 'external'
  },
  {
    id: 'solflare',
    name: 'Solflare',
    description: 'Carteira Solflare',
    icon: '☀️',
    color: 'from-yellow-500 to-orange-500',
    type: 'external'
  },
  {
    id: 'backpack',
    name: 'Backpack',
    description: 'Carteira Backpack',
    icon: '🎒',
    color: 'from-green-500 to-green-600',
    type: 'external'
  }
]

export default function WalletModal({ isOpen, onClose, onConnect }: WalletModalProps) {
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  const handleWalletSelect = async (wallet: typeof WALLET_OPTIONS[0]) => {
    setSelectedWallet(wallet.id)
    setIsConnecting(true)

    try {
      // Simular processo de conexão
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Gerar endereço mock baseado no tipo de carteira
      const mockAddresses = {
        google: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
        phantom: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
        solflare: '5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1',
        backpack: '3xJ8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8'
      }

      const address = mockAddresses[wallet.id as keyof typeof mockAddresses] || mockAddresses.google
      
      onConnect(wallet.name, address)
      toast.success(`${wallet.name} conectado com sucesso!`)
      onClose()
    } catch (error) {
      console.error('Erro ao conectar carteira:', error)
      toast.error('Erro ao conectar carteira')
    } finally {
      setIsConnecting(false)
      setSelectedWallet(null)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 min-h-screen"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto relative mx-auto my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
                <Wallet className="text-white" size={16} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Conectar Carteira</h2>
                <p className="text-xs text-slate-600">Escolha como deseja conectar</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </motion.button>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="grid grid-cols-1 gap-2">
              {WALLET_OPTIONS.map((wallet) => (
                <motion.button
                  key={wallet.id}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleWalletSelect(wallet)}
                  disabled={isConnecting}
                  className={`p-3 rounded-xl border-2 transition-all duration-300 text-left ${
                    selectedWallet === wallet.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-lg'
                  } ${isConnecting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${wallet.color} flex items-center justify-center text-lg shadow-lg`}>
                      {wallet.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-800 text-sm">{wallet.name}</h3>
                        {wallet.type === 'external' && (
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600">{wallet.description}</p>
                    </div>
                    {selectedWallet === wallet.id && isConnecting && (
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200"
            >
              <div className="flex items-start gap-2">
                <Smartphone className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-800 text-xs">Como funciona?</h4>
                  <p className="text-xs text-blue-700 mt-1">
                    • <strong>Google:</strong> Carteira integrada automática<br/>
                    • <strong>Solana:</strong> Conecta carteira existente
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}