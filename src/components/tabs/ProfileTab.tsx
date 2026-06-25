'use client'

import { useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import AuthModal from '../auth/AuthModal'

interface Props {
  user: User | null
  isMember: boolean
  onTabChange: (tab: any) => void
}

export default function ProfileTab({ user, isMember, onTabChange }: Props) {
  const [showAuth, setShowAuth] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleSignOut() {
    setLoading(true)
    await supabase.auth.signOut()
    window.location.reload()
  }

  async function handleManageBilling() {
    setLoading(true)
    const res = await fetch('/api/stripe/portal', { method: 'POST' })
    const data = await res.json()
    if (data.url) window.location.href = data.url
    setLoading(false)
  }

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px 100px', textAlign: 'center' }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>👤</div>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Your Profile</h2>
        <p style={{ fontSize: 14, color: 'var(--label2)', marginBottom: 28 }}>Sign in to manage your rentals and membership</p>
        <button
          onClick={() => setShowAuth(true)}
          style={{ background: 'var(--yellow)', color: '#000', border: 'none', borderRadius: 14, padding: '14px 32px', fontSize: 16, fontWeight: 700, cursor: 'pointer', width: '100%', maxWidth: 280 }}
        >
          Sign In / Sign Up
        </button>
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      </div>
    )
  }

  const initials = (user.user_metadata?.full_name as string || user.email || 'U')
    .split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 100, overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ padding: '52px 24px 24px', borderBottom: '1px solid var(--separator)', textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--yellow)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 700, color: '#000', margin: '0 auto 12px' }}>
          {initials}
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
          {user.user_metadata?.full_name || 'Driver'}
        </h2>
        <p style={{ fontSize: 13, color: 'var(--label2)', marginBottom: 10 }}>{user.email}</p>
        {isMember && <span className="member-badge">⭐ VIP Member</span>}
      </div>

      {/* Membership card */}
      <div style={{ padding: '20px 16px 0' }}>
        {isMember ? (
          <div style={{ background: 'linear-gradient(135deg, #1a1500, #0a0900)', border: '1px solid rgba(255,214,10,0.3)', borderRadius: 'var(--radius)', padding: '18px 16px', marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>⭐ Mike Bzzz VIP</span>
              <span style={{ fontSize: 12, background: 'var(--green-soft)', color: 'var(--green)', padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>Active</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--label2)', marginBottom: 14 }}>$7.99 / month · All perks unlocked</p>
            <button onClick={handleManageBilling} disabled={loading} style={{ background: 'var(--fill)', color: 'var(--yellow)', border: '1px solid var(--separator)', borderRadius: 10, padding: '10px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', width: '100%' }}>
              {loading ? 'Loading...' : 'Manage Billing'}
            </button>
          </div>
        ) : (
          <div style={{ background: 'var(--card)', border: '1px solid var(--separator)', borderRadius: 'var(--radius)', padding: '18px 16px', marginBottom: 12 }}>
            <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>No active membership</p>
            <p style={{ fontSize: 13, color: 'var(--label2)', marginBottom: 14 }}>Join for $7.99/mo to unlock VIP perks</p>
            <button onClick={() => onTabChange('membership')} style={{ background: 'var(--yellow)', color: '#000', border: 'none', borderRadius: 10, padding: '11px 16px', fontSize: 14, fontWeight: 700, cursor: 'pointer', width: '100%' }}>
              ⭐ Join Membership
            </button>
          </div>
        )}

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          disabled={loading}
          style={{ width: '100%', background: 'var(--red-soft)', color: 'var(--red)', border: '1px solid rgba(255,107,53,0.25)', borderRadius: 'var(--radius-sm)', padding: '13px', fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: 8 }}
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}
