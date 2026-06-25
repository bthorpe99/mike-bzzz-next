import { createClient } from '@/lib/supabase/server'
import AppShell from '@/components/AppShell'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let isMember = false
  if (user) {
    const { data } = await supabase
      .from('memberships')
      .select('status')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle()
    isMember = !!data
  }

  return <AppShell user={user} isMember={isMember} />
}
