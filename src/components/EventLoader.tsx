'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Attendee, Intent } from '@/app/page'

const DEMO_ATTENDEES: Attendee[] = [
  { id: '1', name: 'Priya Sharma', role: 'Founder & CEO', company: 'Aria AI', avatarUrl: 'https://api.dicebear.com/7.x/notionists/svg?seed=priya&backgroundColor=b6e3f4', linkedinUrl: 'https://linkedin.com/in/priyasharma', intent: 'investor', sharedEvents: 3 },
  { id: '2', name: 'Marcus Chen', role: 'Partner', company: 'Sequoia Capital', avatarUrl: 'https://api.dicebear.com/7.x/notionists/svg?seed=marcus&backgroundColor=d1d4f9', linkedinUrl: 'https://linkedin.com/in/marcuschen', intent: 'co-founder', sharedEvents: 1 },
  { id: '3', name: 'Sofia Reyes', role: 'Staff Engineer', company: 'Vercel', avatarUrl: 'https://api.dicebear.com/7.x/notionists/svg?seed=sofia&backgroundColor=c0aede', linkedinUrl: 'https://linkedin.com/in/sofiareyes', intent: 'just-vibing', sharedEvents: 5 },
  { id: '4', name: 'James Okafor', role: 'Product Designer', company: 'Figma', avatarUrl: 'https://api.dicebear.com/7.x/notionists/svg?seed=james&backgroundColor=ffd5dc', linkedinUrl: 'https://linkedin.com/in/jamesokafor', intent: 'hiring', sharedEvents: 2 },
  { id: '5', name: 'Lena Müller', role: 'Angel Investor', company: 'Independent', avatarUrl: 'https://api.dicebear.com/7.x/notionists/svg?seed=lena&backgroundColor=b6e3f4', linkedinUrl: 'https://linkedin.com/in/lenamuller', intent: 'investor', sharedEvents: 4 },
  { id: '6', name: 'Devon Park', role: 'CTO & Co-founder', company: 'Helix Labs', avatarUrl: 'https://api.dicebear.com/7.x/notionists/svg?seed=devon&backgroundColor=d1d4f9', linkedinUrl: 'https://linkedin.com/in/devonpark', intent: 'co-founder', sharedEvents: 2 },
  { id: '7', name: 'Aisha Kamara', role: 'Growth Lead', company: 'Linear', avatarUrl: 'https://api.dicebear.com/7.x/notionists/svg?seed=aisha&backgroundColor=c0aede', linkedinUrl: 'https://linkedin.com/in/aishakamara', intent: 'customers', sharedEvents: 1 },
  { id: '8', name: 'Ryo Tanaka', role: 'ML Engineer', company: 'Anthropic', avatarUrl: 'https://api.dicebear.com/7.x/notionists/svg?seed=ryo&backgroundColor=ffd5dc', linkedinUrl: 'https://linkedin.com/in/ryotanaka', intent: 'be-hired', sharedEvents: 3 },
]

export default function EventLoader({ onLoaded }: { onLoaded: (attendees: Attendee[], eventName: string) => void }) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLoad = async () => {
    if (!url.trim()) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/luma', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      onLoaded(data.attendees, data.eventName)
    } catch (e: any) {
      setError(e.message || 'Could not load event. Try the demo instead.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ width: '100%', maxWidth: '420px' }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{
          fontSize: '13px', letterSpacing: '0.2em', color: 'var(--accent)',
          fontFamily: 'Syne, sans-serif', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase'
        }}>Meetr</div>
        <h2 style={{ fontSize: '30px', fontWeight: 800, fontFamily: 'Syne, sans-serif' }}>
          Pick your event
        </h2>
        <p style={{ color: 'var(--muted)', marginTop: '10px', fontSize: '15px' }}>
          Paste a Luma event URL to load attendees
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            style={{
              flex: 1, padding: '14px 16px', borderRadius: '12px',
              border: '1.5px solid var(--border)', background: 'var(--surface)',
              color: 'var(--text)', fontSize: '14px', outline: 'none',
              fontFamily: 'DM Sans, sans-serif'
            }}
            placeholder="lu.ma/sf-ai-night"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLoad()}
          />
          <motion.button whileTap={{ scale: 0.96 }} onClick={handleLoad}
            disabled={loading || !url.trim()}
            style={{
              padding: '14px 20px', borderRadius: '12px', border: 'none',
              background: 'var(--accent)', color: 'white', fontSize: '15px',
              fontWeight: 700, fontFamily: 'Syne, sans-serif', cursor: 'pointer',
              opacity: loading || !url.trim() ? 0.5 : 1
            }}>
            {loading ? '...' : 'Load'}
          </motion.button>
        </div>

        {error && (
          <p style={{ color: 'var(--no)', fontSize: '13px', textAlign: 'center' }}>{error}</p>
        )}

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '8px 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          <span style={{ color: 'var(--muted)', fontSize: '13px' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>

        {/* Demo card */}
        <motion.button
          whileHover={{ scale: 1.01, borderColor: 'var(--accent)' }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onLoaded(DEMO_ATTENDEES, 'SF AI Founders Night 🌉')}
          style={{
            width: '100%', padding: '20px', borderRadius: '16px',
            border: '1.5px solid var(--border)', background: 'var(--surface)',
            color: 'var(--text)', cursor: 'pointer', textAlign: 'left',
            transition: 'all 0.2s ease',
          }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '13px', color: 'var(--accent)', fontFamily: 'Syne, sans-serif', fontWeight: 600, marginBottom: '6px' }}>
                DEMO EVENT
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Syne, sans-serif', marginBottom: '6px' }}>
                SF AI Founders Night 🌉
              </div>
              <div style={{ fontSize: '13px', color: 'var(--muted)' }}>
                Tonight · Fort Mason, SF · {DEMO_ATTENDEES.length} people on Meetr
              </div>
            </div>
            <div style={{
              background: 'rgba(124,110,247,0.15)', borderRadius: '8px',
              padding: '6px 10px', fontSize: '13px', color: 'var(--accent)',
              fontFamily: 'Syne, sans-serif', fontWeight: 600, whiteSpace: 'nowrap'
            }}>
              Try it →
            </div>
          </div>
        </motion.button>
      </motion.div>
    </div>
  )
}
