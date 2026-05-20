import { selectScenarios } from './scenarios.js'
import { calculateScore } from './scoring.js'

const TIMERS = { easy: 30_000, medium: 30_000, hard: 30_000 }
const TRANSITION_MS = 600

let scenarios = []
let currentIndex = 0
let currentScore = 0
let timerRAF = null
let timerStart = 0
let totalTime = 0
let roundResults = []
let isAnswering = false
let onRoundEndCb = () => {}

export function startGame({ onRoundEnd } = {}) {
  onRoundEndCb = onRoundEnd || (() => {})
  scenarios = selectScenarios()
  currentIndex = 0
  currentScore = 0
  roundResults = []
  isAnswering = false
  updateScore()
  showScenario()
}

function showScenario() {
  if (currentIndex >= scenarios.length) {
    endRound()
    return
  }

  const s = scenarios[currentIndex]
  totalTime = TIMERS[s.difficulty]
  isAnswering = false

  document.getElementById('progress-display').textContent = `${currentIndex + 1} / ${scenarios.length}`

  const card = document.getElementById('scenario-card')
  card.className = 'scenario-card' // clear all state classes
  void card.offsetWidth            // force reflow so animation restarts
  card.classList.add('slide-in')

  document.getElementById('scenario-text').textContent = s.scenario

  setButtonsEnabled(true)
  clearButtonFeedback()
  startTimer()
}

function startTimer() {
  cancelAnimationFrame(timerRAF)
  timerStart = Date.now()

  const bar = document.getElementById('timer-bar')
  bar.classList.remove('timer-warning', 'timer-danger')
  bar.style.transform = 'scaleX(1)'

  const tick = () => {
    const elapsed = Date.now() - timerStart
    const remaining = Math.max(0, totalTime - elapsed)
    const fraction = remaining / totalTime

    bar.style.transform = `scaleX(${fraction})`

    if (fraction <= 0.25) {
      bar.classList.remove('timer-warning')
      bar.classList.add('timer-danger')
    } else if (fraction <= 0.5) {
      bar.classList.add('timer-warning')
    }

    if (remaining === 0) { handleTimeout(); return }
    timerRAF = requestAnimationFrame(tick)
  }

  timerRAF = requestAnimationFrame(tick)
}

export function handleDomainSelect(domain) {
  if (isAnswering) return
  isAnswering = true
  cancelAnimationFrame(timerRAF)
  setButtonsEnabled(false)

  const elapsed = Date.now() - timerStart
  const timeRemaining = Math.max(0, totalTime - elapsed)
  const s = scenarios[currentIndex]
  const correct = domain === s.domain
  const points = correct ? calculateScore(timeRemaining, totalTime) : 0

  if (correct) currentScore += points
  updateScore()

  roundResults.push({ scenario: s, selected: domain, correct, points, timeSpent: elapsed })
  showFeedback(correct, domain, s.domain)

  setTimeout(() => { currentIndex++; showScenario() }, TRANSITION_MS)
}

function handleTimeout() {
  if (isAnswering) return
  isAnswering = true
  setButtonsEnabled(false)

  roundResults.push({
    scenario: scenarios[currentIndex],
    selected: null,
    correct: false,
    points: 0,
    timeSpent: totalTime,
  })

  document.getElementById('scenario-card').classList.add('expired')
  setTimeout(() => { currentIndex++; showScenario() }, TRANSITION_MS)
}

function showFeedback(correct, selected, correctDomain) {
  const selBtn = document.querySelector(`[data-domain="${selected}"]`)
  const card   = document.getElementById('scenario-card')

  if (correct) {
    selBtn.classList.add('feedback-correct')
    card.classList.add('flash-correct')
  } else {
    selBtn.classList.add('feedback-wrong')
    card.classList.add('flash-wrong')
    const corrBtn = document.querySelector(`[data-domain="${correctDomain}"]`)
    if (corrBtn) corrBtn.classList.add('feedback-show-correct')
  }
}

function clearButtonFeedback() {
  document.querySelectorAll('.btn-domain').forEach(b =>
    b.classList.remove('feedback-correct', 'feedback-wrong', 'feedback-show-correct')
  )
}

function updateScore() {
  document.getElementById('score-value').textContent = currentScore
}

function setButtonsEnabled(on) {
  document.querySelectorAll('.btn-domain').forEach(b => { b.disabled = !on })
}

function endRound() {
  cancelAnimationFrame(timerRAF)
  onRoundEndCb(roundResults)
}
