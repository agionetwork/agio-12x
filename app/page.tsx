'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, Shield, Zap, ArrowRight, CheckCircle } from 'lucide-react'
import Header from '@/components/Header'
import ConversionRate from '@/components/ConversionRate'
import Features from '@/components/Features'
import Footer from '@/components/Footer'

export default function Home() {
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
        <motion.div 
          animate={{ 
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-cyan-400/20 rounded-full blur-3xl"
        ></motion.div>
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-indigo-400/20 to-blue-400/10 rounded-full blur-3xl"
        ></motion.div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <Header />
      
      <main className="relative z-10 -mt-0">
        {/* Hero Section - Layout Lado a Lado */}
        <section className="h-screen flex items-center justify-center px-4 pt-0">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start justify-center h-full w-full">
              
              {/* Seção Esquerda - Hero */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center flex flex-col items-center justify-start pt-0"
              >
                <div className="mb-3">
                  {/* Imagem da Moeda USDC */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="flex justify-center mb-3"
                  >
                    <div className="relative">
                      <img 
                        src="/images/USDC.png" 
                        alt="USDC Coin" 
                        className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-2xl"
                      />
                      <motion.div
                        animate={{ 
                          scale: [1, 1.05, 1],
                          rotate: [0, 5, 0]
                        }}
                        transition={{ 
                          duration: 4, 
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="absolute inset-0"
                      >
                        <div className="w-full h-full bg-blue-400/20 rounded-full blur-xl"></div>
                      </motion.div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex items-center gap-4 mb-4"
                  >
                    <div className="flex-1 text-center">
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gradient leading-[0.9] tracking-tight">
                        Compre USDC
                        <br />
                        <span className="text-gradient-accent">em até 12x</span>
                      </h1>
                    </div>
                  </motion.div>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl mx-auto"
                  >
                            A forma mais <span className="font-bold text-slate-800 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">fácil e segura</span> de comprar USDC 
                            usando boleto, PIX, cartão de débito ou crédito com parcelamento.
                  </motion.p>
                </div>
              </motion.div>

              {/* Seção Direita - Cotação */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex items-start justify-center -mt-8 lg:-mt-10 w-full"
              >
                <ConversionRate rate={conversionRate} isLoading={isLoading} />
              </motion.div>

            </div>
          </div>
        </section>


        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="py-20"
        >
          <Features />
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
