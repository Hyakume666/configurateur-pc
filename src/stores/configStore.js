import { defineStore } from 'pinia'
import configsData from '@/data/configs.json'
import componentsData from '@/data/components.json'

export const useConfigStore = defineStore('configs', {
  state: () => ({
    configs: configsData,
    components: componentsData,
    topMatches: []
  }),
  getters: {
    bySlug: (state) => (slug) => state.configs.find((c) => c.slug === slug),
    componentById: (state) => (id) => state.components.find((c) => c.id === id),
    popularConfigs: (state) => state.configs.filter((c) => c.featured),
    allConfigsSorted: (state) =>
      [...state.configs].sort(
        (a, b) =>
          a.totalPrice + a.assemblyFee - (b.totalPrice + b.assemblyFee)
      )
  },
  actions: {
    setTopMatches(matches) {
      this.topMatches = matches
    },
    trackConfigView(slug) {
      try {
        const key = 'config_views'
        const data = JSON.parse(localStorage.getItem(key) || '{}')
        data[slug] = (data[slug] || 0) + 1
        localStorage.setItem(key, JSON.stringify(data))
      } catch {
        /* quota */
      }
    }
  }
})
