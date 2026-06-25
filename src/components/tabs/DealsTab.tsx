'use client'

interface Props { isMember: boolean }

const deals = [
  { emoji: '🔥', title: 'Weekend Special', desc: 'Rent Fri–Sun, pay for 2 days only', tag: 'Members Only', memberOnly: true },
  { emoji: '💯', title: 'Week Warrior', desc: '7 days for the price of 5', tag: 'All Renters', memberOnly: false },
  { emoji: '⚡', title: 'Last-Minute Deal', desc: 'Same-day bookings get 10% off', tag: 'Members Only', memberOnly: true },
]

export default function DealsTab({ isMember }: Props) {
  return (
    <div style={{ paddingBottom: 100, overflowY: 'auto' }}>
      <div style={{ padding: '52px 20px 16px', borderBottom: '1px solid var(--separator)' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.6 }}>Hot Deals 🔥</h1>
        <p style={{ fontSize: 13, color: 'var(--label2)', marginTop: 4 }}>
          {isMember ? 'All deals unlocked — enjoy your VIP perks!' : 'Join VIP to unlock member-only deals'}
        </p>
      </div>

      <div style={{ padding: '16px' }}>
        {deals.map(d => {
          const locked = d.memberOnly && !isMember
          return (
            <div
              key={d.title}
              style={{
                background: 'var(--card)', borderRadius: 'var(--radius)',
                padding: '18px 16px', marginBottom: 12,
                border: '1px solid var(--separator)',
                opacity: locked ? 0.55 : 1,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontSize: 30, marginBottom: 8 }}>{d.emoji}</div>
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
                  padding: '3px 8px', borderRadius: 20,
                  background: d.memberOnly ? 'rgba(255,214,10,0.15)' : 'var(--green-soft)',
                  color: d.memberOnly ? 'var(--yellow)' : 'var(--green)',
                }}>
                  {locked ? '🔒 ' : ''}{d.tag}
                </span>
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{d.title}</div>
              <div style={{ fontSize: 13, color: 'var(--label2)' }}>{d.desc}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
