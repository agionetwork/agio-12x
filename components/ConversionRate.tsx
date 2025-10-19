'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'

interface ConversionRateProps {
  rate: number
}

export default function ConversionRate({ rate }: ConversionRateProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [trend, setTrend] = useState<'up' | 'down' | 'neutral'>('neutral')

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simular atualização da taxa
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Taxa de Conversão</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw 
            className={`text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} 
            size={20} 
          />
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Taxa Atual */}
        <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">$</span>
            </div>
            <span className="text-sm font-medium text-blue-900">1 USDC</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">R$ {rate.toFixed(2)}</p>
          <p className="text-sm text-blue-600">Taxa atual</p>
        </div>

        {/* Variação 24h */}
        <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <TrendingUp className="text-green-600" size={20} />
            <span className="text-sm font-medium text-green-900">24h</span>
          </div>
          <p className="text-2xl font-bold text-green-900">+2.1%</p>
          <p className="text-sm text-green-600">Variação</p>
        </div>

        {/* Status do Mercado */}
        <div className="text-center p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-purple-900">Mercado</span>
          </div>
          <p className="text-2xl font-bold text-purple-900">Ativo</p>
          <p className="text-sm text-purple-600">Disponível</p>
        </div>
      </div>

      <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Última atualização:</span>
          <span className="text-gray-900 font-medium">
            {new Date().toLocaleTimeString('pt-BR')}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
