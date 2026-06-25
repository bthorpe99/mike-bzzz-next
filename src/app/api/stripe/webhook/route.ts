import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServerClient } from '@supabase/ssr'
import Stripe from 'stripe'

function getSupabase() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  )
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const getUserId = (obj: Stripe.Subscription | Stripe.Customer) => {
    const meta = (obj as Stripe.Subscription).metadata
    return meta?.supabase_user_id
  }

  const supabase = getSupabase()
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const userId = getUserId(sub)
      if (!userId) break
      await supabase.from('memberships').upsert({
        user_id: userId,
        stripe_subscription_id: sub.id,
        stripe_customer_id: sub.customer as string,
        status: sub.status === 'active' ? 'active' : 'inactive',
        current_period_end: new Date((sub as any).current_period_end * 1000).toISOString(),
      }, { onConflict: 'user_id' })
      break
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const userId = getUserId(sub)
      if (!userId) break
      await supabase.from('memberships')
        .update({ status: 'cancelled' })
        .eq('user_id', userId)
      break
    }
  }

  return NextResponse.json({ received: true })
}
