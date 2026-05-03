/**
 * Skills.jsx
 * Grouped skill categories displayed as staggered pill/chip cards.
 * Each category animates in on scroll with staggered chips.
 */

import { motion } from 'framer-motion'
import SectionTitle from '../ui/SectionTitle'
import SkillBadge from '../ui/SkillBadge'
import { skillCategories } from '../../data/skills'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.85, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
}

const Skills = () => (
  <section
    id="skills"
    className="section-padding"
    style={{ background: 'var(--bg-primary)' }}
    aria-label="Skills and technical arsenal"
  >
    <div className="container-main">
      <SectionTitle number="03" title="Skills & Arsenal" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {skillCategories.map((category, catIdx) => (
          <motion.div
            key={category.id}
            className="p-6 rounded-lg"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: catIdx * 0.07, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ borderColor: 'var(--border-hover)', boxShadow: '0 4px 24px var(--glow)' }}
          >
            {/* Category header */}
            <p
              className="font-mono text-xs tracking-widest uppercase mb-4 font-medium"
              style={{ color: 'var(--accent-dim)' }}
            >
              {category.label}
            </p>

            {/* Skill chips */}
            <motion.div
              className="flex flex-wrap gap-2"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
            >
              {category.skills.map((skill) => (
                <motion.div key={skill} variants={badgeVariants}>
                  <SkillBadge label={skill} size="sm" />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
)

export default Skills
