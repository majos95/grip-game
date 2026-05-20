const KEY = 'grip_leaderboard'

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') }
  catch { return [] }
}

function save(scores) {
  localStorage.setItem(KEY, JSON.stringify(scores))
}

export async function submitScore(name, score, domainAccuracies) {
  const scores = load()
  scores.push({ name: name.trim().slice(0, 30), score, domainAccuracies, timestamp: Date.now() })
  scores.sort((a, b) => b.score - a.score)
  save(scores.slice(0, 100))
}

export async function getTopScores(limit = 10) {
  return load().slice(0, limit)
}

export async function getTotalParticipants() {
  return load().length
}
