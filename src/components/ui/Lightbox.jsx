/**
 * Lightbox.jsx
 * Full-screen image overlay with prev/next navigation and keyboard support.
 *
 * Props:
 *  - images: string[] — image src paths
 *  - captions: string[] — caption for each image
 *  - initialIndex: number — which image to open on
 *  - onClose: () => void — called when lightbox closes
 */

import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import PropTypes from 'prop-types'
import { useState } from 'react'

const Lightbox = ({ images, captions, initialIndex, onClose }) => {
  const [current, setCurrent] = useState(initialIndex)

  const prev = useCallback(() => setCurrent((i) => (i - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setCurrent((i) => (i + 1) % images.length), [images.length])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, prev, next])

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: 'rgba(5,12,12,0.95)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      {/* Close */}
      <button
        className="absolute top-6 right-6 p-2 rounded-full"
        style={{ background: 'rgba(230,199,156,0.1)', color: 'var(--accent)' }}
        onClick={onClose}
        aria-label="Close lightbox"
      >
        <FiX size={22} />
      </button>

      {/* Prev */}
      {images.length > 1 && (
        <button
          className="absolute left-4 md:left-8 p-3 rounded-full"
          style={{ background: 'rgba(230,199,156,0.08)', color: 'var(--accent)', border: '1px solid var(--border)' }}
          onClick={(e) => {
            e.stopPropagation()
            prev()
          }}
          aria-label="Previous image"
        >
          <FiChevronLeft size={24} />
        </button>
      )}

      {/* Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          className="flex flex-col items-center gap-4 max-w-4xl max-h-[85vh] px-16"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={images[current]}
            alt={captions[current] || `Screenshot ${current + 1}`}
            className="rounded-lg max-h-[75vh] w-auto object-contain"
            style={{ boxShadow: '0 20px 80px rgba(0,0,0,0.6)' }}
          />
          {captions[current] && (
            <p className="font-mono text-sm text-center" style={{ color: 'var(--text-muted)' }}>
              {captions[current]}
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Next */}
      {images.length > 1 && (
        <button
          className="absolute right-4 md:right-8 p-3 rounded-full"
          style={{ background: 'rgba(230,199,156,0.08)', color: 'var(--accent)', border: '1px solid var(--border)' }}
          onClick={(e) => {
            e.stopPropagation()
            next()
          }}
          aria-label="Next image"
        >
          <FiChevronRight size={24} />
        </button>
      )}

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-8 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              className="rounded-full transition-all"
              style={{
                width: i === current ? 20 : 6,
                height: 6,
                background: i === current ? 'var(--accent)' : 'var(--border-hover)',
              }}
              onClick={(e) => {
                e.stopPropagation()
                setCurrent(i)
              }}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}

Lightbox.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  captions: PropTypes.arrayOf(PropTypes.string),
  initialIndex: PropTypes.number,
  onClose: PropTypes.func.isRequired,
}

Lightbox.defaultProps = {
  captions: [],
  initialIndex: 0,
}

export default Lightbox
