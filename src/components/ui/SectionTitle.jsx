/**
 * SectionTitle.jsx
 * Renders a consistent section title with a large decorative background number,
 * overlaid with the section title and optional subtitle.
 *
 * Props:
 *  - number: string — e.g. "04"
 *  - title: string — e.g. "Projects"
 *  - subtitle: string (optional)
 *  - align: 'left' | 'center' (default 'left')
 */

import { motion } from 'framer-motion'
import PropTypes from 'prop-types'

const SectionTitle = ({ number, title, subtitle, align = 'left' }) => {
  const alignClass = align === 'center' ? 'items-center text-center' : 'items-start text-left'

  return (
    <div className={`relative flex flex-col ${alignClass} mb-16 select-none`}>
      {/* Decorative background number */}
      <span
        aria-hidden="true"
        className="absolute -top-4 -left-2 font-display font-bold leading-none pointer-events-none"
        style={{
          fontSize: 'clamp(5rem, 12vw, 10rem)',
          color: 'var(--accent)',
          opacity: 0.05,
          lineHeight: 1,
          zIndex: 0,
        }}
      >
        {number}
      </span>

      {/* Mono label */}
      <motion.span
        className="font-mono text-xs tracking-widest mb-3 relative z-10"
        style={{ color: 'var(--accent-dim)' }}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {`// ${number}`}
      </motion.span>

      {/* Main title */}
      <motion.h2
        className="font-display font-semibold relative z-10 leading-tight"
        style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          color: 'var(--text-primary)',
        }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        {title}
      </motion.h2>

      {/* Gold underline */}
      <motion.div
        className="relative z-10 mt-4"
        style={{
          width: '3rem',
          height: '2px',
          background: 'var(--accent)',
          marginLeft: align === 'center' ? 'auto' : '0',
          marginRight: align === 'center' ? 'auto' : '0',
        }}
        initial={{ scaleX: 0, originX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
      />

      {/* Optional subtitle */}
      {subtitle && (
        <motion.p
          className="font-sans mt-4 max-w-xl relative z-10"
          style={{ color: 'var(--text-secondary)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  )
}

SectionTitle.propTypes = {
  number: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  align: PropTypes.oneOf(['left', 'center']),
}

export default SectionTitle
