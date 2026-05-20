import { startGame, handleDomainSelect } from './game.js'
import { renderResults } from './results.js'
import { submitScore, getTopScores } from './leaderboard.js'

// ── Screen management ────────────────────────────────
const screens = {
  landing:  document.getElementById('screen-landing'),
  briefing: document.getElementById('screen-briefing'),
  game:     document.getElementById('screen-game'),
  results:  document.getElementById('screen-results'),
}

function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'))
  screens[name].classList.add('active')
  window.scrollTo(0, 0)
}

// ── Round result storage for leaderboard opt-in ──────
let lastStats = null

// ── Landing → Briefing ───────────────────────────────
document.getElementById('btn-start').addEventListener('click', () => {
  showScreen('briefing')
})

// ── Briefing → Game ──────────────────────────────────
document.getElementById('btn-play').addEventListener('click', () => {
  showScreen('game')
  startGame({
    onRoundEnd(results) {
      lastStats = renderResults(results)
      showScreen('results')
    },
  })
})

// ── Domain answer buttons ────────────────────────────
document.querySelectorAll('.btn-domain').forEach(btn => {
  btn.addEventListener('click', e => handleDomainSelect(e.currentTarget.dataset.domain))
})

// ── Results → Play Again ─────────────────────────────
document.getElementById('btn-play-again').addEventListener('click', () => {
  showScreen('briefing')
})

// ── Leaderboard modal ────────────────────────────────
document.getElementById('btn-leaderboard').addEventListener('click', () => {
  document.getElementById('leaderboard-modal').classList.remove('hidden')
  document.getElementById('player-name').focus()
})

document.getElementById('btn-cancel-modal').addEventListener('click', closeModal)

document.getElementById('btn-submit-score').addEventListener('click', async () => {
  const name = document.getElementById('player-name').value.trim()
  if (!name) return
  if (lastStats) await submitScore(name, lastStats.totalScore, lastStats.domainAccuracies)
  document.getElementById('player-name').value = ''
  closeModal()
  loadLeaderboardPreview()
})

document.getElementById('player-name').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('btn-submit-score').click()
})

function closeModal() {
  document.getElementById('leaderboard-modal').classList.add('hidden')
}

// ── Leaderboard preview on landing ──────────────────
async function loadLeaderboardPreview() {
  const scores = await getTopScores(3)
  const preview = document.getElementById('leaderboard-preview')
  if (scores.length === 0) { preview.classList.add('hidden'); return }

  document.getElementById('leaderboard-list').innerHTML = scores
    .map(s => `<li><span class="lb-name">${esc(s.name)}</span><span class="lb-score">${s.score}</span></li>`)
    .join('')
  preview.classList.remove('hidden')
}

function esc(str) {
  return str.replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]))
}

loadLeaderboardPreview()
