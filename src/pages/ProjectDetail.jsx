/**
 * ProjectDetail.jsx
 * Redesigned case study page styled as a Mock GitHub Pull Request.
 * Features:
 *  - PR Header (merging branches, commit counts, open status)
 *  - Tab Switcher (Conversation, Files Changed, Interactive Demo)
 *  - Mock Code Reviews (Conversations between mentor/AI and Aditya)
 */

import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiArrowLeft, FiExternalLink, FiGithub, FiMessageSquare, FiGitCommit, FiFileText, FiFolder } from 'react-icons/fi'
import { projects } from '../data/projects'
import SkillBadge from '../components/ui/SkillBadge'
import ScreenshotGallery from '../components/ui/ScreenshotGallery'
import ScrollReveal from '../components/ui/ScrollReveal'
import WushuArchitecture from '../components/ui/WushuArchitecture'
import LangGraphArchitecture from '../components/ui/LangGraphArchitecture'
import AgentSimulator from '../components/ui/AgentSimulator'

const GITHUB_COMMENTS = {
  'wushu-mis': [
    {
      author: 'adityaroy000',
      role: 'Contributor',
      avatarText: 'AR',
      time: 'August 2025',
      body: `I have architected a 233-endpoint REST API for the Wushu sports management SaaS. To prevent data collision between concurrent championships, all registrations, approvals, and fixture drawings are event-scoped in MongoDB. I followed a full corporate workflow starting with SRS, FRD, NFRD documentation followed by 3 days of figma design before writing a single line of backend logic.`
    },
    {
      author: 'dbms-mentor-prof',
      role: 'Reviewer (DBMS Faculty)',
      avatarText: 'MP',
      time: 'September 2025',
      body: `Reviewing the access controls. The platform contains a 5-level administrative hierarchy (National admin, State admin, District coordinators, Managers, Athletes). How did you prevent hardcoding permissions? Can we adjust access levels without updating backend code?`
    },
    {
      author: 'adityaroy000',
      role: 'Contributor',
      avatarText: 'AR',
      time: 'September 2025',
      body: `I engineered a fully database-driven RBAC guard model. Permissions and role access levels are documents stored in a dynamic MongoDB collection. The express authorization middleware queries these schemas dynamically at runtime. Adding or changing a role permission is instant and requires zero server redeployments.`
    },
    {
      author: 'dbms-mentor-prof',
      role: 'Reviewer (DBMS Faculty)',
      avatarText: 'MP',
      time: 'October 2025',
      body: `What about real-time athlete approval notifications? Free-tier deployments on Render have strict limits and WebSockets connections often drop. Will this cause issues?`
    },
    {
      author: 'adityaroy000',
      role: 'Contributor',
      avatarText: 'AR',
      time: 'October 2025',
      body: `Instead of heavy WebSockets, I implemented Server-Sent Events (SSE) for the approval pipeline. Since approvals are one-way server-pushes, SSE is more lightweight, reconnects automatically, and easily handles connection limits without infrastructure costs.`
    }
  ],
  'transformer-intelligence-desk': [
    {
      author: 'adityaroy000',
      role: 'Contributor',
      avatarText: 'AR',
      time: 'February 2026',
      body: `I built this Agentic RAG system using LangGraph. The main issue with standard RAG is the LLM hallucinating math configurations (e.g. attention head dimensions). I added conditional routing to steer math queries into a secure python sandbox parser.`
    },
    {
      author: 'ai-code-reviewer',
      role: 'System Judge',
      avatarText: 'AI',
      time: 'March 2026',
      body: `If a user queries complex terms, simple Vector retrieval might miss context. How is retrieval recall optimized in ChromaDB?`
    },
    {
      author: 'adityaroy000',
      role: 'Contributor',
      avatarText: 'AR',
      time: 'March 2026',
      body: `I implemented parallel multi-query generation. Groq Llama-3 rewrites the input query into 3 semantic variations, queries ChromaDB in parallel, and merges them using Reciprocal Rank Fusion (RRF), boosting retrieval recall.`
    },
    {
      author: 'ai-code-reviewer',
      role: 'System Judge',
      avatarText: 'AI',
      time: 'March 2026',
      body: `What if the final generated output contains hallucinations or is unrelated to the context?`
    },
    {
      author: 'adityaroy000',
      role: 'Contributor',
      avatarText: 'AR',
      time: 'March 2026',
      body: `I added an LLM-as-a-Judge self-correction loop. The output is graded out of 1.0 on faithfulness. If the score falls below 0.7, it automatically loops back to the RAG routing node, retrying up to 3 times with constrained prompt templates.`
    }
  ]
}

const ProjectDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('conversation') // conversation, files, demo

  const projectIndex = projects.findIndex((p) => p.slug === slug)
  const project = projects[projectIndex]

  if (!project || project.status === 'wip') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <p className="font-mono text-sm mb-6" style={{ color: 'var(--text-muted)' }}>{'// project not found'}</p>
        <button className="btn-ghost" onClick={() => navigate('/')}>← Back to Portfolio</button>
      </div>
    )
  }

  const prNumber = project.id === '01' ? '#1' : '#2'
  const prBranch = project.slug === 'wushu-mis' ? 'feature/wushu-mis' : 'feature/agentic-desk'
  const Comments = GITHUB_COMMENTS[project.slug] || []

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="container-main py-24 md:py-28 text-left">
        {/* Back link */}
        <button
          className="inline-flex items-center gap-2 font-mono text-xs mb-8 cursor-pointer hover:text-[var(--accent)] transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onClick={() => {
            sessionStorage.setItem('scrollToSection', 'projects')
            navigate('/')
          }}
        >
          <FiArrowLeft /> Back to Portfolio
        </button>

        {/* Mock GitHub PR Header */}
        <div className="border-b pb-6 mb-8" style={{ borderColor: 'var(--border)' }}>
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="font-display font-bold text-2xl md:text-3xl text-white">
              {project.name} <span style={{ color: 'var(--text-muted)', fontWeight: 'normal' }}>{prNumber}</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
            <span
              className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1.5"
              style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.25)' }}
            >
              Open
            </span>
            <span>adityaroy000 wants to merge 14 commits into <code className="bg-black/25 px-1.5 py-0.5 rounded">main</code> from <code className="bg-black/25 px-1.5 py-0.5 rounded">{prBranch}</code></span>
          </div>
        </div>

        {/* PR Tabs */}
        <div className="flex bg-black/10 border border-b-0 rounded-t-lg font-mono text-xs overflow-hidden" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={() => setActiveTab('conversation')}
            className="flex items-center gap-2 px-5 py-3.5 border-r cursor-pointer transition-colors"
            style={{
              background: activeTab === 'conversation' ? 'var(--bg-secondary)' : 'transparent',
              borderColor: 'var(--border)',
              color: activeTab === 'conversation' ? 'var(--accent)' : 'var(--text-secondary)'
            }}
          >
            <FiMessageSquare size={13} />
            <span>Conversation</span>
            <span className="bg-black/25 px-1.5 py-0.5 rounded text-[10px]">{Comments.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className="flex items-center gap-2 px-5 py-3.5 border-r cursor-pointer transition-colors"
            style={{
              background: activeTab === 'files' ? 'var(--bg-secondary)' : 'transparent',
              borderColor: 'var(--border)',
              color: activeTab === 'files' ? 'var(--accent)' : 'var(--text-secondary)'
            }}
          >
            <FiFolder size={13} />
            <span>Files Changed (Architecture)</span>
          </button>
          <button
            onClick={() => setActiveTab('demo')}
            className="flex items-center gap-2 px-5 py-3.5 border-r cursor-pointer transition-colors"
            style={{
              background: activeTab === 'demo' ? 'var(--bg-secondary)' : 'transparent',
              borderColor: 'var(--border)',
              color: activeTab === 'demo' ? 'var(--accent)' : 'var(--text-secondary)'
            }}
          >
            <FiFileText size={13} />
            <span>Interactive Demo & Stats</span>
          </button>
        </div>

        {/* PR Tab Content Body */}
        <div className="p-6 rounded-b-lg border mb-12" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
          <AnimatePresence mode="wait">
            {activeTab === 'conversation' && (
              <motion.div
                key="conversation"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <ScrollReveal>
                  <p className="font-mono text-xs tracking-wider uppercase text-[var(--accent)] mb-4">{'// Pull Request Discussion Thread'}</p>
                </ScrollReveal>

                {Comments.map((comment, index) => (
                  <div
                    key={index}
                    className="rounded border overflow-hidden text-left"
                    style={{ borderColor: 'var(--border)', background: 'var(--bg-tertiary)' }}
                  >
                    {/* Comment Header */}
                    <div className="px-4 py-2 border-b bg-black/15 flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)]" style={{ borderColor: 'var(--border)' }}>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center font-bold text-[9px] text-[var(--accent)]">
                          {comment.avatarText}
                        </div>
                        <span className="font-semibold text-[var(--text-secondary)]">{comment.author}</span>
                        <span>commented in {comment.time}</span>
                      </div>
                      <span className="border px-2 py-0.5 rounded text-[8px] tracking-wider uppercase" style={{ borderColor: 'var(--border)' }}>
                        {comment.role}
                      </span>
                    </div>
                    {/* Comment Body */}
                    <div className="p-4 font-sans text-sm leading-relaxed text-[var(--text-secondary)]">
                      {comment.body}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'files' && (
              <motion.div
                key="files"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <ScrollReveal>
                  <p className="font-mono text-xs tracking-wider uppercase text-[var(--accent)]">{'// System Design Flowcharts'}</p>
                  <p className="font-sans text-sm mb-6 text-[var(--text-secondary)]">
                    Visual layout of request routing, authentication middlewares, and dynamic agent conditional execution paths.
                  </p>
                </ScrollReveal>

                {project.slug === 'wushu-mis' ? <WushuArchitecture /> : <LangGraphArchitecture />}
              </motion.div>
            )}

            {activeTab === 'demo' && (
              <motion.div
                key="demo"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div>
                  <p className="font-mono text-xs tracking-wider uppercase text-[var(--accent)] mb-4">{'// Interactive RAG Sandbox or Screenshots'}</p>
                  {project.screenshots?.length > 0 && (
                    <div className="mb-8">
                      <ScreenshotGallery screenshots={project.screenshots} captions={project.screenshotCaptions} />
                    </div>
                  )}
                  {project.slug === 'transformer-intelligence-desk' && <AgentSimulator />}
                </div>

                <div className="border-t pt-6" style={{ borderColor: 'var(--border)' }}>
                  <p className="font-mono text-xs tracking-wider uppercase text-[var(--text-muted)] mb-4">{'// Contributions Breakdown'}</p>
                  <div className="grid md:grid-cols-2 gap-6 text-sm">
                    {/* Owned by me */}
                    <div className="p-5 rounded border" style={{ background: 'var(--bg-tertiary)', borderColor: 'var(--border)' }}>
                      <p className="font-mono text-xs text-[var(--accent)] mb-3">{'// Aditya owned'}</p>
                      <ul className="space-y-2">
                        {project.contributions.mine.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span style={{ color: 'var(--accent)' }}>▸</span>
                            <span style={{ color: 'var(--text-secondary)' }}>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Shared/Team */}
                    {project.contributions.team.length > 0 && (
                      <div className="p-5 rounded border" style={{ background: 'var(--bg-tertiary)', borderColor: 'var(--border)' }}>
                        <p className="font-mono text-xs text-[var(--text-muted)] mb-3">{'// Team contribution'}</p>
                        <ul className="space-y-2">
                          {project.contributions.team.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span style={{ color: 'var(--text-muted)' }}>▸</span>
                              <span style={{ color: 'var(--text-muted)' }}>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer PR links */}
        <div className="flex justify-between items-center gap-4 text-xs font-mono border-t pt-6" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
          <div>Project status: <span className="text-[var(--accent)] font-semibold uppercase">{project.status}</span></div>
          <div className="flex gap-4">
            {project.live && (
              <a href={project.live} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white transition-colors">
                <FiExternalLink /> Live Demo
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white transition-colors">
                <FiGithub /> Repository
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetail
