<script setup>
import { computed, ref } from 'vue'
import { Cpu, MemoryStick, HardDrive, CircuitBoard, Plug, Box, Wind, MonitorPlay, ChevronDown } from 'lucide-vue-next'
import retailers from '@/data/retailers.json'
import AffiliateBadge from './AffiliateBadge.vue'
import { formatPriceCHF } from '@/composables/useToast'

const props = defineProps({
  component: { type: Object, required: true },
  configSlug: { type: String, default: null },
  index: { type: Number, default: 0 }
})

const iconMap = {
  cpu: Cpu,
  gpu: MonitorPlay,
  ram: MemoryStick,
  storage: HardDrive,
  motherboard: CircuitBoard,
  psu: Plug,
  case: Box,
  cooling: Wind
}

const typeLabel = {
  cpu: 'Processeur',
  gpu: 'Carte graphique',
  ram: 'Mémoire vive',
  storage: 'Stockage',
  motherboard: 'Carte mère',
  psu: 'Alimentation',
  case: 'Boîtier',
  cooling: 'Refroidissement'
}

// Pretty labels for known spec keys; unknown keys fall back to the raw key.
const specKeyLabels = {
  cores: 'Cœurs',
  threads: 'Threads',
  boost: 'Fréquence boost',
  socket: 'Socket',
  tdp: 'TDP',
  cache: 'Cache',
  igpu: 'iGPU',
  vram: 'VRAM',
  capacity: 'Capacité',
  speed: 'Vitesse',
  kit: 'Kit',
  cl: 'Latence',
  ecc: 'ECC',
  interface: 'Interface',
  type: 'Type',
  config: 'Config',
  chipset: 'Chipset',
  form: 'Format',
  wifi: 'WiFi',
  pcie5: 'PCIe 5.0',
  thunderbolt: 'Thunderbolt',
  memory_oc: 'Memory OC',
  power: 'Puissance',
  rating: 'Certification',
  modular: 'Modulaire',
  fan: 'Ventilateur',
  fans: 'Ventilateurs',
  noise: 'Niveau sonore',
  airflow: 'Flux d\'air',
  design: 'Design',
  cooling: 'Refroidissement',
  volume: 'Volume'
}

function formatSpecValue(value) {
  if (value === true) return 'Oui'
  if (value === false) return 'Non'
  return String(value)
}

const Icon = computed(() => iconMap[props.component.type] || Box)
const expanded = ref(false)
const specsEntries = computed(() => Object.entries(props.component.specs || {}))
const hasSpecs = computed(() => specsEntries.value.length > 0)
</script>

<template>
  <tr
    v-motion
    :initial="{ opacity: 0, y: 12 }"
    :enter="{ opacity: 1, y: 0, transition: { duration: 280, delay: index * 60 } }"
    :class="[
      'group border-b border-border-subtle/60 transition-colors',
      expanded ? 'bg-bg-700/40' : 'hover:bg-bg-700/40'
    ]"
  >
    <td class="py-4 px-3 sm:px-4 align-top">
      <div class="flex items-center gap-3">
        <span class="w-9 h-9 rounded-lg bg-bg-700 text-primary-300 flex items-center justify-center group-hover:text-neon-blue group-hover:shadow-glow-soft transition">
          <component :is="Icon" class="w-4 h-4" />
        </span>
        <div class="text-xs uppercase tracking-wide text-text-muted font-semibold">
          {{ typeLabel[component.type] || component.type }}
        </div>
      </div>
    </td>
    <td class="py-4 px-3 sm:px-4 align-top">
      <button
        v-if="hasSpecs"
        type="button"
        class="inline-flex items-center gap-1.5 font-medium text-text-primary hover:text-neon-blue transition cursor-pointer text-left"
        :aria-expanded="expanded"
        :aria-controls="`specs-${component.id}`"
        @click="expanded = !expanded"
      >
        <span>{{ component.name }}</span>
        <ChevronDown
          :class="['w-3.5 h-3.5 text-text-muted transition-transform duration-200', expanded ? 'rotate-180' : '']"
        />
      </button>
      <div v-else class="font-medium text-text-primary">{{ component.name }}</div>
      <div v-if="component.brand" class="text-xs text-text-muted">{{ component.brand }}</div>
    </td>
    <td class="py-4 px-3 sm:px-4 align-top text-right font-mono text-neon-blue text-sm whitespace-nowrap">
      {{ formatPriceCHF(component.price) }}
    </td>
    <td class="py-4 px-3 sm:px-4 align-top">
      <div class="flex flex-wrap gap-2 justify-end">
        <AffiliateBadge
          v-for="r in retailers"
          :key="r.id"
          :retailer="r"
          :component="component"
          :config-slug="configSlug"
        />
      </div>
    </td>
  </tr>

  <!-- Spec details row, expanded inline. -->
  <tr v-if="expanded && hasSpecs" :id="`specs-${component.id}`" class="bg-bg-900/60 border-b border-border-subtle/60">
    <td colspan="4" class="px-3 sm:px-6 py-4">
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <div
          v-for="[key, value] in specsEntries"
          :key="key"
          class="text-xs"
        >
          <div class="text-text-muted uppercase tracking-wide">
            {{ specKeyLabels[key] || key }}
          </div>
          <div class="text-text-primary font-mono mt-0.5 break-words">
            {{ formatSpecValue(value) }}
          </div>
        </div>
      </div>
    </td>
  </tr>
</template>
