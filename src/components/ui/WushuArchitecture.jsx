/**
 * WushuArchitecture.jsx
 * Interactive SVG/CSS flowchart illustrating Wushu-MIS SaaS Architecture.
 * Clicking nodes displays detailed technical explanations.
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NODES = [
  {
    id: 'client',
    title: 'Client Layer',
    tech: 'React / Zustand / SSE Client',
    description: 'React SPA using state machines (Zustand) to manage UI state and connecting to Server-Sent Events (SSE) for real-time alerts. Public and multi-role admin views.'
  },
  {
    id: 'auth',
    title: 'Security Router',
    tech: 'httpOnly JWT Cookie + ROT',
    description: 'Stateless JWT auth with automatic refresh token rotation. Access token in memory, refresh token stored securely in httpOnly cookies with csrf validation.'
  },
  {
    id: 'rbac',
    title: 'Dynamic RBAC Guard',
    tech: 'Database-Driven Roles',
    description: 'Instead of hardcoded roles, permissions are defined dynamically in MongoDB. Guards check jurisdictional scopes (e.g. National admins can view all, District only their own).'
  },
  {
    id: 'express',
    title: '233-Endpoint API',
    tech: 'Node.js / Express / Event Scope',
    description: 'Express REST controllers scoped around championship events. Aggressive schema validations using custom middleware to prevent race conditions during submissions.'
  },
  {
    id: 'sse',
    title: 'Real-time SSE Loop',
    tech: 'Server-Sent Events',
    description: 'Lightweight unidirectional pipeline that pushes immediate alerts to athletes and managers on approval status changes, avoiding heavy WebSockets overhead.'
  },
  {
    id: 'db',
    title: 'MongoDB Engine',
    tech: '30+ Collections / Indexes',
    description: 'Aggregated relational-style schemas with index optimizations. Denormalization used strategically on athlete rosters to speed up high-concurrency championship reads.'
  }
]

const WushuArchitecture = () => {
  const [activeNode, setActiveNode] = useState(null)

  return (
    <div className="w-full p-6 rounded-lg border font-mono text-xs text-left" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
      <p className="font-mono text-xs tracking-widest mb-6 uppercase text-[var(--accent)]">
        {'// Interactive System Architecture Diagram'}
      </p>

      {/* Grid Nodes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 relative z-10">
        {NODES.map((node) => (
          <div
            key={node.id}
            onClick={() => setActiveNode(activeNode === node.id ? null : node.id)}
            className="p-4 rounded border cursor-pointer select-none transition-all duration-300 relative group"
            style={{
              background: activeNode === node.id ? 'var(--accent-muted)' : 'var(--bg-tertiary)',
              borderColor: activeNode === node.id ? 'var(--accent)' : 'var(--border)',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{node.title}</span>
              <span className="text-[10px]" style={{ color: 'var(--accent-dim)' }}>●</span>
            </div>
            <p className="text-[11px] mb-2" style={{ color: 'var(--accent)' }}>{node.tech}</p>
            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Click for details →</p>
          </div>
        ))}
      </div>

      {/* Connection info */}
      <AnimatePresence mode="wait">
        {activeNode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-6 p-4 rounded border"
            style={{ background: 'var(--bg-tertiary)', borderColor: 'var(--accent-dim)' }}
          >
            <p className="font-bold mb-1" style={{ color: 'var(--accent)' }}>
              {NODES.find((n) => n.id === activeNode)?.title} Details:
            </p>
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {NODES.find((n) => n.id === activeNode)?.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default WushuArchitecture
