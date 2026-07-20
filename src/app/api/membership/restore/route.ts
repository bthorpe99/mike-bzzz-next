import { NextRequest, NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'
import { createAdminClient } from '@/lib/supabase/admin'
import { getSiteUrl } from '@/lib/site-url'

function cleanEnv(value: string | undefined) {
  return (value || '').replace(/^\uFEFF/, '').trim()
}

function restoreToken(email: string) {
  return createHmac('sha256', cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY))
    .update(email)
    .digest('base64url')
}

function isValidToken(email: string, token: string | null) {
  if (!token) return false
  const expected = restoreToken(email)
  const actualBuffer = Buffer.from(token)
  const expectedBuffer = Buffer.from(expected)
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer)
}

export async function GET(req: NextRequest) {
  const siteUrl = getSiteUrl()
  const email = req.nextUrl.searchParams.get('email')?.toLowerCase()
  const token = req.nextUrl.searchParams.get('token')

  if (!email || !isValidToken(email, token)) {
    return NextResponse.redirect(`${siteUrl}/?tab=membership&member=0`)
  }

  const supabase = createAdminClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('id,email')
    .eq('email', email)
    .maybeSingle()

  if (!profile?.id) {
    return NextResponse.redirect(`${siteUrl}/?tab=membership&member=0`)
  }

  const { data: membership } = await supabase
    .from('memberships')
    .select('status')
    .eq('user_id', profile.id)
    .maybeSingle()

  if (membership?.status !== 'active') {
    return NextResponse.redirect(`${siteUrl}/?tab=membership&member=0`)
  }

  const res = NextResponse.redirect(`${siteUrl}/?tab=membership&member=1`)
  res.cookies.set('mbz_vip_user', profile.id, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
  })
  res.cookies.set('mbz_vip_email', profile.email, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
  })

  return res
}
