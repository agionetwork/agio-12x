'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FileText, ArrowLeft, Lock, Shield, Loader2, Copy, Check } from 'lucide-react'
import Link from 'next/link'
import { createCheckoutSession } from '@/lib/actions/stripe'
import toast from 'react-hot-toast'

export default function BoletoCheckout() {
  const [paymentData, setPaymentData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const data = localStorage.getItem('paymentData')
    if (data) {
      setPaymentData(JSON.parse(data))
    } else {
      router.push('/comprar')
    }
  }, [router])

  const handleBoletoCheckout = async () => {
    if (!paymentData) return

    setIsLoading(true)
    try {
      const clientSecret = await createCheckoutSession(
        paymentData.amount,
        'boleto',
        paymentData.usdcAmount
      )

      window.location.href = `/checkout/stripe?client_secret=${clientSecret}`
      
    } catch (error) {
      toast.error('Erro ao criar sessão de pagamento')
      console.error('Erro:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyBoletoCode = async () => {
    const boletoCode = '23793.38128.60007.827136.95000.000000.000000.000000'
    try {
      await navigator.clipboard.writeText(boletoCode)
      setCopied(true)
      toast.success('Código do boleto copiado!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Erro ao copiar código')
    }
  }

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/comprar">
              <motion.button
                whileHover={{ scale: 1.1 }}
                className="flex items-center gap-2 text-slate-600 hover:text-blue-600"
              >
                <ArrowLeft className="w-5 h-5" />
                Voltar
              </motion.button>
            </Link>
            <h1 className="text-xl font-bold text-gradient">Checkout - Boleto</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <div className="card p-6">
            <div className="text-center mb-6">
              <FileText className="w-16 h-16 text-orange-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                Pagamento via Boleto
              </h2>
              {paymentData && (
                <div className="bg-orange-50 rounded-lg p-4 mb-6">
                  <p className="text-slate-600 mb-2">
                    <strong>Valor:</strong> R$ {paymentData.amount}
                  </p>
                  <p className="text-slate-600">
                    <strong>USDC a receber:</strong> {paymentData.usdcAmount?.toFixed(6)} $USDC
                  </p>
                </div>
              )}
            </div>

            {/* Código do Boleto */}
            <div className="bg-slate-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-slate-800 mb-2">Código do Boleto:</h3>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-white p-2 rounded border text-sm font-mono">
                  23793.38128.60007.827136.95000.000000.000000.000000
                </code>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={copyBoletoCode}
                  className="p-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </motion.button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: isLoading ? 1 : 1.05 }}
              whileTap={{ scale: isLoading ? 1 : 0.95 }}
              onClick={handleBoletoCheckout}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl font-black text-white transition-all duration-300 shadow-2xl bg-gradient-to-r from-orange-600 to-orange-800 hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-3">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Gerando Boleto...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-3">
                  <Lock className="w-5 h-5" />
                  <span>Gerar Boleto</span>
                </div>
              )}
            </motion.button>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
              <Shield className="w-4 h-4" />
              <span>Pagamento 100% seguro e criptografado</span>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
