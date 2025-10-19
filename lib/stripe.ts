import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
})

export const formatAmountForStripe = (amount: number): number => {
  return Math.round(amount * 100)
}
