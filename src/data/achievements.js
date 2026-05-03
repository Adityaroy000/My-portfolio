/**
 * achievements.js — Awards and recognition data
 * Used by the Achievements section component.
 */

export const achievements = [
  {
    id: 'amazon-ml',
    icon: 'graduation',
    title: 'Amazon ML Summer School 2025',
    subtitle: 'Selected Student · Jul–Aug 2025',
    description:
      "Selected among top engineering students across India for Amazon's national machine learning mentorship program — a highly competitive, invite-only cohort.",
    credential: null,
    featured: true,
  },
  {
    id: 'kiit-dsa',
    icon: 'trophy',
    title: 'Top 10 — KIIT DSA Championship',
    subtitle: 'Out of 600+ participants · Oct 2024',
    description:
      'Ranked in the top 10 out of 600+ participants in a university-wide DSA competition. Consistently solving algorithmic problems — 500+ on LeetCode, 200+ on GeeksForGeeks.',
    credential: null,
    featured: true,
  },
]

export const codingStats = [
  { label: 'Problems Solved', value: 700, suffix: '+' },
  { label: 'LeetCode', value: 500, suffix: '+' },
  { label: 'GeeksForGeeks', value: 200, suffix: '+' },
]
