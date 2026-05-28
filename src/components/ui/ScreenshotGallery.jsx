/**
 * ScreenshotGallery.jsx
 * Displays a grid of project screenshots.
 * Empty strings render styled placeholder divs with a camera icon.
 * Clicking a real image opens the Lightbox.
 *
 * Props:
 *  - screenshots: string[] — image src paths (empty string = placeholder)
 *  - captions: string[] — caption for each screenshot
 */

import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { FiCamera } from 'react-icons/fi'
import PropTypes from 'prop-types'
import Lightbox from './Lightbox'

const ScreenshotGallery = ({ screenshots, captions }) => {
  const [lightboxIndex, setLightboxIndex] = useState(null)

  // Filter real images for lightbox navigation
  const realImages = screenshots.filter(Boolean)
  const realCaptions = captions.filter((_, i) => screenshots[i])

  // Resolve paths against the Vite base URL so they work on GitHub Pages
  const base = import.meta.env.BASE_URL.replace(/\/$/, '') // strip trailing slash
  const resolve = (src) => (src ? `${base}${src}` : src)

  const openLightbox = (src) => {
    if (!src) return
    const realIdx = realImages.indexOf(src)
    setLightboxIndex(realIdx >= 0 ? realIdx : 0)
  }

  if (!screenshots.length) return null

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {screenshots.map((src, i) =>
          src ? (
            <button
              key={i}
              className="rounded-lg overflow-hidden text-left"
              style={{ border: '1px solid var(--border)', cursor: 'zoom-in' }}
              onClick={() => openLightbox(src)}
              aria-label={`Open screenshot: ${captions[i] || `Screenshot ${i + 1}`}`}
            >
              <img
                src={resolve(src)}
                alt={captions[i] || `Project screenshot ${i + 1}`}
                className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                loading="lazy"
              />
              {captions[i] && (
                <p
                  className="px-4 py-2 font-mono text-xs"
                  style={{ color: 'var(--text-muted)', background: 'var(--bg-tertiary)' }}
                >
                  {captions[i]}
                </p>
              )}
            </button>
          ) : (
            <div
              key={i}
              className="rounded-lg flex flex-col items-center justify-center gap-3"
              style={{
                height: 200,
                background: 'var(--bg-tertiary)',
                border: '1px dashed var(--border)',
              }}
              aria-label={`Screenshot placeholder: ${captions[i] || `Screenshot ${i + 1}`}`}
            >
              <FiCamera size={24} style={{ color: 'var(--text-muted)' }} aria-hidden="true" />
              <p className="font-mono text-xs text-center px-4" style={{ color: 'var(--text-muted)' }}>
                {captions[i] || 'Screenshot coming soon'}
              </p>
            </div>
          ),
        )}
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && realImages.length > 0 && (
          <Lightbox
            images={realImages.map(resolve)}
            captions={realCaptions}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </>
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
