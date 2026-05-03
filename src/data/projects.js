/**
 * projects.js — Full project data including case study content for ProjectDetail pages.
 */

export const projects = [
  {
    id: '01',
    slug: 'wushu-mis',
    name: 'Wushu Sports Management Platform',
    tagline: 'Live SaaS platform powering national Wushu championship operations',
    stack: ['Node.js', 'Express.js', 'MongoDB', 'React', 'Zustand', 'JWT', 'SSE', 'Cloudinary'],
    role: 'Lead Full-Stack Developer',
    team: 'Team of 5',
    status: 'live',
    live: 'https://wushu-mis-frontend.onrender.com/',
    github: null,
    bullets: [
      'Architected a 233-endpoint REST API powering multi-role championship management across national, state & district levels',
      'Engineered database-driven RBAC with hierarchical roles and jurisdiction-based filtering for fine-grained access control',
      'Designed 30+ MongoDB collections with aggregation pipelines, indexing & selective denormalization for large-scale athlete data',
      'Built real-time notification pipelines using SSE and JWT auth with httpOnly cookies & refresh-token rotation',
    ],
    overview: `Wushu-MIS is a live, production SaaS platform built to digitise and manage the entire lifecycle of Wushu sports championships — from athlete registration and team formation to fixture scheduling, result tracking, and grievance management. It serves national, state, and district-level operations, handling hundreds of real athletes and coordinators simultaneously. The platform was born out of a real need: championship management was being done manually, on spreadsheets and paper, causing errors, delays, and total chaos at scale. We built the system that eliminated all of that.`,
    technicalDeepDive: `The backend is a 233-endpoint REST API built with Node.js and Express, structured around event-scoped workflows — meaning every operation (registration, approval, fixture) is scoped to a specific championship event, not global. This was a deliberate architectural decision to support concurrent events at different administrative levels without data collision. The RBAC system is fully database-driven — roles and their permissions live in MongoDB, not in code constants, making it dynamic and reconfigurable without deployments. MongoDB was chosen for its flexible schema model, which was critical because different Wushu categories have different rules, fees, and athlete requirements. Aggregation pipelines handle all the heavy cross-collection queries efficiently. Real-time updates are served via Server-Sent Events (SSE) instead of WebSockets — a deliberate tradeoff for simplicity and Render deployment compatibility.`,
    challenges: [
      {
        title: 'Designing RBAC for a 5-level administrative hierarchy',
        description:
          "The platform has national admins, state admins, district coordinators, team managers, and athletes — each with different permissions scoped to different events and jurisdictions. A flat role system wouldn't work. I designed a database-driven hierarchical model where each role document defines its permissions and jurisdiction scope, allowing dynamic access control without a single code change.",
      },
      {
        title: 'Keeping real-time updates reliable on a free-tier deployment',
        description:
          "WebSockets don't work well on Render's free tier due to connection limits. I switched to SSE — a one-way server-push model — which is perfectly suited for notification pipelines (you rarely need the client to push back in real-time). This kept the feature working reliably without infrastructure costs.",
      },
      {
        title: 'Handling multi-stage approval workflows without race conditions',
        description:
          'The registration pipeline has 3 stages: team manager submits → coordinator reviews → admin approves. Concurrent approvals could cause state inconsistencies. I implemented MongoDB-level atomic updates with strict status-transition validation, ensuring no two operations could move a registration to conflicting states simultaneously.',
      },
    ],
    contributions: {
      mine: [
        'Entire backend architecture and all 233 API endpoints',
        'Database schema design across 30+ collections',
        'RBAC system design and implementation',
        'JWT authentication, refresh token rotation, httpOnly cookie setup',
        'SSE real-time notification pipeline',
        'Winston structured logging and centralized error handling',
        'Deployment setup on Render with Cloudinary integration',
        'API documentation and testing via Postman',
      ],
      team: [
        'Frontend UI/UX design and React component development (shared)',
        'Zustand state management integration on frontend',
        'QA testing and bug reporting',
        'Product requirements and feature scoping (collaborative)',
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
    slug: 'coming-soon',
    name: 'Next Build — Coming Soon',
    tagline: "Something's cooking...",
    stack: [],
    role: '',
    team: '',
    status: 'wip',
    live: null,
    github: null,
    bullets: [],
    overview: '',
    technicalDeepDive: '',
    challenges: [],
    contributions: { mine: [], team: [] },
    screenshots: [],
    screenshotCaptions: [],
  },
]
