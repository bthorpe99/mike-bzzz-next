'use client'

import { useState, useEffect, useRef } from 'react'
import type { User } from '@supabase/supabase-js'
import HomeTab from './tabs/HomeTab'
import BrowseTab from './tabs/BrowseTab'
import ReviewsTab from './tabs/ReviewsTab'
import MembershipTab from './tabs/MembershipTab'
import ProfileTab from './tabs/ProfileTab'
import GameTab from './tabs/GameTab'

type Tab = 'home' | 'browse' | 'reviews' | 'membership' | 'profile' | 'game'

interface Props {
  user: User | null
  isMember: boolean
}

export default function AppShell({ user, isMember }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('home')
  const videoRef = useRef<HTMLVideoElement>(null)

  const videos = [
    '/media/bg-video-1.mp4',
    '/media/bg-video-2.mp4',
    '/media/bg-video-3.mp4',
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
    { id: 'home',       icon: '🏠', label: 'Home' },
    { id: 'browse',     icon: '🚗', label: 'Fleet' },
    { id: 'reviews',    icon: '🏷️', label: 'Reviews' },
    { id: 'membership', icon: '⭐', label: 'Members' },
    { id: 'profile',    icon: '👤', label: 'Profile' },
    { id: 'game',       icon: '🎮', label: 'Game' },
  ]

  const isGameTab = activeTab === 'game'

  return (
    <div style={{ maxWidth: 430, margin: '0 auto', position: 'relative', minHeight: '100vh' }}>
      {/* Background video (hide on game tab) */}
      {!isGameTab && (
        <div className="bg-video-wrap">
          <video ref={videoRef} className="bg-video" autoPlay muted playsInline />
        </div>
      )}

      {/* Tab content */}
      {activeTab === 'home' && (
        <HomeTab user={user} isMember={isMember} onTabChange={setActiveTab} />
      )}
      {activeTab === 'browse' && (
        <BrowseTab user={user} isMember={isMember} />
      )}
      {activeTab === 'reviews' && (
        <ReviewsTab />
      )}
      {activeTab === 'membership' && (
        <MembershipTab user={user} isMember={isMember} />
      )}
      {activeTab === 'profile' && (
        <ProfileTab user={user} isMember={isMember} onTabChange={setActiveTab} />
      )}
      {activeTab === 'game' && (
        <GameTab />
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
