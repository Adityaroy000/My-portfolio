/**
 * Navbar.jsx
 * Fixed top navigation bar with:
 *  - AR monogram logo (Cormorant Garamond, gold)
 *  - Smooth-scroll nav links with active section highlighting
 *  - Resume download button
 *  - Mobile hamburger menu with slide-down drawer
 *  - Backdrop blur + shadow appear after 80px scroll
 */

import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-scroll'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenu, HiX } from 'react-icons/hi'
import useActiveSection from '../../hooks/useActiveSection'

const NAV_LINKS = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'contact', label: 'Contact' },
]

const SECTION_IDS = NAV_LINKS.map((l) => l.id)

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const activeSection = useActiveSection(SECTION_IDS)

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 80)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  /* Close drawer when nav link is clicked */
  const closeMenu = () => setMenuOpen(false)

  return (
    <header role="banner">
      <nav
        role="navigation"
        aria-label="Primary navigation"
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(10,26,26,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          boxShadow: scrolled ? '0 1px 0 var(--border)' : 'none',
        }}
      >
        <div className="container-main flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="hero" smooth duration={600} aria-label="Go to top" className="cursor-pointer">
            <span
              className="font-display font-bold tracking-tight"
              style={{ fontSize: '1.75rem', color: 'var(--accent)', lineHeight: 1 }}
            >
              AR
            </span>
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-8 list-none">
            {NAV_LINKS.map(({ id, label }) => (
              <li key={id}>
                <Link
                  to={id}
                  smooth
                  duration={600}
                  offset={-80}
                  aria-label={`Navigate to ${label}`}
                  className="font-sans text-sm cursor-pointer transition-colors duration-200"
                  style={{
                    color: activeSection === id ? 'var(--accent)' : 'var(--text-secondary)',
                    fontWeight: activeSection === id ? '500' : '400',
                  }}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right side — Resume + mobile hamburger */}
          <div className="flex items-center gap-4">
            <a
              href={`${import.meta.env.BASE_URL}resume.pdf`}
              download
              aria-label="Download Aditya Roy's resume"
              className="btn-ghost hidden md:inline-flex mt-1 rounded-full"
              style={{ padding: '0.30rem 1.1rem', fontSize: '0.78rem' }}
            >
              Resume
            </a>

            <button
              className="md:hidden p-1 rounded"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <HiX size={22} style={{ color: 'var(--accent)' }} />
              ) : (
                <HiMenu size={22} style={{ color: 'var(--text-secondary)' }} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              key="mobile-drawer"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{
                background: 'rgba(10,26,26,0.97)',
                borderTop: '1px solid var(--border)',
                overflow: 'hidden',
              }}
            >
              <ul className="container-main flex flex-col py-6 gap-5 list-none">
                {NAV_LINKS.map(({ id, label }) => (
                  <li key={id}>
                    <Link
                      to={id}
                      smooth
                      duration={600}
                      offset={-80}
                      onClick={closeMenu}
                      className="font-sans text-base cursor-pointer block"
                      style={{
                        color: activeSection === id ? 'var(--accent)' : 'var(--text-secondary)',
                      }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
                <li>
                  <a
                    href={`${import.meta.env.BASE_URL}resume.pdf`}
                    download
                    onClick={closeMenu}
                    aria-label="Download resume"
                    className="btn-ghost inline-flex mt-2"
                    style={{ padding: '0.5rem 1.25rem' }}
                  >
                    Download Resume
                  </a>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}

export default Navbar
