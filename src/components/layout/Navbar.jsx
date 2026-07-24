/**
 * Navbar.jsx
 * Re-engineered Navbar styled as a Floating Glassmorphic Capsule.
 * Features:
 *  - Floating pill design centered at top with theme-aware backdrop blur.
 *  - Consolidated links (home, workspace, about, projects, contact).
 *  - Router integration to automatically support cross-page navigation between Home and ProjectDetail.
 *  - Precise client-side scroll position spy for perfect navigation highlights.
 *  - Framer Motion sliding pill indicator restricted to navigation text borders.
 *  - Compact logo: aditya@roy:~$ and execution action: [ ⏵ resume.exe ]
 */

import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-scroll'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenu, HiX } from 'react-icons/hi'
import { useLocation, useNavigate } from 'react-router-dom'

const NAV_LINKS = [
  { id: 'hero', label: 'home' },
  { id: 'workspace', label: 'workspace' },
  { id: 'about', label: 'about' },
  { id: 'projects', label: 'projects' },
  { id: 'contact', label: 'contact' },
]

// Observes all section IDs to accurately track scroll depth
const OBSERVED_IDS = [
  'hero',
  'workspace',
  'about',
  'skills',
  'education',
  'specs',
  'projects',
  'achievements',
  'hackathons',
  'contact',
]

// Maps scroll section IDs to main navigation items
const ACTIVE_MAP = {
  hero: 'hero',
  workspace: 'workspace',
  about: 'about',
  skills: 'about',
  education: 'about',
  specs: 'about',
  projects: 'projects',
  achievements: 'projects',
  hackathons: 'projects',
  contact: 'contact',
}

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [hoveredTab, setHoveredTab] = useState(null)
  const [activeSection, setActiveSection] = useState('hero')

  const location = useLocation()
  const navigate = useNavigate()
  const isHomePage = location.pathname === '/'

  // Smooth scroll height tracking & active navigation detection
  useEffect(() => {
    if (!isHomePage) {
      setActiveSection('')
      return
    }

    const handleScrollActive = () => {
      // 1. Scroll check for header transparency/shadow
      setScrolled(window.scrollY > 40)

      // 2. Page bottom check to highlight 'contact' immediately
      const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60
      if (isBottom) {
        setActiveSection('contact')
        return
      }

      // 3. Find active section based on scroll offset
      const scrollPosition = window.scrollY + 140 // height offset of nav bar + buffer

      for (let i = OBSERVED_IDS.length - 1; i >= 0; i--) {
        const id = OBSERVED_IDS[i]
        const el = document.getElementById(id)
        if (el) {
          const top = el.offsetTop
          if (scrollPosition >= top) {
            setActiveSection(ACTIVE_MAP[id] || 'hero')
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScrollActive, { passive: true })
    handleScrollActive() // Run on mount to check initial position

    return () => window.removeEventListener('scroll', handleScrollActive)
  }, [isHomePage])

  // Handle cross-page scrolling from subpages back to homepage
  useEffect(() => {
    if (isHomePage) {
      const pendingScroll = sessionStorage.getItem('scrollToSection')
      if (pendingScroll) {
        sessionStorage.removeItem('scrollToSection')
        // Give the page a frame to render before scrolling
        setTimeout(() => {
          const el = document.getElementById(pendingScroll)
          if (el) {
            const offsetPosition = el.offsetTop - 90
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth',
            })
          }
        }, 100)
      }
    }
  }, [isHomePage])

  const handleNavClick = (id) => {
    sessionStorage.setItem('scrollToSection', id)
    navigate('/')
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <header role="banner" className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <div className="w-full max-w-5xl relative pointer-events-auto">
        {/* Navigation Capsule Bar */}
        <nav
          role="navigation"
          aria-label="Primary navigation"
          className="flex items-center justify-between h-14 px-6 rounded-full border transition-all duration-300 select-none shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]"
          style={{
            background: 'color-mix(in srgb, var(--bg-secondary) 65%, transparent)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderColor: scrolled ? 'var(--accent-muted)' : 'var(--border)',
            boxShadow: scrolled ? '0 8px 32px var(--glow)' : '0 8px 32px rgba(0,0,0,0.3)',
          }}
        >
          {/* Logo / Console Shell prompt */}
          {isHomePage ? (
            <Link to="hero" smooth duration={600} aria-label="Go to top" className="cursor-pointer">
              <motion.span
                className="font-mono font-bold tracking-tight inline-block"
                style={{ fontSize: '14px', color: 'var(--accent)' }}
                whileHover={{ scale: 1.03, textShadow: '0 0 8px var(--glow-strong)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                aditya@roy:~$
              </motion.span>
            </Link>
          ) : (
            <a
              href="/#"
              aria-label="Go to home"
              className="cursor-pointer"
              onClick={(e) => {
                e.preventDefault()
                handleNavClick('hero')
              }}
            >
              <motion.span
                className="font-mono font-bold tracking-tight inline-block"
                style={{ fontSize: '14px', color: 'var(--accent)' }}
                whileHover={{ scale: 1.03, textShadow: '0 0 8px var(--glow-strong)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                aditya@roy:~$
              </motion.span>
            </a>
          )}

          {/* Desktop Navigation Links */}
          <ul className="hidden md:flex items-center gap-1 list-none h-full relative">
            {NAV_LINKS.map(({ id, label }) => {
              const isActive = activeSection === id
              const isHovered = hoveredTab === id

              const linkProps = {
                className:
                  'font-mono text-xs cursor-pointer px-4 py-2 rounded-full relative z-10 transition-colors duration-200',
                style: {
                  color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                  fontWeight: isActive ? '600' : '400',
                },
                onMouseEnter: () => setHoveredTab(id),
                onMouseLeave: () => setHoveredTab(null),
              }

              const content = (
                <>
                  <span className="relative z-10">{label}</span>

                  {/* Active sliding background pill */}
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-indicator"
                      className="absolute inset-0 rounded-full border -z-10"
                      style={{
                        background: 'var(--accent-muted)',
                        borderColor: 'var(--accent-dim)',
                        boxShadow: '0 0 10px var(--glow)',
                      }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}

                  {/* Hover visual highlight */}
                  {isHovered && !isActive && (
                    <motion.div
                      layoutId="hover-nav-indicator"
                      className="absolute inset-0 rounded-full bg-white/[0.03] -z-10"
                      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    />
                  )}
                </>
              )

              return (
                <li key={id} className="relative h-full flex items-center">
                  {isHomePage ? (
                    <Link to={id} smooth duration={600} offset={-90} aria-label={`Navigate to ${label}`} {...linkProps}>
                      {content}
                    </Link>
                  ) : (
                    <a
                      href={`/#${id}`}
                      aria-label={`Navigate to ${label}`}
                      onClick={(e) => {
                        e.preventDefault()
                        handleNavClick(id)
                      }}
                      {...linkProps}
                    >
                      {content}
                    </a>
                  )}
                </li>
              )
            })}
          </ul>

          {/* Right actions: Resume button & Mobile toggle */}
          <div className="flex items-center gap-3">
            <a
              href="https://drive.google.com/file/d/1UFxwzOoNIdG2dFcES7AW_zCWAjXxaa9F/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View Aditya Roy's resume"
              className="hidden sm:inline-flex rounded-full font-mono text-[10px] items-center cursor-pointer border transition-all duration-200"
              style={{
                padding: '0.45rem 1.1rem',
                borderColor: 'var(--border)',
                background: 'color-mix(in srgb, var(--bg-tertiary) 40%, transparent)',
                color: 'var(--accent)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent)'
                e.currentTarget.style.background = 'var(--accent-muted)'
                e.currentTarget.style.boxShadow = '0 0 12px var(--glow)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.background = 'color-mix(in srgb, var(--bg-tertiary) 40%, transparent)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              [ ⏵ resume.exe ]
            </a>

            <button
              className="md:hidden p-2 rounded-full cursor-pointer flex items-center justify-center transition-colors duration-200"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              style={{
                background: menuOpen ? 'var(--accent-muted)' : 'transparent',
              }}
            >
              {menuOpen ? (
                <HiX size={18} style={{ color: 'var(--accent)' }} />
              ) : (
                <HiMenu size={18} style={{ color: 'var(--text-secondary)' }} />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Panel */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              key="mobile-dropdown"
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute top-16 left-0 right-0 p-5 rounded-3xl border shadow-2xl flex flex-col gap-4"
              style={{
                background: 'color-mix(in srgb, var(--bg-secondary) 85%, transparent)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderColor: 'var(--border)',
              }}
            >
              <ul className="flex flex-col gap-2 list-none text-left">
                {NAV_LINKS.map(({ id, label }) => {
                  const isActive = activeSection === id
                  const linkProps = {
                    className:
                      'font-mono text-sm cursor-pointer block px-4 py-2.5 rounded-xl transition-all duration-200',
                    style: {
                      color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                      background: isActive ? 'var(--accent-muted)' : 'transparent',
                      fontWeight: isActive ? '600' : '400',
                    },
                  }

                  return (
                    <li key={id}>
                      {isHomePage ? (
                        <Link to={id} smooth duration={600} offset={-90} onClick={closeMenu} {...linkProps}>
                          {label}
                        </Link>
                      ) : (
                        <a
                          href={`/#${id}`}
                          onClick={(e) => {
                            e.preventDefault()
                            closeMenu()
                            handleNavClick(id)
                          }}
                          {...linkProps}
                        >
                          {label}
                        </a>
                      )}
                    </li>
                  )
                })}
              </ul>

              {/* Resume download action in mobile menu */}
              <div className="border-t pt-4" style={{ borderColor: 'var(--border)' }}>
                <a
                  href="https://drive.google.com/file/d/1UFxwzOoNIdG2dFcES7AW_zCWAjXxaa9F/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                  aria-label="View resume"
                  className="w-full py-3 rounded-xl font-mono text-xs flex items-center justify-center border transition-all duration-200"
                  style={{
                    borderColor: 'var(--accent)',
                    background: 'var(--accent-muted)',
                    color: 'var(--accent)',
                  }}
                >
                  [ ⏵ resume.exe ]
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

export default Navbar
