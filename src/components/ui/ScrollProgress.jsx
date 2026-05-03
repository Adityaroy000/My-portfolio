/**
 * ScrollProgress.jsx
 * Thin gold line fixed at the very top of the viewport.
 * Width represents how far the user has scrolled down the page.
 * Uses Framer Motion useScroll + useTransform.
 */

import { useScroll, useTransform, motion } from 'framer-motion'

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll()
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[100] origin-left"
      style={{
        height: 2,
        background: 'var(--accent)',
        scaleX,
        transformOrigin: '0%',
      }}
    />
  )
}

export default ScrollProgress
