/**
 * Home.jsx
 * Wraps all portfolio sections into a single scrollable page.
 * Implements initial scroll restoration to ensure fresh loads start at the top.
 */

import { useEffect } from 'react'
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

const Home = () => {
  useEffect(() => {
    // Prevent browser auto-scroll restoration on fresh loads, except when navigating to hash anchors
    const hasHash = window.location.hash && window.location.hash !== '#/'
    const pendingScroll = sessionStorage.getItem('scrollToSection')

    if (!hasHash && !pendingScroll) {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual'
      }
      window.scrollTo(0, 0)
    }
  }, [])

  return (
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
}

export default Home
