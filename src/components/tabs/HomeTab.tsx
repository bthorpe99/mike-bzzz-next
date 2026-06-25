'use client'

import Image from 'next/image'
import type { User } from '@supabase/supabase-js'

const CARS = [
  { id: '2012-green', name: '2012 Ford Fusion', color: 'Dark Green', img: '/media/2012-ford-fusion-dark-green.jpg', price: 65, memberPrice: 52 },
  { id: '2015-black', name: '2015 Ford Fusion', color: 'Midnight Black', img: '/media/2015-ford-fusion-black.jpg', price: 70, memberPrice: 56 },
]

interface Props {
  user: User | null
  isMember: boolean
  onTabChange: (tab: any) => void
}

export default function HomeTab({ user, isMember, onTabChange }: Props) {
  return (
    <div style={{ paddingBottom: 100, overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ padding: '52px 20px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, overflow: 'hidden', background: '#050500', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Image src="/media/mike-bzzz-logo.png" alt="Mike Bzzz" width={52} height={52} style={{ objectFit: 'contain' }} />
            </div>
            <span style={{ fontSize: 17, fontWeight: 600 }}>Mike Bzzz Rentals</span>
          </div>
          <button
            onClick={() => onTabChange('profile')}
            style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--yellow)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer', color: '#000' }}
          >
            {user ? (user.user_metadata?.full_name as string || user.email || 'U')[0].toUpperCase() : '?'}
          </button>
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: -0.8, padding: '6px 0 12px' }}>
          {isMember ? '⭐ Welcome Back, VIP' : 'Find Your Ride'}
        </h1>
      </div>

      {/* Membership hero banner (non-members only) */}
      {!isMember && (
        <div
          onClick={() => onTabChange('membership')}
          style={{
            margin: '0 16px 14px',
            background: 'linear-gradient(135deg, rgba(255,214,10,0.15), rgba(245,165,0,0.08))',
            border: '1px solid rgba(255,214,10,0.3)',
            borderRadius: 'var(--radius)',
            padding: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <div style={{ fontSize: 32 }}>⭐</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>Join Mike Bzzz VIP</div>
            <div style={{ fontSize: 12, color: 'var(--label2)' }}>Get 20% off every rental for $7.99/mo</div>
          </div>
          <div style={{ fontSize: 18, color: 'var(--yellow)' }}>›</div>
        </div>
      )}

      {/* Cars */}
      <div style={{ padding: '0 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '8px 4px 12px' }}>
          <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.5 }}>Available Now</span>
          <button onClick={() => onTabChange('browse')} style={{ background: 'none', border: 'none', color: 'var(--yellow-dark)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>See All</button>
        </div>

        {CARS.map(car => (
          <div key={car.id} style={{ background: 'var(--card)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 14, border: '1px solid var(--separator)' }}>
            <div style={{ position: 'relative', height: 180 }}>
              <Image src={car.img} alt={car.name} fill style={{ objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)' }} />
              <div style={{ position: 'absolute', bottom: 14, left: 16, right: 16 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>{car.name}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>{car.color}</div>
              </div>
              {isMember && (
                <div style={{ position: 'absolute', top: 12, right: 12 }}>
                  <span className="member-badge">Member Rate</span>
                </div>
              )}
            </div>
            <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--yellow)' }}>
                  ${isMember ? car.memberPrice : car.price}
                </span>
                <span style={{ fontSize: 13, color: 'var(--label2)' }}>/day</span>
                {isMember && (
                  <span style={{ fontSize: 12, color: 'var(--label3)', textDecoration: 'line-through', marginLeft: 8 }}>
                    ${car.price}
                  </span>
                )}
              </div>
              <button
                onClick={() => onTabChange('browse')}
                style={{ background: 'var(--yellow)', color: '#000', border: 'none', borderRadius: 12, padding: '10px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Stats strip */}
      <div style={{ display: 'flex', gap: 10, padding: '4px 16px 0', overflowX: 'auto' }} className="hide-scroll">
        {[
          { num: '100+', label: 'Rentals Done' },
          { num: '5★', label: 'Avg Rating' },
          { num: '23', label: 'Cars Available' },
          { num: '24/7', label: 'Support' },
        ].map(s => (
          <div key={s.label} style={{ flexShrink: 0, background: 'var(--card)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', minWidth: 95, textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--yellow-dark)' }}>{s.num}</div>
            <div style={{ fontSize: 11, color: 'var(--label2)', fontWeight: 500, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
