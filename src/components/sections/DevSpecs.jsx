/**
 * DevSpecs.jsx
 * Interactive CS Developer Principles Dashboard. Features:
 *  - Live LeetCode/GFG visual progress charts and metrics.
 *  - Interactive DRY code refactoring slider showing clean vs redundant code.
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionTitle from '../ui/SectionTitle'
import { FiCode, FiActivity, FiLayers, FiCheck } from 'react-icons/fi'
import dsaStats from '../../data/dsa_stats.json'

const WET_CODE = `// ❌ REDUNDANT (WET) CODE: Scattered database RBAC checks in every express endpoint
app.get('/api/athletes', (req, res) => {
  const user = req.user;
  if (user.role === 'admin' || user.role === 'coordinator' || user.role === 'manager') {
    // Database visibility query filtering by jurisdiction
    db.collection('athletes').find({ district: user.district }).toArray((err, data) => {
      res.json(data);
    });
  } else {
    res.status(403).send("Unauthorized Access");
  }
});

app.post('/api/athletes', (req, res) => {
  const user = req.user;
  if (user.role === 'admin' || user.role === 'coordinator') {
    db.collection('athletes').insertOne(req.body, (err, result) => {
      res.json(result);
    });
  } else {
    res.status(403).send("Unauthorized Access");
  }
});`

const DRY_CODE = `//  CLEAN (DRY) CODE: Declared central custom authorization middleware
const authorize = (action, resource) => {
  return async (req, res, next) => {
    // Database-driven RBAC guard checking dynamic actions and scopes
    const permitted = await RbacGuard.check(req.user.role, action, resource);
    if (!permitted) return res.status(403).json({ error: 'Forbidden' });
    
    // Auto scoping dynamic queries using jurisdiction scope builder
    req.dbQuery = queryScoper(req.user);
    next();
  };
};

app.get('/api/athletes', authorize('read', 'athletes'), async (req, res) => {
  const data = await db.collection('athletes').find(req.dbQuery).toArray();
  res.json(data);
});

app.post('/api/athletes', authorize('create', 'athletes'), async (req, res) => {
  const result = await db.collection('athletes').insertOne(req.body);
  res.json(result);
});`

const DevSpecs = () => {
  const [isDry, setIsDry] = useState(false)

  return (
    <section
      id="specs"
      className="section-padding"
      style={{ background: 'var(--bg-primary)' }}
      aria-label="Developer Specifications and Philosophy"
    >
      <div className="container-main">
        <SectionTitle number="08" title="Dev Dashboard & Specs" />

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* LEFT — Competitive Programming & DSA Dashboard */}
          <div className="space-y-6 text-left">
            <h3 className="font-display font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
              🧠 Competitive Programming & DSA Stats
            </h3>
            <p className="font-sans text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Real metrics from LeetCode ({dsaStats.leetcode.solved} solved, contest rating {dsaStats.leetcode.contest_rating.toLocaleString()}) and GeeksForGeeks ({dsaStats.gfg.solved} solved, rank {dsaStats.gfg.institute_rank} at KIIT).
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* LeetCode stats card */}
              <div className="p-5 rounded border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
                <p className="font-mono text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--accent)' }}>
                  Leetcode Profile
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>Solved Total:</span>
                    <span className="font-semibold text-white">{dsaStats.leetcode.solved}</span>
                  </div>
                  {/* Progress bars */}
                  <div className="space-y-1 pt-2">
                    <div className="flex justify-between text-[10px]">
                      <span>Easy</span>
                      <span>{dsaStats.leetcode.easy}/946</span>
                    </div>
                    <div className="w-full h-1.5 bg-black/35 rounded-full overflow-hidden">
                      <div className="h-full bg-green-400" style={{ width: `${(dsaStats.leetcode.easy / 946 * 100).toFixed(1)}%` }} />
                    </div>
                    
                    <div className="flex justify-between text-[10px] pt-1">
                      <span>Medium</span>
                      <span>{dsaStats.leetcode.medium}/2061</span>
                    </div>
                    <div className="w-full h-1.5 bg-black/35 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400" style={{ width: `${(dsaStats.leetcode.medium / 2061 * 100).toFixed(1)}%` }} />
                    </div>

                    <div className="flex justify-between text-[10px] pt-1">
                      <span>Hard</span>
                      <span>{dsaStats.leetcode.hard}/937</span>
                    </div>
                    <div className="w-full h-1.5 bg-black/35 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-400" style={{ width: `${(dsaStats.leetcode.hard / 937 * 100).toFixed(1)}%` }} />
                    </div>
                  </div>
                  <div className="border-t pt-3 mt-3 flex justify-between font-mono text-[10px]">
                    <span>Contest Rating:</span>
                    <span className="text-[var(--accent)]">{dsaStats.leetcode.contest_rating.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* GFG stats card */}
              <div className="p-5 rounded border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
                <p className="font-mono text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--accent)' }}>
                  GeeksForGeeks Profile
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>Solved Total:</span>
                    <span className="font-semibold text-white">{dsaStats.gfg.solved}</span>
                  </div>
                  {/* Progress bars */}
                  <div className="space-y-1 pt-2">
                    <div className="flex justify-between text-[10px]">
                      <span>Easy</span>
                      <span>{dsaStats.gfg.easy}</span>
                    </div>
                    <div className="w-full h-1.5 bg-black/35 rounded-full overflow-hidden">
                      <div className="h-full bg-green-400" style={{ width: `${(dsaStats.gfg.easy / dsaStats.gfg.solved * 100).toFixed(1)}%` }} />
                    </div>
                    
                    <div className="flex justify-between text-[10px] pt-1">
                      <span>Medium</span>
                      <span>{dsaStats.gfg.medium}</span>
                    </div>
                    <div className="w-full h-1.5 bg-black/35 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400" style={{ width: `${(dsaStats.gfg.medium / dsaStats.gfg.solved * 100).toFixed(1)}%` }} />
                    </div>

                    <div className="flex justify-between text-[10px] pt-1">
                      <span>Hard</span>
                      <span>{dsaStats.gfg.hard}</span>
                    </div>
                    <div className="w-full h-1.5 bg-black/35 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-400" style={{ width: `${(dsaStats.gfg.hard / dsaStats.gfg.solved * 100).toFixed(1)}%` }} />
                    </div>
                  </div>
                  <div className="border-t pt-3 mt-3 flex justify-between font-mono text-[10px]">
                    <span>KIIT University Rank:</span>
                    <span className="text-[var(--accent)]">#{dsaStats.gfg.institute_rank}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Environment Specs */}
            <div className="p-4 rounded border font-mono text-xs" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
              <p className="font-mono text-xs tracking-wider mb-2 text-[var(--accent)]">{'// System Specs'}</p>
              <div className="grid grid-cols-2 gap-2 text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                <div>OS: Windows 11</div>
                <div>Shell: PowerShell / cmd</div>
                <div>IDE: VS Code (Dark Theme)</div>
                <div>Navigation: Standard Keyboard/Mouse</div>
              </div>
            </div>
          </div>

          {/* RIGHT — Interactive DRY Refactoring Code comparison */}
          <div className="space-y-4 text-left">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
                ⚖️ The DRY Principle in Action
              </h3>
              <button
                onClick={() => setIsDry(!isDry)}
                className="btn-ghost flex items-center gap-2 cursor-pointer"
                style={{ padding: '0.4rem 0.9rem', fontSize: '10px' }}
              >
                {isDry ? <FiCheck /> : <FiCode />}
                {isDry ? 'View Wet Code' : 'Refactor Code'}
              </button>
            </div>

            <p className="font-sans text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              See how duplication is replaced with clean backend abstraction. Slider code shows the actual Wushu-MIS authorization refactoring.
            </p>

            <div
              className="rounded-lg overflow-hidden border font-mono text-[10px] leading-relaxed shadow-lg relative h-[360px] flex flex-col"
              style={{ background: 'var(--bg-tertiary)', borderColor: 'var(--border)' }}
            >
              {/* Header bar */}
              <div className="px-4 py-2 border-b bg-black/15 flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                <span className="text-[9px] text-[var(--text-muted)]">
                  {isDry ? 'controllers/athletes.dry.js' : 'controllers/athletes.wet.js'}
                </span>
                <span className="w-2 h-2 rounded-full" style={{ background: isDry ? '#4ade80' : '#ff5f56' }} />
              </div>

              {/* Code Pane */}
              <div className="flex-1 p-4 overflow-auto custom-scrollbar">
                <AnimatePresence mode="wait">
                  <motion.pre
                    key={isDry}
                    initial={{ opacity: 0, x: isDry ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isDry ? -20 : 20 }}
                    transition={{ duration: 0.3 }}
                    style={{ whiteSpace: 'pre', fontFamily: 'var(--font-mono)', color: isDry ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                  >
                    {isDry ? DRY_CODE : WET_CODE}
                  </motion.pre>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DevSpecs
