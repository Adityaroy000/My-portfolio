/**
 * Education.jsx — Two-column layout.
 * Left (60%): Gold timeline with hoverable cards.
 * Right (40%): EducationHoverPanel slides in on card hover.
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import SectionTitle from '../ui/SectionTitle'
import EducationHoverPanel from '../ui/EducationHoverPanel'
import { education, educationStories } from '../../data/education'

const Education = () => {
  const [activeId, setActiveId] = useState(null)

  const activeStory = educationStories.find((s) => s.id === activeId) || null

  return (
    <section
      id="education"
      className="section-padding"
      style={{ background: 'var(--bg-primary)' }}
      aria-label="Education history"
    >
      <div className="container-main">
        <SectionTitle number="07" title="Education" />

        <div className="grid md:grid-cols-5 gap-10 lg:gap-16 items-start">
          {/* LEFT — Timeline (60%) */}
          <div className="md:col-span-3 relative">
            {/* Vertical gold line */}
            <div
              aria-hidden="true"
              className="absolute left-3 top-2 bottom-2"
              style={{
                width: 1,
                background: 'linear-gradient(to bottom, var(--accent), rgba(230,199,156,0.1))',
              }}
            />

            <div className="flex flex-col gap-8">
              {education.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="relative pl-12 cursor-pointer"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.55, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
                  onMouseEnter={() => setActiveId(item.id)}
                  onMouseLeave={() => setActiveId(null)}
                  onFocus={() => setActiveId(item.id)}
                  onBlur={() => setActiveId(null)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${item.institution} — hover to read the story`}
                >
                  {/* Diamond node */}
                  <motion.div
                    aria-hidden="true"
                    className="absolute"
                    style={{
                      left: -2,
                      top: 14,
                      width: 12,
                      height: 12,
                      background:
                        activeId === item.id ? 'var(--accent)' : item.current ? 'var(--accent)' : 'var(--bg-secondary)',
                      border: '1.5px solid var(--accent)',
                      transform: 'rotate(45deg)',
                      transition: 'background 0.25s',
                    }}
                    animate={
                      item.current
                        ? {
                            boxShadow: [
                              '0 0 8px rgba(230,199,156,0.3)',
                              '0 0 20px rgba(230,199,156,0.6)',
                              '0 0 8px rgba(230,199,156,0.3)',
                            ],
                          }
                        : {}
                    }
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />

                  {/* Card */}
                  <motion.div
                    className="p-6 rounded-lg"
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid',
                      borderColor: activeId === item.id ? 'var(--border-hover)' : 'var(--border)',
                      boxShadow: activeId === item.id ? '0 4px 24px var(--glow)' : 'none',
                      transition: 'border-color 0.25s, box-shadow 0.25s',
                    }}
                  >
                    <p className="font-mono text-xs tracking-widest mb-2" style={{ color: 'var(--accent-dim)' }}>
                      {item.period}
                      {item.current && (
                        <span
                          className="ml-2 px-2 py-0.5 rounded-full text-xs"
                          style={{
                            background: 'rgba(74,222,128,0.1)',
                            color: '#4ade80',
                            border: '1px solid rgba(74,222,128,0.3)',
                          }}
                        >
                          Current
                        </span>
                      )}
                    </p>

                    <h3
                      className="font-display font-semibold mb-1 leading-tight"
                      style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', color: 'var(--text-primary)' }}
                    >
                      {item.institution}
                    </h3>

                    <p className="font-sans text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                      {item.degree}
                    </p>

                    <div className="flex items-center gap-4 flex-wrap">
                      <span
                        className="font-mono text-xs px-3 py-1 rounded"
                        style={{
                          background: 'var(--accent-muted)',
                          color: 'var(--accent)',
                          border: '1px solid var(--border)',
                        }}
                      >
                        {item.scoreLabel}: {item.score}
                      </span>
                      <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                        {item.location}
                      </span>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* RIGHT — Hover panel (40%) */}
          <div className="md:col-span-2 md:sticky md:top-32">
            <EducationHoverPanel story={activeStory} isVisible={!!activeId} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Education
