'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { CreditCard, Smartphone, Zap, Calculator, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface PaymentFormProps {
  conversionRate: number
  isWalletConnected: boolean
  walletAddress: string
}

interface FormData {
  amount: number
  paymentMethod: string
  installments: number
  customerEmail: string
  customerName: string
  customerDocument: string
}

const PAYMENT_METHODS = [
  {
    id: 'credit_card',
    name: 'Cartão de Crédito',
    icon: CreditCard,
    color: 'from-blue-500 to-blue-600',
    installments: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  },
  {
    id: 'debit_card',
    name: 'Cartão de Débito',
    icon: CreditCard,
    color: 'from-green-500 to-green-600',
    installments: [1]
  },
  {
    id: 'pix',
    name: 'PIX',
    icon: Zap,
    color: 'from-purple-500 to-purple-600',
    installments: [1]
  }
]

export default function PaymentForm({ conversionRate, isWalletConnected, walletAddress }: PaymentFormProps) {
  const [selectedMethod, setSelectedMethod] = useState('credit_card')
  const [installments, setInstallments] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [calculatedAmount, setCalculatedAmount] = useState(0)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>()
  const watchedAmount = watch('amount')

  const selectedPaymentMethod = PAYMENT_METHODS.find(method => method.id === selectedMethod)

  useEffect(() => {
    if (watchedAmount && watchedAmount > 0) {
      const usdcAmount = watchedAmount / conversionRate
      setCalculatedAmount(usdcAmount)
    }
  }, [watchedAmount, conversionRate])

  const calculateInstallmentAmount = (amount: number, installments: number) => {
    if (installments === 1) return amount
    
    const interestRate = 0.02 // 2% ao mês
    const totalAmount = amount * Math.pow(1 + interestRate, installments)
    return totalAmount / installments
  }

  const onSubmit = async (data: FormData) => {
    if (!isWalletConnected) {
      toast.error('Conecte sua carteira primeiro')
      return
    }

    setIsProcessing(true)
    
    try {
      // Simular processamento de pagamento
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('Pagamento processado com sucesso!')
      
      // Aqui você integraria com Stripe, MercadoPago, etc.
      console.log('Dados do pagamento:', {
        ...data,
        usdcAmount: calculatedAmount,
        installments,
        walletAddress
      })
      
    } catch (error) {
      toast.error('Erro ao processar pagamento')
      console.error('Erro:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Comprar USDC</h2>
        <p className="text-gray-600">Preencha os dados para realizar sua compra</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Valor em BRL */}
        <div>
          <label className="label">
            Valor em Reais (BRL)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
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
              className="input-field pl-8"
              placeholder="100,00"
            />
          </div>
          {errors.amount && (
            <p className="error-message">{errors.amount.message}</p>
          )}
        </div>

        {/* Conversão USDC */}
        {watchedAmount && watchedAmount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calculator className="text-blue-600" size={20} />
                <span className="text-sm font-medium text-blue-900">Você receberá:</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-900">
                  {calculatedAmount.toFixed(6)} USDC
                </div>
                <div className="text-sm text-blue-600">
                  Taxa: R$ {conversionRate.toFixed(2)} por USDC
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Métodos de Pagamento */}
        <div>
          <label className="label">Método de Pagamento</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PAYMENT_METHODS.map((method) => {
              const Icon = method.icon
              return (
                <motion.button
                  key={method.id}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedMethod === method.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${method.color}`}>
                      <Icon className="text-white" size={20} />
                    </div>
                    <span className="text-sm font-medium">{method.name}</span>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Parcelamento */}
        {selectedPaymentMethod && selectedPaymentMethod.installments.length > 1 && (
          <div>
            <label className="label">Parcelamento</label>
            <select
              value={installments}
              onChange={(e) => setInstallments(Number(e.target.value))}
              className="input-field"
            >
              {selectedPaymentMethod.installments.map((num) => (
                <option key={num} value={num}>
                  {num === 1 ? 'À vista' : `${num}x de R$ ${(watchedAmount / num).toFixed(2)}`}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Dados do Cliente */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Dados do Cliente</h3>
          
          <div>
            <label className="label">Nome Completo</label>
            <input
              type="text"
              {...register('customerName', { required: 'Nome é obrigatório' })}
              className="input-field"
              placeholder="Seu nome completo"
            />
            {errors.customerName && (
              <p className="error-message">{errors.customerName.message}</p>
            )}
          </div>

          <div>
            <label className="label">Email</label>
            <input
              type="email"
              {...register('customerEmail', { 
                required: 'Email é obrigatório',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Email inválido'
                }
              })}
              className="input-field"
              placeholder="seu@email.com"
            />
            {errors.customerEmail && (
              <p className="error-message">{errors.customerEmail.message}</p>
            )}
          </div>

          <div>
            <label className="label">CPF/CNPJ</label>
            <input
              type="text"
              {...register('customerDocument', { 
                required: 'CPF/CNPJ é obrigatório',
                pattern: {
                  value: /^\d{11}$|^\d{14}$/,
                  message: 'CPF/CNPJ inválido'
                }
              })}
              className="input-field"
              placeholder="000.000.000-00"
            />
            {errors.customerDocument && (
              <p className="error-message">{errors.customerDocument.message}</p>
            )}
          </div>
        </div>

        {/* Resumo do Pagamento */}
        {watchedAmount && watchedAmount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-50 border border-gray-200 rounded-lg p-4"
          >
            <h4 className="font-semibold text-gray-900 mb-3">Resumo do Pagamento</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Valor:</span>
                <span>R$ {watchedAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>USDC a receber:</span>
                <span>{calculatedAmount.toFixed(6)} USDC</span>
              </div>
              {installments > 1 && (
                <div className="flex justify-between">
                  <span>Parcelas:</span>
                  <span>{installments}x de R$ {(watchedAmount / installments).toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-gray-300 pt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>R$ {watchedAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Aviso de Carteira */}
        {!isWalletConnected && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
          >
            <div className="flex items-start space-x-3">
              <AlertCircle className="text-yellow-600 mt-0.5" size={20} />
              <div>
                <p className="text-sm text-yellow-800">
                  <strong>Conecte sua carteira</strong> para receber os USDC após o pagamento.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Botão de Pagamento */}
        <motion.button
          type="submit"
          disabled={!isWalletConnected || isProcessing}
          whileHover={{ scale: isProcessing ? 1 : 1.02 }}
          whileTap={{ scale: isProcessing ? 1 : 0.98 }}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all ${
            !isWalletConnected || isProcessing
              ? 'bg-gray-400 cursor-not-allowed'
              : 'btn-primary'
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="loading-spinner"></div>
              <span>Processando...</span>
            </div>
          ) : (
            `Pagar R$ ${watchedAmount ? watchedAmount.toFixed(2) : '0,00'}`
          )}
        </motion.button>
      </form>
    </motion.div>
  )
}
