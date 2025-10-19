import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Processar diferentes tipos de eventos
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent)
        break
      
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent)
        break
      
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('Payment succeeded:', paymentIntent.id)
    
    // Aqui você processaria a compra de USDC
    // Por exemplo, enviar confirmação por email ou criar ordem
    const amount = parseFloat(paymentIntent.metadata.amount || '0')
    const customerEmail = paymentIntent.metadata.customer_email
    
    if (customerEmail && amount > 0) {
      // Em produção, você implementaria a lógica real de processamento
      console.log(`12x - Processar compra de R$ ${amount} para ${customerEmail}`)
      
      // Exemplo: enviar email de confirmação
      // await sendConfirmationEmail(customerEmail, amount)
    }
    
  } catch (error) {
    console.error('Erro ao processar pagamento bem-sucedido:', error)
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('Payment failed:', paymentIntent.id)
    
    // Aqui você notificaria o usuário sobre a falha
    // e possivelmente reverteria qualquer ação já tomada
    
  } catch (error) {
    console.error('Erro ao processar pagamento falhado:', error)
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    console.log('Checkout completed:', session.id)
    
    // Processar pagamento PIX ou outros métodos
    const amount = parseFloat(session.metadata?.amount || '0')
    const customerEmail = session.metadata?.customer_email
    
    if (customerEmail && amount > 0) {
      console.log(`12x - Processar compra de R$ ${amount} para ${customerEmail}`)
      // Implementar processamento real
    }
    
  } catch (error) {
    console.error('Erro ao processar checkout completado:', error)
  }
}
