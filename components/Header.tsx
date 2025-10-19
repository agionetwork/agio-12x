'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Wallet, Menu, X, ExternalLink } from 'lucide-react'

interface HeaderProps {
  isWalletConnected: boolean
  walletAddress: string
  onWalletConnect: (address: string) => void
  onWalletDisconnect: () => void
}

export default function Header({ 
  isWalletConnected, 
  walletAddress, 
  onWalletConnect, 
  onWalletDisconnect 
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleWalletConnect = async () => {
    try {
      if (typeof window !== 'undefined' && window.solana?.isPhantom) {
        const response = await window.solana.connect()
        onWalletConnect(response.publicKey.toString())
      } else {
        alert('Phantom Wallet não encontrado. Instale a extensão do Phantom.')
      }
    } catch (error) {
      console.error('Erro ao conectar carteira:', error)
    }
  }

  const handleWalletDisconnect = () => {
    onWalletDisconnect()
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="solana-gradient p-2 rounded-lg">
              <Wallet className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient">Solana USDC</h1>
              <p className="text-sm text-gray-500">Compre USDC com segurança</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#comprar" className="text-gray-600 hover:text-blue-600 transition-colors">
              Comprar
            </a>
            <a href="#como-funciona" className="text-gray-600 hover:text-blue-600 transition-colors">
              Como Funciona
            </a>
            <a href="#seguranca" className="text-gray-600 hover:text-blue-600 transition-colors">
              Segurança
            </a>
            <a href="#suporte" className="text-gray-600 hover:text-blue-600 transition-colors">
              Suporte
            </a>
          </nav>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            {isWalletConnected ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center space-x-3"
              >
                <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-700">
                    {formatAddress(walletAddress)}
                  </span>
                </div>
                <button
                  onClick={handleWalletDisconnect}
                  className="btn-secondary text-sm"
                >
                  Desconectar
                </button>
              </motion.div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleWalletConnect}
                className="btn-primary flex items-center space-x-2"
              >
                <Wallet size={20} />
                <span>Conectar Carteira</span>
              </motion.button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pt-4 border-t border-gray-200"
          >
            <nav className="flex flex-col space-y-4">
              <a 
                href="#comprar" 
                className="text-gray-600 hover:text-blue-600 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Comprar
              </a>
              <a 
                href="#como-funciona" 
                className="text-gray-600 hover:text-blue-600 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Como Funciona
              </a>
              <a 
                href="#seguranca" 
                className="text-gray-600 hover:text-blue-600 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Segurança
              </a>
              <a 
                href="#suporte" 
                className="text-gray-600 hover:text-blue-600 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Suporte
              </a>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  )
}
