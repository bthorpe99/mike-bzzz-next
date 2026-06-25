import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

const PRICE_ID = 'price_1Tm74MCKZXCqFvhFR1aOuxcb'
const SITE_URL = 'https://www.mikebzzrentals.com'

export async function GET() {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: PRICE_ID, quantity: 1 }],
    success_url: `${SITE_URL}/?member=1`,
    cancel_url: `${SITE_URL}/`,
  })
  return NextResponse.redirect(session.url!)
}
