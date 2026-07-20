import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  const res = NextResponse.json({ ok: true })
  res.cookies.delete('mbz_vip_user')
  res.cookies.delete('mbz_vip_email')
  return res
}
