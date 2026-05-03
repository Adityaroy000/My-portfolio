/**
 * useActiveSection.js
 * Tracks which section ID is currently most visible in the viewport.
 * Used by the Navbar to highlight the active navigation link.
 *
 * @param {string[]} sectionIds - Array of section element IDs to observe
 * @param {number} [threshold=0.3] - IntersectionObserver threshold
 * @returns {string} activeSection - The ID of the currently active section
 */

import { useEffect, useState } from 'react'

const useActiveSection = (sectionIds, threshold = 0.3) => {
  const [activeSection, setActiveSection] = useState(sectionIds[0] || '')

  useEffect(() => {
    if (!sectionIds.length) return

    const observers = []

    const callback = (sectionId) => (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(sectionId)
        }
      })
    }

    sectionIds.forEach((id) => {
      const element = document.getElementById(id)
      if (!element) return

      const observer = new IntersectionObserver(callback(id), {
        threshold,
        rootMargin: '-20% 0px -60% 0px',
      })

      observer.observe(element)
      observers.push(observer)
    })

    return () => observers.forEach((obs) => obs.disconnect())
  }, [sectionIds, threshold])

  return activeSection
}

export default useActiveSection
