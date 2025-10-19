'use client'

import { useState, useCallback } from 'react'
import { createStripePaymentIntent, createStripeCheckoutSession, verifyPaymentStatus } from '@/lib/payments'
import toast from 'react-hot-toast'

interface PaymentData {
  amount: number
  usdcAmount: number
  paymentMethod: string
  installments?: number
  customerEmail: string
  customerName: string
  customerDocument: string
}

export function usePayment() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null)

  const processPayment = useCallback(async (data: PaymentData) => {
    setIsProcessing(true)
    
    try {
      let result

      if (data.paymentMethod === 'credit_card' || data.paymentMethod === 'debit_card') {
        // Criar payment intent para cartão
        result = await createStripePaymentIntent(
          data.amount,
          'brl',
          data.installments
        )
        setPaymentIntentId(result.paymentIntentId)
      } else if (data.paymentMethod === 'pix') {
        // Criar checkout session para PIX
        result = await createStripeCheckoutSession(
          data.amount,
          data.usdcAmount,
          data.customerEmail,
          `${window.location.origin}/success`,
          `${window.location.origin}/cancel`
        )
      }

      return result
    } catch (error) {
      console.error('Erro ao processar pagamento:', error)
      toast.error('Erro ao processar pagamento')
      throw error
    } finally {
      setIsProcessing(false)
    }
  }, [])

  const verifyPayment = useCallback(async (paymentId: string) => {
    try {
      const result = await verifyPaymentStatus(paymentId)
      return result
    } catch (error) {
      console.error('Erro ao verificar pagamento:', error)
      toast.error('Erro ao verificar status do pagamento')
      throw error
    }
  }, [])

  const resetPayment = useCallback(() => {
    setPaymentIntentId(null)
    setIsProcessing(false)
  }, [])

  return {
    isProcessing,
    paymentIntentId,
    processPayment,
    verifyPayment,
    resetPayment
  }
}
