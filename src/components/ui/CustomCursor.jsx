/**
 * CustomCursor.jsx
 * A small gold dot that follows the cursor with slight lerp lag (desktop only).
 * On hover over interactive elements, expands to a hollow ring.
 */

import { useEffect, useRef, useState } from 'react'

const CustomCursor = () => {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const pos = useRef({ x: -100, y: -100 })
  const ring = useRef({ x: -100, y: -100 })
  const rafId = useRef(null)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    // Only enable on desktop
    if (window.matchMedia('(pointer: coarse)').matches) return

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
    }

    const onEnter = (e) => {
      const tag = e.target.tagName.toLowerCase()
      const role = e.target.getAttribute('role')
      if (
        tag === 'a' ||
        tag === 'button' ||
        tag === 'input' ||
        role === 'button' ||
        e.target.classList.contains('cursor-pointer')
      ) {
        setIsHovering(true)
      }
    }

    const onLeave = () => setIsHovering(false)

    const animate = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x - 4}px, ${pos.current.y - 4}px)`
      }

      // Lerp ring toward cursor
      ring.current.x += (pos.current.x - ring.current.x) * 0.12
      ring.current.y += (pos.current.y - ring.current.y) * 0.12

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x - 16}px, ${ring.current.y - 16}px)`
      }

      rafId.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onEnter)
    document.addEventListener('mouseout', onLeave)
    rafId.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onEnter)
      document.removeEventListener('mouseout', onLeave)
      cancelAnimationFrame(rafId.current)
    }
  }, [])

  // Don't render on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null
  }

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
        style={{
          width: 8,
          height: 8,
          background: 'var(--accent)',
          transition: 'opacity 0.2s',
          willChange: 'transform',
        }}
      />

      {/* Ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full"
        style={{
          width: 32,
          height: 32,
          border: `1.5px solid ${isHovering ? 'var(--accent)' : 'rgba(230,199,156,0.35)'}`,
          transform: `scale(${isHovering ? 1.6 : 1})`,
          transition: 'border-color 0.2s, transform 0.25s',
          willChange: 'transform',
        }}
      />
    </>
  )
}

export default CustomCursor
