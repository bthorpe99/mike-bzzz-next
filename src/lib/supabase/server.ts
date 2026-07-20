import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const cleanEnvValue = (value: string | undefined) =>
  String(value ?? '').replace(/[\u200B-\u200D\u2060\uFEFF]/g, '').replace(/[^\x20-\x7E]/g, '').trim()

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    cleanEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL),
    cleanEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    {
      cookieOptions: {
        name: 'mbz-auth-token',
      },
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}
