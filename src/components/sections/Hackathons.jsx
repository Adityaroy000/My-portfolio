/**
 * Hackathons.jsx — Updated to use HackathonFlipCard.
 * 3 cards in a row, each flips to reveal real experience story.
 */

import { motion } from 'framer-motion'
import ScrollReveal from '../ui/ScrollReveal'
import HackathonFlipCard from '../ui/HackathonFlipCard'
import { hackathons } from '../../data/hackathons'

const Hackathons = () => (
  <section
    id="hackathons"
    className="section-padding"
    style={{ background: 'var(--bg-secondary)' }}
    aria-label="Hackathon participation"
  >
    <div className="container-main">
      <ScrollReveal>
        <p className="font-mono text-xs tracking-widest mb-4" style={{ color: 'var(--accent-dim)' }}>
          {'// 06 — Hackathons'}
        </p>
        <h2
          className="font-display font-semibold mb-3"
          style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: 'var(--text-primary)' }}
        >
          Hackathons
        </h2>
        <p className="font-mono text-xs mb-12" style={{ color: 'var(--text-muted)' }}>
          {'// hover cards to reveal the real story'}
        </p>
      </ScrollReveal>

      <div className="grid sm:grid-cols-3 gap-5">
        {hackathons.map((h, index) => (
          <motion.div
            key={h.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <HackathonFlipCard hackathon={h} />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
)

export default Hackathons
