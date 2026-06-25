'use client'

import Image from 'next/image'
import type { User } from '@supabase/supabase-js'

const GOOGLE_ICON = (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#4285F4" d="M44.5 20H24v8.5h11.8C34.5 33.3 30 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 2.9l6.1-6.1C34.5 6.5 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-7.7 19.7-20 0-1.3-.1-2.7-.2-4z"/>
    <path fill="#34A853" d="M6.3 14.7l7 5.1C15 16 19.2 13 24 13c3 0 5.8 1.1 7.9 2.9l6.1-6.1C34.5 6.5 29.6 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
    <path fill="#FBBC05" d="M24 44c5.8 0 10.7-1.9 14.3-5.2l-6.6-5.4C29.8 35 27 36 24 36c-6 0-10.5-2.7-11.8-7.5l-6.9 5.3C8.9 40 15.9 44 24 44z"/>
    <path fill="#EA4335" d="M44.5 20H24v8.5h11.8c-.5 2.3-1.9 4.3-3.8 5.7l6.6 5.4C42.5 36.4 44.5 31 44.5 24c0-1.3-.1-2.7-.2-4z"/>
  </svg>
)

const REVIEWS = [
  { name: 'Dyna1x', sub: '2 reviews · Google', grad: 'linear-gradient(135deg,#4285F4,#34A853)', initial: 'D', text: 'Found Mike through an ad and it\'s been nothing but a great experience! Their prices are unbeatable, extremely cooperative and professional. This is my go-to rental company from now on, and I highly recommend booking!' },
  { name: 'Kaylene Christina', sub: 'Local Guide · Google', grad: 'linear-gradient(135deg,#EA4335,#FBBC05)', initial: 'K', text: 'My go to Rental company in SoFlo for business or personal. Always amazing customer service, amazing communication, always available and easy to reach. Also used the car to do UberEats for some extra $$. Thanks Mike! Will definitely be a returning customer.' },
  { name: 'Lorenzo T. Sweet', sub: '2 reviews · Google', grad: 'linear-gradient(135deg,#34A853,#4285F4)', initial: 'L', text: 'Very impressed!! Professional rental service, great vehicles, great daily, weekly and monthly prices. Highly recommend Mike Bzzz Rentals to anyone looking for a reliable and affordable rental!' },
  { name: 'Lotus', sub: '1 review · Google', grad: 'linear-gradient(135deg,#FBBC05,#EA4335)', initial: 'L', text: 'Very satisfied with this rental service! Great vehicles, excellent rates, and professional team. I\'ll definitely recommend to family and friends!' },
  { name: 'Tasia Bri', sub: '2 reviews · Google', grad: 'linear-gradient(135deg,#00BCD4,#3F51B5)', initial: 'T', text: 'I\'ve been renting a car from Mike BZZ Rentals LLC for about 3 months now and I am really impressed with the service. The process was smooth and straightforward, very professional and accommodating. The car was in great condition and clean.' },
  { name: 'Nina ThaPrettyone', sub: '1 review · Google', grad: 'linear-gradient(135deg,#9C27B0,#E91E63)', initial: 'N', text: 'Recently I\'ve rented with Mike Bzz Rentals and the experience has been pretty good — amazing! Anytime I\'ve needed to get into contact with him he\'s always available. If anything is ever wrong with the car he fixes it right away.' },
]
const doubled = [...REVIEWS, ...REVIEWS]

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
            <span style={{ fontSize: 17, fontWeight: 600 }}>Mike Bzzz</span>
          </div>
          <button
            onClick={() => onTabChange('profile')}
            style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--yellow)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer', color: '#000' }}
          >
            {user ? (user.user_metadata?.full_name as string || user.email || 'U')[0].toUpperCase() : '?'}
          </button>
        </div>
        <h1 style={{ fontSize: 34, fontWeight: 700, letterSpacing: -0.8, padding: '8px 0 14px' }}>
          Find Your Ride 🚗
        </h1>
      </div>

      {/* Hero card */}
      <div style={{ margin: '0 16px 16px', borderRadius: 20, overflow: 'hidden', position: 'relative', height: 220 }}>
        <Image src="/media/car-1.jpg" alt="Fleet" fill style={{ objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }} />
        <div style={{ position: 'absolute', bottom: 18, left: 18, right: 18 }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,214,10,0.15)', border: '1px solid rgba(255,214,10,0.4)', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600, color: 'var(--yellow)', marginBottom: 8 }}>
            🏠 23 Available Now — From $50/Day
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: 4 }}>
            Ft. Lauderdale&apos;s<br />Favorite Rental
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>
            23 Vehicles · Fusions · Camrys · Civic · Malibu · Altima
          </div>
        </div>
      </div>

      {/* Commercial Video */}
      <div style={{ margin: '0 16px 16px', background: 'var(--card)', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--separator)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderBottom: '1px solid var(--separator)' }}>
          <span style={{ fontSize: 20 }}>🎬</span>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Mike Bzzz Rentals — See What You Get</span>
        </div>
        <video controls playsInline preload="metadata" style={{ width: '100%', display: 'block', background: '#000', maxHeight: 260, objectFit: 'cover' }}>
          <source src="/media/commercial.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Perks */}
      <div style={{ margin: '0 16px 16px', background: 'var(--card)', borderRadius: 16, padding: 16, border: '1px solid var(--separator)' }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: 'var(--yellow)' }}>✅ Everything Included With Every Rental</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { e: '🔧', t: 'Maintenance Included' },
            { e: '🚨', t: 'Roadside Assistance' },
            { e: '∞', t: 'Unlimited Miles' },
            { e: '🚫', t: 'No Credit Check' },
            { e: '💵', t: 'No Deposit Required' },
            { e: '🛡️', t: 'Insurance Included' },
            { e: '⚙️', t: 'Oil Check Every 30 Days' },
          ].map(p => (
            <div key={p.t} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
              <span style={{ fontSize: 18 }}>{p.e}</span>
              <span style={{ color: 'var(--label2)', fontWeight: 500 }}>{p.t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Available Now thumbnails */}
      <div style={{ margin: '0 16px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 16, fontWeight: 700 }}>🟢 Available Now</span>
          <button onClick={() => onTabChange('browse')} style={{ background: 'none', border: 'none', color: 'var(--yellow-dark)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>See All ›</button>
        </div>
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto' }} className="hide-scroll">
          {[
            { img: '/media/2012-ford-fusion-dark-green.jpg', name: '2012 Ford Fusion', price: '$50/day' },
            { img: '/media/2015-ford-fusion-black.jpg', name: '2015 Ford Fusion', price: '$55/day' },
          ].map(car => (
            <div key={car.name} onClick={() => onTabChange('browse')} style={{ flexShrink: 0, width: 160, borderRadius: 14, overflow: 'hidden', background: 'var(--card)', border: '1px solid var(--separator)', cursor: 'pointer' }}>
              <div style={{ position: 'relative', height: 110 }}>
                <Image src={car.img} alt={car.name} fill style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '10px 12px' }}>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 2 }}>{car.name}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--yellow)' }}>{car.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Membership banner (non-members) */}
      {!isMember && (
        <div onClick={() => onTabChange('membership')} style={{ margin: '0 16px 16px', background: 'linear-gradient(135deg,rgba(255,214,10,0.15),rgba(245,165,0,0.08))', border: '1px solid rgba(255,214,10,0.3)', borderRadius: 16, padding: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ fontSize: 32 }}>⭐</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>Join Mike Bzzz VIP</div>
            <div style={{ fontSize: 12, color: 'var(--label2)' }}>Get 20% off every rental for $7.99/mo</div>
          </div>
          <div style={{ fontSize: 18, color: 'var(--yellow)' }}>›</div>
        </div>
      )}

      {/* Reviews carousel */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '0 20px 10px' }}>
          <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.5 }}>⭐ Real Reviews</span>
          <a href="https://www.google.com/search?q=MIKE+BZZ+RENTALS+LLC+reviews" target="_blank" rel="noreferrer" style={{ fontSize: 13, color: 'var(--yellow-dark)', textDecoration: 'none', fontWeight: 500 }}>See all on Google ›</a>
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div className="review-track" style={{ display: 'flex', gap: 12, padding: '0 16px 4px', width: 'max-content', animation: 'scrollReviews 32s linear infinite' }}>
            {doubled.map((r, i) => (
              <div key={i} style={{ flexShrink: 0, width: 280, background: 'var(--card)', borderRadius: 'var(--radius)', padding: 16, border: '1px solid rgba(255,214,10,0.12)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: r.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{r.initial}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{r.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--label3)' }}>{r.sub}</div>
                  </div>
                  <div style={{ marginLeft: 'auto' }}>{GOOGLE_ICON}</div>
                </div>
                <div style={{ color: '#FBBC05', fontSize: 13, marginBottom: 8 }}>★★★★★</div>
                <div style={{ fontSize: 13, color: 'var(--label2)', lineHeight: 1.55 }}>"{r.text}"</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'flex', gap: 10, padding: '0 16px 16px', overflowX: 'auto' }} className="hide-scroll">
        {[
          { num: '$50', label: 'Per Day' },
          { num: '23', label: 'Available' },
          { num: '23', label: 'Total Fleet' },
          { num: '$0', label: 'Hidden Fees' },
        ].map(s => (
          <div key={s.label} style={{ flexShrink: 0, background: 'var(--card)', borderRadius: 12, padding: '12px 16px', minWidth: 85, textAlign: 'center', border: '1px solid var(--separator)' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--yellow-dark)' }}>{s.num}</div>
            <div style={{ fontSize: 11, color: 'var(--label2)', fontWeight: 500, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Why Mike Bzzz? */}
      <div style={{ padding: '0 16px 8px' }}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, letterSpacing: -0.3 }}>Why Mike Bzzz?</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { icon: '⚡', color: 'var(--yellow)', title: 'Book Instantly', desc: 'Reserve in under 2 minutes.' },
            { icon: '💰', color: '#4cd964', title: 'Flat $50/Day', desc: 'Same rate across all models.' },
            { icon: '🔓', color: '#007aff', title: 'Free Cancel', desc: 'Up to 24 hrs before pickup.' },
            { icon: '🚫', color: '#ff3b30', title: 'No Credit Check', desc: 'Anyone can qualify to rent.' },
            { icon: '💵', color: 'var(--yellow)', title: 'No Deposit', desc: 'No hidden upfront costs.' },
            { icon: '∞', color: '#4cd964', title: 'Unlimited Miles', desc: 'Drive as far as you need.' },
            { icon: '🛡️', color: '#007aff', title: 'Insurance Incl.', desc: 'You are fully covered.' },
          ].map(f => (
            <div key={f.title} style={{ background: 'var(--card)', borderRadius: 14, padding: '14px 14px', border: '1px solid var(--separator)' }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{f.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>{f.title}</div>
              <div style={{ fontSize: 12, color: 'var(--label2)', lineHeight: 1.4 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scrollReviews {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .review-track:hover { animation-play-state: paused; }
      `}</style>
    </div>
  )
}
