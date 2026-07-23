import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import Stripe from 'stripe'

type StripeSubscriptionWithPeriod = Stripe.Subscription & {
  current_period_end?: number
}

export const runtime = 'nodejs'

function normalizeStatus(status: Stripe.Subscription.Status) {
  if (status === 'active' || status === 'trialing') return 'active'
  if (status === 'past_due') return 'past_due'
  if (status === 'canceled' || status === 'unpaid') return 'cancelled'
  return 'inactive'
}

async function findUserIdForSubscription(sub: Stripe.Subscription) {
  const metadataUserId = sub.metadata?.supabase_user_id
  if (metadataUserId) return metadataUserId

  const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id
  const supabase = createAdminClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .maybeSingle()

  return profile?.id || null
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing Stripe signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (error) {
    console.error('Stripe webhook signature verification failed', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    const supabase = createAdminClient()

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object as StripeSubscriptionWithPeriod
        const userId = await findUserIdForSubscription(sub)
        if (!userId) break

        const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id
        const { error } = await supabase.from('memberships').upsert({
          user_id: userId,
          stripe_subscription_id: sub.id,
          stripe_customer_id: customerId,
          status: normalizeStatus(sub.status),
          current_period_end: sub.current_period_end ? new Date(sub.current_period_end * 1000).toISOString() : null,
        }, { onConflict: 'user_id' })

        if (error) throw error
        break
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        const userId = await findUserIdForSubscription(sub)
        if (!userId) break

        const { error } = await supabase.from('memberships')
          .update({ status: 'cancelled' })
          .eq('user_id', userId)

        if (error) throw error
        break
      }
    }
  } catch (error) {
    console.error('Stripe webhook processing failed', { type: event.type, error })
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
