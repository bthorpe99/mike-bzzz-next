import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe, MEMBERSHIP_PRICE_ID } from '@/lib/stripe'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  // Get or create Stripe customer
  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single()

  let customerId = profile?.stripe_customer_id

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { supabase_user_id: user.id },
    })
    customerId = customer.id
    await supabase.from('profiles').upsert({
      id: user.id,
      stripe_customer_id: customerId,
      email: user.email,
    })
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: MEMBERSHIP_PRICE_ID, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}?tab=membership&success=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}?tab=membership`,
    subscription_data: {
      metadata: { supabase_user_id: user.id },
    },
  })

  return NextResponse.json({ url: session.url })
}
