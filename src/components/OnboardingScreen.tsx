'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { UserProfile, Intent } from '@/app/page'

const INTENTS: { value: Intent; label: string; emoji: string }[] = [
  { value: 'co-founder', label: 'Find co-founder', emoji: '🤝' },
  { value: 'investor', label: 'Meet investors', emoji: '💰' },
  { value: 'hiring', label: "I'm hiring", emoji: '🎯' },
  { value: 'be-hired', label: 'Open to roles', emoji: '✨' },
  { value: 'customers', label: 'Find customers', emoji: '🚀' },
  { value: 'just-vibing', label: 'Just networking', emoji: '👋' },
]

export default function OnboardingScreen({ onComplete }: { onComplete: (p: UserProfile) => void }) {
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [company, setCompany] = useState('')
  const [intent, setIntent] = useState<Intent | null>(null)
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [calendlyUrl, setCalendlyUrl] = useState('')

  const canSubmit = name && role && intent

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1.5px solid var(--border)',
    background: 'var(--surface)',
    color: 'var(--text)',
    fontSize: '15px',
    outline: 'none',
    fontFamily: 'DM Sans, sans-serif',
    transition: 'border-color 0.2s',
  }

  return (
    <div style={{ width: '100%', maxWidth: '420px' }}>
      {/* Logo */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{
          fontSize: '13px', letterSpacing: '0.2em', color: 'var(--accent)',
          fontFamily: 'Syne, sans-serif', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase'
        }}>
          Meetr
        </div>
        <h1 style={{ fontSize: '36px', fontWeight: 800, lineHeight: 1.1, fontFamily: 'Syne, sans-serif' }}>
          Network like<br />
          <span style={{ color: 'var(--accent)' }}>you mean it.</span>
        </h1>
        <p style={{ color: 'var(--muted)', marginTop: '12px', fontSize: '15px' }}>
          Swipe on people at your next Luma event
        </p>
      </motion.div>

      {/* Form */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
        style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <input style={inputStyle} placeholder="Your name" value={name}
            onChange={e => setName(e.target.value)} />
          <input style={inputStyle} placeholder="Role / title" value={role}
            onChange={e => setRole(e.target.value)} />
        </div>

        <input style={inputStyle} placeholder="Company or project (optional)" value={company}
          onChange={e => setCompany(e.target.value)} />

        <input style={inputStyle} placeholder="linkedin.com/in/you (optional)" value={linkedinUrl}
          onChange={e => setLinkedinUrl(e.target.value)} />

        <input style={inputStyle} placeholder="calendly.com/you (optional)" value={calendlyUrl}
          onChange={e => setCalendlyUrl(e.target.value)} />

        {/* Intent */}
        <div style={{ marginTop: '8px' }}>
          <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '10px', fontFamily: 'Syne, sans-serif', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            I'm here to...
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {INTENTS.map(i => (
              <button key={i.value} onClick={() => setIntent(i.value)}
                className={`intent-chip ${intent === i.value ? 'selected' : ''}`}>
                {i.emoji} {i.label}
              </button>
            ))}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: canSubmit ? 1.02 : 1 }}
          whileTap={{ scale: canSubmit ? 0.98 : 1 }}
          onClick={() => {
            if (!canSubmit) return
            onComplete({ name, role, company, intent: intent!, linkedinUrl, calendlyUrl })
          }}
          style={{
            marginTop: '8px',
            width: '100%',
            padding: '16px',
            borderRadius: '14px',
            border: 'none',
            background: canSubmit ? 'var(--accent)' : 'var(--surface2)',
            color: canSubmit ? 'white' : 'var(--muted)',
            fontSize: '16px',
            fontWeight: 700,
            fontFamily: 'Syne, sans-serif',
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s ease',
            letterSpacing: '0.02em',
          }}>
          Let's go →
        </motion.button>
      </motion.div>
    </div>
  )
}
