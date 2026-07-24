/**
 * projects.js — Full project data including case study content for ProjectDetail pages.
 */

export const projects = [
  {
    id: '01',
    slug: 'wushu-mis',
    name: 'Wushu Sports Management Platform',
    tagline: 'Live SaaS platform powering national Wushu championship operations',
    stack: ['Node.js', 'Express.js', 'MongoDB', 'React', 'Zustand', 'Socket.io', 'ExcelJS', 'jsPDF', 'Framer Motion'],
    role: 'Lead Full-Stack Developer',
    team: 'Team of 5',
    status: 'live',
    live: 'https://wushu-mis-frontend.onrender.com/',
    github: null,
    bullets: [
      'Architected an event-scoped REST API handling multi-tier tournament lifecycle operations across national, state, and district bodies',
      'Engineered an in-memory live scoring cache (saving 95% DB writes) with Socket.io real-time streaming (<5ms latency)',
      'Programmed a custom single-elimination bracket generation algorithm with teammate state-avoidance constraints',
      'Built secure Excel templates verified via SHA-256 HMAC cryptographic signatures to prevent cross-event upload exploits',
    ],
    overview: `Wushu-MIS is a live, production-grade tournament orchestration and athlete registration SaaS platform built for sports federations. The platform handles the full lifecycle of championship events — from circular rules configuration and bulk athlete rosters to single-elimination bracket drawings, judge mat mappings, live score boards, and grievances. Originally, tournament orchestration was handled manually via spreadsheets and paper, resulting in scheduling bottlenecks and errors. This platform digitized the entire pipeline, managing concurrent events across national, state, and district boundaries without collisions.`,
    technicalDeepDive: `The system's backend is a structured Node.js/Express API designed with event-scoped data isolation. MongoDB with Mongoose handles athlete registration mappings. Real-time judge scoring during Sanda bouts uses an in-memory Map cache to capture high-frequency clicks. Instead of writing each score click directly to MongoDB — which caused database write locks — scores write instantly to RAM, broadcast to spectator screens via Socket.io in <5ms, and are flushed in batch to the DB every 2 seconds. The tournament drawing engine features an automated single-elimination bye priority resolver (supporting power-of-2 trees) and teammate avoidance logic to keep representatives of the same state from knocking each other out in the first round.`,
    challenges: [
      {
        title: 'Database Lockups During Scoring Bouts',
        description:
          'Simultaneous referee clicks caused MongoDB write-lock congestions. I built an in-memory cache to ingest scoring clicks in RAM, broadcast live tallies via Socket.io, and batch-save to MongoDB every 2 seconds, reducing database writes by 95%.',
      },
      {
        title: 'Cross-Event Excel Upload Security Exploits',
        description:
          'Managers bypassed validation by uploading templates from other events. I implemented a security verification layer that hashes the event ID and administrator level using a SHA-256 HMAC signature hidden in the generated Excel template. The upload is rejected if the signature verification fails.',
      },
      {
        title: 'Early-Round Teammate Elimination',
        description:
          'Standard bracket drawing paired teammates in initial rounds. I programmed a pairing algorithm that groups athletes with state-avoidance logic, ensuring teammates only compete in later rounds unless only teammates remain.',
      },
    ],
    contributions: {
      mine: [
        'Entire backend architecture and all 233 Express API endpoints',
        'In-memory scoring cache and Socket.io live streaming engine',
        'Custom bracket drawing and state-avoidance pairing algorithm',
        'ExcelJS template generator with SHA-256 HMAC checksum verification',
        'Dynamic database-driven RBAC schema and express middleware guards',
        'Super Admin diagnostics and selective tournament purger',
      ],
      team: [
        'Frontend component development and styling (collaborative)',
        'Zustand global client-state integration',
        'QA testing and end-to-end user testing feedback',
      ],
    },
    screenshots: ['/projects/home.png', '/projects/Admin_home.png', '/projects/circular.png', '/projects/fixture.png'],
    screenshotCaptions: [
      'Home page - public view',
      'Admin dashboard',
      'Circular declaration page - circular generated',
      'Fixture & Draw Management',
    ],
  },
  {
    id: '02',
    slug: 'transformer-intelligence-desk',
    name: 'Transformer Intelligence Desk',
    tagline: 'Agentic RAG system that dynamically routes queries and self-corrects using LLM-as-a-Judge',
    stack: ['LangGraph', 'Groq (Llama-3)', 'ChromaDB', 'SentenceTransformers', 'Python', 'Streamlit'],
    role: 'Solo Developer',
    team: 'Solo',
    status: 'github',
    live: null,
    github: 'https://github.com/Adityaroy000/Transformer-Intelligence-Desk',
    bullets: [
      'Architected an intelligent QA system using LangGraph to dynamically route queries between retrieval, calculation & memory',
      'Built a hybrid multi-query ChromaDB vector store with a secure Python sandbox — eliminating LLM hallucinations on math',
      'Engineered a continuous LLM-as-a-Judge evaluation loop triggering retries when faithfulness score falls below 0.7',
      'Implemented MemorySaver for persistent multi-turn context with seamless API fallback pool for high availability',
    ],
    overview: `Transformer Intelligence Desk (TID) is an agentic QA system built specifically for querying and reasoning over Transformer architecture knowledge — the foundational AI research that powers modern LLMs. The core problem it solves: standard RAG systems retrieve text and dump it into an LLM, which then hallucinates confidently when it doesn't know something. TID routes queries intelligently — if it's a factual question, it retrieves from the vector store. If it's a mathematical question (attention head counts, parameter math), it runs a secure Python sandbox instead of letting the LLM guess. And if the final answer scores below 0.7 on a faithfulness metric, it automatically retries with adjusted prompts.`,
    technicalDeepDive: `LangGraph was chosen over a simple chain because the routing logic requires conditional branching — a linear pipeline can't decide "should I retrieve, calculate, or just answer from memory?" LangGraph's node-edge model made this explicit and debuggable. ChromaDB stores vector embeddings generated by SentenceTransformers, using a hybrid multi-query retrieval strategy — multiple rephrased versions of the same question are embedded and queried in parallel, then results are merged and deduplicated. This dramatically improves recall on complex questions. The Python sandbox is a restricted exec environment that evaluates mathematical expressions extracted from the query, returning exact numeric answers rather than LLM approximations. Groq's Llama-3.3-70b is used as the primary model for its speed and quality, with a fallback pool handling rate limit errors gracefully.`,
    challenges: [
      {
        title: 'LLM hallucinations on hyperparameter mathematics',
        description:
          "When asked 'how many parameters does a 12-layer BERT have?', LLMs confidently produce wrong numbers. The solution was intercepting math-type queries before they hit the LLM and routing them to a Python sandbox that computes exact answers from known formulas. The LLM then only narrates the result, not computes it.",
      },
      {
        title: 'Building a self-correcting evaluation loop',
        description:
          "Standard RAG has no quality gate — it generates and serves. I added an LLM-as-a-Judge step that scores each response on faithfulness to the retrieved context. Scores below 0.7 trigger a retry with a more constrained prompt instructing the model to stay strictly grounded. This loop runs up to 3 times before falling back to a 'low confidence' response.",
      },
      {
        title: 'Rate limit resilience without degraded UX',
        description:
          'Groq has aggressive rate limits on free tier. I built a fallback pool of API configurations that rotates automatically on 429 errors, maintaining conversation continuity with zero user-facing disruption.',
      },
    ],
    contributions: {
      mine: [
        'Entire system architecture — LangGraph node graph design',
        'ChromaDB vector store setup with hybrid multi-query retrieval',
        'Python sandbox implementation for mathematical query handling',
        'LLM-as-a-Judge evaluation loop with retry logic',
        'MemorySaver integration for persistent multi-turn context',
        'API fallback pool for rate limit resilience',
        'Streamlit UI and end-to-end integration',
      ],
      team: [],
    },
    screenshots: ['/projects/Agentic_home.png', '/projects/Detail.png'],
    screenshotCaptions: ['Agentic QA Interface - Streamlit UI', 'Detail Analysis View - Model Parameters Breakdown'],
  },
  {
    id: '03',
    slug: 'wushu-assessment-platform',
    name: 'Wushu Assessment Platform',
    tagline: 'Secure, offline-resilient digital testing and licensing ecosystem for sports officials',
    stack: [
      'React',
      'Vite',
      'Tailwind CSS',
      'React Hook Form',
      'Zod',
      'Node.js',
      'Express.js',
      'MongoDB',
      'PDFKit',
      'Mammoth.js',
    ],
    role: 'Solo Developer',
    team: 'Solo',
    status: 'live',
    live: 'https://wap-snowy.vercel.app/',
    github: null,
    bullets: [
      'Built a document ingestion pipeline parsing Microsoft Word XML and PDF exam templates using Mammoth.js & custom regex tokens',
      'Engineered a sequence-numbered networking protocol protecting candidate auto-saves from out-of-order write race conditions',
      'Implemented a server-authoritative visual timer comparing active session deadlines with NTP clocks, allowing a 15s transit lag grace period',
      'Designed User-Agent and IP SHA-256 device-binding locks to block concurrent multi-device logins and credential sharing',
    ],
    overview: `WAP is a full-stack digital testing and licensing ecosystem designed specifically for certifying official Wushu judges and referees in Sanda and Taolu disciplines. Traditionally, certification exams were paper-based, requiring manual routing of candidates, manual grading, and manual compilation of marks — a slow, error-prone, and un-auditable process. WAP solves these issues by offering a zero-barrier intake portal, a server-secured mobile exam runner with offline auto-save capabilities, and an administrative dashboard that auto-grades theory exams while compiling unified practical floor scores into landscape PDFs locally.`,
    technicalDeepDive: `The platform parses Microsoft Word .docx and .pdf files directly on upload. The backend ingestion engine extracts XML text using Mammoth.js and feeds it to a state-machine tokenizer that isolates questions, filters multiple-choice options (A-D), matches correct keys, and batch-inserts polymorphic documents to MongoDB. Candidate exam sessions run under strict server-authoritative controls: a visual browser timer simulates the countdown, but the true deadline is locked in the database on test start. To safeguard against unstable mobile networks, the client attaches sequence numbers to auto-save payloads, and the database updates are restricted to higher sequence numbers, preventing late-arriving packets from overwriting newer selections. Device sharing is blocked by hashing User-Agent and IP parameters into a SHA-256 footprint lock.`,
    challenges: [
      {
        title: 'Automatic Exam Ingestion from Microsoft Word',
        description:
          'Copy-pasting exam sheets into forms is slow and error-prone. I built a regex tokenizer using Mammoth.js to parse docx XML strings on the backend, extracting questions, matching option patterns, identifying correct keys, and batch-saving to MongoDB.',
      },
      {
        title: 'Stale Overwrites from Congested Mobile Networks',
        description:
          'Unstable networks cause out-of-order HTTP saves. If a candidate edits an answer, and the first request gets delayed in transit, it could overwrite a newer answer on arrival. I implemented sequence-numbered payloads, where the database rejects updates carrying a sequence number lower than the stored value.',
      },
      {
        title: 'Client-Side Exam Clock Manipulation',
        description:
          'Candidates can tamper with browser timers by changing system clocks. The visual countdown is purely a client simulation; the backend locks the session deadline at start time + duration, and validates all auto-saves against the server NTP clock, with a 15-second grace period for transit lag.',
      },
      {
        title: 'Credential Sharing and Double Logins',
        description:
          'Candidates sharing links allows concurrent test runners. I implemented a device footprint lock that hashes the User-Agent and IP address on intake. All subsequent HTTP calls must match the hash, otherwise the session is locked.',
      },
    ],
    contributions: {
      mine: [
        'Ingestion engine parsing Mammoth.js text with regex state tokenizers',
        'Sequence-numbered auto-save and out-of-order write drops',
        'Server-authoritative NTP deadline validation logic',
        'SHA-256 User-Agent and IP footprint device-binding locks',
        'Local landscape PDF compilation via PDFKit',
        'Candidate routing gate (intake registry)',
      ],
      team: [],
    },
    screenshots: [
      '/projects/wap_intake.png',
      '/projects/wap_runner.png',
      '/projects/wap_admin.png',
      '/projects/wap_submit.png',
      '/projects/wap_results.png',
    ],
    screenshotCaptions: [
      'Candidate Intake Gate — Phone validation & device binding',
      'Mobile Exam Runner — Secure countdown and auto-save indicators',
      'Admin Dashboard — Word document parsing interface & hybrid mark sheet',
      'Candidate Submission — Result sheet & confirmation',
      'Admin Results Dashboard — Compile practical floor marks & print landscape PDFs',
    ],
  },
]
