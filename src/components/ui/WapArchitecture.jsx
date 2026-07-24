/**
 * WapArchitecture.jsx
 * Interactive SVG/CSS flowchart illustrating the Wushu Assessment Platform (WAP) Architecture.
 * Clicking nodes displays detailed technical explanations.
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NODES = [
  {
    id: 'intake',
    title: '1. Candidate Intake Gateway',
    tech: 'Phone Validation & Routing',
    description:
      'A zero-barrier onboarding portal. Evaluates candidates by phone numbers, validates single registration bounds in MongoDB, and routes them to their specific discipline (Sanda or Taolu) without traditional password barriers.',
  },
  {
    id: 'ingest',
    title: '2. Ingestion Parser Engine',
    tech: 'Mammoth.js + Regex Tokenizer',
    description:
      'Parses raw Microsoft Word (.docx) and Adobe PDF exam files. The backend extracts structural XML using Mammoth.js, runs a custom state-machine tokenizer to isolate options (A-D) and answers, and batch-saves polymorphic question schemas to MongoDB.',
  },
  {
    id: 'network',
    title: '3. Out-of-Order Write Guard',
    tech: 'Sequence-Numbered Autosaves',
    description:
      'Protects candidate response submissions from latency spikes on congested networks. The client attaches an incremental sequence number to every selection. The database rejects any update that carries a sequence number lower than the stored value.',
  },
  {
    id: 'deadline',
    title: '4. Server Deadline Guard',
    tech: 'NTP Comparison + Grace Window',
    description:
      'Blocks browser countdown clock manipulation. The frontend timer is purely visual; the server locks a database deadline (start time + duration) on exam start and validates all incoming saves against its NTP server time, adding a 15s transit lag grace period.',
  },
  {
    id: 'device',
    title: '5. Device Footprint Lock',
    tech: 'SHA-256 IP & UA Footprint',
    description:
      'Prevents credential sharing and concurrent double-logins. The server hashes the User-Agent and IP address on the intake gate. All subsequent exam calls must match this footprint; otherwise, the session is flagged and locked.',
  },
  {
    id: 'pdf',
    title: '6. Local PDF Compiler',
    tech: 'Offline PDFKit Layouts',
    description:
      'Compiles final exam results (auto-graded MCQs + administrator practical marks) into official landscape A4 reports. Generates documents locally via PDFKit, protecting sensitive participant data from external API exposures.',
  },
]

const WapArchitecture = () => {
  const [activeNode, setActiveNode] = useState(null)

  return (
    <div
      className="w-full p-6 rounded-lg border font-mono text-xs text-left"
      style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
    >
      <p className="font-mono text-xs tracking-widest mb-6 uppercase text-[var(--accent)]">
        {'// Interactive Platform Architecture'}
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
              <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                {node.title}
              </span>
              <span className="text-[10px]" style={{ color: 'var(--accent-dim)' }}>
                ●
              </span>
            </div>
            <p className="text-[11px] mb-2" style={{ color: 'var(--accent)' }}>
              {node.tech}
            </p>
            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
              Click to view details →
            </p>
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
              {NODES.find((n) => n.id === activeNode)?.title} details:
            </p>
            <p className="leading-relaxed font-sans text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
              {NODES.find((n) => n.id === activeNode)?.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default WapArchitecture
