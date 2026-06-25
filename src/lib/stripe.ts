import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-06-24.dahlia',
})

export const MEMBERSHIP_PRICE_ID = process.env.STRIPE_MEMBERSHIP_PRICE_ID!
export const MEMBERSHIP_PRICE = 7.99
