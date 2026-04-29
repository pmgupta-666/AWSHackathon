'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SwipeDeck from '@/components/SwipeDeck'
import OnboardingScreen from '@/components/OnboardingScreen'
import EventLoader from '@/components/EventLoader'

export type Intent = 'co-founder' | 'investor' | 'hiring' | 'be-hired' | 'customers' | 'just-vibing'
export type UserProfile = {
  name: string
  role: string
  company: string
  intent: Intent
  linkedinUrl: string
  calendlyUrl: string
}

export type Attendee = {
  id: string
  name: string
  role: string
  company: string
  avatarUrl: string
  linkedinUrl: string
  intent: Intent
  sharedEvents?: number
}

export type AppStage = 'onboarding' | 'event-select' | 'swiping'

export default function Home() {
  const [stage, setStage] = useState<AppStage>('onboarding')
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [eventName, setEventName] = useState('')

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      {/* Background gradient orbs */}
      <div style={{
        position: 'fixed', top: '-20%', left: '-10%',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,110,247,0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'fixed', bottom: '-20%', right: '-10%',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(247,162,110,0.06) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <AnimatePresence mode="wait">
        {stage === 'onboarding' && (
          <motion.div key="onboarding"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
            <OnboardingScreen onComplete={(profile) => {
              setUserProfile(profile)
              setStage('event-select')
            }} />
          </motion.div>
        )}

        {stage === 'event-select' && (
          <motion.div key="event-select"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
            <EventLoader onLoaded={(attendees, name) => {
              setAttendees(attendees)
              setEventName(name)
              setStage('swiping')
            }} />
          </motion.div>
        )}

        {stage === 'swiping' && userProfile && (
          <motion.div key="swiping"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <SwipeDeck
              attendees={attendees}
              userProfile={userProfile}
              eventName={eventName}
              onBack={() => setStage('event-select')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
