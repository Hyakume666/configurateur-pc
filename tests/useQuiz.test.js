import { describe, it, expect } from 'vitest'
import { scoreConfig } from '@/composables/useQuiz'
import configs from '@/data/configs.json'

const sweetSpot = configs.find((c) => c.slug === 'sweet-spot')
const beast4k = configs.find((c) => c.slug === '4k-beast')
const essentiel = configs.find((c) => c.slug === 'l-essentiel')

const baseAnswers = {
  usage: 'fps',
  budget: 'mid_high', // 1400-2200
  level: 'intermediate',
  priority: 'balance',
  peripherals: []
}

describe('scoreConfig', () => {
  it('awards +40 for usage match', () => {
    const { score } = scoreConfig(sweetSpot, baseAnswers)
    expect(score).toBeGreaterThanOrEqual(40)
  })

  it('does not award usage points when usage does not match', () => {
    const onlyOffice = { ...sweetSpot, usage: ['office'] }
    const { score } = scoreConfig(onlyOffice, baseAnswers)
    // Should miss the 40-point usage bonus.
    const ref = scoreConfig(sweetSpot, baseAnswers).score
    expect(score).toBeLessThan(ref)
  })

  it('awards +30 for budget match', () => {
    const { score, reasons } = scoreConfig(sweetSpot, baseAnswers)
    expect(reasons).toContain('Dans votre budget')
    expect(score).toBeGreaterThan(40)
  })

  it('penalises configs above the user budget', () => {
    // 4k-beast costs ~3950 CHF, way above mid_high budget (max 2200).
    const { score } = scoreConfig(beast4k, baseAnswers)
    const refScore = scoreConfig(sweetSpot, baseAnswers).score
    expect(score).toBeLessThan(refScore)
  })

  it('still credits configs slightly cheaper than budget min', () => {
    // l-essentiel (810 CHF) is below mid_high min (1400) → +10 partial credit
    const { score, reasons } = scoreConfig(essentiel, baseAnswers)
    expect(reasons).toContain('Sous votre budget')
    expect(score).toBeGreaterThan(0)
  })

  it('boosts beginner+budget combo via tier match', () => {
    const beginnerAnswers = {
      ...baseAnswers,
      level: 'beginner',
      budget: 'entry',
      usage: 'office'
    }
    const { score: budgetTierScore } = scoreConfig(essentiel, beginnerAnswers)
    const { score: nonMatchScore } = scoreConfig(beast4k, beginnerAnswers)
    expect(budgetTierScore).toBeGreaterThan(nonMatchScore)
  })

  it('priority alignment increases score for matching perf field', () => {
    const fpsAnswers = { ...baseAnswers, priority: 'fps_max' }
    const { score: gamingScore } = scoreConfig(beast4k, fpsAnswers)
    // beast4k.gaming = 100 → priority should add 20 points.
    expect(gamingScore).toBeGreaterThanOrEqual(20)
  })
})
