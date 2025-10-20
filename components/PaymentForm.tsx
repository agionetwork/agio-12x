'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { CreditCard, Smartphone, Zap, Calculator, ArrowRight, FileText } from 'lucide-react'
import toast from 'react-hot-toast'

interface PaymentFormProps {
  conversionRate: number
  isLoading?: boolean
}

interface FormData {
  amount: number
  paymentMethod: string
}

const PAYMENT_METHODS = [
  {
    id: 'credit_card',
    name: 'Cartão de Crédito',
    icon: CreditCard,
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'debit_card',
    name: 'Cartão de Débito',
    icon: CreditCard,
    color: 'from-green-500 to-green-600',
  },
  {
    id: 'pix',
    name: 'PIX',
    icon: Zap,
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: 'boleto',
    name: 'Boleto',
    icon: FileText,
    color: 'from-orange-500 to-orange-600',
  }
]

export default function PaymentForm({ conversionRate, isLoading = false }: PaymentFormProps) {
  const [selectedMethod, setSelectedMethod] = useState('credit_card')
  const [calculatedAmount, setCalculatedAmount] = useState(0)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>()
  const watchedAmount = watch('amount')

  const selectedPaymentMethod = PAYMENT_METHODS.find(method => method.id === selectedMethod)

  useEffect(() => {
    if (watchedAmount && watchedAmount > 0) {
      // Descontar taxa da plataforma de 3%
      const amountAfterFee = watchedAmount * 0.97
      // Usar preço de venda (com spread de 3.5%)
      const salePrice = conversionRate * 1.035
      const usdcAmount = amountAfterFee / salePrice
      setCalculatedAmount(usdcAmount)
    }
  }, [watchedAmount, conversionRate])


  const onSubmit = async (data: FormData) => {
    try {
      // Determinar a página de checkout baseada no método selecionado
      const getCheckoutPage = (method: string) => {
        switch (method) {
          case 'credit_card':
            return '/checkout/cartao-credito'
          case 'debit_card':
            return '/checkout/cartao-debito'
          case 'pix':
            return '/checkout/pix'
          case 'boleto':
            return '/checkout/boleto'
          default:
            return '/checkout/cartao-credito'
        }
      }

      // Salvar dados do formulário
      const paymentData = {
        amount: data.amount,
        paymentMethod: selectedMethod,
        usdcAmount: calculatedAmount,
        timestamp: new Date().toISOString()
      }
      
      localStorage.setItem('paymentData', JSON.stringify(paymentData))
      
      // Redirecionar para a página de checkout
      const checkoutPage = getCheckoutPage(selectedMethod)
      window.location.href = checkoutPage
      
    } catch (error) {
      toast.error('Erro ao processar pagamento')
      console.error('Erro:', error)
    }
  }

  return (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="card relative overflow-hidden p-2 max-w-md mx-auto border-2 border-blue-500"
            >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white/30 to-blue-100/50"></div>
      
      {/* Content */}
      <div className="relative z-10">
                <div className="text-center mb-4">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full text-[10px] font-medium mb-1"
                  >
                    <Zap className="w-2.5 h-2.5" />
                    Compra Rápida e Segura
                  </motion.div>
                  
                  <h2 className="text-lg md:text-xl font-black text-gradient mb-2">
                    USDC em até 12x
                  </h2>
                  <p className="text-xs text-slate-600 max-w-lg mx-auto whitespace-nowrap">
                    Preencha os dados abaixo e receba seus USDC em sua carteira
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
          {/* Valor em BRL */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="label text-center block text-xs">
              💰 Valor em Reais (BRL)
            </label>
                    <div className="relative group max-w-48 mx-auto">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black font-bold text-sm z-10">R$</span>
              <input
                type="number"
                step="0.01"
                min="10"
                max="10000"
                {...register('amount', { 
                  required: 'Valor é obrigatório',
                  min: { value: 10, message: 'Valor mínimo é R$ 10,00' },
                  max: { value: 10000, message: 'Valor máximo é R$ 10.000,00' }
                })}
                className="input-field pl-8 text-center text-sm font-bold placeholder-slate-400 py-2"
                placeholder="100,00"
              />
            </div>
            {errors.amount && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="error-message text-center text-xs"
              >
                {errors.amount.message}
              </motion.p>
            )}
          </motion.div>

                  {/* Conversão USDC */}
                  {watchedAmount && watchedAmount > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-2 shadow-sm max-w-48 mx-auto"
                    >
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Calculator className="text-blue-600" size={12} />
                          <span className="text-xs font-bold text-blue-900">Você receberá:</span>
                        </div>
                        <div className="text-sm font-black text-gradient mb-1">
                          {calculatedAmount.toFixed(6)} USDC
                        </div>
                        <div className="text-xs text-blue-600">
                          Taxa: {isLoading ? (
                            <span className="inline-block w-16 h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-pulse"></span>
                          ) : (
                            `R$ ${(conversionRate * 1.035).toFixed(2)} por USDC`
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

          {/* Métodos de Pagamento */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label className="label text-center block">
              💳 Método de Pagamento
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {PAYMENT_METHODS.map((method, index) => {
                const Icon = method.icon
                return (
                  <motion.button
                    key={method.id}
                    type="button"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`p-2 rounded-lg border transition-all duration-300 ${
                      selectedMethod === method.id
                        ? 'border-blue-500 bg-blue-50 shadow-glow'
                        : 'border-slate-200 hover:border-slate-300 hover:shadow-lg'
                    }`}
                  >
                            <div className="flex items-center space-x-2">
                              <motion.div
                                whileHover={{ rotate: 10 }}
                                className={`p-2 rounded-lg bg-gradient-to-r ${method.color} shadow-sm`}
                              >
                                <Icon className="text-white" size={16} />
                              </motion.div>
                              <span className="font-semibold text-slate-700 text-[10px] leading-tight flex-1">{method.name}</span>
                            </div>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>





          {/* Você Pagará */}
          {watchedAmount && watchedAmount > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg p-2 shadow-sm max-w-48 mx-auto mt-4"
            >
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <CreditCard className="text-red-600" size={12} />
                  <span className="text-xs font-bold text-red-900">Você pagará:</span>
                </div>
                <div className="text-sm font-black text-red-700 mb-1 flex items-center justify-center gap-1">
                  <span>
                    R$ {selectedMethod === 'pix' || selectedMethod === 'boleto' || selectedMethod === 'debit_card'
                      ? (Number(watchedAmount) * 1.03).toFixed(2)
                      : Number(watchedAmount).toFixed(2)
                    }
                  </span>
                  {selectedMethod === 'credit_card' && (
                    <>
                      <span className="text-xs">em</span>
                      <select 
                        className="text-xs border border-red-300 rounded px-1 py-0.5 bg-white text-red-700"
                        defaultValue="1"
                      >
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}x
                          </option>
                        ))}
                      </select>
                    </>
                  )}
                </div>
                <div className="text-xs text-red-600 font-bold">
                  {selectedPaymentMethod?.name}
                </div>
                <div className="text-xs text-red-500 mt-1">
                  Taxas inclusas
                </div>
              </div>
            </motion.div>
          )}

                  {/* Botão de Pagamento */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="pt-1"
                  >
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="w-32 py-2 px-4 rounded-xl font-black text-sm text-white transition-all duration-300 shadow-2xl bg-gradient-to-r from-blue-600 to-blue-800 hover:shadow-glow mx-auto block"
            >
              <div className="flex items-center justify-center space-x-3">
                <Zap className="w-6 h-6" />
                <span>Pagar</span>
                <ArrowRight className="w-6 h-6" />
              </div>
            </motion.button>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
                      className="text-center text-xs text-slate-500 mt-4"
            >
              🔒 Pagamento 100% seguro e criptografado
            </motion.p>
          </motion.div>
        </form>
      </div>
    </motion.div>
  )
}
