import { defineStore } from 'pinia'
import questions from '@/data/questions.json'

const STORAGE_KEY = 'quiz_state_v1'

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export const useQuizStore = defineStore('quiz', {
  state: () => {
    const persisted = loadInitial()
    return {
      currentStep: persisted?.currentStep ?? 1,
      direction: 'next',
      answers: persisted?.answers ?? {
        usage: null,
        budget: null,
        level: null,
        priority: null,
        peripherals: []
      },
      completed: persisted?.completed ?? false
    }
  },
  getters: {
    totalSteps: () => questions.length,
    currentQuestion: (state) => questions.find((q) => q.id === state.currentStep),
    progress: (state) => Math.round((state.currentStep / questions.length) * 100),
    isStepValid: (state) => {
      const q = questions.find((q) => q.id === state.currentStep)
      if (!q) return false
      const value = state.answers[q.key]
      if (q.type === 'multi') return true
      return value !== null && value !== undefined && value !== ''
    },
    budgetRange: (state) => {
      const q = questions.find((q) => q.key === 'budget')
      const opt = q?.options.find((o) => o.id === state.answers.budget)
      if (!opt) return null
      return { id: opt.id, min: opt.min, max: opt.max, label: opt.label }
    }
  },
  actions: {
    persist() {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            currentStep: this.currentStep,
            answers: this.answers,
            completed: this.completed
          })
        )
      } catch {
        /* ignore quota */
      }
    },
    setAnswer(key, value) {
      this.answers[key] = value
      this.persist()
    },
    toggleMulti(key, optionId, exclusive = false) {
      const current = this.answers[key] || []
      if (exclusive) {
        this.answers[key] = current.includes(optionId) ? [] : [optionId]
      } else {
        const filtered = current.filter((id) => {
          const q = questions.find((q) => q.key === key)
          const opt = q?.options.find((o) => o.id === id)
          return !opt?.exclusive
        })
        this.answers[key] = filtered.includes(optionId)
          ? filtered.filter((i) => i !== optionId)
          : [...filtered, optionId]
      }
      this.persist()
    },
    next() {
      if (this.currentStep < questions.length) {
        this.direction = 'next'
        this.currentStep += 1
        this.persist()
      } else {
        this.completed = true
        this.persist()
      }
    },
    previous() {
      if (this.currentStep > 1) {
        this.direction = 'prev'
        this.currentStep -= 1
        this.persist()
      }
    },
    reset() {
      this.currentStep = 1
      this.direction = 'next'
      this.answers = {
        usage: null,
        budget: null,
        level: null,
        priority: null,
        peripherals: []
      }
      this.completed = false
      this.persist()
    }
  }
})
