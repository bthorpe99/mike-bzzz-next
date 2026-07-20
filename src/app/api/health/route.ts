import { NextResponse } from 'next/server'
import { getSiteUrl } from '@/lib/site-url'

const requiredEnv = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'STRIPE_MEMBERSHIP_PRICE_ID',
  'NEXT_PUBLIC_SITE_URL',
]

const hasRealValue = (key: string) => {
  const value = process.env[key]
  return !!value && !/your_|placeholder|example/i.test(value)
}

export async function GET() {
  const missing = requiredEnv.filter((key) => !hasRealValue(key))
  const sentryConfigured = hasRealValue('NEXT_PUBLIC_SENTRY_DSN')

  return NextResponse.json(
    {
      ok: missing.length === 0,
      service: 'mike-bzzz-rentals',
      siteUrl: getSiteUrl(),
      checks: {
        env: missing.length === 0 ? 'ok' : 'missing',
        stripe: hasRealValue('STRIPE_SECRET_KEY') && hasRealValue('STRIPE_MEMBERSHIP_PRICE_ID') ? 'configured' : 'missing',
        supabase: hasRealValue('NEXT_PUBLIC_SUPABASE_URL') && hasRealValue('SUPABASE_SERVICE_ROLE_KEY') ? 'configured' : 'missing',
        sentry: sentryConfigured ? 'configured' : 'not_configured',
      },
      missing,
    },
    { status: missing.length === 0 ? 200 : 503 }
  )
}
