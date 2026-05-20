export function calculateScore(timeRemaining, totalTime) {
  return 100 + Math.floor((timeRemaining / totalTime) * 50)
}

export function domainAccuracy(results, domain) {
  const subset = results.filter(r => r.scenario.domain === domain)
  if (subset.length === 0) return 0
  return subset.filter(r => r.correct).length / subset.length
}

export function computeStats(results) {
  const correct = results.filter(r => r.correct).length
  const total = results.length
  const totalScore = results.reduce((sum, r) => sum + r.points, 0)
  const avgSpeed = results.reduce((sum, r) => sum + r.timeSpent, 0) / total / 1000

  const domainStats = {}
  for (const d of ['experience', 'foundation', 'intelligence']) {
    const subset = results.filter(r => r.scenario.domain === d)
    const c = subset.filter(r => r.correct).length
    domainStats[d] = { correct: c, total: subset.length, accuracy: subset.length > 0 ? c / subset.length : 0 }
  }

  return {
    totalScore,
    accuracy: total > 0 ? correct / total : 0,
    avgSpeed,
    domainStats,
    domainAccuracies: {
      experience:   domainStats.experience.accuracy,
      foundation:   domainStats.foundation.accuracy,
      intelligence: domainStats.intelligence.accuracy,
    },
  }
}
