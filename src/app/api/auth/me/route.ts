import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ user: null, membership: null })
  }

  const { data: membership } = await supabase
    .from('memberships')
    .select('status,current_period_end')
    .eq('user_id', user.id)
    .maybeSingle()

  return NextResponse.json({
    user: { email: user.email },
    membership: membership || null,
  })
}
