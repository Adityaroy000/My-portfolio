/**
 * Education.jsx — CS Odyssey & Education
 * Upgraded from a generic vertical timeline to an interactive, horizontal
 * roadmap showing academic growth side-by-side with self-driven CS milestones.
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionTitle from '../ui/SectionTitle'
import { education, educationStories } from '../../data/education'
import { FiBookOpen, FiAward, FiLayers, FiCode } from 'react-icons/fi'

const YEAR_UNLOCKS = {
  year4: ['React/Vite', 'Daily DSA', 'System Specs optimization', 'System Engineer L1 Interviews'],
  year3: ['Express.js Backend', 'Figma Design', 'Dynamic RBAC Guard', 'Server-Sent Events (SSE)'],
  year2: ['C++ STL', 'Data Structures & Algorithms', 'Machine Learning Theory', 'OOP & DBMS Concepts'],
  year1: ['C Language Syntax', 'Basic Algorithm logic', 'Pointer operations', 'Competitive Programming basics'],
  schooling: ['Secondary Education', 'Higher Secondary physics/math', 'JEE resilience', 'Calculus foundations']
}

const YEAR_ICONS = {
  year4: FiLayers,
  year3: FiCode,
  year2: FiAward,
  year1: FiBookOpen,
  schooling: FiBookOpen
}

const Education = () => {
  const [activeId, setActiveId] = useState('year4')

  const activeItem = education.find((e) => e.id === activeId)
  const activeStory = educationStories.find((s) => s.id === activeId)
  const Unlocks = YEAR_UNLOCKS[activeId] || []
  const Icon = YEAR_ICONS[activeId] || FiBookOpen

  return (
    <section
      id="education"
      className="section-padding"
      style={{ background: 'var(--bg-primary)' }}
      aria-label="CS Odyssey and Education history"
    >
      <div className="container-main">
        <SectionTitle number="07" title="CS Odyssey & Education" />

        {/* Horizontal Navigation Stepper */}
        <div className="relative mb-12 py-4 overflow-x-auto scrollbar-none">
          {/* Connecting line */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] hidden md:block"
            style={{
              background: 'linear-gradient(to right, var(--border), var(--accent), var(--border))',
              zIndex: 0
            }}
          />

          <div className="flex md:justify-between items-center gap-6 md:gap-4 relative z-10 px-4 min-w-[640px]">
            {education.map((item) => {
              const isSelected = item.id === activeId
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveId(item.id)}
                  className="flex flex-col items-center gap-2 group cursor-pointer focus:outline-none shrink-0"
                  aria-label={`View roadmap for ${item.degree}`}
                >
                  {/* Node dot */}
                  <motion.div
                    className="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300"
                    style={{
                      background: isSelected ? 'var(--accent)' : 'var(--bg-secondary)',
                      borderColor: isSelected ? 'var(--accent)' : 'var(--border)',
                      boxShadow: isSelected ? '0 0 15px var(--glow-strong)' : 'none'
                    }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <span
                      style={{
                        color: isSelected ? 'var(--bg-primary)' : 'var(--text-secondary)',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}
                    >
                      {item.id === 'schooling' ? 'Sch' : `Yr ${item.id.replace('year', '')}`}
                    </span>
                  </motion.div>

                  {/* Period label */}
                  <span
                    className="font-mono text-[10px] tracking-wider transition-colors duration-200"
                    style={{ color: isSelected ? 'var(--accent)' : 'var(--text-muted)' }}
                  >
                    {item.period}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Selected Roadmap Card Detail with Framer Motion slide transition */}
        <AnimatePresence mode="wait">
          {activeItem && activeStory && (
            <motion.div
              key={activeId}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="p-8 rounded-lg grid md:grid-cols-5 gap-8 text-left relative overflow-hidden"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)'
              }}
            >
              {/* Outer ambient glow */}
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse 50% 50% at 5% 5%, rgba(230,199,156,0.04) 0%, transparent 80%)'
                }}
              />

              {/* Story Details (60% width equivalent) */}
              <div className="md:col-span-3 space-y-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded flex items-center justify-center"
                    style={{ background: 'var(--accent-muted)', border: '1px solid var(--border)' }}
                  >
                    <Icon size={18} style={{ color: 'var(--accent)' }} />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
                      {activeItem.institution}
                    </h3>
                    <p className="font-mono text-xs" style={{ color: 'var(--accent-dim)' }}>
                      {activeItem.degree}
                    </p>
                  </div>
                </div>

                <p className="font-mono text-[11px]" style={{ color: 'var(--accent)' }}>
                  {'// REFLECTION STORY'}
                </p>

                <p className="font-sans text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {activeStory.story}
                </p>
              </div>

              {/* Stats & Unlocks (40% width equivalent) */}
              <div className="md:col-span-2 space-y-6 relative z-10 border-t md:border-t-0 md:border-l pt-6 md:pt-0 md:pl-8" style={{ borderColor: 'var(--border)' }}>
                {/* Score panel */}
                <div className="p-4 rounded" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
                  <p className="font-mono text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                    {activeItem.scoreLabel}
                  </p>
                  <p className="font-display font-bold text-xl" style={{ color: 'var(--accent)' }}>
                    {activeItem.score}
                  </p>
                  <p className="font-sans text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    Location: {activeItem.location}
                  </p>
                </div>

                {/* Tech Unlocks */}
                <div className="space-y-3">
                  <p className="font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    {'// Skills & Milestones Unlocked'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Unlocks.map((unlock) => (
                      <span
                        key={unlock}
                        className="font-mono text-[10px] px-2.5 py-1 rounded-full"
                        style={{
                          background: 'rgba(230,199,156,0.06)',
                          color: 'var(--accent)',
                          border: '1px solid var(--border)'
                        }}
                      >
                        {unlock}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

export default Education
