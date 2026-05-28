/**
 * About.jsx — Refreshed with updated copy and "currently obsessing over" pill strip.
 */

import { motion } from 'framer-motion'
import AnimatedCounter from '../ui/AnimatedCounter'
import ScrollReveal from '../ui/ScrollReveal'
import { aboutData } from '../../data/about'
import dsaStats from '../../data/dsa_stats.json'

const totalSolved = dsaStats.leetcode.solved + dsaStats.gfg.solved

const STATS = [
  { target: totalSolved, suffix: '+', label: 'Problems Solved' },
  { target: 233, suffix: '', label: 'API Endpoints Built' },
  { target: 30, suffix: '+', label: 'MongoDB Collections' },
  { target: 5, suffix: '', label: 'Developers Led' },
]

const pillVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const pillItem = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
}

const About = () => (
  <section
    id="about"
    className="section-padding"
    style={{ background: 'var(--bg-secondary)' }}
    aria-label="About Aditya Roy"
  >
    <div className="container-main">
      {/* Section mono label */}
      <ScrollReveal>
        <p className="font-mono text-xs tracking-widest mb-16" style={{ color: 'var(--accent-dim)' }}>
          {'// 02 — About'}
        </p>
      </ScrollReveal>

      <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-start mb-16">
        {/* LEFT — Large stylised quote */}
        <ScrollReveal direction="left">
          <blockquote>
            <p
              className="font-display italic leading-tight"
              style={{
                fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                color: 'var(--text-primary)',
                lineHeight: 1.35,
              }}
            >
              {aboutData.quote}
            </p>

            <motion.div
              className="mt-8"
              style={{ width: '3rem', height: '2px', background: 'var(--accent)' }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            />
          </blockquote>
        </ScrollReveal>

        {/* RIGHT — Stats grid */}
        <div>
          <ScrollReveal direction="right" delay={0.1}>
            <div className="grid grid-cols-2 gap-6">
              {STATS.map(({ target, suffix, label }) => (
                <div
                  key={label}
                  className="p-5 rounded-lg"
                  style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}
                >
                  <div
                    className="font-display font-bold mb-1"
                    style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: 'var(--accent)' }}
                  >
                    <AnimatedCounter target={target} suffix={suffix} />
                  </div>
                  <p className="font-mono text-xs tracking-wide" style={{ color: 'var(--text-muted)' }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* FULL WIDTH — Bio + currently strip */}
      <div className="max-w-4xl">
        {/* Updated bio */}
        <ScrollReveal delay={0.2}>
          <p className="font-sans leading-relaxed mb-8" style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            {aboutData.body}
          </p>
        </ScrollReveal>

        {/* Currently obsessing over strip */}
        <ScrollReveal delay={0.3}>
          <div>
            <p className="font-mono text-xs tracking-widest mb-3" style={{ color: 'var(--accent-dim)' }}>
              {aboutData.currentlyLabel}
            </p>
            <motion.div
              className="flex flex-wrap gap-2"
              variants={pillVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {aboutData.currently.map((item) => (
                <motion.span
                  key={item}
                  variants={pillItem}
                  className="font-mono text-xs px-3 py-1 rounded-full"
                  style={{
                    border: '1px solid var(--border-hover)',
                    color: 'var(--accent)',
                    background: 'var(--accent-muted)',
                  }}
                >
                  {item}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  </section>
)

export default About
