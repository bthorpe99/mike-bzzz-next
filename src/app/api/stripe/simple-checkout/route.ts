import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-04-10' })
const PRICE_ID = 'price_1Tm74MCKZXCqFvhFR1aOuxcb'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mikebzz.com'

export async function GET() {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: PRICE_ID, quantity: 1 }],
    success_url: `${SITE_URL}/app.html?member=1`,
    cancel_url: `${SITE_URL}/app.html`,
  })
  return NextResponse.redirect(session.url!)
}
