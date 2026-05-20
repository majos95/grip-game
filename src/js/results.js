import { computeStats } from './scoring.js'

const NS = 'http://www.w3.org/2000/svg'
const toRad = deg => deg * Math.PI / 180

const AXES = [
  { domain: 'experience',   angle: -90, color: '#FF4D4D', label: 'Experience' },
  { domain: 'foundation',   angle:  30, color: '#3626EF', label: 'Foundation' },
  { domain: 'intelligence', angle: 150, color: '#6B3FA0', label: 'Intelligence' },
]

const DOMAIN_LABELS = { experience: 'Experience', foundation: 'Foundation', intelligence: 'Intelligence' }

export function renderResults(roundResults) {
  const stats = computeStats(roundResults)

  // Top stats
  animateNumber(document.getElementById('results-score'), stats.totalScore)
  document.getElementById('results-accuracy').textContent = Math.round(stats.accuracy * 100) + '%'
  document.getElementById('results-speed').textContent = stats.avgSpeed.toFixed(1) + 's'

  // Domain breakdown bars
  renderBreakdown(stats.domainStats)

  // Spider diagram
  drawSpider(stats.domainAccuracies)

  // Blind spot insight
  const insightEl = document.getElementById('insight-text')
  insightEl.textContent = getInsightText(computeBlindSpot(stats.domainAccuracies))
  insightEl.classList.remove('visible')
  requestAnimationFrame(() => requestAnimationFrame(() => insightEl.classList.add('visible')))

  // Per-question review
  renderReview(roundResults)

  return stats
}

// ── Domain breakdown bars ────────────────────────────

function renderBreakdown(domainStats) {
  for (const domain of ['experience', 'foundation', 'intelligence']) {
    const row = document.querySelector(`.breakdown-row[data-domain="${domain}"]`)
    const ds = domainStats[domain]
    const pct = Math.round(ds.accuracy * 100)

    row.querySelector('.breakdown-fill').style.width = pct + '%'
    row.querySelector('.breakdown-count').textContent = `${ds.correct}/${ds.total}`
  }
}

// ── Per-question review list ─────────────────────────

function renderReview(roundResults) {
  const list = document.getElementById('review-list')
  list.innerHTML = roundResults.map(r => {
    const s        = r.scenario
    const timedOut = r.selected === null
    const correct  = r.correct

    const truncated = s.scenario.length > 85
      ? s.scenario.slice(0, 85).trimEnd() + '…'
      : s.scenario

    const statusClass = correct ? 'correct' : 'wrong'
    const statusIcon  = correct ? '✓' : '✗'

    const correctTag = `<span class="review-domain ${s.domain}">${DOMAIN_LABELS[s.domain]}</span>`

    const answerLine = timedOut
      ? `<div class="review-answer"><span class="review-timed-out">Timed out</span>${correctTag}</div>`
      : correct
        ? `<div class="review-answer">${correctTag}</div>`
        : `<div class="review-answer">
             <span class="review-picked ${r.selected}">${DOMAIN_LABELS[r.selected]}</span>
             <span class="review-arrow">→</span>
             ${correctTag}
           </div>`

    const wrongNote = !correct && !timedOut
      ? `<p class="review-why-note">You picked <strong>${DOMAIN_LABELS[r.selected]}</strong> — here's why <strong>${DOMAIN_LABELS[s.domain]}</strong> is the right layer:</p>`
      : timedOut
        ? `<p class="review-why-note">Time ran out — here's why <strong>${DOMAIN_LABELS[s.domain]}</strong> is the right layer:</p>`
        : `<p class="review-why-note">Why <strong>${DOMAIN_LABELS[s.domain]}</strong>:</p>`

    return `
      <li class="review-item ${statusClass}">
        <details>
          <summary class="review-summary">
            <span class="review-status">${statusIcon}</span>
            <div class="review-body">
              <p class="review-text">${escHtml(truncated)}</p>
              ${answerLine}
            </div>
            <span class="review-chevron" aria-hidden="true">›</span>
          </summary>
          <div class="review-expanded">
            <p class="review-full-scenario">${escHtml(s.scenario)}</p>
            <div class="review-why-block">
              ${wrongNote}
              <p class="review-why-text">${escHtml(s.why)}</p>
            </div>
          </div>
        </details>
      </li>`
  }).join('')
}

// ── Spider diagram ───────────────────────────────────

function drawSpider(da) {
  const svg = document.getElementById('spider-diagram')
  svg.innerHTML = ''

  const cx = 150, cy = 155, maxR = 100

  const pt = (angle, r) => ({
    x: cx + r * Math.cos(toRad(angle)),
    y: cy + r * Math.sin(toRad(angle)),
  })

  const mk  = tag => document.createElementNS(NS, tag)
  const set = (el, attrs) => { Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v)); return el }

  // Grid rings
  ;[0.25, 0.5, 0.75, 1].forEach(frac => {
    const pts = AXES.map(a => { const p = pt(a.angle, maxR * frac); return `${p.x},${p.y}` }).join(' ')
    svg.appendChild(set(mk('polygon'), { points: pts, fill: 'none', stroke: '#D4CDC9', 'stroke-width': '1' }))
  })

  // Axis lines
  AXES.forEach(a => {
    const e = pt(a.angle, maxR)
    svg.appendChild(set(mk('line'), { x1: cx, y1: cy, x2: e.x, y2: e.y, stroke: '#D4CDC9', 'stroke-width': '1' }))
  })

  // Data polygon
  const dataPts = AXES.map(a => {
    const p = pt(a.angle, maxR * (da[a.domain] || 0))
    return `${p.x},${p.y}`
  }).join(' ')
  svg.appendChild(set(mk('polygon'), {
    points: dataPts,
    fill: 'rgba(15, 35, 140, 0.08)',
    stroke: '#1A1715',
    'stroke-width': '2.5',
    'stroke-linejoin': 'round',
  }))

  // Dots + labels
  AXES.forEach(a => {
    const p  = pt(a.angle, maxR * (da[a.domain] || 0))
    svg.appendChild(set(mk('circle'), { cx: p.x, cy: p.y, r: '5', fill: a.color }))

    const lp   = pt(a.angle, maxR + 22)
    const text = set(mk('text'), {
      x: lp.x, y: lp.y,
      'text-anchor': 'middle', 'dominant-baseline': 'middle',
      fill: a.color, 'font-size': '11', 'font-family': 'Arial, sans-serif', 'font-weight': 'bold',
    })
    text.textContent = a.label
    svg.appendChild(text)
  })
}

// ── Blind spot detection ─────────────────────────────

function computeBlindSpot(da) {
  const vals    = [da.experience, da.foundation, da.intelligence]
  const domains = ['experience', 'foundation', 'intelligence']
  const min = Math.min(...vals)
  const max = Math.max(...vals)
  const avg = vals.reduce((a, b) => a + b, 0) / 3

  if (max - min <= 0.15) return 'balanced'
  if (avg < 0.5) return 'low_overall'
  return domains[vals.indexOf(min)]
}

function getInsightText(key) {
  const texts = {
    experience:   "You're user-focused, which is great. But some scenarios need deeper technical fixes or real AI capabilities.",
    foundation:   "Solid engineering instinct, but not every problem needs a platform fix. Some need design thinking, some genuinely need AI reasoning.",
    intelligence: "You see AI everywhere. That's ambitious, but some problems need better design or stronger architecture before agents can help.",
    balanced:     "Well-rounded perspective. You can tell the difference between a design fix, a platform problem, and a genuine AI opportunity.",
    low_overall:  "Harder than it looks, right? That's the point. Knowing where each solution fits separates good implementation from expensive mistakes.",
  }
  return texts[key] || texts.balanced
}

// ── Helpers ──────────────────────────────────────────

function animateNumber(el, target, duration = 1200) {
  const start = Date.now()
  const tick = () => {
    const progress = Math.min((Date.now() - start) / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    el.textContent = Math.round(target * eased)
    if (progress < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

function escHtml(str) {
  return str.replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]))
}

// Stub for future agent integration
export async function getAgentInsight(gameResults, intakeAnswers, freeText) {
  return { domain: null, recommendation: null, blindSpot: null, specialistRoute: null }
}
