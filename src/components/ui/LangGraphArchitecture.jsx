/**
 * LangGraphArchitecture.jsx
 * Interactive visual representation of the Transformer Intelligence Desk Agentic RAG loop.
 * Renders graph nodes and conditional branches.
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NODES = [
  {
    id: 'query',
    title: '1. User Query Node',
    role: 'Graph Input Trigger',
    description: 'Entry point of the graph. Normalizes strings and feeds context to the Agent Router. MemorySaver attaches historic message history.'
  },
  {
    id: 'router',
    title: '2. Conditional Router Node',
    role: 'LangGraph Edge Logic',
    description: 'Evaluates intent. If question requires math formulas (like parameters or attention head computations), routes to Python Sandbox. If conceptual, routes to Vector Database. Otherwise, answers directly from memory.'
  },
  {
    id: 'chromadb',
    title: '3a. Vector Store Retrieval',
    role: 'ChromaDB + Multi-Query RAG',
    description: 'Generates 3 rephrased versions of the query to overcome search wording variances, queries ChromaDB in parallel, then merges results through Reciprocal Rank Fusion.'
  },
  {
    id: 'sandbox',
    title: '3b. Python Sandbox Exec',
    role: 'Safe Mathematics Sandbox',
    description: 'Intercepts math operations. Executes formula calculations in a safe, restricted Python environment. Prevents LLM hallucinations on numeric outputs.'
  },
  {
    id: 'judge',
    title: '4. LLM-as-a-Judge Node',
    role: 'Self-Correction Gate',
    description: 'LLM grades the generated response. It scores the output from 0 to 1 based on FAITHFULNESS to retrieved documents. If score < 0.7, loop edges trigger self-correction retry with a tighter prompt.'
  },
  {
    id: 'output',
    title: '5. Response Delivery',
    role: 'System Output Node',
    description: 'Returns the verified response to the client chat window. Stores the current state in conversation memory.'
  }
]

const LangGraphArchitecture = () => {
  const [activeNode, setActiveNode] = useState(null)

  return (
    <div className="w-full p-6 rounded-lg border font-mono text-xs text-left" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
      <p className="font-mono text-xs tracking-widest mb-6 uppercase text-[var(--accent)]">
        {'// Interactive Agent Node Traversal'}
      </p>

      {/* Nodes visual layout */}
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
            <p className="text-[11px] mb-2" style={{ color: 'var(--accent)' }}>{node.role}</p>
            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Click to see edge paths →</p>
          </div>
        ))}
      </div>

      {/* Detail reveal */}
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
              {NODES.find((n) => n.id === activeNode)?.title} Action:
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

export default LangGraphArchitecture
