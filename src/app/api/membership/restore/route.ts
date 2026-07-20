import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getSiteUrl } from '@/lib/site-url'

export async function GET(req: NextRequest) {
  const siteUrl = getSiteUrl()
  const email = req.nextUrl.searchParams.get('email')?.toLowerCase()

  if (!email) {
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
