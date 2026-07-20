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

    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password: normalizedPassword,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    return NextResponse.json({ user: { email: data.user.email } })
  } catch (error) {
    return NextResponse.json({ error: friendlyAuthError(error) }, { status: 400 })
  }
}
