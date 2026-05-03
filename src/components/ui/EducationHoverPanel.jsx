/**
 * EducationHoverPanel.jsx
 * Slides in from the right when a timeline card is hovered.
 * Renders the roast/story paragraph for that education entry.
 *
 * Props:
 *  - story: object from educationStories (id, emoji, title, story)
 *  - isVisible: boolean
 */

import { AnimatePresence, motion } from 'framer-motion'
import PropTypes from 'prop-types'

const EducationHoverPanel = ({ story, isVisible }) => (
  <AnimatePresence mode="wait">
    {isVisible && story ? (
      <motion.div
        key={story.id}
        className="relative p-7 rounded-lg overflow-hidden"
        style={{
          background: 'var(--bg-tertiary)',
          borderLeft: '4px solid var(--accent)',
          border: '1px solid var(--border)',
          borderLeftWidth: 4,
          borderLeftColor: 'var(--accent)',
        }}
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 40 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      >
        {/* Decorative quote mark background */}
        <span
          aria-hidden="true"
          className="absolute top-2 right-4 font-display leading-none pointer-events-none select-none"
          style={{ fontSize: '8rem', color: 'var(--accent)', opacity: 0.05, lineHeight: 1 }}
        >
          &ldquo;
        </span>

        {/* Emoji */}
        <div className="text-5xl mb-4" role="img" aria-label={story.title}>
          {story.emoji}
        </div>

        {/* Title */}
        <h3
          className="font-display font-semibold mb-4 relative z-10"
          style={{ fontSize: '1.5rem', color: 'var(--accent)' }}
        >
          {story.title}
        </h3>

        {/* Story */}
        <p
          className="font-sans leading-relaxed relative z-10"
          style={{ color: 'var(--text-primary)', fontSize: '0.93rem', lineHeight: 1.8 }}
        >
          {story.story}
        </p>
      </motion.div>
    ) : !isVisible ? (
      <motion.div
        key="hint"
        className="flex items-center justify-center h-full min-h-48"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <p className="font-mono text-xs tracking-widest text-center" style={{ color: 'var(--text-muted)' }}>
          {'// hover a card to explore'}
        </p>
      </motion.div>
    ) : null}
  </AnimatePresence>
)

EducationHoverPanel.propTypes = {
  story: PropTypes.shape({
    id: PropTypes.string,
    emoji: PropTypes.string,
    title: PropTypes.string,
    story: PropTypes.string,
  }),
  isVisible: PropTypes.bool.isRequired,
}

export default EducationHoverPanel
