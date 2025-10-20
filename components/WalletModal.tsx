'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Wallet, Smartphone, ExternalLink, Copy, Check, Download } from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'

import { WalletInfo } from '@/types/wallet'

interface WalletModalProps {
  isOpen: boolean
  onClose: () => void
  onConnect: (walletInfo: WalletInfo) => void
}

const WALLET_OPTIONS = [
  {
    id: 'phantom',
    name: 'Phantom',
    description: 'A carteira mais popular do Solana',
    icon: 'phantom',
    // Logo oficial
    logo: '/wallets/phantom.svg',
    color: 'from-purple-500 to-purple-600',
    type: 'external',
    downloadUrl: 'https://phantom.app/download',
    isInstalled: false
  },
  {
    id: 'solflare',
    name: 'Solflare',
    description: 'Carteira segura e confiável',
    icon: 'solflare',
    logo: '/wallets/solflare.svg',
    color: 'from-yellow-500 to-orange-500',
    type: 'external',
    downloadUrl: 'https://solflare.com/download',
    isInstalled: false
  },
  {
    id: 'backpack',
    name: 'Backpack',
    description: 'Carteira para traders avançados',
    icon: 'backpack',
    logo: '/wallets/backpack.svg',
    color: 'from-green-500 to-green-600',
    type: 'external',
    downloadUrl: 'https://backpack.app/download',
    isInstalled: false
  },
  {
    id: 'google',
    name: 'Google',
    description: 'Login com Google (Embedded)',
    icon: 'google',
    logo: 'https://www.google.com/favicon.ico',
    color: 'from-blue-500 to-blue-600',
    type: 'embedded',
    downloadUrl: null,
    isInstalled: true
  }
]

export default function WalletModal({ isOpen, onClose, onConnect }: WalletModalProps) {
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [failedLogos, setFailedLogos] = useState<Record<string, boolean>>({})

  // Verificar se a carteira está instalada
  const checkWalletInstalled = useCallback((walletId: string) => {
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

  const handleWalletSelect = async (wallet: typeof WALLET_OPTIONS[0]) => {
    setSelectedWallet(wallet.id)
    setIsConnecting(true)

    try {
      // Criar objeto WalletInfo
      const walletInfo: WalletInfo = {
        id: wallet.id,
        name: wallet.name,
        description: wallet.description,
        icon: wallet.icon,
        color: wallet.color,
        type: wallet.type as 'external' | 'embedded',
        downloadUrl: wallet.downloadUrl || undefined,
        isInstalled: wallet.isInstalled
      }

      // Chamar função de conexão
      onConnect(walletInfo)
      onClose()
    } catch (error) {
      console.error('Erro ao conectar carteira:', error)
      toast.error(`Erro ao conectar ${wallet.name}. Verifique se está instalada.`)
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
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-2xl shadow-2xl max-w-sm w-full relative mx-auto my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <Wallet className="text-white" size={14} />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800">Conectar Carteira</h2>
                <p className="text-[11px] text-slate-600">Escolha como deseja conectar</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-slate-500" />
            </motion.button>
          </div>

          {/* Content */}
          <div className="p-3">
            <div className="grid grid-cols-1 gap-2">
              {WALLET_OPTIONS.map((wallet) => {
                const isInstalled = checkWalletInstalled(wallet.id)
                const isSelected = selectedWallet === wallet.id
                const isConnectingThis = isConnecting && isSelected
                
                return (
                  <motion.div
                    key={wallet.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300 hover:shadow-lg'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${wallet.color} flex items-center justify-center shadow-lg overflow-hidden`}>
                        {wallet.logo && !failedLogos[wallet.id] ? (
                          <Image 
                            src={wallet.logo} 
                            alt={`${wallet.name} logo`} 
                            width={24} 
                            height={24} 
                            className="w-6 h-6 object-contain"
                            onError={() => setFailedLogos(prev => ({ ...prev, [wallet.id]: true }))}
                          />
                        ) : (
                          <span className="text-base text-white">{wallet.name.charAt(0)}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="font-bold text-slate-800 text-sm">{wallet.name}</h3>
                          {wallet.type === 'external' && (
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                          )}
                          {isInstalled && wallet.type === 'external' && (
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 mb-1">{wallet.description}</p>
                        
                        {!isInstalled && wallet.type === 'external' && (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                              Não instalada
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        {isConnectingThis ? (
                          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        ) : !isInstalled && wallet.type === 'external' ? (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => wallet.downloadUrl && window.open(wallet.downloadUrl, '_blank')}
                            className="flex items-center gap-1 px-2.5 py-1 bg-blue-600 text-white text-[11px] rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Download className="w-3 h-3" />
                            Instalar
                          </motion.button>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleWalletSelect(wallet)}
                            disabled={isConnecting}
                            className="px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Conectar
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200"
            >
              <div className="flex items-start gap-3">
                <Smartphone className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-bold text-blue-800 text-xs mb-1.5">Como conectar sua carteira?</h4>
                  <div className="space-y-0.5 text-[11px] text-blue-700">
                    <p>• <strong>Phantom/Solflare/Backpack:</strong> Instale a extensão do navegador</p>
                    <p>• <strong>Google:</strong> Login automático com carteira integrada</p>
                    <p>• <strong>Segurança:</strong> Suas chaves privadas nunca saem da sua carteira</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}