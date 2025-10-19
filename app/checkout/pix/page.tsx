'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Zap, ArrowLeft, Copy, Check, Clock, Shield } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function PixCheckout() {
  const [paymentData, setPaymentData] = useState(null)
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutos
  const router = useRouter()

  // Mock PIX code (em produção, viria do Stripe)
  const pixCode = '00020126360014BR.GOV.BCB.PIX0114+5511999999999520400005303986540.005802BR5913MERCADO PAGO6009SAO PAULO62070503***63041D3D'

  useEffect(() => {
    const data = localStorage.getItem('paymentData')
    if (data) {
      setPaymentData(JSON.parse(data))
    } else {
      router.push('/comprar')
    }
  }, [router])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const copyPixCode = async () => {
    try {
      await navigator.clipboard.writeText(pixCode)
      setCopied(true)
      toast.success('Código PIX copiado!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Erro ao copiar código')
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
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
            <h1 className="text-xl font-bold text-gradient">Checkout - PIX</h1>
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
              <Zap className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                Pagamento via PIX
              </h2>
              {paymentData && (
                <div className="bg-purple-50 rounded-lg p-4 mb-6">
                  <p className="text-slate-600 mb-2">
                    <strong>Valor:</strong> R$ {paymentData.amount}
                  </p>
                  <p className="text-slate-600">
                    <strong>USDC a receber:</strong> {paymentData.usdcAmount?.toFixed(6)} $USDC
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Timer */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <span className="text-orange-800 font-semibold">Tempo restante</span>
                </div>
                <div className="text-2xl font-bold text-orange-600">
                  {formatTime(timeLeft)}
                </div>
              </div>

              {/* PIX Code */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-slate-600 mb-3 text-center">
                  Copie o código PIX e cole no seu app bancário:
                </p>
                <div className="bg-white rounded border p-3 text-xs font-mono break-all mb-4">
                  {pixCode}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={copyPixCode}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg text-sm font-semibold"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Código Copiado!' : 'Copiar Código PIX'}
                </motion.button>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Como pagar:</h3>
                <ol className="text-sm text-blue-700 space-y-1">
                  <li>1. Abra seu app bancário</li>
                  <li>2. Escolha a opção PIX</li>
                  <li>3. Cole o código copiado</li>
                  <li>4. Confirme o pagamento</li>
                </ol>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
              <Shield className="w-4 h-4" />
              <span>Pagamento 100% seguro e instantâneo</span>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
