/**
 * Workspace.jsx
 * Full-width section wrapping the IdeWorkspace component.
 * Allows the IDE workspace to stretch and be fully readable and interactive.
 */

import ScrollReveal from '../ui/ScrollReveal'
import IdeWorkspace from '../ui/IdeWorkspace'

const Workspace = () => (
  <section
    id="workspace"
    className="section-padding"
    style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border)' }}
    aria-label="Interactive Developer Sandbox"
  >
    <div className="container-main">
      <ScrollReveal>
        <p className="font-mono text-xs tracking-widest mb-4 text-left" style={{ color: 'var(--accent-dim)' }}>
          {'// 01 — Interactive IDE Workspace'}
        </p>
        <h2
          className="font-display font-semibold mb-8 text-left"
          style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: 'var(--text-primary)' }}
        >
          Dev Console & Sandbox
        </h2>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <IdeWorkspace />
      </ScrollReveal>
    </div>
  </section>
)

export default Workspace
