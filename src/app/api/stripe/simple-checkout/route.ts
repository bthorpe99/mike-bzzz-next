import { NextResponse } from 'next/server'
import { MEMBERSHIP_PRICE_ID, stripe } from '@/lib/stripe'
import { getSiteUrl } from '@/lib/site-url'

export async function GET() {
  const siteUrl = getSiteUrl()
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: MEMBERSHIP_PRICE_ID, quantity: 1 }],
    success_url: `${siteUrl}/api/membership/complete?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/`,
  })
  return NextResponse.redirect(session.url!)
}
