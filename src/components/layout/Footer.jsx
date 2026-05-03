/**
 * Footer.jsx
 * Minimal one-line footer with copyright and build info.
 */

import { memo } from 'react'

const Footer = memo(() => (
  <footer className="py-8 border-t" style={{ borderColor: 'var(--border)' }} role="contentinfo">
    <div className="container-main flex flex-col sm:flex-row items-center justify-between gap-2">
      <p className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
        Aditya Roy · Built with React
      </p>
      <p className="font-mono text-xs" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
        Crafted with intention.
      </p>
    </div>
  </footer>
))

Footer.displayName = 'Footer'

export default Footer
