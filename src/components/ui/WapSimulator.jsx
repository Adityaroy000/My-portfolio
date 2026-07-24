/**
 * WapSimulator.jsx
 * Live, interactive widget simulating the Wushu Assessment Platform (WAP) security and ingestion engine.
 * Lets recruiters test server-authoritative safeguards in real-time.
 */

import { useState } from 'react'

const RUNS = {
  ingest: {
    title: 'Document Ingestion (.docx)',
    logs: [
      { text: "➔ Ingestion Triggered: Reading 'wushu_referee_exam_2026.docx' using Mammoth.js...", delay: 200 },
      { text: '➔ XML Parser: Extracted raw text blocks (64,284 characters).', delay: 700 },
      { text: '➔ Regex Tokenizer: Matching question titles, choices (A-D), and correct answers...', delay: 1200 },
      { text: '➔ Tokenizer Match: Isolated 42 MCQs, 12 True/False, and 8 Fill-in-the-blank questions.', delay: 1700 },
      { text: '➔ Database Service: Batch-inserting 62 polymorphic documents into MongoDB...', delay: 2200 },
      {
        text: "➔ System Output: Success! 62 exam questions generated and stored under Test ID: 'test_6a8e9' with indexed query fields.",
        delay: 2700,
      },
    ],
    status: 'completed',
  },
  network: {
    title: 'Laggy Out-of-Order Packet Check',
    logs: [
      { text: '➔ Client exam runner: Answer changed to Option B. Sending [Seq: 1, Answer: B]...', delay: 200 },
      { text: '➔ Venue Wi-Fi Warning: High packet latency. Packet [Seq: 1] delayed in transit...', delay: 700 },
      { text: '➔ Client exam runner: Candidate clicks Option A. Sending [Seq: 2, Answer: A]...', delay: 1200 },
      {
        text: '➔ Server Node: Received packet [Seq: 2, Answer: A] first. Saved in DB. Current stored Seq: 2.',
        delay: 1700,
      },
      { text: '➔ Server Node: Delayed packet [Seq: 1, Answer: B] arrives at the server.', delay: 2200 },
      { text: '➔ Out-of-Order Guard: Incoming Seq: 1 is less than stored database Seq: 2.', delay: 2700 },
      { text: '➔ Security Action: Stale packet rejected and dropped. Prevents overwriting newer answer.', delay: 3200 },
      {
        text: '➔ System Output: Packet [Seq: 1] dropped. Database state remains Option A. Stale write prevented.',
        delay: 3700,
      },
    ],
    status: 'completed',
  },
  tamper: {
    title: 'Clock Tampering Attack',
    logs: [
      { text: '➔ Client System Alert: Local browser clock altered (rewound by 30 minutes).', delay: 200 },
      { text: '➔ Autosave Triggered: Candidate submits answers...', delay: 700 },
      { text: '➔ Server Node: Comparing submission time with database-locked deadline...', delay: 1200 },
      { text: '➔ NTP Validator: Server clock time: 16:15:30Z. Database locked deadline: 15:45:00Z.', delay: 1700 },
      {
        text: '➔ Deadline Guard: Candidate is 30 minutes past deadline. Exceeded 15s transit lag grace period.',
        delay: 2200,
      },
      { text: '➔ Server Action: Refusing database write. Session marked as locked/expired.', delay: 2700 },
      { text: '➔ System Output: Blocked: Attempt rejected. Server-authoritative deadline check failed.', delay: 3200 },
    ],
    status: 'blocked',
  },
  login: {
    title: 'Double Login Detection',
    logs: [
      { text: '➔ Candidate Intake Gate: Shared WhatsApp exam link clicked on a second device.', delay: 200 },
      { text: '➔ Footprint Calculator: Collecting current HTTP headers (User-Agent, IP address)...', delay: 700 },
      { text: "➔ Hash Generator: Current parameters resolve to SHA-256 device footprint: '8a3b5c9...'", delay: 1200 },
      { text: "➔ Database check: Looking up active session footprint: '3e2f8d1...'", delay: 1700 },
      {
        text: '➔ Footprint Guard: Current footprint mismatch detected. Concurrent session request blocked.',
        delay: 2200,
      },
      {
        text: '➔ System Output: Blocked: Multi-device login detected. Credentials footprint lock violated.',
        delay: 2700,
      },
    ],
    status: 'blocked',
  },
}

const WapSimulator = () => {
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
        {'// Interactive WAP Engine Simulator'}
      </p>

      <p className="font-sans text-sm mb-6 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        Select a server-side routine to test how WAP handles unstructured ingestion and protects testing sessions
        against network drops and cheating attempts.
      </p>

      {/* Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <button
          onClick={() => startSimulation('ingest')}
          disabled={isRunning}
          className="btn-ghost"
          style={{ padding: '0.5rem 1rem', fontSize: '11px', textAlign: 'center' }}
        >
          📄 Document Ingestion
        </button>
        <button
          onClick={() => startSimulation('network')}
          disabled={isRunning}
          className="btn-ghost"
          style={{ padding: '0.5rem 1rem', fontSize: '11px', textAlign: 'center' }}
        >
          📶 Laggy Network
        </button>
        <button
          onClick={() => startSimulation('tamper')}
          disabled={isRunning}
          className="btn-ghost"
          style={{ padding: '0.5rem 1rem', fontSize: '11px', textAlign: 'center' }}
        >
          ⏰ Clock Tampering
        </button>
        <button
          onClick={() => startSimulation('login')}
          disabled={isRunning}
          className="btn-ghost"
          style={{ padding: '0.5rem 1rem', fontSize: '11px', textAlign: 'center' }}
        >
          🔒 Double Login
        </button>
      </div>

      {/* Simulator Terminal Output */}
      <div
        className="rounded p-4 min-h-[240px] flex flex-col justify-between"
        style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}
      >
        <div className="space-y-2">
          {activeRun && (
            <p
              className="font-bold border-b pb-2 mb-3"
              style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            >
              Scenario: {RUNS[activeRun].title}
            </p>
          )}

          {logs.length === 0 && (
            <p className="text-[var(--text-muted)] italic">Waiting to run simulation... Select a scenario above.</p>
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
            <span>Executing server safeguards...</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default WapSimulator
