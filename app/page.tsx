'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Wallet, CreditCard, Smartphone, Shield, Zap, TrendingUp } from 'lucide-react'
import Header from '@/components/Header'
import PaymentForm from '@/components/PaymentForm'
import WalletConnection from '@/components/WalletConnection'
import ConversionRate from '@/components/ConversionRate'
import Features from '@/components/Features'
import Footer from '@/components/Footer'

export default function Home() {
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string>('')
  const [conversionRate, setConversionRate] = useState(5.2)

  return (
    <div className="min-h-screen gradient-bg">
      <Header 
        isWalletConnected={isWalletConnected}
        walletAddress={walletAddress}
        onWalletConnect={(address) => {
          setIsWalletConnected(true)
          setWalletAddress(address)
        }}
        onWalletDisconnect={() => {
          setIsWalletConnected(false)
          setWalletAddress('')
        }}
      />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-6">
            Compre USDC na Solana
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A forma mais fácil e segura de comprar USDC usando cartão de crédito, 
            débito ou PIX com parcelamento. Conecte sua carteira e comece agora!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button className="btn-primary text-lg px-8 py-4">
                <Wallet className="inline-block mr-2" size={24} />
                Conectar Carteira
              </button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button className="btn-outline text-lg px-8 py-4">
                <CreditCard className="inline-block mr-2" size={24} />
                Comprar com Cartão
              </button>
            </motion.div>
          </div>
        </motion.section>

        {/* Conversion Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <ConversionRate rate={conversionRate} />
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Payment Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <PaymentForm 
              conversionRate={conversionRate}
              isWalletConnected={isWalletConnected}
              walletAddress={walletAddress}
            />
          </motion.div>

          {/* Wallet Connection */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <WalletConnection 
              isConnected={isWalletConnected}
              walletAddress={walletAddress}
              onConnect={(address) => {
                setIsWalletConnected(true)
                setWalletAddress(address)
              }}
              onDisconnect={() => {
                setIsWalletConnected(false)
                setWalletAddress('')
              }}
            />
          </motion.div>
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Features />
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
