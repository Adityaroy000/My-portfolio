/**
 * Skills.jsx
 * Upgraded Skills & Arsenal section featuring a Two-Column Interactive Dashboard.
 * Left: Staggered Skill Cards that highlight on hover/tap.
 * Right: A custom, floating SVG Radar Specs Chart (Developer Attribute Matrix)
 *        that fluidly morphs its shape using Framer Motion path animations.
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import SectionTitle from '../ui/SectionTitle'
import SkillBadge from '../ui/SkillBadge'
import { skillCategories } from '../../data/skills'

const ANGLES = [
  -Math.PI / 2, // Top
  -Math.PI / 2 + (2 * Math.PI) / 5, // Right-Top
  -Math.PI / 2 + (4 * Math.PI) / 5, // Right-Bottom
  -Math.PI / 2 + (6 * Math.PI) / 5, // Left-Bottom
  -Math.PI / 2 + (8 * Math.PI) / 5  // Left-Top
]

const AXIS_LABELS = [
  'DSA_ALGO',
  'AI_AGENTS',
  'DB_MODEL',
  'SECURITY_RBAC',
  'API_DESIGN'
]

// Stats mapping for each category on the 5 axes
const MATRIX_MAP = {
  default: [0.85, 0.8, 0.85, 0.75, 0.9],
  languages: [0.98, 0.45, 0.4, 0.4, 0.5],
  backend: [0.65, 0.5, 0.8, 0.85, 0.98],
  frontend: [0.5, 0.45, 0.5, 0.6, 0.85],
  databases: [0.6, 0.6, 0.98, 0.75, 0.8],
  'ai-ml': [0.75, 0.98, 0.85, 0.5, 0.7],
  tools: [0.5, 0.6, 0.65, 0.95, 0.8],
  'cs-fundamentals': [0.92, 0.5, 0.8, 0.75, 0.7]
}

const getPathData = (values) => {
  const points = values.map((val, i) => {
    const angle = ANGLES[i]
    const x = 150 + 100 * val * Math.cos(angle)
    const y = 150 + 100 * val * Math.sin(angle)
    return `${x},${y}`
  })
  return `M ${points[0]} L ${points[1]} L ${points[2]} L ${points[3]} L ${points[4]} Z`
}

const getLabelProps = (angle) => {
  const x = 150 + 120 * Math.cos(angle)
  const y = 150 + 120 * Math.sin(angle)
  
  let textAnchor = 'middle'
  if (Math.cos(angle) > 0.1) textAnchor = 'start'
  else if (Math.cos(angle) < -0.1) textAnchor = 'end'
  
  let dy = '0.35em'
  if (Math.sin(angle) < -0.8) dy = '-0.3em'
  else if (Math.sin(angle) > 0.8) dy = '1em'

  return { x, y, textAnchor, dy }
}

const Skills = () => {
  const [hoveredCategory, setHoveredCategory] = useState(null)
  
  const activeMatrix = MATRIX_MAP[hoveredCategory] || MATRIX_MAP.default
  const pathData = getPathData(activeMatrix)
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0]

  return (
    <section
      id="skills"
      className="section-padding"
      style={{ background: 'var(--bg-primary)' }}
      aria-label="Skills and technical arsenal"
    >
      <div className="container-main">
        <SectionTitle number="03" title="Skills & Arsenal" />

        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* LEFT — Skill Cards Grid */}
          <div className="col-span-12 lg:col-span-7 order-2 lg:order-1 grid sm:grid-cols-2 gap-4">
            {skillCategories.map((category, catIdx) => {
              const isHovered = hoveredCategory === category.id
              return (
                <motion.div
                  key={category.id}
                  className="p-5 rounded-xl border transition-all duration-300 cursor-pointer text-left"
                  style={{
                    background: isHovered
                      ? 'color-mix(in srgb, var(--accent-muted) 15%, var(--bg-secondary))'
                      : 'var(--bg-secondary)',
                    borderColor: isHovered ? 'var(--accent)' : 'var(--border)',
                    boxShadow: isHovered ? '0 8px 32px var(--glow)' : 'none',
                  }}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: catIdx * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  onMouseEnter={() => setHoveredCategory(category.id)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  onClick={() => setHoveredCategory(category.id === hoveredCategory ? null : category.id)}
                >
                  {/* Category Header */}
                  <p
                    className="font-mono text-xs tracking-widest uppercase mb-3 font-semibold transition-colors duration-200"
                    style={{ color: isHovered ? 'var(--accent)' : 'var(--accent-dim)' }}
                  >
                    {category.label}
                  </p>

                  {/* Skill Chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {category.skills.map((skill) => (
                      <SkillBadge key={skill} label={skill} size="sm" />
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* RIGHT — Interactive Radar Specs Chart */}
          <div className="col-span-12 lg:col-span-5 order-1 lg:order-2 flex flex-col items-center justify-center sticky top-24 py-6">
            <div 
              className="p-6 rounded-2xl border backdrop-blur-md relative shadow-2xl flex flex-col items-center"
              style={{
                background: 'color-mix(in srgb, var(--bg-secondary) 40%, transparent)',
                borderColor: 'var(--border)',
                width: '100%',
                maxWidth: '380px'
              }}
            >
              {/* Floating description label */}
              <div className="absolute top-4 left-5 right-5 flex justify-between items-center border-b pb-2 select-none" style={{ borderColor: 'var(--border)' }}>
                <span className="font-mono text-[10px] tracking-wider text-[var(--accent)]">
                  {hoveredCategory ? `spec::${hoveredCategory.replace('-', '_')}` : 'spec::composite_profile'}
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
              </div>

              {/* Chart SVG */}
              <svg 
                viewBox="0 0 300 320" 
                className="w-full h-auto mt-6"
                aria-label="Developer attribute radar specs chart"
              >
                {/* Concentric grid lines (pentagons) */}
                {gridLevels.map((level) => (
                  <polygon
                    key={level}
                    points={ANGLES.map(angle => `${150 + 100 * level * Math.cos(angle)},${150 + 100 * level * Math.sin(angle)}`).join(' ')}
                    fill="none"
                    stroke="var(--border)"
                    strokeWidth="0.75"
                    opacity={level === 1.0 ? 0.9 : 0.5}
                  />
                ))}

                {/* Outer vertex grid circles */}
                {ANGLES.map((angle, idx) => {
                  const x = 150 + 100 * Math.cos(angle)
                  const y = 150 + 100 * Math.sin(angle)
                  return (
                    <circle
                      key={idx}
                      cx={x}
                      cy={y}
                      r="2"
                      fill="var(--border)"
                      opacity="0.8"
                    />
                  )
                })}

                {/* Radial axes lines */}
                {ANGLES.map((angle, idx) => {
                  const x = 150 + 100 * Math.cos(angle)
                  const y = 150 + 100 * Math.sin(angle)
                  return (
                    <line
                      key={idx}
                      x1="150"
                      y1="150"
                      x2={x}
                      y2={y}
                      stroke="var(--border)"
                      strokeWidth="1"
                      strokeDasharray="2,4"
                      opacity="0.7"
                    />
                  )
                })}

                {/* Morphed active attribute polygon path */}
                <motion.path
                  animate={{ d: pathData }}
                  transition={{ type: 'spring', stiffness: 140, damping: 18 }}
                  fill="var(--accent-muted)"
                  stroke="var(--accent)"
                  strokeWidth="1.5"
                  style={{
                    filter: 'drop-shadow(0px 0px 6px var(--glow-strong))'
                  }}
                />

                {/* Interactive handles at active coordinate points */}
                {activeMatrix.map((val, i) => {
                  const angle = ANGLES[i]
                  const x = 150 + 100 * val * Math.cos(angle)
                  const y = 150 + 100 * val * Math.sin(angle)
                  return (
                    <motion.circle
                      key={i}
                      animate={{ cx: x, cy: y }}
                      transition={{ type: 'spring', stiffness: 140, damping: 18 }}
                      r="3.5"
                      fill="var(--bg-primary)"
                      stroke="var(--accent)"
                      strokeWidth="1.5"
                    />
                  )
                })}

                {/* Monospaced Labels */}
                {ANGLES.map((angle, idx) => {
                  const props = getLabelProps(angle)
                  return (
                    <text
                      key={idx}
                      x={props.x}
                      y={props.y}
                      textAnchor={props.textAnchor}
                      dy={props.dy}
                      className="font-mono text-[9px] font-semibold select-none transition-colors duration-200"
                      fill={hoveredCategory ? 'var(--text-muted)' : 'var(--text-secondary)'}
                      style={{
                        letterSpacing: '0.05em'
                      }}
                    >
                      {AXIS_LABELS[idx]}
                    </text>
                  )
                })}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Skills
