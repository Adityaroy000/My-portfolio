/**
 * ProjectDetail.jsx
 * Full case study page for a single project.
 * Accessed via /projects/:slug
 */

import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiArrowRight, FiExternalLink, FiGithub } from 'react-icons/fi'
import { projects } from '../data/projects'
import SkillBadge from '../components/ui/SkillBadge'
import ScreenshotGallery from '../components/ui/ScreenshotGallery'
import ScrollReveal from '../components/ui/ScrollReveal'

const statusConfig = {
  live: { label: 'Live', dotColor: '#4ade80' },
  github: { label: 'GitHub', dotColor: '#E6C79C' },
  wip: { label: 'In Progress', dotColor: '#60a5fa' },
}

const SectionDivider = () => <div style={{ height: 1, background: 'var(--border)', margin: '4rem 0' }} />

const ProjectDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()

  const projectIndex = projects.findIndex((p) => p.slug === slug)
  const project = projects[projectIndex]
  const prevProject = projects[projectIndex - 1] || null
  const nextProject = projects[projectIndex + 1] || null

  if (!project || project.status === 'wip') {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: 'var(--bg-primary)' }}
      >
        <p className="font-mono text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
          {'// project not found'}
        </p>
        <button className="btn-ghost" onClick={() => navigate('/')}>
          ← Back to Portfolio
        </button>
      </div>
    )
  }

  const status = statusConfig[project.status] || statusConfig.wip

  return (
    <motion.div
      className="min-h-screen"
      style={{ background: 'var(--bg-primary)' }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container-main py-28 md:py-32">
        {/* Back link */}
        <motion.button
          className="inline-flex items-center gap-2 font-mono text-sm mb-14 group"
          style={{ color: 'var(--text-muted)' }}
          onClick={() => navigate('/')}
          whileHover={{ color: 'var(--accent)', x: -4 }}
          transition={{ duration: 0.2 }}
          aria-label="Back to portfolio"
        >
          <FiArrowLeft size={14} />
          Back to Portfolio
        </motion.button>

        {/* Header */}
        <div className="mb-14">
          {/* Status + tech stack row */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-2 font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
              <span
                className="inline-block rounded-full"
                style={{ width: 7, height: 7, background: status.dotColor, flexShrink: 0 }}
                aria-hidden="true"
              />
              {status.label}
            </span>
            <span style={{ color: 'var(--border-hover)' }}>·</span>
            <span className="font-mono text-xs" style={{ color: 'var(--accent-dim)' }}>
              {project.role}
            </span>
            {project.team && (
              <>
                <span style={{ color: 'var(--border-hover)' }}>·</span>
                <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                  {project.team}
                </span>
              </>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {project.stack.map((tech) => (
              <SkillBadge key={tech} label={tech} size="sm" />
            ))}
          </div>

          {/* Name */}
          <h1
            className="font-display font-bold leading-tight mb-4"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            {project.name}
          </h1>

          {/* Tagline */}
          <p className="font-sans mb-8 max-w-2xl" style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            {project.tagline}
          </p>

          {/* Action links */}
          <div className="flex flex-wrap gap-4">
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                aria-label="View live demo"
              >
                <FiExternalLink size={15} /> Live Demo
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
                aria-label="View GitHub repository"
              >
                <FiGithub size={15} /> GitHub
              </a>
            )}
          </div>
        </div>

        <SectionDivider />

        {/* Overview */}
        {project.overview && (
          <ScrollReveal>
            <section aria-label="Project overview">
              <p className="font-mono text-xs tracking-widest mb-4" style={{ color: 'var(--accent-dim)' }}>
                {'// Overview'}
              </p>
              <p
                className="font-sans leading-relaxed max-w-3xl"
                style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.85 }}
              >
                {project.overview}
              </p>
            </section>
          </ScrollReveal>
        )}

        {/* Screenshots */}
        {project.screenshots?.length > 0 && (
          <>
            <SectionDivider />
            <ScrollReveal>
              <section aria-label="Project screenshots">
                <p className="font-mono text-xs tracking-widest mb-6" style={{ color: 'var(--accent-dim)' }}>
                  {'// UI Screenshots'}
                </p>
                <ScreenshotGallery screenshots={project.screenshots} captions={project.screenshotCaptions} />
              </section>
            </ScrollReveal>
          </>
        )}

        {/* Technical Deep Dive */}
        {project.technicalDeepDive && (
          <>
            <SectionDivider />
            <ScrollReveal>
              <section aria-label="Technical deep dive">
                <p className="font-mono text-xs tracking-widest mb-4" style={{ color: 'var(--accent-dim)' }}>
                  {'// Technical Deep Dive'}
                </p>
                <p
                  className="font-sans leading-relaxed max-w-3xl"
                  style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.85 }}
                >
                  {project.technicalDeepDive}
                </p>
              </section>
            </ScrollReveal>
          </>
        )}

        {/* Challenges */}
        {project.challenges?.length > 0 && (
          <>
            <SectionDivider />
            <ScrollReveal>
              <section aria-label="Challenges and solutions">
                <p className="font-mono text-xs tracking-widest mb-8" style={{ color: 'var(--accent-dim)' }}>
                  {'// Challenges & How I Solved Them'}
                </p>
                <div className="flex flex-col gap-6 max-w-3xl">
                  {project.challenges.map((c, i) => (
                    <motion.div
                      key={i}
                      className="p-6 rounded-lg"
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border)',
                        borderLeft: '3px solid var(--accent)',
                      }}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.12 }}
                    >
                      <h3
                        className="font-display font-semibold mb-3"
                        style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}
                      >
                        {c.title}
                      </h3>
                      <p
                        className="font-sans"
                        style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.75 }}
                      >
                        {c.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </section>
            </ScrollReveal>
          </>
        )}

        {/* Contributions */}
        {(project.contributions?.mine?.length > 0 || project.contributions?.team?.length > 0) && (
          <>
            <SectionDivider />
            <ScrollReveal>
              <section aria-label="Contributions breakdown">
                <p className="font-mono text-xs tracking-widest mb-8" style={{ color: 'var(--accent-dim)' }}>
                  {'// My Contributions vs Team'}
                </p>
                <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
                  {/* Mine */}
                  {project.contributions.mine.length > 0 && (
                    <div
                      className="p-6 rounded-lg"
                      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
                    >
                      <p className="font-mono text-xs tracking-widest mb-4" style={{ color: 'var(--accent)' }}>
                        {'// I owned'}
                      </p>
                      <ul className="space-y-2">
                        {project.contributions.mine.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }}>▸</span>
                            <span className="font-sans text-sm" style={{ color: 'var(--text-secondary)' }}>
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Team */}
                  {project.contributions.team.length > 0 && (
                    <div
                      className="p-6 rounded-lg"
                      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
                    >
                      <p className="font-mono text-xs tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>
                        {'// team contributed'}
                      </p>
                      <ul className="space-y-2">
                        {project.contributions.team.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: 2 }}>▸</span>
                            <span className="font-sans text-sm" style={{ color: 'var(--text-muted)' }}>
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            </ScrollReveal>
          </>
        )}

        {/* Prev / Next navigation */}
        <SectionDivider />
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {prevProject && prevProject.status !== 'wip' ? (
            <motion.button
              className="inline-flex items-center gap-3 group"
              onClick={() => navigate(`/projects/${prevProject.slug}`)}
              whileHover={{ x: -6 }}
              aria-label={`Previous project: ${prevProject.name}`}
            >
              <FiArrowLeft size={18} style={{ color: 'var(--accent)' }} />
              <div className="text-left">
                <p className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                  Prev Project
                </p>
                <p className="font-display font-medium" style={{ color: 'var(--text-primary)', fontSize: '1.1rem' }}>
                  {prevProject.name}
                </p>
              </div>
            </motion.button>
          ) : (
            <div />
          )}

          {nextProject && nextProject.status !== 'wip' ? (
            <motion.button
              className="inline-flex items-center gap-3 text-right group"
              onClick={() => navigate(`/projects/${nextProject.slug}`)}
              whileHover={{ x: 6 }}
              aria-label={`Next project: ${nextProject.name}`}
            >
              <div className="text-right">
                <p className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                  Next Project
                </p>
                <p className="font-display font-medium" style={{ color: 'var(--text-primary)', fontSize: '1.1rem' }}>
                  {nextProject.name}
                </p>
              </div>
              <FiArrowRight size={18} style={{ color: 'var(--accent)' }} />
            </motion.button>
          ) : (
            <div />
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default ProjectDetail
