import experienceData  from '../../data/experience.json'
import foundationData  from '../../data/foundation.json'
import intelligenceData from '../../data/intelligence.json'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickFour(pool) {
  const byDiff = {
    easy:   shuffle(pool.filter(s => s.difficulty === 'easy')),
    medium: shuffle(pool.filter(s => s.difficulty === 'medium')),
    hard:   shuffle(pool.filter(s => s.difficulty === 'hard')),
  }
  const picked = []
  // Target: 1 easy, 2 medium, 1 hard per domain
  for (const [diff, n] of [['easy', 1], ['medium', 2], ['hard', 1]]) {
    picked.push(...byDiff[diff].splice(0, n))
  }
  // Pad with anything remaining if a difficulty bucket was short
  if (picked.length < 4) {
    const leftover = shuffle([...byDiff.easy, ...byDiff.medium, ...byDiff.hard])
    picked.push(...leftover.slice(0, 4 - picked.length))
  }
  return picked.slice(0, 4)
}

export function selectScenarios() {
  const experience  = pickFour(experienceData)
  const foundation  = pickFour(foundationData)
  const intelligence = pickFour(intelligenceData)
  return shuffle([...experience, ...foundation, ...intelligence])
}
