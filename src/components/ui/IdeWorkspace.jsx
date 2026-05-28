/**
 * IdeWorkspace.jsx
 * An interactive developer workspace (mock VS Code). Features:
 *  - Left sidebar file explorer.
 *  - Active tab manager.
 *  - Toggle switcher: Code (with syntax highlighting) vs Preview (rich visual components).
 *  - Bottom terminal drawer with custom commands.
 */

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiChevronDown, FiChevronRight, FiFolder, FiFile, FiTerminal, FiPlay, FiCheck, FiX, FiAward, FiLayers, FiActivity, FiGitPullRequest, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi'
import dsaStats from '../../data/dsa_stats.json'

const FILES = {
  'about.md': `## About Aditya Roy

*   **Role:** Final-year CSE Student @ KIIT University
*   **Focus:** Full-stack architecture, AI Agents, and scalable REST APIs.
*   **Philosophy:** DRY is law. Messy code is a developer's hell.
*   **Stats:** Solved ${dsaStats.leetcode.solved} LeetCode, ${dsaStats.gfg.solved} GFG. Selected for Amazon ML Summer School.

*   *Quote:* "Build real systems that solve real problems."`,

  'dsa_stats.json': `{
  "leetcode": {
    "username": "${dsaStats.leetcode.username}",
    "solved": ${dsaStats.leetcode.solved},
    "rating": ${dsaStats.leetcode.contest_rating},
    "breakdown": {
      "easy": ${dsaStats.leetcode.easy},
      "medium": ${dsaStats.leetcode.medium},
      "hard": ${dsaStats.leetcode.hard}
    }
  },
  "geeksforgeeks": {
    "solved": ${dsaStats.gfg.solved},
    "coding_score": ${dsaStats.gfg.coding_score},
    "institute_rank": ${dsaStats.gfg.institute_rank},
    "breakdown": {
      "easy": ${dsaStats.gfg.easy},
      "medium": ${dsaStats.gfg.medium},
      "hard": ${dsaStats.gfg.hard}
    }
  }
}`,

  'git_log.sh': `#!/bin/bash

# Milestone commits
git log --oneline

* fa7e2c3 [2026] HackwithInfy physically cleared (Round 2, L1 interview completed)
* e89d0b4 [2026] Shortlisted for Capgemini Agent Challenge & Cognizant Technoverse
* d43f11a [2025] Launched Wushu-MIS Live SaaS (233 endpoints, dynamic RBAC, SSE)
* c12d098 [2025] Joined Amazon ML Summer School (DSA coding selection)
* b34d98a [2024] Ranked Top 10 in KIIT DSA Championship (600+ entrants)
* a09b87c [2023] Secured Grade O in C Programming Lab (First spark)
* 0000000 [2023] Initial commit: 'Hello World' in C`,

  'profile.jpg': `[Binary Image File] Select tab to render profile octagon preview.`
}

// ── Lightweight Regex Highlighting parsers ──
const highlightJson = (code) => {
  return code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, (match) => {
      let cls = 'ide-number'
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'ide-key'
        } else {
          cls = 'ide-string'
        }
      } else if (/true|false/.test(match)) {
        cls = 'ide-boolean'
      } else if (/null/.test(match)) {
        cls = 'ide-number'
      }
      return `<span class="${cls}">${match}</span>`
    })
}

const highlightMarkdown = (code) => {
  return code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/^(#+\s+.*)$/gm, '<span class="ide-header">$1</span>')
    .replace(/^(\s*[*+-]\s+)/gm, '<span class="ide-bullet">$1</span>')
    .replace(/(\*\*.*?\*\*)/g, '<span class="ide-key">$1</span>')
    .replace(/(\*.*?\*)/g, '<span class="ide-comment">$1</span>')
}

const highlightBash = (code) => {
  return code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/(#.*)$/gm, '<span class="ide-comment">$1</span>')
    .replace(/(#!\/bin\/bash|git log|git|bash|cat|theme|clear)/g, '<span class="ide-keyword">$1</span>')
    .replace(/(\*\s+)([a-f0-9]{7})/g, '$1<span class="ide-hash">$2</span>')
}

const highlightConfig = (code) => {
  return code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/^(\[.*\])$/gm, '<span class="ide-header">$1</span>')
    .replace(/^([\w_]+)\s*(=)/gm, '<span class="ide-key">$1</span> $2')
    .replace(/(".*?")/g, '<span class="ide-string">$1</span>')
    .replace(/\b(true|false)\b/g, '<span class="ide-boolean">$1</span>')
    .replace(/\b(\d+)\b/g, '<span class="ide-number">$1</span>')
}

const getHighlightedHTML = (fileName, code) => {
  if (fileName === 'dsa_stats.json') return highlightJson(code)
  if (fileName === 'about.md') return highlightMarkdown(code)
  if (fileName === 'git_log.sh') return highlightBash(code)
  return code
}

const IdeWorkspace = () => {
  const [activeFile, setActiveFile] = useState('about.md')
  const [openTabs, setOpenTabs] = useState(['about.md'])
  const [viewModes, setViewModes] = useState({
    'about.md': 'preview',
    'dsa_stats.json': 'preview',
    'git_log.sh': 'preview'
  })
  const [inputVal, setInputVal] = useState('')
  const [history, setHistory] = useState([
    { type: 'output', text: 'Aditya Roy Dev OS [Version 1.0.4]' },
    { type: 'output', text: 'Type "help" to see available terminal commands.' },
    { type: 'output', text: '' }
  ])

  // ── Sidebar collapse state ──
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // ── Terminal resize state ──
  const [terminalHeight, setTerminalHeight] = useState(176) // px, matches h-44
  const isResizing = useRef(false)
  const resizeStartY = useRef(0)
  const resizeStartH = useRef(0)

  const terminalEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  // ── Terminal drag-to-resize handlers ──
  const onResizeMouseDown = useCallback((e) => {
    e.preventDefault()
    isResizing.current = true
    resizeStartY.current = e.clientY
    resizeStartH.current = terminalHeight

    const onMouseMove = (e) => {
      if (!isResizing.current) return
      const delta = resizeStartY.current - e.clientY // drag up = increase height
      const newH = Math.min(340, Math.max(80, resizeStartH.current + delta))
      setTerminalHeight(newH)
    }

    const onMouseUp = () => {
      isResizing.current = false
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }, [terminalHeight])

  const openFile = (fileName) => {
    if (!openTabs.includes(fileName)) {
      setOpenTabs((prev) => [...prev, fileName])
    }
    setActiveFile(fileName)
  }

  const closeTab = (e, fileName) => {
    e.stopPropagation()
    const newTabs = openTabs.filter((t) => t !== fileName)
    setOpenTabs(newTabs)
    if (activeFile === fileName && newTabs.length > 0) {
      setActiveFile(newTabs[newTabs.length - 1])
    }
  }

  const toggleViewMode = (fileName, mode) => {
    setViewModes((prev) => ({ ...prev, [fileName]: mode }))
  }

  const handleCommand = (rawCmd) => {
    const cmdTrim = rawCmd.trim()
    if (!cmdTrim) return

    const parts = cmdTrim.split(' ')
    const cmd = parts[0].toLowerCase()
    const arg = parts.slice(1).join(' ').trim()

    let response = []

    switch (cmd) {
      case 'help':
        response.push({
          type: 'output',
          text: `
Available commands:
  help               - Show this list
  ls                 - List files
  cat [file]         - View file in editor (e.g. cat dsa_stats.json)
  theme [name]       - Change theme (emerald, hacker, dark)
  clear              - Clear terminal
`
        })
        break

      case 'ls':
        response.push({ type: 'output', text: Object.keys(FILES).join('   ') })
        break

      case 'cat':
        if (!arg) {
          response.push({ type: 'output', text: 'Usage: cat [file-name]' })
        } else if (FILES[arg]) {
          openFile(arg)
          response.push({ type: 'success', text: `Opened '${arg}' in editor pane.` })
        } else {
          response.push({ type: 'error', text: `File not found: '${arg}'` })
        }
        break

      case 'theme':
        if (!arg) {
          response.push({ type: 'output', text: 'Usage: theme [emerald | hacker | dark]' })
        } else if (['hacker', 'dark', 'emerald'].includes(arg)) {
          document.documentElement.className = arg === 'emerald' ? '' : `theme-${arg}`
          response.push({ type: 'success', text: `Theme updated to '${arg}'` })
        } else {
          response.push({ type: 'error', text: `Unknown theme: '${arg}'` })
        }
        break

      case 'clear':
        setHistory([])
        setInputVal('')
        return

      default:
        response.push({ type: 'error', text: `guest@aditya:~$ command not found: ${cmd}` })
    }

    setHistory((prev) => [...prev, { type: 'input', text: rawCmd }, ...response])
    setInputVal('')
  }

  const isBinary = activeFile === 'profile.jpg'
  const activeViewMode = viewModes[activeFile] || 'code'

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="w-full rounded-lg overflow-hidden border font-mono text-xs flex flex-col shadow-2xl transition-all duration-300"
      style={{
        background: 'var(--bg-tertiary)',
        borderColor: 'var(--border)',
        height: '520px'
      }}
    >
      {/* Visual Window Header */}
      <div
        className="flex items-center justify-between px-4 py-2 bg-black/35 border-b select-none shrink-0"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="flex gap-2">
          <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>
        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
          aditya-roy-ide Workspace — {activeFile}
        </span>
        <div className="w-6" />
      </div>

      {/* Main Workspace split */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left File Tree Sidebar — collapsible */}
        <motion.div
          animate={{ width: sidebarOpen ? 192 : 36 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="hidden sm:flex flex-col border-r bg-black/15 shrink-0 select-none overflow-hidden"
          style={{ borderColor: 'var(--border)' }}
        >
          {/* Sidebar header with collapse toggle */}
          <div className="p-3 border-b flex items-center justify-between shrink-0" style={{ borderColor: 'var(--border)' }}>
            {sidebarOpen && (
              <span className="font-bold text-[10px] whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>EXPLORER</span>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); setSidebarOpen(v => !v) }}
              className="ml-auto p-0.5 rounded hover:bg-white/10 transition-colors cursor-pointer"
              title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {sidebarOpen
                ? <FiChevronsLeft size={12} style={{ color: 'var(--text-muted)' }} />
                : <FiChevronsRight size={12} style={{ color: 'var(--accent)' }} />}
            </button>
          </div>

          {/* Sidebar file list — hidden when collapsed */}
          {sidebarOpen && (
            <div className="p-2 space-y-2 text-left overflow-hidden">
              <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                <FiFolder size={12} style={{ color: 'var(--accent)' }} />
                <span className="font-semibold truncate">portfolio</span>
              </div>
              <div className="pl-4 space-y-1">
                {Object.keys(FILES).map((fileName) => (
                  <div
                    key={fileName}
                    onClick={(e) => {
                      e.stopPropagation()
                      openFile(fileName)
                    }}
                    className="flex items-center gap-2 py-1 px-2 rounded cursor-pointer transition-colors duration-150 hover:bg-white/5"
                    style={{
                      color: activeFile === fileName ? 'var(--accent)' : 'var(--text-secondary)',
                      background: activeFile === fileName ? 'var(--accent-muted)' : 'transparent'
                    }}
                  >
                    <FiFile size={10} />
                    <span className="truncate">{fileName}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Collapsed: show file icons only */}
          {!sidebarOpen && (
            <div className="flex flex-col items-center gap-2 py-2">
              {Object.keys(FILES).map((fileName) => (
                <button
                  key={fileName}
                  onClick={(e) => { e.stopPropagation(); openFile(fileName); setSidebarOpen(true) }}
                  title={fileName}
                  className="p-1 rounded hover:bg-white/10 transition-colors cursor-pointer"
                  style={{ color: activeFile === fileName ? 'var(--accent)' : 'var(--text-muted)' }}
                >
                  <FiFile size={12} />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Center Editor + Bottom Terminal container */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Tab Bar & View Switcher */}
          <div
            className="flex bg-black/10 border-b overflow-hidden shrink-0 select-none items-center justify-between"
            style={{ borderColor: 'var(--border)' }}
          >
            {/* Tabs */}
            <div className="flex overflow-x-auto scrollbar-none flex-1">
              {openTabs.map((fileName) => (
                <div
                  key={fileName}
                  onClick={(e) => {
                    e.stopPropagation()
                    setActiveFile(fileName)
                  }}
                  className="flex items-center gap-2 px-4 py-2 border-r cursor-pointer text-[11px] shrink-0"
                  style={{
                    background: activeFile === fileName ? 'var(--bg-secondary)' : 'transparent',
                    borderColor: 'var(--border)',
                    color: activeFile === fileName ? 'var(--accent)' : 'var(--text-muted)'
                  }}
                >
                  <FiFile size={10} />
                  <span>{fileName}</span>
                  <span
                    onClick={(e) => closeTab(e, fileName)}
                    className="hover:text-[#ff5f56] ml-1 p-0.5 rounded transition-colors text-[9px]"
                  >
                    ✕
                  </span>
                </div>
              ))}
            </div>

            {/* View Mode Switcher (Code vs Preview) */}
            {!isBinary && openTabs.length > 0 && (
              <div className="flex items-center gap-1 px-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleViewMode(activeFile, 'code')
                  }}
                  className="px-2 py-0.5 rounded text-[10px] cursor-pointer border"
                  style={{
                    borderColor: activeViewMode === 'code' ? 'var(--accent)' : 'transparent',
                    color: activeViewMode === 'code' ? 'var(--accent)' : 'var(--text-muted)',
                    background: activeViewMode === 'code' ? 'var(--accent-muted)' : 'transparent'
                  }}
                >
                  {'{ } Code'}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleViewMode(activeFile, 'preview')
                  }}
                  className="px-2 py-0.5 rounded text-[10px] cursor-pointer border"
                  style={{
                    borderColor: activeViewMode === 'preview' ? 'var(--accent)' : 'transparent',
                    color: activeViewMode === 'preview' ? 'var(--accent)' : 'var(--text-muted)',
                    background: activeViewMode === 'preview' ? 'var(--accent-muted)' : 'transparent'
                  }}
                >
                  👁️ Preview
                </button>
              </div>
            )}
          </div>

          {/* Active File Editor Container */}
          <div className="flex-1 p-4 overflow-y-auto bg-black/5 flex text-left relative custom-scrollbar">
            {openTabs.length > 0 ? (
              isBinary ? (
                /* profile.jpg rendering */
                <div className="relative flex items-center justify-center w-full h-full py-4 animate-fade-in">
                  <div
                    className="relative flex items-center justify-center"
                    style={{
                      width: '180px',
                      height: '180px',
                      clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
                      background: 'var(--bg-secondary)',
                      border: '2px solid rgba(230,199,156,0.3)',
                    }}
                  >
                    <img
                      src={`${import.meta.env.BASE_URL}profile.jpg`}
                      alt="Aditya Roy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ) : activeViewMode === 'code' ? (
                /* CODE MODE - with syntax highlighting */
                <div className="flex w-full font-mono text-[11px] leading-relaxed">
                  <div className="pr-4 border-r select-none text-right font-mono" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)', minWidth: '24px' }}>
                    {FILES[activeFile].split('\n').map((_, index) => (
                      <div key={index}>{index + 1}</div>
                    ))}
                  </div>
                  <pre
                    className="pl-4 flex-1 overflow-x-auto font-mono"
                    style={{ whiteSpace: 'pre-wrap', color: 'var(--text-primary)' }}
                    dangerouslySetInnerHTML={{ __html: getHighlightedHTML(activeFile, FILES[activeFile]) }}
                  />
                </div>
              ) : (
                /* PREVIEW MODE - with visual diagnostic panels */
                <div className="w-full h-full animate-fade-in font-sans text-xs">
                  {/* about.md Render */}
                  {activeFile === 'about.md' && (
                    <div className="space-y-4 max-w-2xl text-[var(--text-secondary)] leading-relaxed">
                      <h3 className="font-display text-lg font-bold text-white border-b pb-2" style={{ borderColor: 'var(--border)' }}>
                        Aditya Roy
                      </h3>
                      <p className="font-mono text-[10px]" style={{ color: 'var(--accent)' }}>{'// Final-year Computer Science Engineering student @ KIIT'}</p>
                      <p>
                        I build real systems that solve real problems. My focus is on robust Express backend microservices, NoSQL aggregation structures, and designing self-improving RAG loops using LangGraph pipelines.
                      </p>
                      <blockquote className="pl-4 py-1 italic border-l-2" style={{ borderColor: 'var(--accent)', color: 'var(--text-primary)' }}>
                        "Always follow the DRY (Don't Repeat Yourself) principle.Messy codebases make development team operations hell."
                      </blockquote>
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="p-3 rounded border bg-black/10" style={{ borderColor: 'var(--border)' }}>
                          <p className="font-bold text-white mb-1">Amazon ML Summer School</p>
                          <p className="text-[10px]">Invite-only ML mentorship cohort selected out of thousands.</p>
                        </div>
                        <div className="p-3 rounded border bg-black/10" style={{ borderColor: 'var(--border)' }}>
                          <p className="font-bold text-white mb-1">DSA Champion</p>
                          <p className="text-[10px]">Top 10 in college-wide championship of 600+ coders.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* dsa_stats.json Render */}
                  {activeFile === 'dsa_stats.json' && (
                    <div className="space-y-6 w-full max-w-2xl">
                      <div className="flex justify-between items-center border-b pb-2" style={{ borderColor: 'var(--border)' }}>
                        <h3 className="font-display text-lg font-bold text-white">DSA Diagnostics Dashboard</h3>
                        <span className="font-mono text-[10px] text-[var(--accent)]">leetcode: adityaroy18</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* LeetCode card */}
                        <div className="p-4 rounded border bg-black/15 space-y-4" style={{ borderColor: 'var(--border)' }}>
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-white">LeetCode Metrics</span>
                            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-green-500/10 text-green-400">active</span>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-[11px] mb-1">
                                <span>Solved Problems</span>
                                <span className="font-bold text-white">{dsaStats.leetcode.solved} / 3944</span>
                              </div>
                              {/* progress bars */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-[9px] text-[var(--text-muted)]">
                                  <span>Easy: {dsaStats.leetcode.easy}</span>
                                  <span>Medium: {dsaStats.leetcode.medium}</span>
                                  <span>Hard: {dsaStats.leetcode.hard}</span>
                                </div>
                                <div className="w-full h-2 bg-black/40 rounded-full flex overflow-hidden">
                                  <div className="bg-green-400 h-full" style={{ width: `${(dsaStats.leetcode.easy / dsaStats.leetcode.solved * 100).toFixed(1)}%` }} />
                                  <div className="bg-amber-400 h-full" style={{ width: `${(dsaStats.leetcode.medium / dsaStats.leetcode.solved * 100).toFixed(1)}%` }} />
                                  <div className="bg-rose-400 h-full" style={{ width: `${(dsaStats.leetcode.hard / dsaStats.leetcode.solved * 100).toFixed(1)}%` }} />
                                </div>
                              </div>
                            </div>

                            <div className="border-t pt-2 mt-2 flex justify-between text-[11px]">
                              <span>Contest Rating:</span>
                              <span className="font-bold text-[var(--accent)]">{dsaStats.leetcode.contest_rating.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        {/* GFG card */}
                        <div className="p-4 rounded border bg-black/15 space-y-4" style={{ borderColor: 'var(--border)' }}>
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-white">GeeksForGeeks Metrics</span>
                            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-green-500/10 text-green-400">active</span>
                          </div>
                          <div className="space-y-3">
                            <div className="flex justify-between text-[11px]">
                              <span>Solved Problems:</span>
                              <span className="font-bold text-white">{dsaStats.gfg.solved}</span>
                            </div>
                            <div className="flex justify-between text-[11px]">
                              <span>Coding Score:</span>
                              <span className="font-bold text-white">{dsaStats.gfg.coding_score}</span>
                            </div>
                            <div className="flex justify-between text-[11px]">
                              <span>KIIT Institute Rank:</span>
                              <span className="font-bold text-[var(--accent)]">#{dsaStats.gfg.institute_rank}</span>
                            </div>
                            {/* progress bar */}
                            <div className="w-full h-1.5 bg-black/40 rounded-full flex overflow-hidden">
                              <div className="bg-green-400 h-full" style={{ width: `${(dsaStats.gfg.easy / dsaStats.gfg.solved * 100).toFixed(1)}%` }} />
                              <div className="bg-amber-400 h-full" style={{ width: `${(dsaStats.gfg.medium / dsaStats.gfg.solved * 100).toFixed(1)}%` }} />
                              <div className="bg-rose-400 h-full" style={{ width: `${(dsaStats.gfg.hard / dsaStats.gfg.solved * 100).toFixed(1)}%` }} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Badges strip */}
                      <div className="p-4 rounded border bg-black/10 flex items-center justify-around gap-4" style={{ borderColor: 'var(--border)' }}>
                        <div className="flex items-center gap-2">
                          <FiAward size={18} style={{ color: 'var(--accent)' }} />
                          <span>50 Days Badge 2026</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FiActivity size={18} style={{ color: 'var(--accent)' }} />
                          <span>100 Days Badge</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* git_log.sh Render */}
                  {activeFile === 'git_log.sh' && (
                    <div className="space-y-6 w-full max-w-2xl text-left">
                      <div className="border-b pb-2 flex justify-between items-center" style={{ borderColor: 'var(--border)' }}>
                        <h3 className="font-display text-lg font-bold text-white">Visual Git Timeline Graph</h3>
                        <span className="font-mono text-[10px] text-[var(--accent)]">branch: master</span>
                      </div>

                      {/* Visual commits list */}
                      <div className="relative pl-6 space-y-4">
                        {/* Connecting Line */}
                        <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-white/10" />

                        {/* Commits */}
                        <div className="relative flex gap-3">
                          <div className="w-3.5 h-3.5 rounded-full bg-green-500 border border-black z-10 animate-pulse mt-1" />
                          <div>
                            <span className="font-mono text-[9px] bg-green-500/10 text-green-400 border border-green-500/20 px-1.5 py-0.5 rounded">fa7e2c3</span>
                            <h4 className="font-bold text-white text-xs mt-1">[2026] HackwithInfy physical final round selection</h4>
                            <p className="text-[10px] text-[var(--text-muted)]">Cleared Round 1 online and Round 2 physical mode, interviewed for Specialist L1 role.</p>
                          </div>
                        </div>

                        <div className="relative flex gap-3">
                          <div className="w-3.5 h-3.5 rounded-full bg-[var(--accent)] border border-black z-10 mt-1" />
                          <div>
                            <span className="font-mono text-[9px] bg-[var(--accent-muted)] text-[var(--accent)] border border-accent/20 px-1.5 py-0.5 rounded">e89d0b4</span>
                            <h4 className="font-bold text-white text-xs mt-1">[2026] Shortlisted for Capgemini Agent Challenge & Cognizant Technoverse</h4>
                            <p className="text-[10px] text-[var(--text-muted)]">Round 2 selection for automated node-based insurance routing pipelines.</p>
                          </div>
                        </div>

                        <div className="relative flex gap-3">
                          <div className="w-3.5 h-3.5 rounded-full bg-[var(--accent)] border border-black z-10 mt-1" />
                          <div>
                            <span className="font-mono text-[9px] bg-[var(--accent-muted)] text-[var(--accent)] border border-accent/20 px-1.5 py-0.5 rounded">d43f11a</span>
                            <h4 className="font-bold text-white text-xs mt-1">[2025] Launched Wushu-MIS Live SaaS (233 endpoints)</h4>
                            <p className="text-[10px] text-[var(--text-muted)]">Delivered event-scoped database operations, Dynamic RBAC collection middlewares, and SSE loops.</p>
                          </div>
                        </div>

                        <div className="relative flex gap-3">
                          <div className="w-3.5 h-3.5 rounded-full bg-[var(--accent)] border border-black z-10 mt-1" />
                          <div>
                            <span className="font-mono text-[9px] bg-[var(--accent-muted)] text-[var(--accent)] border border-accent/20 px-1.5 py-0.5 rounded">c12d098</span>
                            <h4 className="font-bold text-white text-xs mt-1">[2025] Selected for Amazon ML Summer School</h4>
                            <p className="text-[10px] text-[var(--text-muted)]">Invited to Amazon ML cohort after clearing competitive DSA selection test.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              )
            ) : (
              <div className="m-auto text-[var(--text-muted)] flex flex-col items-center gap-2">
                <FiFolder size={32} />
                <span>No files open in editor. Select one from the sidebar.</span>
              </div>
            )}
          </div>

          {/* Bottom Terminal Section — resizable */}
          <div
            className="border-t flex flex-col bg-black/25 overflow-hidden shrink-0"
            style={{ borderColor: 'var(--border)', height: `${terminalHeight}px` }}
          >
            {/* Drag-to-resize handle */}
            <div
              onMouseDown={onResizeMouseDown}
              className="h-1 w-full shrink-0 cursor-row-resize group flex items-center justify-center"
              title="Drag to resize terminal"
              style={{ background: 'transparent' }}
            >
              <div className="w-10 h-0.5 rounded-full transition-colors group-hover:bg-[var(--accent)] bg-white/10" />
            </div>
            {/* Terminal Tab header */}
            <div className="px-4 py-1.5 bg-black/20 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2">
                <FiTerminal size={11} style={{ color: 'var(--accent)' }} />
                <span className="font-bold text-[9px]" style={{ color: 'var(--text-secondary)' }}>TERMINAL</span>
              </div>
              <span className="text-[9px] select-none" style={{ color: 'var(--text-muted)' }}>
                {terminalHeight}px ↕ drag to resize
              </span>
            </div>

            {/* Terminal logs */}
            <div className="flex-1 p-3 overflow-y-auto text-[10px] space-y-1.5 custom-scrollbar text-left font-mono">
              {history.map((log, idx) => {
                if (log.type === 'input') {
                  return (
                    <div key={idx} className="flex items-center">
                      <span className="mr-1.5" style={{ color: 'var(--accent)' }}>guest@aditya:~$</span>
                      <span style={{ color: 'var(--text-primary)' }}>{log.text}</span>
                    </div>
                  )
                }
                let colorClass = 'var(--text-secondary)'
                if (log.type === 'error') colorClass = '#ff5f56'
                if (log.type === 'success') colorClass = 'var(--accent)'

                return (
                  <pre key={idx} style={{ color: colorClass, whiteSpace: 'pre-wrap', fontFamily: 'var(--font-mono)' }}>
                    {log.text}
                  </pre>
                )
              })}
              <div ref={terminalEndRef} />
            </div>

            {/* Terminal input prompt */}
            <div className="px-4 py-2 border-t bg-black/15 flex items-center" style={{ borderColor: 'var(--border)' }}>
              <span className="mr-1.5 select-none" style={{ color: 'var(--accent)' }}>guest@aditya:~$</span>
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCommand(inputVal)}
                className="flex-1 bg-transparent border-none outline-none p-0 text-[10px] focus:ring-0"
                style={{ color: 'var(--text-primary)', caretColor: 'var(--accent)' }}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IdeWorkspace
