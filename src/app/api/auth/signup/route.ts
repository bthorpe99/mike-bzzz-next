import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { friendlyAuthError, normalizeEmail, normalizePassword } from '@/lib/auth-input'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    const normalizedEmail = normalizeEmail(email)
    const normalizedPassword = normalizePassword(password)

    if (!normalizedEmail || !normalizedPassword) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }
    if (normalizedPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password: normalizedPassword,
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
  } catch (error) {
    return NextResponse.json({ error: friendlyAuthError(error) }, { status: 400 })
  }
}
