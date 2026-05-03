/**
 * Home.jsx
 * Wraps all portfolio sections into a single scrollable page.
 */

import Hero from '../components/sections/Hero'
import About from '../components/sections/About'
import Skills from '../components/sections/Skills'
import Projects from '../components/sections/Projects'
import Achievements from '../components/sections/Achievements'
import Hackathons from '../components/sections/Hackathons'
import Education from '../components/sections/Education'
import Contact from '../components/sections/Contact'

const Home = () => (
  <main>
    <Hero />
    <About />
    <Skills />
    <Projects />
    <Achievements />
    <Hackathons />
    <Education />
    <Contact />
  </main>
)

export default Home
