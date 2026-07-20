import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(req: NextRequest) {
  const email = req.cookies.get('mbz_vip_email')?.value?.toLowerCase()
  if (!email) {
    return NextResponse.json({ active: false })
  }

  const supabase = createAdminClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('id,email')
    .eq('email', email)
    .single()

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
