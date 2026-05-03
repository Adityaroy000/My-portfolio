/**
 * ScrollReveal.jsx
 * Wrapper component that applies a framer-motion fade-up entrance animation
 * when the element scrolls into the viewport.
 *
 * Props:
 *  - children: React.ReactNode — content to animate
 *  - delay: number (default 0) — animation delay in seconds
 *  - className: string — optional extra classes
 *  - direction: 'up' | 'down' | 'left' | 'right' (default 'up')
 */

import { motion } from 'framer-motion'
import PropTypes from 'prop-types'

const directionVariants = {
  up: { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } },
  down: { hidden: { opacity: 0, y: -30 }, visible: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } },
}

const ScrollReveal = ({ children, delay = 0, className = '', direction = 'up' }) => {
  const variants = directionVariants[direction] || directionVariants.up

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={variants}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  )
}

ScrollReveal.propTypes = {
  children: PropTypes.node.isRequired,
  delay: PropTypes.number,
  className: PropTypes.string,
  direction: PropTypes.oneOf(['up', 'down', 'left', 'right']),
}

export default ScrollReveal
