<script setup>
import { computed, onMounted, ref } from 'vue'
import { Bar, Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { Trash2, BarChart3, Eye, MousePointerClick } from 'lucide-vue-next'
import AppButton from '@/components/ui/AppButton.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppModal from '@/components/ui/AppModal.vue'
import { useAffiliates } from '@/composables/useAffiliates'
import { useConfigStore } from '@/stores/configStore'
import retailers from '@/data/retailers.json'

ChartJS.register(Title, Tooltip, Legend, BarElement, LineElement, PointElement, CategoryScale, LinearScale)

const { getEvents, clearEvents } = useAffiliates()
const configStore = useConfigStore()

const events = ref([])
const showConfirm = ref(false)

function refresh() {
  events.value = getEvents()
}

onMounted(refresh)

const clicksByRetailer = computed(() => {
  const counts = {}
  retailers.forEach((r) => (counts[r.id] = 0))
  events.value.forEach((e) => {
    if (counts[e.retailerId] !== undefined) counts[e.retailerId]++
  })
  return counts
})

const retailerChartData = computed(() => ({
  labels: retailers.map((r) => r.name),
  datasets: [
    {
      label: 'Clics',
      data: retailers.map((r) => clicksByRetailer.value[r.id]),
      backgroundColor: retailers.map((r) => r.color + 'CC'),
      borderColor: retailers.map((r) => r.color),
      borderWidth: 1,
      borderRadius: 6
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { ticks: { color: '#cbd5e1' }, grid: { color: 'rgba(148,163,184,0.1)' } },
    y: { ticks: { color: '#cbd5e1' }, grid: { color: 'rgba(148,163,184,0.1)' }, beginAtZero: true }
  }
}

const topComponents = computed(() => {
  const counts = {}
  events.value.forEach((e) => {
    counts[e.componentId] = (counts[e.componentId] || 0) + 1
  })
  return Object.entries(counts)
    .map(([id, count]) => ({
      id,
      name: configStore.componentById(id)?.name || id,
      count
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
})

const last30Days = computed(() => {
  const days = []
  const now = new Date()
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now)
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() - i)
    days.push({ date: d, label: d.toLocaleDateString('fr-CH', { day: '2-digit', month: '2-digit' }), count: 0 })
  }
  events.value.forEach((e) => {
    const day = new Date(e.timestamp)
    day.setHours(0, 0, 0, 0)
    const match = days.find((d) => d.date.getTime() === day.getTime())
    if (match) match.count++
  })
  return days
})

const lineChartData = computed(() => ({
  labels: last30Days.value.map((d) => d.label),
  datasets: [
    {
      label: 'Clics quotidiens',
      data: last30Days.value.map((d) => d.count),
      borderColor: '#00e5ff',
      backgroundColor: 'rgba(0,229,255,0.15)',
      tension: 0.35,
      fill: true,
      pointRadius: 3,
      pointBackgroundColor: '#a855f7'
    }
  ]
}))

const configViews = computed(() => {
  try {
    const data = JSON.parse(localStorage.getItem('config_views') || '{}')
    return Object.entries(data)
      .map(([slug, count]) => ({
        slug,
        name: configStore.bySlug(slug)?.name || slug,
        count
      }))
      .sort((a, b) => b.count - a.count)
  } catch {
    return []
  }
})

const totalClicks = computed(() => events.value.length)
const totalViews = computed(() => configViews.value.reduce((s, c) => s + c.count, 0))

function confirmClear() {
  clearEvents()
  showConfirm.value = false
  refresh()
}
</script>

<template>
  <div class="min-h-screen pb-20">
    <header class="container-page py-12">
      <div class="flex items-center gap-3 mb-2">
        <BarChart3 class="w-7 h-7 text-neon-blue" />
        <h1 class="heading-display text-3xl sm:text-4xl text-text-primary">Statistiques admin</h1>
      </div>
      <p class="text-text-muted">Vue interne sur les clics affiliés et vues de configurations.</p>
    </header>

    <main class="container-page space-y-8">
      <!-- KPIs -->
      <div class="grid sm:grid-cols-3 gap-4">
        <AppCard>
          <div class="flex items-center gap-3">
            <span class="w-10 h-10 rounded-lg bg-neon-blue/15 text-neon-blue flex items-center justify-center">
              <MousePointerClick class="w-5 h-5" />
            </span>
            <div>
              <div class="text-xs text-text-muted uppercase tracking-wide">Clics affiliés</div>
              <div class="text-2xl font-bold text-text-primary font-mono">{{ totalClicks }}</div>
            </div>
          </div>
        </AppCard>
        <AppCard>
          <div class="flex items-center gap-3">
            <span class="w-10 h-10 rounded-lg bg-neon-violet/15 text-neon-violet flex items-center justify-center">
              <Eye class="w-5 h-5" />
            </span>
            <div>
              <div class="text-xs text-text-muted uppercase tracking-wide">Vues config</div>
              <div class="text-2xl font-bold text-text-primary font-mono">{{ totalViews }}</div>
            </div>
          </div>
        </AppCard>
        <AppCard>
          <div class="flex items-center gap-3">
            <span class="w-10 h-10 rounded-lg bg-neon-green/15 text-neon-green flex items-center justify-center">
              <BarChart3 class="w-5 h-5" />
            </span>
            <div>
              <div class="text-xs text-text-muted uppercase tracking-wide">Configs actives</div>
              <div class="text-2xl font-bold text-text-primary font-mono">{{ configStore.configs.length }}</div>
            </div>
          </div>
        </AppCard>
      </div>

      <!-- CHARTS -->
      <div class="grid lg:grid-cols-2 gap-5">
        <AppCard>
          <h2 class="font-semibold text-text-primary mb-3">Clics par revendeur</h2>
          <div class="h-64">
            <Bar :data="retailerChartData" :options="chartOptions" />
          </div>
        </AppCard>
        <AppCard>
          <h2 class="font-semibold text-text-primary mb-3">Clics — 30 derniers jours</h2>
          <div class="h-64">
            <Line :data="lineChartData" :options="chartOptions" />
          </div>
        </AppCard>
      </div>

      <!-- TABLES -->
      <div class="grid lg:grid-cols-2 gap-5">
        <AppCard>
          <h2 class="font-semibold text-text-primary mb-3">Top 10 composants cliqués</h2>
          <ol v-if="topComponents.length" class="space-y-2">
            <li
              v-for="(c, i) in topComponents"
              :key="c.id"
              class="flex items-center justify-between gap-3 text-sm py-2 border-b border-border-subtle/60 last:border-b-0"
            >
              <span class="flex items-center gap-3">
                <span class="w-6 h-6 rounded-full bg-bg-700 text-neon-blue flex items-center justify-center text-xs font-mono">{{ i + 1 }}</span>
                <span class="text-text-secondary">{{ c.name }}</span>
              </span>
              <span class="font-mono text-neon-blue">{{ c.count }}</span>
            </li>
          </ol>
          <p v-else class="text-sm text-text-muted">Aucun clic enregistré.</p>
        </AppCard>

        <AppCard>
          <h2 class="font-semibold text-text-primary mb-3">Pages config les plus vues</h2>
          <ol v-if="configViews.length" class="space-y-2">
            <li
              v-for="(c, i) in configViews"
              :key="c.slug"
              class="flex items-center justify-between gap-3 text-sm py-2 border-b border-border-subtle/60 last:border-b-0"
            >
              <span class="flex items-center gap-3">
                <span class="w-6 h-6 rounded-full bg-bg-700 text-neon-violet flex items-center justify-center text-xs font-mono">{{ i + 1 }}</span>
                <span class="text-text-secondary">{{ c.name }}</span>
              </span>
              <span class="font-mono text-neon-violet">{{ c.count }}</span>
            </li>
          </ol>
          <p v-else class="text-sm text-text-muted">Aucune vue enregistrée.</p>
        </AppCard>
      </div>

      <div class="flex justify-end">
        <AppButton variant="danger" @click="showConfirm = true">
          <Trash2 class="w-4 h-4" />
          Effacer les données
        </AppButton>
      </div>
    </main>

    <AppModal :open="showConfirm" title="Confirmer la suppression" size="sm" @close="showConfirm = false">
      <p class="text-text-secondary">
        Cette action effacera tous les clics affiliés et vues enregistrés localement.
        <br />
        <strong class="text-text-primary">Cette action est irréversible.</strong>
      </p>
      <div class="mt-5 flex justify-end gap-2">
        <AppButton variant="ghost" @click="showConfirm = false">Annuler</AppButton>
        <AppButton variant="danger" @click="confirmClear">Confirmer</AppButton>
      </div>
    </AppModal>
  </div>
</template>
