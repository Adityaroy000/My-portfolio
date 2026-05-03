/**
 * useScrollReveal.js
 * Custom hook that returns { ref, isVisible } using IntersectionObserver.
 * Attach `ref` to the target element; `isVisible` becomes true once the
 * element enters the viewport (fires once by default).
 *
 * @param {Object} options - IntersectionObserver options
 * @param {string} [options.threshold=0.15] - Visibility threshold (0–1)
 * @param {string} [options.rootMargin='-80px'] - Root margin
 * @param {boolean} [options.once=true] - Disconnect after first trigger
 */

import { useEffect, useRef, useState } from 'react'

const useScrollReveal = ({ threshold = 0.15, rootMargin = '-80px', once = true } = {}) => {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [threshold, rootMargin, once])

  return { ref, isVisible }
}

export default useScrollReveal
