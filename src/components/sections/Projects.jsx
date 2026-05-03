/**
 * Projects.jsx
 * Vertical stack of full-width feature project cards.
 * Each card uses ProjectCard component with staggered scroll entrance.
 */

import SectionTitle from '../ui/SectionTitle'
import ProjectCard from '../ui/ProjectCard'
import { projects } from '../../data/projects'

const Projects = () => (
  <section
    id="projects"
    className="section-padding"
    style={{ background: 'var(--bg-secondary)' }}
    aria-label="Projects and work"
  >
    <div className="container-main">
      <SectionTitle number="04" title="Projects" />

      <div className="flex flex-col gap-8">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </div>
  </section>
)

export default Projects
