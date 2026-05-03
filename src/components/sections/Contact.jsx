/**
 * Contact.jsx
 * Centered minimal contact section — no form.
 * Headline, email block, social card grid.
 */

import { motion } from 'framer-motion'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { SiLeetcode, SiGeeksforgeeks } from 'react-icons/si'
import { FiMail } from 'react-icons/fi'
import ScrollReveal from '../ui/ScrollReveal'

const SOCIALS = [
  {
    icon: FaGithub,
    label: 'GitHub',
    href: 'https://github.com/Adityaroy000',
    handle: '@Adityaroy000',
  },
  {
    icon: FaLinkedin,
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/aditya-roy18/',
    handle: 'aditya-roy18',
  },
  {
    icon: SiLeetcode,
    label: 'LeetCode',
    href: 'https://leetcode.com/u/adityaroy18/',
    handle: 'adityaroy18',
  },
  {
    icon: SiGeeksforgeeks,
    label: 'GeeksForGeeks',
    href: 'https://www.geeksforgeeks.org/profile/royaditkqdh',
    handle: 'royaditkqdh',
  },
]

const Contact = () => (
  <section
    id="contact"
    className="section-padding"
    style={{ background: 'var(--bg-secondary)' }}
    aria-label="Contact Aditya Roy"
  >
    <div className="container-main max-w-3xl mx-auto text-center">
      {/* Mono label */}
      <ScrollReveal>
        <p className="font-mono text-xs tracking-widest mb-6" style={{ color: 'var(--accent-dim)' }}>
          {'// 09 — Contact'}
        </p>
      </ScrollReveal>

      {/* Headline */}
      <ScrollReveal delay={0.1}>
        <h2
          className="font-display font-semibold mb-5"
          style={{
            fontSize: 'clamp(2.5rem, 7vw, 5rem)',
            color: 'var(--accent)',
            lineHeight: 1.1,
          }}
        >
          Let&apos;s build something.
        </h2>
      </ScrollReveal>

      {/* Sub */}
      <ScrollReveal delay={0.2}>
        <p className="font-sans mb-10 mx-auto max-w-md" style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
          Open to internships, collaborations, and interesting problems. Best way to reach me:
        </p>
      </ScrollReveal>

      {/* Email block */}
      <ScrollReveal delay={0.3}>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-14">
          <motion.a
            href="mailto:adityaroyofficial20@gmail.com"
            aria-label="Send email to Aditya Roy"
            className="inline-flex items-center gap-3 font-display"
            style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
              color: 'var(--text-primary)',
              padding: '0.85rem 1.75rem',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border)',
              borderRadius: '0.5rem',
            }}
            whileHover={{
              borderColor: 'var(--border-hover)',
              boxShadow: '0 4px 24px var(--glow)',
              color: 'var(--accent)',
            }}
          >
            <FiMail size={20} style={{ color: 'var(--accent)', flexShrink: 0 }} />
            adityaroyofficial20@gmail.com
          </motion.a>
        </div>
      </ScrollReveal>

      {/* Social cards grid */}
      <ScrollReveal delay={0.4}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {SOCIALS.map(({ icon: Icon, label, href, handle }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit Aditya Roy on ${label}`}
              className="flex flex-col items-center gap-3 p-5 rounded-lg"
              style={{
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border)',
              }}
              whileHover={{
                borderColor: 'var(--border-hover)',
                boxShadow: '0 4px 20px var(--glow)',
                y: -4,
              }}
              transition={{ duration: 0.25 }}
            >
              <Icon size={22} style={{ color: 'var(--accent)' }} aria-hidden="true" />
              <div className="text-center">
                <p className="font-sans text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                  {label}
                </p>
                <p className="font-mono text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {handle}
                </p>
              </div>
            </motion.a>
          ))}
        </div>
      </ScrollReveal>
    </div>
  </section>
)

export default Contact
