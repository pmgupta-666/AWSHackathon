'use client'

import { useState, useRef } from 'react'
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion'
import { Attendee, UserProfile } from '@/app/page'

const INTENT_LABELS: Record<string, { label: string; emoji: string; color: string }> = {
  'co-founder': { label: 'Finding co-founder', emoji: '🤝', color: '#7C6EF7' },
  'investor': { label: 'Open to invest', emoji: '💰', color: '#F7A26E' },
  'hiring': { label: "Hiring", emoji: '🎯', color: '#6EF7A2' },
  'be-hired': { label: 'Open to roles', emoji: '✨', color: '#6EB4F7' },
  'customers': { label: 'Finding customers', emoji: '🚀', color: '#F76E6E' },
  'just-vibing': { label: 'Just networking', emoji: '👋', color: '#F7E26E' },
}

type SwipeAction = 'left' | 'right' | 'up' | null

function SwipeCard({
  attendee,
  onSwipe,
  isTop,
  index,
}: {
  attendee: Attendee
  onSwipe: (direction: SwipeAction) => void
  isTop: boolean
  index: number
}) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-20, 20])
  const noOpacity = useTransform(x, [-100, -20], [1, 0])
  const yesOpacity = useTransform(x, [20, 100], [0, 1])
  const upOpacity = useTransform(y, [-100, -20], [1, 0])

  const intent = INTENT_LABELS[attendee.intent]

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x < -80) onSwipe('left')
    else if (info.offset.x > 80) onSwipe('right')
    else if (info.offset.y < -80) onSwipe('up')
    else { x.set(0); y.set(0) }
  }

  return (
    <motion.div
      className="swipe-card"
      style={{
        x, y, rotate,
        zIndex: 10 - index,
        scale: isTop ? 1 : 1 - index * 0.04,
        top: index * 8,
        background: 'var(--surface)',
        border: '1.5px solid var(--border)',
        overflow: 'hidden',
      }}
      drag={isTop}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      animate={{ scale: isTop ? 1 : 1 - index * 0.04 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Swipe indicators */}
      {isTop && (
        <>
          <motion.div style={{
            position: 'absolute', top: 20, left: 20, zIndex: 20,
            padding: '8px 16px', borderRadius: '8px',
            border: '2px solid var(--no)', color: 'var(--no)',
            fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '18px',
            opacity: noOpacity, transform: 'rotate(-15deg)',
          }}>PASS</motion.div>

          <motion.div style={{
            position: 'absolute', top: 20, right: 20, zIndex: 20,
            padding: '8px 16px', borderRadius: '8px',
            border: '2px solid var(--yes)', color: 'var(--yes)',
            fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '18px',
            opacity: yesOpacity, transform: 'rotate(15deg)',
          }}>MEET</motion.div>

          <motion.div style={{
            position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)',
            zIndex: 20, padding: '8px 16px', borderRadius: '8px',
            border: '2px solid var(--connect)', color: 'var(--connect)',
            fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '18px',
            opacity: upOpacity,
          }}>CONNECT</motion.div>
        </>
      )}

      {/* Avatar */}
      <div style={{
        height: '220px',
        background: `linear-gradient(135deg, var(--surface2), var(--surface))`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(circle at 50% 50%, ${intent?.color}15 0%, transparent 70%)`,
        }} />
        <img
          src={attendee.avatarUrl}
          alt={attendee.name}
          style={{ width: '120px', height: '120px', borderRadius: '50%', border: '3px solid var(--border)' }}
          draggable={false}
        />
      </div>

      {/* Info */}
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <div>
            <h3 style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'Syne, sans-serif' }}>{attendee.name}</h3>
            <p style={{ color: 'var(--muted)', fontSize: '14px', marginTop: '2px' }}>
              {attendee.role}{attendee.company ? ` · ${attendee.company}` : ''}
            </p>
          </div>
          {attendee.sharedEvents && attendee.sharedEvents > 1 && (
            <div style={{
              background: 'rgba(124,110,247,0.15)', borderRadius: '8px',
              padding: '4px 8px', fontSize: '11px', color: 'var(--accent)',
              fontFamily: 'Syne, sans-serif', fontWeight: 600, textAlign: 'center',
              lineHeight: 1.3,
            }}>
              {attendee.sharedEvents}x<br />events
            </div>
          )}
        </div>

        {/* Intent badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '6px 12px', borderRadius: '100px',
          background: `${intent?.color}15`,
          border: `1.5px solid ${intent?.color}40`,
          color: intent?.color, fontSize: '13px',
          fontFamily: 'Syne, sans-serif', fontWeight: 600,
        }}>
          {intent?.emoji} {intent?.label}
        </div>

        {/* Shared event note */}
        {attendee.sharedEvents && attendee.sharedEvents > 1 && (
          <p style={{
            marginTop: '12px', fontSize: '12px', color: 'var(--muted)',
            fontStyle: 'italic', lineHeight: 1.5,
          }}>
            ✦ You've been at {attendee.sharedEvents} of the same Luma events and never met.
          </p>
        )}
      </div>

      {/* Action hints at bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        display: 'flex', justifyContent: 'space-between', padding: '12px 20px',
        borderTop: '1px solid var(--border)',
        background: 'var(--surface)',
        fontSize: '11px', color: 'var(--muted)', fontFamily: 'Syne, sans-serif',
      }}>
        <span style={{ color: 'var(--no)' }}>← pass</span>
        <span style={{ color: 'var(--connect)' }}>↑ connect on LinkedIn</span>
        <span style={{ color: 'var(--yes)' }}>meet →</span>
      </div>
    </motion.div>
  )
}

function MatchModal({
  attendee,
  action,
  userProfile,
  onClose,
}: {
  attendee: Attendee
  action: 'right' | 'up'
  userProfile: UserProfile
  onClose: () => void
}) {
  const handleAction = () => {
    if (action === 'right' && userProfile.calendlyUrl) {
      navigator.clipboard.writeText(userProfile.calendlyUrl)
        .catch(() => {})
      window.open(attendee.linkedinUrl || '#', '_blank')
    } else if (action === 'up' && attendee.linkedinUrl) {
      window.open(attendee.linkedinUrl, '_blank')
    }
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 100, padding: '20px',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, y: 40 }} animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 40 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--surface)', borderRadius: '24px',
          border: '1.5px solid var(--border)', padding: '32px',
          maxWidth: '340px', width: '100%', textAlign: 'center',
        }}
      >
        {action === 'right' ? (
          <>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>
              You want to meet!
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>
              Your Calendly link has been copied. Send it to <strong style={{ color: 'var(--text)' }}>{attendee.name}</strong> to book a time.
            </p>
            <div style={{
              background: 'var(--surface2)', borderRadius: '12px', padding: '12px 16px',
              fontSize: '13px', color: 'var(--accent)', fontFamily: 'Syne, sans-serif',
              marginBottom: '20px', wordBreak: 'break-all',
            }}>
              📋 {userProfile.calendlyUrl || 'calendly.com/your-link — add in settings'}
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔗</div>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>
              Connect on LinkedIn
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>
              Opening <strong style={{ color: 'var(--text)' }}>{attendee.name}</strong>'s LinkedIn so you can send a connection request.
            </p>
          </>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={handleAction}
          style={{
            width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
            background: action === 'right' ? 'var(--yes)' : 'var(--connect)',
            color: '#0A0A0F', fontSize: '15px', fontWeight: 700,
            fontFamily: 'Syne, sans-serif', cursor: 'pointer',
          }}>
          {action === 'right' ? '📋 Copy Calendly link' : '🔗 Open LinkedIn'}
        </motion.button>

        <button onClick={onClose} style={{
          marginTop: '12px', background: 'none', border: 'none',
          color: 'var(--muted)', fontSize: '14px', cursor: 'pointer',
        }}>
          Maybe later
        </button>
      </motion.div>
    </motion.div>
  )
}

export default function SwipeDeck({
  attendees,
  userProfile,
  eventName,
  onBack,
}: {
  attendees: Attendee[]
  userProfile: UserProfile
  eventName: string
  onBack: () => void
}) {
  const [queue, setQueue] = useState(attendees)
  const [match, setMatch] = useState<{ attendee: Attendee; action: 'right' | 'up' } | null>(null)
  const [stats, setStats] = useState({ passed: 0, meetings: 0, connects: 0 })

  const handleSwipe = (direction: SwipeAction, attendee: Attendee) => {
    setQueue(prev => prev.slice(1))

    if (direction === 'right') {
      setStats(s => ({ ...s, meetings: s.meetings + 1 }))
      setMatch({ attendee, action: 'right' })
    } else if (direction === 'up') {
      setStats(s => ({ ...s, connects: s.connects + 1 }))
      setMatch({ attendee, action: 'up' })
    } else {
      setStats(s => ({ ...s, passed: s.passed + 1 }))
    }
  }

  const handleButton = (direction: SwipeAction) => {
    if (queue.length === 0) return
    handleSwipe(direction, queue[0])
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
      {/* Header */}
      <div style={{ width: '100%', maxWidth: '360px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', color: 'var(--muted)',
          fontSize: '14px', cursor: 'pointer', fontFamily: 'Syne, sans-serif',
        }}>← back</button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: 'var(--accent)', fontFamily: 'Syne, sans-serif', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Meetr
          </div>
          <div style={{ fontSize: '13px', color: 'var(--muted)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {eventName}
          </div>
        </div>
        <div style={{ fontSize: '13px', color: 'var(--muted)', fontFamily: 'Syne, sans-serif' }}>
          {queue.length} left
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: '16px' }}>
        {[
          { label: 'Meetings', value: stats.meetings, color: 'var(--yes)' },
          { label: 'Connects', value: stats.connects, color: 'var(--connect)' },
          { label: 'Passed', value: stats.passed, color: 'var(--muted)' },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'Syne, sans-serif', color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Card stack */}
      <div className="card-stack">
        <AnimatePresence>
          {queue.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              style={{
                position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                background: 'var(--surface)', borderRadius: '24px', border: '1.5px solid var(--border)',
                padding: '32px',
              }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>✨</div>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>
                You've seen everyone!
              </h3>
              <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: 1.6 }}>
                {stats.meetings} meetings booked · {stats.connects} LinkedIn connects
              </p>
              <motion.button whileHover={{ scale: 1.02 }} onClick={onBack}
                style={{
                  marginTop: '24px', padding: '12px 24px', borderRadius: '12px', border: 'none',
                  background: 'var(--accent)', color: 'white', fontSize: '14px',
                  fontWeight: 700, fontFamily: 'Syne, sans-serif', cursor: 'pointer',
                }}>
                Try another event →
              </motion.button>
            </motion.div>
          ) : (
            queue.slice(0, 3).reverse().map((attendee, reverseIdx) => {
              const idx = Math.min(queue.slice(0, 3).length - 1 - reverseIdx, 2)
              return (
                <SwipeCard
                  key={attendee.id}
                  attendee={attendee}
                  isTop={idx === 0}
                  index={idx}
                  onSwipe={(dir) => idx === 0 && handleSwipe(dir, attendee)}
                />
              )
            })
          )}
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      {queue.length > 0 && (
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            className="action-btn" onClick={() => handleButton('left')}
            title="Pass"
            style={{ borderColor: 'var(--no)', width: '52px', height: '52px', fontSize: '20px' }}>
            ✕
          </motion.button>

          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            className="action-btn" onClick={() => handleButton('up')}
            title="Connect on LinkedIn"
            style={{ borderColor: 'var(--connect)', width: '48px', height: '48px', fontSize: '18px' }}>
            🔗
          </motion.button>

          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            className="action-btn" onClick={() => handleButton('right')}
            title="Request a meeting"
            style={{ borderColor: 'var(--yes)', width: '52px', height: '52px', fontSize: '20px' }}>
            ✓
          </motion.button>
        </div>
      )}

      {/* Legend */}
      {queue.length > 0 && (
        <div style={{ display: 'flex', gap: '20px', fontSize: '11px', color: 'var(--muted)' }}>
          <span style={{ color: 'var(--no)' }}>✕ pass</span>
          <span style={{ color: 'var(--connect)' }}>🔗 LinkedIn</span>
          <span style={{ color: 'var(--yes)' }}>✓ book meeting</span>
        </div>
      )}

      {/* Match modal */}
      <AnimatePresence>
        {match && (
          <MatchModal
            attendee={match.attendee}
            action={match.action}
            userProfile={userProfile}
            onClose={() => setMatch(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
