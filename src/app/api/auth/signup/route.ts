import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
  }
  if (String(password).length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
  }

  const supabase = await createClient()
  const normalizedEmail = String(email).toLowerCase()
  const { data, error } = await supabase.auth.signUp({
    email: normalizedEmail,
    password: String(password),
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  if (data.user?.id) {
    await supabase.from('profiles').upsert({
      id: data.user.id,
      email: normalizedEmail,
    })
  }

  return NextResponse.json({
    user: data.user ? { email: data.user.email } : null,
    needsEmailConfirmation: !data.session,
  })
}
