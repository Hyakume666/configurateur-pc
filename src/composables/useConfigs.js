import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'

export function useConfigs() {
  const store = useConfigStore()

  function getConfig(slug) {
    return store.bySlug(slug)
  }

  function getComponents(config) {
    if (!config) return []
    return config.components
      .map((id) => store.componentById(id))
      .filter(Boolean)
  }

  function computeTotal(config, selectedUpgradeIds = []) {
    if (!config) return 0
    let total = config.totalPrice + config.assemblyFee
    config.upgrades?.forEach((u) => {
      if (selectedUpgradeIds.includes(u.id)) total += u.priceAdd
    })
    return total
  }

  const all = computed(() => store.allConfigsSorted)
  const popular = computed(() => store.popularConfigs)

  return { getConfig, getComponents, computeTotal, all, popular, store }
}
