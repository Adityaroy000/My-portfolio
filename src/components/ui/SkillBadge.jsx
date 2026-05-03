/**
 * SkillBadge.jsx
 * A gold-bordered pill/chip displaying a skill label in JetBrains Mono.
 * On hover, fills with the accent-muted background.
 *
 * Props:
 *  - label: string — the skill name to display
 *  - size: 'sm' | 'md' (default 'md')
 */

import { motion } from 'framer-motion'
import PropTypes from 'prop-types'

const SkillBadge = ({ label, size = 'md' }) => {
  const sizeStyles = {
    sm: { fontSize: '0.7rem', padding: '0.2rem 0.6rem' },
    md: { fontSize: '0.78rem', padding: '0.3rem 0.85rem' },
  }

  return (
    <motion.span
      className="font-mono rounded-full cursor-default inline-block"
      style={{
        ...sizeStyles[size],
        border: '1px solid var(--border)',
        color: 'var(--text-secondary)',
        background: 'transparent',
        letterSpacing: '0.03em',
        transition: 'all 0.25s ease',
        whiteSpace: 'nowrap',
      }}
      whileHover={{
        borderColor: 'rgba(230, 199, 156, 0.45)',
        backgroundColor: 'rgba(230, 199, 156, 0.1)',
        color: 'var(--accent)',
        scale: 1.03,
      }}
    >
      {label}
    </motion.span>
  )
}

SkillBadge.propTypes = {
  label: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['sm', 'md']),
}

export default SkillBadge
