'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  onClose: () => void
  onSuccess?: () => void
}

export default function AuthModal({ onClose, onSuccess }: Props) {
  const [mode, setMode] = useState<'login' | 'signup'>('signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      })
      if (error) setError(error.message)
      else { setSent(true); setTimeout(() => { onSuccess?.(); onClose(); window.location.reload() }, 2000) }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else { onSuccess?.(); onClose(); window.location.reload() }
    }

    setLoading(false)
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(8px)', zIndex: 2000,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--card)', borderRadius: '24px 24px 0 0',
          padding: '28px 24px 48px', width: '100%', maxWidth: 430,
          border: '1px solid var(--separator)',
        }}
      >
        {/* handle */}
        <div style={{ width: 36, height: 4, background: 'var(--separator)', borderRadius: 2, margin: '0 auto 24px' }} />

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>⭐</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
            {mode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
          </h2>
          <p style={{ fontSize: 13, color: 'var(--label2)' }}>
            {mode === 'signup' ? 'Sign up to join the Mike Bzzz VIP membership' : 'Log in to manage your membership'}
          </p>
        </div>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📧</div>
            <p style={{ fontWeight: 600, marginBottom: 6 }}>Check your email!</p>
            <p style={{ fontSize: 13, color: 'var(--label2)' }}>We sent a confirmation link to {email}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--label2)', textTransform: 'uppercase', letterSpacing: 0.4 }}>
                  Full Name
                </label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Mike Johnson"
                  required
                  style={inputStyle}
                />
              </div>
            )}

            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--label2)', textTransform: 'uppercase', letterSpacing: 0.4 }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--label2)', textTransform: 'uppercase', letterSpacing: 0.4 }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                minLength={8}
                required
                style={inputStyle}
              />
            </div>

            {error && (
              <p style={{ color: 'var(--red)', fontSize: 13, marginBottom: 12 }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', background: 'var(--yellow)', color: '#000',
                border: 'none', borderRadius: 14, padding: '15px',
                fontSize: 16, fontWeight: 700, cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(255,214,10,0.4)',
                marginBottom: 14,
              }}
            >
              {loading ? 'Loading...' : mode === 'signup' ? 'Create Account' : 'Log In'}
            </button>

            <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--label2)' }}>
              {mode === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
              <button
                type="button"
                onClick={() => { setMode(mode === 'signup' ? 'login' : 'signup'); setError('') }}
                style={{ background: 'none', border: 'none', color: 'var(--yellow)', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}
              >
                {mode === 'signup' ? 'Log In' : 'Sign Up'}
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,214,10,0.07)',
  border: '1px solid var(--separator)',
  borderRadius: 12,
  padding: '12px 14px',
  fontSize: 15,
  color: 'var(--label)',
  fontFamily: 'inherit',
  marginTop: 6,
  outline: 'none',
}
