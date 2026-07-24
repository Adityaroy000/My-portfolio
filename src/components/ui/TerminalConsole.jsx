/**
 * TerminalConsole.jsx
 * Fully interactive command-line interface mimicking a Linux shell.
 * Allows recruiters to query DSA stats, Git history, read about.md,
 * and dynamically switch the portfolio theme using the 'theme' command.
 */

import { useState, useRef, useEffect } from 'react'
import dsaStats from '../../data/dsa_stats.json'

const makeProgressBar = (solved, total, length = 30) => {
  const ratio = Math.min(1, Math.max(0, solved / total))
  const filledCount = Math.round(ratio * length)
  const emptyCount = length - filledCount
  return '█'.repeat(filledCount) + '░'.repeat(emptyCount)
}

const HELP_TEXT = `
Available Commands:
  help                    - Display this command manual
  about                   - Print summary of Aditya's CS profile
  dsa-stats               - Print DSA (LeetCode & GFG) statistics
  git-log                 - Print git commit timeline of major milestones
  theme [theme-name]      - Change website theme: 'emerald' (default), 'hacker', or 'dark'
  ls                      - List virtual files in workspace
  cat [file-name]         - Display contents of a file
  clear                   - Clear terminal terminal screen
`

const ABOUT_TEXT = `
Aditya Roy - Final-year CS Engineering Student @ KIIT University
----------------------------------------------------------------
Foundational philosophy: Always follow the DRY (Don't Repeat Yourself) principle.
A messy codebase is a developer's worst enemy, especially in team operations.

Expertise: Full-Stack Web Development, Agentic AI Systems, Algorithmic Problem Solving.
Key Milestones: Amazon ML Summer School invitee, Top 10 KIIT DSA champion, Lead Developer 
for the live SaaS platform Wushu-MIS (powering national sports events with 233 API endpoints).
`

const FILES = {
  'about.md': ABOUT_TEXT,
  'dsa_stats.json': JSON.stringify(dsaStats, null, 2),
  'terminal_theme.conf': `default_theme = emerald\navailable_themes = [emerald, hacker, dark]`,
  'wushu_mis_architecture.png': `[Binary PNG] Cannot display binary format in text terminal. Visit the Projects details for visual graph.`,
}

const TerminalConsole = () => {
  const [history, setHistory] = useState([
    { type: 'output', text: 'Aditya Roy Dev OS [Version 1.0.4]' },
    { type: 'output', text: 'Type "help" to see available terminal commands.' },
    { type: 'output', text: '' },
  ])
  const [inputVal, setInputVal] = useState('')
  const outputEndRef = useRef(null)
  const inputRef = useRef(null)

  const handleScrollToBottom = () => {
    outputEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    handleScrollToBottom()
  }, [history])

  const focusInput = () => {
    inputRef.current?.focus()
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
        response.push({ type: 'output', text: HELP_TEXT })
        break

      case 'about':
        response.push({ type: 'output', text: ABOUT_TEXT })
        break

      case 'dsa-stats':
        response.push({
          type: 'output',
          text: `
LeetCode Stats (Username: ${dsaStats.leetcode.username})
--------------------------------------
Total Solved: ${dsaStats.leetcode.solved} / 3944
  Easy   [${makeProgressBar(dsaStats.leetcode.easy, 946)}] ${dsaStats.leetcode.easy}/946
  Medium [${makeProgressBar(dsaStats.leetcode.medium, 2061)}] ${dsaStats.leetcode.medium}/2061
  Hard   [${makeProgressBar(dsaStats.leetcode.hard, 937)}] ${dsaStats.leetcode.hard}/937
Contest Rating: ${dsaStats.leetcode.contest_rating.toLocaleString()} | Attended: ${dsaStats.leetcode.attended} Contests
Advanced DSA: Dynamic Programming, Backtracking, Graphs & Trees.

GeeksForGeeks Stats (KIIT Institute Rank: ${dsaStats.gfg.institute_rank})
-----------------------------------------------
Total Solved: ${dsaStats.gfg.solved}
Coding Score: ${dsaStats.gfg.coding_score} | Institute Rank: ${dsaStats.gfg.institute_rank}
  Easy: ${dsaStats.gfg.easy} | Medium: ${dsaStats.gfg.medium} | Hard: ${dsaStats.gfg.hard}
`,
        })
        break

      case 'git-log':
      case 'git':
        if (cmd === 'git' && arg !== 'log' && arg !== 'log --oneline') {
          response.push({ type: 'output', text: `Usage: 'git log' or 'git log --oneline'` })
        } else {
          response.push({
            type: 'output',
            text: `
* fa7e2c3 (HEAD -> main) [2026] Shortlisted for Infosys HackwithInfy (Round 2 cleared physically, L1 interview completed)
* e89d0b4 [2026] Shortlisted for Capgemini Agent Builder Challenge & Cognizant Technoverse finals (Round 2)
* d43f11a [2025] Launched Wushu-MIS Live SaaS (233 endpoints, dynamic custom RBAC, figma design, 3-day sleep marathon)
* c12d098 [2025] Selected for Amazon ML Summer School (cleared DSA coding selection round)
* b34d98a [2024] Ranked Top 10 in KIIT DSA Championship (out of 600+ participants)
* a09b87c [2023] Secured Grade O (Outstanding) in C Programming Lab (first competitive spark)
* 0000000 [2023] Initial commit: Wrote first 'Hello World' in C language
`,
          })
        }
        break

      case 'theme':
        if (!arg) {
          response.push({ type: 'output', text: `Usage: theme [emerald | hacker | dark]` })
        } else if (arg === 'hacker') {
          document.documentElement.className = 'theme-hacker'
          response.push({ type: 'success', text: `System theme changed to: 'hacker' (Matrix green)` })
        } else if (arg === 'dark') {
          document.documentElement.className = 'theme-dark'
          response.push({ type: 'success', text: `System theme changed to: 'dark' (VS Code Dark)` })
        } else if (arg === 'emerald') {
          document.documentElement.className = ''
          response.push({ type: 'success', text: `System theme changed to: 'emerald' (Emerald & Gold default)` })
        } else {
          response.push({ type: 'error', text: `Theme '${arg}' not recognized. Try: 'emerald', 'hacker', or 'dark'.` })
        }
        break

      case 'ls':
        response.push({ type: 'output', text: Object.keys(FILES).join('   ') })
        break

      case 'cat':
        if (!arg) {
          response.push({ type: 'output', text: `Usage: cat [file-name]` })
        } else if (FILES[arg]) {
          response.push({ type: 'output', text: FILES[arg] })
        } else {
          response.push({ type: 'error', text: `File not found: '${arg}'. Type 'ls' to see available files.` })
        }
        break

      case 'clear':
        setHistory([])
        setInputVal('')
        return

      default:
        response.push({
          type: 'error',
          text: `guest@aditya:~$ command not found: ${cmd}. Type 'help' to see instructions.`,
        })
    }

    setHistory((prev) => [...prev, { type: 'input', text: rawCmd }, ...response])
    setInputVal('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommand(inputVal)
    }
  }

  return (
    <div
      onClick={focusInput}
      className="w-full rounded-lg overflow-hidden border font-mono text-left select-text shadow-xl transition-all duration-300"
      style={{
        background: 'var(--bg-tertiary)',
        borderColor: 'var(--border)',
        height: '360px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Title Bar */}
      <div
        className="flex items-center justify-between px-4 py-2 bg-black/20 border-b select-none shrink-0"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="flex gap-2">
          <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          guest@aditya-roy: ~
        </span>
        <span className="w-12" /> {/* spacer */}
      </div>

      {/* Terminal Output Logs */}
      <div className="p-4 flex-1 overflow-y-auto space-y-2 text-xs leading-relaxed custom-scrollbar">
        {history.map((log, idx) => {
          if (log.type === 'input') {
            return (
              <div key={idx} className="flex items-center">
                <span className="mr-2" style={{ color: 'var(--accent)' }}>
                  guest@aditya:~$
                </span>
                <span style={{ color: 'var(--text-primary)' }}>{log.text}</span>
              </div>
            )
          }

          let colorClass = 'var(--text-secondary)'
          if (log.type === 'error') colorClass = '#ff5f56'
          if (log.type === 'success') colorClass = 'var(--accent)'

          return (
            <pre
              key={idx}
              style={{
                color: colorClass,
                whiteSpace: 'pre-wrap',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {log.text}
            </pre>
          )
        })}
        <div ref={outputEndRef} />
      </div>

      {/* Terminal Input Line */}
      <div
        className="px-4 py-3 border-t bg-black/10 flex items-center shrink-0"
        style={{ borderColor: 'var(--border)' }}
      >
        <span className="mr-2 select-none" style={{ color: 'var(--accent)' }}>
          guest@aditya:~$
        </span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none outline-none p-0 text-xs focus:ring-0"
          style={{ color: 'var(--text-primary)', caretColor: 'var(--accent)' }}
          aria-label="Terminal input prompt"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
      </div>
    </div>
  )
}

export default TerminalConsole
