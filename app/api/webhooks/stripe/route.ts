import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { transferUSDC } from '@/lib/solana'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
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
    
    // Aqui você processaria a transferência de USDC
    // Por exemplo, enviar para o endereço da carteira do usuário
    const usdcAmount = parseFloat(paymentIntent.metadata.usdc_amount || '0')
    const walletAddress = paymentIntent.metadata.wallet_address
    
    if (walletAddress && usdcAmount > 0) {
      // Em produção, você implementaria a lógica real de transferência
      console.log(`Transferir ${usdcAmount} USDC para ${walletAddress}`)
      
      // Exemplo de transferência (implementar conforme necessário)
      // await transferUSDC(usdcAmount, walletAddress)
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
    const usdcAmount = parseFloat(session.metadata?.usdc_amount || '0')
    const walletAddress = session.metadata?.wallet_address
    
    if (walletAddress && usdcAmount > 0) {
      console.log(`Transferir ${usdcAmount} USDC para ${walletAddress}`)
      // Implementar transferência real
    }
    
  } catch (error) {
    console.error('Erro ao processar checkout completado:', error)
  }
}
