'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'
import { useDailyPrice } from '@/hooks/useDailyPrice'

interface ConversionRateProps {
  rate: number
  isLoading?: boolean
}

export default function ConversionRate({ rate, isLoading = false }: ConversionRateProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [currentTime, setCurrentTime] = useState('')
  const { variation24h, isPositive } = useDailyPrice()

  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString('pt-BR'))
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simular atualização da taxa
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <div className="text-center mb-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 backdrop-blur-sm rounded-full px-3 py-1 mb-3 border border-green-200/50 shadow-sm"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <TrendingUp className="w-3 h-3 text-green-600" />
          </motion.div>
          <span className="text-green-700 font-semibold text-xs">Taxa em Tempo Real</span>
        </motion.div>
        
        <h2 className="text-xl font-black text-gradient mb-2 tracking-tight">
          Cotação USDC
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Acompanhe a cotação em tempo real
        </p>
      </div>

      <div className="grid grid-cols-1 gap-1 max-w-xs mx-auto">
        {/* Taxa Atual */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 text-center group hover:shadow-2xl hover:scale-105 transition-all duration-300 p-3"
        >
          <div className="flex items-center justify-center space-x-3 mb-3">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg"
            >
              <span className="text-white text-sm font-bold">$</span>
            </motion.div>
            <span className="text-base font-bold text-slate-800">1 USDC</span>
          </div>
                  <p className="text-3xl font-black text-gradient mb-2">
                    {isLoading ? (
                      <span className="inline-block w-20 h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-pulse"></span>
                    ) : (
                      `R$ ${(rate * 1.035).toFixed(2)}`
                    )}
                  </p>
                  <p className="text-slate-600 font-semibold text-sm">Preço de Venda</p>
        </motion.div>

        {/* Variação 24h */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 text-center group hover:shadow-2xl hover:scale-105 transition-all duration-300 p-3"
        >
          <div className="flex items-center justify-center space-x-3 mb-3">
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className={`w-10 h-10 bg-gradient-to-br rounded-xl flex items-center justify-center shadow-lg ${
                isPositive 
                  ? 'from-green-500 to-emerald-600' 
                  : 'from-red-500 to-red-600'
              }`}
            >
              {isPositive ? (
                <TrendingUp className="text-white" size={18} />
              ) : (
                <TrendingDown className="text-white" size={18} />
              )}
            </motion.div>
            <span className="text-base font-bold text-slate-800">24h</span>
          </div>
          <p className={`text-3xl font-black mb-2 ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {isPositive ? '+' : ''}{variation24h.toFixed(2)}%
          </p>
          <p className="text-slate-600 font-semibold text-sm">Variação</p>
        </motion.div>

      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-3 text-center"
      >
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30 shadow-sm">
          <RefreshCw 
            className={`text-slate-600 ${isRefreshing ? 'animate-spin' : ''}`} 
            size={14} 
          />
          <span className="text-slate-700 text-sm font-medium">
            {currentTime || 'Carregando...'}
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}
