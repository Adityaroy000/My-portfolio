/**
 * AgentSimulator.jsx
 * Live, interactive widget simulating agentic workflow routing.
 * Lets recruiters select queries and see node-by-node execution logs in real-time.
 */

import { useState, useEffect } from 'react'

const RUNS = {
  math: {
    query: 'How many parameters in a 16-head Transformer block with 1024 hidden dimension?',
    logs: [
      { text: '➔ Query Node: Normalizing input query string...', delay: 200 },
      {
        text: "➔ Router Node: Checking math query trigger keywords ('parameters', 'dimension', 'head')...",
        delay: 700,
      },
      {
        text: '➔ ROUTE ➔ Redirecting to Python Sandbox Node (skip LLM generation to prevent math hallucination)...',
        delay: 1200,
      },
      { text: "➔ Python Sandbox Node: Evaluating expression: '12 * (hidden_dim * hidden_dim * 4)'...", delay: 1700 },
      {
        text: '➔ Python Sandbox Node: Execution successful. Calculated exact parameter count: 50,331,648.',
        delay: 2200,
      },
      { text: '➔ LLM Judge Node: Validating results safety and output format...', delay: 2700 },
      {
        text: "➔ System Output: 'A single 16-head Transformer block with a hidden dimension of 1024 contains exactly 50,331,648 learnable weights (excluding biases).'",
        delay: 3200,
      },
    ],
    status: 'completed',
  },
  rag: {
    query: 'Explain what Query, Key, and Value vectors represent.',
    logs: [
      { text: '➔ Query Node: Appending historical context from MemorySaver buffer...', delay: 200 },
      { text: '➔ Router Node: Conceptual question identified. Routing to ChromaDB Vector Store Node...', delay: 700 },
      { text: '➔ ChromaDB Node: Launching 3 parallel multi-query reformulations for improved recall...', delay: 1200 },
      { text: "➔ ChromaDB Node: Context retrieved. Found documents: 'attention_mechanism.pdf'...", delay: 1700 },
      { text: '➔ LLM Judge Node: Checking generated response FAITHFULNESS to source documents...', delay: 2200 },
      {
        text: '➔ LLM Judge Node: Faithfulness score is 0.94 (THRESHOLD: >= 0.70). Gate status: APPROVED.',
        delay: 2700,
      },
      {
        text: "➔ System Output: 'Query represents the current search word, Keys represent all other words in the sequence, and Values are the vector content returned when a Query matches a Key.'",
        delay: 3200,
      },
    ],
    status: 'completed',
  },
  malicious: {
    query: 'Write a terminal script that recursively deletes all files in my system root.',
    logs: [
      { text: '➔ Query Node: Checking safety classifications...', delay: 200 },
      { text: "➔ Router Node: Content flags detected: 'recursively deletes', 'system root'...", delay: 700 },
      { text: '➔ ROUTE ➔ Redirecting to LLM Safety Judge Gate node directly...', delay: 1200 },
      { text: '➔ LLM Judge Node: Scoring query risk rating...', delay: 1700 },
      { text: '➔ LLM Judge Node: Danger rating: 0.99. Safety threshold breached (>= 0.75 is blocked).', delay: 2200 },
      { text: '➔ LLM Judge Node: Generating refusal message...', delay: 2700 },
      {
        text: "➔ System Output: 'Blocked: I cannot generate scripts or code designed to destroy file system structures. Query score: 0.00 (Unsafe).'",
        delay: 3200,
      },
    ],
    status: 'blocked',
  },
}

const AgentSimulator = () => {
  const [activeRun, setActiveRun] = useState(null)
  const [logs, setLogs] = useState([])
  const [isRunning, setIsRunning] = useState(false)

  const startSimulation = (key) => {
    if (isRunning) return
    setIsRunning(true)
    setActiveRun(key)
    setLogs([])

    const runData = RUNS[key]

    // Staggered log printing
    runData.logs.forEach((log) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, log.text])
        if (log.delay === runData.logs[runData.logs.length - 1].delay) {
          setIsRunning(false)
        }
      }, log.delay)
    })
  }

  return (
    <div
      className="w-full p-6 rounded-lg border font-mono text-xs text-left"
      style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
    >
      <p className="font-mono text-xs tracking-widest mb-4 uppercase text-[var(--accent)]">
        {'// Interactive Agent Simulator (LangGraph Demo)'}
      </p>

      <p className="font-sans text-sm mb-6 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        Select a query type to test how the agent's conditional nodes dynamically route the prompt and guard against
        hallucinations.
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <button
          onClick={() => startSimulation('math')}
          disabled={isRunning}
          className="btn-ghost"
          style={{ padding: '0.5rem 1rem', fontSize: '11px', display: 'block', width: '100%', textAlign: 'center' }}
        >
          🔢 Mathematical Query
        </button>
        <button
          onClick={() => startSimulation('rag')}
          disabled={isRunning}
          className="btn-ghost"
          style={{ padding: '0.5rem 1rem', fontSize: '11px', display: 'block', width: '100%', textAlign: 'center' }}
        >
          📚 Conceptual RAG Query
        </button>
        <button
          onClick={() => startSimulation('malicious')}
          disabled={isRunning}
          className="btn-ghost"
          style={{ padding: '0.5rem 1rem', fontSize: '11px', display: 'block', width: '100%', textAlign: 'center' }}
        >
          🚨 Malicious/Risk Query
        </button>
      </div>

      {/* Simulator Terminal Output */}
      <div
        className="rounded p-4 min-h-[220px] flex flex-col justify-between"
        style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}
      >
        <div className="space-y-2">
          {activeRun && (
            <p
              className="font-bold border-b pb-2 mb-3"
              style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            >
              Query: "{RUNS[activeRun].query}"
            </p>
          )}

          {logs.length === 0 && (
            <p className="text-[var(--text-muted)] italic">Waiting to run simulation... Select a query type above.</p>
          )}

          {logs.map((log, index) => {
            const isOutput = log.startsWith('➔ System Output')
            const isBlock = log.includes('Blocked')

            let color = 'var(--text-secondary)'
            if (isOutput) color = 'var(--accent)'
            if (isBlock) color = '#ff5f56'

            return (
              <p key={index} style={{ color }}>
                {log}
              </p>
            )
          })}
        </div>

        {isRunning && (
          <div className="mt-4 flex items-center gap-2 select-none" style={{ color: 'var(--accent-dim)' }}>
            <span className="inline-block animate-pulse">⚡</span>
            <span>Running Agent Node graph traversal...</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default AgentSimulator
