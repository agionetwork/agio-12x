'use client'

import { useState, useEffect } from 'react'

interface DailyPriceData {
  price: number
  date: string
  variation24h: number
}

export function useDailyPrice() {
  const [dailyData, setDailyData] = useState<DailyPriceData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAndUpdatePrice = async () => {
      try {
        // Buscar preço atual da API
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=usd-coin&vs_currencies=brl')
        const data = await response.json()
        
        if (data['usd-coin'] && data['usd-coin'].brl) {
          const currentPrice = data['usd-coin'].brl
          const today = new Date().toDateString()
          
          // Verificar se já temos dados salvos para hoje
          const savedData = localStorage.getItem('usdc-daily-price')
          let previousPrice = null
          let variation24h = 0
          
          if (savedData) {
            const parsedData = JSON.parse(savedData)
            previousPrice = parsedData.price
            variation24h = ((currentPrice - previousPrice) / previousPrice) * 100
          }
          
          // Salvar dados atuais
          const newData: DailyPriceData = {
            price: currentPrice,
            date: new Date().toISOString(),
            variation24h
          }
          
          localStorage.setItem('usdc-daily-price', JSON.stringify(newData))
          setDailyData(newData)
        }
      } catch (error) {
        console.error('Erro ao buscar preço do USDC:', error)
        // Tentar carregar dados salvos em caso de erro
        const savedData = localStorage.getItem('usdc-daily-price')
        if (savedData) {
          setDailyData(JSON.parse(savedData))
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchAndUpdatePrice()
    
    // Verificar se precisa atualizar a cada hora
    const interval = setInterval(fetchAndUpdatePrice, 60 * 60 * 1000) // 1 hora
    
    return () => clearInterval(interval)
  }, [])

  return {
    dailyData,
    isLoading,
    variation24h: dailyData?.variation24h || 0,
    isPositive: (dailyData?.variation24h || 0) >= 0
  }
}
