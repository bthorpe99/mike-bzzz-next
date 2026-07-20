import { createClient } from '@supabase/supabase-js'

function cleanEnv(value: string | undefined) {
  return (value || '').replace(/^\uFEFF/, '').trim()
}

export function createAdminClient() {
  return createClient(
    cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL),
    cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
