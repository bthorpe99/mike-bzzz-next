'use client'

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

export default function ReviewsTab() {
  return (
    <div style={{ paddingBottom: 100, overflowY: 'auto' }}>
      <div style={{ padding: '52px 20px 16px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.6 }}>Reviews</h1>
        <p style={{ fontSize: 13, color: 'var(--label2)', marginTop: 4 }}>Real Google reviews from our customers</p>
      </div>

      {/* Auto-scrolling carousel */}
      <div style={{ overflow: 'hidden', position: 'relative', marginBottom: 24 }}>
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

      {/* Static review list */}
      <div style={{ padding: '0 16px' }}>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 14, letterSpacing: -0.4 }}>All Reviews</div>
        {REVIEWS.map((r, i) => (
          <div key={i} style={{ background: 'var(--card)', borderRadius: 'var(--radius)', padding: 16, marginBottom: 12, border: '1px solid var(--separator)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: r.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{r.initial}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{r.name}</div>
                <div style={{ fontSize: 12, color: 'var(--label3)' }}>{r.sub}</div>
              </div>
              {GOOGLE_ICON}
            </div>
            <div style={{ color: '#FBBC05', fontSize: 14, marginBottom: 8 }}>★★★★★</div>
            <div style={{ fontSize: 13, color: 'var(--label2)', lineHeight: 1.6 }}>"{r.text}"</div>
          </div>
        ))}
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
