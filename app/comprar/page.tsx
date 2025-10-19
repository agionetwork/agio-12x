'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Zap } from 'lucide-react'
import Link from 'next/link'
import PaymentForm from '@/components/PaymentForm'
import WalletConnection from '@/components/WalletConnection'

export default function ComprarPage() {
  const [conversionRate, setConversionRate] = useState(5.2)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUSDCPrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=usd-coin&vs_currencies=brl')
        const data = await response.json()
        
        if (data['usd-coin'] && data['usd-coin'].brl) {
          setConversionRate(data['usd-coin'].brl)
        }
      } catch (error) {
        console.error('Erro ao buscar preço do USDC:', error)
        // Manter o valor padrão em caso de erro
      } finally {
        setIsLoading(false)
      }
    }

    fetchUSDCPrice()
    
    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchUSDCPrice, 30000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse-glow"></div>
      </div>

      {/* Header */}
      <header className="bg-white/10 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="bg-gradient-to-r from-blue-600 to-blue-800 p-3 rounded-2xl shadow-glow"
              >
                <Zap className="text-white" size={28} />
              </motion.div>
                      <div>
                        <h1 className="text-2xl font-black text-gradient">12x</h1>
                        <p className="text-sm text-slate-600 font-medium">Powered by Agio Network</p>
                      </div>
            </motion.div>

            {/* Wallet Connection */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <WalletConnection />
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] pt-0">
        <div className="max-w-4xl mx-auto px-4 w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto"
          >
            <PaymentForm conversionRate={conversionRate} isLoading={isLoading} />
          </motion.div>
        </div>
      </main>
    </div>
  )
}
