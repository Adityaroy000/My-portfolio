/**
 * Home.jsx
 * Wraps all portfolio sections into a single scrollable page.
 */

import Hero from '../components/sections/Hero'
import Workspace from '../components/sections/Workspace'
import About from '../components/sections/About'
import Skills from '../components/sections/Skills'
import Projects from '../components/sections/Projects'
import Achievements from '../components/sections/Achievements'
import Hackathons from '../components/sections/Hackathons'
import Education from '../components/sections/Education'
import DevSpecs from '../components/sections/DevSpecs'
import Contact from '../components/sections/Contact'

const Home = () => (
  <main>
    <Hero />
    <Workspace />
    <About />
    <Skills />
    <Projects />
    <Achievements />
    <Hackathons />
    <Education />
    <DevSpecs />
    <Contact />
  </main>
)

export default Home
