/**
 * ScreenshotGallery.jsx
 * Custom, premium 3D Rotating Carousel Ring built from scratch.
 * - Symmetrical 3D circular layout (GPU-accelerated transformations)
 * - Click-to-focus on side slides
 * - Touch & mouse swipe dragging
 * - Webkit box reflections
 * - Integrates with Lightbox for full screen inspect on active slide click.
 */

import { useState, useRef, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { FiChevronLeft, FiChevronRight, FiMaximize2, FiCamera } from 'react-icons/fi'
import PropTypes from 'prop-types'
import Lightbox from './Lightbox'

const ScreenshotGallery = ({ screenshots, captions }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [startX, setStartX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef(null)

  const realImages = screenshots.filter(Boolean)
  const realCaptions = captions.filter((_, i) => screenshots[i])

  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  const resolve = (src) => (src ? `${base}${src}` : src)

  const total = realImages.length

  // Auto-rotation (pauses on hover)
  const [isHovered, setIsHovered] = useState(false)
  useEffect(() => {
    if (isHovered || total <= 1 || lightboxIndex !== null) return
    const interval = setInterval(() => {
      setActiveIndex((prev) => prev + 1)
    }, 4500)
    return () => clearInterval(interval)
  }, [isHovered, total, lightboxIndex])

  if (total === 0) {
    return (
      <div
        className="rounded-lg flex flex-col items-center justify-center gap-3 p-12"
        style={{
          background: 'var(--bg-tertiary)',
          border: '1px dashed var(--border)',
          height: '240px',
        }}
      >
        <FiCamera size={28} style={{ color: 'var(--text-muted)' }} />
        <p className="font-mono text-xs text-[var(--text-muted)]">Interface screenshots coming soon</p>
      </div>
    )
  }

  const activeIdxNormalized = ((activeIndex % total) + total) % total

  const handlePrev = () => {
    setActiveIndex((prev) => prev - 1)
  }

  const handleNext = () => {
    setActiveIndex((prev) => prev + 1)
  }

  // Swipe/Drag Handlers
  const handleDragStart = (e) => {
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0
    setStartX(clientX)
    setIsDragging(true)
  }

  const handleDragMove = (e) => {
    if (!isDragging) return
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0
    const diffX = clientX - startX

    if (Math.abs(diffX) > 60) {
      if (diffX > 0) {
        handlePrev()
      } else {
        handleNext()
      }
      setIsDragging(false)
    }
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  const openLightbox = (src) => {
    const realIdx = realImages.indexOf(src)
    setLightboxIndex(realIdx >= 0 ? realIdx : 0)
  }

  const rotationY = -activeIndex * (360 / total)

  return (
    <div
      className="relative w-full flex flex-col items-center select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setIsDragging(false)
      }}
    >
      {/* 3D Ring Stage */}
      <div
        ref={containerRef}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
        className="relative w-full flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden"
        style={{
          height: '350px',
          perspective: '1200px',
        }}
      >
        <div
          className="relative w-[var(--card-w)] h-[var(--card-h)]"
          style={{
            transformStyle: 'preserve-3d',
            transform: `translateZ(-50px) rotateY(${rotationY}deg)`,
            transition: 'transform 0.85s cubic-bezier(0.25, 1, 0.5, 1)',
          }}
        >
          {realImages.map((src, i) => {
            const itemAngle = i * (360 / total)
            const isCenter = i === activeIdxNormalized

            return (
              <div
                key={i}
                onClick={() => {
                  if (isCenter) {
                    openLightbox(src)
                  } else {
                    // Click side card to spin to it
                    // Calculate shortest rotation path
                    const diff = i - activeIdxNormalized
                    // Adjust diff to handle wraps
                    let offset = diff
                    if (Math.abs(diff) > total / 2) {
                      offset = diff > 0 ? diff - total : diff + total
                    }
                    setActiveIndex((prev) => prev + offset)
                  }
                }}
                className="absolute inset-0 rounded-lg overflow-hidden border carousel-card-reflect"
                style={{
                  borderColor: isCenter ? 'var(--accent)' : 'var(--border)',
                  transform: `rotateY(${itemAngle}deg) translateZ(var(--tz))`,
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'visible',
                  opacity: isCenter ? 1 : 0.45,
                  scale: isCenter ? 1 : 0.85,
                  filter: isCenter ? 'none' : 'blur(1px) grayscale(15%)',
                  boxShadow: isCenter ? '0 12px 30px rgba(230,199,156,0.18)' : 'none',
                  cursor: isCenter ? 'zoom-in' : 'pointer',
                  transition:
                    'transform 0.85s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.85s, scale 0.85s, filter 0.85s, border-color 0.4s',
                }}
              >
                <img
                  src={resolve(src)}
                  alt={realCaptions[i] || `Screenshot ${i + 1}`}
                  className="w-full h-full object-cover pointer-events-none"
                  loading="lazy"
                />

                {isCenter && (
                  <div
                    className="absolute right-3 top-3 p-1.5 rounded-full bg-black/60 border border-white/20 text-white opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    title="Zoom Screen"
                  >
                    <FiMaximize2 size={12} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Caption & Nav Row */}
      <div className="w-full max-w-md mt-6 flex flex-col items-center gap-4">
        {/* Caption */}
        <p className="font-mono text-xs text-center min-h-[16px] transition-all duration-300 text-[var(--accent)]">
          {realCaptions[activeIdxNormalized] || `Snapshot ${activeIdxNormalized + 1} of ${total}`}
        </p>

        {/* Buttons & Indicators */}
        <div className="flex items-center gap-6">
          <button
            onClick={handlePrev}
            className="w-8 h-8 rounded-full border flex items-center justify-center text-[var(--text-secondary)] hover:text-white hover:border-white transition-all cursor-pointer"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-tertiary)' }}
            aria-label="Previous image"
          >
            <FiChevronLeft size={16} />
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {realImages.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  const diff = i - activeIdxNormalized
                  let offset = diff
                  if (Math.abs(diff) > total / 2) {
                    offset = diff > 0 ? diff - total : diff + total
                  }
                  setActiveIndex((prev) => prev + offset)
                }}
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  background: i === activeIdxNormalized ? 'var(--accent)' : 'var(--border-hover)',
                  transform: i === activeIdxNormalized ? 'scale(1.2)' : 'none',
                }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-8 h-8 rounded-full border flex items-center justify-center text-[var(--text-secondary)] hover:text-white hover:border-white transition-all cursor-pointer"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-tertiary)' }}
            aria-label="Next image"
          >
            <FiChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Lightbox Trigger */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={realImages.map(resolve)}
            captions={realCaptions}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

ScreenshotGallery.propTypes = {
  screenshots: PropTypes.arrayOf(PropTypes.string).isRequired,
  captions: PropTypes.arrayOf(PropTypes.string),
}

ScreenshotGallery.defaultProps = {
  captions: [],
}

export default ScreenshotGallery
