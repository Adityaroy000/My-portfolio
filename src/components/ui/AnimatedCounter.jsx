/**
 * AnimatedCounter.jsx
 * Counts from 0 to `target` over `duration` ms once scrolled into view.
 * Uses useScrollReveal internally to trigger the animation.
 *
 * Props:
 *  - target: number — the final count value
 *  - suffix: string — appended after the number (e.g. "+")
 *  - prefix: string — prepended before the number (optional)
 *  - duration: number — animation duration in ms (default 1500)
 */

import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import useScrollReveal from '../../hooks/useScrollReveal'

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

const AnimatedCounter = ({ target, suffix = '', prefix = '', duration = 1500 }) => {
  const [count, setCount] = useState(0)
  const { ref, isVisible } = useScrollReveal({ threshold: 0.5 })
  const animationRef = useRef(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return
    hasAnimated.current = true

    const startTime = performance.now()

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOutCubic(progress)
      setCount(Math.floor(easedProgress * target))

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setCount(target)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [isVisible, target, duration])

  return (
    <span ref={ref} aria-label={`${prefix}${target}${suffix}`}>
      {prefix}
      {count}
      {suffix}
    </span>
  )
}

AnimatedCounter.propTypes = {
  target: PropTypes.number.isRequired,
  suffix: PropTypes.string,
  prefix: PropTypes.string,
  duration: PropTypes.number,
}

export default AnimatedCounter
