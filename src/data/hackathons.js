/**
 * hackathons.js — Hackathon data with experience stories for flip cards.
 */

export const hackathons = [
  {
    id: 'sih',
    name: 'Smart India Hackathon',
    short: 'SIH',
    year: '2025',
    org: 'Government of India',
    result: 'Participant',
    resultColor: 'muted',
    theme: 'EdTech / Government Systems',
    built: 'Automated attendance system — mobile app for teachers + web dashboard for officials',
    experience: {
      funny: `Six strangers walk into a hackathon. Nobody knows each other, nobody's really good at their thing yet, but everyone's somehow convinced they're about to build something that'll change Indian education. We had two mobile devs, three web devs, and one person who'd 'done some AI once.' Truly an Avengers moment — if the Avengers were all interns. My contribution to team morale: appoint a leader, then quietly do all the leading anyway.`,
      real: `The idea was solid — replace paper attendance in government schools with a QR scanner on student ID cards. Cheap, simple, no hardware dependency. We practiced the presentation obsessively. Then the judges asked us to skip the intro and jump straight to the solution. The silence in the room was deafening. We got rejected for not including RFID hardware — ironic, because sticking to software was the most practical decision we made. Lesson learned: sometimes judges want vision, not just pragmatism. I'd make the same call again though.`,
    },
  },
  {
    id: 'ctv',
    name: 'Cognizant Technoverse',
    short: 'CTv',
    year: '2026',
    org: 'Cognizant',
    result: 'Shortlisted — Round 2',
    resultColor: 'gold',
    theme: 'Insurance Claims Automation',
    built: 'Agentic node-based pipeline for automated insurance claim processing and validation',
    experience: {
      funny: `Team of four. Real contributors: two. We spent an entire day doing nothing but research and arguing with Claude about whether our idea was actually good or just sounded good. Spoiler: we couldn't tell either. At some point we just committed to it, I built the deck in one sitting, submitted it, and then forgot about it. Getting shortlisted felt genuinely shocking — not because the idea was bad, but because 'built in a hurry with existential doubt' is apparently a viable strategy.`,
      real: `The idea was insurance claims automation using an agentic pipeline — routing claims through validation, fraud detection, and approval nodes without human bottlenecks. Deep research day paid off: we understood the problem well enough to propose something technically sound. Shortlisted from our entire college among just two teams. Round 2 is ongoing — the node-based solution got accepted. Waiting on results, cautiously optimistic.`,
    },
  },
  {
    id: 'abc',
    name: 'Agent Builder Challenge',
    short: 'ABC',
    year: '2026',
    org: 'Capgemini',
    result: 'Shortlisted — Round 2',
    resultColor: 'gold',
    theme: 'Agentic AI Solutions',
    built: 'Agentic workflow solution — problem statement differs from Technoverse, same team and approach',
    experience: {
      funny: `You know how some people say lightning doesn't strike twice? We struck twice. Different problem, same chaotic process, same result: shortlisted. At this point I'm starting to think 'research hard, build fast, and trust the process' is genuinely a strategy and not just something people say on LinkedIn.`,
      real: `Different problem statement, same team, same methodical approach — heavy research upfront, clear problem framing, agentic node-based solution. The node-based architecture got accepted into Round 2 again. Two concurrent hackathons, both in Round 2. It's a lot to track, but it's validation that the way we approach problem-solving — understanding before building — actually works.`,
    },
  },
]
