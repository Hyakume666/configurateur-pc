<script setup>
import { computed, ref, watch } from 'vue'
import { useHead } from '@vueuse/head'
import { Filter, ArrowUpDown, X } from 'lucide-vue-next'
import { useConfigs } from '@/composables/useConfigs'
import ConfigCard from '@/components/config/ConfigCard.vue'
import AppButton from '@/components/ui/AppButton.vue'
import RangeSlider from '@/components/ui/RangeSlider.vue'
import { formatPriceCHF } from '@/composables/useToast'

useHead({
  title: 'Toutes nos configurations PC | Loïc.config',
  meta: [
    {
      name: 'description',
      content: 'Catalogue complet de configurations PC sur mesure. Filtrez par budget, usage et niveau.'
    }
  ]
})

const { all } = useConfigs()

const tierOptions = [
  { id: 'budget', label: 'Entrée' },
  { id: 'mid', label: 'Mid' },
  { id: 'high', label: 'Haut de gamme' },
  { id: 'extreme', label: 'Extrême' }
]

const usageOptions = [
  { id: 'fps', label: 'Gaming compétitif' },
  { id: 'rpg', label: 'Gaming immersif' },
  { id: 'creation', label: 'Création' },
  { id: 'office', label: 'Bureautique' },
  { id: 'workstation', label: 'Workstation' }
]

const sortOptions = [
  { id: 'price_asc', label: 'Prix croissant' },
  { id: 'price_desc', label: 'Prix décroissant' },
  { id: 'gaming_desc', label: 'Performance gaming' },
  { id: 'creation_desc', label: 'Performance création' },
  { id: 'value_desc', label: 'Meilleur rapport Q/P' },
  { id: 'future_desc', label: 'Longévité' }
]

// Compute global price bounds from data so the slider scales correctly.
const allTotals = computed(() => all.value.map((c) => c.totalPrice + c.assemblyFee))
const minPrice = computed(() => Math.floor(Math.min(...allTotals.value) / 100) * 100)
const maxPrice = computed(() => Math.ceil(Math.max(...allTotals.value) / 100) * 100)

const maxBudget = ref(0)
watch(maxPrice, (v) => { if (!maxBudget.value) maxBudget.value = v }, { immediate: true })

const selectedTiers = ref([])
const selectedUsages = ref([])
const sortBy = ref('price_asc')

// arr is the reactive array (refs are unwrapped in template expressions).
function toggle(arr, value) {
  const i = arr.indexOf(value)
  if (i >= 0) arr.splice(i, 1)
  else arr.push(value)
}

const filtered = computed(() => {
  let list = all.value

  if (selectedTiers.value.length) {
    list = list.filter((c) => selectedTiers.value.includes(c.tier))
  }
  if (selectedUsages.value.length) {
    list = list.filter((c) => c.usage.some((u) => selectedUsages.value.includes(u)))
  }
  list = list.filter((c) => c.totalPrice + c.assemblyFee <= maxBudget.value)

  const sorted = [...list]
  switch (sortBy.value) {
    case 'price_desc':
      sorted.sort((a, b) => (b.totalPrice + b.assemblyFee) - (a.totalPrice + a.assemblyFee))
      break
    case 'gaming_desc':
      sorted.sort((a, b) => b.performanceScore.gaming - a.performanceScore.gaming)
      break
    case 'creation_desc':
      sorted.sort((a, b) => b.performanceScore.creation - a.performanceScore.creation)
      break
    case 'value_desc':
      sorted.sort((a, b) => b.performanceScore.value - a.performanceScore.value)
      break
    case 'future_desc':
      sorted.sort((a, b) => b.performanceScore.future - a.performanceScore.future)
      break
    default:
      sorted.sort((a, b) => (a.totalPrice + a.assemblyFee) - (b.totalPrice + b.assemblyFee))
  }
  return sorted
})

const hasActiveFilters = computed(
  () =>
    selectedTiers.value.length > 0 ||
    selectedUsages.value.length > 0 ||
    maxBudget.value < maxPrice.value
)

function resetFilters() {
  selectedTiers.value = []
  selectedUsages.value = []
  maxBudget.value = maxPrice.value
  sortBy.value = 'price_asc'
}
</script>

<template>
  <div class="min-h-screen pb-20">
    <header class="relative pt-16 sm:pt-24 pb-10">
      <div class="absolute inset-0 bg-gradient-hero opacity-50 pointer-events-none" />
      <div class="container-page relative">
        <span class="text-xs uppercase tracking-widest text-neon-blue font-semibold">Catalogue</span>
        <h1 class="heading-display text-3xl sm:text-5xl text-text-primary mt-2 mb-3">
          Toutes nos configurations
        </h1>
        <p class="text-text-secondary max-w-xl">
          {{ all.length }} configurations disponibles, du compact 600 CHF au monstre 5 650 CHF.
        </p>
      </div>
    </header>

    <main class="container-page grid lg:grid-cols-[280px_1fr] gap-8">
      <!-- FILTERS sidebar -->
      <aside class="lg:sticky lg:top-20 self-start">
        <div class="rounded-2xl bg-bg-800 border border-border-subtle p-5 space-y-6">
          <div class="flex items-center justify-between">
            <h2 class="font-semibold text-text-primary inline-flex items-center gap-2">
              <Filter class="w-4 h-4 text-neon-blue" />
              Filtres
            </h2>
            <button
              v-if="hasActiveFilters"
              type="button"
              class="text-xs text-text-muted hover:text-neon-blue inline-flex items-center gap-1 cursor-pointer"
              @click="resetFilters"
            >
              <X class="w-3 h-3" />
              Réinitialiser
            </button>
          </div>

          <!-- Budget max -->
          <div>
            <RangeSlider
              v-model="maxBudget"
              :min="minPrice"
              :max="maxPrice"
              :step="100"
              label="Budget max"
              :format-value="formatPriceCHF"
            />
          </div>

          <!-- Tier -->
          <div>
            <h3 class="text-xs uppercase tracking-wider text-text-muted font-semibold mb-2">Gamme</h3>
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="t in tierOptions"
                :key="t.id"
                type="button"
                :class="[
                  'px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer border',
                  selectedTiers.includes(t.id)
                    ? 'bg-neon-blue/15 border-neon-blue text-neon-blue'
                    : 'bg-bg-700 border-border-subtle text-text-secondary hover:border-primary-500/40'
                ]"
                @click="toggle(selectedTiers, t.id)"
              >
                {{ t.label }}
              </button>
            </div>
          </div>

          <!-- Usage -->
          <div>
            <h3 class="text-xs uppercase tracking-wider text-text-muted font-semibold mb-2">Usage</h3>
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="u in usageOptions"
                :key="u.id"
                type="button"
                :class="[
                  'px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer border',
                  selectedUsages.includes(u.id)
                    ? 'bg-neon-violet/15 border-neon-violet text-neon-violet'
                    : 'bg-bg-700 border-border-subtle text-text-secondary hover:border-primary-500/40'
                ]"
                @click="toggle(selectedUsages, u.id)"
              >
                {{ u.label }}
              </button>
            </div>
          </div>

          <!-- Sort -->
          <div>
            <h3 class="text-xs uppercase tracking-wider text-text-muted font-semibold mb-2 inline-flex items-center gap-1.5">
              <ArrowUpDown class="w-3.5 h-3.5" />
              Trier par
            </h3>
            <select
              v-model="sortBy"
              class="w-full px-3 py-2 bg-bg-900 border border-border-subtle rounded-lg text-sm text-text-primary focus:outline-none focus:border-neon-blue cursor-pointer"
            >
              <option v-for="s in sortOptions" :key="s.id" :value="s.id">{{ s.label }}</option>
            </select>
          </div>
        </div>
      </aside>

      <!-- RESULTS -->
      <section>
        <div class="flex items-center justify-between mb-4">
          <p class="text-sm text-text-muted">
            <span class="text-text-primary font-semibold">{{ filtered.length }}</span>
            résultat{{ filtered.length > 1 ? 's' : '' }}
          </p>
        </div>

        <div v-if="filtered.length" class="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          <ConfigCard
            v-for="(c, i) in filtered"
            :key="c.id"
            :config="c"
            :index="i"
          />
        </div>
        <div v-else class="text-center py-20 rounded-2xl bg-bg-800 border border-border-subtle">
          <p class="text-text-muted mb-4">Aucune configuration ne correspond à vos filtres.</p>
          <AppButton variant="ghost" @click="resetFilters">Réinitialiser les filtres</AppButton>
        </div>
      </section>
    </main>
  </div>
</template>
