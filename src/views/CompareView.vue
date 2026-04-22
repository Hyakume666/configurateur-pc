<script setup>
import { computed, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useHead } from '@vueuse/head'
import { GitCompare, X, Check, Minus, ArrowRight } from 'lucide-vue-next'
import { useCompareStore } from '@/stores/compareStore'
import { useConfigs } from '@/composables/useConfigs'
import AppButton from '@/components/ui/AppButton.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import ProgressBar from '@/components/ui/ProgressBar.vue'
import { formatPriceCHF } from '@/composables/useToast'

useHead({
  title: 'Comparer des configurations | Loïc.config'
})

const router = useRouter()
const compare = useCompareStore()
const { getConfig, getComponents } = useConfigs()

const configs = computed(() =>
  compare.slugs.map((slug) => getConfig(slug)).filter(Boolean)
)

onMounted(() => {
  if (configs.value.length < 2) {
    router.replace({ name: 'configs' })
  }
})

const componentTypes = [
  { key: 'cpu', label: 'Processeur' },
  { key: 'gpu', label: 'Carte graphique' },
  { key: 'ram', label: 'Mémoire vive' },
  { key: 'storage', label: 'Stockage' },
  { key: 'motherboard', label: 'Carte mère' },
  { key: 'psu', label: 'Alimentation' },
  { key: 'case', label: 'Boîtier' }
]

function componentOfType(config, type) {
  return getComponents(config).find((c) => c.type === type)
}

const perfFields = [
  { key: 'gaming', label: 'Gaming' },
  { key: 'creation', label: 'Création' },
  { key: 'office', label: 'Bureautique' },
  { key: 'value', label: 'Rapport Q/P' },
  { key: 'future', label: 'Longévité' }
]

// Highlight best value per perf row.
function bestPerf(field) {
  if (!configs.value.length) return null
  return Math.max(...configs.value.map((c) => c.performanceScore[field] || 0))
}
function bestPrice() {
  if (!configs.value.length) return null
  return Math.min(...configs.value.map((c) => c.totalPrice + c.assemblyFee))
}
</script>

<template>
  <div class="min-h-screen pb-20">
    <header class="container-page pt-12 pb-6">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <span class="text-xs uppercase tracking-widest text-neon-blue font-semibold inline-flex items-center gap-1.5">
            <GitCompare class="w-3.5 h-3.5" />
            Comparateur
          </span>
          <h1 class="heading-display text-3xl sm:text-4xl text-text-primary mt-2">
            Comparer {{ configs.length }} configurations
          </h1>
        </div>
        <AppButton variant="ghost" @click="compare.clear()">
          <X class="w-4 h-4" />
          Vider la sélection
        </AppButton>
      </div>
    </header>

    <main class="container-page">
      <div class="overflow-x-auto rounded-2xl bg-bg-800 border border-border-subtle">
        <table class="w-full text-sm min-w-[640px]">
          <thead>
            <tr class="border-b border-border-subtle">
              <th class="sticky left-0 bg-bg-800 z-10 text-left p-4 w-44 text-xs uppercase tracking-wide text-text-muted font-semibold">
                &nbsp;
              </th>
              <th
                v-for="c in configs"
                :key="c.slug"
                class="p-4 align-bottom min-w-[220px]"
              >
                <div class="flex items-start justify-between gap-2 mb-2">
                  <AppBadge v-if="c.badge" variant="popular" size="sm">{{ c.badge }}</AppBadge>
                  <button
                    type="button"
                    class="text-text-muted hover:text-red-400 transition cursor-pointer ml-auto"
                    :aria-label="`Retirer ${c.name}`"
                    @click="compare.remove(c.slug)"
                  >
                    <X class="w-4 h-4" />
                  </button>
                </div>
                <h3 class="heading-display text-lg text-text-primary mb-1">{{ c.name }}</h3>
                <p class="text-xs text-text-muted line-clamp-2 min-h-[32px]">{{ c.tagline }}</p>
              </th>
            </tr>
          </thead>

          <tbody>
            <!-- Price row -->
            <tr class="border-b border-border-subtle/60">
              <td class="sticky left-0 bg-bg-800 z-10 p-4 font-semibold text-text-secondary">Prix total</td>
              <td
                v-for="c in configs"
                :key="c.slug"
                class="p-4 text-center"
              >
                <span
                  :class="[
                    'font-mono font-bold text-lg',
                    c.totalPrice + c.assemblyFee === bestPrice() ? 'text-neon-green' : 'text-gradient-neon'
                  ]"
                >
                  {{ formatPriceCHF(c.totalPrice + c.assemblyFee) }}
                </span>
                <div class="text-[11px] text-text-dim mt-1">
                  ({{ formatPriceCHF(c.totalPrice) }} + {{ formatPriceCHF(c.assemblyFee) }})
                </div>
              </td>
            </tr>

            <!-- Performance rows -->
            <tr
              v-for="f in perfFields"
              :key="f.key"
              class="border-b border-border-subtle/60"
            >
              <td class="sticky left-0 bg-bg-800 z-10 p-4 font-semibold text-text-secondary">{{ f.label }}</td>
              <td
                v-for="c in configs"
                :key="c.slug"
                class="p-4"
              >
                <ProgressBar
                  :value="c.performanceScore[f.key] || 0"
                  :color="c.performanceScore[f.key] === bestPerf(f.key) ? 'green' : 'blue'"
                  :show-value="true"
                />
              </td>
            </tr>

            <!-- Section: Composants -->
            <tr class="bg-bg-900/50">
              <td colspan="100" class="px-4 py-3 text-xs uppercase tracking-wider text-neon-blue font-semibold">
                Composants
              </td>
            </tr>
            <tr
              v-for="t in componentTypes"
              :key="t.key"
              class="border-b border-border-subtle/60"
            >
              <td class="sticky left-0 bg-bg-800 z-10 p-4 font-medium text-text-secondary">{{ t.label }}</td>
              <td
                v-for="c in configs"
                :key="c.slug"
                class="p-4 text-text-primary text-sm"
              >
                {{ componentOfType(c, t.key)?.name || '—' }}
              </td>
            </tr>

            <!-- Pros / Cons -->
            <tr class="bg-bg-900/50">
              <td colspan="100" class="px-4 py-3 text-xs uppercase tracking-wider text-neon-violet font-semibold">
                Points forts / faibles
              </td>
            </tr>
            <tr class="border-b border-border-subtle/60">
              <td class="sticky left-0 bg-bg-800 z-10 p-4 font-semibold text-text-secondary">Avantages</td>
              <td
                v-for="c in configs"
                :key="c.slug"
                class="p-4"
              >
                <ul class="space-y-1.5">
                  <li
                    v-for="(p, i) in c.pros"
                    :key="i"
                    class="flex items-start gap-2 text-xs text-text-secondary"
                  >
                    <Check class="w-3.5 h-3.5 text-neon-green flex-shrink-0 mt-0.5" />
                    <span>{{ p }}</span>
                  </li>
                </ul>
              </td>
            </tr>
            <tr class="border-b border-border-subtle/60">
              <td class="sticky left-0 bg-bg-800 z-10 p-4 font-semibold text-text-secondary">Limites</td>
              <td
                v-for="c in configs"
                :key="c.slug"
                class="p-4"
              >
                <ul class="space-y-1.5">
                  <li
                    v-for="(co, i) in c.cons"
                    :key="i"
                    class="flex items-start gap-2 text-xs text-text-secondary"
                  >
                    <Minus class="w-3.5 h-3.5 text-orange-400 flex-shrink-0 mt-0.5" />
                    <span>{{ co }}</span>
                  </li>
                </ul>
              </td>
            </tr>

            <!-- CTA -->
            <tr>
              <td class="sticky left-0 bg-bg-800 z-10 p-4">&nbsp;</td>
              <td
                v-for="c in configs"
                :key="c.slug"
                class="p-4"
              >
                <RouterLink
                  :to="{ name: 'config-detail', params: { slug: c.slug } }"
                  class="inline-flex w-full items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary-500 hover:bg-primary-400 text-white text-sm font-semibold transition cursor-pointer"
                >
                  Voir
                  <ArrowRight class="w-4 h-4" />
                </RouterLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="mt-4 text-xs text-text-muted text-center">
        Les meilleurs scores sont mis en évidence en vert.
      </p>
    </main>
  </div>
</template>
