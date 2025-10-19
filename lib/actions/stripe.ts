'use server'

import { headers } from 'next/headers'
import { stripe } from '../stripe'
import { formatAmountForStripe } from '../stripe'

export async function createCheckoutSession(
  amount: number,
  paymentMethod: string,
  usdcAmount: number
) {
  const origin = (await headers()).get('origin')

  // Create Checkout Sessions from body params.
  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    line_items: [
      {
        price_data: {
          currency: 'brl',
          product_data: {
            name: 'USDC Purchase',
            description: `Compra de ${usdcAmount.toFixed(6)} USDC`,
          },
          unit_amount: formatAmountForStripe(amount),
        },
        quantity: 1,
      }
    ],
    mode: 'payment',
    payment_method_types: paymentMethod === 'pix' ? ['pix'] : paymentMethod === 'boleto' ? ['boleto'] : ['card'],
    metadata: {
      usdcAmount: usdcAmount.toString(),
      paymentMethod: paymentMethod,
      platform: '12x'
    },
    return_url: `${origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
  })

  return session.client_secret
}
