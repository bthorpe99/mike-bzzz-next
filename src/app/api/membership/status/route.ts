import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(req: NextRequest) {
  const supabase = createAdminClient()
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
  })
}
