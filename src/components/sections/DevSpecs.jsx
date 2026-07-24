/**
 * DevSpecs.jsx
 * Symmetrical 3D DSA Stats and Environment Dashboard.
 * Focuses purely on LeetCode and GeeksForGeeks milestones,
 * featuring interactive SVG radial gauges and GPU-accelerated 3D tilts.
 * Integrates real-time client-side fetching with static fallback.
 */

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SectionTitle from '../ui/SectionTitle'
import TiltCard from '../ui/TiltCard'
import { SiLeetcode, SiGeeksforgeeks } from 'react-icons/si'
import { FiTrendingUp, FiAward, FiCpu } from 'react-icons/fi'
import staticDsaStats from '../../data/dsa_stats.json'

const DevSpecs = () => {
  const [stats, setStats] = useState(staticDsaStats)

  // Real-time client-side fetch with graceful static fallback
  useEffect(() => {
    const fetchRealTimeStats = async () => {
      // 1. Fetch LeetCode Real-time solved counts
      try {
        const res = await fetch(`https://alfa-leetcode-api.onrender.com/${staticDsaStats.leetcode.username}/solved`)
        if (res.ok) {
          const data = await res.json()
          setStats((prev) => ({
            ...prev,
            leetcode: {
              ...prev.leetcode,
              solved: data.solvedProblem || prev.leetcode.solved,
              easy: data.easySolved || prev.leetcode.easy,
              medium: data.mediumSolved || prev.leetcode.medium,
              hard: data.hardSolved || prev.leetcode.hard,
            },
          }))
        }
      } catch (err) {
        console.warn('Real-time LeetCode fetch failed, using fallback:', err.message)
      }

      // 2. Fetch GFG Real-time stats
      try {
        const res = await fetch(`https://gfgstatscard.vercel.app/${staticDsaStats.gfg.username}?raw=true`)
        if (res.ok) {
          const data = await res.json()
          setStats((prev) => ({
            ...prev,
            gfg: {
              ...prev.gfg,
              solved: data.total_problems_solved || prev.gfg.solved,
              coding_score: data.total_score || prev.gfg.coding_score,
              easy: data.Easy || prev.gfg.easy,
              medium: data.Medium || prev.gfg.medium,
              hard: data.Hard || prev.gfg.hard,
            },
          }))
        }
      } catch (err) {
        console.warn('Real-time GFG fetch failed, using fallback:', err.message)
      }
    }

    fetchRealTimeStats()
  }, [])

  // LeetCode calculations
  const leetcodeTotal = 946 + 2061 + 937 // 3944
  const leetcodePercent = (stats.leetcode.solved / leetcodeTotal) * 100

  // GFG calculations (relative to a benchmark target of 500 solved)
  const gfgPercent = Math.min((stats.gfg.solved / 500) * 100, 100)

  return (
    <section
      id="specs"
      className="section-padding border-b"
      style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)' }}
      aria-label="Developer Specifications and Philosophy"
    >
      <div className="container-main text-center flex flex-col items-center">
        <SectionTitle number="08" title="Dev Dashboard & Specs" />

        <p className="font-sans text-sm text-[var(--text-secondary)] mb-12 max-w-2xl mx-auto">
          Real-time tracking of my algorithm design journey across LeetCode and GeeksForGeeks, detailing problem-solving
          difficulty breakdowns, contest ratings, and local system environments.
        </p>

        {/* 3D Symmetrical Stats Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full mx-auto mb-12 text-left">
          {/* LeetCode Card */}
          <TiltCard
            className="p-6 rounded-lg border flex flex-col justify-between"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <div className="flex items-center gap-2.5">
                  <SiLeetcode size={20} className="text-[#ffa116]" />
                  <span className="font-display font-semibold text-white">LeetCode Profile</span>
                </div>
                <a
                  href={`https://leetcode.com/u/${stats.leetcode.username}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[10px] text-[var(--accent)] hover:underline"
                >
                  @{stats.leetcode.username} ↗
                </a>
              </div>

              {/* Body */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                {/* SVG Radial Progress Gauge */}
                <div className="sm:col-span-5 flex justify-center">
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="56"
                        cy="56"
                        r="48"
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="6"
                        fill="transparent"
                      />
                      <motion.circle
                        cx="56"
                        cy="56"
                        r="48"
                        stroke="#ffa116"
                        strokeWidth="6"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 48}
                        initial={{ strokeDashoffset: 2 * Math.PI * 48 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 48 * (1 - leetcodePercent / 100) }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="font-display text-2xl font-bold text-white">{stats.leetcode.solved}</span>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
                        Solved
                      </span>
                    </div>
                  </div>
                </div>

                {/* Difficulty Bars */}
                <div className="sm:col-span-7 space-y-3.5">
                  {/* Easy */}
                  <div className="space-y-1">
                    <div className="flex justify-between font-mono text-[10px] text-[var(--text-secondary)]">
                      <span>Easy</span>
                      <span>{stats.leetcode.easy} / 946</span>
                    </div>
                    <div className="w-full h-1.5 bg-black/35 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-green-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${((stats.leetcode.easy / 946) * 100).toFixed(1)}%` }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                      />
                    </div>
                  </div>

                  {/* Medium */}
                  <div className="space-y-1">
                    <div className="flex justify-between font-mono text-[10px] text-[var(--text-secondary)]">
                      <span>Medium</span>
                      <span>{stats.leetcode.medium} / 2061</span>
                    </div>
                    <div className="w-full h-1.5 bg-black/35 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-amber-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${((stats.leetcode.medium / 2061) * 100).toFixed(1)}%` }}
                        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.1 }}
                      />
                    </div>
                  </div>

                  {/* Hard */}
                  <div className="space-y-1">
                    <div className="flex justify-between font-mono text-[10px] text-[var(--text-secondary)]">
                      <span>Hard</span>
                      <span>{stats.leetcode.hard} / 937</span>
                    </div>
                    <div className="w-full h-1.5 bg-black/35 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-rose-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${((stats.leetcode.hard / 937) * 100).toFixed(1)}%` }}
                        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer metrics */}
            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4 mt-6 font-mono text-[10px] text-[var(--text-secondary)]">
              <div className="flex items-center gap-2">
                <FiAward className="text-[#ffa116]" size={14} />
                <div>
                  <span className="block text-[8px] uppercase text-[var(--text-muted)]">Contest Rating</span>
                  <span className="font-semibold text-white">{stats.leetcode.contest_rating.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FiTrendingUp className="text-[#ffa116]" size={14} />
                <div>
                  <span className="block text-[8px] uppercase text-[var(--text-muted)]">Attended</span>
                  <span className="font-semibold text-white">{stats.leetcode.attended} Contests</span>
                </div>
              </div>
            </div>
          </TiltCard>

          {/* GeeksForGeeks Card */}
          <TiltCard
            className="p-6 rounded-lg border flex flex-col justify-between"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <div className="flex items-center gap-2.5">
                  <SiGeeksforgeeks size={20} className="text-[#2f8d46]" />
                  <span className="font-display font-semibold text-white">GeeksForGeeks</span>
                </div>
                <a
                  href={`https://auth.geeksforgeeks.org/user/${stats.gfg.username}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[10px] text-[var(--accent)] hover:underline"
                >
                  @{stats.gfg.username} ↗
                </a>
              </div>

              {/* Body */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                {/* SVG Radial Progress Gauge */}
                <div className="sm:col-span-5 flex justify-center">
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="56"
                        cy="56"
                        r="48"
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="6"
                        fill="transparent"
                      />
                      <motion.circle
                        cx="56"
                        cy="56"
                        r="48"
                        stroke="#2f8d46"
                        strokeWidth="6"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 48}
                        initial={{ strokeDashoffset: 2 * Math.PI * 48 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 48 * (1 - gfgPercent / 100) }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="font-display text-2xl font-bold text-white">{stats.gfg.solved}</span>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
                        Solved
                      </span>
                    </div>
                  </div>
                </div>

                {/* Difficulty Bars */}
                <div className="sm:col-span-7 space-y-3.5">
                  {/* Easy */}
                  <div className="space-y-1">
                    <div className="flex justify-between font-mono text-[10px] text-[var(--text-secondary)]">
                      <span>Easy</span>
                      <span>{stats.gfg.easy} Solved</span>
                    </div>
                    <div className="w-full h-1.5 bg-black/35 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-green-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${((stats.gfg.easy / stats.gfg.solved) * 100).toFixed(1)}%` }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                      />
                    </div>
                  </div>

                  {/* Medium */}
                  <div className="space-y-1">
                    <div className="flex justify-between font-mono text-[10px] text-[var(--text-secondary)]">
                      <span>Medium</span>
                      <span>{stats.gfg.medium} Solved</span>
                    </div>
                    <div className="w-full h-1.5 bg-black/35 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-amber-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${((stats.gfg.medium / stats.gfg.solved) * 100).toFixed(1)}%` }}
                        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.1 }}
                      />
                    </div>
                  </div>

                  {/* Hard */}
                  <div className="space-y-1">
                    <div className="flex justify-between font-mono text-[10px] text-[var(--text-secondary)]">
                      <span>Hard</span>
                      <span>{stats.gfg.hard} Solved</span>
                    </div>
                    <div className="w-full h-1.5 bg-black/35 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-rose-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${((stats.gfg.hard / stats.gfg.solved) * 100).toFixed(1)}%` }}
                        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer metrics */}
            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4 mt-6 font-mono text-[10px] text-[var(--text-secondary)]">
              <div className="flex items-center gap-2">
                <FiAward className="text-[#2f8d46]" size={14} />
                <div>
                  <span className="block text-[8px] uppercase text-[var(--text-muted)]">Coding Score</span>
                  <span className="font-semibold text-white">{stats.gfg.coding_score}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FiCpu className="text-[#2f8d46]" size={14} />
                <div>
                  <span className="block text-[8px] uppercase text-[var(--text-muted)]">Institute Rank</span>
                  <span className="font-semibold text-white">#{stats.gfg.institute_rank}</span>
                </div>
              </div>
            </div>
          </TiltCard>
        </div>

        {/* Unified Symmetrical Environment Terminal Specs footer */}
        <div
          className="w-full max-w-xl mx-auto rounded-lg border p-4 bg-black/10 font-mono text-[10px]"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[var(--text-muted)]">
            <span>OS: Windows 11</span>
            <span className="w-[1px] h-3 bg-white/10 hidden sm:inline" />
            <span>Shell: PowerShell / cmd</span>
            <span className="w-[1px] h-3 bg-white/10 hidden sm:inline" />
            <span>IDE: VS Code (Dark Theme)</span>
            <span className="w-[1px] h-3 bg-white/10 hidden sm:inline" />
            <span>Navigation: Keyboard / Mouse</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DevSpecs
