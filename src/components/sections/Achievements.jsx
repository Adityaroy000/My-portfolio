/**
 * Achievements.jsx
 * Two featured achievement cards + a coding stats strip.
 * Icons are rendered inline using react-icons.
 */

import { motion } from 'framer-motion'
import { FiAward, FiBookOpen, FiExternalLink } from 'react-icons/fi'
import { HiOutlineAcademicCap } from 'react-icons/hi'
import SectionTitle from '../ui/SectionTitle'
import AnimatedCounter from '../ui/AnimatedCounter'
import ScrollReveal from '../ui/ScrollReveal'
import { achievements, codingStats } from '../../data/achievements'

const iconMap = {
  graduation: HiOutlineAcademicCap,
  trophy: FiAward,
  book: FiBookOpen,
}

const Achievements = () => (
  <section
    id="achievements"
    className="section-padding"
    style={{ background: 'var(--bg-primary)' }}
    aria-label="Achievements and recognition"
  >
    <div className="container-main">
      <SectionTitle number="05" title="Achievements" />

      {/* Featured achievement cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {achievements.map((item, index) => {
          const Icon = iconMap[item.icon] || FiAward
          return (
            <motion.article
              key={item.id}
              className="p-8 rounded-lg relative overflow-hidden"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
              }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{
                borderColor: 'var(--border-hover)',
                boxShadow: '0 8px 40px var(--glow)',
              }}
            >
              {/* Decorative background glow */}
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse 60% 50% at 10% 10%, rgba(230,199,156,0.05) 0%, transparent 70%)',
                }}
              />

              {/* Icon */}
              <div
                className="inline-flex items-center justify-center rounded-lg mb-5"
                style={{
                  width: 48,
                  height: 48,
                  background: 'var(--accent-muted)',
                  border: '1px solid var(--border)',
                }}
              >
                <Icon size={22} style={{ color: 'var(--accent)' }} aria-hidden="true" />
              </div>

              {/* Title */}
              <h3
                className="font-display font-semibold mb-1 leading-tight"
                style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)', color: 'var(--text-primary)' }}
              >
                {item.title}
              </h3>

              {/* Subtitle */}
              <p className="font-mono text-xs tracking-wide mb-4" style={{ color: 'var(--accent-dim)' }}>
                {item.subtitle}
              </p>

              {/* Description */}
              <p
                className="font-sans leading-relaxed mb-6"
                style={{ color: 'var(--text-secondary)', fontSize: '0.93rem' }}
              >
                {item.description}
              </p>

              {/* Credential link */}
              {item.credential && (
                <a
                  href={item.credential}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View credential for ${item.title}`}
                  className="pill inline-flex items-center gap-2"
                  style={{ border: '1px solid var(--border-hover)', color: 'var(--accent)' }}
                >
                  <FiExternalLink size={12} />
                  View Credential
                </a>
              )}
            </motion.article>
          )
        })}
      </div>

      {/* Coding stats strip */}
      <ScrollReveal delay={0.3}>
        <div
          className="rounded-lg p-6 flex flex-col sm:flex-row items-center justify-around gap-6"
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
          }}
        >
          {codingStats.map(({ label, value, suffix }, i) => (
            <div key={label} className="flex flex-col items-center text-center">
              <span
                className="font-display font-bold"
                style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: 'var(--accent)' }}
              >
                <AnimatedCounter target={value} suffix={suffix} duration={1800} />
              </span>
              <span className="font-mono text-xs tracking-widest mt-1" style={{ color: 'var(--text-muted)' }}>
                {label}
              </span>
              {/* Vertical divider between stats */}
              {i < codingStats.length - 1 && (
                <div
                  aria-hidden="true"
                  className="hidden sm:block absolute"
                  style={{ width: 1, height: 40, background: 'var(--border)' }}
                />
              )}
            </div>
          ))}
        </div>
      </ScrollReveal>
    </div>
  </section>
)

export default Achievements
