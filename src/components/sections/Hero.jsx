/**
 * Hero.jsx
 * Full-viewport hero section with:
 *  - Two-column layout: text left, profile photo right
 *  - Animated role switcher using framer-motion AnimatePresence
 *  - Staggered entrance animation on all elements
 *  - Layered background with radial gradient and noise texture
 *  - CTA buttons and social icon row
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-scroll'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { SiLeetcode, SiGeeksforgeeks } from 'react-icons/si'
import { FiDownload, FiArrowRight } from 'react-icons/fi'

const ROLES = ['Full-Stack Developer', 'AI & Agentic Systems Builder', 'Problem Solver & DSA Enthusiast']

const SOCIALS = [
  { icon: FaGithub, href: 'https://github.com/Adityaroy000', label: 'GitHub' },
  { icon: FaLinkedin, href: 'https://www.linkedin.com/in/aditya-roy18/', label: 'LinkedIn' },
  { icon: SiLeetcode, href: 'https://leetcode.com/u/adityaroy18/', label: 'LeetCode' },
  { icon: SiGeeksforgeeks, href: 'https://www.geeksforgeeks.org/profile/royaditkqdh', label: 'GeeksForGeeks' },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

const Hero = () => {
  const [roleIndex, setRoleIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((i) => (i + 1) % ROLES.length)
    }, 2800)
    return () => clearInterval(interval)
  }, [])

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden noise-overlay"
      style={{ background: 'var(--bg-primary)' }}
      aria-label="Hero section"
    >
      {/* Background radial gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 75% 50%, rgba(15,47,47,0.7) 0%, transparent 70%)',
        }}
      />

      {/* Secondary glow top-left */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          top: '-10%',
          left: '-5%',
          width: '40%',
          height: '50%',
          background: 'radial-gradient(ellipse at center, rgba(230,199,156,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="container-main relative z-10 w-full py-28 md:py-0">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center min-h-screen md:min-h-0 md:py-32">
          {/* LEFT — Text content */}
          <motion.div className="flex flex-col" variants={containerVariants} initial="hidden" animate="visible">
            {/* Mono label */}
            <motion.p
              variants={itemVariants}
              className="font-mono text-sm tracking-widest mb-5"
              style={{ color: 'var(--accent)' }}
            >
              {'// Computer Science Engineer'}
            </motion.p>

            {/* Name */}
            <motion.h1
              variants={itemVariants}
              className="font-display font-bold leading-none mb-4"
              style={{
                fontSize: 'clamp(3.5rem, 8vw, 6.5rem)',
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
              }}
            >
              Aditya Roy
            </motion.h1>

            {/* Animated role switcher */}
            <motion.div
              variants={itemVariants}
              className="overflow-hidden mb-6"
              style={{ height: '2.2rem' }}
              aria-live="polite"
              aria-label={`Current role: ${ROLES[roleIndex]}`}
            >
              <AnimatePresence mode="wait">
                <motion.p
                  key={roleIndex}
                  className="font-sans font-medium"
                  style={{
                    fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                    color: 'var(--accent-dim)',
                  }}
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  exit={{ y: '-100%', opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  {ROLES[roleIndex]}
                </motion.p>
              </AnimatePresence>
            </motion.div>

            {/* Bio */}
            <motion.p
              variants={itemVariants}
              className="font-sans leading-relaxed mb-8 max-w-lg"
              style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}
            >
              I build real systems that solve real problems — from 233-endpoint APIs powering national sports
              championships to agentic AI pipelines that eliminate hallucinations. I don&apos;t just write code; I
              engineer solutions.
            </motion.p>

            {/* CTA buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-10">
              <Link to="projects" smooth duration={700} offset={-80}>
                <button className="btn-primary" aria-label="View my work">
                  View My Work <FiArrowRight size={15} />
                </button>
              </Link>
              <a href="/resume.pdf" download className="btn-ghost" aria-label="Download resume PDF">
                <FiDownload size={15} /> Download Resume
              </a>
            </motion.div>

            {/* Social icons */}
            <motion.div variants={itemVariants} className="flex items-center gap-5">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="transition-colors duration-200"
                  style={{ color: 'var(--text-muted)' }}
                  whileHover={{ color: 'var(--accent)', scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT — Profile photo frame */}
          <motion.div
            className="hidden md:flex items-center justify-center relative"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Outer ambient glow ring */}
            <div
              aria-hidden="true"
              className="absolute rounded-full"
              style={{
                width: '110%',
                height: '110%',
                background: 'radial-gradient(ellipse at center, rgba(230,199,156,0.07) 0%, transparent 65%)',
              }}
            />

            {/* Photo frame — geometric clip-path octagon */}
            <div
              className="relative flex items-center justify-center"
              style={{
                width: 'clamp(260px, 35vw, 420px)',
                height: 'clamp(260px, 35vw, 420px)',
                clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
                background: 'var(--bg-secondary)',
                border: '2px solid rgba(230,199,156,0.3)',
              }}
            >
              {/* Profile image — with AR initials fallback */}
              <img
                src="/profile.jpg"
                alt="Aditya Roy — Full-Stack Developer and AI Builder"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.nextSibling.style.display = 'flex'
                }}
                loading="eager"
              />

              {/* Fallback initials */}
              <div
                className="absolute inset-0 flex-col items-center justify-center"
                style={{ display: 'none' }}
                aria-label="Aditya Roy initials placeholder"
              >
                <span
                  className="font-display font-bold"
                  style={{ fontSize: 'clamp(4rem, 10vw, 7rem)', color: 'var(--accent)', opacity: 0.7 }}
                >
                  AR
                </span>
              </div>
            </div>

            {/* Decorative gold corner accent */}
            <motion.div
              aria-hidden="true"
              className="absolute"
              style={{
                bottom: '8%',
                right: '2%',
                width: 60,
                height: 60,
                border: '2px solid var(--accent)',
                opacity: 0.3,
                borderRadius: '0.25rem',
                transform: 'rotate(45deg)',
              }}
              animate={{ rotate: [45, 50, 45], opacity: [0.3, 0.45, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        aria-hidden="true"
      >
        <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
          scroll
        </span>
        <motion.div
          className="w-px"
          style={{ height: 40, background: 'linear-gradient(to bottom, var(--accent), transparent)' }}
          animate={{ scaleY: [0, 1], originY: 0 }}
          transition={{ duration: 1.2, delay: 1.6, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1 }}
        />
      </motion.div>
    </section>
  )
}

export default Hero
