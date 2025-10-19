import { NextRequest, NextResponse } from 'next/server'
import { createStripePaymentIntent, createStripeCheckoutSession } from '@/lib/payments'
import { validateCustomerData } from '@/lib/payments'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      amount, 
      usdcAmount, 
      paymentMethod, 
      installments, 
      customerEmail, 
      customerName, 
      customerDocument 
    } = body

    // Validar dados do cliente
    const validation = validateCustomerData({
      email: customerEmail,
      name: customerName,
      document: customerDocument
    })

    if (!validation.valid) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Dados inválidos', 
          details: validation.errors 
        },
        { status: 400 }
      )
    }

    // Validar valor
    if (amount < 10 || amount > 10000) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Valor deve estar entre R$ 10,00 e R$ 10.000,00' 
        },
        { status: 400 }
      )
    }

    let result

    if (paymentMethod === 'credit_card' || paymentMethod === 'debit_card') {
      // Criar payment intent para cartão
      result = await createStripePaymentIntent(
        amount,
        'brl',
        installments
      )
    } else if (paymentMethod === 'pix') {
      // Criar checkout session para PIX
      result = await createStripeCheckoutSession(
        amount,
        usdcAmount,
        customerEmail,
        `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
        `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`
      )
    } else {
      return NextResponse.json(
        { success: false, error: 'Método de pagamento inválido' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result
    })

  } catch (error) {
    console.error('Erro ao criar pagamento:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor' 
      },
      { status: 500 }
    )
  }
}
