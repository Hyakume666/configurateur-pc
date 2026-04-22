import { defineStore } from 'pinia'

const STORAGE_KEY = 'compare_list_v1'
const MAX_ITEMS = 3

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.slice(0, MAX_ITEMS) : []
  } catch {
    return []
  }
}

export const useCompareStore = defineStore('compare', {
  state: () => ({
    slugs: loadInitial()
  }),
  getters: {
    count: (state) => state.slugs.length,
    isFull: (state) => state.slugs.length >= MAX_ITEMS,
    has: (state) => (slug) => state.slugs.includes(slug),
    max: () => MAX_ITEMS
  },
  actions: {
    persist() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.slugs))
      } catch {
        /* quota */
      }
    },
    toggle(slug) {
      if (this.slugs.includes(slug)) {
        this.slugs = this.slugs.filter((s) => s !== slug)
      } else if (this.slugs.length < MAX_ITEMS) {
        this.slugs = [...this.slugs, slug]
      }
      this.persist()
    },
    remove(slug) {
      this.slugs = this.slugs.filter((s) => s !== slug)
      this.persist()
    },
    clear() {
      this.slugs = []
      this.persist()
    }
  }
})
