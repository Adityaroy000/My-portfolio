/**
 * ProjectCard.jsx
 * Full-width project feature card with left gold border accent.
 * Includes "View Case Study →" button that navigates to /projects/:slug.
 * Uses framer-motion for hover glow and lift effect.
 *
 * Props:
 *  - project: object — a single project object from projects.js
 *  - index: number — used for stagger animation delay
 */

import { motion } from 'framer-motion'
import { FiGithub, FiExternalLink, FiArrowRight } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import SkillBadge from './SkillBadge'

const statusConfig = {
  live: { label: 'Live', dotColor: '#4ade80' },
  github: { label: 'GitHub', dotColor: '#E6C79C' },
  wip: { label: 'In Progress', dotColor: '#60a5fa' },
}

const ProjectCard = ({ project, index = 0 }) => {
  const navigate = useNavigate()
  const status = statusConfig[project.status] || statusConfig.wip
  const isWip = project.status === 'wip'

  return (
    <motion.article
      className="relative rounded-lg overflow-hidden"
      style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border)',
        borderRight: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        borderLeft: '4px solid var(--accent)',
      }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        y: -4,
        boxShadow: '0 8px 40px rgba(230,199,156,0.12)',
      }}
    >
      <div style={{ padding: 'var(--card-pad)' }}>
        {/* Top row: tech stack chips + project number */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <SkillBadge key={tech} label={tech} size="sm" />
            ))}
          </div>
          <span
            aria-hidden="true"
            className="font-display font-bold shrink-0"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              color: 'var(--accent)',
              opacity: 0.15,
              lineHeight: 1,
            }}
          >
            {project.id}
          </span>
        </div>

        {/* Role */}
        {project.role && (
          <p className="font-mono text-xs tracking-widest mb-2" style={{ color: 'var(--accent-dim)' }}>
            {project.role}
          </p>
        )}

        {/* Name */}
        <h3
          className="font-display font-semibold mb-2 leading-tight"
          style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', color: isWip ? 'var(--text-muted)' : 'var(--text-primary)' }}
        >
          {project.name}
        </h3>

        {/* Tagline */}
        <p className="font-sans mb-6" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          {project.tagline}
        </p>

        {/* Bullet points */}
        {project.bullets.length > 0 && (
          <ul className="space-y-2 mb-8">
            {project.bullets.map((bullet, i) => (
              <li key={i} className="flex items-start gap-3">
                <span style={{ color: 'var(--accent)', marginTop: '0.35rem', flexShrink: 0 }}>▸</span>
                <span className="font-sans text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {bullet}
                </span>
              </li>
            ))}
          </ul>
        )}

        {/* Bottom row: status + links + case study */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Status */}
          <span className="font-mono text-xs flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
            <span
              aria-hidden="true"
              className="inline-block rounded-full"
              style={{ width: 6, height: 6, background: status.dotColor, flexShrink: 0 }}
            />
            {status.label}
          </span>

          {/* Action links */}
          {!isWip && (
            <div className="flex items-center gap-3 flex-wrap">
              {project.github && (
                <motion.a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${project.name} on GitHub`}
                  className="btn-ghost"
                  style={{ padding: '0.45rem 1rem', fontSize: '0.75rem' }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <FiGithub size={14} /> GitHub
                </motion.a>
              )}
              {project.live && (
                <motion.a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${project.name} live demo`}
                  className="btn-ghost"
                  style={{ padding: '0.45rem 1rem', fontSize: '0.75rem' }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <FiExternalLink size={14} /> Live Demo
                </motion.a>
              )}
              {project.slug && (
                <motion.button
                  onClick={() => navigate(`/projects/${project.slug}`)}
                  aria-label={`View ${project.name} case study`}
                  className="btn-primary"
                  style={{ padding: '0.45rem 1.1rem', fontSize: '0.75rem' }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Case Study <FiArrowRight size={13} />
                </motion.button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.article>
  )
}

ProjectCard.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    slug: PropTypes.string,
    name: PropTypes.string.isRequired,
    tagline: PropTypes.string.isRequired,
    stack: PropTypes.arrayOf(PropTypes.string).isRequired,
    bullets: PropTypes.arrayOf(PropTypes.string).isRequired,
    github: PropTypes.string,
    live: PropTypes.string,
    status: PropTypes.string.isRequired,
    role: PropTypes.string,
  }).isRequired,
  index: PropTypes.number,
}

export default ProjectCard
