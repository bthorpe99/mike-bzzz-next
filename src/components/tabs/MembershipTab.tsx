'use client'

import { useState } from 'react'
import type { User } from '@supabase/supabase-js'
import AuthModal from '../auth/AuthModal'

interface Props {
  user: User | null
  isMember: boolean
}

const perks = [
  { icon: '💰', title: 'Member Rates', desc: 'Up to 20% off every rental' },
  { icon: '⚡', title: 'Priority Booking', desc: 'Reserve before the public opens' },
  { icon: '🔑', title: 'Members-Only Cars', desc: 'Access exclusive vehicles' },
  { icon: '📞', title: 'VIP Support', desc: 'Direct line to Mike 24/7' },
  { icon: '🎯', title: 'No Hold Fees', desc: 'Reserve with no upfront hold' },
  { icon: '🔄', title: 'Free Cancellation', desc: 'Cancel anytime, no questions' },
]

export default function MembershipTab({ user, isMember }: Props) {
  const [showAuth, setShowAuth] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleJoin() {
    if (!user) { setShowAuth(true); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else setError(data.error || 'Something went wrong')
    } catch {
      setError('Network error — try again')
    } finally {
      setLoading(false)
    }
  }

  async function handleManage() {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 100, overflowY: 'auto' }}>
      {/* HERO */}
      <div style={{
        background: 'linear-gradient(160deg, #1a1500 0%, #0a0900 60%)',
        padding: '56px 24px 36px',
        textAlign: 'center',
        borderBottom: '1px solid var(--separator)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* glow rings */}
        <div style={{
          position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)',
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,214,10,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ fontSize: 52, marginBottom: 12 }}>⭐</div>

        <div className="member-badge" style={{ margin: '0 auto 16px' }}>
          Mike Bzzz VIP
        </div>

        <h1 style={{
          fontSize: 34, fontWeight: 800, letterSpacing: -1,
          color: '#fff', lineHeight: 1.1, marginBottom: 10,
        }}>
          Drive Like a{' '}
          <span style={{ color: 'var(--yellow)' }}>VIP</span>
        </h1>

        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, maxWidth: 280, margin: '0 auto 28px' }}>
          Join the Mike Bzzz membership and unlock exclusive rates, priority access, and members-only perks.
        </p>

        {/* Price card */}
        <div style={{
          background: 'rgba(255,214,10,0.08)',
          border: '1px solid rgba(255,214,10,0.25)',
          borderRadius: 20,
          padding: '20px 24px',
          marginBottom: 24,
          display: 'inline-block',
          minWidth: 200,
        }}>
          <div style={{ fontSize: 42, fontWeight: 800, color: 'var(--yellow)', letterSpacing: -1 }}>
            $7.99
          </div>
          <div style={{ fontSize: 13, color: 'var(--label2)', marginTop: 2 }}>per month · cancel anytime</div>
        </div>

        {isMember ? (
          <div>
            <div style={{
              background: 'var(--green-soft)',
              border: '1px solid rgba(204,255,0,0.3)',
              borderRadius: 14,
              padding: '12px 20px',
              color: 'var(--green)',
              fontWeight: 600,
              fontSize: 15,
              marginBottom: 14,
            }}>
              ✅ You&apos;re a Mike Bzzz VIP Member!
            </div>
            <button
              onClick={handleManage}
              disabled={loading}
              style={{
                background: 'var(--card)',
                color: 'var(--yellow)',
                border: '1px solid var(--separator)',
                borderRadius: 14,
                padding: '13px 32px',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                width: '100%',
              }}
            >
              {loading ? 'Opening...' : 'Manage Membership'}
            </button>
          </div>
        ) : (
          <div>
            <button
              onClick={handleJoin}
              disabled={loading}
              style={{
                background: 'var(--yellow)',
                color: '#000',
                border: 'none',
                borderRadius: 16,
                padding: '16px 0',
                fontSize: 17,
                fontWeight: 700,
                cursor: 'pointer',
                width: '100%',
                boxShadow: '0 6px 24px rgba(255,214,10,0.45)',
                marginBottom: 10,
              }}
            >
              {loading ? 'Loading...' : user ? '⚡ Join for $7.99 / mo' : '⚡ Sign Up & Join'}
            </button>
            {error && (
              <p style={{ color: 'var(--red)', fontSize: 13, marginTop: 6 }}>{error}</p>
            )}
            <p style={{ fontSize: 12, color: 'var(--label3)', marginTop: 8 }}>
              Cancel anytime from your profile
            </p>
          </div>
        )}
      </div>

      {/* PERKS GRID */}
      <div style={{ padding: '24px 16px 0' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 14, letterSpacing: -0.5 }}>
          Member Perks
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {perks.map(p => (
            <div key={p.title} style={{
              background: 'var(--card)',
              borderRadius: 'var(--radius)',
              padding: '16px 14px',
              border: '1px solid var(--separator)',
            }}>
              <div style={{ fontSize: 26, marginBottom: 8 }}>{p.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{p.title}</div>
              <div style={{ fontSize: 11, color: 'var(--label2)', lineHeight: 1.5 }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ strip */}
      <div style={{ padding: '24px 16px 0' }}>
        <div style={{
          background: 'var(--card)',
          borderRadius: 'var(--radius)',
          padding: '16px',
          border: '1px solid var(--separator)',
        }}>
          <p style={{ fontSize: 13, color: 'var(--label2)', lineHeight: 1.6 }}>
            💳 Membership is billed monthly via Stripe. Cancel anytime from your Profile — no fees, no hassle. Your card is never charged until you confirm.
          </p>
        </div>
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  )
}
