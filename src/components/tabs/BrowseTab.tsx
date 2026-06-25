'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { User } from '@supabase/supabase-js'

const CARS = [
  { id: '1',  name: '2010 Ford Fusion', color: 'Baby Blue',   img: '/media/2012-ford-fusion-dark-green.jpg', price: 50, memberPrice: 40, type: 'Hybrid Sedan' },
  { id: '2',  name: '2010 Ford Fusion', color: 'Black Hybrid', img: '/media/2015-ford-fusion-black.jpg',      price: 50, memberPrice: 40, type: 'Hybrid Sedan' },
  { id: '3',  name: '2010 Ford Fusion Hybrid', color: 'Grey',  img: '/media/2012-ford-fusion-dark-green.jpg', price: 50, memberPrice: 40, type: 'Sedan' },
  { id: '4',  name: '2010 Ford Fusion', color: 'Grey',         img: '/media/2012-ford-fusion-dark-green.jpg', price: 50, memberPrice: 40, type: 'Sedan' },
  { id: '5',  name: '2010 Ford Fusion', color: 'White Hybrid', img: '/media/2015-ford-fusion-black.jpg',      price: 50, memberPrice: 40, type: 'Hybrid Sedan' },
  { id: '6',  name: '2010 Ford Fusion', color: 'Grey',         img: '/media/2012-ford-fusion-dark-green.jpg', price: 50, memberPrice: 40, type: 'Sedan' },
  { id: '7',  name: '2010 Ford Fusion', color: 'Silver',       img: '/media/2012-ford-fusion-dark-green.jpg', price: 50, memberPrice: 40, type: 'Sedan' },
  { id: '8',  name: '2011 Ford Fusion', color: 'White',        img: '/media/2015-ford-fusion-black.jpg',      price: 50, memberPrice: 40, type: 'Sedan' },
  { id: '9',  name: '2012 Ford Fusion', color: 'Burgundy',     img: '/media/2012-ford-fusion-dark-green.jpg', price: 50, memberPrice: 40, type: 'Sedan' },
  { id: '10', name: '2012 Ford Fusion', color: 'White',        img: '/media/2015-ford-fusion-black.jpg',      price: 50, memberPrice: 40, type: 'Sedan' },
  { id: '11', name: '2012 Ford Fusion', color: 'Red',          img: '/media/2012-ford-fusion-dark-green.jpg', price: 50, memberPrice: 40, type: 'Sedan' },
  { id: '12', name: '2012 Ford Fusion', color: 'Silver',       img: '/media/2012-ford-fusion-dark-green.jpg', price: 50, memberPrice: 40, type: 'Sedan' },
  { id: '13', name: '2016 Ford Fusion', color: 'Grey',         img: '/media/2012-ford-fusion-dark-green.jpg', price: 55, memberPrice: 44, type: 'Sedan' },
  { id: '14', name: '2010 Ford Fusion', color: 'Black',        img: '/media/2015-ford-fusion-black.jpg',      price: 50, memberPrice: 40, type: 'Sedan' },
  { id: '15', name: '2005 Toyota Camry', color: 'Blue',        img: '/media/2012-ford-fusion-dark-green.jpg', price: 50, memberPrice: 40, type: 'Sedan' },
  { id: '16', name: '2005 Toyota Camry', color: 'Silver',      img: '/media/2012-ford-fusion-dark-green.jpg', price: 50, memberPrice: 40, type: 'Sedan' },
  { id: '17', name: '2008 Toyota Camry', color: 'Gold',        img: '/media/2012-ford-fusion-dark-green.jpg', price: 50, memberPrice: 40, type: 'Sedan' },
  { id: '18', name: '2008 Toyota Camry', color: 'Silver',      img: '/media/2012-ford-fusion-dark-green.jpg', price: 50, memberPrice: 40, type: 'Sedan' },
  { id: '19', name: '2012 Ford Fusion', color: 'Dark Green',   img: '/media/2012-ford-fusion-dark-green.jpg', price: 50, memberPrice: 40, type: 'Sedan' },
  { id: '20', name: '2015 Ford Fusion', color: 'Black',        img: '/media/2015-ford-fusion-black.jpg',      price: 55, memberPrice: 44, type: 'Sedan' },
  { id: '21', name: '2012 Chevy Malibu', color: 'Brown',       img: '/media/2012-ford-fusion-dark-green.jpg', price: 50, memberPrice: 40, type: 'Sedan' },
  { id: '22', name: '2013 Nissan Altima', color: 'Silver',     img: '/media/2012-ford-fusion-dark-green.jpg', price: 50, memberPrice: 40, type: 'Sedan' },
  { id: '23', name: '2018 Honda Civic', color: 'Black',        img: '/media/2015-ford-fusion-black.jpg',      price: 55, memberPrice: 44, type: 'Sedan' },
]

interface Props { user: User | null; isMember: boolean }

export default function BrowseTab({ isMember }: Props) {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div style={{ paddingBottom: 100, overflowY: 'auto' }}>
      <div style={{ padding: '52px 20px 16px', borderBottom: '1px solid var(--separator)' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.6 }}>Browse Cars</h1>
        <p style={{ fontSize: 13, color: 'var(--label2)', marginTop: 4 }}>
          {isMember ? '⭐ Member rates applied' : 'Join VIP for up to 20% off'}
        </p>
      </div>

      <div style={{ padding: '16px' }}>
        {CARS.map(car => (
          <div
            key={car.id}
            style={{ background: 'var(--card)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 16, border: `1px solid ${selected === car.id ? 'rgba(255,214,10,0.5)' : 'var(--separator)'}`, cursor: 'pointer' }}
            onClick={() => setSelected(selected === car.id ? null : car.id)}
          >
            <div style={{ position: 'relative', height: 190 }}>
              <Image src={car.img} alt={car.name} fill style={{ objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 55%)' }} />
              <div style={{ position: 'absolute', bottom: 14, left: 16 }}>
                <div style={{ fontSize: 19, fontWeight: 700, color: '#fff' }}>{car.name}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{car.color} · {car.type}</div>
              </div>
              {isMember && <div style={{ position: 'absolute', top: 12, right: 12 }}><span className="member-badge">VIP Rate</span></div>}
            </div>
            <div style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div>
                  <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--yellow)' }}>${isMember ? car.memberPrice : car.price}</span>
                  <span style={{ fontSize: 13, color: 'var(--label2)' }}>/day</span>
                  {isMember && <span style={{ fontSize: 12, color: 'var(--label3)', textDecoration: 'line-through', marginLeft: 8 }}>${car.price}</span>}
                </div>
              </div>
              <a
                href={`sms:+18047292812?body=I want to book the ${car.name} (${car.color})`}
                style={{ display: 'block', background: 'var(--yellow)', color: '#000', border: 'none', borderRadius: 13, padding: '13px', fontSize: 15, fontWeight: 700, cursor: 'pointer', textAlign: 'center', textDecoration: 'none' }}
              >
                📲 Book via Text
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
