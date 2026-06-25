'use client'

import { useState, useEffect, useRef } from 'react'
import type { User } from '@supabase/supabase-js'
import HomeTab from './tabs/HomeTab'
import BrowseTab from './tabs/BrowseTab'
import MembershipTab from './tabs/MembershipTab'
import DealsTab from './tabs/DealsTab'
import ProfileTab from './tabs/ProfileTab'

type Tab = 'home' | 'browse' | 'membership' | 'deals' | 'profile'

interface Props {
  user: User | null
  isMember: boolean
}

export default function AppShell({ user, isMember }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('home')
  const videoRef = useRef<HTMLVideoElement>(null)

  const videos = [
    '/media/2012-ford-fusion-dark-green.mp4',
    '/media/2015-ford-fusion-black.mp4',
  ]
  const [vidIdx, setVidIdx] = useState(0)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.src = videos[vidIdx]
    v.play().catch(() => {})
    const onEnd = () => setVidIdx(i => (i + 1) % videos.length)
    v.addEventListener('ended', onEnd)
    return () => v.removeEventListener('ended', onEnd)
  }, [vidIdx])

  const tabs: { id: Tab; icon: string; label: string }[] = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'browse', icon: '🚗', label: 'Browse' },
    { id: 'membership', icon: '⭐', label: 'Members' },
    { id: 'deals', icon: '🔥', label: 'Deals' },
    { id: 'profile', icon: '👤', label: 'Profile' },
  ]

  return (
    <div style={{ maxWidth: 430, margin: '0 auto', position: 'relative', minHeight: '100vh' }}>
      {/* Background video */}
      <div className="bg-video-wrap">
        <video ref={videoRef} className="bg-video" autoPlay muted playsInline />
      </div>

      {/* Tab content */}
      {activeTab === 'home' && (
        <HomeTab user={user} isMember={isMember} onTabChange={setActiveTab} />
      )}
      {activeTab === 'browse' && (
        <BrowseTab user={user} isMember={isMember} />
      )}
      {activeTab === 'membership' && (
        <MembershipTab user={user} isMember={isMember} />
      )}
      {activeTab === 'deals' && (
        <DealsTab isMember={isMember} />
      )}
      {activeTab === 'profile' && (
        <ProfileTab user={user} isMember={isMember} onTabChange={setActiveTab} />
      )}

      {/* Tab Bar */}
      <nav className="tab-bar">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`tab-item${activeTab === t.id ? ' active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            <span className="tab-icon">{t.icon}</span>
            <span className="tab-label">{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
