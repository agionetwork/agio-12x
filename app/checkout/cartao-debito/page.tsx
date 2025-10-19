'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CreditCard, ArrowLeft, Lock, Shield } from 'lucide-react'
import Link from 'next/link'

export default function CartaoDebitoCheckout() {
  const [paymentData, setPaymentData] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const data = localStorage.getItem('paymentData')
    if (data) {
      setPaymentData(JSON.parse(data))
    } else {
      router.push('/comprar')
    }
  }, [router])

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
            <h1 className="text-xl font-bold text-gradient">Checkout - Cartão de Débito</h1>
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
              <CreditCard className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                Pagamento com Cartão de Débito
              </h2>
              {paymentData && (
                <div className="bg-green-50 rounded-lg p-4 mb-6">
                  <p className="text-slate-600 mb-2">
                    <strong>Valor:</strong> R$ {paymentData.amount}
                  </p>
                  <p className="text-slate-600">
                    <strong>USDC a receber:</strong> {paymentData.usdcAmount?.toFixed(6)} $USDC
                  </p>
                </div>
              )}
            </div>

            <form className="space-y-4">
              <div>
                <label className="label">Número do Cartão</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="1234 5678 9012 3456"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Validade</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="MM/AA"
                  />
                </div>
                <div>
                  <label className="label">CVV</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="123"
                  />
                </div>
              </div>

              <div>
                <label className="label">Nome no Cartão</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Nome como está no cartão"
                />
              </div>

              <div>
                <label className="label">CPF</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="000.000.000-00"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-3 px-4 rounded-xl font-black text-white transition-all duration-300 shadow-2xl bg-gradient-to-r from-green-600 to-green-800 hover:shadow-glow"
              >
                <div className="flex items-center justify-center space-x-3">
                  <Lock className="w-5 h-5" />
                  <span>Finalizar Pagamento</span>
                </div>
              </motion.button>
            </form>

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
