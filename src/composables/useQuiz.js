import questions from '@/data/questions.json'
import { useConfigStore } from '@/stores/configStore'

const PRIORITY_FIELD_MAP = {
  fps_max: 'gaming',
  visual: 'gaming',
  balance: 'value',
  silent: 'office',
  future: 'future'
}

function getBudgetRange(budgetId) {
  const q = questions.find((q) => q.key === 'budget')
  const opt = q?.options.find((o) => o.id === budgetId)
  if (!opt) return { min: 0, max: 99999 }
  return { min: opt.min, max: opt.max }
}

export function scoreConfig(config, answers) {
  let score = 0
  const reasons = []

  if (config.usage.includes(answers.usage)) {
    score += 40
    reasons.push('Adapté à votre usage')
  }

  const budget = getBudgetRange(answers.budget)
  const total = config.totalPrice + config.assemblyFee
  if (total >= budget.min && total <= budget.max) {
    score += 30
    reasons.push('Dans votre budget')
  } else if (total < budget.min) {
    score += 10
    reasons.push('Sous votre budget')
  } else if (total <= budget.max * 1.15) {
    score += 15
    reasons.push('Légèrement au-dessus du budget')
  }

  const priorityField = PRIORITY_FIELD_MAP[answers.priority]
  if (priorityField && config.performanceScore?.[priorityField]) {
    const perfScore = config.performanceScore[priorityField]
    score += Math.round((perfScore / 100) * 20)
    if (perfScore >= 80) reasons.push('Optimisé pour votre priorité')
  }

  if (answers.level === 'beginner' && config.tier === 'budget') score += 10
  if (answers.level === 'intermediate' && ['mid', 'high'].includes(config.tier))
    score += 10
  if (answers.level === 'expert' && ['high', 'extreme'].includes(config.tier))
    score += 10

  return { score, reasons }
}

export function useQuiz() {
  const configStore = useConfigStore()

  function rankConfigs(answers) {
    const ranked = configStore.configs
      .map((config) => {
        const { score, reasons } = scoreConfig(config, answers)
        return { ...config, _score: score, _reasons: reasons }
      })
      .sort((a, b) => b._score - a._score)

    return ranked.slice(0, 3)
  }

  function summarizeAnswers(answers) {
    const summary = []
    const find = (key, id) =>
      questions.find((q) => q.key === key)?.options.find((o) => o.id === id)
    const usage = find('usage', answers.usage)
    const budget = find('budget', answers.budget)
    const level = find('level', answers.level)
    const priority = find('priority', answers.priority)

    if (usage) summary.push(usage.label)
    if (budget) summary.push(budget.sublabel)
    if (priority) summary.push(priority.label)
    if (level) summary.push(level.label)

    return summary
  }

  return { rankConfigs, summarizeAnswers, scoreConfig }
}
