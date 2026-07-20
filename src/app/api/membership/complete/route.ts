import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import { getSiteUrl } from '@/lib/site-url'

type SubscriptionWithPeriodEnd = Stripe.Subscription & {
  current_period_end?: number
}

async function findOrCreateUser(email: string, name?: string | null) {
  const supabase = createAdminClient()
  const normalizedEmail = email.toLowerCase()

  const { data: list, error: listError } = await supabase.auth.admin.listUsers()
  if (listError) throw listError

  const existing = list.users.find((user) => user.email?.toLowerCase() === normalizedEmail)
  if (existing) return existing.id

  const { data, error } = await supabase.auth.admin.createUser({
    email: normalizedEmail,
    email_confirm: true,
    user_metadata: name ? { full_name: name } : undefined,
  })
  if (error) throw error
  if (!data.user) throw new Error('Supabase user was not created')

  return data.user.id
}

async function upsertMembershipFromSession(session: Stripe.Checkout.Session) {
  const email = session.customer_details?.email || session.customer_email
  if (!email) throw new Error('Stripe session did not include a customer email')

  const subscriptionId = typeof session.subscription === 'string'
    ? session.subscription
    : session.subscription?.id
  if (!subscriptionId) throw new Error('Stripe session did not include a subscription')

  const subscription = await stripe.subscriptions.retrieve(subscriptionId) as SubscriptionWithPeriodEnd
  const customerId = typeof session.customer === 'string'
    ? session.customer
    : session.customer?.id || String(subscription.customer)

  const userId = await findOrCreateUser(email, session.customer_details?.name)
  const supabase = createAdminClient()

  await supabase.from('profiles').upsert({
    id: userId,
    email: email.toLowerCase(),
    full_name: session.customer_details?.name || null,
    stripe_customer_id: customerId,
  })

  await supabase.from('memberships').upsert({
    user_id: userId,
    stripe_subscription_id: subscription.id,
    stripe_customer_id: customerId,
    status: subscription.status === 'active' ? 'active' : 'inactive',
    current_period_end: subscription.current_period_end
      ? new Date(subscription.current_period_end * 1000).toISOString()
      : null,
  }, { onConflict: 'user_id' })

  return { email: email.toLowerCase(), active: subscription.status === 'active' }
}

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id')
  const siteUrl = getSiteUrl()

  if (!sessionId) {
    return NextResponse.redirect(`${siteUrl}/?tab=membership&member=0`)
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'customer'],
    })

    if (session.payment_status !== 'paid' && session.status !== 'complete') {
      return NextResponse.redirect(`${siteUrl}/?tab=membership&member=0`)
    }

    const result = await upsertMembershipFromSession(session)
    const res = NextResponse.redirect(`${siteUrl}/?tab=membership&member=1`)
    if (result.active) {
      res.cookies.set('mbz_vip_email', result.email, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365,
        path: '/',
      })
    }
    return res
  } catch (error) {
    console.error('Membership completion failed', error)
    return NextResponse.redirect(`${siteUrl}/?tab=membership&member=0`)
  }
}
