/**
 * HackathonFlipCard.jsx
 * 3D flip card — front shows event info, back shows experience story.
 * Hover on desktop / click on mobile triggers flip.
 *
 * Props:
 *  - hackathon: object from hackathons.js
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'

const HackathonFlipCard = ({ hackathon }) => {
  const [flipped, setFlipped] = useState(false)
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

  const resultStyle =
    hackathon.resultColor === 'gold'
      ? { color: 'var(--accent)', borderColor: 'rgba(230,199,156,0.4)', background: 'var(--accent-muted)' }
      : { color: 'var(--text-muted)', borderColor: 'var(--border)', background: 'transparent' }

  return (
    <div
      className="flip-card relative"
      style={{ height: 320, perspective: 1000 }}
      onMouseEnter={() => !isMobile && setFlipped(true)}
      onMouseLeave={() => !isMobile && setFlipped(false)}
      onClick={() => isMobile && setFlipped((f) => !f)}
      aria-label={`${hackathon.name} — hover to reveal experience`}
    >
      <motion.div
        className="flip-card-inner relative w-full h-full"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* ── FRONT FACE ── */}
        <div
          className="flip-card-front absolute inset-0 flex flex-col justify-between p-6 rounded-lg"
          style={{
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          <div>
            <span className="font-mono text-xs tracking-widest" style={{ color: 'var(--accent-dim)' }}>
              {hackathon.short}
            </span>
            <h3
              className="font-display font-medium mt-1 mb-2 leading-tight"
              style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}
            >
              {hackathon.name}
            </h3>
            <p className="font-sans text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
              {hackathon.org} · {hackathon.year}
            </p>
            <p className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
              {hackathon.theme}
            </p>
          </div>

          <div className="flex items-end justify-between">
            <span className="font-mono text-xs px-3 py-1 rounded-full" style={{ border: '1px solid', ...resultStyle }}>
              {hackathon.result}
            </span>
            <span className="font-mono text-xs" style={{ color: 'var(--text-muted)', opacity: 0.5 }}>
              hover to reveal →
            </span>
          </div>
        </div>

        {/* ── BACK FACE ── */}
        <div
          className="flip-card-back absolute inset-0 flex flex-col p-6 rounded-lg overflow-y-auto"
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-hover)',
            borderLeft: '3px solid var(--accent)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {/* Label */}
          <p className="font-mono text-xs tracking-widest mb-3" style={{ color: 'var(--accent-dim)' }}>
            {'// the real story'}
          </p>

          {/* Built */}
          <p className="font-sans text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
            <span style={{ color: 'var(--accent-dim)' }}>Built: </span>
            {hackathon.built}
          </p>

          {/* Divider */}
          <div style={{ height: 1, background: 'var(--border)', marginBottom: '0.75rem' }} />

          {/* Funny paragraph */}
          <p
            className="font-sans italic text-sm leading-relaxed mb-3"
            style={{ color: 'var(--text-primary)', fontSize: '0.82rem' }}
          >
            {hackathon.experience.funny}
          </p>

          {/* Divider */}
          <div style={{ height: 1, background: 'var(--border)', marginBottom: '0.75rem' }} />

          {/* Real takeaway */}
          <p
            className="font-sans text-sm leading-relaxed"
            style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}
          >
            {hackathon.experience.real}
          </p>
        </div>
      </motion.div>
    </div>
  )
}

HackathonFlipCard.propTypes = {
  hackathon: PropTypes.shape({
    name: PropTypes.string.isRequired,
    short: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
    org: PropTypes.string.isRequired,
    result: PropTypes.string.isRequired,
    resultColor: PropTypes.string,
    theme: PropTypes.string,
    built: PropTypes.string,
    experience: PropTypes.shape({
      funny: PropTypes.string,
      real: PropTypes.string,
    }),
  }).isRequired,
}

export default HackathonFlipCard
