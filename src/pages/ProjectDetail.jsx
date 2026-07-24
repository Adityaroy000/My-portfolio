/**
 * ProjectDetail.jsx
 * Redesigned case study page styled as a clean, Linear, Story-Driven Case Study.
 * Features:
 *  - Immersive Hero Banner with Meta-Data Grid
 *  - Executive Brief (Problem & Solution side-by-side)
 *  - Interactive System Design Flowchart Canvas
 *  - The Engineering Journey Timeline
 *  - Expandable Engineering Challenges & Code Cards
 *  - Interactive Playground Simulators (for RAG & WAP)
 *  - Mock Code Reviews (Conversations between reviewer and Aditya in a clean timeline)
 *  - Contributions & Screenshots Gallery
 */

import { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import {
  FiArrowLeft,
  FiExternalLink,
  FiGithub,
  FiCpu,
  FiCheckCircle,
  FiAlertCircle,
  FiTerminal,
  FiLayers,
  FiChevronDown,
  FiChevronUp,
  FiBookOpen,
} from 'react-icons/fi'
import { projects } from '../data/projects'
import ScreenshotGallery from '../components/ui/ScreenshotGallery'
import ScrollReveal from '../components/ui/ScrollReveal'
import WushuArchitecture from '../components/ui/WushuArchitecture'
import LangGraphArchitecture from '../components/ui/LangGraphArchitecture'
import WapArchitecture from '../components/ui/WapArchitecture'
import AgentSimulator from '../components/ui/AgentSimulator'
import WapSimulator from '../components/ui/WapSimulator'
import TiltCard from '../components/ui/TiltCard'

const GITHUB_COMMENTS = {
  'wushu-mis': [
    {
      author: 'adityaroy000',
      role: 'Contributor',
      avatarText: 'AR',
      time: 'August 2025',
      body: `I have architected a 233-endpoint REST API for the Wushu sports management SaaS. To prevent data collision between concurrent championships, all registrations, approvals, and fixture drawings are event-scoped in MongoDB. I followed a full corporate workflow starting with SRS, FRD, NFRD documentation followed by 3 days of figma design before writing a single line of backend logic.`,
    },
    {
      author: 'dbms-mentor-prof',
      role: 'Reviewer (DBMS Faculty)',
      avatarText: 'MP',
      time: 'September 2025',
      body: `Reviewing the access controls. The platform contains a 5-level administrative hierarchy (National admin, State admin, District coordinators, Managers, Athletes). How did you prevent hardcoding permissions? Can we adjust access levels without updating backend code?`,
    },
    {
      author: 'adityaroy000',
      role: 'Contributor',
      avatarText: 'AR',
      time: 'September 2025',
      body: `I engineered a fully database-driven RBAC guard model. Permissions and role access levels are documents stored in a dynamic MongoDB collection. The express authorization middleware queries these schemas dynamically at runtime. Adding or changing a role permission is instant and requires zero server redeployments.`,
    },
    {
      author: 'dbms-mentor-prof',
      role: 'Reviewer (DBMS Faculty)',
      avatarText: 'MP',
      time: 'October 2025',
      body: `What about real-time athlete approval notifications? Free-tier deployments on Render have strict limits and WebSockets connections often drop. Will this cause issues?`,
    },
    {
      author: 'adityaroy000',
      role: 'Contributor',
      avatarText: 'AR',
      time: 'October 2025',
      body: `Instead of heavy WebSockets, I implemented Server-Sent Events (SSE) for the approval pipeline. Since approvals are one-way server-pushes, SSE is more lightweight, reconnects automatically, and easily handles connection limits without infrastructure costs.`,
    },
  ],
  'transformer-intelligence-desk': [
    {
      author: 'adityaroy000',
      role: 'Contributor',
      avatarText: 'AR',
      time: 'February 2026',
      body: `I built this Agentic RAG system using LangGraph. The main issue with standard RAG is the LLM hallucinating math configurations (e.g. attention head dimensions). I added conditional routing to steer math queries into a secure python sandbox parser.`,
    },
    {
      author: 'ai-code-reviewer',
      role: 'System Judge',
      avatarText: 'AI',
      time: 'March 2026',
      body: `If a user queries complex terms, simple Vector retrieval might miss context. How is retrieval recall optimized in ChromaDB?`,
    },
    {
      author: 'adityaroy000',
      role: 'Contributor',
      avatarText: 'AR',
      time: 'March 2026',
      body: `I implemented parallel multi-query generation. Groq Llama-3 rewrites the input query into 3 semantic variations, queries ChromaDB in parallel, and merges them using Reciprocal Rank Fusion (RRF), boosting retrieval recall.`,
    },
    {
      author: 'ai-code-reviewer',
      role: 'System Judge',
      avatarText: 'AI',
      time: 'March 2026',
      body: `What if the final generated output contains hallucinations or is unrelated to the context?`,
    },
    {
      author: 'adityaroy000',
      role: 'Contributor',
      avatarText: 'AR',
      time: 'March 2026',
      body: `I added an LLM-as-a-Judge self-correction loop. The output is graded out of 1.0 on faithfulness. If the score falls below 0.7, it automatically loops back to the RAG routing node, retrying up to 3 times with constrained prompt templates.`,
    },
  ],
  'wushu-assessment-platform': [
    {
      author: 'adityaroy000',
      role: 'Contributor',
      avatarText: 'AR',
      time: 'May 2026',
      body: `I have implemented WAP for offline-resilient sports licensing. To parse Word documents directly on the backend, I built a regex state-machine tokenizer that extracts raw XML structures via Mammoth.js and maps questions to MongoDB Polymorphic schemas.`,
    },
    {
      author: 'exam-coordinator',
      role: 'Reviewer (State Registrar)',
      avatarText: 'SR',
      time: 'May 2026',
      body: `Very interesting ingestion. However, venue mobile networks are highly unstable. What happens if multiple candidate auto-saves arrive out-of-order? Won't late packets overwrite newer answers?`,
    },
    {
      author: 'adityaroy000',
      role: 'Contributor',
      avatarText: 'AR',
      time: 'June 2026',
      body: `I solved that by adding incremental sequence numbers to each answer click. On save, the backend checks if the incoming sequence is greater than the stored database sequence. If a delayed packet arrives late with a lower sequence number, it is automatically discarded.`,
    },
    {
      author: 'exam-coordinator',
      role: 'Reviewer (State Registrar)',
      avatarText: 'SR',
      time: 'June 2026',
      body: `How do you stop cheating? Candidates can share link credentials or change their local device clocks to extend the testing time.`,
    },
    {
      author: 'adityaroy000',
      role: 'Contributor',
      avatarText: 'AR',
      time: 'June 2026',
      body: `We enforce a two-tier device lock. First, we hash the candidate's User-Agent and IP into a SHA-256 footprint. Any concurrent request from another device will mismatch and get blocked. Second, the countdown timer is validated against the server NTP clock, with a strict 15-second transit grace period. Tampering with client clocks has zero effect.`,
    },
  ],
}

const JOURNEY_MILESTONES = {
  'wushu-mis': [
    {
      phase: 'Phase 1',
      title: 'Scope & Architecture Design',
      details:
        'Modeled 30+ event-scoped MongoDB schemas and conceptualized hierarchical RBAC rules to establish strict data boundaries across National, State, and District levels.',
    },
    {
      phase: 'Phase 2',
      title: 'Live Scoring & Cache Layer',
      details:
        'Integrated Socket.io channels for live display updates. Implemented an in-memory session cache that aggregates scoring clicks in RAM and flushes to MongoDB in batches, avoiding database locks.',
    },
    {
      phase: 'Phase 3',
      title: 'Spreadsheet Security & HMACs',
      details:
        'Wrote an ExcelJS parser that exports pre-validated spreadsheet templates. Added an extra security layer that hashes template metadata via a SHA-256 HMAC signature to block cross-event upload hacks.',
    },
    {
      phase: 'Phase 4',
      title: 'Maintenance & Diagnostics Toolkit',
      details:
        'Engineered backend diagnostics to allow Super Admins to selectively purge configurations (matches, rosters) inside test environments, isolated behind strict environment guards.',
    },
  ],
  'transformer-intelligence-desk': [
    {
      phase: 'Phase 1',
      title: 'LangGraph Flow Chart Design',
      details:
        'Mapped the node-edge configuration structure of the QA assistant. Integrated ChromaDB and SentenceTransformers for Semantic Search.',
    },
    {
      phase: 'Phase 2',
      title: 'Calculation Sandbox Integration',
      details:
        'Built a custom parser that intercepts mathematical transformer parameter questions and directs them into a restricted Python sandbox for exact math computation.',
    },
    {
      phase: 'Phase 3',
      title: 'Evaluation Loop Optimization',
      details:
        'Created an LLM-as-a-Judge loop that scores retrieved answers on faithfulness, looping back to the router node on low confidence scores.',
    },
  ],
  'wushu-assessment-platform': [
    {
      phase: 'Phase 1',
      title: 'Ingestion parsing XML & Regex',
      details:
        'Wrote a parser that ingests Word files using Mammoth.js XML extraction and filters questions, choices, and answers via a regex tokenizer.',
    },
    {
      phase: 'Phase 2',
      title: 'Autosave & Sequence Protection',
      details:
        'Programmed sequence-numbered updates on the candidate client and added server validations to drop delayed packets, resolving network race conditions.',
    },
    {
      phase: 'Phase 3',
      title: 'Device Binding & NTP Deadlines',
      details:
        'Engineered SHA-256 User-Agent and IP footprint hashes to prevent account sharing, and matched exam countdowns to NTP servers with a 15-second lag grace window.',
    },
    {
      phase: 'Phase 4',
      title: 'Offline PDF Compilation',
      details:
        'Integrated PDFKit layout drawings, enabling administrators to compile consolidated Sanda/Taolu mark sheets into landscape PDFs locally.',
    },
  ],
}

const ProjectDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [openChallenge, setOpenChallenge] = useState(null)
  const [showReviews, setShowReviews] = useState(false)

  const project = projects.find((p) => p.slug === slug)
  const timelineRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start center', 'end center'],
  })
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  if (!project) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center animate-fade-in"
        style={{ background: 'var(--bg-primary)' }}
      >
        <p className="font-mono text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
          {'// Case study not found'}
        </p>
        <button className="btn-ghost" onClick={() => navigate('/')}>
          ← Back to Portfolio
        </button>
      </div>
    )
  }

  const branchName = `feature/${project.slug}`
  const Comments = GITHUB_COMMENTS[project.slug] || []
  const Milestones = JOURNEY_MILESTONES[project.slug] || []

  return (
    <div className="min-h-screen relative noise-overlay" style={{ background: 'var(--bg-primary)' }}>
      {/* Top Banner Navigation */}
      <div
        className="border-b"
        style={{ borderColor: 'var(--border)', background: 'rgba(10,26,26,0.7)', backdropFilter: 'blur(12px)' }}
      >
        <div className="container-main py-4 flex items-center justify-between">
          <button
            className="inline-flex items-center gap-2 font-mono text-xs cursor-pointer hover:text-[var(--accent)] transition-colors text-[var(--text-muted)]"
            onClick={() => {
              sessionStorage.setItem('scrollToSection', 'projects')
              navigate('/')
            }}
          >
            <FiArrowLeft /> Back to Workspace
          </button>
          <div className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider hidden sm:block">
            {branchName} ➔ Main branch
          </div>
        </div>
      </div>

      {/* Hero Header Section */}
      <section
        className="py-16 md:py-24 border-b"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
      >
        <div className="container-main text-center flex flex-col items-center">
          <ScrollReveal>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono text-[var(--text-muted)] mb-4">
              <span
                className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1.5"
                style={{
                  background: 'rgba(230,199,156,0.1)',
                  color: 'var(--accent)',
                  border: '1px solid var(--border)',
                }}
              >
                Production Case Study
              </span>
              <span>• Project ID: {project.id}</span>
            </div>

            <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-4 leading-tight">
              {project.name}
            </h1>

            <p className="font-sans text-lg md:text-xl text-[var(--text-secondary)] max-w-3xl mb-8 leading-relaxed mx-auto">
              {project.tagline}
            </p>

            {/* Symmetrical Meta Status Bar */}
            <div
              className="flex flex-wrap items-center justify-between gap-6 py-4 px-6 rounded-lg border mb-8 max-w-4xl w-full mx-auto"
              style={{ background: 'var(--bg-tertiary)', borderColor: 'var(--border)' }}
            >
              <div className="flex-1 min-w-[120px] text-center">
                <span className="font-mono text-[9px] uppercase tracking-wider block text-[var(--text-muted)] mb-1">
                  Role
                </span>
                <span className="font-sans text-xs font-semibold text-white">{project.role}</span>
              </div>
              <div className="w-[1px] h-8 bg-white/10 hidden md:block" />

              <div className="flex-1 min-w-[120px] text-center">
                <span className="font-mono text-[9px] uppercase tracking-wider block text-[var(--text-muted)] mb-1">
                  Team
                </span>
                <span className="font-sans text-xs font-semibold text-white">{project.team || 'Solo'}</span>
              </div>
              <div className="w-[1px] h-8 bg-white/10 hidden md:block" />

              <div className="flex-1 min-w-[120px] text-center flex flex-col items-center justify-center">
                <span className="font-mono text-[9px] uppercase tracking-wider block text-[var(--text-muted)] mb-1">
                  Status
                </span>
                <span className="font-sans text-xs font-semibold flex items-center gap-1.5 justify-center capitalize text-white">
                  <span
                    className="w-1.5 h-1.5 rounded-full inline-block"
                    style={{ background: project.status === 'live' ? '#4ade80' : '#E6C79C' }}
                  />
                  {project.status}
                </span>
              </div>
              <div className="w-[1px] h-8 bg-white/10 hidden md:block" />

              <div className="flex-2 min-w-[200px] text-center w-full">
                <span className="font-mono text-[9px] uppercase tracking-wider block text-[var(--text-muted)] mb-1">
                  Engine Stack
                </span>
                <span
                  className="font-sans text-xs font-semibold text-[var(--accent)] truncate block text-center w-full mx-auto"
                  title={project.stack.join(', ')}
                >
                  {project.stack.join(', ')}
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex justify-center gap-4">
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary flex items-center gap-1.5 text-xs"
                >
                  <FiExternalLink /> Live Site
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost flex items-center gap-1.5 text-xs"
                >
                  <FiGithub /> Repository
                </a>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Executive Brief: Problem & Achievements */}
      <section className="py-16 md:py-24 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="container-main text-left">
          <div className="grid md:grid-cols-2 gap-12">
            <ScrollReveal>
              <h2 className="font-display text-2xl md:text-3xl text-white mb-6 flex items-center gap-3">
                <FiAlertCircle className="text-[var(--accent)]" /> The Problem & Context
              </h2>
              <div className="font-sans text-sm leading-relaxed text-[var(--text-secondary)] space-y-4">
                <p>{project.overview}</p>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <h2 className="font-display text-2xl md:text-3xl text-white mb-6 flex items-center gap-3">
                <FiCheckCircle className="text-[var(--accent)]" /> Key Engineering Metrics
              </h2>
              <div className="space-y-4">
                {project.bullets.map((bullet, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-4 rounded border"
                    style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
                  >
                    <span className="text-[var(--accent)] text-lg mt-0.5">▸</span>
                    <p className="font-sans text-sm leading-relaxed text-[var(--text-secondary)]">{bullet}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* System Architecture Section */}
      <section
        className="py-16 md:py-24 border-b"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
      >
        <div className="container-main text-center flex flex-col items-center">
          <ScrollReveal>
            <h2 className="font-display text-2xl md:text-3xl text-white mb-4 flex items-center justify-center gap-3">
              <FiLayers className="text-[var(--accent)]" /> System Design & Data Flow
            </h2>
            <p className="font-sans text-sm text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
              An interactive visualization mapping input routing, ingestion pathways, session verification checkpoints,
              and database cache controllers. Click any node to read the engineering details.
            </p>

            <div className="mb-12 w-full max-w-5xl mx-auto">
              {project.slug === 'wushu-mis' && <WushuArchitecture />}
              {project.slug === 'wushu-assessment-platform' && <WapArchitecture />}
              {project.slug === 'transformer-intelligence-desk' && <LangGraphArchitecture />}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Milestones / The Journey */}
      <section className="py-16 md:py-24 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="container-main text-center flex flex-col items-center">
          <ScrollReveal>
            <h2 className="font-display text-2xl md:text-3xl text-white mb-10 flex items-center justify-center gap-3">
              <FiBookOpen className="text-[var(--accent)]" /> Engineering Journey Timeline
            </h2>

            <div ref={timelineRef} className="relative max-w-3xl mx-auto w-full text-left space-y-8 pl-0">
              {/* Background trace line */}
              <div className="absolute left-[3px] top-0 bottom-0 w-[2px] bg-white/5" />
              {/* Foreground animated line */}
              <motion.div
                className="absolute left-[3px] top-0 bottom-0 w-[2px] origin-top bg-[var(--accent)]"
                style={{ scaleY }}
              />

              {Milestones.map((m, idx) => (
                <div key={idx} className="relative pl-8 group">
                  {/* Circle Anchor */}
                  <div
                    className="absolute -left-[2px] top-1.5 w-3 h-3 rounded-full border transition-colors duration-300 group-hover:bg-[var(--accent)]"
                    style={{ background: 'var(--bg-primary)', borderColor: 'var(--accent)' }}
                  />
                  <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent)] mb-1 block">
                    {m.phase}
                  </span>
                  <h3 className="font-display font-semibold text-lg text-white mb-2">{m.title}</h3>
                  <p className="font-sans text-sm text-[var(--text-secondary)] max-w-3xl leading-relaxed">
                    {m.details}
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Engineering Challenges (Deep Dive with code/details) */}
      <section
        className="py-16 md:py-24 border-b"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
      >
        <div className="container-main text-center flex flex-col items-center">
          <ScrollReveal>
            <h2 className="font-display text-2xl md:text-3xl text-white mb-4 flex items-center justify-center gap-3">
              <FiCpu className="text-[var(--accent)]" /> Technical Deep Dives & Solutions
            </h2>
            <p className="font-sans text-sm text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
              A review of the production hurdles encountered during development and the database architectures,
              validation hooks, or algorithms designed to resolve them.
            </p>

            <div className="space-y-4 max-w-4xl mx-auto w-full text-left">
              {project.challenges.map((challenge, idx) => (
                <TiltCard
                  key={idx}
                  className="rounded border overflow-hidden"
                  style={{ borderColor: 'var(--border)', background: 'var(--bg-tertiary)' }}
                >
                  <button
                    className="w-full p-5 flex items-center justify-between text-left font-display font-semibold text-base md:text-lg text-white hover:text-[var(--accent)] transition-colors cursor-pointer select-none"
                    onClick={() => setOpenChallenge(openChallenge === idx ? null : idx)}
                  >
                    <span>{challenge.title}</span>
                    {openChallenge === idx ? <FiChevronUp /> : <FiChevronDown />}
                  </button>

                  <AnimatePresence initial={false}>
                    {openChallenge === idx && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 pt-0 border-t border-[var(--border)] font-sans text-sm text-[var(--text-secondary)] leading-relaxed space-y-4">
                          <p className="mt-4">{challenge.description}</p>

                          {/* Details block depending on challenge */}
                          {project.slug === 'wushu-mis' && idx === 0 && (
                            <div className="p-4 rounded font-mono text-xs bg-black/30 border border-[var(--border)]">
                              <p className="text-[var(--accent)] mb-2">
                                {'// High-Frequency Cache Batch-Flush Service'}
                              </p>
                              <p>const sessionCache = new Map();</p>
                              <p>
                                export const setSessionInCache = (session) =&gt; sessionCache.set(session._id, {'{'}{' '}
                                session, isDirty: true {'}'});
                              </p>
                              <p className="mt-2">{'// Scheduled cron task runs every 2s to flush dirty writes'}</p>
                              <p>export const flushAllDirtySessions = async () =&gt; {'{'}</p>
                              <p className="pl-4">for (const [id, cached] of sessionCache) {'{'}</p>
                              <p className="pl-8">if (cached.isDirty) await cached.session.save();</p>
                              <p className="pl-4">{'}'}</p>
                              <p>{'}'};</p>
                            </div>
                          )}

                          {project.slug === 'wushu-assessment-platform' && idx === 1 && (
                            <div className="p-4 rounded font-mono text-xs bg-black/30 border border-[var(--border)]">
                              <p className="text-[var(--accent)] mb-2">
                                {'// Sequence number validation in database controller'}
                              </p>
                              <p>{'const saved = await Attempt.findOneAndUpdate('}</p>
                              <p className="pl-4">
                                {
                                  "{ _id: attemptId, 'responses.questionId': qId, 'responses.sequenceNumber': { $lt: incomingSeq } },"
                                }
                              </p>
                              <p className="pl-4">
                                {
                                  "{ $set: { 'responses.$.answer': answer, 'responses.$.sequenceNumber': incomingSeq } }"
                                }
                              </p>
                              <p className="pl-4">{');'}</p>
                              <p className="mt-2">{'// Rejects delayed, out-of-order writes naturally'}</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </TiltCard>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Simulator Playground Section */}
      {(project.slug === 'wushu-assessment-platform' || project.slug === 'transformer-intelligence-desk') && (
        <section className="py-16 md:py-24 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="container-main text-center flex flex-col items-center">
            <ScrollReveal>
              <h2 className="font-display text-2xl md:text-3xl text-white mb-6 flex items-center justify-center gap-3">
                <FiTerminal className="text-[var(--accent)]" /> Interactive Engine Playground
              </h2>

              <div className="w-full max-w-4xl mx-auto text-left">
                {project.slug === 'wushu-assessment-platform' && <WapSimulator />}
                {project.slug === 'transformer-intelligence-desk' && <AgentSimulator />}
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Mock Review Logs Section */}
      <section className="py-16 md:py-24 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="container-main text-center flex flex-col items-center">
          <ScrollReveal>
            <div
              className="rounded-lg border overflow-hidden mb-6 w-full max-w-4xl text-left mx-auto"
              style={{ borderColor: 'var(--border)' }}
            >
              <button
                onClick={() => setShowReviews(!showReviews)}
                className="w-full p-5 bg-black/10 flex items-center justify-between text-left font-mono text-xs text-[var(--accent)] cursor-pointer select-none"
              >
                <span>💬 view_technical_audit_review_threads.sh ({Comments.length} comments)</span>
                <span>{showReviews ? '[ COLLAPSE ]' : '[ EXPAND ]'}</span>
              </button>

              <AnimatePresence>
                {showReviews && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-[var(--bg-tertiary)] border-t"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <div className="p-6 space-y-6">
                      {Comments.map((comment, index) => (
                        <div
                          key={index}
                          className="rounded border overflow-hidden text-left"
                          style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
                        >
                          <div
                            className="px-4 py-2 border-b bg-black/15 flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)]"
                            style={{ borderColor: 'var(--border)' }}
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center font-bold text-[9px] text-[var(--accent)]">
                                {comment.avatarText}
                              </div>
                              <span className="font-semibold text-[var(--text-secondary)]">{comment.author}</span>
                              <span>commented in {comment.time}</span>
                            </div>
                            <span
                              className="border px-2 py-0.5 rounded text-[8px] tracking-wider uppercase"
                              style={{ borderColor: 'var(--border)' }}
                            >
                              {comment.role}
                            </span>
                          </div>
                          <div className="p-4 font-sans text-sm leading-relaxed text-[var(--text-secondary)]">
                            {comment.body}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Contributions & Screenshots */}
      <section
        className="py-16 md:py-24 border-b"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
      >
        <div className="container-main text-center flex flex-col items-center">
          <div
            className={
              project.contributions.team.length > 0
                ? 'grid md:grid-cols-2 gap-12 mb-12 w-full text-left'
                : 'max-w-xl mx-auto mb-12 w-full text-left'
            }
          >
            {/* Owned by me */}
            <ScrollReveal>
              <h3 className="font-mono text-xs uppercase tracking-widest text-[var(--accent)] mb-4">
                {'// Aditya direct contributions'}
              </h3>
              <div
                className="p-6 rounded border"
                style={{ background: 'var(--bg-tertiary)', borderColor: 'var(--border)' }}
              >
                <ul className="space-y-3 text-sm">
                  {project.contributions.mine.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[var(--accent)]">▸</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>

            {/* Shared/Team */}
            {project.contributions.team.length > 0 && (
              <ScrollReveal>
                <h3 className="font-mono text-xs uppercase tracking-widest text-[var(--text-muted)] mb-4">
                  {'// Collaborative / shared efforts'}
                </h3>
                <div
                  className="p-6 rounded border"
                  style={{ background: 'var(--bg-tertiary)', borderColor: 'var(--border)' }}
                >
                  <ul className="space-y-3 text-sm">
                    {project.contributions.team.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[var(--text-muted)]">▸</span>
                        <span style={{ color: 'var(--text-muted)' }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            )}
          </div>

          {/* Screenshot Gallery */}
          {project.screenshots?.length > 0 && (
            <ScrollReveal className="w-full">
              <h3 className="font-mono text-xs uppercase tracking-widest text-[var(--accent)] mb-6 text-center">
                {'// System Interface Snapshots'}
              </h3>
              <div
                className="rounded-lg overflow-hidden border p-4 bg-black/10 w-full"
                style={{ borderColor: 'var(--border)' }}
              >
                <ScreenshotGallery screenshots={project.screenshots} captions={project.screenshotCaptions} />
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>

      {/* Footer Navigation */}
      <footer className="py-12" style={{ background: 'var(--bg-primary)' }}>
        <div className="container-main text-center">
          <button
            className="btn-ghost text-xs"
            onClick={() => {
              sessionStorage.setItem('scrollToSection', 'projects')
              navigate('/')
            }}
          >
            ← Return to workspace projects
          </button>
        </div>
      </footer>
    </div>
  )
}

export default ProjectDetail
