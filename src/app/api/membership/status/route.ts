import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const sessionSupabase = await createClient()
  const { data: { user } } = await sessionSupabase.auth.getUser()
  const supabase = createAdminClient()

  if (user) {
    const { data: membership } = await supabase
      .from('memberships')
      .select('status,current_period_end')
      .eq('user_id', user.id)
      .maybeSingle()

    return NextResponse.json({
      active: membership?.status === 'active',
      email: user.email,
      currentPeriodEnd: membership?.current_period_end || null,
      signedIn: true,
    })
  }
  const userId = req.cookies.get('mbz_vip_user')?.value
  const email = req.cookies.get('mbz_vip_email')?.value?.toLowerCase()

  let profile: { id: string; email: string | null } | null = null

  if (userId) {
    const { data } = await supabase
      .from('profiles')
      .select('id,email')
      .eq('id', userId)
      .maybeSingle()
    profile = data
  }

  if (!profile && email) {
    const { data } = await supabase
      .from('profiles')
      .select('id,email')
      .eq('email', email)
      .maybeSingle()
    profile = data
  }

  if (!profile?.id) {
    return NextResponse.json({ active: false })
  }

  const { data: membership } = await supabase
    .from('memberships')
    .select('status,current_period_end')
    .eq('user_id', profile.id)
    .single()

  return NextResponse.json({
    active: membership?.status === 'active',
    email: profile.email,
    currentPeriodEnd: membership?.current_period_end || null,
    signedIn: false,
  })
}
